#!/bin/bash
# ─────────────────────────────────────────────
#  EventEase Chatbot — Start Script
#  Usage: bash start.sh
# ─────────────────────────────────────────────

set -e

CHATBOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
#VENV_DIR="$CHATBOT_DIR/venv"

echo ""
echo "🎪 EventEase Chatbot Startup"
echo "────────────────────────────"

# 1. Check Python
if ! command -v python3 &>/dev/null; then
  echo "❌ Python 3 is not installed. Install it from https://python.org"
  exit 1
fi
echo "✅ Python: $(python3 --version)"

# 2. Check Ollama
if ! command -v ollama &>/dev/null; then
  echo ""
  echo "❌ Ollama is not installed."
  echo "   Install from: https://ollama.com/download"
  echo "   Then run:     ollama pull gemma3:latest"
  exit 1
fi
echo "✅ Ollama: found"

# # 3. Create venv if needed
# if [ ! -d "$VENV_DIR" ]; then
#   echo "📦 Creating virtual environment..."
#   python3 -m venv "$VENV_DIR"
# fi

# # 4. Activate venv
# source "$VENV_DIR/bin/activate"

# # 5. Install dependencies
# echo "📦 Installing Python dependencies..."
# pip install -q -r "$CHATBOT_DIR/requirements.txt"
# echo "✅ Dependencies installed"

# 6. Check if Ollama is running, start if not
if ! curl -s http://localhost:11434 &>/dev/null; then
  echo "🚀 Starting Ollama server..."
  ollama serve &
  sleep 3
fi
echo "✅ Ollama server: running"

# 7. Check if gemma3n model is pulled
if ! ollama list 2>/dev/null | grep -q "gemma3:latest"; then
  echo ""
  echo "📥 Pulling gemma3:latest model (this may take a few minutes on first run)..."
  ollama pull gemma3:latest
  echo "✅ Model downloaded"
else
  echo "✅ gemma3:latest model: ready"
fi

# 8. Start FastAPI
echo ""
echo "🚀 Starting EventEase Chatbot API on http://localhost:8000"
echo "   Press Ctrl+C to stop"
echo ""
cd "$CHATBOT_DIR"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
