#!/usr/bin/env node
import { Command, Options } from "@effect/cli";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Effect, Option } from "effect";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageJsonPath = fileURLToPath(
  new URL("../package.json", import.meta.url),
);
const cliPackage = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const cliVersion = cliPackage?.version ?? "0.0.0";

const findRepoRoot = (startDir) => {
  let dir = path.resolve(startDir);
  while (true) {
    if (
      existsSync(path.join(dir, "pnpm-workspace.yaml")) &&
      existsSync(path.join(dir, "package.json"))
    ) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error(
        `Unable to locate repo root from "${startDir}". Expected pnpm-workspace.yaml and package.json.`,
      );
    }
    dir = parent;
  }
};

const getRepoRoot = () => Effect.sync(() => findRepoRoot(process.cwd()));

const logCommand = (command, args) =>
  Effect.sync(() => {
    process.stdout.write(`> ${command} ${args.join(" ")}\n`);
  });

const run = (command, args, options = {}) =>
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

const runIgnore = (command, args, options) =>
  run(command, args, options).pipe(
    Effect.catchAll((error) =>
      Effect.sync(() => {
        process.stderr.write(`! ${error.message} (ignored)\n`);
      }),
    ),
  );

const runPnpmEnv = (commandArgs, { interactive = false } = {}) =>
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

const composeBase = ["compose", "-f", "docker-compose.yaml", "-p", "new-engine"];
const composeProd = [
  "compose",
  "-f",
  "docker-compose.yaml",
  "-f",
  "docker-compose.prod.yaml",
  "-p",
  "new-engine",
];

const requireValue = (value, label, envName, flagName) =>
  value
    ? Effect.succeed(value)
    : Effect.fail(
        new Error(`Missing ${label}. Provide --${flagName} or set ${envName}.`),
      );

const resolveOption = (optionValue, envName, label, flagName) =>
  requireValue(
    Option.getOrElse(optionValue, () => process.env[envName]),
    label,
    envName,
    flagName,
  );

const forceRecreateOption = Options.boolean("force-recreate").pipe(
  Options.withDescription("Recreate containers even if configuration is unchanged."),
);

const emailOption = Options.text("email").pipe(
  Options.withAlias("e"),
  Options.optional,
  Options.withDescription("Email for the Medusa admin user."),
);

const passwordOption = Options.text("password").pipe(
  Options.withAlias("p"),
  Options.optional,
  Options.withDescription("Password for the Medusa admin user."),
);

const moduleOption = Options.text("module").pipe(
  Options.withAlias("m"),
  Options.optional,
  Options.withDescription("Module name to generate a migration for."),
);

const corepackUpdate = Command.make("corepack-update", {}, () =>
  runPnpmEnv(["corepack", "up"]),
).pipe(Command.withDescription("Update corepack inside the pnpm Docker env."));

const install = Command.make("install", {}, () =>
  runPnpmEnv(["pnpm", "install", "--frozen-lockfile"]),
).pipe(Command.withDescription("Install dependencies in the pnpm Docker env."));

const installFixLock = Command.make("install-fix-lock", {}, () =>
  runPnpmEnv(["pnpm", "install", "--fix-lockfile"]),
).pipe(Command.withDescription("Install dependencies and fix the lockfile."));

const updateMedusa = Command.make("update-medusa", {}, () =>
  runPnpmEnv([
    "pnpm",
    "--filter",
    "medusa-be",
    "update",
    "@medusajs/*",
    "--latest",
  ]),
).pipe(Command.withDescription("Update @medusajs/* packages in medusa-be."));

const update = Command.make("update", {}, () =>
  runPnpmEnv(["pnpm", "--filter", "medusa-be", "update", "--latest"]),
).pipe(Command.withDescription("Update medusa-be dependencies to latest."));

const npkill = Command.make("npkill", {}, () =>
  runPnpmEnv(["pnpx", "npkill", "-x", "-D", "-y"], { interactive: true }),
).pipe(Command.withDescription("Run npkill inside the pnpm Docker env."));

const dev = Command.make("dev", { forceRecreate: forceRecreateOption }, ({ forceRecreate }) =>
  Effect.gen(function* () {
    const repoRoot = yield* getRepoRoot();
    const args = [
      ...composeBase,
      "up",
      "-d",
      "--build",
      ...(forceRecreate ? ["--force-recreate"] : []),
    ];
    yield* run("docker", args, { cwd: repoRoot });
  }),
).pipe(Command.withDescription("Start docker compose in development mode."));

const prod = Command.make("prod", {}, () =>
  Effect.gen(function* () {
    const repoRoot = yield* getRepoRoot();
    yield* runIgnore("docker", [...composeProd, "down"], { cwd: repoRoot });
    yield* runIgnore("docker", ["rmi", "new-engine-medusa-be-prod"], {
      cwd: repoRoot,
    });
    yield* run(
      "docker",
      [...composeProd, "build", "--no-cache", "medusa-be"],
      { cwd: repoRoot },
    );
    yield* run("docker", [...composeProd, "up", "-d"], { cwd: repoRoot });
  }),
).pipe(Command.withDescription("Build and start docker compose in production mode."));

const down = Command.make("down", {}, () =>
  Effect.gen(function* () {
    const repoRoot = yield* getRepoRoot();
    yield* run("docker", [...composeBase, "down"], { cwd: repoRoot });
  }),
).pipe(Command.withDescription("Stop docker compose services."));

const downWithVolumes = Command.make("down-with-volumes", {}, () =>
  Effect.gen(function* () {
    const repoRoot = yield* getRepoRoot();
    yield* run("docker", [...composeBase, "down", "-v"], { cwd: repoRoot });
  }),
).pipe(Command.withDescription("Stop docker compose services and remove volumes."));

const medusaCreateUser = Command.make(
  "medusa-create-user",
  { email: emailOption, password: passwordOption },
  ({ email, password }) =>
    Effect.gen(function* () {
      const repoRoot = yield* getRepoRoot();
      const resolvedEmail = yield* resolveOption(
        email,
        "EMAIL",
        "email",
        "email",
      );
      const resolvedPassword = yield* resolveOption(
        password,
        "PASSWORD",
        "password",
        "password",
      );
      yield* run(
        "docker",
        [
          "exec",
          "wr_medusa_be",
          "pnpm",
          "--filter",
          "medusa-be",
          "exec",
          "medusa",
          "user",
          "-e",
          resolvedEmail,
          "-p",
          resolvedPassword,
        ],
        { cwd: repoRoot },
      );
    }),
).pipe(Command.withDescription("Create a Medusa admin user."));

const medusaMigrate = Command.make("medusa-migrate", {}, () =>
  Effect.gen(function* () {
    const repoRoot = yield* getRepoRoot();
    yield* run(
      "docker",
      [
        "exec",
        "wr_medusa_be",
        "pnpm",
        "--filter",
        "medusa-be",
        "run",
        "migrate",
      ],
      { cwd: repoRoot },
    );
  }),
).pipe(Command.withDescription("Run Medusa migrations."));

const medusaGenerateMigration = Command.make(
  "medusa-generate-migration",
  { module: moduleOption },
  ({ module }) =>
    Effect.gen(function* () {
      const repoRoot = yield* getRepoRoot();
      const resolvedModule = yield* resolveOption(
        module,
        "MODULE",
        "module name",
        "module",
      );
      yield* run(
        "docker",
        [
          "exec",
          "wr_medusa_be",
          "pnpm",
          "--filter",
          "medusa-be",
          "run",
          "migrate:generate-only",
          resolvedModule,
        ],
        { cwd: repoRoot },
      );
    }),
).pipe(Command.withDescription("Generate Medusa migration files."));

const medusaMinioInit = Command.make("medusa-minio-init", {}, () =>
  Effect.gen(function* () {
    const repoRoot = yield* getRepoRoot();
    const rootUser = process.env.MINIO_ROOT_USER ?? "minioadmin";
    const rootPassword = process.env.MINIO_ROOT_PASSWORD ?? "minioadmin";
    const accessKey =
      process.env.MINIO_ACCESS_KEY ??
      process.env.DC_MINIO_ACCESS_KEY ??
      "minioadminkey";
    const secretKey =
      process.env.MINIO_SECRET_KEY ??
      process.env.DC_MINIO_SECRET_KEY ??
      "minioadminkey";
    yield* run(
      "docker",
      [
        "exec",
        "wr_medusa_minio",
        "mc",
        "alias",
        "set",
        "local",
        "http://localhost:9004",
        rootUser,
        rootPassword,
      ],
      { cwd: repoRoot },
    );
    yield* run(
      "docker",
      [
        "exec",
        "wr_medusa_minio",
        "mc",
        "admin",
        "accesskey",
        "create",
        "--access-key",
        accessKey,
        "--secret-key",
        secretKey,
        "local",
      ],
      { cwd: repoRoot },
    );
    yield* run(
      "docker",
      [
        "cp",
        "./docker/development/medusa-minio/config/local-bucket-metadata.zip",
        "wr_medusa_minio:.",
      ],
      { cwd: repoRoot },
    );
    yield* run(
      "docker",
      [
        "exec",
        "wr_medusa_minio",
        "mc",
        "admin",
        "cluster",
        "bucket",
        "import",
        "local",
        "/local-bucket-metadata.zip",
      ],
      { cwd: repoRoot },
    );
  }),
).pipe(
  Command.withDescription(
    "Initialize MinIO for Medusa file storage (dev defaults; override via MINIO_* env vars).",
  ),
);

const medusaMeilisearchReseed = Command.make("medusa-meilisearch-reseed", {}, () =>
  Effect.gen(function* () {
    const repoRoot = yield* getRepoRoot();
    yield* run(
      "docker",
      [
        "exec",
        "wr_medusa_be",
        "pnpm",
        "--filter",
        "medusa-be",
        "run",
        "addInitialSearchDocuments",
      ],
      { cwd: repoRoot },
    );
  }),
).pipe(Command.withDescription("Reseed Meilisearch documents."));

const medusaSeed = Command.make("medusa-seed", {}, () =>
  Effect.gen(function* () {
    const repoRoot = yield* getRepoRoot();
    yield* run(
      "docker",
      [
        "exec",
        "wr_medusa_be",
        "pnpm",
        "--filter",
        "medusa-be",
        "run",
        "seedInitialData",
      ],
      { cwd: repoRoot },
    );
  }),
).pipe(Command.withDescription("Seed initial Medusa data."));

const medusaSeedDevData = Command.make("medusa-seed-dev-data", {}, () =>
  Effect.gen(function* () {
    const repoRoot = yield* getRepoRoot();
    yield* run(
      "docker",
      [
        "exec",
        "wr_medusa_be",
        "pnpm",
        "--filter",
        "medusa-be",
        "run",
        "seedDevData",
      ],
      { cwd: repoRoot },
    );
  }),
).pipe(Command.withDescription("Seed Medusa dev data."));

const medusaSeedN1 = Command.make("medusa-seed-n1", {}, () =>
  Effect.gen(function* () {
    const repoRoot = yield* getRepoRoot();
    yield* run(
      "docker",
      [
        "exec",
        "wr_medusa_be",
        "pnpm",
        "--filter",
        "medusa-be",
        "run",
        "seedN1",
      ],
      { cwd: repoRoot },
    );
  }),
).pipe(Command.withDescription("Seed Medusa N1 data."));

const biomeBe = Command.make("biome-be", {}, () =>
  runPnpmEnv(["pnpx", "biome", "check", "--write", "apps/medusa-be"]),
).pipe(Command.withDescription("Run Biome check with write on medusa-be."));

const root = Command.make("wr", {}, () => Effect.succeed(undefined)).pipe(
  Command.withDescription("Workspace CLI for new-engine."),
  Command.withSubcommands([
    corepackUpdate,
    install,
    installFixLock,
    updateMedusa,
    update,
    npkill,
    dev,
    prod,
    down,
    downWithVolumes,
    medusaCreateUser,
    medusaMigrate,
    medusaGenerateMigration,
    medusaMinioInit,
    medusaMeilisearchReseed,
    medusaSeed,
    medusaSeedDevData,
    medusaSeedN1,
    biomeBe,
  ]),
);

const cli = Command.run(root, {
  name: "WR CLI",
  version: cliVersion,
});

const runCli = (argv = process.argv) =>
  cli(argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain);

runCli(process.argv);

export { runCli };
