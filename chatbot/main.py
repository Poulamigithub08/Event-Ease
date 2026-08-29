"""
EventEase AI Chatbot — FastAPI + Ollama + Gemma 3n
Runs on http://localhost:8000
"""

import os
import httpx
import json
import pathlib
import fastapi # type: ignore
import fastapi.middleware.cors # type: ignore
import pydantic # type: ignore
import typing

# ─────────────────────────────────────────────
# App Setup
# ─────────────────────────────────────────────
app = fastapi.FastAPI(
    title="EventEase Chatbot API",
    description="AI chatbot powered by Ollama + Gemma 3n",
    version="1.0.0"
)

# CORS — allow frontend origin
app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",   # Alt React port
        os.getenv("FRONTEND_URL", ""),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# Config
# ─────────────────────────────────────────────
OLLAMA_URL  = os.getenv("OLLAMA_URL",  "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma3")   # ollama pull gemma3n
MAX_HISTORY = int(os.getenv("MAX_HISTORY", "10"))      # keep last N message pairs

# Load knowledge base once at startup
KB_PATH = pathlib.Path(__file__).parent / "knowledge" / "eventease_docs.md"
KNOWLEDGE_BASE: str = KB_PATH.read_text(encoding="utf-8")

SYSTEM_PROMPT = f"""You are EventBot, the friendly AI assistant for EventEase — an event management platform.

Your job is to help users by answering questions about EventEase: how to use the platform, its features, roles (Host vs Guest), how to create/register for events, navigation, and anything else covered in the documentation below.

Rules:
- Be concise, friendly, and helpful.
- Only answer questions related to EventEase. If asked something unrelated, politely redirect.
- Use the documentation below as your primary source of truth.
- When giving navigation instructions, always mention the page path (e.g. "Go to /myevents").
- If something is not covered in the docs, say "I'm not sure about that — please contact support at /contactus".
- Never make up features that don't exist in EventEase.
- Keep responses short (2–5 sentences) unless the user asks for detailed steps.

--- EventEase Documentation ---
{KNOWLEDGE_BASE}
--- End of Documentation ---
"""

# ─────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────
class Message(pydantic.BaseModel):
    role: str          # "user" or "assistant"
    content: str

class ChatRequest(pydantic.BaseModel):
    message: str
    history: typing.Optional[list[Message]] = []   # frontend sends conversation history

class ChatResponse(pydantic.BaseModel):
    reply: str
    model: str

# ─────────────────────────────────────────────
# Helper — call Ollama
# ─────────────────────────────────────────────
async def call_ollama(messages: list[dict]) -> str:
    """Send messages to Ollama and return the assistant reply."""
    payload = {
        "model": OLLAMA_MODEL,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": 0.4,    # lower = more factual, less hallucination
            "top_p": 0.9,
            "num_predict": 512,    # max tokens in reply
        }
    }
    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            resp = await client.post(f"{OLLAMA_URL}/api/chat", json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["message"]["content"].strip()
        except httpx.ConnectError:
            raise fastapi.HTTPException(
                status_code=503,
                detail="Ollama is not running. Start it with: ollama serve"
            )
        except httpx.HTTPStatusError as e:
            raise fastapi.HTTPException(
                status_code=502,
                detail=f"Ollama returned error: {e.response.text}"
            )
        except KeyError:
            raise fastapi.HTTPException(
                status_code=502,
                detail="Unexpected response format from Ollama"
            )

# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────
@app.get("/")
async def root():
    return {"status": "ok", "message": "EventEase Chatbot API is running ✅"}


@app.get("/health")
async def health():
    """Check if Ollama is reachable and model is loaded."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{OLLAMA_URL}/api/tags")
            resp.raise_for_status()
            models = [m["name"] for m in resp.json().get("models", [])]
            model_ready = any(OLLAMA_MODEL in m for m in models)
            return {
                "status": "ok",
                "ollama": "connected",
                "model": OLLAMA_MODEL,
                "model_ready": model_ready,
                "available_models": models,
            }
    except Exception as e:
        return {
            "status": "degraded",
            "ollama": "not reachable",
            "error": str(e),
            "hint": "Run: ollama serve  then  ollama pull gemma3n"
        }


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    Main chat endpoint.
    Accepts the current message + previous conversation history.
    Returns the assistant's reply.
    """
    # Build messages list for Ollama
    # Format: [{"role": "system", ...}, {"role": "user", ...}, ...]
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Trim history to last MAX_HISTORY pairs to avoid context overflow
    history = req.history[-(MAX_HISTORY * 2):] if req.history else []
    for msg in history:
        messages.append({"role": msg.role, "content": msg.content})

    # Add current user message
    messages.append({"role": "user", "content": req.message.strip()})

    reply = await call_ollama(messages)
    return ChatResponse(reply=reply, model=OLLAMA_MODEL)
