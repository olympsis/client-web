# Use the official Node.js 22 image for Cloud Run compatibility
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Accept build arguments
ARG MODE
ARG API
ARG APL_KEY_ID
ARG APL_TEAM_ID
ARG APL_APP_ID
ARG APL_MAPKIT_SNAPSHOT_TOKEN
ARG MAPKIT_ORIGIN
ARG MAPKIT_KEY
ARG FB_API_KEY
ARG FB_AUTH_DOMAIN
ARG FB_PROJECT_ID
ARG FB_STORAGE_BUCKET
ARG FB_MESSAGING_SENDER_ID
ARG FB_APP_ID
ARG FB_MEASUREMENT_ID
ARG DSN

# Set environment variables from build args
ENV MODE=${MODE}
ENV API=${API}
ENV APL_KEY_ID=${APL_KEY_ID}
ENV APL_TEAM_ID=${APL_TEAM_ID}
ENV APL_APP_ID=${APL_APP_ID}
ENV APL_MAPKIT_SNAPSHOT_TOKEN=${APL_MAPKIT_SNAPSHOT_TOKEN}
ENV MAPKIT_ORIGIN=${MAPKIT_ORIGIN}
ENV MAPKIT_KEY=${MAPKIT_KEY}
ENV FB_API_KEY=${FB_API_KEY}
ENV FB_AUTH_DOMAIN=${FB_AUTH_DOMAIN}
ENV FB_PROJECT_ID=${FB_PROJECT_ID}
ENV FB_STORAGE_BUCKET=${FB_STORAGE_BUCKET}
ENV FB_MESSAGING_SENDER_ID=${FB_MESSAGING_SENDER_ID}
ENV FB_APP_ID=${FB_APP_ID}
ENV FB_MEASUREMENT_ID=${FB_MEASUREMENT_ID}
ENV DSN=${DSN}

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose the port (Cloud Run will use PORT environment variable)
EXPOSE 80

# Set environment variables for production
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=80


# Start the application
CMD ["node", ".output/server/index.mjs"]