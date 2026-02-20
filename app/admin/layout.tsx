import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-zinc-950">
        <AppSidebar />
        <div className="flex flex-1 flex-col min-w-0 bg-zinc-950">
          {/* Sticky top bar with trigger */}
          <header className="sticky top-0 z-40 flex items-center h-12 px-3 bg-zinc-950 border-b border-zinc-900/80 shrink-0">
            <SidebarTrigger className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg p-1.5 transition-all" />
          </header>
          {/* Page content */}
          <main className="flex-1 overflow-auto bg-zinc-950">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
