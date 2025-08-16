FROM node:lts-alpine AS build

WORKDIR /usr/src/app

# Copy package files and install deps
COPY package*.json tsconfig*.json nest-cli.json ./
RUN npm install --legacy-peer-deps

# Copy all code (needed because libs/ are shared across services)
COPY . .

# Expose the service’s port (example: 3000 for api-gateway)
EXPOSE 3000

# Run in dev mode with hot reload (replace service name as needed)
CMD ["npm", "run", "start:dev:user-service"]
