FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY tsconfig.json ./ 

COPY services/user-service/package.json services/user-service/tsconfig.json ./services/user-service/

RUN pnpm install --filter user-service...

COPY services/user-service/src ./services/user-service/src

WORKDIR /app/services/user-service
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/services/user-service/dist ./dist
COPY --from=builder /app/services/user-service/package.json ./package.json

RUN npm install -g pnpm && pnpm install --prod

EXPOSE 5002
CMD ["node", "dist/index.js"]