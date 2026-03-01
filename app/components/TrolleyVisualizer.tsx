"use client";

import React, { useEffect, useState, useRef } from "react";
import type { Scenario } from "../types";

interface TrolleyVisualizerProps {
  scenario: Scenario;
  choiceMade: "A" | "B" | null;
  isAnimating: boolean;
}

export default function TrolleyVisualizer({
  scenario,
  choiceMade,
  isAnimating,
}: TrolleyVisualizerProps) {
  const [trolleyX, setTrolleyX] = useState(60);
  const [flash, setFlash] = useState(false);
  const [impactMain, setImpactMain] = useState(false);
  const [impactAlt, setImpactAlt] = useState(false);
  const impactTriggeredRef = useRef(false);

  useEffect(() => {
    setTrolleyX(60);
    setFlash(false);
    setImpactMain(false);
    setImpactAlt(false);
    impactTriggeredRef.current = false;
  }, [scenario.id]);

  useEffect(() => {
    if (!isAnimating || !choiceMade) return;

    let frame: number;
    let start: number | null = null;
    const duration = 1200;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      if (choiceMade === "A") {
        // Trolley diverts
        const newX = 60 + eased * 340;
        setTrolleyX(newX);
        // Trigger impact on alt track when trolley reaches people
        if (newX >= 380 && !impactTriggeredRef.current) {
          impactTriggeredRef.current = true;
          setImpactAlt(true);
        }
      } else {
        // Trolley continues straight
        const newX = 60 + eased * 400;
        setTrolleyX(newX);
        // Trigger impact on main track when trolley reaches people
        if (newX >= 380 && !impactTriggeredRef.current) {
          impactTriggeredRef.current = true;
          setImpactMain(true);
        }
      }

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setFlash(true);
        setTimeout(() => setFlash(false), 300);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isAnimating, choiceMade]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {flash && (
        <div className="absolute inset-0 bg-[#c9a96e]/20 rounded-2xl z-10 animate-pulse pointer-events-none" />
      )}
      <svg
        viewBox="0 0 560 300"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f0e0a" />
            <stop offset="100%" stopColor="#1c1914" />
          </linearGradient>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1710" />
            <stop offset="100%" stopColor="#12110c" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="560" height="200" fill="url(#skyGrad)" />
        <rect y="200" width="560" height="100" fill="url(#groundGrad)" />

        {/* Stars */}
        {[
          [50, 30, 0.6],
          [120, 60, 0.7],
          [200, 20, 0.55],
          [310, 45, 0.8],
          [420, 25, 0.65],
          [480, 55, 0.75],
          [530, 35, 0.9],
        ].map(([x, y, op], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={1}
            fill="white"
            opacity={op}
          />
        ))}

        {/* Main Track */}
        <line
          x1="20"
          y1="220"
          x2="540"
          y2="220"
          stroke="#5a5040"
          strokeWidth="4"
        />
        {/* Track ties on main */}
        {Array.from({ length: 25 }).map((_, i) => (
          <line
            key={`tie-${i}`}
            x1={30 + i * 20}
            y1="216"
            x2={30 + i * 20}
            y2="224"
            stroke="#3d3528"
            strokeWidth="2"
          />
        ))}

        {/* Switch Track (diverges upward) */}
        <path
          d="M 250 220 Q 320 220 400 180"
          stroke="#5a5040"
          strokeWidth="3"
          fill="none"
          strokeDasharray={choiceMade === "A" ? "none" : "6 4"}
          opacity={choiceMade === "B" ? 0.4 : 0.8}
        />

        {/* Switch lever */}
        <g transform="translate(245, 200)">
          <rect
            x="-3"
            y="0"
            width="6"
            height="25"
            fill="#c4b99a"
            rx="2"
          />
          <line
            x1="0"
            y1="0"
            x2={choiceMade === "A" ? -12 : 12}
            y2={choiceMade === "A" ? -15 : -15}
            stroke={choiceMade === "A" ? "#c9a96e" : "#8a7a5a"}
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
          />
          <circle
            cx={choiceMade === "A" ? -12 : 12}
            cy={-15}
            r="4"
            fill={choiceMade === "A" ? "#c9a96e" : "#8a7a5a"}
            filter="url(#glow)"
          />
        </g>

        {/* People on main track */}
        <g>
          {renderPeopleGroup(
            scenario.peopleOnMain,
            420,
            205,
            "#e8dcc8",
            "main",
            impactMain
          )}
          <text
            x="420"
            y="250"
            textAnchor="middle"
            fill="#e8dcc8"
            fontSize="11"
            fontWeight="bold"
            opacity={impactMain ? 0.3 : 1}
            style={{ transition: "opacity 0.3s ease-out" }}
          >
            {scenario.peopleOnMain > 10
              ? `${scenario.peopleOnMain.toLocaleString()} people`
              : `${scenario.peopleOnMain} ${scenario.peopleOnMain === 1 ? "person" : "people"}`}
          </text>
        </g>

        {/* People on alternate track (if any) */}
        {scenario.peopleOnAlt > 0 && (
          <g>
            {renderPeopleGroup(
              scenario.peopleOnAlt,
              420,
              165,
              "#c9a96e",
              "alt",
              impactAlt
            )}
            <text
              x="420"
              y="142"
              textAnchor="middle"
              fill="#c9a96e"
              fontSize="11"
              fontWeight="bold"
              opacity={impactAlt ? 0.3 : 1}
              style={{ transition: "opacity 0.3s ease-out" }}
            >
              {scenario.peopleOnAlt}{" "}
              {scenario.peopleOnAlt === 1 ? "person" : "people"}
            </text>
          </g>
        )}

        {/* Trolley */}
        <g
          transform={
            choiceMade === "A" && trolleyX > 250
              ? `translate(${trolleyX}, ${220 - (trolleyX - 250) * 0.26})`
              : `translate(${trolleyX}, 220)`
          }
        >
          <rect
            x="-20"
            y="-22"
            width="40"
            height="18"
            fill="#c9a96e"
            rx="4"
            stroke="#a8893e"
            strokeWidth="1"
          />
          <rect
            x="-16"
            y="-20"
            width="10"
            height="8"
            fill="#e8dcc8"
            rx="1"
          />
          <rect
            x="2"
            y="-20"
            width="10"
            height="8"
            fill="#e8dcc8"
            rx="1"
          />
          <circle cx="-12" cy="-2" r="4" fill="#1a1710" />
          <circle cx="12" cy="-2" r="4" fill="#1a1710" />
          <circle cx="-12" cy="-2" r="2" fill="#5a5040" />
          <circle cx="12" cy="-2" r="2" fill="#5a5040" />
          {/* Danger glow */}
          <circle
            cx="0"
            cy="-12"
            r="25"
            fill="none"
            stroke="#c9a96e"
            strokeWidth="1"
            opacity="0.3"
            filter="url(#glow)"
          />
        </g>

        {/* Scenario label */}
        <text
          x="280"
          y="280"
          textAnchor="middle"
          fill="#8a7a5a"
          fontSize="12"
          fontStyle="italic"
        >
          {scenario.visualType === "classic"
            ? "Classic Trolley Problem"
            : scenario.title}
        </text>
      </svg>
    </div>
  );
}

function renderPeopleGroup(
  count: number,
  cx: number,
  cy: number,
  color: string,
  key: string,
  impact: boolean = false
) {
  const displayCount = Math.min(count, 7);
  const spacing = Math.min(16, 80 / displayCount);
  const startX = cx - ((displayCount - 1) * spacing) / 2;

  // Different fall animations for each person
  const fallAnimations = [
    { rotate: 85, dx: -8, dy: 12 },
    { rotate: -75, dx: 6, dy: 10 },
    { rotate: 95, dx: -4, dy: 14 },
    { rotate: -90, dx: 8, dy: 11 },
    { rotate: 70, dx: -10, dy: 13 },
    { rotate: -80, dx: 5, dy: 12 },
    { rotate: 88, dx: -6, dy: 11 },
  ];

  return (
    <g>
      {Array.from({ length: displayCount }).map((_, i) => {
        const x = startX + i * spacing;
        const fall = fallAnimations[i % fallAnimations.length];
        
        return (
          <g 
            key={`${key}-${i}`}
            style={{
              transform: impact 
                ? `translate(${fall.dx}px, ${fall.dy}px) rotate(${fall.rotate}deg)`
                : 'translate(0px, 0px) rotate(0deg)',
              transformOrigin: `${x}px ${cy}px`,
              transition: `transform 0.4s ease-out ${i * 0.05}s, opacity 0.3s ease-out ${i * 0.05}s`,
              opacity: impact ? 0.35 : 1,
            }}
          >
            {/* Head */}
            <circle cx={x} cy={cy - 10} r={4} fill={color} />
            {/* Body */}
            <line
              x1={x}
              y1={cy - 6}
              x2={x}
              y2={cy + 2}
              stroke={color}
              strokeWidth="2"
            />
            {/* Arms */}
            <line
              x1={x - 4}
              y1={cy - 3}
              x2={x + 4}
              y2={cy - 3}
              stroke={color}
              strokeWidth="1.5"
            />
            {/* Legs */}
            <line
              x1={x}
              y1={cy + 2}
              x2={x - 3}
              y2={cy + 8}
              stroke={color}
              strokeWidth="1.5"
            />
            <line
              x1={x}
              y1={cy + 2}
              x2={x + 3}
              y2={cy + 8}
              stroke={color}
              strokeWidth="1.5"
            />
          </g>
        );
      })}
      {count > 7 && (
        <text
          x={cx + 50}
          y={cy}
          fill={color}
          fontSize="10"
          fontWeight="bold"
          style={{
            opacity: impact ? 0.3 : 1,
            transition: "opacity 0.3s ease-out",
          }}
        >
          +{count - 7}
        </text>
      )}
    </g>
  );
}
