export type OpportunityType = "Upsell Candidate" | "Restructure Candidate";
export type OpportunityStatus =
  | "Pursued"
  | "Declined"
  | "Not Applicable"
  | "In Discussion"
  | "Resolved"
  | "Monitor";
export type RiskLevel = "Low" | "Medium" | "High";
export type SignalStrength = "Weak" | "Moderate" | "Strong";

export type WarningType =
  | "Liquidity & Payment Risk"
  | "Credit & Structural Risk"
  | "Asset & Market Risk"
  | "Operational & Compliance Risk";

export type RecommendedActionType =
  | "Mitigate"
  | "Restructure"
  | "Recapitalize"
  | "Sell";

export interface NextStep {
  title: string;
  description: string;
}

export interface RiskEntry {
  id: string;
  borrowerId: string;
  borrowerName: string;
  facilityId: string;
  riskScore: number;
  recommendedAction: RecommendedActionType;
  actionDescription: string;
  warningType: WarningType;
  reasoning: string;
  nextStep: NextStep;
}
export type Trend = "improving" | "stable" | "declining";
export type CovenantStatus =
  | "Compliant"
  | "Non-Compliant"
  | "Pending"
  | "Waived"
  | "Overdue";
export type CovenantType = "Financial" | "Non-Financial";
export type TrackingMode = "Manual" | "Automatic";
export type ComplianceRule = "EQ" | "GT" | "LT" | "GE" | "LE";
export type ConcentrationStatus = "Within Limit" | "At Risk" | "Cap Triggered";
export type TransactionType =
  | "Advance"
  | "Payment"
  | "Interest"
  | "Fee"
  | "Adjustment";
export type RecordType = "Lien" | "Lawsuit" | "Bankruptcy" | "Judgment";
export type Severity = "Informational" | "Watch" | "Critical";
export type ContactMethod = "Call" | "Email" | "Meeting" | "Other";
export type FollowUpOutcome =
  | "Interested"
  | "Not Interested"
  | "Scheduled Meeting"
  | "Left Voicemail"
  | "Other";

export interface SignalCallout {
  text: string;
  strength: SignalStrength;
}

export interface Borrower {
  id: string;
  name: string;
  facilityId: string;
  opportunityScore: number;
  opportunityTypes: OpportunityType[];
  signals: SignalCallout[];
  lastContactDate: string;
  assignedOfficer: string;
  status?: OpportunityStatus;
  currentFacilitySummary: string;
  suggestedProduct?: string;
  estimatedUpsellRange?: string;
  confidenceScore?: number;
  restructuringTrigger?: string;
  recommendedAction?: string;
  riskLevel?: RiskLevel;
  industry?: string;
  naicsCode?: string;
  wowGrowthPct: number;
  creditLineExpansion: number;
  headcountGrowthPct: number;
  summary: string;
  nextSteps: NextStep[];
}

export interface GrowthSignal {
  name: string;
  strength: SignalStrength;
  dataPoint: string;
  dateDetected: string;
}

export interface ServicingIndicator {
  name: string;
  value: string;
  status: "healthy" | "watch" | "concern";
  contributesToScore: boolean;
}

export interface DSODataPoint {
  month: string;
  value: number;
  industryAvg?: number;
}

export interface PublicRecord {
  id: string;
  type: RecordType;
  filingDate: string;
  jurisdiction: string;
  parties: string;
  amount?: number;
  source: string;
  severity: Severity;
  description: string;
}

export interface CommercialPermit {
  id: string;
  borrowerId: string;
  borrowerName: string;
  permitType: "New Construction" | "Expansion" | "Tenant Improvement" | "Major Renovation";
  propertyAddress: string;
  jurisdiction: string;
  projectDescription: string;
  estimatedProjectValue: number;
  filingDate: string;
  status: "Submitted" | "Under Review" | "Approved";
}

export interface Covenant {
  id: string;
  name: string;
  type: CovenantType;
  trackingMode: TrackingMode;
  status: CovenantStatus;
  nextReviewDate: string;
  complianceRule: ComplianceRule;
  targetValue: number;
  currentValue?: number;
  description: string;
}

export interface ConcentrationEntry {
  debtorName: string;
  arBalance: number;
  percentOfBase: number;
  concentrationCap: number;
  status: ConcentrationStatus;
  cappedAmount: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  runningBalance: number;
  referenceNumber: string;
  description: string;
  anomalous: boolean;
}

export interface PersonNode {
  id: string;
  name: string;
  title: string;
  email?: string;
  phone?: string;
  isGuarantor: boolean;
  reportsTo?: string;
}

export interface FollowUpEntry {
  id: string;
  contactDate: string;
  method: ContactMethod;
  outcome: FollowUpOutcome;
  notes: string;
  nextAction?: string;
  nextActionDueDate?: string;
}

export interface CovenantScheduleEntry {
  id: string;
  covenantId: string;
  covenantName: string;
  period: string;
  status: CovenantStatus;
  actualValue?: number;
  targetValue: number;
  dueDate: string;
  daysRemaining: number;
  notes?: string;
}

export interface HomeMetrics {
  totalHotLeads: number;
  upsellCount: number;
  upsellEstimatedValue: number;
  restructureCandidates: number;
  restructureByRisk: { low: number; medium: number; high: number };
  covenantBreaches: number;
  facilitiesInBreach: number;
  concentrationAlerts: number;
}

export interface UtilizationDataPoint {
  month: string;
  utilization: number;
}

export interface IndustryBenchmark {
  metric: string;
  borrowerValue: string;
  industryAvg: string;
  comparison: "above" | "below" | "inline";
}

export interface RealEstateAsset {
  address: string;
  parcelId: string;
  estimatedValue: number;
  lastAppraisalDate: string;
  lastAppraisalValue: number;
  valueTrend: "appreciation" | "depreciation" | "stable";
  lienPosition: string;
  ltv: number;
}

export interface SOSFiling {
  entityName: string;
  entityStatus: "Active" | "Inactive" | "Dissolved";
  registeredAgent: string;
  annualReportStatus: string;
  annualReportDueDate: string;
  recentChanges: string[];
}

export type LoanAnalysis = "Likely approved" | "Review needed" | "Likely declined";
export type LoanStatus = "In Analysis" | "Pending Review" | "Under Review" | "Approved" | "Declined";
export type LoanActionType = "Create Credit Memo" | "Create Restructuring" | "Create Scenario";
export type LoanType = "CRE Refinance" | "Term Loan" | "Revolving Credit" | "SBA 7(a)" | "Construction" | "Equipment Finance";

export interface LoanEvaluation {
  id: string;
  borrowerName: string;
  loanAmount: number;
  loanType: LoanType;
  status: LoanStatus;
  analysis: LoanAnalysis;
  action: LoanActionType;
  submissionDate: string;
  assignedOfficer: string;
  confidenceScore: number;
}
