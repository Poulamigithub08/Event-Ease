import React, { useState, useEffect, useRef } from "react";

const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL || "http://localhost:8000";

// ─── Markdown-lite renderer (bold, inline code, bullets) ────────────────────
function renderText(text) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Bullet lines
    if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
      const content = line.trim().slice(2);
      return (
        <li key={i} className="ml-3 list-disc text-gray-200 text-xs leading-relaxed">
          {inlineFormat(content)}
        </li>
      );
    }
    if (line.trim() === "") return <br key={i} />;
    return (
      <p key={i} className="text-xs leading-relaxed text-gray-200">
        {inlineFormat(line)}
      </p>
    );
  });
}

function inlineFormat(text) {
  // Bold: **text** and inline code: `code`
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="bg-black/40 text-red-300 px-1 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    return part;
  });
}

// ─── Suggested prompts shown when chat is empty ───────────────────────────
const SUGGESTIONS = [
  "How do I create an event?",
  "How do I register for an event?",
  "What's the difference between Host and Guest?",
  "How do I change event status to confirmed?",
  "Can guests see draft events?",
];

// ─── Single message bubble ────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1 shadow-md">
          E
        </div>
      )}
      <div
        className={`max-w-[82%] px-3 py-2 rounded-2xl shadow-md ${
          isUser
            ? "bg-gradient-to-br from-red-600 to-red-700 text-white rounded-br-sm"
            : "bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-bl-sm"
        }`}
      >
        {isUser ? (
          <p className="text-xs text-white leading-relaxed">{msg.content}</p>
        ) : (
          <div className="space-y-1">{renderText(msg.content)}</div>
        )}
      </div>
      {isUser && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-bold ml-2 flex-shrink-0 mt-1 shadow-md">
          U
        </div>
      )}
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1">
        E
      </div>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 px-3 py-2.5 rounded-2xl rounded-bl-sm shadow-md">
        <div className="flex space-x-1 items-center h-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main ChatWidget ──────────────────────────────────────────────────────
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);   // { role, content }
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(null); // null = unknown
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
      if (isOnline === null) checkHealth();
    }
  }, [isOpen]);

  const checkHealth = async () => {
    try {
      const res = await fetch(`${CHATBOT_URL}/health`);
      const data = await res.json();
      setIsOnline(data.model_ready === true);
    } catch {
      setIsOnline(false);
    }
  };

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || isLoading) return;

    const userMsg = { role: "user", content: userText };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${CHATBOT_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          // send only previous messages (not the one just added)
          history: messages,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      setIsOnline(true);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            err.message.includes("Failed to fetch") || err.message.includes("Ollama")
              ? "⚠️ I'm offline right now. Make sure the chatbot server is running (`uvicorn main:app`)."
              : `⚠️ Error: ${err.message}`,
        },
      ]);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-full shadow-2xl shadow-red-900/40 flex items-center justify-center hover:from-red-400 hover:to-red-600 transition-all duration-300 hover:scale-110 border border-red-400/30 group"
        title="Chat with EventBot"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        {/* Notification dot when offline */}
        {isOnline === false && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-gray-900" />
        )}
      </button>

      {/* ── Chat window ── */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col bg-gradient-to-br from-gray-900 to-black border border-red-500/25 rounded-2xl shadow-2xl shadow-red-900/20 overflow-hidden"
          style={{ maxHeight: "520px" }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-black text-sm border border-white/30">
                E
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">EventBot</p>
                <p className="text-red-200 text-xs mt-0.5">
                  {isOnline === null && "Checking..."}
                  {isOnline === true && (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
                      Online
                    </span>
                  )}
                  {isOnline === false && (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full inline-block" />
                      Offline — start chatbot server
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button onClick={clearChat} className="text-red-200 hover:text-white text-xs transition-colors px-1" title="Clear chat">
                  Clear
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-red-200 hover:text-white transition-colors" aria-label="Close">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 pt-3 pb-1 space-y-1 min-h-0" style={{ maxHeight: "340px" }}>
            {messages.length === 0 ? (
              <div className="py-2">
                <p className="text-gray-400 text-xs text-center mb-3">
                  👋 Hi! I'm EventBot. Ask me anything about EventEase.
                </p>
                <div className="space-y-1.5">
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} onClick={() => sendMessage(s)}
                      className="w-full text-left px-3 py-2 bg-gray-800/60 hover:bg-gray-700/80 border border-white/10 hover:border-red-500/40 text-gray-300 text-xs rounded-xl transition-all duration-200 hover:text-white">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                {isLoading && <TypingIndicator />}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2 bg-gray-800/60 border border-white/15 rounded-xl px-3 py-2 focus-within:border-red-500/50 transition-colors duration-200">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about EventEase..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-white text-xs placeholder-gray-500 focus:outline-none disabled:opacity-50"
              />
              <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="w-7 h-7 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-lg flex items-center justify-center flex-shrink-0 hover:from-red-400 hover:to-red-600 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
                  aria-label="Send"
              >
                <svg
                    className="w-3.5 h-3.5 rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 text-center mt-1.5" style={{ fontSize: "9px" }}>
              Powered by Qwen 2.5 · Runs locally · No data sent to cloud
            </p>
          </div>
        </div>
      )}
    </>
  );
}
