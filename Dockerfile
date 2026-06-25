FROM node:20-alpine

WORKDIR /app

# Copy all dependency files
COPY package*.json ./

# Install ALL dependencies (including dev ones needed for build)
RUN npm ci --ignore-engines

# Copy Prisma files and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy all your project code
COPY . .

# Now nest command exists — build works perfectly!
RUN npm run build

# Expose Cloud Run port
EXPOSE 8080

# Start the app (only production dependencies run here)
CMD ["node", "dist/main.js"]
