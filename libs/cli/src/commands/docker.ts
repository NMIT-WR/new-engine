import { Command } from "@effect/cli"
import { Effect } from "effect"
import { composeBase, composeProd, medusaImage } from "../lib/docker"
import { forceRecreateOption } from "../lib/options"
import { getRepoRoot } from "../lib/paths"
import { run, runCapture, runIgnore } from "../lib/process"

export const dev = Command.make(
  "dev",
  { forceRecreate: forceRecreateOption },
  ({ forceRecreate }) =>
    Effect.gen(function* () {
      const repoRoot = yield* getRepoRoot()
      const args = [
        ...composeBase,
        "up",
        "-d",
        "--build",
        ...(forceRecreate ? ["--force-recreate"] : []),
      ]
      yield* run("docker", args, { cwd: repoRoot })
    })
).pipe(Command.withDescription("Start docker compose in development mode."))

export const prod = Command.make("prod", {}, () =>
  Effect.gen(function* () {
    const repoRoot = yield* getRepoRoot()
    const buildTimeoutMs = 30 * 60 * 1000
    yield* runIgnore("docker", [...composeProd, "down"], { cwd: repoRoot })
    yield* runIgnore("docker", ["rmi", medusaImage], {
      cwd: repoRoot,
    })
    yield* run("docker", [...composeProd, "build", "--no-cache", "medusa-be"], {
      cwd: repoRoot,
      timeoutMs: buildTimeoutMs,
    })
    const imageId = yield* runCapture(
      "docker",
      ["image", "ls", "-q", medusaImage],
      { cwd: repoRoot }
    )
    if (imageId.trim().length === 0) {
      return yield* Effect.fail(
        new Error(`Medusa image build failed: ${medusaImage} not found`)
      )
    }
    yield* run("docker", [...composeProd, "up", "-d"], { cwd: repoRoot })
  })
).pipe(
  Command.withDescription("Build and start docker compose in production mode.")
)

export const down = Command.make("down", {}, () =>
  Effect.gen(function* () {
    const repoRoot = yield* getRepoRoot()
    yield* run("docker", [...composeBase, "down"], { cwd: repoRoot })
  })
).pipe(Command.withDescription("Stop docker compose services."))

export const downWithVolumes = Command.make("down-with-volumes", {}, () =>
  Effect.gen(function* () {
    const repoRoot = yield* getRepoRoot()
    yield* run("docker", [...composeBase, "down", "-v"], { cwd: repoRoot })
  })
).pipe(
  Command.withDescription("Stop docker compose services and remove volumes.")
)
