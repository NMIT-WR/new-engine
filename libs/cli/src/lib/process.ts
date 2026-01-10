import { type ChildProcess, type SpawnOptions, spawn } from "node:child_process"
import path from "node:path"
import { Effect } from "effect"
import { getRepoRoot } from "./paths"

export type RunOptions = {
  cwd?: string
  stdin?: string
  sensitive?: boolean
  timeoutMs?: number
  maxStdoutBytes?: number
}

type CleanupHandlers = {
  onClose?: (code: number | null, signal: NodeJS.Signals | null) => void
  onError?: (error: Error) => void
  onData?: (chunk: Buffer) => void
}

class ProcessRunError extends Error {
  readonly sensitive: boolean

  constructor(message: string, sensitive: boolean, cause?: unknown) {
    super(message, cause === undefined ? undefined : { cause })
    this.name = "ProcessRunError"
    this.sensitive = sensitive
  }
}

const safeArgRegex = /^[a-zA-Z0-9_/:=.,@+-]+$/
const DEFAULT_MAX_STDOUT_BYTES = 1024 * 1024

const resolveStdoutLimit = (maxStdoutBytes?: number) => {
  if (maxStdoutBytes === undefined) {
    return DEFAULT_MAX_STDOUT_BYTES
  }
  return maxStdoutBytes > 0 ? maxStdoutBytes : Number.POSITIVE_INFINITY
}

const createStdoutLimiter = (maxStdoutBytes?: number) => {
  const limit = resolveStdoutLimit(maxStdoutBytes)
  const buffers: Buffer[] = []
  let totalBytes = 0
  const addChunk = (chunk: Buffer) => {
    totalBytes += chunk.length
    if (totalBytes > limit) {
      return false
    }
    buffers.push(chunk)
    return true
  }
  const getOutput = () => Buffer.concat(buffers).toString()
  return { addChunk, getOutput, limit }
}

const getExitError = (
  command: string,
  code: number | null,
  signal: NodeJS.Signals | null,
  sensitive: boolean
) => {
  if (signal) {
    return new ProcessRunError(
      `${command} terminated by signal ${signal}`,
      sensitive
    )
  }
  if (code === 0) {
    return null
  }
  return new ProcessRunError(`${command} exited with code ${code}`, sensitive)
}

const toSpawnError = (error: unknown, sensitive: boolean) =>
  new ProcessRunError(
    error instanceof Error ? error.message : "Failed to spawn process",
    sensitive,
    error
  )

const quoteArg = (arg: string) => {
  if (arg.length === 0) {
    return "''"
  }
  if (safeArgRegex.test(arg)) {
    return arg
  }
  return `'${arg.replace(/'/g, `'\\''`)}'`
}

const formatCommand = (
  command: string,
  args: readonly string[],
  redacted: boolean
) => {
  if (redacted) {
    return "[redacted]"
  }
  const quotedArgs = args.map(quoteArg)
  const suffix = quotedArgs.length > 0 ? ` ${quotedArgs.join(" ")}` : ""
  const label = process.platform === "win32" ? "POSIX: " : ""
  return `${label}${quoteArg(command)}${suffix}`
}

const cleanupChild = (
  child: ChildProcess,
  interrupted: { value: boolean },
  handlers: CleanupHandlers,
  { kill, killGroup }: { kill: boolean; killGroup?: boolean }
) => {
  if (interrupted.value) {
    return
  }
  interrupted.value = true
  if (handlers.onData && child.stdout) {
    child.stdout.removeListener("data", handlers.onData)
  }
  if (handlers.onError) {
    child.removeListener("error", handlers.onError)
  }
  if (handlers.onClose) {
    child.removeListener("close", handlers.onClose)
  }
  child.stdin?.destroy()
  if (kill && child.exitCode === null && !child.killed) {
    const canKillGroup =
      killGroup && process.platform !== "win32" && typeof child.pid === "number"
    if (canKillGroup) {
      try {
        process.kill(-child.pid)
        return
      } catch {
        // Ignore group-kill failures and fall back to direct kill.
      }
    }
    try {
      child.kill()
    } catch {
      // Ignore kill failures during cleanup.
    }
  }
}

type CaptureResume = (effect: Effect.Effect<string, Error>) => void

type CaptureContext = {
  command: string
  sensitive: boolean
  child: ChildProcess
  interrupted: { value: boolean }
  handlers: CleanupHandlers
  resume: CaptureResume
  clearTimer: () => void
  detached: boolean
}

const scheduleTimeout = (
  timeoutMs: number | undefined,
  onTimeout: () => void
) => {
  if (timeoutMs === undefined || timeoutMs <= 0) {
    return null
  }
  return setTimeout(onTimeout, timeoutMs)
}

const finalizeCapture = (
  context: CaptureContext,
  effect: Effect.Effect<string, Error>,
  { kill }: { kill: boolean }
) => {
  if (context.interrupted.value) {
    return
  }
  context.clearTimer()
  cleanupChild(context.child, context.interrupted, context.handlers, {
    kill,
    killGroup: context.detached,
  })
  context.resume(effect)
}

const createCloseHandler =
  (context: CaptureContext, getOutput: () => string) =>
  (code: number | null, signal: NodeJS.Signals | null) => {
    const exitError = getExitError(
      context.command,
      code,
      signal,
      context.sensitive
    )
    if (exitError) {
      finalizeCapture(context, Effect.fail(exitError), { kill: false })
      return
    }
    finalizeCapture(context, Effect.succeed(getOutput()), { kill: false })
  }

const createErrorHandler = (context: CaptureContext) => (error: Error) => {
  finalizeCapture(
    context,
    Effect.fail(new ProcessRunError(error.message, context.sensitive, error)),
    { kill: false }
  )
}

const createDataHandler =
  (context: CaptureContext, limiter: ReturnType<typeof createStdoutLimiter>) =>
  (chunk: Buffer) => {
    if (!limiter.addChunk(chunk)) {
      finalizeCapture(
        context,
        Effect.fail(
          new ProcessRunError(
            `${context.command} stdout exceeded ${limiter.limit} bytes`,
            context.sensitive
          )
        ),
        { kill: true }
      )
    }
  }

const startRunCapture = (
  command: string,
  args: readonly string[],
  options: RunOptions,
  resume: CaptureResume
) => {
  const { cwd, stdin, sensitive, timeoutMs, maxStdoutBytes } = options
  const interrupted = { value: false }
  const stdio: SpawnOptions["stdio"] = [
    stdin === undefined ? "ignore" : "pipe",
    "pipe",
    "inherit",
  ]
  const detached = process.platform !== "win32"
  let child: ChildProcess
  try {
    child = spawn(command, args, {
      stdio,
      env: process.env,
      cwd,
      detached,
    })
  } catch (error) {
    resume(Effect.fail(toSpawnError(error, sensitive ?? false)))
    return
  }
  const handlers: CleanupHandlers = {}
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  const clearTimer = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }
  const context: CaptureContext = {
    command,
    sensitive: sensitive ?? false,
    child,
    interrupted,
    handlers,
    resume,
    clearTimer,
    detached,
  }
  const limiter = createStdoutLimiter(maxStdoutBytes)
  const onClose = createCloseHandler(context, limiter.getOutput)
  const onError = createErrorHandler(context)
  const onData = createDataHandler(context, limiter)
  handlers.onClose = onClose
  handlers.onError = onError
  handlers.onData = onData
  child.stdout?.on("data", onData)
  child.on("error", onError)
  child.on("close", onClose)
  timeoutId = scheduleTimeout(timeoutMs, () => {
    finalizeCapture(
      context,
      Effect.fail(
        new ProcessRunError(
          `${command} timed out after ${timeoutMs}ms`,
          sensitive ?? false
        )
      ),
      { kill: true }
    )
  })
  if (stdin !== undefined) {
    child.stdin?.write(stdin)
    child.stdin?.end()
  }
  return Effect.sync(() => {
    clearTimer()
    cleanupChild(child, interrupted, handlers, {
      kill: true,
      killGroup: detached,
    })
  })
}

const logCommand = (
  command: string,
  args: readonly string[],
  sensitive = false
) =>
  Effect.sync(() => {
    const output = formatCommand(command, args, sensitive)
    process.stderr.write(`> ${output}\n`)
  })

export const run = (
  command: string,
  args: readonly string[],
  options: RunOptions = {}
) =>
  Effect.gen(function* () {
    const { cwd, stdin, sensitive, timeoutMs } = options
    yield* logCommand(command, args, sensitive)
    yield* Effect.async<void, Error>((resume) => {
      const interrupted = { value: false }
      const stdio: SpawnOptions["stdio"] =
        stdin === undefined ? "inherit" : ["pipe", "inherit", "inherit"]
      const detached = process.platform !== "win32"
      let child: ChildProcess
      try {
        child = spawn(command, args, {
          stdio,
          env: process.env,
          cwd,
          detached,
        })
      } catch (error) {
        resume(Effect.fail(toSpawnError(error, sensitive ?? false)))
        return
      }
      const handlers: CleanupHandlers = {}
      let timeoutId: ReturnType<typeof setTimeout> | null = null
      const clearTimer = () => {
        if (timeoutId !== null) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
      }
      const onClose = (code: number | null, signal: NodeJS.Signals | null) => {
        if (interrupted.value) {
          return
        }
        clearTimer()
        cleanupChild(child, interrupted, handlers, { kill: false })
        const exitError = getExitError(
          command,
          code,
          signal,
          sensitive ?? false
        )
        if (exitError) {
          resume(Effect.fail(exitError))
        } else {
          resume(Effect.succeed(undefined))
        }
      }
      const onError = (error: Error) => {
        if (interrupted.value) {
          return
        }
        clearTimer()
        cleanupChild(child, interrupted, handlers, { kill: false })
        resume(
          Effect.fail(
            new ProcessRunError(error.message, sensitive ?? false, error)
          )
        )
      }
      handlers.onClose = onClose
      handlers.onError = onError
      child.on("error", onError)
      child.on("close", onClose)
      if (timeoutMs !== undefined && timeoutMs > 0) {
        timeoutId = setTimeout(() => {
          if (interrupted.value) {
            return
          }
          cleanupChild(child, interrupted, handlers, {
            kill: true,
            killGroup: detached,
          })
          resume(
            Effect.fail(
              new ProcessRunError(
                `${command} timed out after ${timeoutMs}ms`,
                sensitive ?? false
              )
            )
          )
        }, timeoutMs)
      }
      if (stdin !== undefined) {
        child.stdin?.write(stdin)
        child.stdin?.end()
      }
      return Effect.sync(() => {
        clearTimer()
        cleanupChild(child, interrupted, handlers, {
          kill: true,
          killGroup: detached,
        })
      })
    })
  })

export const runIgnore = (
  command: string,
  args: readonly string[],
  options?: RunOptions
) =>
  run(command, args, options).pipe(
    Effect.catchAll((error) =>
      Effect.sync(() => {
        const shouldRedact =
          options?.sensitive ||
          (error instanceof ProcessRunError && error.sensitive)
        let message = "error (redacted)"
        if (!shouldRedact) {
          message = error instanceof Error ? error.message : String(error)
        }
        const commandLabel = formatCommand(command, args, shouldRedact)
        process.stderr.write(`! ${commandLabel}: ${message} (ignored)\n`)
      })
    )
  )

export const runCapture = (
  command: string,
  args: readonly string[],
  options: RunOptions = {}
) =>
  Effect.gen(function* () {
    const { sensitive } = options
    yield* logCommand(command, args, sensitive)
    return yield* Effect.async<string, Error>((resume) =>
      startRunCapture(command, args, options, resume)
    )
  })

export const runPnpmEnv = (
  commandArgs: readonly string[],
  { interactive = false }: { interactive?: boolean } = {}
) =>
  Effect.gen(function* () {
    const repoRoot = path.resolve(yield* getRepoRoot())
    if (commandArgs.length === 0) {
      return yield* Effect.fail(new Error("Missing pnpm-env command args."))
    }
    const invalidArg = commandArgs.find(
      (arg) => arg.length === 0 || arg.includes("\0")
    )
    if (invalidArg !== undefined) {
      return yield* Effect.fail(new Error("Invalid pnpm-env command arg."))
    }
    const imageId = yield* runCapture(
      "docker",
      ["image", "ls", "-q", "pnpm-env"],
      { cwd: repoRoot }
    )
    const imageExists = imageId.trim().length > 0
    if (!imageExists) {
      yield* run(
        "docker",
        [
          "build",
          "-f",
          "docker/development/pnpm/Dockerfile",
          "-t",
          "pnpm-env",
          ".",
        ],
        { cwd: repoRoot }
      )
    }
    const mountSource =
      process.platform === "win32" ? repoRoot.replace(/\\/g, "/") : repoRoot
    const mountSourceValue = mountSource.includes(" ")
      ? mountSource.replace(/ /g, "\\ ")
      : mountSource
    const dockerArgs = [
      "run",
      "--rm",
      ...(interactive ? ["-it"] : []),
      "--mount",
      `type=bind,source=${mountSourceValue},target=/var/www`,
      "-w",
      "/var/www",
      "pnpm-env",
      ...commandArgs,
    ]
    yield* run("docker", dockerArgs, { cwd: repoRoot })
  })
