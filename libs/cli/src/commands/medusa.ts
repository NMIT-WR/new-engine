import { existsSync } from "node:fs";
import path from "node:path";
import { Command } from "@effect/cli";
import { Effect } from "effect";
import {
  emailOption,
  moduleOption,
  passwordOption,
  resolveOption,
} from "../lib/options";
import { getRepoRoot } from "../lib/paths";
import { run, runCapture } from "../lib/process";

const medusaContainerName =
  process.env.MEDUSA_CONTAINER_NAME ?? "wr_medusa_be";
const minioContainerName =
  process.env.MEDUSA_MINIO_CONTAINER_NAME ?? "wr_medusa_minio";

const makeMedusaScriptCommand = (
  name: string,
  scriptName: string,
  description: string,
) =>
  Command.make(name, {}, () =>
    Effect.gen(function* () {
      const repoRoot = yield* getRepoRoot();
      yield* run(
        "docker",
        [
          "exec",
          medusaContainerName,
          "pnpm",
          "--filter",
          "medusa-be",
          "run",
          scriptName,
        ],
        { cwd: repoRoot },
      );
    }),
  ).pipe(Command.withDescription(description));

export const medusaCreateUser = Command.make(
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
          "-i",
          medusaContainerName,
          "sh",
          "-lc",
          'read -r password; pnpm --filter medusa-be exec medusa user -e "$1" -p "$password"',
          "--",
          resolvedEmail,
        ],
        { cwd: repoRoot, stdin: `${resolvedPassword}\n` },
      );
    }),
).pipe(Command.withDescription("Create a Medusa admin user."));

export const medusaMigrate = Command.make("medusa-migrate", {}, () =>
  Effect.gen(function* () {
    const repoRoot = yield* getRepoRoot();
    yield* run(
      "docker",
      [
        "exec",
        medusaContainerName,
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

export const medusaGenerateMigration = Command.make(
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
      yield* Effect.sync(() => {
        process.stdout.write(
          "! Note: feature-flagged migrations require the matching FEATURE_* env var to be enabled before generating.\n",
        );
      });
      yield* run(
        "docker",
        [
          "exec",
          medusaContainerName,
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

export const medusaMinioInit = Command.make("medusa-minio-init", {}, () =>
  Effect.gen(function* () {
    const repoRoot = yield* getRepoRoot();
    const rootUser = process.env.MINIO_ROOT_USER ?? "minioadmin";
    const rootPassword = process.env.MINIO_ROOT_PASSWORD ?? "minioadmin";
    const minioEndpoint = process.env.MINIO_ENDPOINT ?? "http://localhost:9004";
    const accessKey =
      process.env.MINIO_ACCESS_KEY ??
      process.env.DC_MINIO_ACCESS_KEY ??
      "minioadminkey";
    const secretKey =
      process.env.MINIO_SECRET_KEY ??
      process.env.DC_MINIO_SECRET_KEY ??
      "minioadminkey";
    const aliasList = yield* runCapture(
      "docker",
      ["exec", minioContainerName, "mc", "alias", "list"],
      { cwd: repoRoot },
    ).pipe(Effect.catchAll(() => Effect.succeed("")));
    const aliasExists = aliasList
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .some((line) => line.split(/\s+/)[0] === "local");
    const minioEnvArgs = [
      "-e",
      `MINIO_ENDPOINT=${minioEndpoint}`,
      "-e",
      `MINIO_ROOT_USER=${rootUser}`,
      "-e",
      `MINIO_ROOT_PASSWORD=${rootPassword}`,
      "-e",
      `MINIO_ACCESS_KEY=${accessKey}`,
      "-e",
      `MINIO_SECRET_KEY=${secretKey}`,
    ];
    if (!aliasExists) {
      yield* run(
        "docker",
        [
          "exec",
          ...minioEnvArgs,
          minioContainerName,
          "sh",
          "-lc",
          'mc alias set local "$MINIO_ENDPOINT" "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"',
        ],
        { cwd: repoRoot, sensitive: true },
      );
    }
    const accessKeyList = yield* runCapture(
      "docker",
      ["exec", minioContainerName, "mc", "admin", "accesskey", "list", "local"],
      { cwd: repoRoot },
    ).pipe(Effect.catchAll(() => Effect.succeed("")));
    const accessKeyExists = accessKeyList
      .split(/\r?\n/)
      .some((line) => line.includes(accessKey));
    if (!accessKeyExists) {
      yield* run(
        "docker",
        [
          "exec",
          ...minioEnvArgs,
          minioContainerName,
          "sh",
          "-lc",
          'mc admin accesskey create --access-key "$MINIO_ACCESS_KEY" --secret-key "$MINIO_SECRET_KEY" local',
        ],
        { cwd: repoRoot, sensitive: true },
      );
    }
    const metadataZip = path.join(
      repoRoot,
      "docker/development/medusa-minio/config/local-bucket-metadata.zip",
    );
    if (!existsSync(metadataZip)) {
      yield* Effect.fail(
        new Error(`Missing MinIO metadata zip at ${metadataZip}`),
      );
    }
    yield* run(
      "docker",
      [
        "cp",
        metadataZip,
        `${minioContainerName}:.`,
      ],
      { cwd: repoRoot },
    );
    yield* run(
      "docker",
      [
        "exec",
        minioContainerName,
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

export const medusaMeilisearchReseed = makeMedusaScriptCommand(
  "medusa-meilisearch-reseed",
  "addInitialSearchDocuments",
  "Reseed Meilisearch documents.",
);

export const medusaSeed = makeMedusaScriptCommand(
  "medusa-seed",
  "seedInitialData",
  "Seed initial Medusa data.",
);

export const medusaSeedDevData = makeMedusaScriptCommand(
  "medusa-seed-dev-data",
  "seedDevData",
  "Seed Medusa dev data.",
);

export const medusaSeedN1 = makeMedusaScriptCommand(
  "medusa-seed-n1",
  "seedN1",
  "Seed Medusa N1 data.",
);
