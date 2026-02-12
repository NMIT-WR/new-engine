import fs from 'node:fs'

const runningInContainer = () => {
  if (process.platform !== 'linux') {
    return false
  }

  const containerEnv = (process.env.CONTAINER ?? process.env.container ?? '').toLowerCase()
  if (containerEnv && containerEnv !== '0' && containerEnv !== 'false') {
    return true
  }

  if (fs.existsSync('/.dockerenv')) {
    return true
  }

  try {
    const cgroup = fs.readFileSync('/proc/1/cgroup', 'utf8')
    if (
      cgroup.includes('docker') ||
      cgroup.includes('containerd') ||
      cgroup.includes('kubepods')
    ) {
      return true
    }
  } catch {}

  try {
    const mountInfo = fs.readFileSync('/proc/self/mountinfo', 'utf8')
    if (
      mountInfo.includes('docker') ||
      mountInfo.includes('containerd') ||
      mountInfo.includes('kubepods') ||
      mountInfo.includes('podman')
    ) {
      return true
    }
  } catch {}

  return false
}

export default async function dockerOnlyGlobalSetup() {
  const dockerRunnerFlag = process.env.PLAYWRIGHT_DOCKER === '1'
  if (!dockerRunnerFlag || !runningInContainer()) {
    throw new Error(
      [
        'Component visual tests must run inside Docker for reproducible snapshots.',
        '',
        'Use one of:',
        '- bunx nx run ui-kit:test:components',
        '- bunx nx run ui-kit:test:components:update',
        '- pnpm -C libs/ui test:components',
      ].join('\n'),
    )
  }
}
