export interface DilemmaOption {
  id: "A" | "B";
  label: string;
  description: string;
  philosophy: "utilitarian" | "deontological";
}

export interface Scenario {
  id: string;
  title: string;
  category: string;
  difficulty: "Warm-Up" | "Hard" | "Gut-Wrenching" | "Soul-Crushing";
  narrative: string;
  stakes: string;
  optionA: DilemmaOption;
  optionB: DilemmaOption;
  visualType:
    | "classic"
    | "bridge"
    | "hospital"
    | "car"
    | "lifeboat"
    | "time"
    | "surveillance"
    | "whistleblower"
    | "vaccine"
    | "judge"
    | "memory"
    | "genetic";
  peopleOnMain: number;
  peopleOnAlt: number;
  insight: {
    origin: string;
    philosopherA: string;
    philosopherB: string;
    realWorld: string;
  };
  variant: {
    twist: string;
    question: string;
  };
  extended?: boolean;
}

export interface UserChoice {
  scenarioId: string;
  choice: "A" | "B" | null; // null means skipped
  philosophy: "utilitarian" | "deontological" | null; // null means skipped
  responseTimeMs: number;
  timedMode?: boolean;
  confidence?: number; // 1-5
  skipped?: boolean; // true if timer ran out without choosing
  changedFrom?: "A" | "B"; // if user changed their initial answer
}

export interface AggregateStats {
  totalResponses: number;
  scenarioStats: Record<
    string,
    {
      totalResponses: number;
      optionA: number;
      optionB: number;
      avgResponseTimeMs: number;
    }
  >;
  overallUtilitarian: number;
  overallDeontological: number;
}
