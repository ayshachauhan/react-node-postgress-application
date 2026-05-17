# =========================
# BASE
# =========================
FROM node:20-slim AS base

RUN corepack enable

WORKDIR /app

# Copy repo
COPY . .

# Fix Corepack issues
RUN corepack disable && rm -rf ~/.cache/corepack && corepack enable

# Install pnpm explicitly
RUN corepack prepare pnpm@8.15.3 --activate || npm install -g pnpm@8.15.3

# =========================
# DEPENDENCIES
# =========================
FROM base AS dependencies

ENV PNPM_STORE_DIR=/tmp/pnpm-store

# Install ALL dependencies including devDependencies
RUN pnpm install --frozen-lockfile --network-concurrency=1

# =========================
# BUILD
# =========================
FROM dependencies AS build

ENV NODE_OPTIONS="--max-old-space-size=3072"

# Build backend only
RUN pnpm --filter backend build

# Verify dist exists
RUN ls -la /app/services/backend/dist

# =========================
# PRODUCTION DEPS
# =========================
FROM dependencies AS prod_dependencies

RUN pnpm --filter backend deploy --prod /app/pruned

# =========================
# RUNNER
# =========================
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=2048"

ARG PORT=1600
ENV PORT=${PORT}

# Copy production dependencies
COPY --from=prod_dependencies /app/pruned/node_modules ./node_modules

# Copy built backend
COPY --from=build /app/services/backend/dist ./dist

# Copy package.json
COPY --from=build /app/services/backend/package.json ./package.json

# Copy migrations
COPY --from=build /app/services/backend/migrations ./migrations

# Copy migration runner (if exists)
COPY --from=build /app/services/backend/migration-runner ./migration-runner

EXPOSE 1600

CMD ["node", "dist/main.js"]