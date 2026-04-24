import type {
  Borrower,
  HomeMetrics,
  GrowthSignal,
  ServicingIndicator,
  DSODataPoint,
  PublicRecord,
  CommercialPermit,
  Covenant,
  ConcentrationEntry,
  Transaction,
  PersonNode,
  FollowUpEntry,
  CovenantScheduleEntry,
  UtilizationDataPoint,
  IndustryBenchmark,
  RealEstateAsset,
  SOSFiling,
  RiskEntry,
  LoanEvaluation,
} from "./types";

export const borrowers: Borrower[] = [
  {
    id: "bor-001",
    name: "Vanguard Logistics Ltd.",
    facilityId: "TX-9928-BA",
    opportunityScore: 94,
    opportunityTypes: ["Upsell Candidate"],
    signals: [
      { text: "Revenue up 34% YoY", strength: "Strong" },
      { text: "Credit line 85% utilized", strength: "Strong" },
      { text: "New equipment purchase planned", strength: "Moderate" },
    ],
    lastContactDate: "2026-03-28",
    assignedOfficer: "Sarah Martinez",
    currentFacilitySummary: "$5M revolving line, 85% utilized",
    suggestedProduct: "Equipment financing line",
    estimatedUpsellRange: "$1.5M - $2.5M",
    confidenceScore: 87,
    industry: "Transportation & Warehousing",
    naicsCode: "484110",
    wowGrowthPct: 15,
    creditLineExpansion: 500_000,
    headcountGrowthPct: 12.4,
    summary:
      "Borrower shows consistent 15% WoW growth in servicing volumes. Eligible for credit line expansion up to $500k. Company showing 12.4% increase in headcount.",
    nextSteps: [
      {
        title: "Automated Credit Memo",
        description:
          "A generated summary including the 15% WoW growth and 12.4% headcount data as the Justification for Increase.",
      },
      {
        title: "Letter of Intent (LOI)",
        description:
          "A personalized offer letter for the $500k expansion, ready to be sent to the CFO.",
      },
      {
        title: "Covenant Compliance Certificate",
        description:
          "A forward-looking document showing how the new debt fits within existing DSCR and leverage ratios.",
      },
    ],
  },
  {
    id: "bor-002",
    name: "Greenfield Logistics LLC",
    facilityId: "FAC-2024-0743",
    opportunityScore: 85,
    opportunityTypes: ["Upsell Candidate", "Restructure Candidate"],
    signals: [
      { text: "DSO improved 18 days", strength: "Strong" },
      { text: "New lien filed by vendor", strength: "Moderate" },
      { text: "Inventory expansion 22%", strength: "Moderate" },
    ],
    lastContactDate: "2026-03-15",
    assignedOfficer: "James Chen",
    currentFacilitySummary: "$3.2M ABL facility, maturing Q3 2026",
    suggestedProduct: "Line of credit increase",
    estimatedUpsellRange: "$800K - $1.2M",
    confidenceScore: 74,
    restructuringTrigger: "Facility maturing in 5 months",
    recommendedAction: "Discuss term extension and line increase",
    riskLevel: "Low",
    industry: "Transportation & Warehousing",
    naicsCode: "484110",
    wowGrowthPct: 9,
    creditLineExpansion: 350_000,
    headcountGrowthPct: 6.8,
    summary:
      "DSO improved 18 days quarter-over-quarter while inventory expanded 22%. $3.2M ABL facility matures in Q3 2026 — ripe for term extension plus a $350k line increase.",
    nextSteps: [
      {
        title: "Term Extension Proposal",
        description:
          "A 24-month extension of the $3.2M ABL facility with updated pricing tied to the improved DSO trajectory.",
      },
      {
        title: "Line Increase Term Sheet",
        description:
          "A $350k line bump sized against the 22% inventory expansion and recent working-capital velocity.",
      },
      {
        title: "Vendor Lien Review Memo",
        description:
          "A reconciliation of the newly filed vendor lien against collateral priority before issuing the amended facility.",
      },
    ],
  },
  {
    id: "bor-003",
    name: "Coastal Health Services",
    facilityId: "FAC-2023-1102",
    opportunityScore: 78,
    opportunityTypes: ["Restructure Candidate"],
    signals: [
      { text: "Covenant approaching breach (DSCR)", strength: "Strong" },
      { text: "DSO deteriorating +12 days", strength: "Moderate" },
      { text: "Industry headwinds in healthcare staffing", strength: "Weak" },
    ],
    lastContactDate: "2026-04-01",
    assignedOfficer: "Sarah Martinez",
    currentFacilitySummary: "$8M term loan, 3 years remaining",
    restructuringTrigger: "DSCR covenant at 1.22x vs 1.20x minimum",
    recommendedAction: "Review collateral and discuss covenant amendment",
    riskLevel: "Medium",
    industry: "Healthcare",
    naicsCode: "621111",
    wowGrowthPct: 3,
    creditLineExpansion: 150_000,
    headcountGrowthPct: 2.1,
    summary:
      "DSCR compressed to 1.22x against a 1.20x covenant floor with DSO deteriorating 12 days. Healthcare staffing headwinds justify a covenant amendment before the Q2 2026 review.",
    nextSteps: [
      {
        title: "Covenant Amendment Package",
        description:
          "A proposed one-quarter DSCR relief letter paired with a refreshed compliance forecast for the credit committee.",
      },
      {
        title: "Collateral Revaluation Memo",
        description:
          "An updated appraisal summary of AR and equipment collateral to reinforce the amended borrowing base.",
      },
      {
        title: "Workout Watchlist Entry",
        description:
          "An internal tracking document escalating the facility for bi-weekly DSCR and DSO monitoring.",
      },
    ],
  },
  {
    id: "bor-004",
    name: "Summit Steel Distributors",
    facilityId: "FAC-2024-0215",
    opportunityScore: 71,
    opportunityTypes: ["Upsell Candidate"],
    signals: [
      { text: "AR volume up 28% vs prior quarter", strength: "Strong" },
      { text: "New customer acquisition reducing concentration", strength: "Moderate" },
    ],
    lastContactDate: "2026-03-20",
    assignedOfficer: "Michael Rodriguez",
    currentFacilitySummary: "$4.5M revolving line, 62% utilized",
    suggestedProduct: "Increase revolving line",
    estimatedUpsellRange: "$1M - $1.8M",
    confidenceScore: 69,
    industry: "Wholesale Trade",
    naicsCode: "423510",
    wowGrowthPct: 11,
    creditLineExpansion: 400_000,
    headcountGrowthPct: 7.5,
    summary:
      "AR volume jumped 28% versus prior quarter as new customers reduced top-debtor concentration. Line utilization at 62% leaves headroom — eligible for a $400k increase.",
    nextSteps: [
      {
        title: "Line Increase Credit Memo",
        description:
          "A generated memo using the 28% AR lift and diversified debtor mix as justification for the $400k upsell.",
      },
      {
        title: "Concentration Review Letter",
        description:
          "A borrower-ready summary showing concentration reduction and the resulting updated advance rates.",
      },
      {
        title: "Relationship Pricing Sheet",
        description:
          "A tiered pricing proposal aligned with the expanded facility and projected utilization curve.",
      },
    ],
  },
  {
    id: "bor-005",
    name: "TechVenture Solutions Inc",
    facilityId: "FAC-2025-0033",
    opportunityScore: 67,
    opportunityTypes: ["Restructure Candidate"],
    signals: [
      { text: "Concentration risk: top debtor at 28%", strength: "Strong" },
      { text: "Payment behavior slowing", strength: "Moderate" },
      { text: "Recent lawsuit filed (defendant)", strength: "Weak" },
    ],
    lastContactDate: "2026-02-28",
    assignedOfficer: "James Chen",
    currentFacilitySummary: "$2.8M ABL facility",
    restructuringTrigger: "Concentration risk elevated, single debtor exceeds cap",
    recommendedAction: "Adjust advance rate and review concentration thresholds",
    riskLevel: "High",
    industry: "Information Technology",
    naicsCode: "541511",
    wowGrowthPct: 2,
    creditLineExpansion: 100_000,
    headcountGrowthPct: 1.5,
    summary:
      "Top debtor concentration hit 28% — past the 20% cap — while payment behavior slowed and a new lawsuit was filed. Advance rate and concentration thresholds need to be reset.",
    nextSteps: [
      {
        title: "Advance Rate Adjustment Letter",
        description:
          "A borrower notice stepping the advance rate down on the over-cap debtor and refreshing the borrowing base.",
      },
      {
        title: "Concentration Cap Memo",
        description:
          "A credit memo recommending revised concentration thresholds grounded in the latest aging and payment trends.",
      },
      {
        title: "Litigation Monitoring Brief",
        description:
          "A watchlist entry summarizing the pending lawsuit and its potential impact on the facility.",
      },
    ],
  },
  {
    id: "bor-006",
    name: "Prairie Agricultural Co-op",
    facilityId: "FAC-2024-0567",
    opportunityScore: 58,
    opportunityTypes: ["Upsell Candidate"],
    signals: [
      { text: "Seasonal revenue increase expected", strength: "Moderate" },
      { text: "Strong payment history (99% on-time)", strength: "Strong" },
    ],
    lastContactDate: "2026-03-10",
    assignedOfficer: "Sarah Martinez",
    currentFacilitySummary: "$6M seasonal line, 40% utilized",
    suggestedProduct: "Temporary line increase for harvest season",
    estimatedUpsellRange: "$2M - $3M",
    confidenceScore: 62,
    industry: "Agriculture",
    naicsCode: "111100",
    wowGrowthPct: 7,
    creditLineExpansion: 250_000,
    headcountGrowthPct: 4.2,
    summary:
      "Co-op maintains a 99% on-time payment rate with seasonal revenue acceleration ahead. A temporary $250k line increase covers the harvest window without structural changes.",
    nextSteps: [
      {
        title: "Seasonal Line Increase Memo",
        description:
          "A right-sized $250k temporary uplift tied to the harvest revenue ramp and strong payment history.",
      },
      {
        title: "Repayment Schedule Overlay",
        description:
          "A planned paydown schedule aligned with post-harvest cash flows to auto-retire the seasonal line.",
      },
      {
        title: "Crop Insurance Certificate Request",
        description:
          "A borrower checklist item ensuring current crop insurance is on file before the advance is funded.",
      },
    ],
  },
];

export const homeMetrics: HomeMetrics = {
  totalHotLeads: 6,
  upsellCount: 4,
  upsellEstimatedValue: 8_500_000,
  restructureCandidates: 3,
  restructureByRisk: { low: 1, medium: 1, high: 1 },
  covenantBreaches: 2,
  facilitiesInBreach: 2,
  concentrationAlerts: 3,
};

// ---- Borrower Detail Mock Data (keyed to bor-001 by default) ----

export const growthSignals: GrowthSignal[] = [
  {
    name: "Revenue Growth",
    strength: "Strong",
    dataPoint: "Revenue up 34% YoY ($12.4M → $16.6M)",
    dateDetected: "2026-03-01",
  },
  {
    name: "Inventory Expansion",
    strength: "Moderate",
    dataPoint: "Inventory levels increased 22% ($1.8M → $2.2M)",
    dateDetected: "2026-02-15",
  },
  {
    name: "New Customer Acquisition",
    strength: "Moderate",
    dataPoint: "3 new debtors added in past 90 days, reducing concentration",
    dateDetected: "2026-03-10",
  },
  {
    name: "Credit Line Utilization",
    strength: "Strong",
    dataPoint: "Line consistently at 80-90% utilization — potential capacity need",
    dateDetected: "2026-01-20",
  },
];

export const servicingIndicators: ServicingIndicator[] = [
  { name: "On-Time Payment Rate", value: "97.3%", status: "healthy", contributesToScore: false },
  { name: "Avg Days Past Due", value: "2.1 days", status: "healthy", contributesToScore: false },
  { name: "Line Utilization", value: "85%", status: "watch", contributesToScore: true },
  { name: "Verification Frequency", value: "Monthly", status: "healthy", contributesToScore: false },
  { name: "Exception Rate (90d)", value: "3 exceptions", status: "watch", contributesToScore: true },
  { name: "Reserve Balance Trend", value: "Stable", status: "healthy", contributesToScore: false },
];

export const utilizationHistory: UtilizationDataPoint[] = [
  { month: "Apr 2025", utilization: 62 },
  { month: "May 2025", utilization: 65 },
  { month: "Jun 2025", utilization: 68 },
  { month: "Jul 2025", utilization: 72 },
  { month: "Aug 2025", utilization: 70 },
  { month: "Sep 2025", utilization: 74 },
  { month: "Oct 2025", utilization: 78 },
  { month: "Nov 2025", utilization: 76 },
  { month: "Dec 2025", utilization: 80 },
  { month: "Jan 2026", utilization: 82 },
  { month: "Feb 2026", utilization: 84 },
  { month: "Mar 2026", utilization: 85 },
];

export const dsoHistory: DSODataPoint[] = [
  { month: "Apr 2024", value: 48, industryAvg: 42 },
  { month: "May 2024", value: 47, industryAvg: 42 },
  { month: "Jun 2024", value: 46, industryAvg: 41 },
  { month: "Jul 2024", value: 45, industryAvg: 41 },
  { month: "Aug 2024", value: 44, industryAvg: 42 },
  { month: "Sep 2024", value: 43, industryAvg: 42 },
  { month: "Oct 2024", value: 44, industryAvg: 41 },
  { month: "Nov 2024", value: 42, industryAvg: 41 },
  { month: "Dec 2024", value: 41, industryAvg: 42 },
  { month: "Jan 2025", value: 40, industryAvg: 42 },
  { month: "Feb 2025", value: 39, industryAvg: 41 },
  { month: "Mar 2025", value: 38, industryAvg: 41 },
  { month: "Apr 2025", value: 38, industryAvg: 41 },
  { month: "May 2025", value: 37, industryAvg: 42 },
  { month: "Jun 2025", value: 36, industryAvg: 41 },
  { month: "Jul 2025", value: 36, industryAvg: 41 },
  { month: "Aug 2025", value: 35, industryAvg: 42 },
  { month: "Sep 2025", value: 35, industryAvg: 42 },
  { month: "Oct 2025", value: 34, industryAvg: 41 },
  { month: "Nov 2025", value: 34, industryAvg: 41 },
  { month: "Dec 2025", value: 33, industryAvg: 42 },
  { month: "Jan 2026", value: 33, industryAvg: 42 },
  { month: "Feb 2026", value: 32, industryAvg: 41 },
  { month: "Mar 2026", value: 31, industryAvg: 41 },
];

export const publicRecords: PublicRecord[] = [
  {
    id: "pr-001",
    type: "Lien",
    filingDate: "2026-03-15",
    jurisdiction: "State of Ohio",
    parties: "IRS vs Apex Manufacturing Corp",
    amount: 45000,
    source: "Ohio Secretary of State UCC Database",
    severity: "Watch",
    description: "Federal tax lien filed — $45,000 outstanding payroll taxes",
  },
  {
    id: "pr-002",
    type: "Lien",
    filingDate: "2026-01-22",
    jurisdiction: "Cuyahoga County, OH",
    parties: "First National Bank — UCC-1 Filing",
    source: "Cuyahoga County Recorder",
    severity: "Informational",
    description: "UCC-1 financing statement — existing equipment lien (expected)",
  },
  {
    id: "pr-003",
    type: "Lawsuit",
    filingDate: "2025-11-08",
    jurisdiction: "Cuyahoga County Court of Common Pleas",
    parties: "Smith & Associates vs Apex Manufacturing Corp",
    amount: 125000,
    source: "Ohio Courts Network",
    severity: "Watch",
    description: "Breach of contract claim — dispute over equipment delivery terms",
  },
];

export const commercialPermits: CommercialPermit[] = [
  {
    id: "perm-001",
    borrowerId: "bor-001",
    borrowerName: "Vanguard Logistics Ltd.",
    permitType: "New Construction",
    propertyAddress: "4820 Industrial Pkwy, Columbus, OH 43219",
    jurisdiction: "City of Columbus Building Services",
    projectDescription:
      "180,000 sq ft cross-dock distribution facility with 42 loading bays",
    estimatedProjectValue: 18_500_000,
    filingDate: "2026-03-28",
    status: "Under Review",
  },
  {
    id: "perm-002",
    borrowerId: "bor-005",
    borrowerName: "TechVenture Solutions Inc",
    permitType: "Tenant Improvement",
    propertyAddress: "1200 Market St, Floor 14-16, San Francisco, CA 94102",
    jurisdiction: "San Francisco Department of Building Inspection",
    projectDescription:
      "Three-floor office build-out for R&D expansion — 48,000 sq ft, new datacenter pod",
    estimatedProjectValue: 6_200_000,
    filingDate: "2026-04-11",
    status: "Submitted",
  },
  {
    id: "perm-003",
    borrowerId: "bor-003",
    borrowerName: "Coastal Health Services",
    permitType: "Expansion",
    propertyAddress: "2215 Harborview Blvd, Norfolk, VA 23510",
    jurisdiction: "City of Norfolk Planning & Zoning",
    projectDescription:
      "Ambulatory surgery wing — 22,000 sq ft addition to existing outpatient center",
    estimatedProjectValue: 9_750_000,
    filingDate: "2026-04-02",
    status: "Under Review",
  },
];

export const covenants: Covenant[] = [
  {
    id: "cov-001",
    name: "Debt Service Coverage Ratio",
    type: "Financial",
    trackingMode: "Automatic",
    status: "Compliant",
    nextReviewDate: "2026-06-30",
    complianceRule: "GE",
    targetValue: 1.2,
    currentValue: 1.45,
    description: "Borrower must maintain DSCR >= 1.20x",
  },
  {
    id: "cov-002",
    name: "Current Ratio",
    type: "Financial",
    trackingMode: "Automatic",
    status: "Compliant",
    nextReviewDate: "2026-06-30",
    complianceRule: "GE",
    targetValue: 1.5,
    currentValue: 1.82,
    description: "Borrower must maintain Current Ratio >= 1.50x",
  },
  {
    id: "cov-003",
    name: "Leverage Ratio",
    type: "Financial",
    trackingMode: "Automatic",
    status: "Pending",
    nextReviewDate: "2026-06-30",
    complianceRule: "LE",
    targetValue: 3.0,
    currentValue: undefined,
    description: "Total Debt / EBITDA must not exceed 3.0x",
  },
  {
    id: "cov-004",
    name: "Annual Financial Statements",
    type: "Non-Financial",
    trackingMode: "Manual",
    status: "Compliant",
    nextReviewDate: "2026-04-30",
    complianceRule: "EQ",
    targetValue: 1,
    currentValue: 1,
    description: "Audited financial statements due within 120 days of fiscal year end",
  },
  {
    id: "cov-005",
    name: "Minimum Tangible Net Worth",
    type: "Financial",
    trackingMode: "Automatic",
    status: "Non-Compliant",
    nextReviewDate: "2026-06-30",
    complianceRule: "GE",
    targetValue: 2_000_000,
    currentValue: 1_850_000,
    description: "Tangible Net Worth must be >= $2,000,000",
  },
];

export const concentrationData: ConcentrationEntry[] = [
  { debtorName: "National Auto Parts Inc", arBalance: 980000, percentOfBase: 22.5, concentrationCap: 20, status: "Cap Triggered", cappedAmount: 108900 },
  { debtorName: "Midwest Steel Supply", arBalance: 720000, percentOfBase: 16.5, concentrationCap: 20, status: "At Risk", cappedAmount: 0 },
  { debtorName: "Allied Construction Group", arBalance: 540000, percentOfBase: 12.4, concentrationCap: 20, status: "Within Limit", cappedAmount: 0 },
  { debtorName: "Pacific Rim Trading Co", arBalance: 480000, percentOfBase: 11.0, concentrationCap: 20, status: "Within Limit", cappedAmount: 0 },
  { debtorName: "Heartland Distributors", arBalance: 390000, percentOfBase: 9.0, concentrationCap: 20, status: "Within Limit", cappedAmount: 0 },
  { debtorName: "Other (12 debtors)", arBalance: 1_245_000, percentOfBase: 28.6, concentrationCap: 20, status: "Within Limit", cappedAmount: 0 },
];

export const transactions: Transaction[] = [
  { id: "txn-001", date: "2026-04-08", type: "Advance", amount: 250000, runningBalance: 4_250_000, referenceNumber: "ADV-20260408-001", description: "Working capital advance", anomalous: false },
  { id: "txn-002", date: "2026-04-07", type: "Payment", amount: -180000, runningBalance: 4_000_000, referenceNumber: "PMT-20260407-001", description: "Collection applied — National Auto Parts", anomalous: false },
  { id: "txn-003", date: "2026-04-05", type: "Interest", amount: -12500, runningBalance: 4_180_000, referenceNumber: "INT-20260405-001", description: "Monthly interest charge", anomalous: false },
  { id: "txn-004", date: "2026-04-03", type: "Advance", amount: 500000, runningBalance: 4_192_500, referenceNumber: "ADV-20260403-001", description: "Inventory purchase advance", anomalous: true },
  { id: "txn-005", date: "2026-04-01", type: "Fee", amount: -2500, runningBalance: 3_692_500, referenceNumber: "FEE-20260401-001", description: "Monthly facility fee", anomalous: false },
  { id: "txn-006", date: "2026-03-29", type: "Payment", amount: -320000, runningBalance: 3_695_000, referenceNumber: "PMT-20260329-001", description: "Collection applied — Midwest Steel", anomalous: false },
  { id: "txn-007", date: "2026-03-27", type: "Advance", amount: 175000, runningBalance: 4_015_000, referenceNumber: "ADV-20260327-001", description: "Working capital advance", anomalous: false },
  { id: "txn-008", date: "2026-03-25", type: "Adjustment", amount: -15000, runningBalance: 3_840_000, referenceNumber: "ADJ-20260325-001", description: "Ineligible AR adjustment", anomalous: false },
];

export const orgChart: PersonNode[] = [
  { id: "p-001", name: "Robert Chen", title: "CEO & Founder", email: "rchen@apexmfg.com", phone: "(216) 555-0101", isGuarantor: true },
  { id: "p-002", name: "Lisa Patel", title: "CFO", email: "lpatel@apexmfg.com", phone: "(216) 555-0102", isGuarantor: true, reportsTo: "p-001" },
  { id: "p-003", name: "David Kim", title: "VP Operations", email: "dkim@apexmfg.com", phone: "(216) 555-0103", isGuarantor: false, reportsTo: "p-001" },
  { id: "p-004", name: "Maria Santos", title: "Controller", email: "msantos@apexmfg.com", phone: "(216) 555-0104", isGuarantor: false, reportsTo: "p-002" },
  { id: "p-005", name: "James Wright", title: "VP Sales", email: "jwright@apexmfg.com", isGuarantor: false, reportsTo: "p-001" },
];

export const followUpHistory: FollowUpEntry[] = [
  {
    id: "fu-001",
    contactDate: "2026-03-28",
    method: "Call",
    outcome: "Interested",
    notes: "Discussed potential equipment financing. CEO mentioned new production line planned for Q3. Sending term sheet.",
    nextAction: "Send equipment financing term sheet",
    nextActionDueDate: "2026-04-02",
  },
  {
    id: "fu-002",
    contactDate: "2026-03-10",
    method: "Email",
    outcome: "Scheduled Meeting",
    notes: "Sent portfolio review summary. CFO responded — scheduled in-person meeting.",
    nextAction: "Prepare portfolio review deck",
    nextActionDueDate: "2026-03-25",
  },
];

export const covenantSchedule: CovenantScheduleEntry[] = [
  { id: "cs-001", covenantId: "cov-001", covenantName: "Debt Service Coverage Ratio", period: "Q1 2026", status: "Compliant", actualValue: 1.45, targetValue: 1.2, dueDate: "2026-05-15", daysRemaining: 36, notes: "Reviewed — strong cash flow" },
  { id: "cs-002", covenantId: "cov-002", covenantName: "Current Ratio", period: "Q1 2026", status: "Compliant", actualValue: 1.82, targetValue: 1.5, dueDate: "2026-05-15", daysRemaining: 36 },
  { id: "cs-003", covenantId: "cov-003", covenantName: "Leverage Ratio", period: "Q1 2026", status: "Pending", targetValue: 3.0, dueDate: "2026-05-15", daysRemaining: 36, notes: "Awaiting audited financials" },
  { id: "cs-004", covenantId: "cov-005", covenantName: "Minimum Tangible Net Worth", period: "Q1 2026", status: "Non-Compliant", actualValue: 1_850_000, targetValue: 2_000_000, dueDate: "2026-05-15", daysRemaining: 36, notes: "Below threshold — waiver under discussion" },
  { id: "cs-005", covenantId: "cov-001", covenantName: "Debt Service Coverage Ratio", period: "Q2 2026", status: "Pending", targetValue: 1.2, dueDate: "2026-08-15", daysRemaining: 128 },
  { id: "cs-006", covenantId: "cov-004", covenantName: "Annual Financial Statements", period: "FYE 2025", status: "Overdue", targetValue: 1, dueDate: "2026-04-01", daysRemaining: -8, notes: "Auditor delayed — extension requested" },
];

export const industryBenchmarks: IndustryBenchmark[] = [
  { metric: "Days Sales Outstanding", borrowerValue: "31 days", industryAvg: "41 days", comparison: "above" },
  { metric: "Revenue Growth (YoY)", borrowerValue: "34%", industryAvg: "8%", comparison: "above" },
  { metric: "Current Ratio", borrowerValue: "1.82x", industryAvg: "1.65x", comparison: "above" },
  { metric: "Debt-to-EBITDA", borrowerValue: "2.4x", industryAvg: "2.8x", comparison: "above" },
  { metric: "Operating Margin", borrowerValue: "12.1%", industryAvg: "9.4%", comparison: "above" },
];

export const realEstateAssets: RealEstateAsset[] = [
  {
    address: "4500 Industrial Blvd, Cleveland, OH 44135",
    parcelId: "CUY-44135-0891",
    estimatedValue: 3_200_000,
    lastAppraisalDate: "2025-08-15",
    lastAppraisalValue: 3_050_000,
    valueTrend: "appreciation",
    lienPosition: "1st",
    ltv: 62,
  },
  {
    address: "1200 Warehouse Dr, Akron, OH 44301",
    parcelId: "SUM-44301-1204",
    estimatedValue: 1_800_000,
    lastAppraisalDate: "2025-06-01",
    lastAppraisalValue: 1_750_000,
    valueTrend: "stable",
    lienPosition: "1st",
    ltv: 71,
  },
];

export const sosFiling: SOSFiling = {
  entityName: "Apex Manufacturing Corp",
  entityStatus: "Active",
  registeredAgent: "CT Corporation System",
  annualReportStatus: "Filed",
  annualReportDueDate: "2026-07-01",
  recentChanges: ["Registered agent updated (2025-09-12)", "Annual report filed (2025-07-15)"],
};

export const riskEntries: RiskEntry[] = [
  {
    id: "risk-001",
    borrowerId: "bor-001",
    borrowerName: "Harbor Crew Holdings",
    facilityId: "TX-9928-BA",
    riskScore: 94,
    recommendedAction: "Restructure",
    actionDescription:
      "The system flags a projected Debt Service Coverage Ratio (DSCR) drop below 1.15x for the next quarter. Fuel costs have risen 10%, but Harbor Crew's shipping surcharges haven't been updated in 90 days.",
    warningType: "Credit & Structural Risk",
    reasoning:
      "Line utilization is near-maxed at 98% ($2.45M of $2.5M) with $620K drawn without PO coverage. SOFR forward curve crosses operational cash flow in August 2026.",
    nextStep: {
      title: "Restructuring Proposal",
      description:
        "Extend the maturity by 24 months and re-amortize the principal to a step-up structure (lower payments now, higher later).",
    },
  },
  {
    id: "risk-002",
    borrowerId: "bor-002",
    borrowerName: "Greenfield Logistics LLC",
    facilityId: "FAC-2024-002",
    riskScore: 68,
    recommendedAction: "Restructure",
    actionDescription:
      "Restructure 18-month '10 Period' in exchange for a 'Cross-Collateralization' on the borrower's other asset.",
    warningType: "Credit & Structural Risk",
    reasoning: "Current income cannot support a 1.25x DSCR.",
    nextStep: {
      title: "Cross-Collateralization Restructure",
      description:
        "Offer an 18-month extension in exchange for a cross-collateralization pledge on the borrower's secondary asset.",
    },
  },
  {
    id: "risk-003",
    borrowerId: "bor-003",
    borrowerName: "Pacific Coast Distributors",
    facilityId: "FAC-2024-003",
    riskScore: 45,
    recommendedAction: "Recapitalize",
    actionDescription:
      "Recapitalize a 15% Principal Paydown requirement before the next extension is granted.",
    warningType: "Asset & Market Risk",
    reasoning:
      "Based on current 6.5% market cap rates, the asset is valued at $18M—down from the $22M 'As-Stabilized' appraisal",
    nextStep: {
      title: "Principal Paydown Proposal",
      description:
        "Require a 15% principal paydown before granting the next extension to realign LTV with the updated appraisal.",
    },
  },
  {
    id: "risk-004",
    borrowerId: "bor-004",
    borrowerName: "Summit Healthcare Group",
    facilityId: "FAC-2024-004",
    riskScore: 91,
    recommendedAction: "Sell",
    actionDescription:
      "Market-to-Market sale of this note to a secondary buyer at a 10% discount.",
    warningType: "Asset & Market Risk",
    reasoning:
      "The anchor tenant has left and the sub-market is in a permanent decline",
    nextStep: {
      title: "Secondary Market Sale",
      description:
        "Package the note for a mark-to-market sale to a secondary buyer at a 10% discount to exit before further sub-market decline.",
    },
  },
  {
    id: "risk-005",
    borrowerId: "bor-005",
    borrowerName: "Riverstone Construction",
    facilityId: "FAC-2024-005",
    riskScore: 76,
    recommendedAction: "Mitigate",
    actionDescription:
      "Trigger an environmental audit (at the borrower's expense), as permitted by the right to inspect clause.",
    warningType: "Operational & Compliance Risk",
    reasoning:
      "A municipal violation (file #ENV-992) was issued to the property for 'Unsecured Chemical Storage.' This violates Section 8.2 of the Loan Agreement.",
    nextStep: {
      title: "Environmental Audit Trigger",
      description:
        "Invoke the right-to-inspect clause and trigger a borrower-funded environmental audit to resolve the Section 8.2 violation.",
    },
  },
];

export const loanEvaluations: LoanEvaluation[] = [
  {
    id: "loan-001",
    borrowerName: "Vanguard Logistics",
    loanAmount: 4_500_000,
    loanType: "CRE Refinance",
    status: "In Analysis",
    analysis: "Likely approved",
    action: "Create Credit Memo",
    submissionDate: "2026-03-15",
    assignedOfficer: "Sarah Martinez",
    confidenceScore: 94,
  },
  {
    id: "loan-002",
    borrowerName: "Meridian Properties",
    loanAmount: 8_200_000,
    loanType: "CRE Refinance",
    status: "In Analysis",
    analysis: "Review needed",
    action: "Create Restructuring",
    submissionDate: "2026-03-12",
    assignedOfficer: "James Chen",
    confidenceScore: 72,
  },
  {
    id: "loan-003",
    borrowerName: "Atlas Industrial Group",
    loanAmount: 3_750_000,
    loanType: "Term Loan",
    status: "Under Review",
    analysis: "Likely declined",
    action: "Create Scenario",
    submissionDate: "2026-03-10",
    assignedOfficer: "Michael Rodriguez",
    confidenceScore: 38,
  },
  {
    id: "loan-004",
    borrowerName: "Pacific Rim Trading Co",
    loanAmount: 5_100_000,
    loanType: "CRE Refinance",
    status: "In Analysis",
    analysis: "Likely approved",
    action: "Create Credit Memo",
    submissionDate: "2026-03-08",
    assignedOfficer: "Sarah Martinez",
    confidenceScore: 88,
  },
  {
    id: "loan-005",
    borrowerName: "Ironclad Construction",
    loanAmount: 12_000_000,
    loanType: "Construction",
    status: "Pending Review",
    analysis: "Likely declined",
    action: "Create Scenario",
    submissionDate: "2026-03-05",
    assignedOfficer: "James Chen",
    confidenceScore: 31,
  },
  {
    id: "loan-006",
    borrowerName: "Heartland Distributors",
    loanAmount: 2_800_000,
    loanType: "Revolving Credit",
    status: "In Analysis",
    analysis: "Review needed",
    action: "Create Restructuring",
    submissionDate: "2026-03-01",
    assignedOfficer: "Michael Rodriguez",
    confidenceScore: 65,
  },
  {
    id: "loan-007",
    borrowerName: "Summit Steel Distributors",
    loanAmount: 6_400_000,
    loanType: "Equipment Finance",
    status: "Under Review",
    analysis: "Likely declined",
    action: "Create Scenario",
    submissionDate: "2026-02-28",
    assignedOfficer: "Sarah Martinez",
    confidenceScore: 42,
  },
  {
    id: "loan-008",
    borrowerName: "Coastal Health Services",
    loanAmount: 4_200_000,
    loanType: "SBA 7(a)",
    status: "In Analysis",
    analysis: "Likely approved",
    action: "Create Credit Memo",
    submissionDate: "2026-02-25",
    assignedOfficer: "James Chen",
    confidenceScore: 91,
  },
  {
    id: "loan-009",
    borrowerName: "TechVenture Solutions",
    loanAmount: 1_900_000,
    loanType: "Term Loan",
    status: "Pending Review",
    analysis: "Likely declined",
    action: "Create Scenario",
    submissionDate: "2026-02-20",
    assignedOfficer: "Michael Rodriguez",
    confidenceScore: 27,
  },
  {
    id: "loan-010",
    borrowerName: "Prairie Agricultural Co-op",
    loanAmount: 7_500_000,
    loanType: "CRE Refinance",
    status: "In Analysis",
    analysis: "Review needed",
    action: "Create Restructuring",
    submissionDate: "2026-02-18",
    assignedOfficer: "Sarah Martinez",
    confidenceScore: 69,
  },
  {
    id: "loan-011",
    borrowerName: "Apex Manufacturing Corp",
    loanAmount: 3_300_000,
    loanType: "Equipment Finance",
    status: "In Analysis",
    analysis: "Likely approved",
    action: "Create Credit Memo",
    submissionDate: "2026-02-15",
    assignedOfficer: "James Chen",
    confidenceScore: 85,
  },
  {
    id: "loan-012",
    borrowerName: "Greenfield Logistics LLC",
    loanAmount: 5_800_000,
    loanType: "CRE Refinance",
    status: "Under Review",
    analysis: "Review needed",
    action: "Create Restructuring",
    submissionDate: "2026-02-10",
    assignedOfficer: "Michael Rodriguez",
    confidenceScore: 61,
  },
];

// ───────────────────────────────────────────────────────────────
// Chart / data-visual series used on detail pages
// ───────────────────────────────────────────────────────────────

export interface Stat {
  label: string;
  value: string;
  subLabel?: string;
}

// Loan Evaluation detail

export const performanceData = [
  { month: "Jan", series1: 320, series2: 280 },
  { month: "Feb", series1: 350, series2: 310 },
  { month: "Mar", series1: 380, series2: 290 },
  { month: "Apr", series1: 420, series2: 340 },
  { month: "May", series1: 390, series2: 360 },
  { month: "Jun", series1: 450, series2: 380 },
  { month: "Jul", series1: 470, series2: 400 },
  { month: "Aug", series1: 440, series2: 420 },
  { month: "Sep", series1: 500, series2: 390 },
  { month: "Oct", series1: 520, series2: 430 },
  { month: "Nov", series1: 490, series2: 450 },
  { month: "Dec", series1: 540, series2: 460 },
];

export const erpData = [
  { month: "Jan", revenue: 980, ebitda: 220 },
  { month: "Feb", revenue: 1020, ebitda: 235 },
  { month: "Mar", revenue: 1050, ebitda: 240 },
  { month: "Apr", revenue: 1100, ebitda: 260 },
  { month: "May", revenue: 1080, ebitda: 250 },
  { month: "Jun", revenue: 1150, ebitda: 275 },
  { month: "Jul", revenue: 1180, ebitda: 280 },
  { month: "Aug", revenue: 1130, ebitda: 265 },
  { month: "Sep", revenue: 1200, ebitda: 290 },
  { month: "Oct", revenue: 1250, ebitda: 300 },
  { month: "Nov", revenue: 1220, ebitda: 295 },
  { month: "Dec", revenue: 1300, ebitda: 310 },
];

export const experianScore = 84;
export const ficoScore = 1125;

export const performanceStats: Stat[] = [
  { label: "Avg Deposit Balances", value: "$412,500" },
  { label: "Overdraft History", value: "0" },
  { label: "Cash Flow Volatility", value: "Low" },
];

export const erpStats: Stat[] = [
  { label: "Total Revenue", value: "$12,450,000" },
  { label: "EBITDA", value: "$2,290,000" },
  { label: "Gross Margin", value: "42.5%" },
  { label: "Net Income", value: "$1,850,000" },
];

export const experianStats: Stat[] = [
  { label: "Liens/Judgments", value: "0" },
  { label: "Bankruptcies", value: "0" },
  { label: "Late Payments (90d+)", value: "0" },
];

export const ficoStats: Stat[] = [
  { label: "Collections", value: "0" },
  { label: "Total Trade Lines", value: "12" },
  { label: "Total Trade Loans", value: "$1.2M" },
];

// Borrower detail

export const operatingBufferSeries = [
  { month: "May", balance: 820 },
  { month: "Jun", balance: 790 },
  { month: "Jul", balance: 760 },
  { month: "Aug", balance: 740 },
  { month: "Sep", balance: 715 },
  { month: "Oct", balance: 690 },
  { month: "Nov", balance: 665 },
  { month: "Dec", balance: 640 },
  { month: "Jan", balance: 615 },
  { month: "Feb", balance: 590 },
  { month: "Mar", balance: 570 },
  { month: "Apr", balance: 555 },
];

export const paymentFlowSeries = [
  { week: "W1", ach: 240, wire: 180 },
  { week: "W2", ach: 255, wire: 190 },
  { week: "W3", ach: 270, wire: 200 },
  { week: "W4", ach: 290, wire: 210 },
  { week: "W5", ach: 305, wire: 225 },
  { week: "W6", ach: 320, wire: 240 },
  { week: "W7", ach: 340, wire: 255 },
  { week: "W8", ach: 360, wire: 270 },
  { week: "W9", ach: 380, wire: 285 },
  { week: "W10", ach: 405, wire: 300 },
  { week: "W11", ach: 425, wire: 315 },
  { week: "W12", ach: 445, wire: 330 },
];

export const networkScanSeries = [
  { month: "Nov", postings: 2, joins: 1 },
  { month: "Dec", postings: 3, joins: 2 },
  { month: "Jan", postings: 5, joins: 3 },
  { month: "Feb", postings: 8, joins: 5 },
  { month: "Mar", postings: 12, joins: 8 },
  { month: "Apr", postings: 18, joins: 12 },
];

export const jobFunctionData = [
  { name: "Operations", value: 45, color: "#4bcd3e" },
  { name: "Fleet management", value: 30, color: "#16a34a" },
  { name: "Driver / Field", value: 15, color: "#15803d" },
  { name: "Finance", value: 10, color: "#166534" },
];

export const dscrSeries = [
  { month: "May", dscr: 1.32 },
  { month: "Jun", dscr: 1.35 },
  { month: "Jul", dscr: 1.38 },
  { month: "Aug", dscr: 1.36 },
  { month: "Sep", dscr: 1.4 },
  { month: "Oct", dscr: 1.42 },
  { month: "Nov", dscr: 1.41 },
  { month: "Dec", dscr: 1.44 },
  { month: "Jan", dscr: 1.43 },
  { month: "Feb", dscr: 1.45 },
  { month: "Mar", dscr: 1.42 },
  { month: "Apr", dscr: 1.42 },
];

export const servicingSeries = [
  { week: "W1", volume: 420 },
  { week: "W2", volume: 435 },
  { week: "W3", volume: 460 },
  { week: "W4", volume: 472 },
  { week: "W5", volume: 498 },
  { week: "W6", volume: 515 },
  { week: "W7", volume: 540 },
  { week: "W8", volume: 562 },
  { week: "W9", volume: 588 },
  { week: "W10", volume: 610 },
  { week: "W11", volume: 640 },
  { week: "W12", volume: 672 },
];

export const marketSeries = [
  { month: "May", value: 7.9 },
  { month: "Jun", value: 7.95 },
  { month: "Jul", value: 8.02 },
  { month: "Aug", value: 8.1 },
  { month: "Sep", value: 8.15 },
  { month: "Oct", value: 8.2 },
  { month: "Nov", value: 8.25 },
  { month: "Dec", value: 8.28 },
  { month: "Jan", value: 8.3 },
  { month: "Feb", value: 8.34 },
  { month: "Mar", value: 8.38 },
  { month: "Apr", value: 8.4 },
];

// Risk detail — DSO accelerating, utilization climbing, SOFR forward curve, industry volume

export const dsoSeries = [
  { week: "W-8", dso: 45.6 },
  { week: "W-7", dso: 46.2 },
  { week: "W-6", dso: 46.9 },
  { week: "W-5", dso: 47.8 },
  { week: "W-4", dso: 48.6 },
  { week: "W-3", dso: 49.7 },
  { week: "W-2", dso: 50.8 },
  { week: "W-1", dso: 51.6 },
  { week: "Now", dso: 52.4 },
];

export const utilizationSeries = [
  { month: "Aug", lineUtil: 82, poCoverage: 97, uncoveredDraw: 150 },
  { month: "Sep", lineUtil: 85, poCoverage: 94, uncoveredDraw: 210 },
  { month: "Oct", lineUtil: 88, poCoverage: 90, uncoveredDraw: 310 },
  { month: "Nov", lineUtil: 91, poCoverage: 86, uncoveredDraw: 410 },
  { month: "Dec", lineUtil: 93, poCoverage: 82, uncoveredDraw: 480 },
  { month: "Jan", lineUtil: 95, poCoverage: 79, uncoveredDraw: 540 },
  { month: "Feb", lineUtil: 96, poCoverage: 77, uncoveredDraw: 580 },
  { month: "Mar", lineUtil: 97, poCoverage: 75, uncoveredDraw: 605 },
  { month: "Apr", lineUtil: 98, poCoverage: 74.7, uncoveredDraw: 620 },
];

export const sofrSeries = [
  { month: "May", sofr: 4.65, opCashFlow: 5.6 },
  { month: "Jun", sofr: 4.74, opCashFlow: 5.5 },
  { month: "Jul", sofr: 4.83, opCashFlow: 5.3 },
  { month: "Aug", sofr: 4.93, opCashFlow: 5.1 },
  { month: "Sep", sofr: 5.04, opCashFlow: 4.9 },
  { month: "Oct", sofr: 5.15, opCashFlow: 4.7 },
  { month: "Nov", sofr: 5.24, opCashFlow: 4.55 },
  { month: "Dec", sofr: 5.32, opCashFlow: 4.4 },
  { month: "Jan", sofr: 5.38, opCashFlow: 4.3 },
  { month: "Feb", sofr: 5.41, opCashFlow: 4.2 },
];

export const industrySeries = [
  { month: "Nov", volume: 108 },
  { month: "Dec", volume: 104 },
  { month: "Jan", volume: 101 },
  { month: "Feb", volume: 97 },
  { month: "Mar", volume: 94 },
  { month: "Apr", volume: 91 },
];
