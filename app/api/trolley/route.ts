import { NextRequest, NextResponse } from "next/server";

interface ChoiceRecord {
  scenarioId: string;
  choice: "A" | "B";
  philosophy: "utilitarian" | "deontological";
  responseTimeMs: number;
  timestamp: number;
}

interface ScenarioStat {
  totalResponses: number;
  optionA: number;
  optionB: number;
  totalResponseTimeMs: number;
}

const seedStats: Record<string, { optionA: number; optionB: number }> = {
  classic: { optionA: 7300, optionB: 2700 }, 
  footbridge: { optionA: 2100, optionB: 7900 }, 
  surgeon: { optionA: 900, optionB: 9100 }, 
  "autonomous-car": { optionA: 5400, optionB: 4600 }, 
  lifeboat: { optionA: 6800, optionB: 3200 }, 
  "time-traveler": { optionA: 7400, optionB: 2600 }, 
  surveillance: { optionA: 3800, optionB: 6200 }, 
  whistleblower: { optionA: 3200, optionB: 6800 }, 
  "vaccine-lottery": { optionA: 6200, optionB: 3800 }, 
  "ai-judge": { optionA: 4100, optionB: 5900 }, 
  "memory-wipe": { optionA: 5200, optionB: 4800 }, 
  "genetic-edit": { optionA: 2800, optionB: 7200 }, 
};

const scenariosMap = new Map<string, ScenarioStat>();
let initialTotalResponses = 0;
let initialOverallUtilitarian = 0;
let initialOverallDeontological = 0;

Object.entries(seedStats).forEach(([id, counts]) => {
  const total = counts.optionA + counts.optionB;
  initialTotalResponses += total;
  initialOverallUtilitarian += counts.optionA;
  initialOverallDeontological += counts.optionB;
  scenariosMap.set(id, {
    totalResponses: total,
    optionA: counts.optionA,
    optionB: counts.optionB,
    totalResponseTimeMs: total * 8500, 
  });
});

const globalStats = {
  totalResponses: initialTotalResponses,
  overallUtilitarian: initialOverallUtilitarian,
  overallDeontological: initialOverallDeontological,
  scenarios: scenariosMap,
  recentChoices: [] as ChoiceRecord[],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenarioId, choice, philosophy, responseTimeMs } = body;

    if (!scenarioId || !choice || !philosophy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const record: ChoiceRecord = {
      scenarioId,
      choice,
      philosophy,
      responseTimeMs: responseTimeMs || 0,
      timestamp: Date.now(),
    };

    globalStats.totalResponses++;
    if (philosophy === "utilitarian") {
      globalStats.overallUtilitarian++;
    } else {
      globalStats.overallDeontological++;
    }

    const existing = globalStats.scenarios.get(scenarioId) || {
      totalResponses: 0,
      optionA: 0,
      optionB: 0,
      totalResponseTimeMs: 0,
    };

    existing.totalResponses++;
    if (choice === "A") existing.optionA++;
    else existing.optionB++;
    existing.totalResponseTimeMs += responseTimeMs || 0;

    globalStats.scenarios.set(scenarioId, existing);

    globalStats.recentChoices.push(record);
    if (globalStats.recentChoices.length > 500) {
      globalStats.recentChoices = globalStats.recentChoices.slice(-500);
    }

    return NextResponse.json({ success: true, totalResponses: globalStats.totalResponses });
  } catch {
    return NextResponse.json(
      { error: "Failed to process choice" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const scenarioStats: Record<
    string,
    {
      totalResponses: number;
      optionA: number;
      optionB: number;
      avgResponseTimeMs: number;
    }
  > = {};

  globalStats.scenarios.forEach((stat, id) => {
    scenarioStats[id] = {
      totalResponses: stat.totalResponses,
      optionA: stat.optionA,
      optionB: stat.optionB,
      avgResponseTimeMs:
        stat.totalResponses > 0
          ? Math.round(stat.totalResponseTimeMs / stat.totalResponses)
          : 0,
    };
  });

  return NextResponse.json({
    totalResponses: globalStats.totalResponses,
    overallUtilitarian: globalStats.overallUtilitarian,
    overallDeontological: globalStats.overallDeontological,
    scenarioStats,
  });
}
