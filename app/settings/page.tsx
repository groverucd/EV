import { AppShell } from "@/components/app-shell";
import { Shield, Bell, Palette, Database } from "lucide-react";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Configure InfraCopilot AI preferences and integrations
        </p>

        <div className="flex flex-col gap-4">
          {[
            {
              icon: Shield,
              title: "Model Configuration",
              desc: "Adjust risk threshold, model version, and recall targets",
            },
            {
              icon: Bell,
              title: "Notifications",
              desc: "Configure alert channels for critical and warning events",
            },
            {
              icon: Palette,
              title: "Appearance",
              desc: "Theme preferences and dashboard layout customization",
            },
            {
              icon: Database,
              title: "Data Sources",
              desc: "Connect your fleet data via API or configure data sync",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 p-5 rounded-2xl border border-border/60 bg-card hover:border-border transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary group-hover:bg-primary/10 transition-colors">
                <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
