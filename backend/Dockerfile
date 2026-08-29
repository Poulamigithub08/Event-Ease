FROM node:24-alpine

WORKDIR /app

# Install dependencies first for better Docker layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application
COPY . .

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server.js"]