import {
  Folder,
  FileText,
  Star,
  Briefcase,
  Users,
  HelpCircle,
  TrendingUp,
  Clock,
  Pencil,
  Plus,
  ArrowRight,
  CheckCircle2,
  MessageSquarePlus,
  UploadCloud,
  Layers,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Projects",
    value: "12",
    icon: Folder,
    trend: "+2 this month",
    trendUp: true,
    gradient: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/20",
    href: "/dashboard/projects",
  },
  {
    label: "Articles",
    value: "5",
    icon: FileText,
    trend: "+1 this week",
    trendUp: true,
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
    href: "/dashboard/articles",
  },
  {
    label: "Testimonials",
    value: "8",
    icon: Star,
    trend: "+3 this month",
    trendUp: true,
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
    href: "/dashboard/testimonials",
  },
  {
    label: "Experience",
    value: "4",
    icon: Briefcase,
    trend: "Years active",
    trendUp: null,
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
    href: "/dashboard/experience",
  },
  {
    label: "FAQ Items",
    value: "10",
    icon: HelpCircle,
    trend: "All answered",
    trendUp: null,
    gradient: "from-rose-500 to-pink-500",
    glow: "shadow-rose-500/20",
    href: "/dashboard/faq",
  },
  {
    label: "Profile Views",
    value: "2.4k",
    icon: Users,
    trend: "+18% this month",
    trendUp: true,
    gradient: "from-indigo-500 to-blue-600",
    glow: "shadow-indigo-500/20",
    href: "/dashboard/user",
  },
];

const recentActivity = [
  {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Updated Projects page",
    desc: "Added 2 new Next.js projects",
    time: "2 mins ago",
  },
  {
    icon: MessageSquarePlus,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    title: "New testimonial added",
    desc: "From DevelopersHub Corporation",
    time: "1 hour ago",
  },
  {
    icon: UploadCloud,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    title: "Article published",
    desc: '"Mastering TypeScript Patterns"',
    time: "3 hours ago",
  },
  {
    icon: Layers,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    title: "Experience updated",
    desc: "Added Full-Stack Developer role",
    time: "Yesterday",
  },
];

const quickActions = [
  {
    label: "Add New Project",
    icon: Folder,
    href: "/dashboard/projects",
    gradient: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
    hoverBorder: "hover:border-blue-400/60",
  },
  {
    label: "Write New Article",
    icon: Pencil,
    href: "/dashboard/articles",
    gradient: "from-violet-500/10 to-purple-500/10",
    border: "border-violet-500/30",
    iconColor: "text-violet-400",
    hoverBorder: "hover:border-violet-400/60",
  },
  {
    label: "Add Testimonial",
    icon: MessageSquarePlus,
    href: "/dashboard/testimonials",
    gradient: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    hoverBorder: "hover:border-amber-400/60",
  },
  {
    label: "Update Experience",
    icon: Briefcase,
    href: "/dashboard/experience",
    gradient: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    hoverBorder: "hover:border-emerald-400/60",
  },
];

export default function DashboardPage() {
  const now = new Date();
  const hours = now.getHours();
  const greeting =
    hours < 12
      ? "Good morning"
      : hours < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 ">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ── Top Header ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500 mb-1 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              {now.toLocaleDateString("en-PK", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white">
              {greeting},{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Waseem!
              </span>{" "}
              👋
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Here &apos;s what &apos;s happening with your portfolio today.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-400">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            Portfolio is looking great!
          </div>
        </div>

        {/* ── Stats Grid ──────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className={`group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl ${stat.glow} hover:border-zinc-700 hover:scale-[1.02] transition-all duration-200`}>
              {/* Background glow blob */}
              <div
                className={`absolute -top-4 -right-4 h-16 w-16 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity blur-xl`}
              />
              <div
                className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
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
                  {stat.trendUp === true && <TrendingUp className="h-3 w-3" />}
                  {stat.trend}
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* ── Bottom Section ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-400" />
                Recent Activity
              </h3>
              <button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <ul className="space-y-3">
              {recentActivity.map((activity, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors duration-150 group">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${activity.bg}`}>
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">
                      {activity.desc}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-600 shrink-0 mt-0.5">
                    {activity.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
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

            {/* Mini divider + footer note */}
            <div className="mt-5 pt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-600 text-center">
                Portfolio last updated today at{" "}
                {now.toLocaleTimeString("en-PK", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
