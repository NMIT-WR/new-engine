import { Command } from "@effect/cli"
import { runPnpmEnv } from "../lib/process"

export const biomeBe = Command.make("biome-be", {}, () =>
  runPnpmEnv(["pnpx", "biome", "check", "--write", "apps/medusa-be"])
).pipe(Command.withDescription("Run Biome check with write on medusa-be."))
