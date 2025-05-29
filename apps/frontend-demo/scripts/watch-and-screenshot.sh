#!/bin/bash

# Watch for file changes and automatically capture screenshots
echo "Starting file watcher with auto-screenshot..."
echo "Make sure your dev server is running on localhost:3000"

# Function to capture screenshots
capture_screenshots() {
  echo "Changes detected, capturing screenshots..."
  node scripts/auto-screenshot.js
}

# Export the function so it's available to the watch command
export -f capture_screenshots

# Watch src directory for changes
npx chokidar "src/**/*" -c "bash -c capture_screenshots"