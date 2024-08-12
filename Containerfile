# Use an official Node.js runtime as a parent image
FROM node:20.10.0 AS build

# Set the working directory
WORKDIR /usr/src/app/backend
COPY start.sh /usr/src/app
RUN chmod +rwx /usr/src/app/start.sh
# Copy the package.json and package-lock.json files
COPY package*.json ./
# Install dependencies
RUN npm install 
# Copy the rest of the application code
COPY . .
# Expose the port your app runs on
EXPOSE 5001

# Set the working directory
WORKDIR /usr/src/app/frontend

RUN cd /usr/src/app/frontend

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Production Phase
FROM nginx:alpine

# Copy the built files from the build phase
COPY --from=build /usr/src/app/frontend/build /usr/share/nginx/html

# Copy the Nginx configuration file
COPY /usr/src/app/frontend/nginix.conf /etc/nginx/conf.d/default.conf

COPY /usr/src/app/frontend/ssl/ssl-cert.key /etc/ssl/private/ssl-cert.key

COPY /usr/src/app/frontend/ssl/ssl-cert.pem /etc/ssl/certs/ssl-cert.pem

# Expose port 80 and 443 for HTTP and HTTPS
EXPOSE 80
EXPOSE 443

WORKDIR /usr/src/app
RUN cd /usr/src/app
# Start Nginx
CMD ["./start.sh"]