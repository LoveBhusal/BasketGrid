#!/bin/bash

# Start the frontend (Nginx)
echo "Starting frontend..."
cd frontend
nginx -g 'daemon off;' &

# Wait for Nginx to start up
sleep 5

# Start the backend (Node.js)
echo "Starting backend..."
cd ../backend
node index.js
