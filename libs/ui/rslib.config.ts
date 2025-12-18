import { execFile } from "node:child_process"
import path from "node:path"
import { promisify } from "node:util"
import { pluginReact } from "@rsbuild/plugin-react"
import { defineConfig } from "@rslib/core"
import { pluginPublint } from "rsbuild-plugin-publint"

const execFileAsync = promisify(execFile)

function pluginFlagsCss() {
  return {
    name: "plugin-flags-css",
    setup(api) {
      api.onAfterBuild({
        order: "pre",
        handler: async ({ isFirstCompile }) => {
          if (!isFirstCompile) return

          const scriptPath = path.join(
            api.context.rootPath,
            "scripts/build-flags-css.js"
          )

          await execFileAsync(process.execPath, [scriptPath], {
            cwd: api.context.rootPath,
          })
        },
      })
    },
  }
}

export default defineConfig({
  source: {
    entry: {
      index: "./src/**/*.{ts,tsx}",
    },
  },
  lib: [
    {
      bundle: false,
      dts: true,
      format: "esm",
    },
  ],
  output: {
    target: "web",
  },
  plugins: [pluginFlagsCss(), pluginPublint(), pluginReact()],
})
