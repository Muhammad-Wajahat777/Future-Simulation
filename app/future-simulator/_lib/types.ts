export interface CaseOutcome {
  scenario: string;
}

export interface Outcomes {
  best_case: CaseOutcome;
  average_case: CaseOutcome;
  worst_case: CaseOutcome;
}

export interface SimulationRecord {
  id: string;
  situation: string;
  decisions: string[];
  outcomes: Outcomes;
  created_at: string;
}

export type SimulationPhase = "form" | "simulating" | "results";
