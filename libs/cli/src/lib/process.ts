import { Effect } from "effect";
import { spawn } from "node:child_process";
import path from "node:path";
import { getRepoRoot } from "./paths";

export type RunOptions = {
  cwd?: string;
  stdin?: string;
};

const logCommand = (command: string, args: readonly string[]) =>
  Effect.sync(() => {
    process.stdout.write(`> ${command} ${args.join(" ")}\n`);
  });

export const run = (
  command: string,
  args: readonly string[],
  options: RunOptions = {},
) =>
  Effect.gen(function* () {
    const { cwd, stdin } = options;
    yield* logCommand(command, args);
    yield* Effect.async((resume) => {
      const stdio =
        stdin === undefined ? "inherit" : (["pipe", "inherit", "inherit"] as const);
      const child = spawn(command, args, {
        stdio,
        env: process.env,
        cwd,
      });
      if (stdin !== undefined) {
        child.stdin?.write(stdin);
        child.stdin?.end();
      }
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
  options?: RunOptions,
) =>
  run(command, args, options).pipe(
    Effect.catchAll((error) =>
      Effect.sync(() => {
        process.stderr.write(`! ${error.message} (ignored)\n`);
      }),
    ),
  );

export const runCapture = (
  command: string,
  args: readonly string[],
  options: RunOptions = {},
) =>
  Effect.gen(function* () {
    const { cwd, stdin } = options;
    yield* logCommand(command, args);
    return yield* Effect.async<string>((resume) => {
      const stdio: readonly ["pipe" | "ignore", "pipe", "inherit"] = [
        stdin === undefined ? "ignore" : "pipe",
        "pipe",
        "inherit",
      ];
      const child = spawn(command, args, {
        stdio,
        env: process.env,
        cwd,
      });
      if (stdin !== undefined) {
        child.stdin?.write(stdin);
        child.stdin?.end();
      }
      let output = "";
      child.stdout?.on("data", (chunk) => {
        output += chunk.toString();
      });
      child.on("error", (error) => resume(Effect.fail(error)));
      child.on("close", (code) => {
        if (code === 0) {
          resume(Effect.succeed(output));
        } else {
          resume(Effect.fail(new Error(`${command} exited with code ${code}`)));
        }
      });
    });
  });

export const runPnpmEnv = (
  commandArgs: readonly string[],
  { interactive = false }: { interactive?: boolean } = {},
) =>
  Effect.gen(function* () {
    const repoRoot = path.resolve(yield* getRepoRoot());
    if (commandArgs.length === 0) {
      yield* Effect.fail(new Error("Missing pnpm-env command args."));
    }
    const invalidArg = commandArgs.find(
      (arg) => arg.length === 0 || arg.includes("\0"),
    );
    if (invalidArg !== undefined) {
      yield* Effect.fail(new Error("Invalid pnpm-env command arg."));
    }
    const imageId = yield* runCapture(
      "docker",
      ["image", "ls", "-q", "pnpm-env"],
      { cwd: repoRoot },
    );
    const imageExists = imageId.trim().length > 0;
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
        { cwd: repoRoot },
      );
    }
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
