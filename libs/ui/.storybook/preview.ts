import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/tokens/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        auto: "", // Prázdný string pro výchozí stav bez třídy (systémové nastavení)
        light: "light",
        dark: "dark",
        reverse: "reverse",
      },
      defaultTheme: "auto",
    }),
  ],
};

export default preview;
