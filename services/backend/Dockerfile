FROM node:20-slim AS base
RUN corepack enable
COPY . /app
WORKDIR /app

# Create a new image for production dependencies
FROM base as prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Create build image for building the web
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm turbo build --filter=backend

# Create an image base
FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/services/backend/dist /app/services/backend/dist

ENV NODE_ENV=production

ARG PORT
ENV PORT $PORT

EXPOSE $PORT

CMD pnpm --filter "{services/backend}" run start:prod