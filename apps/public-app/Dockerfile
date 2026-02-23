# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx nx build public-app --configuration=production


# Runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

ARG APP_VERSION=dev
ENV NODE_ENV=production
ENV PORT=4000
ENV APP_VERSION=$APP_VERSION

COPY --from=builder /app/dist/apps/public-app ./dist

EXPOSE 4000

CMD ["node", "dist/server/server.mjs"]
