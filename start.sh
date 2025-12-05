#!/bin/bash
# BizBloom AI - Start Both Servers
# Usage: ./start.sh

echo "🚀 BizBloom AI - Starting Servers..."
echo "=================================="
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start Backend
echo "Starting Backend on http://localhost:8000..."
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Give backend a moment to start
sleep 3

# Start Frontend
echo "Starting Frontend on http://localhost:5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=================================="
echo "✅ Both servers are running!"
echo ""
echo "   🌐 Frontend: http://localhost:5173"
echo "   🔧 Backend:  http://localhost:8000"
echo "   📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "=================================="

# Wait for both processes
wait
