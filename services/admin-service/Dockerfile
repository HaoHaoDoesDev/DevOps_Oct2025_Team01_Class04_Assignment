
FROM node:20-alpine AS builder
WORKDIR /app


RUN npm install -g pnpm


COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

COPY tsconfig.json ./ 


COPY services/admin-service/package.json services/admin-service/tsconfig.json ./services/admin-service/


RUN pnpm install --filter admin-service...


COPY services/admin-service/src ./services/admin-service/src


WORKDIR /app/services/admin-service
RUN pnpm run build


FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/services/admin-service/dist ./dist
COPY --from=builder /app/services/admin-service/package.json ./package.json
RUN npm install -g pnpm && pnpm install --prod

EXPOSE 5001
CMD ["node", "dist/index.js"]