#!/bin/bash
# Quick local testing script

echo "🚀 Starting local test server..."
cd ~/Projects/bosser/docs

# Start server in background
python3 -m http.server 8000 &
SERVER_PID=$!

echo "📂 Server running at: http://localhost:8000"
echo "🔧 Server PID: $SERVER_PID"
echo ""
echo "✅ Test checklist:"
echo "  - Homepage loads (http://localhost:8000)"
echo "  - Shows 8 articles in grid"
echo "  - Article count displays 8"
echo "  - Individual article pages work"
echo "  - No console errors"
echo ""
echo "⏹️  To stop server: kill $SERVER_PID"
echo "   Or press Ctrl+C if running in foreground"

# Keep script running so server stays active
wait $SERVER_PID