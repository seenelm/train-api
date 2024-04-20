FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
COPY . /app
EXPOSE 3000

# Build api
RUN npm run build:dev

# Set environment variables
ENV NODE_ENV=development
CMD ["nodemon", "./dist/server.js"]