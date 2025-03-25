#!/bin/bash

# Display welcome message
echo "Starting AI Tweet Generator..."
echo "Make sure you've updated your Anthropic API key in backend/.env"
echo "--------------------------------------------------------"

# Start backend server in the background
echo "Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to initialize
sleep 5

# Start frontend server in the background
echo "Starting frontend server..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

# Wait for user to press Ctrl+C
echo "--------------------------------------------------------"
echo "AI Tweet Generator is running!"
echo "Access the app at: http://localhost:3000"
echo "Press Ctrl+C to stop the servers"
echo "--------------------------------------------------------"

# Trap Ctrl+C and kill the servers
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 