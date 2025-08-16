FROM node:lts-alpine AS build

WORKDIR /usr/src/app

# Copy package files and install deps
COPY package*.json tsconfig*.json nest-cli.json ./
RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm install

# Copy all code (needed because libs/ are shared across services)
COPY apps/api-gateway ./apps/api-gateway
# COPY libs ./libs

# Expose the service’s port (example: 8080 for api-gateway)
EXPOSE 8080

# Run in dev mode with hot reload (replace service name as needed)
CMD ["npm", "run", "start:dev:api-gateway"]
