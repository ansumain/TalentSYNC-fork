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