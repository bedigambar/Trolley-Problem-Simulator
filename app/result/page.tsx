"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserChoice } from "../types";
import ResultsDashboard from "../components/ResultsDashboard";

export default function ResultPage() {
  const router = useRouter();
  const [choices, setChoices] = useState<UserChoice[] | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      const stored = localStorage.getItem("trolley_choices");
      if (stored) {
        const parsed = JSON.parse(stored) as UserChoice[];
        if (parsed.length > 0) {
          setChoices(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }
    // No choices found — redirect to home
    router.replace("/");
  }, [router]);

  const handleRestart = () => {
    try {
      localStorage.removeItem("trolley_choices");
    } catch {
      // ignore
    }
    router.push("/test");
  };

  if (!choices) {
    return (
      <div className="min-h-screen bg-[#0c0b09] flex items-center justify-center">
        <p className="text-[#8a7a5a] text-sm font-mono animate-pulse">
          Loading results...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0b09] text-[#e8dcc8] relative overflow-hidden animate-in fade-in duration-700">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#c9a96e]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#8a6e3e]/[0.04] rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-[#d4b88a]/[0.02] rounded-full blur-[80px]" />
      </div>

      {/* Grain texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 px-4 py-8 md:py-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-[#8a7a5a] hover:text-[#c9a96e] transition-colors text-sm mb-4 cursor-pointer"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
              <path d="M11 1L4 8l7 7" />
            </svg>
            Back to Home
          </a>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#e8dcc8] tracking-tight text-center">
            The Trolley Problem
          </h1>
          <div className="w-16 h-px bg-[#c9a96e]/30 mx-auto mt-3" />
        </div>

        <ResultsDashboard choices={choices} onRestart={handleRestart} />
      </div>
    </div>
  );
}
