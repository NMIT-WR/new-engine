#!/usr/bin/env bun
import { Command } from "@effect/cli"
import { BunContext, BunRuntime } from "@effect/platform-bun"
import { Effect } from "effect"
import { commands } from "./commands"
import { cliVersion } from "./lib/version"

const root = Command.make("wr", {}, () => Effect.succeed(undefined)).pipe(
  Command.withDescription("Workspace CLI for new-engine."),
  Command.withSubcommands(commands)
)

const cli = Command.run(root, {
  name: "WR CLI",
  version: cliVersion,
})

const runCli = (argv: string[] = process.argv) => {
  const program = cli(argv).pipe(Effect.provide(BunContext.layer))
  return BunRuntime.runMain(program)
}

if (import.meta.main) {
  runCli(process.argv)
}

export { runCli }
