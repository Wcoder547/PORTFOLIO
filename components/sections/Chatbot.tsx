"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageCircle,
  FiX,
  FiSend,
  FiCpu,
  FiMinimize2,
} from "react-icons/fi";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm here to help you learn about Yash Kapure - his skills, projects, experience, and professional background.\n\n**For Recruiters:** If you have a job description or role requirements, feel free to paste it here and I'll provide a detailed match analysis showing how Yash's skills and experience align with your needs.\n\n**For Visitors:** You can ask me about Yash's technical skills, notable projects, work experience, or anything else you'd like to know. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response (replace with actual API call)
    setTimeout(() => {
      const botNow = Date.now();
      const botMessage: Message = {
        id: (botNow + 1).toString(),
        content: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(botNow),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    // Skills
    if (input.includes("skill") || input.includes("tech")) {
      return "Yash specializes in:\n\n• **Frontend:** React.js, Next.js, Vue.js, TypeScript, Tailwind CSS, ShadCN UI\n• **Backend:** Node.js, Express.js, MongoDB, Supabase, PostgreSQL\n• **Full-Stack:** MERN/MEVN stack, Authentication, Real-time features\n• **Mobile:** Kotlin, Android development, Firebase\n• **AI/ML:** Python, Generative AI, Agentic AI\n• **DevOps:** Docker, Kubernetes, AWS, Cloud deployment\n\nWith 4+ years of production experience!";
    }

    // Experience
    if (input.includes("experience") || input.includes("work")) {
      return "**Work Experience:**\n\n• **DevelopersHub Corporation** (2023-Present)\n  Full-Stack Developer - E-commerce backends, Android apps, AI/ML integration\n\n• **Freelance Projects** (2022-2023)\n  Full-Stack AI Developer - Social platforms, AI tools, cloud deployments\n\n• **Personal Projects** (2021-Present)\n  YouTube tutorials, agentic AI, open source contributions\n\n4+ years of real-world development experience.";
    }

    // Projects
    if (input.includes("project") || input.includes("portfolio")) {
      return "Notable projects include:\n\n• **E-commerce Platforms** - Full-stack backends with Next.js, Node.js, MongoDB\n• **Android Apps** - Built with Kotlin, Room, Material Components, Firebase\n• **AI-Powered Tools** - Social media platforms, coin reward systems\n• **YouTube Content** - Coding tutorials and technical education\n• **Agentic AI Experiments** - Cutting-edge AI applications\n\nAll projects feature production-ready code and modern architectures!";
    }

    // Rates
    if (
      input.includes("rate") ||
      input.includes("price") ||
      input.includes("cost")
    ) {
      return "**Freelance Rates:**\n\n• Hourly: $25-57/hour (flexible based on project scope)\n• Available for: Full-time, freelance, contract work\n• Locations: Remote or onsite - US, UK, worldwide\n• Flexible with: Working hours, payment terms, project duration\n\nLet's discuss your project needs!";
    }

    // Contact
    if (
      input.includes("contact") ||
      input.includes("email") ||
      input.includes("hire")
    ) {
      return "**Get in Touch:**\n\n📧 Email: yashkapure06@gmail.com\n💼 LinkedIn: [linkedin.com/in/yashkapure](https://linkedin.com/in/yashkapure)\n🐙 GitHub: [github.com/Yashkapure06](https://github.com/Yashkapure06)\n\nScroll down to the contact form to send a message directly. I'm open to full-time, freelance, and contract opportunities!";
    }

    // Job description analysis
    if (
      input.includes("job") ||
      input.includes("jd") ||
      input.includes("requirement")
    ) {
      return "Great! Please paste the job description or role requirements here, and I'll provide a detailed analysis of how Yash's skills and experience match your needs.\n\nInclude:\n• Required skills\n• Years of experience\n• Tech stack\n• Responsibilities\n\nI'll give you a comprehensive match report!";
    }

    // Default response
    return "I can help you learn about:\n\n• **Technical Skills** - Frontend, backend, mobile, AI/ML\n• **Work Experience** - Past roles and responsibilities\n• **Projects** - Notable work and achievements\n• **Rates & Availability** - Pricing and schedule\n• **Contact Info** - How to reach Yash\n• **JD Analysis** - Match job requirements\n\nWhat would you like to know?";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatMessage = (content: string) => {
    // Split by newlines and handle markdown-style formatting
    return content.split("\n").map((line, i) => {
      // Bold text **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = line.split(boldRegex);

      return (
        <p key={i} className="mb-2 break-words last:mb-0">
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="font-semibold">
                {part}
              </strong>
            ) : (
              part
            ),
          )}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 size-14 sm:size-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 hover:scale-110 transition-all duration-300 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <FiX className="size-6 sm:size-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <FiMessageCircle className="size-6 sm:size-7" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Badge */}
        {!isOpen && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 size-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold">
            1
          </motion.span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] h-[600px] max-h-[calc(100vh-8rem)] rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="size-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <FiCpu className="size-5 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 size-3 bg-green-400 rounded-full border-2 border-zinc-950" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    Waseem Akram&apos;s AI Assistant
                  </h3>
                  <p className="text-xs text-white/60">
                    Online • Instant reply
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Minimize chat">
                <FiMinimize2 className="size-4 text-white/70" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex w-full ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}>
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                        : "bg-white/10 text-white/90 border border-white/10"
                    }`}>
                    {formatMessage(message.content)}
                    <span className="mt-2 block text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start">
                  <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="size-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="size-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="size-2 bg-white/60 rounded-full animate-bounce" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                  aria-label="Send message">
                  <FiSend className="size-5" />
                </button>
              </div>
              <p className="text-[10px] text-white/40 mt-2 text-center">
                Powered by AI • Responses may vary
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
