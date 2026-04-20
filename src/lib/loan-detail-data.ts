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

export interface Stat {
  label: string;
  value: string;
  subLabel?: string;
}

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
