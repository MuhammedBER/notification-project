# Build stage
FROM node:20-alpine as build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Pass backend URL during build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the Vite project
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Install 'serve' to run the static site
RUN npm install -g serve

# Copy the built output from the build stage
COPY --from=build /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
