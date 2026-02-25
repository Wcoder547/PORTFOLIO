"use client";

import { useState, useRef, useEffect, useCallback, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageCircle,
  FiX,
  FiSend,
  FiCpu,
  FiMinimize2,
  FiTrash2,
  FiAlertTriangle,
} from "react-icons/fi";
import { Toaster, toast } from "sonner"; // npm i sonner

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  status?: "pending" | "complete" | "error";
}

interface AnalyticsEvent {
  event:
    | "chat_open"
    | "chat_close"
    | "message_sent"
    | "message_received"
    | "error";
  userId?: string;
  sessionId: string;
  timestamp: number;
  messageCount?: number;
}

const INITIAL_MESSAGE: Message = {
  id: "welcome-1",
  content: `Hello! I'm here to help you learn about Waseem Akram - his skills, projects, experience, and professional background.

For Recruiters: If you have a job description or role requirements, feel free to paste it here and I'll provide a detailed match analysis showing how Waseem's skills and experience align with your needs.

For Visitors: You can ask me about Waseem's technical skills, notable projects, work experience, or anything else you'd like to know. How can I assist you today?`,
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
  const sessionStorageKey = `chat-session-${sessionId}`;

  // ─── Analytics ─────────────────────────────────────────────────────────────
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    // Replace with your analytics (Vercel Analytics, PostHog, etc.)
    console.log("[Chat Analytics]", event);

    // Persist to localStorage for session analysis
    const events = JSON.parse(
      localStorage.getItem("chat-events") || "[]",
    ) as AnalyticsEvent[];
    events.push(event);
    localStorage.setItem("chat-events", JSON.stringify(events.slice(-100))); // Keep last 100
  }, []);

  // ─── Scroll & Focus ────────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      trackEvent({
        event: "chat_open",
        sessionId,
        userId,
        timestamp: Date.now(),
      });
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      trackEvent({
        event: "chat_close",
        sessionId,
        userId,
        timestamp: Date.now(),
      });
    }
  }, [isOpen, trackEvent, sessionId, userId]);

  // ─── Send Message (Production Optimized) ───────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming || isPending) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        content: text.trim(),
        sender: "user",
        timestamp: new Date(),
      };

      // Optimistic UI update
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      trackEvent({
        event: "message_sent",
        sessionId,
        userId,
        timestamp: Date.now(),
        messageCount: messages.length + 1,
      });

      setIsStreaming(true);

      // Create streaming placeholder
      const botId = crypto.randomUUID();
      const botMsg: Message = {
        id: botId,
        content: "",
        sender: "bot",
        timestamp: new Date(),
        status: "pending",
      };
      setMessages((prev) => [...prev, botMsg]);

      abortControllerRef.current = new AbortController();

      try {
        // Build conversation history (exclude welcome message)
        const history = messages
          .filter((m) => m.id !== "welcome-1")
          .filter((m) => m.status !== "error") // ✅ exclude error messages
          .filter((m) => m.content.trim().length > 0) // ✅ exclude empty messages
          .concat(userMsg)
          .map((m) => ({
            role: m.sender === "user" ? "user" : ("assistant" as const),
            content: m.content,
          }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Session-ID": sessionId,
            "X-User-ID": userId || "",
          },
          body: JSON.stringify({ messages: history }),
          signal: abortControllerRef.current.signal,
          // Production timeouts
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
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botId ? { ...m, content: accumulated } : m,
            ),
          );
        }

        // Mark as complete
        setMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, status: "complete" } : m)),
        );

        trackEvent({
          event: "message_received",
          sessionId,
          userId,
          timestamp: Date.now(),
          messageCount: messages.length + 2,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          toast("Message cancelled", { duration: 2000 });
          return;
        }

        console.error("[Chat Error]", error);
        const errorMsg =
          error instanceof Error ? error.message : "Connection failed";

        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId
              ? {
                  ...m,
                  content: `Sorry, something went wrong: ${errorMsg}. Please try again.`,
                  status: "error",
                }
              : m,
          ),
        );

        trackEvent({
          event: "error",
          sessionId,
          userId,
          timestamp: Date.now(),
          messageCount: messages.length + 1,
        });

        toast.error("Failed to send message. Check your connection.", {
          duration: 4000,
        });
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming, isPending, messages, sessionId, userId, trackEvent],
  );

  // ─── Controls ───────────────────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    abortControllerRef.current?.abort();
    setMessages([INITIAL_MESSAGE]);
    setInputValue("");
    setIsStreaming(false);
    toast.success("Chat cleared", { duration: 2000 });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  // ─── Markdown Parser (Enhanced) ─────────────────────────────────────────────
  const formatMessage = useCallback((content: string) => {
    return content.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <div key={i} className="mb-1.5 last:mb-0">
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="font-semibold text-white">
                {part}
              </strong>
            ) : (
              <span key={j}>{part}</span>
            ),
          )}
        </div>
      );
    });
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={false}
        duration={3000}
      />

      {/* FAB Button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-[9999] size-14 sm:size-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/50 border-2 border-white/20 flex items-center justify-center hover:shadow-emerald-500/70 active:scale-95 transition-all duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close chat" : "Open chat"}>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 90 }}
              transition={{ duration: 0.2 }}>
              <FiX className="size-6 sm:size-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: -90 }}
              transition={{ duration: 0.2 }}>
              <FiMessageCircle className="size-6 sm:size-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-[9999] w-[min(90vw,400px)] h-[min(80vh,600px)] max-h-[calc(100vh-8rem)] rounded-2xl bg-zinc-950/95 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="size-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <FiCpu className="size-5 text-white" />
                  </div>
                  <motion.span
                    className="absolute -bottom-1 -right-1 size-3 bg-green-400 rounded-full border-2 border-zinc-950"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm leading-tight">
                    Waseem&apos;s AI Assistant
                  </h3>
                  <p className="text-xs text-white/60 flex items-center gap-1.5">
                    {isStreaming || isPending ? (
                      <>
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Typing...
                      </>
                    ) : (
                      <>
                        <span className="size-1.5 rounded-full bg-green-400" />
                        Online
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/40 hover:text-white hover:scale-105"
                  title="Clear conversation"
                  aria-label="Clear conversation">
                  <FiTrash2 className="size-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/70 hover:text-white hover:scale-105"
                  aria-label="Close chat">
                  <FiMinimize2 className="size-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-zinc-900/50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex w-full ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}>
                  <div
                    className={`group relative max-w-[85%] p-4 rounded-2xl text-sm shadow-lg ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                        : "bg-white/10 backdrop-blur-sm border border-white/20 text-white/95"
                    } ${message.status === "error" ? "border-red-400/50" : ""}`}>
                    {message.status === "pending" && !message.content ? (
                      <div className="flex gap-1 py-2">
                        <div className="size-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="size-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="size-1.5 bg-white/60 rounded-full animate-bounce" />
                      </div>
                    ) : (
                      formatMessage(message.content)
                    )}

                    {message.content && (
                      <span className="mt-2 block text-[10px] opacity-60 text-center">
                        {formatTime(message.timestamp)}
                      </span>
                    )}

                    {message.status === "error" && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute -top-8 -right-2 p-1 bg-red-500/90 text-white text-xs rounded shadow-lg flex items-center gap-1">
                        <FiAlertTriangle className="size-3" />
                        Retry
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-zinc-950/50">
              <div className="relative flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about Waseem..."
                  disabled={isStreaming || isPending}
                  maxLength={2000}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  aria-label="Message input"
                />
                <motion.button
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim() || isStreaming || isPending}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-emerald-500/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all border border-white/20"
                  aria-label="Send message">
                  <FiSend className="size-5" />
                </motion.button>
              </div>
              <p className="text-[10px] text-white/30 mt-2 text-center">
                Secure & Private · Messages not stored
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
