# =========================
# BASE
# =========================
FROM node:20-slim AS base

WORKDIR /app
RUN corepack enable
RUN corepack prepare pnpm@8.15.3 --activate

COPY . .

# =========================
# INSTALL
# =========================
FROM base AS deps

RUN pnpm install --frozen-lockfile

# =========================
# BUILD
# =========================
FROM deps AS build

RUN pnpm --filter @packages/entities build
RUN pnpm --filter @azentia/backend build

# =========================
# RUNTIME
# =========================
FROM node:20-slim AS runner

WORKDIR /app
RUN corepack enable
RUN corepack prepare pnpm@8.15.3 --activate

COPY --from=deps /app /app
COPY --from=build /app/services/backend/dist /app/services/backend/dist

WORKDIR /app/services/backend

EXPOSE 1600

CMD ["node", "dist/main.js"]