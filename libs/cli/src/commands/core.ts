import { Command } from "@effect/cli";
import { runPnpmEnv } from "../lib/process";

export const corepackUpdate = Command.make("corepack-update", {}, () =>
  runPnpmEnv(["corepack", "up"]),
).pipe(Command.withDescription("Update corepack inside the pnpm Docker env."));

export const install = Command.make("install", {}, () =>
  runPnpmEnv(["pnpm", "install", "--frozen-lockfile"]),
).pipe(Command.withDescription("Install dependencies in the pnpm Docker env."));

export const installFixLock = Command.make("install-fix-lock", {}, () =>
  runPnpmEnv(["pnpm", "install", "--fix-lockfile"]),
).pipe(Command.withDescription("Install dependencies and fix the lockfile."));

export const updateMedusa = Command.make("update-medusa", {}, () =>
  runPnpmEnv([
    "pnpm",
    "--filter",
    "medusa-be",
    "update",
    "@medusajs/*",
    "--latest",
  ]),
).pipe(Command.withDescription("Update @medusajs/* packages in medusa-be."));

export const update = Command.make("update", {}, () =>
  runPnpmEnv(["pnpm", "--filter", "medusa-be", "update", "--latest"]),
).pipe(Command.withDescription("Update medusa-be dependencies to latest."));

export const npkill = Command.make("npkill", {}, () =>
  runPnpmEnv(["pnpx", "npkill", "-x", "-D", "-y"], { interactive: true }),
).pipe(Command.withDescription("Run npkill inside the pnpm Docker env."));
