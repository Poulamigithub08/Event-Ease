# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


# Production stage
FROM nginx:alpine
ENV BACKEND_BASE_URL=http://localhost:5000/api
ENV VITE_CHATBOT_URL=http://localhost:8000
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]