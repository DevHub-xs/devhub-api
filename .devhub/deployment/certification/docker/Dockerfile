# Multi-stage Dockerfile for Certification environment
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app .

EXPOSE 3000
USER node

CMD ["npm", "start"]
