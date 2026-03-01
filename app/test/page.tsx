"use client";

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { scenarios } from "../scenarios";
import type { UserChoice } from "../types";
import ScenarioCard from "../components/ScenarioCard";

export default function TestPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setChoices] = useState<UserChoice[]>([]);
  const choicesRef = useRef<UserChoice[]>([]);
  const [timedMode, setTimedMode] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30);
  const [extendedMode, setExtendedMode] = useState(false);
  const [transition, setTransition] = useState<"idle" | "out" | "in">("idle");
  const [pageExit, setPageExit] = useState(false);

  // Filter scenarios based on extended mode
  const activeScenarios = useMemo(() => {
    if (extendedMode) {
      return scenarios; // All scenarios
    }
    return scenarios.filter((s) => !s.extended); // Core scenarios only
  }, [extendedMode]);

  // Scroll to top and read preferences on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      const stored = localStorage.getItem("trolley_timed_mode");
      if (stored === "true") setTimedMode(true);
      const storedDuration = localStorage.getItem("trolley_timer_duration");
      if (storedDuration) setTimerDuration(Number(storedDuration));
      const storedExtended = localStorage.getItem("trolley_extended_mode");
      if (storedExtended === "true") setExtendedMode(true);
    } catch {
      // ignore
    }
  }, []);

  const handleChoice = useCallback((choice: UserChoice) => {
    setChoices((prev) => {
      const next = [...prev, choice];
      choicesRef.current = next;
      return next;
    });
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < activeScenarios.length - 1) {
      // Trigger exit animation
      setTransition("out");
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setTransition("in");
        setTimeout(() => setTransition("idle"), 400);
      }, 300);
    } else {
      // Save choices to localStorage and navigate to results
      // Use ref to ensure we have the latest choices including the one just added
      try {
        localStorage.setItem(
          "trolley_choices",
          JSON.stringify(choicesRef.current)
        );
      } catch {
        // ignore
      }
      // Fade out before navigating
      setPageExit(true);
      setTimeout(() => router.push("/result"), 600);
    }
  }, [currentIndex, router, activeScenarios.length]);

  const transitionClass =
    transition === "out"
      ? "opacity-0 -translate-x-12 scale-[0.98]"
      : transition === "in"
        ? "opacity-0 translate-x-12 scale-[0.98]"
        : "opacity-100 translate-x-0 scale-100";

  return (
    <div className={`min-h-screen bg-[#0c0b09] text-[#e8dcc8] relative overflow-hidden transition-all duration-500 ease-out ${pageExit ? "opacity-0 scale-[0.97] blur-sm" : "opacity-100 scale-100 blur-0"}`}>
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
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#e8dcc8] tracking-tight">
            The Trolley Problem
          </h1>
          <div className="w-16 h-px bg-[#c9a96e]/30 mx-auto mt-3" />
        </header>

        <div
          className={`transition-all duration-300 ease-out ${transitionClass}`}
        >
          <ScenarioCard
            key={activeScenarios[currentIndex].id}
            scenario={activeScenarios[currentIndex]}
            index={currentIndex}
            total={activeScenarios.length}
            onChoice={handleChoice}
            onNext={handleNext}
            timedMode={timedMode}
            timerDuration={timerDuration}
          />
        </div>
      </div>
    </div>
  );
}
