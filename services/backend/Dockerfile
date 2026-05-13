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

RUN pnpm install --frozen-lockfile

# Build backend
RUN pnpm turbo build --filter=backend

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

# Copy production node_modules
COPY --from=prod_dependencies /app/pruned/node_modules /app/node_modules

# Copy backend dist
COPY --from=build /app/services/backend/dist /app/dist

# Copy migrations
COPY --from=build /app/services/backend/migrations /app/migrations

# Copy migration runner
COPY --from=build /app/services/backend/migration-runner /app/migration-runner

# Copy package.json
COPY --from=build /app/services/backend/package.json /app/package.json

ENV NODE_ENV=production

ARG PORT
ENV PORT=$PORT

EXPOSE $PORT

CMD ["node", "dist/main.js"]