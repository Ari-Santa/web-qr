# Use official Node.js image
FROM node:23-alpine
# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
# Create app directory

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Expose the app port (adjust if different)
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]
