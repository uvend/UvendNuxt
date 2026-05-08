FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Prepare Nuxt (generates .nuxt types)
RUN npx nuxt prepare

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]