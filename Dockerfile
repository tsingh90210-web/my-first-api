FROM node:20-alpine

WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install ALL dependencies (including dev tools needed for build)
RUN npm ci --ignore-engines

# Copy Prisma and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy all project code
COPY . .

# Build the app
RUN npm run build

# Expose the correct port
EXPOSE 8080

# Start the app
CMD ["node", "dist/main.js"]
