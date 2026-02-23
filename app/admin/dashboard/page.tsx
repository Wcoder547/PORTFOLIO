"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Folder,
  Star,
  Briefcase,
  HelpCircle,
  TrendingUp,
  Clock,
  Pencil,
  Plus,
  ArrowRight,
  MessageSquarePlus,
  Inbox,
  Mail,
  MailOpen,
  Trash2,
  RefreshCw,
  ExternalLink,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Stats {
  projects: number;
  testimonials: number;
  faqs: number;
  experiences: number;
  totalMessages: number;
  unreadMessages: number;
}

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  budget?: string;
  currency?: string;
  timeline?: string;
  isRead: boolean;
  createdAt: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-PK", {
    month: "short",
    day: "numeric",
  });
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// ── Skeletons ──────────────────────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 animate-pulse">
      <div className="h-9 w-9 rounded-xl bg-zinc-800 mb-3" />
      <div className="h-7 w-12 bg-zinc-800 rounded mb-1" />
      <div className="h-3 w-20 bg-zinc-800 rounded mb-2" />
      <div className="h-3 w-16 bg-zinc-800 rounded" />
    </div>
  );
}

function MessageSkeleton() {
  return (
    <div className="flex gap-3 p-4 rounded-xl animate-pulse">
      <div className="h-10 w-10 rounded-full bg-zinc-800 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 bg-zinc-800 rounded" />
        <div className="h-3 w-48 bg-zinc-800 rounded" />
        <div className="h-3 w-full bg-zinc-800 rounded" />
      </div>
    </div>
  );
}

// ── Quick Actions config ───────────────────────────────────────────────────────
const quickActions = [
  {
    label: "Add New Project",
    icon: Folder,
    href: "/admin/dashboard/projects",
    gradient: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
    hoverBorder: "hover:border-blue-400/60",
  },
  {
    label: "Write New Article",
    icon: Pencil,
    href: "/admin/dashboard/articles",
    gradient: "from-violet-500/10 to-purple-500/10",
    border: "border-violet-500/30",
    iconColor: "text-violet-400",
    hoverBorder: "hover:border-violet-400/60",
  },
  {
    label: "Add Testimonial",
    icon: MessageSquarePlus,
    href: "/admin/dashboard/testimonials",
    gradient: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    hoverBorder: "hover:border-amber-400/60",
  },
  {
    label: "Update Experience",
    icon: Briefcase,
    href: "/admin/dashboard/experience",
    gradient: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    hoverBorder: "hover:border-emerald-400/60",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  const [stats, setStats] = useState<Stats | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const [statsLoading, setStatsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const [msgFilter, setMsgFilter] = useState<"all" | "unread">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Mount ────────────────────────────────────────────────────────────────
  useEffect(() => {
    setNow(new Date());
    setMounted(true);
  }, []);

  // ── Fetch stats ──────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (json.data) setStats(json.data);
    } catch (e) {
      console.error("[stats]", e);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ── Fetch messages ───────────────────────────────────────────────────────
  const fetchMessages = useCallback(async () => {
    setMessagesLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const json = await res.json();
      if (json.data?.messages) setMessages(json.data.messages);
    } catch (e) {
      console.error("[messages]", e);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchMessages();
  }, [fetchStats, fetchMessages]);

  // ── Toggle read ──────────────────────────────────────────────────────────
  const toggleRead = async (id: string, currentRead: boolean) => {
    // Optimistic update
    setMessages((prev) =>
      prev.map((m) => (m._id === id ? { ...m, isRead: !currentRead } : m)),
    );
    setStats((prev) =>
      prev
        ? {
            ...prev,
            unreadMessages: currentRead
              ? prev.unreadMessages + 1
              : Math.max(0, prev.unreadMessages - 1),
          }
        : prev,
    );

    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !currentRead }),
      });
    } catch {
      // Revert on failure
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isRead: currentRead } : m)),
      );
    }
  };

  // ── Delete message ───────────────────────────────────────────────────────
  const deleteMessage = async (id: string) => {
    setDeletingId(id);
    const removed = messages.find((m) => m._id === id);
    setMessages((prev) => prev.filter((m) => m._id !== id));
    setStats((prev) =>
      prev && removed
        ? {
            ...prev,
            totalMessages: Math.max(0, prev.totalMessages - 1),
            unreadMessages: !removed.isRead
              ? Math.max(0, prev.unreadMessages - 1)
              : prev.unreadMessages,
          }
        : prev,
    );

    try {
      await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    } catch {
      if (removed) setMessages((prev) => [removed, ...prev]);
    } finally {
      setDeletingId(null);
      if (expandedId === id) setExpandedId(null);
    }
  };

  // ── Derived ──────────────────────────────────────────────────────────────
  const hours = now?.getHours() ?? 12;
  const greeting =
    hours < 12
      ? "Good morning"
      : hours < 18
        ? "Good afternoon"
        : "Good evening";

  const dateStr =
    mounted && now
      ? now.toLocaleDateString("en-PK", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "—";

  const timeStr =
    mounted && now
      ? now.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })
      : "—";

  const filteredMessages =
    msgFilter === "unread" ? messages.filter((m) => !m.isRead) : messages;

  const unreadCount = messages.filter((m) => !m.isRead).length;

  // ── Stats cards config ───────────────────────────────────────────────────
  const statsConfig = [
    {
      label: "Projects",
      value: stats?.projects?.toString() ?? "—",
      icon: Folder,
      trend: "Total visible",
      trendUp: null,
      gradient: "from-blue-500 to-cyan-500",
      glow: "shadow-blue-500/20",
      href: "/admin/dashboard/projects",
    },
    {
      label: "Testimonials",
      value: stats?.testimonials?.toString() ?? "—",
      icon: Star,
      trend: "All visible",
      trendUp: null,
      gradient: "from-amber-500 to-orange-500",
      glow: "shadow-amber-500/20",
      href: "/admin/dashboard/testimonials",
    },
    {
      label: "Experience",
      value: stats?.experiences?.toString() ?? "—",
      icon: Briefcase,
      trend: "Entries",
      trendUp: null,
      gradient: "from-emerald-500 to-teal-500",
      glow: "shadow-emerald-500/20",
      href: "/admin/dashboard/experience",
    },
    {
      label: "FAQ Items",
      value: stats?.faqs?.toString() ?? "—",
      icon: HelpCircle,
      trend: "All answered",
      trendUp: null,
      gradient: "from-rose-500 to-pink-500",
      glow: "shadow-rose-500/20",
      href: "/admin/dashboard/faq",
    },
    {
      label: "Messages",
      value: stats?.totalMessages?.toString() ?? "—",
      icon: Inbox,
      trend: stats ? `${stats.unreadMessages} unread` : "Loading...",
      trendUp: (stats?.unreadMessages ?? 0) > 0 ? true : null,
      gradient: "from-violet-500 to-purple-600",
      glow: "shadow-violet-500/20",
      href: "#messages",
    },
    {
      label: "Unread",
      value: stats?.unreadMessages?.toString() ?? "—",
      icon: Mail,
      trend:
        (stats?.unreadMessages ?? 0) > 0 ? "Need response" : "All caught up",
      trendUp: (stats?.unreadMessages ?? 0) > 0 ? false : null,
      gradient: "from-indigo-500 to-blue-600",
      glow: "shadow-indigo-500/20",
      href: "#messages",
    },
  ];

  // ── Portfolio health bars ────────────────────────────────────────────────
  const healthBars = [
    {
      label: "Projects",
      value: stats?.projects ?? 0,
      max: 20,
      color: "bg-blue-500",
    },
    {
      label: "Testimonials",
      value: stats?.testimonials ?? 0,
      max: 15,
      color: "bg-amber-500",
    },
    {
      label: "FAQ Items",
      value: stats?.faqs ?? 0,
      max: 15,
      color: "bg-rose-500",
    },
    {
      label: "Experience",
      value: stats?.experiences ?? 0,
      max: 10,
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500 mb-1 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              {dateStr}
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white">
              {mounted ? greeting : "Welcome"},{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Waseem!
              </span>{" "}
              👋
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Here&apos;s what&apos;s happening with your portfolio today.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {!messagesLoading && unreadCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/30 text-sm text-violet-300">
                <Mail className="h-4 w-4" />
                {unreadCount} unread{" "}
                {unreadCount === 1 ? "message" : "messages"}
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-400">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Portfolio is live!
            </div>
          </div>
        </div>

        {/* ── Stats Grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {statsLoading
            ? Array.from({ length: 6 }).map((_, i) => <StatSkeleton key={i} />)
            : statsConfig.map((stat) => (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className={`group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl ${stat.glow} hover:border-zinc-700 hover:scale-[1.02] transition-all duration-200`}>
                  <div
                    className={`absolute -top-4 -right-4 h-16 w-16 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity blur-xl`}
                  />
                  <div
                    className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-zinc-400 mt-0.5">
                    {stat.label}
                  </div>
                  {stat.trend && (
                    <div
                      className={`mt-2 text-xs flex items-center gap-1 ${
                        stat.trendUp === true
                          ? "text-emerald-400"
                          : stat.trendUp === false
                            ? "text-red-400"
                            : "text-zinc-500"
                      }`}>
                      {stat.trendUp === true && (
                        <TrendingUp className="h-3 w-3" />
                      )}
                      {stat.trendUp === false && <Mail className="h-3 w-3" />}
                      {stat.trend}
                    </div>
                  )}
                </Link>
              ))}
        </div>

        {/* ── Bottom Grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── Messages Inbox ───────────────────────────────────── */}
          <div
            id="messages"
            className="lg:col-span-3 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-800">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Inbox className="h-5 w-5 text-violet-400" />
                Messages Inbox
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 px-2 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchMessages}
                  title="Refresh"
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all">
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
                <button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1.5 px-6 py-3 border-b border-zinc-800/50">
              {(["all", "unread"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setMsgFilter(f)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                    msgFilter === f
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                  }`}>
                  {f}
                  {f === "unread" && unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-violet-500 text-white text-[10px]">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Message list */}
            <div className="flex-1 overflow-y-auto max-h-[500px] p-4 space-y-2">
              {messagesLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <MessageSkeleton key={i} />
                ))
              ) : filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-14 w-14 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                    <Inbox className="h-7 w-7 text-zinc-600" />
                  </div>
                  <p className="text-zinc-400 font-medium">
                    {msgFilter === "unread"
                      ? "All caught up! 🎉"
                      : "No messages yet"}
                  </p>
                  <p className="text-zinc-600 text-sm mt-1">
                    {msgFilter === "unread"
                      ? "No unread messages in your inbox"
                      : "Messages from your contact form will appear here"}
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`rounded-xl border transition-all duration-200 ${
                      !msg.isRead
                        ? "border-violet-500/20 bg-violet-500/5"
                        : "border-zinc-800 bg-zinc-800/30"
                    }`}>
                    {/* Collapsed row */}
                    <div
                      className="flex items-start gap-3 p-4 cursor-pointer select-none"
                      onClick={() =>
                        setExpandedId(expandedId === msg._id ? null : msg._id)
                      }>
                      {/* Avatar */}
                      <div
                        className={`h-10 w-10 rounded-full shrink-0 flex items-center justify-center text-sm font-bold ${
                          !msg.isRead
                            ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
                            : "bg-zinc-700 text-zinc-300"
                        }`}>
                        {initials(msg.name)}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Name row */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <p
                              className={`text-sm font-semibold truncate ${
                                !msg.isRead ? "text-white" : "text-zinc-300"
                              }`}>
                              {msg.name}
                            </p>
                            {!msg.isRead && (
                              <span className="shrink-0 h-2 w-2 rounded-full bg-violet-400" />
                            )}
                          </div>
                          <span className="text-xs text-zinc-600 shrink-0">
                            {timeAgo(msg.createdAt)}
                          </span>
                        </div>

                        {/* Email */}
                        <p className="text-xs text-zinc-500 truncate">
                          {msg.email}
                        </p>

                        {/* Message preview */}
                        <p
                          className={`text-xs mt-1 line-clamp-2 ${
                            !msg.isRead ? "text-zinc-300" : "text-zinc-500"
                          }`}>
                          {msg.message}
                        </p>

                        {/* Badges */}
                        {(msg.budget || msg.timeline) && (
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {msg.budget && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
                                <DollarSign className="h-3 w-3" />
                                {msg.currency ?? "USD"} {msg.budget}
                              </span>
                            )}
                            {msg.timeline && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">
                                <Calendar className="h-3 w-3" />
                                {msg.timeline}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Chevron */}
                      <div className="shrink-0 text-zinc-600 mt-0.5">
                        {expandedId === msg._id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>

                    {/* Expanded body */}
                    {expandedId === msg._id && (
                      <div className="px-4 pb-4">
                        <div className="bg-zinc-900 rounded-lg p-3 mb-3 border border-zinc-800">
                          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={`mailto:${msg.email}?subject=Re: Your message on my portfolio`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/20 transition-all">
                            <ExternalLink className="h-3.5 w-3.5" />
                            Reply
                          </a>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRead(msg._id, msg.isRead);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-medium border border-zinc-700 transition-all">
                            {msg.isRead ? (
                              <>
                                <Mail className="h-3.5 w-3.5" /> Mark unread
                              </>
                            ) : (
                              <>
                                <MailOpen className="h-3.5 w-3.5" /> Mark read
                              </>
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMessage(msg._id);
                            }}
                            disabled={deletingId === msg._id}
                            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition-all disabled:opacity-50">
                            <Trash2 className="h-3.5 w-3.5" />
                            {deletingId === msg._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Right Column ──────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Quick Actions */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
              <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-5">
                <Plus className="h-5 w-5 text-purple-400" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={`flex items-center gap-3 w-full rounded-xl border ${action.border} ${action.hoverBorder} bg-gradient-to-r ${action.gradient} px-4 py-3.5 text-sm font-medium text-zinc-200 hover:text-white transition-all duration-200 group`}>
                    <action.icon
                      className={`h-4 w-4 ${action.iconColor} shrink-0`}
                    />
                    {action.label}
                    <ArrowRight className="ml-auto h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Portfolio Health */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
              <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-5">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                Portfolio Health
              </h3>

              {statsLoading ? (
                <div className="space-y-4 animate-pulse">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1.5">
                        <div className="h-3 w-20 bg-zinc-800 rounded" />
                        <div className="h-3 w-6 bg-zinc-800 rounded" />
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {healthBars.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-zinc-500">
                          {item.label}
                        </span>
                        <span className="text-xs font-semibold text-zinc-300">
                          {item.value}
                        </span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-700`}
                          style={{
                            width: `${Math.min(100, (item.value / item.max) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-600 text-center">
                  Last updated at {timeStr}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
