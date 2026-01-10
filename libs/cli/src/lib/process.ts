import { type ChildProcess, type SpawnOptions, spawn } from "node:child_process"
import path from "node:path"
import { Effect } from "effect"
import { getRepoRoot } from "./paths"

export type RunOptions = {
  cwd?: string
  stdin?: string
  sensitive?: boolean
}

type CleanupHandlers = {
  onClose?: (code: number | null) => void
  onError?: (error: Error) => void
  onData?: (chunk: Buffer) => void
}

const cleanupChild = (
  child: ChildProcess,
  interrupted: { value: boolean },
  handlers: CleanupHandlers,
  { kill }: { kill: boolean }
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
    child.kill()
  }
}

const logCommand = (
  command: string,
  args: readonly string[],
  sensitive = false
) =>
  Effect.sync(() => {
    if (sensitive) {
      process.stdout.write(`> ${command} [redacted]\n`)
      return
    }
    process.stdout.write(`> ${command} ${args.join(" ")}\n`)
  })

export const run = (
  command: string,
  args: readonly string[],
  options: RunOptions = {}
) =>
  Effect.gen(function* () {
    const { cwd, stdin, sensitive } = options
    yield* logCommand(command, args, sensitive)
    yield* Effect.async<void, Error>((resume) => {
      const interrupted = { value: false }
      const stdio: SpawnOptions["stdio"] =
        stdin === undefined ? "inherit" : ["pipe", "inherit", "inherit"]
      const child = spawn(command, args, {
        stdio,
        env: process.env,
        cwd,
      })
      const handlers: CleanupHandlers = {}
      const onClose = (code: number | null) => {
        if (interrupted.value) {
          return
        }
        cleanupChild(child, interrupted, handlers, { kill: false })
        if (code === 0) {
          resume(Effect.succeed(undefined))
        } else {
          resume(Effect.fail(new Error(`${command} exited with code ${code}`)))
        }
      }
      const onError = (error: Error) => {
        if (interrupted.value) {
          return
        }
        cleanupChild(child, interrupted, handlers, { kill: false })
        resume(Effect.fail(error))
      }
      handlers.onClose = onClose
      handlers.onError = onError
      child.on("error", onError)
      child.on("close", onClose)
      if (stdin !== undefined) {
        child.stdin?.write(stdin)
        child.stdin?.end()
      }
      return Effect.sync(() => {
        cleanupChild(child, interrupted, handlers, { kill: true })
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
        const message = error instanceof Error ? error.message : String(error)
        process.stderr.write(`! ${message} (ignored)\n`)
      })
    )
  )

export const runCapture = (
  command: string,
  args: readonly string[],
  options: RunOptions = {}
) =>
  Effect.gen(function* () {
    const { cwd, stdin, sensitive } = options
    yield* logCommand(command, args, sensitive)
    return yield* Effect.async<string, Error>((resume) => {
      const interrupted = { value: false }
      const stdio: SpawnOptions["stdio"] = [
        stdin === undefined ? "ignore" : "pipe",
        "pipe",
        "inherit",
      ]
      const child = spawn(command, args, {
        stdio,
        env: process.env,
        cwd,
      })
      let output = ""
      const handlers: CleanupHandlers = {}
      const onData = (chunk: Buffer) => {
        output += chunk.toString()
      }
      const onClose = (code: number | null) => {
        if (interrupted.value) {
          return
        }
        cleanupChild(child, interrupted, handlers, { kill: false })
        if (code === 0) {
          resume(Effect.succeed(output))
        } else {
          resume(Effect.fail(new Error(`${command} exited with code ${code}`)))
        }
      }
      const onError = (error: Error) => {
        if (interrupted.value) {
          return
        }
        cleanupChild(child, interrupted, handlers, { kill: false })
        resume(Effect.fail(error))
      }
      handlers.onClose = onClose
      handlers.onError = onError
      handlers.onData = onData
      child.stdout?.on("data", onData)
      child.on("error", onError)
      child.on("close", onClose)
      if (stdin !== undefined) {
        child.stdin?.write(stdin)
        child.stdin?.end()
      }
      return Effect.sync(() => {
        cleanupChild(child, interrupted, handlers, { kill: true })
      })
    })
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
    const dockerArgs = [
      "run",
      "--rm",
      ...(interactive ? ["-it"] : []),
      "-v",
      `${repoRoot}:/var/www`,
      "pnpm-env",
      ...commandArgs,
    ]
    yield* run("docker", dockerArgs, { cwd: repoRoot })
  })
