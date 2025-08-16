FROM node:lts-alpine AS build

WORKDIR /usr/src/app

# Copy package files and install deps
COPY package*.json tsconfig*.json nest-cli.json ./
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm install

COPY apps/auth-service ./apps/auth-service
# COPY libs ./libs

# Expose the service’s port (example: 6001 for api-gateway)
EXPOSE 6001

# Run in dev mode with hot reload (replace service name as needed)
CMD ["npm", "run", "start:dev:auth-service"]
