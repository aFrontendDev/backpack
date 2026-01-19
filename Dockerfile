# Build stage
FROM node:24-alpine AS builder

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:24-alpine

# Install only runtime dependencies
RUN apk add --no-cache ca-certificates wget

# Install Litestream (detect architecture)
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then \
      LITESTREAM_ARCH="linux-arm64"; \
    else \
      LITESTREAM_ARCH="linux-amd64"; \
    fi && \
    wget -O /tmp/litestream.tar.gz https://github.com/benbjohnson/litestream/releases/download/v0.3.13/litestream-v0.3.13-${LITESTREAM_ARCH}.tar.gz \
    && tar -xzf /tmp/litestream.tar.gz -C /usr/local/bin \
    && rm /tmp/litestream.tar.gz

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set host to bind to all interfaces (needed for Docker)
ENV HOST=0.0.0.0

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy Litestream config and startup script
COPY litestream.yml /etc/litestream.yml
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Create data directory and set ownership
RUN mkdir -p /data && chown -R appuser:appgroup /data /app

# Switch to non-root user
USER appuser

EXPOSE 4321

CMD ["/app/start.sh"]
