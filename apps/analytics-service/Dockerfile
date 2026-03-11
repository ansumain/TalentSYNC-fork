# FROM node:20-alpine AS base

# RUN npm install -g pnpm

# WORKDIR /app

# COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json ./
# COPY apps/application-service/package.json ./apps/application-service/

# RUN pnpm install --frozen-lockfile

# COPY apps/application-service ./apps/application-service

# WORKDIR /app/apps/application-service
# RUN ../../node_modules/.bin/tsc

# RUN mkdir -p uploads temp

# FROM node:20-alpine

# WORKDIR /app

# COPY --from=base /app/apps/application-service/dist ./dist
# COPY --from=base /app/apps/application-service/node_modules ./node_modules
# COPY --from=base /app/node_modules ../node_modules
# COPY --from=base /app/apps/application-service/package.json ./

# RUN mkdir -p uploads temp

# EXPOSE 4003

# CMD ["node", "dist/server.js"]


FROM node:20-alpine
 
WORKDIR /app
 
RUN npm install -g pnpm
ENV CI=true
 
COPY . .
 
RUN pnpm install

RUN pnpm --filter @talentsync/types build && \
    pnpm --filter @talentsync/config build && \
    pnpm --filter @talentsync/models build && \
    pnpm --filter @talentsync/analytics-service build
 
EXPOSE 4003
 
CMD ["pnpm", "--filter", "@talentsync/analytics-service", "start"]