FROM node:18-alpine

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install 

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the app — simplified and reliable
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
