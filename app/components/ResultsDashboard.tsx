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

  useEffect(() => {
    fetch("/api/trolley")
      .then((r) => r.json())
      .then((data) => setAggStats(data))
      .catch(() => {});
  }, []);

  const getPhilosophyIcon = () => {
    if (dominantPhilosophy === "Utilitarian") {
      
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
      return "You didn't answer any dilemmas - all questions were skipped due to timeout. Try again with a longer timer or without timed mode to explore your ethical preferences.";
    }
    if (dominantPhilosophy === "Utilitarian") {
      return "You tend toward utilitarian thinking - focusing on outcomes and maximizing overall well-being, even when it requires difficult trade-offs. You believe the right action is whichever produces the greatest good for the greatest number.";
    }
    if (dominantPhilosophy === "Deontological") {
      return "You lean toward deontological ethics - guided by duty, rules, and the inherent rights of individuals. You believe some actions are inherently right or wrong, regardless of their consequences. The ends don't always justify the means.";
    }
    return "You show a balanced ethical perspective - sometimes prioritizing outcomes, other times upholding principles. This flexibility suggests you evaluate each situation on its own merits rather than following a single ethical framework.";
  };

  const sortedChoices = [...answeredChoices].sort(
    (a, b) => b.responseTimeMs - a.responseTimeMs
  );
  const mostConflicted = sortedChoices[0];
  const mostConflictedScenario = mostConflicted
    ? scenarios.find((s) => s.id === mostConflicted.scenarioId)
    : null;

  const dominantPhilosophyForShare =
    dominantPhilosophy === "Utilitarian" || dominantPhilosophy === "Deontological" || dominantPhilosophy === "Balanced"
      ? dominantPhilosophy
      : "Balanced";

  const shareCardData: ShareCardData = {
    dominantPhilosophy: dominantPhilosophyForShare,
    philosophyDescription: getPhilosophyDescription(),
    utilitarianPct,
    deontologicalPct,
    consistencyPct: consistency,
    avgResponseSeconds: avgResponseTime > 0 ? Number((avgResponseTime / 1000).toFixed(1)) : 0,
    totalDilemmas: answeredTotal,
    mostConflictedDilemma: mostConflictedScenario ? mostConflictedScenario.title : "None",
    mostConflictedSeconds: mostConflicted ? Number((mostConflicted.responseTimeMs / 1000).toFixed(1)) : 0,
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-700">
      {}
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

      {}
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

      {}
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

      {}
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

      {}
      <div className="flex flex-col items-center justify-center gap-3 mt-4 mb-8 w-full">
        <h4 className="text-xs font-mono tracking-widest uppercase text-[#8a7a5a]">
          Share Your Results
        </h4>
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-xs sm:max-w-none px-4 sm:px-0">
          <button
            onClick={() => downloadShareCard(shareCardData)}
            className="w-full sm:w-auto px-6 py-3 bg-[#1a1710] text-[#c4b99a] font-semibold rounded-xl border border-[#c9a96e]/20 hover:bg-[#c9a96e]/10 hover:text-[#e8dcc8] hover:scale-[1.02] transition-all duration-300 cursor-pointer text-sm flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Share Card
          </button>
          <button
            onClick={() => shareCard(shareCardData)}
            className="w-full sm:w-auto px-6 py-3 bg-[#c9a96e] text-[#0c0b09] font-bold rounded-xl hover:bg-[#d4b88a] hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-[#c9a96e]/10 hover:shadow-[#c9a96e]/25 cursor-pointer text-sm flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Share Result
          </button>
        </div>
      </div>

      {}
      <div className="mb-8">
        <h3 className="text-xl font-serif font-bold text-[#e8dcc8] mb-4">
          Your Choices Breakdown
        </h3>
        <div className="space-y-3">
          {choices.map((choice) => {
            const scenario = scenarios.find((s) => s.id === choice.scenarioId);
            if (!scenario) return null;
            
            if (choice.skipped || choice.choice === null) {
              return (
                <div
                  key={choice.scenarioId}
                  className="flex items-center gap-4 p-3 rounded-xl bg-red-400/5 border border-red-400/20"
                >
                  <span className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold font-serif bg-red-400/15 text-red-400">
                    -
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#e8dcc8] font-medium text-sm truncate">
                      {scenario.title}
                    </p>
                    <p className="text-red-400/70 text-xs truncate">
                      Skipped - Not Attempted
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
                  className={`flex-shrink-0 min-w-10 px-2 h-10 rounded-lg flex items-center justify-center text-sm font-bold font-serif ${
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
                    {chosenOption.label} -{" "}
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

      {}
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-[#c9a96e]/10">
                  <p className="text-[#e8dcc8] font-serif font-bold text-sm">
                    {scenario.title}
                  </p>
                  <span className={`self-start sm:self-auto text-[10px] font-mono px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
                    isUtilitarian 
                      ? "text-[#c9a96e] border-[#c9a96e]/20 bg-[#c9a96e]/10" 
                      : "text-[#e8dcc8] border-[#e8dcc8]/20 bg-[#e8dcc8]/5"
                  }`}>
                    You chose: {isUtilitarian ? "Utilitarian" : "Deontological"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg border flex flex-col justify-between ${
                    isUtilitarian 
                      ? "bg-[#c9a96e]/10 border-[#c9a96e]/25" 
                      : "bg-[#c9a96e]/5 border-[#c9a96e]/10 opacity-60"
                  }`}>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className={`text-[10px] font-mono uppercase tracking-wider ${isUtilitarian ? "text-[#c9a96e]" : "text-[#8a7a5a]"}`}>
                          Utilitarian View
                        </p>
                        {isUtilitarian && (
                          <span className="text-[9px] font-mono bg-[#c9a96e]/20 text-[#c9a96e] px-1.5 py-0.5 rounded border border-[#c9a96e]/20 uppercase tracking-widest font-semibold scale-90 origin-right whitespace-nowrap">
                            Your Choice
                          </span>
                        )}
                      </div>
                      <p className="text-[#c4b99a] text-xs leading-relaxed">
                        {scenario.insight.philosopherA}
                      </p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border flex flex-col justify-between ${
                    !isUtilitarian 
                      ? "bg-[#e8dcc8]/10 border-[#e8dcc8]/25" 
                      : "bg-[#e8dcc8]/5 border-[#e8dcc8]/10 opacity-60"
                  }`}>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className={`text-[10px] font-mono uppercase tracking-wider ${!isUtilitarian ? "text-[#e8dcc8]" : "text-[#8a7a5a]"}`}>
                          Deontological View
                        </p>
                        {!isUtilitarian && (
                          <span className="text-[9px] font-mono bg-[#e8dcc8]/15 text-[#e8dcc8] px-1.5 py-0.5 rounded border border-[#e8dcc8]/20 uppercase tracking-widest font-semibold scale-90 origin-right whitespace-nowrap">
                            Your Choice
                          </span>
                        )}
                      </div>
                      <p className="text-[#c4b99a] text-xs leading-relaxed">
                        {scenario.insight.philosopherB}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {}
      {(() => {
        const changedChoices = choices.filter((c) => c.changedFrom);
        if (changedChoices.length === 0) return null;

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
              description: "Your mind-changes don't follow a clear pattern - you switched between ethical frameworks equally. This reflects authentic moral complexity rather than a systematic bias.",
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

      {}
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

      {}
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

            {}
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

      {}
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

interface ShareCardData {
  dominantPhilosophy: 'Utilitarian' | 'Deontological' | 'Balanced' | 'Virtue';
  philosophyDescription: string;
  utilitarianPct: number;
  deontologicalPct: number;
  consistencyPct: number;
  avgResponseSeconds: number;
  totalDilemmas: number;
  mostConflictedDilemma: string;
  mostConflictedSeconds: number;
}

const COLORS = {
  bg:           '#0d0a07',
  bgCard:       '#1a1408',
  border:       '#3d3020',
  gold:         '#c9a84c',
  goldDim:      '#8a6e30',
  goldBright:   '#e8c870',
  textPrimary:  '#f0ece0',
  textSecondary:'#9a9080',
  textMuted:    '#5a5040',
  divider:      '#2a2010',
};

const FONTS = {
  display:  `bold 72px Georgia, "Times New Roman", serif`,
  heading:  `bold 28px Georgia, "Times New Roman", serif`,
  subhead:  `500 18px -apple-system, "Segoe UI", sans-serif`,
  body:     `400 16px -apple-system, "Segoe UI", sans-serif`,
  mono:     `400 15px "Courier New", Courier, monospace`,
  label:    `600 12px -apple-system, "Segoe UI", sans-serif`,
  footer:   `400 14px -apple-system, "Segoe UI", sans-serif`,
};

function drawBackground(ctx: CanvasRenderingContext2D) {
  
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, 1200, 630);

  const radial = ctx.createRadialGradient(200, 100, 0, 200, 100, 500);
  radial.addColorStop(0, 'rgba(201, 168, 76, 0.06)');
  radial.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, 1200, 630);

  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1;
  ctx.strokeRect(20, 20, 1160, 590);
}

function drawHeader(ctx: CanvasRenderingContext2D) {
  
  ctx.font = FONTS.label;
  ctx.fillStyle = COLORS.goldDim;
  ctx.textAlign = 'left';
  if ('letterSpacing' in ctx) {
    (ctx as unknown as { letterSpacing: string }).letterSpacing = '0.12em';
  }
  ctx.fillText('THE TROLLEY PROBLEM', 50, 55);
  if ('letterSpacing' in ctx) {
    (ctx as unknown as { letterSpacing: string }).letterSpacing = '0px'; 
  }

  ctx.save();
  ctx.strokeStyle = COLORS.goldDim;
  ctx.fillStyle = COLORS.bgCard;
  ctx.lineWidth = 1.5;

  const rx = 1120;
  const ry = 38;
  const rw = 30;
  const rh = 12;
  roundRect(ctx, rx, ry, rw, rh, 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = COLORS.goldDim;
  ctx.beginPath();
  ctx.arc(rx + 7, ry + rh + 2, 2.5, 0, Math.PI * 2);
  ctx.arc(rx + 23, ry + rh + 2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(rx + 10, ry + 2);
  ctx.lineTo(rx + 10, ry + rh - 2);
  ctx.moveTo(rx + 20, ry + 2);
  ctx.lineTo(rx + 20, ry + rh - 2);
  ctx.stroke();

  ctx.strokeStyle = COLORS.goldDim;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(rx + 15, ry);
  ctx.lineTo(rx + 22, ry - 6);
  ctx.lineTo(rx + 16, ry - 6);
  ctx.stroke();

  ctx.restore();
}

function drawProfileLabel(ctx: CanvasRenderingContext2D, data: ShareCardData) {
  
  ctx.font = FONTS.heading;
  ctx.fillStyle = COLORS.textPrimary;
  ctx.textAlign = 'center';
  ctx.fillText('Your Ethical Profile', 600, 145);

  ctx.font = FONTS.body;
  ctx.fillStyle = COLORS.textSecondary;
  ctx.fillText(
    `${data.totalDilemmas} dilemmas · avg ${data.avgResponseSeconds}s per decision`,
    600,
    172
  );
}

function drawDominantPhilosophy(ctx: CanvasRenderingContext2D, data: ShareCardData) {
  const label = data.dominantPhilosophy.toUpperCase();

  ctx.font = FONTS.display;
  const measured = ctx.measureText(label);
  const pillW = measured.width + 80;
  const pillH = 88;
  const pillX = 600 - pillW / 2;
  const pillY = 192;

  ctx.fillStyle = COLORS.bgCard;
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 1.5;
  roundRect(ctx, pillX, pillY, pillW, pillH, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = COLORS.goldBright;
  ctx.textAlign = 'center';
  ctx.fillText(label, 600, pillY + 62);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawDescription(ctx: CanvasRenderingContext2D, description: string) {
  ctx.font = `italic 17px Georgia, serif`;
  ctx.fillStyle = COLORS.textSecondary;
  ctx.textAlign = 'center';

  const words = description.split(' ');
  const lines = wrapText(ctx, words, 700);
  lines.forEach((line, i) => {
    ctx.fillText(line, 600, 306 + i * 26);
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  words: string[],
  maxWidth: number
): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawStatRow(ctx: CanvasRenderingContext2D, data: ShareCardData) {
  const stats = [
    { value: `${data.utilitarianPct}%`,    label: 'Utilitarian' },
    { value: `${data.deontologicalPct}%`,  label: 'Deontological' },
    { value: `${data.consistencyPct}%`,    label: 'Consistency' },
    { value: `${data.avgResponseSeconds}s`,label: 'Avg Decision' },
  ];

  const cardW = 220;
  const cardH = 72;
  const gap = 20;
  const totalW = stats.length * cardW + (stats.length - 1) * gap;
  const startX = (1200 - totalW) / 2;
  const y = 380;

  stats.forEach((stat, i) => {
    const x = startX + i * (cardW + gap);

    ctx.fillStyle = COLORS.bgCard;
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, cardW, cardH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.font = `bold 26px Georgia, serif`;
    ctx.fillStyle = COLORS.gold;
    ctx.textAlign = 'center';
    ctx.fillText(stat.value, x + cardW / 2, y + 30);

    ctx.font = FONTS.label;
    ctx.fillStyle = COLORS.textMuted;
    ctx.fillText(stat.label.toUpperCase(), x + cardW / 2, y + 54);
  });
}

function drawMostConflicted(ctx: CanvasRenderingContext2D, data: ShareCardData) {
  const y = 490;

  ctx.font = FONTS.label;
  ctx.fillStyle = COLORS.textMuted;
  ctx.textAlign = 'left';
  ctx.fillText('MOST CONFLICTED BY', 50, y);

  ctx.font = `500 18px -apple-system, "Segoe UI", sans-serif`;
  ctx.fillStyle = COLORS.textPrimary;
  ctx.fillText(`"${data.mostConflictedDilemma}"`, 50, y + 26);

  ctx.font = `bold 20px "Courier New", monospace`;
  ctx.fillStyle = COLORS.goldBright;
  ctx.textAlign = 'right';
  ctx.fillText(`${data.mostConflictedSeconds}s`, 1150, y + 26);

  const nameWidth = ctx.measureText(`"${data.mostConflictedDilemma}"`).width;
  const lineStartX = 50 + nameWidth + 16;
  const lineEndX = 1150 - ctx.measureText(`${data.mostConflictedSeconds}s`).width - 16;

  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.moveTo(lineStartX, y + 20);
  ctx.lineTo(lineEndX, y + 20);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawFooter(ctx: CanvasRenderingContext2D) {
  ctx.font = FONTS.footer;
  ctx.fillStyle = COLORS.textMuted;
  ctx.textAlign = 'left';
  ctx.fillText('trolley-problem-simulator.vercel.app', 50, 600);

  ctx.font = `italic 14px Georgia, serif`;
  ctx.fillStyle = COLORS.goldDim;
  ctx.textAlign = 'right';
  ctx.fillText('"No right answers. Only yours."', 1150, 600);
}

function drawDivider(ctx: CanvasRenderingContext2D, y: number, width: number) {
  const x = (1200 - width) / 2;
  ctx.strokeStyle = COLORS.divider;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.stroke();
}

export function generateShareCard(data: ShareCardData): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d')!;

    drawBackground(ctx);
    drawHeader(ctx);
    drawDivider(ctx, 72, 1100);
    drawProfileLabel(ctx, data);
    drawDominantPhilosophy(ctx, data);
    drawDescription(ctx, data.philosophyDescription);
    drawStatRow(ctx, data);
    drawMostConflicted(ctx, data);
    drawDivider(ctx, 558, 1100);
    drawFooter(ctx);

    canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0);
  });
}

export async function downloadShareCard(data: ShareCardData) {
  const blob = await generateShareCard(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trolley-problem-${data.dominantPhilosophy.toLowerCase()}.png`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function shareCard(data: ShareCardData) {
  try {
    const blob = await generateShareCard(data);
    const file = new File([blob], 'my-ethical-profile.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'My Ethical Profile - The Trolley Problem',
        text: `I'm ${data.dominantPhilosophy}. Most conflicted by "${data.mostConflictedDilemma}" (${data.mostConflictedSeconds}s). No right answers. Only yours.`,
      });
    } else {
      await downloadShareCard(data);
    }
  } catch (err) {
    console.error('Share failed, falling back to download', err);
    await downloadShareCard(data);
  }
}
