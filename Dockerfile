FROM node:20-alpine

WORKDIR /app

# Copy dependency files first for faster, more reliable builds
COPY package*.json ./

# Install dependencies, skip version warnings
RUN npm ci --only=production --ignore-engines

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy all your project code
COPY . .

# Build your NestJS app
RUN npm run build

# Cloud Run uses port 8080 by default
EXPOSE 8080

# Start your server
CMD ["node", "dist/main.js"]
