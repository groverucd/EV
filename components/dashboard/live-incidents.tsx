"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { AlertOctagon, Clock, ArrowRight } from "lucide-react";

interface Incident {
  charger_id: string;
  risk_percent: number;
  ttf: string;
  cause: string;
  time_ago: string;
}

const MOCK_INCIDENTS: Incident[] = [
  {
    charger_id: "CHG-000042",
    risk_percent: 94.2,
    ttf: "< 6 hours",
    cause: "Thermal Stress Index",
    time_ago: "2m ago",
  },
  {
    charger_id: "CHG-000137",
    risk_percent: 91.8,
    ttf: "< 12 hours",
    cause: "Voltage Deviation",
    time_ago: "8m ago",
  },
  {
    charger_id: "CHG-000003",
    risk_percent: 88.5,
    ttf: "< 18 hours",
    cause: "Risk Pressure Buildup",
    time_ago: "14m ago",
  },
  {
    charger_id: "CHG-000891",
    risk_percent: 85.1,
    ttf: "< 24 hours",
    cause: "Error Density Spike",
    time_ago: "23m ago",
  },
  {
    charger_id: "CHG-000456",
    risk_percent: 82.7,
    ttf: "< 24 hours",
    cause: "Power Cycling Fatigue",
    time_ago: "31m ago",
  },
];

export function LiveIncidents() {
  return (
    <div className="rounded-2xl border border-critical/20 bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40 bg-critical/[0.03]">
        <div className="flex items-center gap-2.5">
          <div className="streaming-dot flex items-center justify-center w-2.5 h-2.5">
            <span className="block w-2.5 h-2.5 rounded-full bg-critical" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-critical">
            Live Incidents
          </h3>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          {MOCK_INCIDENTS.length} active
        </span>
      </div>

      <div className="divide-y divide-border/30">
        {MOCK_INCIDENTS.map((incident) => (
          <Link
            key={incident.charger_id}
            href={`/charger/${incident.charger_id}`}
            className="group flex items-center gap-4 px-5 py-3.5 hover:bg-critical/[0.03] transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-critical/10 shrink-0">
              <AlertOctagon className="w-4 h-4 text-critical" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-xs font-bold text-foreground">
                  {incident.charger_id}
                </span>
                <span className="font-mono text-[10px] font-bold text-critical">
                  {incident.risk_percent}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground truncate">
                  {incident.cause}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-0.5 shrink-0">
              <div className="flex items-center gap-1 text-critical">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-bold">{incident.ttf}</span>
              </div>
              <span className="text-[9px] text-muted-foreground/60">
                {incident.time_ago}
              </span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-critical/60 transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
