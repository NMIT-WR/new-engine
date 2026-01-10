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
      .some((line) => line.trim().startsWith("local"));
    if (!aliasExists) {
      yield* run(
        "docker",
        [
          "exec",
          minioContainerName,
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
          minioContainerName,
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

export const medusaMeilisearchReseed = Command.make(
  "medusa-meilisearch-reseed",
  {},
  () =>
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
          "addInitialSearchDocuments",
        ],
        { cwd: repoRoot },
      );
    }),
).pipe(Command.withDescription("Reseed Meilisearch documents."));

export const medusaSeed = Command.make("medusa-seed", {}, () =>
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
        "seedInitialData",
      ],
      { cwd: repoRoot },
    );
  }),
).pipe(Command.withDescription("Seed initial Medusa data."));

export const medusaSeedDevData = Command.make("medusa-seed-dev-data", {}, () =>
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
        "seedDevData",
      ],
      { cwd: repoRoot },
    );
  }),
).pipe(Command.withDescription("Seed Medusa dev data."));

export const medusaSeedN1 = Command.make("medusa-seed-n1", {}, () =>
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
        "seedN1",
      ],
      { cwd: repoRoot },
    );
  }),
).pipe(Command.withDescription("Seed Medusa N1 data."));
