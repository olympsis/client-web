# --- Build stage ---
FROM oven/bun:latest AS build

WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Copy the target env file as .env so Nuxt reads it during build
ARG ENV_FILE=.env
COPY ${ENV_FILE} .env

# Build the application
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN bun run build

# --- Runtime stage (only the built output, no node_modules or source) ---
FROM oven/bun:latest

WORKDIR /app

COPY --from=build /app/.output .output

EXPOSE 80

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=80

CMD ["bun", ".output/server/index.mjs"]
