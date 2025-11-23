const config = {
  branches: ['master', 'main'],
  tagFormat: 'ui-v${version}',
  releaseRules: [{ breaking: true, release: 'minor' }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/github',
    '@semantic-release/npm',
    '@semantic-release/git',
  ],
}

export default config
