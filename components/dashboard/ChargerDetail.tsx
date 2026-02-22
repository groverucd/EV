"use client"

import { ArrowLeft, Battery, Thermometer, Clock, Zap } from "lucide-react"
import Link from "next/link"

export function ChargerDetail({ chargerId }: { chargerId: string }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <Link
            href="/dashboard"
            className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft size={16} className="text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-base font-sans font-semibold text-foreground">
              {chargerId}
            </h1>
            <p className="text-xs text-muted-foreground">Charger Detail</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Status", value: "Online", icon: Zap, color: "text-emerald-400" },
            { label: "Temperature", value: "42C", icon: Thermometer, color: "text-accent" },
            { label: "Charge Level", value: "87%", icon: Battery, color: "text-primary" },
            { label: "Uptime", value: "99.2%", icon: Clock, color: "text-foreground" },
          ].map((item) => (
            <div key={item.label} className="glass-panel p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <item.icon size={14} className="text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
              <span className={`text-2xl font-sans font-bold ${item.color}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-sm font-sans font-semibold text-foreground mb-4">
            AI Copilot Analysis
          </h2>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              This charger is operating within normal parameters. The ML model
              predicts a low risk of failure over the next 72 hours. Temperature
              is slightly elevated but within acceptable thresholds.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-emerald-400">
                LOW RISK
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
