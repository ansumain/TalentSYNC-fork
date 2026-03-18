# # # FROM node:20-alpine AS pruner

# # # WORKDIR /app

# # # RUN npm install -g pnpm turbo

# # # COPY . .

# # # RUN turbo prune @talentsync/analytics-service --docker


# # # FROM node:20-alpine AS builder

# # # WORKDIR /app

# # # RUN npm install -g pnpm turbo

# # # COPY --from=pruner /app/out/json/ .

# # # RUN pnpm install --frozen-lockfile

# # # COPY --from=pruner /app/out/full/ .

# # # COPY tsconfig.base.json ./tsconfig.base.json

# # # RUN pnpm turbo run build --filter=@talentsync/analytics-service...

# # # RUN pnpm --filter @talentsync/analytics-service worker:build

# # # RUN pnpm deploy --legacy --filter=@talentsync/analytics-service --prod /prod/analytics-service


# # # FROM node:20-alpine AS runtime

# # # WORKDIR /app

# # # ENV NODE_ENV=production

# # # RUN addgroup -S app && adduser -S app -G app

# # # COPY --from=builder --chown=app:app /prod/analytics-service/ .

# # # USER app

# # # EXPOSE 4004

# # # CMD ["node", "dist/server.js"]

# FROM node:20-alpine AS base
# WORKDIR /app
# RUN npm install -g pnpm

# FROM base AS deps
# COPY pnpm-lock.yaml ./
# COPY pnpm-workspace.yaml ./
# COPY package.json ./
# COPY apps/analytics-service ./apps/analytics-service
# RUN pnpm install --frozen-lockfile --config.node-linker=hoisted

# FROM base AS build
# COPY --from=deps /app /app
# WORKDIR /app/apps/analytics-service
# RUN pnpm run build

# FROM base AS prune
# WORKDIR /app
# COPY --from=build /app /app
# ENV CI=true
# RUN pnpm prune --prod --ignore-scripts

# FROM node:20-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV=production

# COPY --from=prune /app/apps/analytics-service/dist ./dist
# COPY --from=prune /app/apps/analytics-service/package.json ./
# COPY --from=prune /app/node_modules ./node_modules

# EXPOSE 4004
# CMD ["node", "dist/server.js"]

FROM node:20-alpine AS pruner

ARG TURBO_VERSION=2.8.13

WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm dlx turbo@${TURBO_VERSION} prune @talentsync/analytics-service --docker


FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY --from=pruner /app/out/json/ .

RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

RUN pnpm exec turbo run build --filter=@talentsync/analytics-service...

RUN pnpm --filter @talentsync/analytics-service worker:build

RUN pnpm deploy --legacy --filter=@talentsync/analytics-service --prod /prod/analytics-service


FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S app && adduser -S app -G app

COPY --from=builder --chown=app:app /prod/analytics-service/ .

USER app

EXPOSE 4004

CMD ["node", "dist/server.js"]