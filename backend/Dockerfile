FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install  # Or 'npm install' based on your lockfile
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]