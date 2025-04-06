FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ARG APP_VERSION
ARG NODE_ENV=$NODE_ENV
LABEL train.api.version="$APP_VERSION"
LABEL train.api.build.timestamp="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"

# Build api
RUN npm run build

# Set environment variables
ENV NODE_ENV=$NODE_ENV
CMD ["node", "./dist/server.js"]
