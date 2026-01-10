#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

function findRepoRoot(startDir) {
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
      return startDir;
    }
    dir = parent;
  }
}

const repoRoot = findRepoRoot(process.cwd());

function parseArgs(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") {
      positional.push(...argv.slice(i + 1));
      break;
    }
    if (arg.startsWith("--")) {
      const eqIndex = arg.indexOf("=");
      if (eqIndex !== -1) {
        const key = arg.slice(2, eqIndex);
        const value = arg.slice(eqIndex + 1);
        flags[key] = value;
        continue;
      }
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        flags[key] = next;
        i += 1;
      } else {
        flags[key] = true;
      }
      continue;
    }
    positional.push(arg);
  }
  return { flags, positional };
}

function logCommand(cmd, args) {
  process.stdout.write(`> ${cmd} ${args.join(" ")}\n`);
}

function run(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    logCommand(cmd, args);
    const child = spawn(cmd, args, {
      stdio: "inherit",
      cwd: repoRoot,
      env: process.env,
      ...options,
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${cmd} exited with code ${code}`));
      }
    });
  });
}

async function runIgnore(cmd, args, options) {
  try {
    await run(cmd, args, options);
  } catch (error) {
    process.stderr.write(`! ${error.message} (ignored)\n`);
  }
}

function pickValue({ flags, envName, flagName, argValue, label }) {
  const value = flags[flagName] ?? argValue ?? process.env[envName];
  if (!value) {
    throw new Error(
      `Missing ${label}. Provide --${flagName} or set ${envName}.`,
    );
  }
  return value;
}

async function runPnpmEnv(commandArgs, { interactive = false } = {}) {
  await run("docker", [
    "build",
    "-f",
    "docker/development/pnpm/Dockerfile",
    "-t",
    "pnpm-env",
    ".",
  ]);
  const dockerArgs = [
    "run",
    ...(interactive ? ["-it"] : []),
    "-v",
    `${repoRoot}:/var/www`,
    "pnpm-env",
    ...commandArgs,
  ];
  await run("docker", dockerArgs);
}

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

const tasks = {
  "corepack-update": {
    description: "Update corepack inside the pnpm Docker environment.",
    run: async () => {
      await runPnpmEnv(["corepack", "up"]);
    },
  },
  install: {
    description: "Install dependencies in the pnpm Docker environment.",
    run: async () => {
      await runPnpmEnv(["pnpm", "install", "--frozen-lockfile"]);
    },
  },
  "install-fix-lock": {
    description: "Install dependencies and fix the lockfile.",
    run: async () => {
      await runPnpmEnv(["pnpm", "install", "--fix-lockfile"]);
    },
  },
  "update-medusa": {
    description: "Update @medusajs/* packages in medusa-be to latest.",
    run: async () => {
      await runPnpmEnv([
        "pnpm",
        "--filter",
        "medusa-be",
        "update",
        "@medusajs/*",
        "--latest",
      ]);
    },
  },
  update: {
    description: "Update medusa-be dependencies to latest.",
    run: async () => {
      await runPnpmEnv(["pnpm", "--filter", "medusa-be", "update", "--latest"]);
    },
  },
  npkill: {
    description: "Run npkill inside the pnpm Docker environment.",
    run: async () => {
      await runPnpmEnv(["pnpx", "npkill", "-x", "-D", "-y"], {
        interactive: true,
      });
    },
  },
  dev: {
    description: "Start docker compose in development mode.",
    run: async () => {
      await run("docker", [
        ...composeBase,
        "up",
        "--force-recreate",
        "-d",
        "--build",
      ]);
    },
  },
  prod: {
    description: "Build and start docker compose in production mode.",
    run: async () => {
      await runIgnore("docker", [...composeProd, "down"]);
      await runIgnore("docker", ["rmi", "new-engine-medusa-be-prod"]);
      await run("docker", [
        ...composeProd,
        "build",
        "--no-cache",
        "medusa-be",
      ]);
      await run("docker", [...composeProd, "up", "-d"]);
    },
  },
  down: {
    description: "Stop docker compose services.",
    run: async () => {
      await run("docker", [...composeBase, "down"]);
    },
  },
  "down-with-volumes": {
    description: "Stop docker compose services and remove volumes.",
    run: async () => {
      await run("docker", [...composeBase, "down", "-v"]);
    },
  },
  "medusa-create-user": {
    description: "Create a Medusa admin user.",
    run: async ({ flags, args }) => {
      const email = pickValue({
        flags,
        envName: "EMAIL",
        flagName: "email",
        argValue: args[0],
        label: "email",
      });
      const password = pickValue({
        flags,
        envName: "PASSWORD",
        flagName: "password",
        argValue: args[1],
        label: "password",
      });
      await run("docker", [
        "exec",
        "wr_medusa_be",
        "pnpm",
        "--filter",
        "medusa-be",
        "exec",
        "medusa",
        "user",
        "-e",
        email,
        "-p",
        password,
      ]);
    },
  },
  "medusa-migrate": {
    description: "Run Medusa migrations.",
    run: async () => {
      await run("docker", [
        "exec",
        "wr_medusa_be",
        "pnpm",
        "--filter",
        "medusa-be",
        "run",
        "migrate",
      ]);
    },
  },
  "medusa-generate-migration": {
    description: "Generate Medusa migration files.",
    run: async ({ flags, args }) => {
      const moduleName = pickValue({
        flags,
        envName: "MODULE",
        flagName: "module",
        argValue: args[0],
        label: "module name",
      });
      await run("docker", [
        "exec",
        "wr_medusa_be",
        "pnpm",
        "--filter",
        "medusa-be",
        "run",
        "migrate:generate-only",
        moduleName,
      ]);
    },
  },
  "medusa-minio-init": {
    description: "Initialize MinIO for Medusa file storage.",
    run: async () => {
      await run("docker", [
        "exec",
        "wr_medusa_minio",
        "mc",
        "alias",
        "set",
        "local",
        "http://localhost:9004",
        "minioadmin",
        "minioadmin",
      ]);
      await run("docker", [
        "exec",
        "wr_medusa_minio",
        "mc",
        "admin",
        "accesskey",
        "create",
        "--access-key",
        "minioadminkey",
        "--secret-key",
        "minioadminkey",
        "local",
      ]);
      await run("docker", [
        "cp",
        "./docker/development/medusa-minio/config/local-bucket-metadata.zip",
        "wr_medusa_minio:.",
      ]);
      await run("docker", [
        "exec",
        "wr_medusa_minio",
        "mc",
        "admin",
        "cluster",
        "bucket",
        "import",
        "local",
        "/local-bucket-metadata.zip",
      ]);
    },
  },
  "medusa-meilisearch-reseed": {
    description: "Reseed Meilisearch documents.",
    run: async () => {
      await run("docker", [
        "exec",
        "wr_medusa_be",
        "pnpm",
        "--filter",
        "medusa-be",
        "run",
        "addInitialSearchDocuments",
      ]);
    },
  },
  "medusa-seed": {
    description: "Seed initial Medusa data.",
    run: async () => {
      await run("docker", [
        "exec",
        "wr_medusa_be",
        "pnpm",
        "--filter",
        "medusa-be",
        "run",
        "seedInitialData",
      ]);
    },
  },
  "medusa-seed-dev-data": {
    description: "Seed Medusa dev data.",
    run: async () => {
      await run("docker", [
        "exec",
        "wr_medusa_be",
        "pnpm",
        "--filter",
        "medusa-be",
        "run",
        "seedDevData",
      ]);
    },
  },
  "medusa-seed-n1": {
    description: "Seed Medusa N1 data.",
    run: async () => {
      await run("docker", [
        "exec",
        "wr_medusa_be",
        "pnpm",
        "--filter",
        "medusa-be",
        "run",
        "seedN1",
      ]);
    },
  },
  "biome-be": {
    description: "Run Biome check with write on medusa-be.",
    run: async () => {
      await run("bunx", ["biome", "check", "--write", "apps/medusa-be"]);
    },
  },
};

function printHelp() {
  const lines = [
    "Usage:",
    "  node scripts/tasks.mjs <task> [options]",
    "  bun scripts/tasks.mjs <task> [options]",
    "",
    "Options:",
    "  --help           Show help",
    "  --list           List available tasks",
    "",
    "Task-specific options:",
    "  medusa-create-user       --email <email> --password <password>",
    "  medusa-generate-migration --module <name> (or positional)",
    "",
    "Examples:",
    "  node scripts/tasks.mjs install",
    "  node scripts/tasks.mjs dev",
    "  node scripts/tasks.mjs medusa-create-user --email admin@example.com --password secret",
    "  node scripts/tasks.mjs medusa-generate-migration --module my_module",
    "",
    "Tasks:",
  ];
  process.stdout.write(`${lines.join("\n")}\n`);
  Object.entries(tasks)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([name, { description }]) => {
      process.stdout.write(`  ${name.padEnd(28)} ${description}\n`);
    });
}

async function main() {
  const { flags, positional } = parseArgs(process.argv.slice(2));
  const task = positional.shift();

  if (!task || flags.help || flags.h || flags.list) {
    printHelp();
    return;
  }

  const taskConfig = tasks[task];
  if (!taskConfig) {
    process.stderr.write(`Unknown task: ${task}\n\n`);
    printHelp();
    process.exitCode = 1;
    return;
  }

  await taskConfig.run({ flags, args: positional });
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
