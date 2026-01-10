import { Effect } from "effect";
import { spawn } from "node:child_process";
import { getRepoRoot } from "./paths";

const logCommand = (command: string, args: readonly string[]) =>
  Effect.sync(() => {
    process.stdout.write(`> ${command} ${args.join(" ")}\n`);
  });

export const run = (
  command: string,
  args: readonly string[],
  options: Record<string, unknown> = {},
) =>
  Effect.gen(function* () {
    yield* logCommand(command, args);
    yield* Effect.async((resume) => {
      const child = spawn(command, args, {
        stdio: "inherit",
        env: process.env,
        ...options,
      });
      child.on("error", (error) => resume(Effect.fail(error)));
      child.on("close", (code) => {
        if (code === 0) {
          resume(Effect.succeed(undefined));
        } else {
          resume(Effect.fail(new Error(`${command} exited with code ${code}`)));
        }
      });
    });
  });

export const runIgnore = (
  command: string,
  args: readonly string[],
  options?: Record<string, unknown>,
) =>
  run(command, args, options).pipe(
    Effect.catchAll((error) =>
      Effect.sync(() => {
        process.stderr.write(`! ${error.message} (ignored)\n`);
      }),
    ),
  );

export const runPnpmEnv = (
  commandArgs: readonly string[],
  { interactive = false }: { interactive?: boolean } = {},
) =>
  Effect.gen(function* () {
    const repoRoot = yield* getRepoRoot();
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
      { cwd: repoRoot },
    );
    const dockerArgs = [
      "run",
      ...(interactive ? ["-it"] : []),
      "-v",
      `${repoRoot}:/var/www`,
      "pnpm-env",
      ...commandArgs,
    ];
    yield* run("docker", dockerArgs, { cwd: repoRoot });
  });
