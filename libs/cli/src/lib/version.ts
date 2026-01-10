import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const packageJsonPath = fileURLToPath(
  new URL("../../package.json", import.meta.url),
);

export const cliVersion = (() => {
  try {
    const raw = readFileSync(packageJsonPath, "utf8");
    const parsed = JSON.parse(raw) as { version?: string };
    return parsed.version ?? "0.0.0";
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error reading version.";
    process.stderr.write(`! Unable to read CLI version: ${message}\n`);
    return "0.0.0";
  }
})();
