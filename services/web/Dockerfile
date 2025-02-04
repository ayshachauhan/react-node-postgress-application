FROM node:20-alpine AS base
WORKDIR /app
COPY . .

# Enable Corepack and install pnpm explicitly
RUN corepack enable && corepack prepare pnpm@8.15.3 --activate || npm install -g pnpm@8.15.3

# Create build image for building the web
FROM base AS build
ARG NEXT_PUBLIC_API_BASE_URL
ARG ENVIRONMENT
ARG NEXT_PUBLIC_ENABLE_AI_CHAT
ENV ENVIRONMENT=${ENVIRONMENT}
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_ENABLE_AI_CHAT=${NEXT_PUBLIC_ENABLE_AI_CHAT}
RUN apk add --no-cache bash && \
    pnpm install --frozen-lockfile && \
    pnpm turbo build --filter=web

FROM node:20-alpine AS final
WORKDIR /app
RUN npm install express@4.18.3 body-parser@1.20.2 next@14.1.0
COPY --from=build /app/services/web/.next /app/.next
COPY --from=build /app/services/web/server.js /app/server.js
COPY --from=build /app/services/web/next.config.js /app/next.config.js
COPY --from=build /app/services/web/public /app/public


# Create a final image
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=final /app .

ENV NODE_ENV=production

ARG WEB_PORT
ENV WEB_PORT=$WEB_PORT

EXPOSE $WEB_PORT

CMD ["node", "server.js"]
