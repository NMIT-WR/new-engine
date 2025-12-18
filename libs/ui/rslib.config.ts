import { pluginReact } from "@rsbuild/plugin-react"
import { defineConfig } from "@rslib/core"
import { pluginPublint } from "rsbuild-plugin-publint"

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
  plugins: [pluginPublint(), pluginReact()],
})
