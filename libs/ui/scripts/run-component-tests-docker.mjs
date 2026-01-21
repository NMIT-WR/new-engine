import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uiRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(uiRoot, '../..')

const imageName = process.env.PLAYWRIGHT_DOCKER_IMAGE ?? 'new-engine-ui-playwright'
const platform = process.env.DOCKER_PLATFORM ?? 'linux/amd64'
const baseUrl = process.env.TEST_BASE_URL ?? 'http://host.docker.internal:6006'
const dockerfilePath = path.resolve(
  repoRoot,
  'docker/development/playwright/Dockerfile',
)
const storybookDir = path.resolve(uiRoot, 'storybook-static')
const storybookIframe = path.resolve(storybookDir, 'iframe.html')

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    ...options,
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

if (!existsSync(storybookIframe)) {
  console.log('storybook-static not found, building Storybook...')
  run('pnpm', ['-C', uiRoot, 'build:storybook'])
}

const imageInspect = spawnSync('docker', ['image', 'inspect', imageName], {
  stdio: 'ignore',
  shell: process.platform === 'win32',
})

if (imageInspect.status !== 0) {
  run('docker', [
    'build',
    '-t',
    imageName,
    '-f',
    dockerfilePath,
    repoRoot,
  ])
}

const extraArgs = process.argv.slice(2)

const dockerArgs = ['run', '--rm']

if (process.stdout.isTTY) {
  dockerArgs.push('-t')
}

dockerArgs.push(
  `--platform=${platform}`,
  '--add-host=host.docker.internal:host-gateway',
  '-e',
  `TEST_BASE_URL=${baseUrl}`,
  '-e',
  'CI=true',
  '-v',
  `${storybookDir}:/app/storybook-static`,
  '-v',
  `${path.resolve(uiRoot, 'test')}:/app/test`,
  '-v',
  `${path.resolve(uiRoot, 'playwright.config.ts')}:/app/playwright.config.ts`,
  imageName,
  'test',
  ...extraArgs,
)

run('docker', dockerArgs)
