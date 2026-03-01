"use client";

import React, { useEffect, useState } from "react";
import type { UserChoice, AggregateStats } from "../types";
import { scenarios } from "../scenarios";

interface ResultsDashboardProps {
  choices: UserChoice[];
  onRestart: () => void;
}

export default function ResultsDashboard({
  choices,
  onRestart,
}: ResultsDashboardProps) {
  const [aggStats, setAggStats] = useState<AggregateStats | null>(null);
  const [showAgg, setShowAgg] = useState(false);

  // Filter out skipped questions for philosophy stats
  const answeredChoices = choices.filter((c) => !c.skipped && c.choice !== null);
  const skippedCount = choices.filter((c) => c.skipped || c.choice === null).length;

  const utilitarianCount = answeredChoices.filter(
    (c) => c.philosophy === "utilitarian"
  ).length;
  const deontologicalCount = answeredChoices.filter(
    (c) => c.philosophy === "deontological"
  ).length;
  const answeredTotal = answeredChoices.length;
  const utilitarianPct = answeredTotal > 0 ? Math.round((utilitarianCount / answeredTotal) * 100) : 0;
  const deontologicalPct = answeredTotal > 0 ? 100 - utilitarianPct : 0;

  const avgResponseTime = answeredTotal > 0 ? Math.round(
    answeredChoices.reduce((sum, c) => sum + c.responseTimeMs, 0) / answeredTotal
  ) : 0;

  const dominantPhilosophy =
    answeredTotal === 0
      ? "Undetermined"
      : utilitarianCount > deontologicalCount
        ? "Utilitarian"
        : utilitarianCount < deontologicalCount
          ? "Deontological"
          : "Balanced";

  const consistency = answeredTotal > 0 ? Math.round(
    (Math.max(utilitarianCount, deontologicalCount) / answeredTotal) * 100
  ) : 0;

  // Fetch aggregate stats
  useEffect(() => {
    fetch("/api/trolley")
      .then((r) => r.json())
      .then((data) => setAggStats(data))
      .catch(() => {});
  }, []);

  const getPhilosophyIcon = () => {
    if (dominantPhilosophy === "Utilitarian") {
      // Bar chart icon
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14 text-[#c9a96e]">
          <path d="M3 3v18h18" />
          <rect x="7" y="10" width="3" height="8" rx="0.5" fill="currentColor" opacity="0.3" />
          <rect x="12" y="6" width="3" height="12" rx="0.5" fill="currentColor" opacity="0.5" />
          <rect x="17" y="3" width="3" height="15" rx="0.5" fill="currentColor" opacity="0.7" />
        </svg>
      );
    }
    if (dominantPhilosophy === "Deontological") {
      // Scales / balance icon
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14 text-[#e8dcc8]">
          <path d="M12 3v18" />
          <path d="M8 21h8" />
          <path d="M4 7l8-2 8 2" />
          <path d="M4 7l-1 6h6L8 7" />
          <path d="M20 7l-1 6h-6l1-6" />
        </svg>
      );
    }
    // Handshake / balanced icon
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14 text-[#c4b99a]">
        <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" opacity="0.15" fill="currentColor" />
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8" />
        <path d="M12 8v8" />
      </svg>
    );
  };

  const getPhilosophyDescription = () => {
    if (answeredTotal === 0) {
      return "You didn't answer any dilemmas — all questions were skipped due to timeout. Try again with a longer timer or without timed mode to explore your ethical preferences.";
    }
    if (dominantPhilosophy === "Utilitarian") {
      return "You tend toward utilitarian thinking — focusing on outcomes and maximizing overall well-being, even when it requires difficult trade-offs. You believe the right action is whichever produces the greatest good for the greatest number.";
    }
    if (dominantPhilosophy === "Deontological") {
      return "You lean toward deontological ethics — guided by duty, rules, and the inherent rights of individuals. You believe some actions are inherently right or wrong, regardless of their consequences. The ends don't always justify the means.";
    }
    return "You show a balanced ethical perspective — sometimes prioritizing outcomes, other times upholding principles. This flexibility suggests you evaluate each situation on its own merits rather than following a single ethical framework.";
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="mb-4 flex justify-center">{getPhilosophyIcon()}</div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#e8dcc8] mb-2">
          Your Ethical Profile
        </h1>
        <p className="text-[#8a7a5a] text-lg">
          Based on {answeredTotal} answered dilemma{answeredTotal !== 1 ? "s" : ""}
          {skippedCount > 0 && (
            <span className="text-red-400/70"> ({skippedCount} skipped)</span>
          )}
        </p>
      </div>

      {/* Primary result */}
      <div className="p-6 rounded-2xl bg-[#1a1710]/80 border border-[#c9a96e]/15 mb-8">
        <h2 className="text-2xl font-serif font-bold text-[#e8dcc8] mb-1">
          Dominant Philosophy:{" "}
          <span className="text-[#c9a96e] underline decoration-[#c9a96e]/30 underline-offset-4">
            {dominantPhilosophy}
          </span>
        </h2>
        <p className="text-[#c4b99a] leading-relaxed mt-3 font-serif italic">
          {getPhilosophyDescription()}
        </p>
      </div>

      {/* Stats grid */}
      <div className={`grid grid-cols-2 ${skippedCount > 0 ? 'md:grid-cols-5' : 'md:grid-cols-4'} gap-4 mb-8`}>
        <StatBox
          label="Utilitarian"
          value={`${utilitarianPct}%`}
          sub={`${utilitarianCount} choices`}
          color="gold"
        />
        <StatBox
          label="Deontological"
          value={`${deontologicalPct}%`}
          sub={`${deontologicalCount} choices`}
          color="ivory"
        />
        <StatBox
          label="Consistency"
          value={`${consistency}%`}
          sub="alignment"
          color="stone"
        />
        <StatBox
          label="Avg Response"
          value={`${(avgResponseTime / 1000).toFixed(1)}s`}
          sub="per dilemma"
          color="muted"
        />
        {skippedCount > 0 && (
          <StatBox
            label="Skipped"
            value={`${skippedCount}`}
            sub="not attempted"
            color="red"
          />
        )}
      </div>

      {/* Visual bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-[#8a7a5a] mb-2">
          <span>Utilitarian ({utilitarianPct}%)</span>
          <span>Deontological ({deontologicalPct}%)</span>
        </div>
        <div className="h-4 rounded-full bg-[#1a1710] overflow-hidden flex">
          <div
            className="h-full bg-[#c9a96e] transition-all duration-1000"
            style={{ width: `${utilitarianPct}%` }}
          />
          <div
            className="h-full bg-[#8a7a5a] transition-all duration-1000"
            style={{ width: `${deontologicalPct}%` }}
          />
        </div>
      </div>

      {/* Per-scenario breakdown */}
      <div className="mb-8">
        <h3 className="text-xl font-serif font-bold text-[#e8dcc8] mb-4">
          Your Choices Breakdown
        </h3>
        <div className="space-y-3">
          {choices.map((choice) => {
            const scenario = scenarios.find((s) => s.id === choice.scenarioId);
            if (!scenario) return null;
            
            // Handle skipped questions
            if (choice.skipped || choice.choice === null) {
              return (
                <div
                  key={choice.scenarioId}
                  className="flex items-center gap-4 p-3 rounded-xl bg-red-400/5 border border-red-400/20"
                >
                  <span className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold font-serif bg-red-400/15 text-red-400">
                    —
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#e8dcc8] font-medium text-sm truncate">
                      {scenario.title}
                    </p>
                    <p className="text-red-400/70 text-xs truncate">
                      Skipped — Not Attempted
                    </p>
                  </div>
                  <span className="text-red-400/50 text-xs font-mono px-2 py-0.5 rounded-full bg-red-400/10 border border-red-400/20">
                    Timeout
                  </span>
                </div>
              );
            }
            
            const chosenOption =
              choice.choice === "A" ? scenario.optionA : scenario.optionB;

            return (
              <div
                key={choice.scenarioId}
                className={`flex items-center gap-4 p-3 rounded-xl border ${
                  choice.changedFrom 
                    ? "bg-amber-400/5 border-amber-400/20" 
                    : "bg-[#1a1710]/60 border-[#c9a96e]/10"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold font-serif ${
                    choice.changedFrom
                      ? "bg-amber-400/15 text-amber-400"
                      : choice.philosophy === "utilitarian"
                        ? "bg-[#c9a96e]/15 text-[#c9a96e]"
                        : "bg-[#e8dcc8]/10 text-[#e8dcc8]"
                  }`}
                >
                  {choice.changedFrom ? (
                    <span className="flex items-center text-xs">
                      <span className="line-through opacity-50">{choice.changedFrom}</span>
                      <span className="mx-0.5">→</span>
                      <span>{choice.choice}</span>
                    </span>
                  ) : (
                    choice.choice
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[#e8dcc8] font-medium text-sm truncate">
                    {scenario.title}
                  </p>
                  <p className="text-[#6a6050] text-xs truncate">
                    {chosenOption.label} —{" "}
                    {choice.philosophy === "utilitarian"
                      ? "Utilitarian"
                      : "Deontological"}
                    {choice.changedFrom && (
                      <span className="text-amber-400/70 ml-1">(changed mind)</span>
                    )}
                  </p>
                </div>
                <span className="text-[#6a6050] text-xs font-mono">
                  {(choice.responseTimeMs / 1000).toFixed(1)}s
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* What Would Philosophers Say? */}
      {answeredChoices.length > 0 && (
      <div className="mb-8">
        <h3 className="text-xl font-serif font-bold text-[#e8dcc8] mb-4 flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#c9a96e]">
            <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
          What Would the Philosophers Say?
        </h3>
        <p className="text-[#8a7a5a] text-sm mb-4">
          See how classic thinkers would view your choices.
        </p>
        <div className="space-y-4">
          {answeredChoices.map((choice) => {
            const scenario = scenarios.find((s) => s.id === choice.scenarioId);
            if (!scenario) return null;
            const isUtilitarian = choice.philosophy === "utilitarian";
            
            return (
              <div
                key={`philosopher-${choice.scenarioId}`}
                className="p-4 rounded-xl bg-[#1a1710]/60 border border-[#c9a96e]/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#e8dcc8] font-medium text-sm">
                    {scenario.title}
                  </p>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    isUtilitarian 
                      ? "text-[#c9a96e] border-[#c9a96e]/20 bg-[#c9a96e]/10" 
                      : "text-[#e8dcc8] border-[#e8dcc8]/20 bg-[#e8dcc8]/5"
                  }`}>
                    You chose: {isUtilitarian ? "Utilitarian" : "Deontological"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg border ${
                    isUtilitarian 
                      ? "bg-[#c9a96e]/10 border-[#c9a96e]/25" 
                      : "bg-[#c9a96e]/5 border-[#c9a96e]/10 opacity-60"
                  }`}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {isUtilitarian && (
                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-[#c9a96e]">
                          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.78 5.28a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47 3.72-3.72a.75.75 0 0 1 1.06 0z" />
                        </svg>
                      )}
                      <p className="text-[#c9a96e] text-[10px] font-mono uppercase tracking-wider">
                        Utilitarian View {isUtilitarian && "(Your choice)"}
                      </p>
                    </div>
                    <p className="text-[#c4b99a] text-xs leading-relaxed">
                      {scenario.insight.philosopherA}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg border ${
                    !isUtilitarian 
                      ? "bg-[#e8dcc8]/10 border-[#e8dcc8]/25" 
                      : "bg-[#e8dcc8]/5 border-[#e8dcc8]/10 opacity-60"
                  }`}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {!isUtilitarian && (
                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-[#e8dcc8]">
                          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.78 5.28a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47 3.72-3.72a.75.75 0 0 1 1.06 0z" />
                        </svg>
                      )}
                      <p className="text-[#e8dcc8] text-[10px] font-mono uppercase tracking-wider">
                        Deontological View {!isUtilitarian && "(Your choice)"}
                      </p>
                    </div>
                    <p className="text-[#c4b99a] text-xs leading-relaxed">
                      {scenario.insight.philosopherB}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Changed Answers Analysis */}
      {(() => {
        const changedChoices = choices.filter((c) => c.changedFrom);
        if (changedChoices.length === 0) return null;

        // Analyze the pattern of changes
        const utilToDeont = changedChoices.filter((c) => {
          const scenario = scenarios.find((s) => s.id === c.scenarioId);
          if (!scenario || !c.changedFrom) return false;
          const originalOption = c.changedFrom === "A" ? scenario.optionA : scenario.optionB;
          const finalOption = c.choice === "A" ? scenario.optionA : scenario.optionB;
          return originalOption.philosophy === "utilitarian" && finalOption.philosophy === "deontological";
        });

        const deontToUtil = changedChoices.filter((c) => {
          const scenario = scenarios.find((s) => s.id === c.scenarioId);
          if (!scenario || !c.changedFrom) return false;
          const originalOption = c.changedFrom === "A" ? scenario.optionA : scenario.optionB;
          const finalOption = c.choice === "A" ? scenario.optionA : scenario.optionB;
          return originalOption.philosophy === "deontological" && finalOption.philosophy === "utilitarian";
        });

        const getChangeAnalysis = () => {
          if (utilToDeont.length > deontToUtil.length) {
            return {
              title: "Second Thoughts Toward Principles",
              description: "When you reconsidered, you tended to shift from outcome-focused to principle-based choices. This suggests your initial utilitarian impulses are tempered by deeper moral intuitions about duties and rights.",
              insight: "Your gut says 'maximize good,' but your conscience reminds you that some lines shouldn't be crossed regardless of the outcome."
            };
          } else if (deontToUtil.length > utilToDeont.length) {
            return {
              title: "Second Thoughts Toward Pragmatism",
              description: "When you reconsidered, you moved from principle-based to outcome-focused choices. This suggests that upon reflection, you prioritize practical consequences over abstract rules.",
              insight: "Your initial respect for rules gives way to calculated reasoning about what produces the best results."
            };
          } else {
            return {
              title: "Genuine Moral Uncertainty",
              description: "Your mind-changes don't follow a clear pattern — you switched between ethical frameworks equally. This reflects authentic moral complexity rather than a systematic bias.",
              insight: "You're truly wrestling with these dilemmas, not defaulting to one philosophy."
            };
          }
        };

        const analysis = getChangeAnalysis();

        return (
          <div className="mb-8">
            <h3 className="text-xl font-serif font-bold text-[#e8dcc8] mb-4 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-400">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Mind Changes ({changedChoices.length})
            </h3>
            
            <div className="p-5 rounded-xl bg-amber-400/5 border border-amber-400/20 mb-4">
              <h4 className="text-amber-400 font-semibold text-lg mb-2">{analysis.title}</h4>
              <p className="text-[#c4b99a] text-sm leading-relaxed mb-3">
                {analysis.description}
              </p>
              <p className="text-[#8a7a5a] text-xs italic border-l-2 border-amber-400/30 pl-3">
                {analysis.insight}
              </p>
            </div>

            <div className="space-y-3">
              {changedChoices.map((choice) => {
                const scenario = scenarios.find((s) => s.id === choice.scenarioId);
                if (!scenario || !choice.changedFrom || !choice.choice) return null;
                
                const originalOption = choice.changedFrom === "A" ? scenario.optionA : scenario.optionB;
                const finalOption = choice.choice === "A" ? scenario.optionA : scenario.optionB;
                const shiftedPhilosophy = originalOption.philosophy !== finalOption.philosophy;

                return (
                  <div
                    key={choice.scenarioId}
                    className="p-4 rounded-xl bg-[#1a1710]/60 border border-amber-400/10"
                  >
                    <p className="text-[#e8dcc8] font-medium text-sm mb-2">
                      {scenario.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 rounded-lg bg-[#1a1710] text-[#8a7a5a] border border-[#c9a96e]/10">
                        {originalOption.label}
                      </span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-amber-400">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                      <span className="px-2 py-1 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
                        {finalOption.label}
                      </span>
                      {shiftedPhilosophy && (
                        <span className="ml-auto text-[10px] font-mono text-amber-400/60">
                          {originalOption.philosophy === "utilitarian" ? "Util → Deont" : "Deont → Util"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Hesitation Analysis */}
      {answeredChoices.length > 0 && (
      <div className="mb-8">
        <h3 className="text-xl font-serif font-bold text-[#e8dcc8] mb-4 flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#c9a96e]">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Hesitation Analysis
        </h3>
        <p className="text-[#8a7a5a] text-sm mb-4">
          Longer response times may reveal which dilemmas genuinely conflicted you.
        </p>
        {(() => {
          const sorted = [...answeredChoices].sort(
            (a, b) => b.responseTimeMs - a.responseTimeMs
          );
          const maxTime = sorted[0]?.responseTimeMs ?? 1;

          return (
            <div className="space-y-3">
              {sorted.map((choice, i) => {
                const scenario = scenarios.find(
                  (s) => s.id === choice.scenarioId
                );
                if (!scenario) return null;
                const pct = Math.round(
                  (choice.responseTimeMs / maxTime) * 100
                );
                const isMostConflicted = i === 0;

                return (
                  <div
                    key={choice.scenarioId}
                    className={`relative p-3 rounded-xl border transition-all ${
                      isMostConflicted
                        ? "bg-[#c9a96e]/5 border-[#c9a96e]/25"
                        : "bg-[#1a1710]/60 border-[#c9a96e]/10"
                    }`}
                  >
                    {isMostConflicted && (
                      <span className="absolute -top-2.5 right-3 text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 bg-[#c9a96e]/15 text-[#c9a96e] rounded-full border border-[#c9a96e]/20">
                        Most conflicted
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-1.5">
                      <p
                        className={`text-sm font-medium truncate ${
                          isMostConflicted
                            ? "text-[#e8dcc8]"
                            : "text-[#c4b99a]"
                        }`}
                      >
                        {scenario.title}
                      </p>
                      <span
                        className={`text-xs font-mono ml-2 flex-shrink-0 ${
                          isMostConflicted
                            ? "text-[#c9a96e]"
                            : "text-[#6a6050]"
                        }`}
                      >
                        {(choice.responseTimeMs / 1000).toFixed(1)}s
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#1a1710] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isMostConflicted ? "bg-[#c9a96e]" : "bg-[#8a7a5a]/50"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>
      )}

      {/* Aggregate stats */}
      <div className="mb-8">
        <button
          onClick={() => setShowAgg(!showAgg)}
          className="flex items-center gap-2 text-[#8a7a5a] hover:text-[#e8dcc8] transition-colors mb-4 cursor-pointer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#c9a96e] flex-shrink-0">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
          </svg>
          <span className="text-lg font-serif font-bold">
            How does everyone else choose?
          </span>
          <span className="text-sm">{showAgg ? "▲" : "▼"}</span>
        </button>

        {showAgg && aggStats && (
          <div className="p-5 rounded-xl bg-[#1a1710]/80 border border-[#c9a96e]/10 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#e8dcc8]">
                  {aggStats.totalResponses}
                </p>
                <p className="text-xs text-[#6a6050]">Total Responses</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#c9a96e]">
                  {aggStats.totalResponses > 0
                    ? Math.round(
                        (aggStats.overallUtilitarian /
                          aggStats.totalResponses) *
                          100
                      )
                    : 0}
                  %
                </p>
                <p className="text-xs text-[#6a6050]">Chose Utilitarian</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#8a7a5a]">
                  {aggStats.totalResponses > 0
                    ? Math.round(
                        (aggStats.overallDeontological /
                          aggStats.totalResponses) *
                          100
                      )
                    : 0}
                  %
                </p>
                <p className="text-xs text-[#6a6050]">Chose Deontological</p>
              </div>
            </div>

            {/* Per scenario comparison */}
            <div className="space-y-3">
              {scenarios.map((scenario) => {
                const stat = aggStats.scenarioStats[scenario.id];
                if (!stat || stat.totalResponses === 0) return null;
                const aPct = Math.round(
                  (stat.optionA / stat.totalResponses) * 100
                );
                const bPct = 100 - aPct;

                return (
                  <div key={scenario.id}>
                    <div className="flex justify-between text-xs text-[#8a7a5a] mb-1">
                      <span>{scenario.title}</span>
                      <span>{stat.totalResponses} responses</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#1a1710] overflow-hidden flex">
                      <div
                        className="h-full bg-[#c9a96e] transition-all duration-700"
                        style={{ width: `${aPct}%` }}
                      />
                      <div
                        className="h-full bg-[#8a7a5a] transition-all duration-700"
                        style={{ width: `${bPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#6a6050] mt-0.5">
                      <span>
                        {scenario.optionA.label}: {aPct}%
                      </span>
                      <span>
                        {scenario.optionB.label}: {bPct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showAgg && !aggStats && (
          <p className="text-[#6a6050] text-sm">Loading aggregate data...</p>
        )}
      </div>

      {/* Restart */}
      <div className="text-center pb-12 space-y-3">
        <button
          onClick={onRestart}
          className="px-8 py-3 bg-[#c9a96e] text-[#0c0b09] font-semibold rounded-xl hover:bg-[#d4b88a] transition-all duration-300 shadow-lg shadow-[#c9a96e]/10 hover:shadow-[#c9a96e]/25 cursor-pointer tracking-wide"
        >
          Start Over
        </button>
        <p className="text-[#6a6050] text-xs">
          Try again to see if your answers change
        </p>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    gold: "bg-[#c9a96e]/10 text-[#c9a96e] border-[#c9a96e]/15",
    ivory: "bg-[#e8dcc8]/8 text-[#e8dcc8] border-[#e8dcc8]/10",
    stone: "bg-[#8a7a5a]/10 text-[#8a7a5a] border-[#8a7a5a]/15",
    muted: "bg-[#5a5040]/10 text-[#c4b99a] border-[#5a5040]/15",
    red: "bg-red-400/10 text-red-400 border-red-400/15",
  };

  return (
    <div
      className={`p-4 rounded-xl border ${colorMap[color] || colorMap.gold} text-center`}
    >
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-[#8a7a5a] mt-1">{label}</p>
      <p className="text-[10px] text-[#6a6050]">{sub}</p>
    </div>
  );
}
