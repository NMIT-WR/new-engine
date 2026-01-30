import fs from 'node:fs'

const runningInContainer = () => {
  if (process.platform !== 'linux') {
    return false
  }

  if (fs.existsSync('/.dockerenv')) {
    return true
  }

  try {
    const cgroup = fs.readFileSync('/proc/1/cgroup', 'utf8')
    return (
      cgroup.includes('docker') ||
      cgroup.includes('containerd') ||
      cgroup.includes('kubepods')
    )
  } catch {
    return false
  }
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

