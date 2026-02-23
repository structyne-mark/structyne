# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx nx build public-app --configuration=production


# Runtime stage
FROM node:22-alpine AS runner

RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    apk add --no-cache wget

WORKDIR /app

ARG APP_VERSION=dev
ENV NODE_ENV=production
ENV PORT=4000
ENV APP_VERSION=$APP_VERSION

COPY --from=builder --chown=appuser:appgroup /app/dist/apps/public-app ./dist

USER appuser

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/ || exit 1

CMD ["node", "dist/server/server.mjs"]
