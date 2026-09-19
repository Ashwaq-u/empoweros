export type DocumentType = 'OFFER_LETTER' | 'TERMINATION_NOTICE' | 'POLICY_HANDBOOK';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type SeverityLevel = 'CRITICAL' | 'WARNING' | 'NOTE';

export interface RedFlag {
  clauseTitle: string;
  quotedText: string;
  issueExplanation: string;
  severity: SeverityLevel;
  recommendation: string;
}

export interface UnclaimedBenefit {
  title: string;
  estimatedValue: string; // e.g. "$1,200/year" or "15 Days PTO Encashment"
  actionRequired: string;
}

export interface CriticalDeadline {
  event: string; // e.g. "Stock Option Exercise Window (90 Days)"
  timeframe: string;
  impact: string;
}

export interface CounterStrategy {
  keyNegotiationPoints: string[]; // 3 high-leverage points
  generatedDraftEmail?: string; // Complete counter-negotiation draft
}

export interface DimensionScore {
  dimension: string; // e.g., "IP Freedom", "Non-Compete Scope", "Equity Safety", "Severance Terms", "Perks & Stipends"
  score: number; // 0 to 100
  benchmark: number; // Market average (e.g. 50-70)
  description: string;
}

export interface ContractRedline {
  clauseTitle: string;
  sectionNumber: string;
  originalText: string;
  strikeThroughText: string;
  amendedText: string;
  legalRationale: string;
}

export interface SafeHarborProject {
  id: string;
  projectName: string;
  description: string;
  repositoryOrUrl?: string;
  dateStarted: string;
}

export interface DocumentAnalysisResponse {
  documentType: DocumentType;
  healthScore: number; // Integer between 0 and 100
  riskLevel: RiskLevel;
  summary: string; // 2-sentence executive summary
  redFlags: RedFlag[];
  unclaimedValueOrBenefits: UnclaimedBenefit[];
  criticalDeadlines: CriticalDeadline[];
  counterStrategy: CounterStrategy;
  powerBalanceDimensions?: DimensionScore[];
  redlines?: ContractRedline[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citation?: string; // e.g. "[Handbook Section 5.3, Page 22]"
  timestamp: Date;
}

export interface RunwayCalculation {
  currentSavings: number;
  expectedSeverance: number;
  monthlyExpenses: number;
  totalRunwayMonths: number;
  totalRunwayDays: number;
  status: 'CRITICAL' | 'MODERATE' | 'HEALTHY';
}
