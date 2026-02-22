"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between py-4 px-1">
      <span className="text-[11px] text-muted-foreground">
        <span className="font-semibold text-foreground font-mono tabular-nums">{start.toLocaleString()}</span>
        {" - "}
        <span className="font-semibold text-foreground font-mono tabular-nums">{end.toLocaleString()}</span>
        {" of "}
        <span className="font-semibold text-foreground font-mono tabular-nums">{total.toLocaleString()}</span>
        {" chargers"}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-xl border border-border/60 text-sm transition-all duration-200",
            page <= 1
              ? "text-muted-foreground/20 cursor-not-allowed"
              : "text-foreground hover:bg-secondary hover:border-border active:scale-95"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {generatePageNumbers(page, totalPages).map((p, i) =>
          p === "..." ? (
            <span
              key={`dots-${i}`}
              className="flex items-center justify-center w-8 h-8 text-[10px] text-muted-foreground/40"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-xl text-[11px] font-semibold transition-all duration-200 font-mono",
                page === p
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-xl border border-border/60 text-sm transition-all duration-200",
            page >= totalPages
              ? "text-muted-foreground/20 cursor-not-allowed"
              : "text-foreground hover:bg-secondary hover:border-border active:scale-95"
          )}
          aria-label="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function generatePageNumbers(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}
