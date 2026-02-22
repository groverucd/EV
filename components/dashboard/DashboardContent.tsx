"use client"

import {
  Activity,
  AlertTriangle,
  Battery,
  BatteryCharging,
  ChevronRight,
  MapPin,
  Zap,
} from "lucide-react"
import Link from "next/link"

/* ═══════════════════════════════════════════
   Stat Card
   ═══════════════════════════════════════════ */

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  accent,
}: {
  label: string
  value: string
  change: string
  icon: React.ElementType
  accent?: string
}) {
  const isPositive = change.startsWith("+")
  return (
    <div className="glass-panel p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: accent ? `${accent}15` : "hsl(199 89% 48% / 0.1)" }}
        >
          <Icon
            size={16}
            style={{ color: accent || "hsl(199, 89%, 48%)" }}
          />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-sans font-bold text-foreground">{value}</span>
        <span
          className={`text-xs font-mono ${isPositive ? "text-emerald-400" : "text-red-400"}`}
        >
          {change}
        </span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Charger Row
   ═══════════════════════════════════════════ */

function ChargerRow({
  id,
  location,
  status,
  risk,
  power,
}: {
  id: string
  location: string
  status: "online" | "warning" | "offline"
  risk: number
  power: string
}) {
  const statusColors = {
    online: "bg-emerald-400",
    warning: "bg-accent",
    offline: "bg-destructive",
  }

  return (
    <Link
      href={`/charger/${id}`}
      className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/30 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className={`h-2 w-2 rounded-full ${statusColors[status]}`} />
        <div>
          <p className="text-sm font-sans font-medium text-foreground">{id}</p>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs font-mono text-foreground">{power}</p>
          <p className="text-xs text-muted-foreground">
            Risk: <span className={risk > 60 ? "text-red-400" : "text-emerald-400"}>{risk}%</span>
          </p>
        </div>
        <ChevronRight
          size={14}
          className="text-muted-foreground group-hover:text-foreground transition-colors"
        />
      </div>
    </Link>
  )
}

/* ═══════════════════════════════════════════
   Dashboard Content
   ═══════════════════════════════════════════ */

export function DashboardContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Zap size={16} className="text-primary" />
            </div>
            <div>
              <h1 className="text-base font-sans font-semibold text-foreground">
                InfraCopilot AI
              </h1>
              <p className="text-xs text-muted-foreground">Fleet Dashboard</p>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-primary bg-primary/10"
            >
              Dashboard
            </Link>
            <Link
              href="/insights"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Insights
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Active Chargers"
            value="247"
            change="+12"
            icon={BatteryCharging}
          />
          <StatCard
            label="Fleet Uptime"
            value="98.4%"
            change="+0.3%"
            icon={Activity}
            accent="hsl(142, 76%, 36%)"
          />
          <StatCard
            label="At-Risk Units"
            value="8"
            change="-3"
            icon={AlertTriangle}
            accent="hsl(36, 95%, 55%)"
          />
          <StatCard
            label="Energy Delivered"
            value="4.2 MW"
            change="+8%"
            icon={Battery}
            accent="hsl(199, 89%, 48%)"
          />
        </div>

        {/* Charger list */}
        <div className="glass-panel flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <h2 className="text-sm font-sans font-semibold text-foreground">
              Fleet Overview
            </h2>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Davis, CA</span>
            </div>
          </div>
          <div className="flex flex-col p-2">
            <ChargerRow
              id="CHG-001"
              location="Main St Station"
              status="online"
              risk={12}
              power="150 kW"
            />
            <ChargerRow
              id="CHG-002"
              location="University Ave"
              status="warning"
              risk={73}
              power="50 kW"
            />
            <ChargerRow
              id="CHG-003"
              location="Downtown Hub"
              status="online"
              risk={8}
              power="350 kW"
            />
            <ChargerRow
              id="CHG-004"
              location="I-80 Rest Stop"
              status="offline"
              risk={95}
              power="0 kW"
            />
            <ChargerRow
              id="CHG-005"
              location="Covell Blvd"
              status="online"
              risk={22}
              power="150 kW"
            />
            <ChargerRow
              id="CHG-006"
              location="North Davis Plaza"
              status="online"
              risk={5}
              power="50 kW"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
