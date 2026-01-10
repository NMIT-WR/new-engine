import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const packageJsonPath = fileURLToPath(
  new URL("../../package.json", import.meta.url),
);

export const cliVersion = (() => {
  const raw = readFileSync(packageJsonPath, "utf8");
  const parsed = JSON.parse(raw) as { version?: string };
  return parsed.version ?? "0.0.0";
})();
