"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { scenarios } from "./scenarios";

const philosopherQuotes = [
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "Act only according to that maxim whereby you can will that it should become a universal law.", author: "Immanuel Kant" },
  { text: "It is the greatest good to the greatest number which is the measure of right and wrong.", author: "Jeremy Bentham" },
  { text: "The only thing I know is that I know nothing.", author: "Socrates" },
  { text: "Man is condemned to be free.", author: "Jean-Paul Sartre" },
  { text: "One cannot step twice in the same river.", author: "Heraclitus" },
];

function FloatingQuotes() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState("out");
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % philosopherQuotes.length);
        setFadeState("in");
      }, 600);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const quote = philosopherQuotes[currentQuote];

  return (
    <div className="h-20 flex items-center justify-center">
      <div
        className={`text-center transition-all duration-500 ${
          fadeState === "in"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2"
        }`}
      >
        <p className="text-[#c9a96e]/70 text-sm italic font-serif">
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className="text-[#8a7a5a] text-xs mt-1 tracking-widest uppercase">
          — {quote.author}
        </p>
      </div>
    </div>
  );
}

export default function TrolleyProblemPage() {
  const router = useRouter();
  const [timedMode, setTimedMode] = useState(false);
  const [customTime, setCustomTime] = useState(30);
  const [extendedMode, setExtendedMode] = useState(false);
  const [pageExit, setPageExit] = useState(false);

  const handleNavigate = (path: string) => {
    setPageExit(true);
    setTimeout(() => router.push(path), 500);
  };

  const handleStart = () => {
    try {
      localStorage.setItem("trolley_timed_mode", timedMode ? "true" : "false");
      localStorage.setItem("trolley_extended_mode", extendedMode ? "true" : "false");
      if (timedMode) {
        localStorage.setItem("trolley_timer_duration", String(customTime));
      }
      localStorage.removeItem("trolley_choices");
    } catch {
      // ignore
    }
    handleNavigate("/test");
  };

  return (
    <div className={`min-h-screen bg-[#0c0b09] text-[#e8dcc8] relative overflow-hidden transition-all duration-500 ease-out ${pageExit ? "opacity-0 scale-[0.97] blur-sm" : "opacity-100 scale-100 blur-0"}`}>
      {/* Ambient background — warm candlelight glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#c9a96e]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#8a6e3e]/[0.04] rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-[#d4b88a]/[0.02] rounded-full blur-[80px]" />
      </div>

      {/* Subtle grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-4 py-8 md:py-12">
        {/* ═══════════════ INTRO / LANDING PAGE ═══════════════ */}
        {
          <div className="max-w-3xl mx-auto animate-in fade-in duration-1000">
            {/* Large philosophical title block */}
            <div className="text-center mb-8 pt-4">
              <p className="text-[#8a7a5a] text-xs tracking-[0.35em] uppercase mb-6 font-mono">
                A Moral Experiment
              </p>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#e8dcc8] leading-[1.1] mb-4">
                What Would
                <br />
                <span className="text-[#c9a96e]">You</span> Do?
              </h1>
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c9a96e]/40" />
                <span className="text-[#8a7a5a] text-xs tracking-[0.2em] uppercase">
                  Trolley Problem Simulator
                </span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c9a96e]/40" />
              </div>

              {/* CTA moved up - right below the title */}
              <div className="mt-8 space-y-4">
                {/* Timed mode toggle */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setTimedMode(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      !timedMode
                        ? "bg-[#c9a96e]/20 text-[#c9a96e] border border-[#c9a96e]/40"
                        : "bg-[#1a1710]/60 text-[#8a7a5a] border border-[#c9a96e]/10 hover:border-[#c9a96e]/25"
                    }`}
                  >
                    Untimed
                  </button>
                  <button
                    onClick={() => setTimedMode(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      timedMode
                        ? "bg-[#c9a96e]/20 text-[#c9a96e] border border-[#c9a96e]/40"
                        : "bg-[#1a1710]/60 text-[#8a7a5a] border border-[#c9a96e]/10 hover:border-[#c9a96e]/25"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13zM8.5 4h-1v4.5l3.5 2 .5-.82-3-1.68V4z" />
                      </svg>
                      Timed
                    </span>
                  </button>
                </div>

                {/* Custom time picker */}
                {timedMode && (
                  <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-[#c9a96e]/60 text-xs">
                      Each dilemma auto-submits after {customTime}s — pressure reveals instinct.
                    </p>
                    <div className="flex items-center gap-4 w-full max-w-xs">
                      <span className="text-[10px] font-mono text-[#5a5040] shrink-0">10s</span>
                      <div className="flex-1 relative">
                        <input
                          type="range"
                          min={10}
                          max={120}
                          step={5}
                          value={customTime}
                          onChange={(e) => setCustomTime(Number(e.target.value))}
                          className="w-full h-1.5 bg-[#1a1710] rounded-full appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c9a96e] [&::-webkit-slider-thumb]:cursor-pointer
                            [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(201,169,110,0.3)]
                            [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
                            [&::-moz-range-thumb]:bg-[#c9a96e] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#5a5040] shrink-0">120s</span>
                    </div>
                    <span className="text-lg font-mono font-bold text-[#c9a96e]">{customTime}s</span>
                  </div>
                )}

                {/* Extended mode toggle */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setExtendedMode(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      !extendedMode
                        ? "bg-[#c9a96e]/20 text-[#c9a96e] border border-[#c9a96e]/40"
                        : "bg-[#1a1710]/60 text-[#8a7a5a] border border-[#c9a96e]/10 hover:border-[#c9a96e]/25"
                    }`}
                  >
                    8 Core
                  </button>
                  <button
                    onClick={() => setExtendedMode(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      extendedMode
                        ? "bg-[#c9a96e]/20 text-[#c9a96e] border border-[#c9a96e]/40"
                        : "bg-[#1a1710]/60 text-[#8a7a5a] border border-[#c9a96e]/10 hover:border-[#c9a96e]/25"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0z"/>
                      </svg>
                      12 Extended
                    </span>
                  </button>
                </div>
                <p className="text-[#5a5040] text-[10px] tracking-wider">
                  {extendedMode ? "Includes 4 additional modern dilemmas" : "Classic trolley problem variations"}
                </p>

                <button
                  onClick={handleStart}
                  className="group relative px-12 py-4 bg-[#c9a96e] text-[#0c0b09] font-bold text-lg rounded-xl hover:bg-[#d4b88a] transition-all duration-300 shadow-lg shadow-[#c9a96e]/10 hover:shadow-[#c9a96e]/25 hover:scale-[1.02] cursor-pointer tracking-wide"
                >
                  Begin the Simulation
                  <span className="absolute inset-0 rounded-xl border border-[#c9a96e]/30 group-hover:border-[#c9a96e]/60 transition-colors" />
                </button>
                <p className="text-[#5a5040] text-xs tracking-wider">
                  3–5 minutes &middot; No right answers &middot; Only yours
                </p>
                
                {/* Learn link - right below the CTA */}
                <button
                  onClick={() => handleNavigate("/learn")}
                  className="inline-flex items-center gap-2 text-[#8a7a5a] text-sm hover:text-[#c9a96e] transition-colors group mt-2 cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity">
                    <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span className="underline underline-offset-4 decoration-[#c9a96e]/20 group-hover:decoration-[#c9a96e]/50">
                    Or learn about the philosophies first
                  </span>
                </button>
              </div>
            </div>

            {/* Dynamic hero scene — moody SVG */}
            <div className="mb-10 relative">
              <div className="absolute -inset-4 bg-[#c9a96e]/[0.02] rounded-3xl blur-2xl" />
              <svg
                viewBox="0 0 600 260"
                className="w-full max-w-2xl mx-auto relative"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="introSky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f0e0a" />
                    <stop offset="60%" stopColor="#16140e" />
                    <stop offset="100%" stopColor="#1c1914" />
                  </linearGradient>
                  <linearGradient id="introGround" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1c1914" />
                    <stop offset="100%" stopColor="#0f0e0a" />
                  </linearGradient>
                  <radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#c9a96e" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#c9a96e" stopOpacity="0" />
                  </radialGradient>
                  <filter id="softGlow">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Sky */}
                <rect width="600" height="180" fill="url(#introSky)" rx="12" />
                {/* Ground */}
                <rect y="180" width="600" height="80" fill="url(#introGround)" />
                <rect y="180" width="600" height="1" fill="#c9a96e" opacity="0.06" />

                {/* Moon */}
                <circle cx="480" cy="50" r="50" fill="url(#moonGlow)">
                  <animate attributeName="r" values="48;52;48" dur="6s" repeatCount="indefinite" />
                </circle>
                <circle cx="480" cy="50" r="14" fill="#c9a96e" opacity="0.2">
                  <animate attributeName="opacity" values="0.15;0.25;0.15" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx="480" cy="50" r="10" fill="#e8dcc8" opacity="0.15" />

                {/* Stars */}
                {[[70, 25], [150, 45], [230, 18], [330, 38], [400, 58], [540, 30], [100, 65], [280, 55]].map(
                  ([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r={0.8} fill="#c9a96e" opacity={0.2 + (i % 3) * 0.1}>
                      <animate attributeName="opacity" values={`${0.1 + (i % 3) * 0.05};${0.35 + (i % 2) * 0.1};${0.1 + (i % 3) * 0.05}`} dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" />
                    </circle>
                  )
                )}

                {/* Main track */}
                <line x1="30" y1="200" x2="570" y2="200" stroke="#5a5040" strokeWidth="3" />
                {Array.from({ length: 26 }).map((_, i) => (
                  <line key={`t-${i}`} x1={35 + i * 20} y1="197" x2={35 + i * 20} y2="203" stroke="#3d3628" strokeWidth="2" />
                ))}

                {/* Diverging track */}
                <path d="M 260 200 Q 330 200 410 165" stroke="#5a5040" strokeWidth="2" fill="none" strokeDasharray="5 4" opacity="0.5" />

                {/* Lever — swaying gently */}
                <g transform="translate(255, 183)">
                  <rect x="-2" y="0" width="4" height="20" fill="#8a7a5a" rx="1" />
                  <line x1="0" y1="0" x2="10" y2="-12" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round" opacity="0.7">
                    <animateTransform attributeName="transform" type="rotate" values="0 0 0;6 0 0;0 0 0;-4 0 0;0 0 0" dur="4s" repeatCount="indefinite" />
                  </line>
                  <circle cx="10" cy="-12" r="3" fill="#c9a96e" opacity="0.6">
                    <animateTransform attributeName="transform" type="rotate" values="0 0 0;6 0 0;0 0 0;-4 0 0;0 0 0" dur="4s" repeatCount="indefinite" />
                  </circle>
                </g>

                {/* Trolley — rolling forward */}
                <g>
                  <animateTransform attributeName="transform" type="translate" values="80,200;230,200;80,200" dur="8s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />
                  <rect x="-18" y="-20" width="36" height="16" fill="#c9a96e" opacity="0.8" rx="3" />
                  <rect x="-14" y="-18" width="9" height="7" fill="#0f0e0a" opacity="0.5" rx="1" />
                  <rect x="2" y="-18" width="9" height="7" fill="#0f0e0a" opacity="0.5" rx="1" />
                  {/* Headlight glow */}
                  <ellipse cx="20" cy="-12" rx="6" ry="4" fill="#c9a96e" opacity="0.15">
                    <animate attributeName="opacity" values="0.1;0.2;0.1" dur="1.2s" repeatCount="indefinite" />
                  </ellipse>
                  {/* Wheels — spinning */}
                  <circle cx="-10" cy="-2" r="3.5" fill="#1c1914" />
                  <circle cx="10" cy="-2" r="3.5" fill="#1c1914" />
                  <circle cx="-10" cy="-2" r="1.5" fill="#5a5040">
                    <animateTransform attributeName="transform" type="rotate" values="0 -10 -2;360 -10 -2" dur="1s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="10" cy="-2" r="1.5" fill="#5a5040">
                    <animateTransform attributeName="transform" type="rotate" values="0 10 -2;360 10 -2" dur="1s" repeatCount="indefinite" />
                  </circle>
                  {/* Sparks under wheels */}
                  <circle cx="-12" cy="1" r="0.6" fill="#c9a96e" opacity="0.5">
                    <animate attributeName="opacity" values="0;0.6;0" dur="0.3s" repeatCount="indefinite" />
                    <animate attributeName="cx" values="-12;-18" dur="0.3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="8" cy="1" r="0.4" fill="#c9a96e" opacity="0.4">
                    <animate attributeName="opacity" values="0;0.5;0" dur="0.4s" repeatCount="indefinite" begin="0.15s" />
                    <animate attributeName="cx" values="8;2" dur="0.4s" repeatCount="indefinite" begin="0.15s" />
                  </circle>
                </g>

                {/* People on main track — subtle breathing */}
                {[440, 458, 476, 494, 512].map((x, i) => (
                  <g key={`p-${i}`}>
                    <circle cx={x} cy={186} r={3.5} fill="#e8dcc8" opacity="0.7">
                      <animate attributeName="cy" values={`${186};${184.5};${186}`} dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" />
                    </circle>
                    <line x1={x} y1={190} x2={x} y2={197} stroke="#e8dcc8" strokeWidth="1.5" opacity="0.7" />
                  </g>
                ))}
                <text x="476" y="215" textAnchor="middle" fill="#e8dcc8" fontSize="9" opacity="0.4" fontStyle="italic">five</text>

                {/* Person on alt track — subtle breathing */}
                <g>
                  <circle cx={415} cy={150} r={3.5} fill="#c9a96e" opacity="0.7">
                    <animate attributeName="cy" values="150;148.5;150" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <line x1={415} y1={154} x2={415} y2={161} stroke="#c9a96e" strokeWidth="1.5" opacity="0.7" />
                </g>
                <text x="415" y="145" textAnchor="middle" fill="#c9a96e" fontSize="9" opacity="0.4" fontStyle="italic">one</text>

                {/* Bottom text */}
                <text x="300" y="245" textAnchor="middle" fill="#5a5040" fontSize="10" fontStyle="italic" letterSpacing="2">
                  the weight of a decision
                </text>
              </svg>
            </div>

            {/* Rotating philosopher quotes */}
            <FloatingQuotes />

            {/* How it works — elegant cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-6">
              <div className="p-5 rounded-xl bg-[#1a1710]/80 border border-[#c9a96e]/10 text-center group hover:border-[#c9a96e]/25 transition-all duration-500">
                <div className="w-10 h-10 rounded-full bg-[#c9a96e]/10 flex items-center justify-center mx-auto mb-3 text-[#c9a96e] font-serif text-lg group-hover:bg-[#c9a96e]/20 transition-colors">
                  I
                </div>
                <p className="text-[#e8dcc8] text-sm font-semibold mb-1">
                  {scenarios.length} Dilemmas
                </p>
                <p className="text-[#8a7a5a] text-xs leading-relaxed">
                  Each one a scenario with no easy answer — only consequences.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-[#1a1710]/80 border border-[#c9a96e]/10 text-center group hover:border-[#c9a96e]/25 transition-all duration-500">
                <div className="w-10 h-10 rounded-full bg-[#c9a96e]/10 flex items-center justify-center mx-auto mb-3 text-[#c9a96e] font-serif text-lg group-hover:bg-[#c9a96e]/20 transition-colors">
                  II
                </div>
                <p className="text-[#e8dcc8] text-sm font-semibold mb-1">
                  Two Philosophies
                </p>
                <p className="text-[#8a7a5a] text-xs leading-relaxed">
                  Utilitarian calculus vs. deontological duty. Where do you fall?
                </p>
              </div>
              <div className="p-5 rounded-xl bg-[#1a1710]/80 border border-[#c9a96e]/10 text-center group hover:border-[#c9a96e]/25 transition-all duration-500">
                <div className="w-10 h-10 rounded-full bg-[#c9a96e]/10 flex items-center justify-center mx-auto mb-3 text-[#c9a96e] font-serif text-lg group-hover:bg-[#c9a96e]/20 transition-colors">
                  III
                </div>
                <p className="text-[#e8dcc8] text-sm font-semibold mb-1">
                  Your Profile
                </p>
                <p className="text-[#8a7a5a] text-xs leading-relaxed">
                  See your ethical identity and how you compare to everyone else.
                </p>
              </div>
            </div>
          </div>
        }

        {/* Footer with social links */}
        <footer className="max-w-3xl mx-auto mt-16 pt-8 border-t border-[#c9a96e]/10">
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com/bedigambar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8a7a5a] hover:text-[#c9a96e] transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/digambar-behera"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8a7a5a] hover:text-[#c9a96e] transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://x.com/digambarcodes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8a7a5a] hover:text-[#c9a96e] transition-colors"
              aria-label="X (Twitter)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
          <p className="text-center text-[#8a7a5a]/60 text-xs mt-4">
            Built by Digambar
          </p>
        </footer>

      </div>
    </div>
  );
}
