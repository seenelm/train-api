# syntax=docker/dockerfile:1.4
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG APP_VERSION
ARG NODE_ENV=$NODE_ENV
ARG MONGO_URI
ARG SECRET_CODE
ARG FIREBASE_CONFIG
LABEL train.api.version="$APP_VERSION"
LABEL train.api.build.timestamp="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"

# Build api
RUN npm run build

# Set environment variables
ENV NODE_ENV=$NODE_ENV
ENV MONGO_URI=$MONGO_URI
ENV SECRET_CODE=$SECRET_CODE
ENV FIREBASE_CONFIG=$FIREBASE_CONFIG
CMD ["node", "./dist/server.js"]
