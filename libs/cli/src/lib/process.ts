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
      let interrupted = false;
      const stdio =
        stdin === undefined ? "inherit" : (["pipe", "inherit", "inherit"] as const);
      const child = spawn(command, args, {
        stdio,
        env: process.env,
        cwd,
      });
      const onClose = (code: number | null) => {
        if (interrupted) {
          return;
        }
        interrupted = true;
        child.removeListener("error", onError);
        child.removeListener("close", onClose);
        child.stdin?.destroy();
        if (code === 0) {
          resume(Effect.succeed(undefined));
        } else {
          resume(Effect.fail(new Error(`${command} exited with code ${code}`)));
        }
      };
      const onError = (error: Error) => {
        if (interrupted) {
          return;
        }
        interrupted = true;
        child.removeListener("error", onError);
        child.removeListener("close", onClose);
        child.stdin?.destroy();
        resume(Effect.fail(error));
      };
      if (stdin !== undefined) {
        child.stdin?.write(stdin);
        child.stdin?.end();
      }
      child.on("error", onError);
      child.on("close", onClose);
      return () => {
        if (interrupted) {
          return;
        }
        interrupted = true;
        child.removeListener("error", onError);
        child.removeListener("close", onClose);
        child.stdin?.destroy();
        if (child.exitCode === null && !child.killed) {
          child.kill();
        }
      };
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
      let interrupted = false;
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
      const onData = (chunk: Buffer) => {
        output += chunk.toString();
      };
      const onClose = (code: number | null) => {
        if (interrupted) {
          return;
        }
        interrupted = true;
        child.stdout?.removeListener("data", onData);
        child.removeListener("error", onError);
        child.removeListener("close", onClose);
        child.stdin?.destroy();
        if (code === 0) {
          resume(Effect.succeed(output));
        } else {
          resume(Effect.fail(new Error(`${command} exited with code ${code}`)));
        }
      };
      const onError = (error: Error) => {
        if (interrupted) {
          return;
        }
        interrupted = true;
        child.stdout?.removeListener("data", onData);
        child.removeListener("error", onError);
        child.removeListener("close", onClose);
        child.stdin?.destroy();
        resume(Effect.fail(error));
      };
      child.stdout?.on("data", onData);
      child.on("error", onError);
      child.on("close", onClose);
      return () => {
        if (interrupted) {
          return;
        }
        interrupted = true;
        child.stdout?.removeListener("data", onData);
        child.removeListener("error", onError);
        child.removeListener("close", onClose);
        child.stdin?.destroy();
        if (child.exitCode === null && !child.killed) {
          child.kill();
        }
      };
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
