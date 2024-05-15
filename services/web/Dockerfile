# FROM node:20-alpine AS base

FROM node:20-slim AS base
RUN corepack enable
COPY . /app
WORKDIR /app

# Create a new image for production dependencies
FROM base as prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Create build image for building the web
FROM base AS build
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm turbo build --filter=web

# Create an image base
FROM base

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/services/web/.next /app/services/web/.next 

ENV NODE_ENV=production

ARG WEB_PORT
ENV WEB_PORT=$WEB_PORT

EXPOSE $WEB_PORT

CMD pnpm --filter "{services/web}" run start:prod