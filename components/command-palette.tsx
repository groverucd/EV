"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  LayoutDashboard,
  BarChart3,
  Search,
  Zap,
  Settings,
  BotMessageSquare,
} from "lucide-react";

const PAGES = [
  { name: "Fleet Dashboard", href: "/", icon: LayoutDashboard, group: "Pages" },
  { name: "Insights & Analytics", href: "/insights", icon: BarChart3, group: "Pages" },
  { name: "Settings", href: "/settings", icon: Settings, group: "Pages" },
];

const QUICK_CHARGERS = [
  "CHG-000001",
  "CHG-000005",
  "CHG-000010",
  "CHG-000042",
  "CHG-000100",
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      setOpen(false);
      setSearch("");
    },
    [router]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 cmd-overlay" onClick={() => setOpen(false)}>
      <div className="fixed inset-0 bg-background/60 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-start justify-center pt-[20vh]">
        <div
          className="cmd-dialog w-full max-w-lg mx-4 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <Command shouldFilter={true} className="flex flex-col">
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder="Search pages, chargers, commands..."
                className="flex-1 h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono text-muted-foreground">
                ESC
              </kbd>
            </div>

            <Command.List className="max-h-72 overflow-y-auto p-2">
              <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>

              <Command.Group
                heading="Pages"
                className="mb-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground"
              >
                {PAGES.map((page) => (
                  <Command.Item
                    key={page.href}
                    value={page.name}
                    onSelect={() => navigate(page.href)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors"
                  >
                    <page.icon className="w-4 h-4 shrink-0 text-muted-foreground" />
                    {page.name}
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group
                heading="Quick Access Chargers"
                className="mb-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground"
              >
                {QUICK_CHARGERS.map((id) => (
                  <Command.Item
                    key={id}
                    value={id}
                    onSelect={() => navigate(`/charger/${id}`)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors"
                  >
                    <Zap className="w-4 h-4 shrink-0 text-muted-foreground" />
                    <span className="font-mono text-xs">{id}</span>
                    <span className="text-xs text-muted-foreground ml-auto">View detail</span>
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group
                heading="Actions"
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground"
              >
                <Command.Item
                  value="Copilot AI assistant"
                  onSelect={() => navigate("/charger/CHG-000001")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors"
                >
                  <BotMessageSquare className="w-4 h-4 shrink-0 text-muted-foreground" />
                  Open Copilot
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      </div>
    </div>
  );
}
