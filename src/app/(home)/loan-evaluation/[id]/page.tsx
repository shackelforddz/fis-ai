"use client";

import Link from "next/link";
import { use } from "react";
import { ChevronRight, MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SectionCard } from "@/components/borrower/section-card";
import { loanEvaluations } from "@/lib/mock-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// --- Mock data for the detail page ---

const documents = [
  { name: "Draft_Credit_Memorandum_v2.pdf", lastEdit: "01/02/2026", creationDate: "01/02/2026", status: "Complete" as const },
  { name: "Acme_Tax_Returns_2023.xlsx", lastEdit: "01/02/2026", creationDate: "01/02/2026", status: "Complete" as const },
  { name: "Environmental_Assessment_Phase1.pdf", lastEdit: "01/02/2026", creationDate: "01/02/2026", status: "Draft" as const },
];

const scenarios = [
  { name: "Baseline Analysis", lastEdit: "01/02/2026", creationDate: "01/02/2026", status: "Complete" as const },
  { name: "Sensitivity Test: +200bps Hike", lastEdit: "01/02/2026", creationDate: "01/02/2026", status: "Complete" as const },
  { name: "Extension: 180 MO Amortization", lastEdit: "01/02/2026", creationDate: "01/02/2026", status: "Draft" as const },
];

const performanceData = [
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

const erpData = [
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

const experianScore = 84;
const ficoScore = 1125;

function DonutChart({ score, max, label }: { score: number; max: number; label: string }) {
  const percentage = (score / max) * 100;
  const data = [
    { name: "Score", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];
  return (
    <div className="flex flex-col items-center gap-2">
      <h4 className="text-lg text-foreground self-start">{label}</h4>
      <div className="relative w-full aspect-square max-w-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="85%"
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              <Cell fill="#4bcd3e" />
              <Cell fill="rgba(255,255,255,0.1)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl text-foreground font-bold">{score}</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, subLabel }: { label: string; value: string; subLabel?: string }) {
  return (
    <div className="bg-secondary rounded-xl p-4 flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-2xl text-foreground">{value}</span>
      {subLabel && <span className="text-xs text-muted-foreground">{subLabel}</span>}
    </div>
  );
}

function StatRow({ items }: { items: { label: string; value: string; subLabel?: string }[] }) {
  return (
    <div className="flex gap-4">
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: "Complete" | "Draft" }) {
  return <Badge variant="secondary">{status}</Badge>;
}

export default function LoanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const loan = loanEvaluations.find((l) => l.id === id) ?? loanEvaluations[0];

  const loanAmountFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(loan.loanAmount);

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <Link href="/loan-evaluation" className="hover:text-foreground transition-colors">
          Loan Evaluation Center
        </Link>
        <ChevronRight className="size-4 mx-1 inline-block" />
        <span className="text-foreground">{loan.borrowerName}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl text-foreground">{loan.borrowerName}</h1>
          <p className="text-lg text-muted-foreground">
            {loanAmountFormatted} {loan.loanType === "CRE Refinance" ? "Commercial Real Estate" : loan.loanType} Loan
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>Approve</Button>
        </div>
      </div>

      {/* AI Executive Reasoning */}
      <div className="bg-gray-900 rounded-xl p-6 flex flex-col gap-5">
        <h2 className="text-2xl text-foreground">AI Executive Reasoning</h2>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-foreground leading-relaxed">
            Analysis of {loan.borrowerName}&apos;s recent capital expenditure reveals a strong shift toward
            operational efficiency improvements. ERP data sync indicates a 22% reduction in overhead
            since Q3. However, Bureau Data shows a localized saturation risk in the heavy
            manufacturing sector for the target region.
          </p>
          <p className="text-xs text-muted-foreground">Recommend creating a Credit Memo</p>
        </div>
        <div>
          <Badge className="bg-primary text-primary-foreground">New</Badge>
        </div>
        <div className="border-t border-border" />
        <div className="flex gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Confidence Score</span>
            <span className="text-2xl text-foreground">94.2%</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Risk Appetite Match</span>
            <span className="text-2xl text-foreground">High</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Automated Recommendation</span>
            <span className="text-2xl text-foreground">Approve</span>
          </div>
        </div>
      </div>

      {/* Document Repository */}
      <div className="border border-border rounded-xl p-6 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl text-foreground">Document Repository</h2>
            <p className="text-xs text-muted-foreground">Real-time Indicators</p>
          </div>
          <Button variant="outline">New Document</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Last Edit</TableHead>
              <TableHead>Creation Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.name}>
                <TableCell className="text-sm">{doc.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{doc.lastEdit}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{doc.creationDate}</TableCell>
                <TableCell>
                  <StatusBadge status={doc.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon-xs">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Scenario Analysis */}
      <div className="border border-border rounded-xl p-6 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl text-foreground">Scenario Analysis</h2>
            <p className="text-xs text-muted-foreground">Real-time Indicators</p>
          </div>
          <Button variant="outline">New Analysis</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Last Edit</TableHead>
              <TableHead>Creation Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenarios.map((s) => (
              <TableRow key={s.name}>
                <TableCell className="text-sm">{s.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.lastEdit}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.creationDate}</TableCell>
                <TableCell>
                  <StatusBadge status={s.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon-xs">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Performance Analysis */}
      <SectionCard title="Performance Analysis" subtitle="Real-time Indicators">
        <div className="h-[300px] w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="series1" stroke="#4bcd3e" strokeWidth={2} dot={false} name="Series 1" />
              <Line type="monotone" dataKey="series2" stroke="#9ca3af" strokeWidth={2} dot={false} name="Series 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <StatRow items={[
          { label: "Avg Deposit Balances", value: "$412,500" },
          { label: "Overdraft History", value: "0" },
          { label: "Cash Flow Volatility", value: "Low" },
        ]} />
      </SectionCard>

      {/* ERP Data */}
      <SectionCard title="ERP Data" subtitle="Real-time Indicators">
        <div className="h-[300px] w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={erpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#4bcd3e" strokeWidth={2} dot={false} name="Revenue" />
              <Line type="monotone" dataKey="ebitda" stroke="#9ca3af" strokeWidth={2} dot={false} name="EBITDA" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <StatRow items={[
          { label: "Total Revenue", value: "$12,450,000" },
          { label: "EBITDA", value: "$2,290,000" },
          { label: "Gross Margin", value: "42.5%" },
          { label: "Net Income", value: "$1,850,000" },
        ]} />
      </SectionCard>

      {/* Credit Bureau Data */}
      <SectionCard title="Credit Bureau Data" subtitle="Real-time Indicators">
        <div className="grid grid-cols-2 gap-8 mb-6">
          <DonutChart score={experianScore} max={100} label="Experian Business" />
          <DonutChart score={ficoScore} max={1500} label="Personal Guarantor (FICO)" />
        </div>
        <div className="flex gap-4 flex-wrap">
          <StatCard label="Liens/Judgments" value="0" />
          <StatCard label="Bankruptcies" value="0" />
          <StatCard label="Late Payments (90d+)" value="0" />
          <StatCard label="Collections" value="0" />
          <StatCard label="Total Trade Lines" value="12" />
        </div>
      </SectionCard>

      {/* Risk Acceptance Filters */}
      <SectionCard title="Risk Acceptance Filters" subtitle="Real-time Indicators">
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Headcount Expansion</span>
            <span className="text-2xl text-foreground">+12.4%</span>
            <span className="text-xs text-muted-foreground">On-Time</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Capex Authorization</span>
            <span className="text-2xl text-foreground">$2.1M</span>
            <span className="text-xs text-muted-foreground">Stable</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Supplier Payment Volume</span>
            <span className="text-2xl text-foreground">+8.2%</span>
            <span className="text-xs text-muted-foreground">Optimal</span>
          </div>
        </div>
      </SectionCard>

      {/* Shadow UW Engine */}
      <SectionCard title="Shadow UW Engine" subtitle="Health & Operational Metrics">
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Payment Behavior</span>
            <span className="text-2xl text-foreground">+12.4%</span>
            <span className="text-xs text-muted-foreground">On-Time</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Utilization Trend</span>
            <span className="text-2xl text-foreground">$2.1M</span>
            <span className="text-xs text-muted-foreground">Stable</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Supplier Payment Volume</span>
            <span className="text-2xl text-foreground">+8.2%</span>
            <span className="text-xs text-muted-foreground">Optimal</span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
