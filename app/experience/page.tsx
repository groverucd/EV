"use client";

import { useRouter } from "next/navigation";

export default function ExperiencePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#06080f] text-foreground">
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        Experience Page Loaded
      </h1>
      <p className="text-sm text-neutral-400">
        The /experience route is working.
      </p>
      <button
        onClick={() => router.push("/")}
        className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-[#06080f] transition-colors hover:bg-neutral-200"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
