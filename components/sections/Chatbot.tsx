"use client";

import { useState, useRef, useEffect, useCallback, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageSquare,
  FiX,
  FiSend,
  FiTrash2,
  FiMinus,
  FiAlertTriangle,
} from "react-icons/fi";
import { Toaster, toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  status?: "pending" | "complete" | "error";
}

interface AnalyticsEvent {
  event: "chat_open" | "chat_close" | "message_sent" | "message_received" | "error";
  userId?: string;
  sessionId: string;
  timestamp: number;
  messageCount?: number;
}

const INITIAL_MESSAGE: Message = {
  id: "welcome-1",
  content: `Hello. I'm here to help you learn about Waseem Akram — his skills, projects, experience, and professional background.

**For Recruiters:** Paste a job description or role requirements and I'll provide a detailed match analysis.

**For Visitors:** Ask me about Waseem's technical skills, notable projects, work experience, or anything else. How can I assist you?`,
  sender: "bot",
  timestamp: new Date(),
};

// ─── Chatbot Component ────────────────────────────────────────────────────────
export function Chatbot({ userId }: { userId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [sessionId] = useState(() => crypto.randomUUID());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ─── Analytics ──────────────────────────────────────────────────────────────
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    console.log("[Chat Analytics]", event);
    const events = JSON.parse(localStorage.getItem("chat-events") || "[]") as AnalyticsEvent[];
    events.push(event);
    localStorage.setItem("chat-events", JSON.stringify(events.slice(-100)));
  }, []);

  // ─── Scroll & Focus ─────────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      trackEvent({ event: "chat_open", sessionId, userId, timestamp: Date.now() });
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      trackEvent({ event: "chat_close", sessionId, userId, timestamp: Date.now() });
    }
  }, [isOpen, trackEvent, sessionId, userId]);

  // ─── Send Message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming || isPending) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      content: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    trackEvent({ event: "message_sent", sessionId, userId, timestamp: Date.now(), messageCount: messages.length + 1 });

    setIsStreaming(true);

    const botId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: botId, content: "", sender: "bot", timestamp: new Date(), status: "pending" }]);

    abortControllerRef.current = new AbortController();

    try {
      const history = messages
        .filter((m) => m.id !== "welcome-1")
        .filter((m) => m.status !== "error")
        .filter((m) => m.content.trim().length > 0)
        .concat(userMsg)
        .map((m) => ({ role: m.sender === "user" ? "user" : ("assistant" as const), content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-ID": sessionId, "X-User-ID": userId || "" },
        body: JSON.stringify({ messages: history }),
        signal: abortControllerRef.current.signal,
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => prev.map((m) => m.id === botId ? { ...m, content: accumulated } : m));
      }

      setMessages((prev) => prev.map((m) => m.id === botId ? { ...m, status: "complete" } : m));
      trackEvent({ event: "message_received", sessionId, userId, timestamp: Date.now(), messageCount: messages.length + 2 });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        toast("Message cancelled", { duration: 2000 });
        return;
      }
      const errorMsg = error instanceof Error ? error.message : "Connection failed";
      setMessages((prev) => prev.map((m) =>
        m.id === botId ? { ...m, content: `Something went wrong: ${errorMsg}. Please try again.`, status: "error" } : m
      ));
      trackEvent({ event: "error", sessionId, userId, timestamp: Date.now() });
      toast.error("Failed to send message.", { duration: 4000 });
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [isStreaming, isPending, messages, sessionId, userId, trackEvent]);

  // ─── Controls ────────────────────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    abortControllerRef.current?.abort();
    setMessages([INITIAL_MESSAGE]);
    setInputValue("");
    setIsStreaming(false);
    toast.success("Conversation cleared", { duration: 2000 });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(inputValue); }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  // ─── Markdown Renderer ───────────────────────────────────────────────────────
  const formatMessage = useCallback((content: string) => {
    return content.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <div key={i} className={i < content.split("\n").length - 1 ? "mb-1.5" : ""}>
          {parts.map((part, j) =>
            j % 2 === 1
              ? <strong key={j} className="font-semibold text-white">{part}</strong>
              : <span key={j}>{part}</span>
          )}
        </div>
      );
    });
  }, []);

  const msgCount = messages.filter(m => m.id !== "welcome-1").length;

  return (
    <>
      <Toaster position="top-right" richColors closeButton expand={false} duration={3000} />

      {/* FAB Button — sharp square, editorial */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-[9999] size-14 flex items-center justify-center bg-white text-black border border-white/20 shadow-2xl transition-all duration-200 hover:bg-white/90"
        style={{ borderRadius: "2px" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <FiX className="size-5" strokeWidth={2} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <FiMessageSquare className="size-5" strokeWidth={1.5} />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Unread dot */}
        {!isOpen && msgCount === 0 && (
          <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-white border-2 border-black" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-[9999] w-[min(92vw,400px)] h-[min(78vh,580px)] flex flex-col overflow-hidden"
            style={{
              borderRadius: "2px",
              background: "#0d0d0d",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 32px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 flex-shrink-0">
              <div className="flex items-center gap-3">
                {/* Status dot */}
                <div className="relative flex items-center justify-center size-8 border border-white/12 bg-white/[0.04]" style={{ borderRadius: "2px" }}>
                  <span className="text-[10px] font-mono text-[#888]">AI</span>
                  <motion.span
                    className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-white/70"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white tracking-[-0.01em] leading-none">
                    Waseem's Assistant
                  </p>
                  <p className="text-[11px] text-[#555] mt-0.5 font-mono">
                    {isStreaming ? "writing..." : "online"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  title="Clear conversation"
                  className="p-2 text-[#444] hover:text-[#999] transition-colors duration-150"
                  aria-label="Clear conversation"
                >
                  <FiTrash2 className="size-3.5" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-[#444] hover:text-[#999] transition-colors duration-150"
                  aria-label="Close chat"
                >
                  <FiMinus className="size-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* ── Messages ───────────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`flex flex-col ${message.sender === "user" ? "items-end" : "items-start"}`}
                >
                  {/* Sender label */}
                  <span className="text-[10px] text-[#444] font-mono tracking-[0.08em] uppercase mb-1.5 px-0.5">
                    {message.sender === "user" ? "You" : `_${String(index).padStart(2, "0")}`}
                  </span>

                  <div
                    className={`relative max-w-[88%] px-4 py-3 text-[13px] leading-[1.7] ${
                      message.sender === "user"
                        ? "bg-white text-black"
                        : message.status === "error"
                        ? "bg-white/[0.03] border border-red-400/25 text-[#888]"
                        : "bg-white/[0.05] border border-white/8 text-[#ccc]"
                    }`}
                    style={{ borderRadius: "2px" }}
                  >
                    {message.status === "pending" && !message.content ? (
                      <div className="flex gap-1.5 items-center py-1">
                        <span className="size-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="size-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="size-1.5 bg-white/30 rounded-full animate-bounce" />
                      </div>
                    ) : (
                      <>
                        {formatMessage(message.content)}
                        {message.status === "error" && (
                          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#666]">
                            <FiAlertTriangle className="size-3" />
                            Failed to send
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Timestamp */}
                  {message.content && (
                    <span className="text-[10px] text-[#333] mt-1 px-0.5 font-mono">
                      {formatTime(message.timestamp)}
                    </span>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* ── Input ──────────────────────────────────────────────────────── */}
            <div className="px-5 py-4 border-t border-white/8 flex-shrink-0">
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Waseem..."
                  disabled={isStreaming || isPending}
                  maxLength={2000}
                  className="flex-1 px-4 py-2.5 bg-white/[0.04] border border-white/10 text-white text-[13px] placeholder-[#444] focus:outline-none focus:border-white/30 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ borderRadius: "2px" }}
                  aria-label="Message input"
                />
                <motion.button
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim() || isStreaming || isPending}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 size-[42px] flex items-center justify-center bg-white text-black disabled:opacity-25 disabled:cursor-not-allowed transition-opacity duration-150 hover:bg-white/90"
                  style={{ borderRadius: "2px" }}
                  aria-label="Send message"
                >
                  <FiSend className="size-4" strokeWidth={1.5} />
                </motion.button>
              </div>
              <p className="text-[10px] text-[#333] mt-2.5 tracking-[0.06em] text-center font-mono uppercase">
                Messages not stored · Private
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}