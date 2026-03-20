FROM node:20-alpine AS pruner

ARG TURBO_VERSION=2.8.13

WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm dlx turbo@${TURBO_VERSION} prune @talentsync/resume-parser-service --docker


FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache tesseract-ocr tesseract-ocr-data-eng poppler-utils

RUN npm install -g pnpm

COPY --from=pruner /app/out/json/ .

RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

RUN pnpm exec turbo run build --filter=@talentsync/resume-parser-service...

RUN pnpm --filter @talentsync/resume-parser-service worker:build

RUN pnpm deploy --legacy --filter=@talentsync/resume-parser-service --prod /prod/resume-parser-service


FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache tesseract-ocr tesseract-ocr-data-eng poppler-utils

RUN addgroup -S app && adduser -S app -G app

COPY --from=builder --chown=app:app /prod/resume-parser-service/ .

USER app

EXPOSE 4002

CMD ["node", "dist/server.js"]
