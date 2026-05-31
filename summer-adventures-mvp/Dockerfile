FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Copy env file
COPY .env.local ./

# Build Next.js app
RUN npm run build

# Expose Next.js port
EXPOSE 3001

# Start Next.js in production mode on port 3001
CMD ["npm", "run", "start", "--", "-p", "3001"]
