"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import {
  Users,
  Briefcase,
  Folder,
  FileText,
  Star,
  HelpCircle,
  ChevronsUpDown,
  LogOut,
  MapPin,
  Code2,
  Home,
  Pencil,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "User", url: "/admin/dashboard/user", icon: Users },
  { title: "Experience", url: "/admin/dashboard/experience", icon: Briefcase },
  { title: "Projects", url: "/admin/dashboard/projects", icon: Folder },
  { title: "Articles", url: "/admin/dashboard/articles", icon: FileText },
  { title: "Testimonials", url: "/admin/dashboard/testimonials", icon: Star },
  { title: "FAQ", url: "/admin/dashboard/faq", icon: HelpCircle },
  { title: "Portfolio", url: "/", icon: Pencil },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      style={
        {
          "--sidebar-background": "240 6% 7%",
          "--sidebar-foreground": "0 0% 90%",
          "--sidebar-accent": "240 5% 15%",
          "--sidebar-accent-foreground": "0 0% 100%",
          "--sidebar-border": "240 4% 16%",
          "--sidebar-primary": "262 83% 62%",
          "--sidebar-primary-foreground": "0 0% 100%",
        } as React.CSSProperties
      }
      className="border-r border-zinc-800">
      {/* ── Nav ────────────────────────────────────────────── */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "bg-indigo-500/15 text-indigo-300 font-semibold border-l-2 border-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-200"
                          : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 font-normal"
                      }>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer Dropdown ────────────────────────────────── */}
      <SidebarFooter className="border-t border-zinc-800 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full rounded-xl bg-zinc-800/50 hover:bg-zinc-800 text-white hover:text-white transition-all duration-200 data-[state=open]:bg-zinc-800 px-3 py-2 h-auto">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold ring-2 ring-white/10 shadow-md">
                    WA
                  </div>
                  <div className="flex flex-col truncate min-w-0 ml-1">
                    <span className="truncate text-sm font-semibold text-zinc-100">
                      Waseem Akram 021
                    </span>
                    <span className="truncate text-xs text-zinc-400">
                      Full-Stack Developer
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 text-zinc-500" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="end"
                sideOffset={8}
                className="w-64 rounded-2xl bg-zinc-900 border border-zinc-800 p-0 shadow-2xl shadow-black/70 text-zinc-100 overflow-hidden">
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border-b border-zinc-800">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white shadow-lg ring-2 ring-white/10">
                      WA
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-white">
                        Waseem Akram 021
                      </span>
                      <span className="flex items-center gap-1 text-xs text-indigo-300">
                        <Code2 className="h-3 w-3" />
                        Full-Stack Developer
                      </span>
                      <span className="flex items-center gap-1 text-xs text-zinc-500">
                        <MapPin className="h-3 w-3" />
                        Karachi, Pakistan
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <div className="p-1.5">
                  <DropdownMenuItem
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/15 hover:text-red-300 focus:bg-red-500/15 focus:text-red-300 cursor-pointer transition-colors"
                    onClick={() => console.log("Sign out")}>
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
