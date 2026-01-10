import { Command } from "@effect/cli";
import { Effect } from "effect";
import {
  emailOption,
  moduleOption,
  passwordOption,
  resolveOption,
} from "../lib/options";
import { getRepoRoot } from "../lib/paths";
import { run } from "../lib/process";

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

export const medusaMigrate = Command.make("medusa-migrate", {}, () =>
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

export const medusaSeed = Command.make("medusa-seed", {}, () =>
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

export const medusaSeedDevData = Command.make("medusa-seed-dev-data", {}, () =>
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

export const medusaSeedN1 = Command.make("medusa-seed-n1", {}, () =>
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
