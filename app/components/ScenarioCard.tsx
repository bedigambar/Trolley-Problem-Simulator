"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import type { Scenario, UserChoice } from "../types";
import TrolleyVisualizer from "./TrolleyVisualizer";

interface ScenarioCardProps {
  scenario: Scenario;
  index: number;
  total: number;
  onChoice: (choice: UserChoice) => void;
  onNext: () => void;
  timedMode?: boolean;
  timerDuration?: number;
}

const DEFAULT_TIMER_DURATION = 30; // seconds

const difficultyConfig: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  "Warm-Up": {
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
  },
  Hard: {
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  "Gut-Wrenching": {
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
  },
  "Soul-Crushing": {
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
  },
};

export default function ScenarioCard({
  scenario,
  index,
  total,
  onChoice,
  onNext,
  timedMode = false,
  timerDuration,
}: ScenarioCardProps) {
  const TIMER_DURATION = timerDuration ?? DEFAULT_TIMER_DURATION;
  const CONFIRMATION_TIMER = Math.floor(TIMER_DURATION / 2);
  const [selected, setSelected] = useState<"A" | "B" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [hoveredChoice, setHoveredChoice] = useState<"A" | "B" | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [showConfidence, setShowConfidence] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [confirmationPhase, setConfirmationPhase] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<"A" | "B" | null>(null);
  const [confirmationTimeLeft, setConfirmationTimeLeft] = useState(CONFIRMATION_TIMER);
  const [wasSkipped, setWasSkipped] = useState(false);
  const [initialChoice, setInitialChoice] = useState<"A" | "B" | null>(null); // Track if answer was changed
  const startTime = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const confirmationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAutoSubmitted = useRef(false);
  const pendingChoice = useRef<Omit<UserChoice, 'confidence'> | null>(null);
  const selectedRef = useRef<"A" | "B" | null>(null);
  const isRevealedRef = useRef(false);
  const showConfidenceRef = useRef(false);
  const confirmationPhaseRef = useRef(false);
  const pendingSelectionRef = useRef<"A" | "B" | null>(null);
  const initialChoiceRef = useRef<"A" | "B" | null>(null);

  // Keep refs in sync
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);
  useEffect(() => {
    isRevealedRef.current = isRevealed;
  }, [isRevealed]);
  useEffect(() => {
    showConfidenceRef.current = showConfidence;
  }, [showConfidence]);
  useEffect(() => {
    confirmationPhaseRef.current = confirmationPhase;
  }, [confirmationPhase]);
  useEffect(() => {
    pendingSelectionRef.current = pendingSelection;
  }, [pendingSelection]);
  useEffect(() => {
    initialChoiceRef.current = initialChoice;
  }, [initialChoice]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (confirmationTimerRef.current) clearInterval(confirmationTimerRef.current);
    };
  }, []);

  // Handle skipping when timer runs out
  const handleSkip = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (confirmationTimerRef.current) clearInterval(confirmationTimerRef.current);
    
    const responseTimeMs = Date.now() - startTime.current;
    setWasSkipped(true);
    setIsRevealed(true);
    
    // Store skipped choice
    pendingChoice.current = {
      scenarioId: scenario.id,
      choice: null,
      philosophy: null,
      responseTimeMs,
      timedMode,
      skipped: true,
    };
  }, [scenario.id, timedMode]);

  // Initial choice - goes to confirmation phase
  const handleInitialChoice = useCallback(
    (choice: "A" | "B") => {
      if (selectedRef.current || confirmationPhaseRef.current) return;
      if (timerRef.current) clearInterval(timerRef.current);

      // Track initial choice (only set once per question)
      setInitialChoice((prev) => prev === null ? choice : prev);
      
      setPendingSelection(choice);
      setConfirmationPhase(true);
      setConfirmationTimeLeft(CONFIRMATION_TIMER);
      setHoveredChoice(null);

      // Start confirmation timer if in timed mode
      if (timedMode) {
        confirmationTimerRef.current = setInterval(() => {
          setConfirmationTimeLeft((prev) => {
            if (prev <= 1) {
              if (confirmationTimerRef.current) clearInterval(confirmationTimerRef.current);
              // Auto-confirm when confirmation timer runs out
              setTimeout(() => {
                if (pendingSelectionRef.current && !selectedRef.current) {
                  handleConfirmChoice();
                }
              }, 0);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timedMode, TIMER_DURATION]
  );

  // Confirm the pending choice
  const handleConfirmChoice = useCallback(async () => {
    const choice = pendingSelectionRef.current;
    if (!choice || selectedRef.current) return;
    
    if (confirmationTimerRef.current) clearInterval(confirmationTimerRef.current);

    const responseTimeMs = Date.now() - startTime.current;
    const option = choice === "A" ? scenario.optionA : scenario.optionB;
    
    // Check if user changed their answer
    const didChangeAnswer = initialChoiceRef.current !== null && initialChoiceRef.current !== choice;

    setSelected(choice);
    setConfirmationPhase(false);
    setPendingSelection(null);
    setResponseTime(responseTimeMs);
    setIsAnimating(true);

    // Animate trolley
    await new Promise((r) => setTimeout(r, 1400));
    setIsAnimating(false);
    setIsRevealed(true);
    setShowConfidence(true);

    // Store pending choice — onChoice will fire in handleNext with confidence
    pendingChoice.current = {
      scenarioId: scenario.id,
      choice,
      philosophy: option.philosophy,
      responseTimeMs,
      timedMode,
      ...(didChangeAnswer && initialChoiceRef.current ? { changedFrom: initialChoiceRef.current } : {}),
    };

    // Report to server (without confidence for now)
    try {
      await fetch("/api/trolley", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingChoice.current),
      });
    } catch {
      // Silent fail — stats are best-effort
    }
  }, [scenario, timedMode]);

  // Change choice - go back to selection
  const handleChangeChoice = useCallback(() => {
    if (confirmationTimerRef.current) clearInterval(confirmationTimerRef.current);
    
    setConfirmationPhase(false);
    setPendingSelection(null);
    setTimeLeft(TIMER_DURATION);
    startTime.current = Date.now();

    // Restart main timer if in timed mode
    if (timedMode) {
      hasAutoSubmitted.current = false;
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (!hasAutoSubmitted.current) {
              hasAutoSubmitted.current = true;
              setTimeout(() => handleSkip(), 0);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [timedMode, TIMER_DURATION, handleSkip]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const key = e.key.toLowerCase();

      // Handle confirmation phase shortcuts
      if (confirmationPhaseRef.current) {
        if (key === "y" || key === "enter") {
          e.preventDefault();
          handleConfirmChoice();
        } else if (key === "n" || key === "c") {
          e.preventDefault();
          handleChangeChoice();
        }
        return;
      }

      if (!selectedRef.current && !confirmationPhaseRef.current) {
        if (key === "a") {
          e.preventDefault();
          handleInitialChoice("A");
        } else if (key === "b") {
          e.preventDefault();
          handleInitialChoice("B");
        }
      }

      if (key === "enter" && isRevealedRef.current && !confirmationPhaseRef.current) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInitialChoice, handleConfirmChoice, handleChangeChoice]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timed mode countdown
  useEffect(() => {
    if (!timedMode || selectedRef.current || confirmationPhaseRef.current) return;

    hasAutoSubmitted.current = false;
    setTimeLeft(TIMER_DURATION);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (!hasAutoSubmitted.current) {
            hasAutoSubmitted.current = true;
            setTimeout(() => handleSkip(), 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timedMode, scenario.id, handleSkip, TIMER_DURATION]);

  const handleNext = () => {
    // Fire onChoice with the captured confidence
    if (pendingChoice.current) {
      onChoice({ ...pendingChoice.current, confidence: confidence ?? undefined });
      pendingChoice.current = null;
    }

    setSelected(null);
    selectedRef.current = null;
    setIsAnimating(false);
    setIsRevealed(false);
    setShowInsight(false);
    setShowConfidence(false);
    setConfidence(null);
    setHoveredChoice(null);
    setTimeLeft(TIMER_DURATION);
    setResponseTime(null);
    setConfirmationPhase(false);
    setPendingSelection(null);
    setConfirmationTimeLeft(CONFIRMATION_TIMER);
    setWasSkipped(false);
    setInitialChoice(null); // Reset initial choice for next question
    initialChoiceRef.current = null;
    hasAutoSubmitted.current = false;
    startTime.current = Date.now();
    onNext();
  };

  const timerPct = confirmationPhase 
    ? (confirmationTimeLeft / CONFIRMATION_TIMER) * 100 
    : (timeLeft / TIMER_DURATION) * 100;
  const timerUrgent = confirmationPhase ? confirmationTimeLeft <= 5 : timeLeft <= 10;
  const currentTimer = confirmationPhase ? confirmationTimeLeft : timeLeft;
  const diff = difficultyConfig[scenario.difficulty] || difficultyConfig["Hard"];

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#8a7a5a] font-mono">
            Dilemma {index + 1} of {total}
          </span>
          <div className="flex items-center gap-2">
            {timedMode && !selected && !wasSkipped && (
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded-full border transition-colors ${
                  timerUrgent
                    ? "text-red-400 border-red-400/30 bg-red-400/10 animate-pulse"
                    : confirmationPhase
                      ? "text-amber-400 border-amber-400/20 bg-amber-400/5"
                      : "text-[#c9a96e] border-[#c9a96e]/20 bg-[#c9a96e]/5"
                }`}
              >
                {confirmationPhase ? `Confirm: ${currentTimer}s` : `${currentTimer}s`}
              </span>
            )}
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${diff.color} ${diff.bg} ${diff.border}`}
            >
              {scenario.difficulty}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-[#1a1710] text-[#8a7a5a] border border-[#c9a96e]/15">
              {scenario.category}
            </span>
          </div>
        </div>
        <div className="relative">
          <div className="h-1 bg-[#1a1710] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c9a96e] transition-all duration-700 ease-out rounded-full"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
          {/* Timer bar overlay */}
          {timedMode && !selected && !wasSkipped && (
            <div className="absolute top-2 left-0 right-0 h-0.5 bg-[#1a1710]/50 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 linear rounded-full ${
                  timerUrgent ? "bg-red-400/60" : confirmationPhase ? "bg-amber-400/40" : "bg-[#c9a96e]/30"
                }`}
                style={{ width: `${timerPct}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#e8dcc8] mb-2 tracking-tight">
        {scenario.title}
      </h2>
      <p className="text-sm text-[#c9a96e]/80 font-semibold mb-4">
        Stakes: {scenario.stakes}
      </p>

      {/* Visualizer */}
      <div className="relative">
        <TrolleyVisualizer
          scenario={scenario}
          choiceMade={selected}
          isAnimating={isAnimating}
        />
        {/* Hover preview overlay */}
        {hoveredChoice && !selected && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div
              className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider uppercase animate-in fade-in duration-200 ${
                hoveredChoice === "A"
                  ? "bg-[#e8dcc8]/10 text-[#e8dcc8] border border-[#e8dcc8]/20"
                  : "bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/20"
              }`}
            >
              {hoveredChoice === "A" ? "← Divert" : "Continue →"}
            </div>
          </div>
        )}
      </div>

      {/* Narrative */}
      <div className="mt-6 p-5 bg-[#1a1710]/80 rounded-xl border border-[#c9a96e]/10 backdrop-blur-sm">
        <p className="text-[#c4b99a] leading-relaxed text-base">
          {scenario.narrative}
        </p>
      </div>

      {/* Choice buttons */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleInitialChoice("A")}
          onMouseEnter={() => !selected && !confirmationPhase && !wasSkipped && setHoveredChoice("A")}
          onMouseLeave={() => setHoveredChoice(null)}
          disabled={!!selected || confirmationPhase || wasSkipped}
          className={`group relative p-5 rounded-xl border-2 text-left transition-all duration-300 ${
            selected === "A"
              ? "border-[#e8dcc8] bg-[#e8dcc8]/10 shadow-lg shadow-[#e8dcc8]/10"
              : pendingSelection === "A"
                ? "border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/10"
                : selected || confirmationPhase || wasSkipped
                  ? "border-[#1a1710] bg-[#1a1710]/50 opacity-40"
                  : "border-[#c9a96e]/15 bg-[#1a1710]/60 hover:border-[#e8dcc8]/40 hover:bg-[#e8dcc8]/5 cursor-pointer"
          }`}
        >
          {/* Keyboard hint */}
          {!selected && !confirmationPhase && !wasSkipped && (
            <span className="absolute top-2 right-2 text-[10px] font-mono text-[#5a5040] opacity-0 group-hover:opacity-100 transition-opacity">
              Press A
            </span>
          )}
          <div className="flex items-start gap-3">
            <span
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-serif ${
                selected === "A"
                  ? "bg-[#e8dcc8] text-[#0c0b09]"
                  : pendingSelection === "A"
                    ? "bg-amber-400 text-[#0c0b09]"
                    : "bg-[#c9a96e]/10 text-[#8a7a5a] group-hover:bg-[#e8dcc8]/15 group-hover:text-[#e8dcc8]"
              }`}
            >
              A
            </span>
            <div>
              <h3 className="font-semibold text-[#e8dcc8] text-lg mb-1">
                {scenario.optionA.label}
              </h3>
              <p className="text-[#8a7a5a] text-sm leading-relaxed">
                {scenario.optionA.description}
              </p>
            </div>
          </div>
          {selected === "A" && isRevealed && (
            <div className="mt-3 pt-3 border-t border-[#e8dcc8]/20">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e8dcc8]/10 text-[#c4b99a]">
                ◆{" "}
                {scenario.optionA.philosophy === "utilitarian"
                  ? "Utilitarian"
                  : "Deontological"}{" "}
                choice
              </span>
            </div>
          )}
        </button>

        <button
          onClick={() => handleInitialChoice("B")}
          onMouseEnter={() => !selected && !confirmationPhase && !wasSkipped && setHoveredChoice("B")}
          onMouseLeave={() => setHoveredChoice(null)}
          disabled={!!selected || confirmationPhase || wasSkipped}
          className={`group relative p-5 rounded-xl border-2 text-left transition-all duration-300 ${
            selected === "B"
              ? "border-[#c9a96e] bg-[#c9a96e]/10 shadow-lg shadow-[#c9a96e]/10"
              : pendingSelection === "B"
                ? "border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/10"
                : selected || confirmationPhase || wasSkipped
                  ? "border-[#1a1710] bg-[#1a1710]/50 opacity-40"
                  : "border-[#c9a96e]/15 bg-[#1a1710]/60 hover:border-[#c9a96e]/40 hover:bg-[#c9a96e]/5 cursor-pointer"
          }`}
        >
          {/* Keyboard hint */}
          {!selected && !confirmationPhase && !wasSkipped && (
            <span className="absolute top-2 right-2 text-[10px] font-mono text-[#5a5040] opacity-0 group-hover:opacity-100 transition-opacity">
              Press B
            </span>
          )}
          <div className="flex items-start gap-3">
            <span
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-serif ${
                selected === "B"
                  ? "bg-[#c9a96e] text-[#0c0b09]"
                  : pendingSelection === "B"
                    ? "bg-amber-400 text-[#0c0b09]"
                    : "bg-[#c9a96e]/10 text-[#8a7a5a] group-hover:bg-[#c9a96e]/15 group-hover:text-[#c9a96e]"
              }`}
            >
              B
            </span>
            <div>
              <h3 className="font-semibold text-[#e8dcc8] text-lg mb-1">
                {scenario.optionB.label}
              </h3>
              <p className="text-[#8a7a5a] text-sm leading-relaxed">
                {scenario.optionB.description}
              </p>
            </div>
          </div>
          {selected === "B" && isRevealed && (
            <div className="mt-3 pt-3 border-t border-[#c9a96e]/30">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#c9a96e]/15 text-[#c9a96e]">
                ◆{" "}
                {scenario.optionB.philosophy === "utilitarian"
                  ? "Utilitarian"
                  : "Deontological"}{" "}
                choice
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Keyboard hint bar */}
      {!selected && !confirmationPhase && !wasSkipped && (
        <p className="text-center text-[10px] text-[#3d3628] font-mono mt-2 tracking-widest">
          Press A or B to choose
        </p>
      )}

      {/* Confirmation dialog */}
      {confirmationPhase && pendingSelection && (
        <div className="mt-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-5 rounded-xl bg-amber-400/10 border-2 border-amber-400/30 text-center">
            <p className="text-amber-400 font-semibold text-lg mb-1">
              Is this your final answer?
            </p>
            <p className="text-[#c4b99a] text-sm mb-4">
              You selected <span className="font-bold text-amber-400">Option {pendingSelection}</span>: {pendingSelection === "A" ? scenario.optionA.label : scenario.optionB.label}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleConfirmChoice}
                className="px-6 py-2.5 bg-[#c9a96e] text-[#0c0b09] font-semibold rounded-xl hover:bg-[#d4b88a] transition-all duration-300 shadow-lg shadow-[#c9a96e]/10 hover:shadow-[#c9a96e]/25 cursor-pointer"
              >
                Yes, Confirm
              </button>
              <button
                onClick={handleChangeChoice}
                className="px-6 py-2.5 bg-[#1a1710] text-[#c4b99a] font-semibold rounded-xl border border-[#c9a96e]/20 hover:bg-[#c9a96e]/10 hover:text-[#e8dcc8] transition-all duration-300 cursor-pointer"
              >
                Change
              </button>
            </div>
            <p className="text-center text-[10px] text-[#5a5040] font-mono mt-3 tracking-widest">
              Press Y to confirm or N to change
            </p>
          </div>
        </div>
      )}

      {/* Skipped question notice */}
      {wasSkipped && isRevealed && (
        <div className="mt-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-5 rounded-xl bg-red-400/10 border-2 border-red-400/30 text-center">
            <p className="text-red-400 font-semibold text-lg mb-1">
              Time&apos;s Up!
            </p>
            <p className="text-[#c4b99a] text-sm mb-4">
              You didn&apos;t make a choice in time. This question will be marked as skipped.
            </p>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-[#c9a96e] text-[#0c0b09] font-semibold rounded-xl hover:bg-[#d4b88a] transition-all duration-300 shadow-lg shadow-[#c9a96e]/10 hover:shadow-[#c9a96e]/25 cursor-pointer tracking-wide"
            >
              {index < total - 1 ? "Next Dilemma →" : "View My Results →"}
            </button>
          </div>
        </div>
      )}

      {/* Reveal + Insight + Next */}
      {isRevealed && !wasSkipped && (
        <div className="mt-6 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-4 duration-500">
          {/* Response time badge */}
          {responseTime !== null && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1710] border border-[#c9a96e]/15 animate-in fade-in zoom-in-95 duration-300">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-[#c9a96e]/60">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13zM8.5 4h-1v4.5l3.5 2 .5-.82-3-1.68V4z" />
              </svg>
              <span className="text-xs font-mono text-[#c9a96e]">
                Decided in{" "}
                <span className="font-bold">
                  {responseTime < 1000
                    ? `${responseTime}ms`
                    : `${(responseTime / 1000).toFixed(1)}s`}
                </span>
              </span>
              {responseTime < 10000 && (
                <span className="text-[10px] text-[#8a7a5a] italic">— instinctive</span>
              )}
              {responseTime >= 10000 && responseTime < 15000 && (
                <span className="text-[10px] text-[#8a7a5a] italic">— deliberate</span>
              )}
              {responseTime >= 20000 && (
                <span className="text-[10px] text-[#8a7a5a] italic">— deeply conflicted</span>
              )}
            </div>
          )}

          {/* Philosophy label */}
          <div className="p-4 rounded-xl bg-[#1a1710]/80 border border-[#c9a96e]/10 text-center max-w-lg">
            <p className="text-[#c4b99a] text-sm italic font-serif">
              {selected === "A"
                ? scenario.optionA.philosophy === "utilitarian"
                  ? "You chose the utilitarian path — maximizing overall well-being, even at the cost of direct action against an individual."
                  : "You chose the deontological path — prioritizing moral duties and rules over raw outcomes."
                : scenario.optionB.philosophy === "utilitarian"
                  ? "You chose the utilitarian path — maximizing overall well-being, even at the cost of direct action against an individual."
                  : "You chose the deontological path — prioritizing moral duties and rules over raw outcomes."}
            </p>
          </div>

          {/* Confidence slider */}
          {showConfidence && (
            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-400">
              <p className="text-[10px] font-mono text-[#6a6050] tracking-widest uppercase text-center mb-3">
                How confident are you?
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#5a5040] font-mono w-8 text-right shrink-0">Torn</span>
                <div className="flex-1 flex items-center gap-2">
                  {([1, 2, 3, 4, 5] as const).map((level) => {
                    const isSelected = confidence === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfidence(level);
                        }}
                        className={`flex-1 h-10 rounded-lg transition-all duration-200 cursor-pointer border-2 flex items-center justify-center text-sm font-mono font-bold ${
                          isSelected
                            ? "bg-[#c9a96e] border-[#c9a96e] text-[#0c0b09] scale-110 shadow-lg shadow-[#c9a96e]/30"
                            : confidence !== null && level <= confidence
                              ? "bg-[#c9a96e]/20 border-[#c9a96e]/30 text-[#c9a96e]"
                              : "bg-[#1a1710] border-[#2a2518] text-[#5a5040] hover:bg-[#c9a96e]/10 hover:border-[#c9a96e]/30 hover:text-[#c9a96e]"
                        }`}
                        aria-label={`Confidence level ${level}`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[10px] text-[#5a5040] font-mono w-10 shrink-0">Certain</span>
              </div>
              <p className="text-center text-[11px] mt-2 font-mono transition-all duration-200" style={{ color: confidence !== null ? '#c9a96e' : '#5a5040' }}>
                {confidence === null
                  ? "Tap a number to rate"
                  : confidence === 1
                    ? "Complete uncertainty"
                    : confidence === 2
                      ? "Leaning, but unsure"
                      : confidence === 3
                        ? "Somewhat confident"
                        : confidence === 4
                          ? "Fairly certain"
                          : "Absolutely certain"}
              </p>
            </div>
          )}

          {/* Scenario Variant / Food for Thought */}
          <div className="w-full max-w-2xl p-4 rounded-xl bg-[#1a1710]/80 border border-[#c9a96e]/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#c9a96e]/15 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#c9a96e]">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[#c9a96e] text-[10px] font-mono uppercase tracking-wider mb-1">
                  Food for Thought
                </p>
                <p className="text-[#e8dcc8] text-sm font-medium leading-relaxed mb-2">
                  {scenario.variant.twist}
                </p>
                <p className="text-[#8a7a5a] text-xs italic leading-relaxed">
                  {scenario.variant.question}
                </p>
              </div>
            </div>
          </div>

          {/* Insight toggle */}
          <button
            onClick={() => setShowInsight(!showInsight)}
            className="text-[#8a7a5a] text-sm hover:text-[#c9a96e] transition-colors cursor-pointer flex items-center gap-1.5 underline underline-offset-4 decoration-[#c9a96e]/20 hover:decoration-[#c9a96e]/50"
          >
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className={`w-3.5 h-3.5 transition-transform duration-300 ${showInsight ? 'rotate-180' : ''}`}
            >
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 12.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zM7.25 5h1.5v1.5h-1.5V5zm0 3h1.5v3h-1.5V8z" />
            </svg>
            {showInsight ? 'Hide context' : 'Why does this matter?'}
          </button>

          <div
            className={`w-full max-w-2xl overflow-hidden transition-all duration-500 ease-in-out ${
              showInsight ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-5 rounded-xl bg-[#1a1710]/90 border border-[#c9a96e]/15 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[#c9a96e] text-xs font-mono tracking-widest uppercase">
                  Philosophical Context
                </h4>
                <button
                  onClick={() => setShowInsight(false)}
                  className="text-[#8a7a5a] hover:text-[#e8dcc8] transition-colors cursor-pointer p-1 rounded-lg hover:bg-[#e8dcc8]/5"
                  aria-label="Close insight"
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              </div>
              <p className="text-[#c4b99a] text-sm leading-relaxed">
                {scenario.insight.origin}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-[#c9a96e]/5 border border-[#c9a96e]/10">
                  <p className="text-[#c9a96e] text-[10px] font-mono uppercase tracking-wider mb-1">
                    Utilitarian View
                  </p>
                  <p className="text-[#c4b99a] text-xs leading-relaxed">
                    {scenario.insight.philosopherA}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#e8dcc8]/5 border border-[#e8dcc8]/10">
                  <p className="text-[#e8dcc8] text-[10px] font-mono uppercase tracking-wider mb-1">
                    Deontological View
                  </p>
                  <p className="text-[#c4b99a] text-xs leading-relaxed">
                    {scenario.insight.philosopherB}
                  </p>
                </div>
              </div>
              <div className="pt-1">
                <p className="text-[#8a7a5a] text-[10px] font-mono uppercase tracking-wider mb-1">
                  Real-World Connection
                </p>
                <p className="text-[#6a6050] text-xs leading-relaxed">
                  {scenario.insight.realWorld}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-[#c9a96e] text-[#0c0b09] font-semibold rounded-xl hover:bg-[#d4b88a] transition-all duration-300 shadow-lg shadow-[#c9a96e]/10 hover:shadow-[#c9a96e]/25 cursor-pointer tracking-wide"
            >
              {index < total - 1 ? "Next Dilemma →" : "View My Results →"}
            </button>
            <span className="text-[10px] font-mono text-[#3d3628] tracking-widest">
              or press Enter
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
