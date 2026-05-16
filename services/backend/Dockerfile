FROM node:20-slim AS base

RUN corepack enable

COPY . /app
WORKDIR /app

# Fix Corepack issue
RUN corepack disable && rm -rf ~/.cache/corepack && corepack enable

# Install pnpm explicitly
RUN corepack prepare pnpm@8.15.3 --activate || npm install -g pnpm@8.15.3

# =========================
# BUILD STAGE
# =========================
FROM base AS build

# Increase Node memory for low-memory EC2
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Reduce pnpm memory/disk pressure
ENV PNPM_STORE_DIR=/tmp/pnpm-store

# Install dependencies with low concurrency
RUN pnpm install --frozen-lockfile --network-concurrency=1

# Build backend with single worker to avoid memory freeze
RUN pnpm turbo build --filter=backend --concurrency=1

# =========================
# PRODUCTION DEPENDENCIES
# =========================
FROM build AS prod_dependencies

RUN pnpm --filter backend --prod deploy pruned

# =========================
# FINAL RUNNER IMAGE
# =========================
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Runtime memory limit
ENV NODE_OPTIONS="--max-old-space-size=1024"

ARG PORT=1600
ENV PORT=$PORT

# Copy production node_modules
COPY --from=prod_dependencies /app/pruned/node_modules /app/node_modules

# Copy backend build
COPY --from=build /app/services/backend/dist /app/dist

# Copy migrations
COPY --from=build /app/services/backend/migrations /app/migrations

# Copy migration runner
COPY --from=build /app/services/backend/migration-runner /app/migration-runner

# Copy package.json
COPY --from=build /app/services/backend/package.json /app/package.json

EXPOSE 1600

CMD ["node", "dist/main.js"]