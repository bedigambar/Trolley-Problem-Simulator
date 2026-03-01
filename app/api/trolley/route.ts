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

// In-memory aggregate store (resets on server restart)
const globalStats = {
  totalResponses: 0,
  overallUtilitarian: 0,
  overallDeontological: 0,
  scenarios: new Map<string, ScenarioStat>(),
  recentChoices: [] as ChoiceRecord[],
};

// POST — record a new choice
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

    // Update global counters
    globalStats.totalResponses++;
    if (philosophy === "utilitarian") {
      globalStats.overallUtilitarian++;
    } else {
      globalStats.overallDeontological++;
    }

    // Update per-scenario stats
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

    // Keep last 500 choices for trends
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

// GET — retrieve aggregate stats
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
