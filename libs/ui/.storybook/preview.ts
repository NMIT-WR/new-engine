import { withThemeByClassName } from "@storybook/addon-themes"
import type { Preview } from "@storybook/react"
import "../src/tokens/index.css"

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Atoms",
          "Molecules",
          "Organisms",
          "Templates",
          "Pages",
          "Overview",
          "*",
        ],
      },
    },
    a11y: {
      config: {
        rules: [{ id: "color-contrast-enhanced", enabled: true }],
      },
      apca: {
        level: "gold",
        useCase: "body",
      },
      test: "error",
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        auto: "",
        light: "light",
        dark: "dark",
        reverse: "reverse",
      },
      defaultTheme: "auto",
    }),
  ],
}

export default preview
