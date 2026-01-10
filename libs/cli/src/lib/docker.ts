export const projectName = "new-engine";
export const medusaService = "medusa-be";
export const medusaImage = `${projectName}-${medusaService}`;

export const composeBase = [
  "compose",
  "-f",
  "docker-compose.yaml",
  "-p",
  projectName,
];

export const composeProd = [
  "compose",
  "-f",
  "docker-compose.yaml",
  "-f",
  "docker-compose.prod.yaml",
  "-p",
  projectName,
];
