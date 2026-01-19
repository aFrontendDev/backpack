FROM node:24-alpine

# Install build dependencies for native modules and Litestream
RUN apk add --no-cache ca-certificates wget python3 make g++

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

# Set host to bind to all interfaces (needed for Docker)
ENV HOST=0.0.0.0

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# Create data directory for SQLite
RUN mkdir -p /data

# Copy Litestream config
COPY litestream.yml /etc/litestream.yml

# Copy and setup startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 4321

CMD ["/app/start.sh"]
