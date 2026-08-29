#!/bin/sh

set -e

MODEL="${OLLAMA_MODEL:-qwen2.5:3b}"

echo "🚀 Starting Ollama..."

ollama serve &

OLLAMA_PID=$!

echo "⏳ Waiting for Ollama to become ready..."

until curl -sf http://localhost:11434/api/tags > /dev/null; do
    sleep 2
done

echo "✅ Ollama is ready"

if ! ollama list | grep -q "$MODEL"; then
    echo "📥 Pulling model: $MODEL"
    ollama pull "$MODEL"
    echo "✅ Model downloaded"
else
    echo "✅ Model already available: $MODEL"
fi

echo "🚀 Ollama running with $MODEL"

wait "$OLLAMA_PID"
