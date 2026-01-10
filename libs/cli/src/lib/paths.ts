import { existsSync } from "node:fs";
import path from "node:path";
import { Effect } from "effect";

const findRepoRoot = (startDir: string): string => {
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

export const getRepoRoot = (): Effect.Effect<string> =>
  Effect.sync(() => findRepoRoot(process.cwd()));
