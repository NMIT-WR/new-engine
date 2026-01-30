import { spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

// Runs Playwright component visual tests inside Docker for reproducible snapshots.
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uiRoot = path.resolve(__dirname, "..")
const repoRoot = path.resolve(uiRoot, "../..")

const imageName =
  process.env.PLAYWRIGHT_DOCKER_IMAGE ?? "new-engine-ui-playwright"
const platform = process.env.DOCKER_PLATFORM ?? "linux/amd64"
const testBaseUrl = process.env.TEST_BASE_URL
const shmSize = process.env.PLAYWRIGHT_DOCKER_SHM_SIZE ?? "2g"
const ipcMode = process.env.PLAYWRIGHT_DOCKER_IPC ?? "host"
const sequentialProjects =
  (process.env.PLAYWRIGHT_DOCKER_SEQUENTIAL ?? "0") !== "0"
const dockerProjectsEnv = process.env.PLAYWRIGHT_DOCKER_PROJECTS ?? ""
const dockerProjects = dockerProjectsEnv
  .split(",")
  .map((project) => project.trim())
  .filter(Boolean)
const dockerfilePath = path.resolve(
  repoRoot,
  "docker/development/playwright/Dockerfile"
)
const storybookDir = path.resolve(uiRoot, "storybook-static")
const storybookIframe = path.resolve(storybookDir, "iframe.html")
const snapshotsDir = path.resolve(uiRoot, "test/visual.spec.ts-snapshots")
const containerName = `pw-visual-${Date.now()}`
const rebuildStorybook =
  (process.env.PLAYWRIGHT_STORYBOOK_REBUILD ?? "1") !== "0"

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...options,
  })
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`)
  }
  return result
}

const runSilent = (command, args) =>
  spawnSync(command, args, {
    stdio: "pipe",
    shell: process.platform === "win32",
  })

const cleanup = () => {
  runSilent("docker", ["rm", "-f", containerName])
}

// Build storybook (default) or when missing
if (rebuildStorybook) {
  console.log("Building Storybook...")
  run("pnpm", ["-C", uiRoot, "build:storybook"])
} else if (!existsSync(storybookIframe)) {
  console.log("storybook-static not found, building Storybook...")
  run("pnpm", ["-C", uiRoot, "build:storybook"])
}

// Build docker image if needed
const imageInspect = runSilent("docker", ["image", "inspect", imageName])
if (imageInspect.status !== 0) {
  console.log("Building Docker image...")
  run("docker", [
    "build",
    `--platform=${platform}`,
    "-t",
    imageName,
    "-f",
    dockerfilePath,
    repoRoot,
  ])
}

const extraArgs = process.argv.slice(2)

console.log("Starting container...")

// Start container in background (keeps running)
const dockerRunArgs = [
  "run",
  "-d",
  "--name",
  containerName,
  `--platform=${platform}`,
  `--shm-size=${shmSize}`,
  `--ipc=${ipcMode}`,
  "--add-host=host.docker.internal:host-gateway",
  "-e",
  "CI=true",
  "-e",
  "PLAYWRIGHT_DOCKER=1",
  "--entrypoint",
  "sleep",
  // Mount sources as read-only
  "-v",
  `${storybookDir}:/app/storybook-static:ro`,
  "-v",
  `${path.resolve(uiRoot, "test")}:/app/test-src:ro`,
  "-v",
  `${path.resolve(uiRoot, "playwright.config.cts")}:/app/playwright.config.cts:ro`,
  "-v",
  `${path.resolve(uiRoot, "package.json")}:/app/package.json:ro`,
  imageName,
  "infinity",
]

const addEnv = (key, value) => {
  if (!value) return
  const insertAt = dockerRunArgs.indexOf(imageName)
  dockerRunArgs.splice(insertAt, 0, "-e", `${key}=${value}`)
}

addEnv("TEST_BASE_URL", testBaseUrl)
addEnv("PLAYWRIGHT_WORKERS", process.env.PLAYWRIGHT_WORKERS)
addEnv("PLAYWRIGHT_PAGE_RESET", process.env.PLAYWRIGHT_PAGE_RESET)
addEnv("TEST_STORIES", process.env.TEST_STORIES)

const startResult = runSilent("docker", dockerRunArgs)

if (startResult.status !== 0) {
  console.error("Failed to start container")
  console.error(startResult.stderr?.toString())
  process.exit(1)
}

const runningCheck = runSilent("docker", [
  "inspect",
  containerName,
  "--format",
  "{{.State.Running}}",
])
if (runningCheck.status !== 0 || runningCheck.stdout?.toString().trim() !== "true") {
  console.error("Container is not running after start.")
  const logsResult = runSilent("docker", ["logs", containerName])
  if (logsResult.status === 0) {
    console.error(logsResult.stdout?.toString())
  }
  cleanup()
  process.exit(1)
}

try {
  // Copy test files into container (internal I/O is faster)
  console.log("Copying test files into container...")
  run("docker", [
    "exec",
    containerName,
    "cp",
    "-r",
    "/app/test-src",
    "/app/test",
  ])

  // Run playwright tests (all I/O happens inside container)
  console.log("Running Playwright tests...")
  const runPlaywright = (project) =>
    spawnSync(
      "docker",
      [
        "exec",
        "-t",
        containerName,
        "npx",
        "playwright",
        "test",
        "-c",
        "playwright.config.cts",
        "--reporter=list,html",
        ...(project ? ["--project", project] : []),
        ...extraArgs,
      ],
      { stdio: "inherit" }
    )

  let testStatus = 0
  let testSignal = null
  if (sequentialProjects) {
    const projectsToRun =
      dockerProjects.length > 0 ? dockerProjects : ["desktop", "mobile"]
    for (const project of projectsToRun) {
      const result = runPlaywright(project)
      if (result.status !== 0 || result.signal) {
        testStatus = result.status ?? 1
        testSignal = result.signal
        break
      }
    }
  } else {
    const result = runPlaywright()
    testStatus = result.status ?? 0
    testSignal = result.signal
  }

  if (testStatus !== 0 || testSignal) {
    console.warn("Playwright exited with a non-zero status.")
    const inspectResult = runSilent("docker", [
      "inspect",
      containerName,
      "--format",
      "{{json .State}}",
    ])
    if (inspectResult.status === 0) {
      console.warn("Container state:", inspectResult.stdout?.toString().trim())
    }
  }

  // Copy snapshots back to host (only if update mode or new snapshots)
  console.log("Copying snapshots back to host...")
  const copySnapshotsResult = runSilent("docker", [
    "cp",
    `${containerName}:/app/test/visual.spec.ts-snapshots/.`,
    snapshotsDir,
  ])
  if (copySnapshotsResult.status !== 0) {
    console.warn("Warning: Could not copy snapshots (may not exist yet)")
  }

  // Copy HTML report back to host
  console.log("Copying HTML report back to host...")
  const reportDir = path.resolve(uiRoot, "playwright-report")
  const copyReportResult = runSilent("docker", [
    "cp",
    `${containerName}:/app/playwright-report/.`,
    reportDir,
  ])
  if (copyReportResult.status !== 0) {
    console.warn("Warning: Could not copy HTML report (may not exist yet)")
  }

  // Copy test results back to host
  console.log("Copying test results back to host...")
  const resultsDir = path.resolve(uiRoot, "test-results")
  const copyResultsResult = runSilent("docker", [
    "cp",
    `${containerName}:/app/test-results/.`,
    resultsDir,
  ])
  if (copyResultsResult.status !== 0) {
    console.warn("Warning: Could not copy test results (may not exist yet)")
  }

  cleanup()
  process.exit(testStatus ?? 0)
} catch (error) {
  console.error("Error:", error.message)
  cleanup()
  process.exit(1)
}
