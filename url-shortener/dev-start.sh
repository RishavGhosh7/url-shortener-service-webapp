#!/bin/bash

# URL Shortener Development Setup Script

echo "🚀 Starting URL Shortener Development Environment..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Starting MongoDB..."
    brew services start mongodb-community
    sleep 3
fi

# Kill any existing processes on ports 3000 and 3001
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Start backend server
echo "🔧 Starting backend server on port 3000..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start React development server
echo "⚛️  Starting React development server on port 3001..."
cd client && PORT=3001 npm start &
FRONTEND_PID=$!

# Wait for React to start
sleep 5

echo ""
echo "✅ Development environment is ready!"
echo ""
echo "📱 Frontend (React): http://localhost:3001"
echo "🔧 Backend (API):    http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for user to stop
wait
