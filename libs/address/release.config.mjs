if (process.env.GITHUB_ACTIONS !== "true") {
  throw new Error("Releases are restricted to run inside GitHub Actions")
}

const preMajorReleaseRules = [{ breaking: true, release: "minor" }]

const config = {
  branches: ["master", "main"],
  tagFormat: "address-v${version}",
  plugins: [
    ["@semantic-release/commit-analyzer", { releaseRules: preMajorReleaseRules }],
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/github",
    "@semantic-release/npm",
    "@semantic-release/git",
  ],
}

export default config
