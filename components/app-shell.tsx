"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";
import { CommandPalette } from "./command-palette";
import {
  LayoutDashboard,
  BarChart3,
  Zap,
  ChevronLeft,
  ChevronRight,
  Activity,
  Shield,
  Search,
  Sun,
  Moon,
  Settings,
  BotMessageSquare,
  User,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Insights", href: "/insights", icon: BarChart3 },
  { label: "Copilot", href: "/charger/CHG-000001", icon: BotMessageSquare },
  { label: "Settings", href: "/settings", icon: Settings },
];

function StreamingIndicator() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-safe/10 border border-safe/20">
      <div className="streaming-dot flex items-center justify-center w-2 h-2">
        <span className="block w-2 h-2 rounded-full bg-safe" />
      </div>
      <span className="text-[11px] font-medium text-safe">Streaming</span>
    </div>
  );
}

function ProfileMenu() {
  return (
    <button
      className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors focus-ring"
      aria-label="Profile"
    >
      <User className="w-4 h-4" />
    </button>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <CommandPalette />
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar */}
        <aside
          className={cn(
            "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-muted/50 transition-all duration-300 ease-in-out shrink-0 relative",
            collapsed ? "w-[68px]" : "w-[240px]"
          )}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-muted/50">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/15 shrink-0">
              <Zap className="w-[18px] h-[18px] text-primary" />
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-[13px] font-bold tracking-tight text-sidebar-foreground truncate">
                  InfraCopilot
                </span>
                <span className="text-[10px] text-primary font-semibold uppercase tracking-[0.2em]">
                  AI
                </span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-2.5">
            <div className="flex flex-col gap-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : item.href === "/charger/CHG-000001"
                      ? pathname.startsWith("/charger")
                      : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-accent/80 text-sidebar-foreground shadow-sm"
                        : "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-muted/50"
                    )}
                  >
                    {/* Active glow */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-primary/5 ring-1 ring-primary/20" />
                    )}
                    <item.icon className={cn("w-[18px] h-[18px] shrink-0 relative z-10", isActive && "text-primary")} />
                    {!collapsed && (
                      <span className="truncate relative z-10">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Model info */}
          {!collapsed && (
            <div className="mx-2.5 mb-3 p-3.5 rounded-xl bg-sidebar-muted/40 border border-sidebar-muted/50">
              <div className="flex items-center gap-2 mb-2.5">
                <Shield className="w-3.5 h-3.5 text-safe" />
                <span className="text-[11px] font-semibold text-sidebar-foreground/70">
                  Model v4 Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] text-sidebar-foreground/40">
                  98% Failure Recall
                </span>
              </div>
            </div>
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center h-11 border-t border-sidebar-muted/50 text-sidebar-foreground/30 hover:text-sidebar-foreground/70 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top header */}
          <header className="flex items-center justify-between h-14 px-6 border-b border-border/50 bg-background/80 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2.5 h-9 px-3.5 rounded-xl bg-secondary/80 border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-all cursor-pointer focus-ring press-scale"
                onClick={() => {
                  const event = new KeyboardEvent("keydown", {
                    key: "k",
                    metaKey: true,
                  });
                  document.dispatchEvent(event);
                }}
              >
                <Search className="w-3.5 h-3.5" />
                <span className="text-xs">Search...</span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-background/80 text-[10px] font-mono text-muted-foreground/70 border border-border/50 ml-6">
                  {"Cmd+K"}
                </kbd>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <StreamingIndicator />
              <div className="w-px h-5 bg-border/50" />
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-ring"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
              <ProfileMenu />
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </>
  );
}
