FROM node:24-alpine

# Install Litestream
RUN apk add --no-cache ca-certificates wget
RUN wget -O /tmp/litestream.tar.gz https://github.com/benbjohnson/litestream/releases/download/v0.3.13/litestream-v0.3.13-linux-amd64.tar.gz \
    && tar -xzf /tmp/litestream.tar.gz -C /usr/local/bin \
    && rm /tmp/litestream.tar.gz

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

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
