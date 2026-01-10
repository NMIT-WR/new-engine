import { type ChildProcess, type SpawnOptions, spawn } from "node:child_process"
import path from "node:path"
import { Effect } from "effect"
import { getRepoRoot } from "./paths"

export type RunOptions = {
  /**
   * Working directory for the spawned process.
   */
  cwd?: string
  /**
   * Optional stdin payload to write before closing.
   */
  stdin?: string
  /**
   * When true, redacts command details in logs/errors.
   */
  sensitive?: boolean
  /**
   * Milliseconds before the process is treated as timed out.
   */
  timeoutMs?: number
  /**
   * Environment variable overrides merged into process.env for the child.
   */
  env?: NodeJS.ProcessEnv
  /**
   * Maximum stdout bytes to buffer in runCapture. Values <= 0 disable the limit.
   */
  maxStdoutBytes?: number
  /**
   * When true (POSIX only), spawn in a new process group and attempt to kill it
   * on cancellation/timeout.
   */
  killGroup?: boolean
}

type CleanupHandlers = {
  onClose?: (code: number | null, signal: NodeJS.Signals | null) => void
  onError?: (error: Error) => void
  onData?: (chunk: Buffer) => void
  onStdinError?: (error: Error) => void
}

export class ProcessRunError extends Error {
  readonly sensitive: boolean

  constructor(message: string, sensitive: boolean, cause?: unknown) {
    super(message, cause === undefined ? undefined : { cause })
    this.name = "ProcessRunError"
    this.sensitive = sensitive
  }
}

// Characters safe to pass unquoted in POSIX shells: letters, digits, _, /, :, =, ., ,, @, +, -.
const safeArgRegex = /^[a-zA-Z0-9_/:=.,@+-]+$/
const windowsDriveRegex = /^[a-zA-Z]/
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
  commandLabel: string,
  code: number | null,
  signal: NodeJS.Signals | null,
  sensitive: boolean
) => {
  if (signal) {
    return new ProcessRunError(
      `${commandLabel} terminated by signal ${signal}`,
      sensitive
    )
  }
  if (code === 0) {
    return null
  }
  if (code === null) {
    return new ProcessRunError(
      `${commandLabel} exited without a code or signal`,
      sensitive
    )
  }
  return new ProcessRunError(
    `${commandLabel} exited with code ${code}`,
    sensitive
  )
}

const toSpawnError = (error: unknown, sensitive: boolean) =>
  new ProcessRunError(
    error instanceof Error ? error.message : "Failed to spawn process",
    sensitive,
    error
  )

/**
 * POSIX-style quoting for display-only command labels.
 * Execution uses argv arrays passed to spawn.
 */
const quoteArgPosix = (arg: string) => {
  if (arg.length === 0) {
    return "''"
  }
  if (safeArgRegex.test(arg)) {
    return arg
  }
  return `'${arg.replace(/'/g, `'\\''`)}'`
}

/**
 * POSIX-style display formatting for logs/errors (not used for execution).
 */
const formatCommandPosix = (
  command: string,
  args: readonly string[],
  redacted: boolean
) => {
  if (redacted) {
    return "[redacted]"
  }
  const quotedArgs = args.map(quoteArgPosix)
  const suffix = quotedArgs.length > 0 ? ` ${quotedArgs.join(" ")}` : ""
  return `${quoteArgPosix(command)}${suffix}`
}

const removeProcessHandlers = (
  child: ChildProcess,
  handlers: CleanupHandlers
) => {
  if (handlers.onData && child.stdout) {
    child.stdout.removeListener("data", handlers.onData)
  }
  if (handlers.onError) {
    child.removeListener("error", handlers.onError)
  }
  if (handlers.onClose) {
    child.removeListener("close", handlers.onClose)
  }
  if (handlers.onStdinError && child.stdin) {
    child.stdin.removeListener("error", handlers.onStdinError)
  }
}

const scheduleGroupKill = (child: ChildProcess, pid: number) => {
  // Give the process group a chance to exit before forcing SIGKILL.
  const killTimer = setTimeout(() => {
    try {
      process.kill(-pid, "SIGKILL")
    } catch {
      // Ignore group-kill failures during cleanup.
    }
  }, 500)
  child.once("exit", () => clearTimeout(killTimer))
}

const trySignalProcessGroup = (child: ChildProcess, pid: number) => {
  try {
    process.kill(-pid, "SIGTERM")
    scheduleGroupKill(child, pid)
    return true
  } catch {
    return false
  }
}

const killChildProcess = (child: ChildProcess) => {
  try {
    child.kill()
  } catch {
    // Ignore kill failures during cleanup.
  }
}

const terminateChild = (child: ChildProcess, killGroup?: boolean) => {
  const canKillGroup =
    killGroup && process.platform !== "win32" && typeof child.pid === "number"
  if (canKillGroup && trySignalProcessGroup(child, child.pid)) {
    return
  }
  killChildProcess(child)
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
  removeProcessHandlers(child, handlers)
  child.stdin?.destroy()
  if (kill && child.exitCode === null && !child.killed) {
    terminateChild(child, killGroup)
  }
}

type CaptureResume = (effect: Effect.Effect<string, Error>) => void

type ProcessContext = {
  command: string
  commandLabel: string
  sensitive: boolean
  child: ChildProcess
  interrupted: { value: boolean }
  handlers: CleanupHandlers
  clearTimer: () => void
  detached: boolean
}

type ProcessHooks = {
  onClose: (
    context: ProcessContext,
    code: number | null,
    signal: NodeJS.Signals | null
  ) => void
  onError: (context: ProcessContext, error: Error) => void
  onTimeout: (context: ProcessContext) => void
  onData?: (context: ProcessContext, chunk: Buffer) => void
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
  context: ProcessContext,
  resume: CaptureResume,
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
  resume(effect)
}

const createCloseHandler =
  (resume: CaptureResume, getOutput: () => string) =>
  (
    context: ProcessContext,
    code: number | null,
    signal: NodeJS.Signals | null
  ) => {
    const exitError = getExitError(
      context.commandLabel,
      code,
      signal,
      context.sensitive
    )
    if (exitError) {
      finalizeCapture(context, resume, Effect.fail(exitError), { kill: false })
      return
    }
    finalizeCapture(context, resume, Effect.succeed(getOutput()), {
      kill: false,
    })
  }

const createErrorHandler =
  (resume: CaptureResume) => (context: ProcessContext, error: Error) => {
    finalizeCapture(
      context,
      resume,
      Effect.fail(new ProcessRunError(error.message, context.sensitive, error)),
      { kill: false }
    )
  }

const createDataHandler =
  (resume: CaptureResume, limiter: ReturnType<typeof createStdoutLimiter>) =>
  (context: ProcessContext, chunk: Buffer) => {
    if (!limiter.addChunk(chunk)) {
      finalizeCapture(
        context,
        resume,
        Effect.fail(
          new ProcessRunError(
            `${context.commandLabel} stdout exceeded ${limiter.limit} bytes`,
            context.sensitive
          )
        ),
        { kill: true }
      )
    }
  }

type ProcessStartConfig<T> = {
  command: string
  args: readonly string[]
  options: RunOptions
  stdio: SpawnOptions["stdio"]
  resume: (effect: Effect.Effect<T, Error>) => void
  hooks: ProcessHooks
}

const startProcess = <T>({
  command,
  args,
  options,
  stdio,
  resume,
  hooks,
}: ProcessStartConfig<T>) => {
  const {
    cwd,
    stdin,
    sensitive,
    timeoutMs,
    killGroup,
    env: envOverrides,
  } = options
  const isSensitive = sensitive ?? false
  const interrupted = { value: false }
  // Windows doesn't support POSIX process groups, so killGroup is ignored there.
  const detached = killGroup === true && process.platform !== "win32"
  const env =
    envOverrides === undefined
      ? process.env
      : { ...process.env, ...envOverrides }
  let child: ChildProcess
  try {
    child = spawn(command, args, {
      stdio,
      env,
      cwd,
      detached,
    })
  } catch (error) {
    resume(Effect.fail(toSpawnError(error, sensitive ?? false)))
    return null
  }
  const handlers: CleanupHandlers = {}
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  const clearTimer = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }
  const context: ProcessContext = {
    command,
    commandLabel: formatCommandPosix(command, args, isSensitive),
    sensitive: isSensitive,
    child,
    interrupted,
    handlers,
    clearTimer,
    detached,
  }
  const onClose = (code: number | null, signal: NodeJS.Signals | null) =>
    hooks.onClose(context, code, signal)
  const onError = (error: Error) => hooks.onError(context, error)
  handlers.onClose = onClose
  handlers.onError = onError
  child.on("error", onError)
  child.on("close", onClose)
  const onDataHandler = hooks.onData
  if (onDataHandler && child.stdout) {
    const onData = (chunk: Buffer) => onDataHandler(context, chunk)
    handlers.onData = onData
    child.stdout.on("data", onData)
  }
  timeoutId = scheduleTimeout(timeoutMs, () => hooks.onTimeout(context))
  if (stdin !== undefined && child.stdin) {
    const onStdinError = (error: Error) => hooks.onError(context, error)
    handlers.onStdinError = onStdinError
    child.stdin.on("error", onStdinError)
    child.stdin.end(stdin)
  }
  return context
}

const startRunCapture = (
  command: string,
  args: readonly string[],
  options: RunOptions,
  resume: CaptureResume
) => {
  const { stdin, timeoutMs, maxStdoutBytes } = options
  const stdio: SpawnOptions["stdio"] = [
    stdin === undefined ? "ignore" : "pipe",
    "pipe",
    "inherit",
  ]
  const limiter = createStdoutLimiter(maxStdoutBytes)
  const context = startProcess({
    command,
    args,
    options,
    stdio,
    resume,
    hooks: {
      onClose: createCloseHandler(resume, limiter.getOutput),
      onError: createErrorHandler(resume),
      onData: createDataHandler(resume, limiter),
      onTimeout: (captureContext) => {
        finalizeCapture(
          captureContext,
          resume,
          Effect.fail(
            new ProcessRunError(
              `${captureContext.commandLabel} timed out after ${timeoutMs ?? 0}ms`,
              captureContext.sensitive
            )
          ),
          { kill: true }
        )
      },
    },
  })
  if (!context) {
    return
  }
  return Effect.sync(() => {
    context.clearTimer()
    cleanupChild(context.child, context.interrupted, context.handlers, {
      kill: true,
      killGroup: context.detached,
    })
  })
}

const logCommand = (
  command: string,
  args: readonly string[],
  sensitive = false
) =>
  Effect.sync(() => {
    const output = formatCommandPosix(command, args, sensitive)
    process.stderr.write(`> ${output}\n`)
  })

export const run = (
  command: string,
  args: readonly string[],
  options: RunOptions = {}
) =>
  Effect.gen(function* () {
    const { stdin, sensitive, timeoutMs } = options
    yield* logCommand(command, args, sensitive)
    yield* Effect.async<void, Error>((resume) => {
      const stdio: SpawnOptions["stdio"] =
        stdin === undefined ? "inherit" : ["pipe", "inherit", "inherit"]
      const context = startProcess({
        command,
        args,
        options,
        stdio,
        resume,
        hooks: {
          onClose: (runContext, code, signal) => {
            if (runContext.interrupted.value) {
              return
            }
            runContext.clearTimer()
            cleanupChild(
              runContext.child,
              runContext.interrupted,
              runContext.handlers,
              { kill: false }
            )
            const exitError = getExitError(
              runContext.commandLabel,
              code,
              signal,
              runContext.sensitive
            )
            if (exitError) {
              resume(Effect.fail(exitError))
            } else {
              resume(Effect.succeed(undefined))
            }
          },
          onError: (runContext, error) => {
            if (runContext.interrupted.value) {
              return
            }
            runContext.clearTimer()
            cleanupChild(
              runContext.child,
              runContext.interrupted,
              runContext.handlers,
              { kill: false }
            )
            resume(
              Effect.fail(
                new ProcessRunError(error.message, runContext.sensitive, error)
              )
            )
          },
          onTimeout: (runContext) => {
            if (runContext.interrupted.value) {
              return
            }
            runContext.clearTimer()
            cleanupChild(
              runContext.child,
              runContext.interrupted,
              runContext.handlers,
              { kill: true, killGroup: runContext.detached }
            )
            resume(
              Effect.fail(
                new ProcessRunError(
                  `${runContext.commandLabel} timed out after ${timeoutMs ?? 0}ms`,
                  runContext.sensitive
                )
              )
            )
          },
        },
      })
      if (!context) {
        return
      }
      return Effect.sync(() => {
        context.clearTimer()
        cleanupChild(context.child, context.interrupted, context.handlers, {
          kill: true,
          killGroup: context.detached,
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
        const commandLabel = formatCommandPosix(command, args, shouldRedact)
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

const validatePnpmEnvArgs = (commandArgs: readonly string[]) => {
  if (commandArgs.length === 0) {
    return Effect.fail(new Error("Missing pnpm-env command args."))
  }
  // Args come from CLI parsing but we still reject empty/null-byte input defensively.
  const invalidArg = commandArgs.find(
    (arg) => arg.length === 0 || arg.includes("\0")
  )
  if (invalidArg !== undefined) {
    return Effect.fail(new Error("Invalid pnpm-env command arg."))
  }
  return Effect.succeed(undefined)
}

const ensureDockerAvailable = (repoRoot: string) =>
  runCapture("docker", ["--version"], {
    cwd: repoRoot,
    maxStdoutBytes: 256,
  }).pipe(
    Effect.catchAll((error) =>
      Effect.fail(
        new Error(
          "Docker is not available. Please ensure Docker is installed and running.",
          { cause: error }
        )
      )
    )
  )

const inspectPnpmEnvImage = (repoRoot: string) =>
  runCapture(
    "docker",
    ["image", "inspect", "--format", "{{.Id}}", "pnpm-env"],
    {
      cwd: repoRoot,
      maxStdoutBytes: 256,
    }
  ).pipe(
    Effect.map(() => true),
    Effect.catchAll(() => Effect.succeed(false))
  )

const ensurePnpmEnvImage = (repoRoot: string) =>
  inspectPnpmEnvImage(repoRoot).pipe(
    Effect.flatMap((imageExists) =>
      imageExists
        ? Effect.succeed(undefined)
        : run(
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
          ).pipe(
            Effect.flatMap(() => inspectPnpmEnvImage(repoRoot)),
            Effect.flatMap((postBuildExists) =>
              postBuildExists
                ? Effect.succeed(undefined)
                : Effect.fail(
                    new Error("pnpm-env image was not created by docker build.")
                  )
            )
          )
    )
  )

const resolvePnpmEnvMountSource = (repoRoot: string) => {
  const mountSource =
    process.platform === "win32" ? repoRoot.replace(/\\/g, "/") : repoRoot
  if (mountSource.includes(",")) {
    return Effect.fail(
      new Error(
        "Repository path contains comma, which is incompatible with Docker mount syntax."
      )
    )
  }
  const colonIndex = mountSource.indexOf(":")
  const isWindowsDrive =
    process.platform === "win32" &&
    colonIndex === 1 &&
    windowsDriveRegex.test(mountSource[0] ?? "")
  if (colonIndex !== -1 && !isWindowsDrive) {
    return Effect.fail(
      new Error(
        "Repository path contains ':', which is incompatible with Docker mount syntax."
      )
    )
  }
  return Effect.succeed(mountSource)
}

export const runPnpmEnv = (
  commandArgs: readonly string[],
  { interactive = false }: { interactive?: boolean } = {}
) =>
  Effect.gen(function* () {
    const repoRoot = path.resolve(yield* getRepoRoot())
    yield* validatePnpmEnvArgs(commandArgs)
    yield* ensureDockerAvailable(repoRoot)
    // Treat inspect failures as "missing image" so we can attempt a rebuild.
    yield* ensurePnpmEnvImage(repoRoot)
    const mountSource = yield* resolvePnpmEnvMountSource(repoRoot)
    const dockerArgs = [
      "run",
      "--rm",
      ...(interactive ? ["-it"] : []),
      "--mount",
      `type=bind,source=${mountSource},target=/var/www`,
      "-w",
      "/var/www",
      "pnpm-env",
      ...commandArgs,
    ]
    yield* run("docker", dockerArgs, { cwd: repoRoot })
  })
