FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    OLLAMA_URL=http://localhost:11434 \
    OLLAMA_MODEL=gemma3:latest \
    MAX_HISTORY=10 \
    FRONTEND_URL=http://localhost:5173

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -L https://ollama.com/download/ollama-linux-amd64.tar.zst \
    -o /tmp/ollama.tar.zst \
    && apt-get update \
    && apt-get install -y --no-install-recommends zstd \
    && mkdir -p /usr/local \
    && tar --use-compress-program=unzstd -xf /tmp/ollama.tar.zst -C /usr/local \
    && rm -f /tmp/ollama.tar.zst \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Make startup script executable
RUN chmod +x start.sh

# FastAPI + Ollama
EXPOSE 8000 11434

# Let start.sh handle startup
CMD ["./start.sh"]