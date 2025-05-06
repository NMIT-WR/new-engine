import type { Config } from "tailwindcss";
import tailwindcssSignals from "tailwindcss-signals";
import tailwindcssMembers from "tailwindcss-members";
import tailwindcssSelectors from "tailwindcss-selector-patterns";

export default {
  plugins: [tailwindcssSignals, tailwindcssMembers, tailwindcssSelectors],
} satisfies Config;
