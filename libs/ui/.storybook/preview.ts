import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react'
import '../src/tokens/index.css'

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
          'Atoms',
          'Molecules',
          'Organisms',
          'Templates',
          'Pages',
          'Overview',
          '*',
        ],
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        auto: '',
        light: 'light',
        dark: 'dark',
        reverse: 'reverse',
      },
      defaultTheme: 'auto',
    }),
  ],
}

export default preview
