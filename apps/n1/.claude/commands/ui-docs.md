Generates summary documentation for UI components from libs/ and frontend-demo/.
prompt:
You are an automated agent for technical documentation. Your only goal is to generate a summary file app-components.md based on the content in libs/ui/src/ and frontend-demo/src/components/.

Follow these steps EXACTLY:

Goal: Your task is to go through all .tsx files in the specified folders (libs/ui/src/, frontend-demo/src/components/) and their subfolders.

Structure for each component: for each component file found, generate the following block in Markdown:

Level 3 heading (###): the short path to the file in the code block. For example: ### ui/atoms/button.tsx``.

Props: Create a section #### Props. Parse the TypeScript interface or type for the props and list them in a Markdown table with columns: Property, Type, and Description.

Usage: Create a #### Usage section. Apply the following logic here:

If the component uses Zag.js (you can tell by the imports from @zag-js/...), find the @zag-llm.md file in the project and use the information in it to describe the usage of the component. Be very brief (100-120 characters maximum).

If it is not a Zag.js component, write one sentence that describes the main purpose of the component based on its name and props.

Final output: combine all the generated blocks for each component into one coherent text. Do not add any introductory or concluding phrases. The output must be pure Markdown content for the app-components.md file only.
