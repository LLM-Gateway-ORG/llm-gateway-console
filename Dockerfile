# Use an official Node runtime as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the application code
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the application
RUN npm run build && \
    # Clean up npm cache and unnecessary files to reduce image size
    npm cache clean --force && \
    rm -rf /root/.npm


# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]