export const composeBase = [
  "compose",
  "-f",
  "docker-compose.yaml",
  "-p",
  "new-engine",
];

export const composeProd = [
  "compose",
  "-f",
  "docker-compose.yaml",
  "-f",
  "docker-compose.prod.yaml",
  "-p",
  "new-engine",
];
