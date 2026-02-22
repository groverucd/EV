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
    <div className="flex items-center justify-between py-4">
      <span className="text-xs text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{start.toLocaleString()}</span> to{" "}
        <span className="font-semibold text-foreground">{end.toLocaleString()}</span> of{" "}
        <span className="font-semibold text-foreground">{total.toLocaleString()}</span> chargers
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-lg border border-border text-sm transition-colors",
            page <= 1
              ? "text-muted-foreground/30 cursor-not-allowed"
              : "text-foreground hover:bg-secondary"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {generatePageNumbers(page, totalPages).map((p, i) =>
          p === "..." ? (
            <span
              key={`dots-${i}`}
              className="flex items-center justify-center w-9 h-9 text-xs text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-lg text-xs font-medium transition-colors",
                page === p
                  ? "bg-primary text-primary-foreground"
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
            "flex items-center justify-center w-9 h-9 rounded-lg border border-border text-sm transition-colors",
            page >= totalPages
              ? "text-muted-foreground/30 cursor-not-allowed"
              : "text-foreground hover:bg-secondary"
          )}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function generatePageNumbers(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
}
