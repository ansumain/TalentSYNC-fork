FROM node:20-alpine AS pruner

ARG TURBO_VERSION=2.8.13

WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm dlx turbo@${TURBO_VERSION} prune @talentsync/application-service --docker


FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY --from=pruner /app/out/json/ .

RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

RUN pnpm exec turbo run build --filter=@talentsync/application-service...

RUN pnpm deploy --legacy --filter=@talentsync/application-service --prod /prod/application-service


FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S app && adduser -S app -G app

COPY --from=builder --chown=app:app /prod/application-service/ .

USER app

EXPOSE 4003

CMD ["node", "dist/server.js"]