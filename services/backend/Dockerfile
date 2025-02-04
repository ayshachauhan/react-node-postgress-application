FROM node:20-slim AS base
#RUN corepack enable
COPY . /app
WORKDIR /app

# Fix Corepack issue
RUN corepack disable && rm -rf ~/.cache/corepack && corepack enable

# Install pnpm explicitly to avoid key verification issues
RUN corepack prepare pnpm@8.15.3 --activate || npm install -g pnpm@8.15.3

# Create build image for building the web
FROM base AS build
RUN pnpm install --frozen-lockfile
RUN pnpm turbo build --filter=backend

# install dependencies
FROM build as prod_dependencies
RUN pnpm --filter backend --prod deploy pruned

# Create an final image
FROM node:20-slim AS runner
COPY --from=prod_dependencies /app/pruned/node_modules /app/node_modules
COPY --from=build /app/services/backend/dist /app/dist

WORKDIR /app

ENV NODE_ENV=production

ARG PORT
ENV PORT $PORT

EXPOSE $PORT

CMD ["node" , "dist/main.js"]
