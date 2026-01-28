// Use CommonJS-style exports so Nx plugins that `require` the config can load it
// without running into ESM/CommonJS interop issues.
// This TypeScript config has been superseded by `playwright.config.cjs` which
// provides a CommonJS entrypoint compatible with Nx plugins. Keep a minimal
// ESM-compatible placeholder here to avoid tooling errors while preserving the
// original file path for editors and type hints.

module.exports = {}
