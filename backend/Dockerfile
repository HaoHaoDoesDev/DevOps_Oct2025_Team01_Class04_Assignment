# Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Only copy the production dependencies (ignores devDependencies)
COPY package*.json ./
RUN npm ci --only=production

# Copy the bundled code from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/index.js"]