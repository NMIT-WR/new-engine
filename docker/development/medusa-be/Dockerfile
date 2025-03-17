FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apt update && apt install curl -y

#temp solution to https://github.com/nodejs/corepack/issues/612
RUN npm i -g corepack@latest

RUN corepack enable
RUN corepack install -g pnpm@10.5.2
WORKDIR /var/www