import { biomeBe } from "./biome"
import {
  corepackUpdate,
  install,
  installFixLock,
  npkill,
  update,
  updateMedusa,
} from "./core"
import { dev, down, downWithVolumes, prod } from "./docker"
import {
  medusaCreateUser,
  medusaGenerateMigration,
  medusaMeilisearchReseed,
  medusaMigrate,
  medusaMinioInit,
  medusaSeed,
  medusaSeedDevData,
  medusaSeedN1,
} from "./medusa"

export const commands = [
  corepackUpdate,
  install,
  installFixLock,
  updateMedusa,
  update,
  npkill,
  dev,
  prod,
  down,
  downWithVolumes,
  medusaCreateUser,
  medusaMigrate,
  medusaGenerateMigration,
  medusaMinioInit,
  medusaMeilisearchReseed,
  medusaSeed,
  medusaSeedDevData,
  medusaSeedN1,
  biomeBe,
] as const
