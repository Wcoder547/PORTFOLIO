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

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  status?: "pending" | "complete" | "error";
}

const INITIAL_MESSAGE: Message = {
  id: "welcome-1",
  content: `Hey — I'm Waseem's assistant.

Ask me anything about his work, skills, or availability. If you're a recruiter, drop a job description and I'll tell you how he fits.`,
  sender: "bot",
  timestamp: new Date(),
};

export function Chatbot({ userId }: { userId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [] = useTransition();
  const [sessionId] = useState(() => crypto.randomUUID());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      content: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsStreaming(true);

    const botId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: botId, content: "", sender: "bot", timestamp: new Date(), status: "pending" },
    ]);

    abortControllerRef.current = new AbortController();

    try {
      const history = messages
        .filter((m) => m.id !== "welcome-1" && m.status !== "error" && m.content.trim())
        .concat(userMsg)
        .map((m) => ({ role: m.sender === "user" ? "user" : ("assistant" as const), content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": sessionId,
          "X-User-ID": userId || "",
        },
        body: JSON.stringify({ messages: history }),
        signal: abortControllerRef.current.signal,
        cache: "no-store",
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${response.status}`);
      }
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, content: accumulated } : m))
        );
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === botId ? { ...m, status: "complete" } : m))
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        toast("Cancelled", { duration: 1500 });
        return;
      }
      const msg = error instanceof Error ? error.message : "Connection failed";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId
            ? { ...m, content: `Something went wrong — ${msg}. Try again.`, status: "error" }
            : m
        )
      );
      toast.error("Failed to send.", { duration: 3000 });
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [isStreaming, messages, sessionId, userId]);

  const handleClear = useCallback(() => {
    abortControllerRef.current?.abort();
    setMessages([INITIAL_MESSAGE]);
    setInputValue("");
    setIsStreaming(false);
    toast.success("Cleared", { duration: 1500 });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const formatMessage = useCallback((content: string) => {
    return content.split("\n").map((line, i, arr) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <div key={i} className={i < arr.length - 1 ? "mb-1.5" : ""}>
          {parts.map((part, j) =>
            j % 2 === 1
              ? <strong key={j} className="font-semibold text-white">{part}</strong>
              : <span key={j}>{part}</span>
          )}
        </div>
      );
    });
  }, []);

  const msgCount = messages.filter((m) => m.id !== "welcome-1").length;

  return (
    <>
      <Toaster position="top-right" richColors closeButton expand={false} duration={3000} />

      {/* FAB */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-[9999] size-14 flex items-center justify-center bg-white text-black shadow-2xl hover:bg-white/90 transition-colors"
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
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center size-8 border border-white/[0.12] bg-white/[0.04]" style={{ borderRadius: "2px" }}>
                  <span className="text-[10px] font-mono text-[#888]">AI</span>
                  <motion.span
                    className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-white/70"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white tracking-[-0.01em] leading-none">
                    Waseem&apos;s Assistant
                  </p>
                  <p className="text-[11px] text-[#555] mt-0.5 font-mono">
                    {isStreaming ? "typing..." : "online"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={handleClear} title="Clear" className="p-2 text-[#444] hover:text-[#999] transition-colors">
                  <FiTrash2 className="size-3.5" strokeWidth={1.5} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 text-[#444] hover:text-[#999] transition-colors">
                  <FiMinus className="size-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`flex flex-col ${message.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <span className="text-[10px] text-[#444] font-mono tracking-[0.08em] uppercase mb-1.5 px-0.5">
                    {message.sender === "user" ? "You" : `_${String(index).padStart(2, "0")}`}
                  </span>

                  <div
                    className={`relative max-w-[88%] px-4 py-3 text-[13px] leading-[1.7] ${
                      message.sender === "user"
                        ? "bg-white text-black"
                        : message.status === "error"
                        ? "bg-white/[0.03] border border-red-400/25 text-[#888]"
                        : "bg-white/[0.05] border border-white/[0.08] text-[#ccc]"
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
                            <FiAlertTriangle className="size-3" /> Failed
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {message.content && (
                    <span className="text-[10px] text-[#333] mt-1 px-0.5 font-mono">
                      {formatTime(message.timestamp)}
                    </span>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-white/[0.08] flex-shrink-0">
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Waseem..."
                  disabled={isStreaming}
                  maxLength={1000}
                  className="flex-1 px-4 py-2.5 bg-white/[0.04] border border-white/10 text-white text-[13px] placeholder-[#444] focus:outline-none focus:border-white/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ borderRadius: "2px" }}
                />
                <motion.button
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim() || isStreaming}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 size-[42px] flex items-center justify-center bg-white text-black disabled:opacity-25 disabled:cursor-not-allowed hover:bg-white/90 transition-opacity"
                  style={{ borderRadius: "2px" }}
                >
                  <FiSend className="size-4" strokeWidth={1.5} />
                </motion.button>
              </div>
              <p className="text-[10px] text-[#333] mt-2.5 tracking-[0.06em] text-center font-mono uppercase">
                Not stored · Private
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}