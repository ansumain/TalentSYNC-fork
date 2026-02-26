FROM node:20-alpine AS base

RUN apk add --no-cache \
    tesseract-ocr \
    tesseract-ocr-data-eng \
    poppler-utils

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json ./

COPY apps/resume-parser-service/package.json ./apps/resume-parser-service/

RUN pnpm install --frozen-lockfile

COPY apps/resume-parser-service ./apps/resume-parser-service

WORKDIR /app/apps/resume-parser-service
RUN ../../node_modules/.bin/tsc

RUN mkdir -p uploads temp

FROM node:20-alpine

RUN apk add --no-cache \
    tesseract-ocr \
    tesseract-ocr-data-eng \
    poppler-utils

WORKDIR /app

COPY --from=base /app/apps/resume-parser-service/dist ./dist
COPY --from=base /app/apps/resume-parser-service/node_modules ./node_modules
COPY --from=base /app/node_modules ../node_modules
COPY --from=base /app/apps/resume-parser-service/package.json ./

RUN mkdir -p uploads temp

EXPOSE 4002

CMD ["node", "dist/server.js"]
