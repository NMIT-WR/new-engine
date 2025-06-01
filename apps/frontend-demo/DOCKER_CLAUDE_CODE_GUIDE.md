# Docker Setup Guide for Claude Code

This guide provides a simple, safe way to experiment with Claude Code using Docker containers with `--dangerously-skip-permissions` mode.

## Quick Start

### 1. Create the Docker Image

Save this as `Dockerfile.claude`:

```dockerfile
FROM ubuntu:22.04

# Install basic tools
RUN apt-get update && apt-get install -y \
    curl \
    git \
    nodejs \
    npm \
    python3 \
    python3-pip \
    sudo \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -s /bin/bash claude && \
    echo 'claude ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Switch to the claude user
USER claude
WORKDIR /home/claude

# Install Claude Code
RUN npm install -g @anthropic-ai/claude-code

# Create a workspace directory
RUN mkdir -p /home/claude/workspace

WORKDIR /home/claude/workspace

# Set up shell
ENV SHELL=/bin/bash
```

### 2. Build and Run

```bash
# Build the image
docker build -f Dockerfile.claude -t claude-code-sandbox .

# Run with dangerous skip permissions (for experimentation)
docker run -it --rm \
  -v $(pwd):/home/claude/workspace \
  claude-code-sandbox \
  claude --dangerously-skip-permissions

# Or with a specific directory mounted
docker run -it --rm \
  -v /path/to/your/project:/home/claude/workspace \
  claude-code-sandbox \
  claude --dangerously-skip-permissions
```

## Reusable Docker Compose Template

Create `docker-compose.claude.yml`:

```yaml
version: '3.8'

services:
  claude-code:
    build:
      context: .
      dockerfile: Dockerfile.claude
    image: claude-code-sandbox
    container_name: claude-experiment
    volumes:
      - ./:/home/claude/workspace
      # Optional: Mount your SSH keys for git operations
      # - ~/.ssh:/home/claude/.ssh:ro
    environment:
      - TERM=xterm-256color
    stdin_open: true
    tty: true
    command: claude --dangerously-skip-permissions
```

Run with:
```bash
docker-compose -f docker-compose.claude.yml run --rm claude-code
```

## Safety Features

### 1. Isolated Experiments

Create a dedicated experiment directory:

```bash
#!/bin/bash
# save as: claude-sandbox.sh

# Create isolated experiment
EXPERIMENT_NAME="claude-exp-$(date +%Y%m%d-%H%M%S)"
mkdir -p ~/claude-experiments/$EXPERIMENT_NAME
cd ~/claude-experiments/$EXPERIMENT_NAME

# Copy any needed files
# cp -r /path/to/template/* .

# Run Claude Code in Docker
docker run -it --rm \
  -v $(pwd):/home/claude/workspace \
  --name $EXPERIMENT_NAME \
  claude-code-sandbox \
  claude --dangerously-skip-permissions

echo "Experiment saved in: ~/claude-experiments/$EXPERIMENT_NAME"
```

### 2. Enhanced Dockerfile with Development Tools

Save as `Dockerfile.claude-dev`:

```dockerfile
FROM ubuntu:22.04

# Install comprehensive development tools
RUN apt-get update && apt-get install -y \
    # Basic tools
    curl git wget sudo vim nano \
    # Build tools
    build-essential cmake \
    # Node.js (via NodeSource)
    ca-certificates gnupg \
    # Python
    python3 python3-pip python3-venv \
    # Useful utilities
    jq tree htop ripgrep fd-find \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20.x
RUN mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# Create claude user
RUN useradd -m -s /bin/bash claude && \
    echo 'claude ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER claude
WORKDIR /home/claude

# Install Claude Code
RUN npm install -g @anthropic-ai/claude-code

# Set up workspace
RUN mkdir -p /home/claude/workspace

WORKDIR /home/claude/workspace

# Configure git (optional)
RUN git config --global user.name "Claude Code" && \
    git config --global user.email "claude@example.com"

ENV SHELL=/bin/bash
ENV TERM=xterm-256color
```

## Common Use Cases

### 1. Quick Test
```bash
# Test a single file
echo "console.log('Hello from Claude Code');" > test.js
docker run -it --rm -v $(pwd):/home/claude/workspace claude-code-sandbox claude --dangerously-skip-permissions
```

### 2. Project Development
```bash
# Work on existing project
cd /path/to/my-project
docker run -it --rm \
  -v $(pwd):/home/claude/workspace \
  -v ~/.gitconfig:/home/claude/.gitconfig:ro \
  claude-code-sandbox \
  claude --dangerously-skip-permissions
```

### 3. With MCP Servers
Create `.mcp.json` in your project:
```json
{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/claude/workspace"]
    }
  }
}
```

Run with MCP:
```bash
docker run -it --rm \
  -v $(pwd):/home/claude/workspace \
  claude-code-sandbox \
  claude --dangerously-skip-permissions --mcp-config /home/claude/workspace/.mcp.json
```

## Cleanup Scripts

### 1. Remove All Claude Containers
```bash
#!/bin/bash
# save as: claude-cleanup.sh

echo "Cleaning up Claude Code Docker resources..."

# Stop all claude containers
docker ps -a --filter "name=claude" -q | xargs -r docker stop

# Remove all claude containers
docker ps -a --filter "name=claude" -q | xargs -r docker rm

# Optional: Remove the image
read -p "Remove claude-code-sandbox image? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker rmi claude-code-sandbox
fi

echo "Cleanup complete!"
```

### 2. Archive Experiments
```bash
#!/bin/bash
# save as: claude-archive.sh

EXPERIMENTS_DIR=~/claude-experiments
ARCHIVE_DIR=~/claude-archives

mkdir -p $ARCHIVE_DIR

# Archive experiments older than 7 days
find $EXPERIMENTS_DIR -maxdepth 1 -type d -mtime +7 -exec basename {} \; | while read exp; do
    if [ "$exp" != "$(basename $EXPERIMENTS_DIR)" ]; then
        tar -czf "$ARCHIVE_DIR/$exp.tar.gz" -C "$EXPERIMENTS_DIR" "$exp"
        rm -rf "$EXPERIMENTS_DIR/$exp"
        echo "Archived: $exp"
    fi
done
```

## Best Practices

1. **Always use `--rm` flag** to automatically remove containers after exit
2. **Mount specific directories** rather than entire home directory
3. **Use read-only mounts** for sensitive files (e.g., SSH keys)
4. **Create experiments in isolated directories** for easy cleanup
5. **Regularly clean up old experiments** to save disk space

## Troubleshooting

### Permission Issues
```bash
# If you encounter permission issues with mounted volumes
docker run -it --rm \
  -v $(pwd):/home/claude/workspace \
  -e USER_ID=$(id -u) \
  -e GROUP_ID=$(id -g) \
  claude-code-sandbox \
  bash -c 'sudo chown -R $USER_ID:$GROUP_ID /home/claude/workspace && claude --dangerously-skip-permissions'
```

### Network Access
```bash
# If Claude Code needs network access for package installation
docker run -it --rm \
  --network host \
  -v $(pwd):/home/claude/workspace \
  claude-code-sandbox \
  claude --dangerously-skip-permissions
```

## Security Notes

⚠️ **Warning**: `--dangerously-skip-permissions` bypasses security checks. Only use in:
- Isolated Docker containers
- With non-sensitive test data
- For experimentation and learning

Never use this mode with:
- Production code
- Sensitive data
- Systems with important files

## Quick Reference

```bash
# Build image
docker build -f Dockerfile.claude -t claude-code-sandbox .

# Basic run
docker run -it --rm -v $(pwd):/home/claude/workspace claude-code-sandbox claude --dangerously-skip-permissions

# With Docker Compose
docker-compose -f docker-compose.claude.yml run --rm claude-code

# Cleanup all
docker ps -aq --filter "name=claude" | xargs -r docker rm -f

# Remove image
docker rmi claude-code-sandbox
```

---

This setup provides a safe, isolated environment for experimenting with Claude Code while maintaining easy cleanup and management.