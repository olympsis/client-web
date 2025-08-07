# Use the official Node.js 22 image for Cloud Run compatibility
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose the port (Cloud Run will use PORT environment variable)
EXPOSE 3000

# Set environment variables for production
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000


# Start the application
CMD ["node", ".output/server/index.mjs"]