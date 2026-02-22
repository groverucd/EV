"use client"

import { ArrowLeft, TrendingUp, BarChart3, PieChart } from "lucide-react"
import Link from "next/link"

export function InsightsContent() {
  const insights = [
    {
      title: "Failure Prediction Accuracy",
      value: "94.2%",
      trend: "+2.1%",
      description: "Model accuracy over the last 30 days across all monitored chargers.",
      icon: TrendingUp,
    },
    {
      title: "Average Time to Repair",
      value: "3.8h",
      trend: "-1.2h",
      description: "Mean repair time since Copilot playbook integration.",
      icon: BarChart3,
    },
    {
      title: "Fleet Utilization",
      value: "78%",
      trend: "+5%",
      description: "Average utilization rate across the Davis network.",
      icon: PieChart,
    },
  ]

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
              Analytics & Insights
            </h1>
            <p className="text-xs text-muted-foreground">
              AI-powered fleet analytics
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
        {insights.map((insight) => (
          <div key={insight.title} className="glass-panel p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <insight.icon size={20} className="text-primary" />
                </div>
                <h2 className="text-sm font-sans font-semibold text-foreground">
                  {insight.title}
                </h2>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-bold text-foreground">
                  {insight.value}
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  {insight.trend}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight.description}
            </p>
          </div>
        ))}
      </main>
    </div>
  )
}
