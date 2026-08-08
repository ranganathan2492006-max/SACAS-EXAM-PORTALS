# Stage 1: Build React Client compiled bundle
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Serve the unified application using Express
FROM node:20-alpine
WORKDIR /app

# Copy server package manifest and install production packages only
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy server source code
COPY server/ ./server/

# Copy built frontend assets from Stage 1 into the expected directory structure
COPY --from=client-builder /app/client/dist ./client/dist

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Set working directory to server to run the entrypoint script
WORKDIR /app/server
CMD ["node", "server.js"]
