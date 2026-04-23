"use client";

import Link from "next/link";
import { use } from "react";
import {
  ChevronRight,
  FileText,
  Info,
  MoreHorizontal,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SectionCard } from "@/components/borrower/section-card";
import { AnimateInView } from "@/components/ui/animate-in-view";
import { cn } from "@/lib/utils";
import { borrowers, covenants } from "@/lib/mock-data";

const CHART_GREEN = "#4bcd3e";
const CHART_GREEN_DARK = "#2f9d24";
const CHART_MUTED = "#9ca3af";
const CHART_GRID = "rgba(255,255,255,0.1)";

const tooltipStyle = {
  backgroundColor: "#111827",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "8px",
  color: "#f9fafb",
};

function formatShortCurrency(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}k`;
  return `$${value}`;
}

function getScoreClass(score: number) {
  if (score >= 85) return "bg-primary text-primary-foreground";
  return "bg-secondary text-foreground";
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Compliant") return <Badge variant="secondary">{status}</Badge>;
  if (status === "Non-Compliant") return <Badge variant="destructive">{status}</Badge>;
  if (status === "Pending") return <Badge variant="outline">{status}</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

interface StatItem {
  label: string;
  value: string;
  sublabel?: string;
  trend?: "up" | "down";
}

function StatRow({ items }: { items: StatItem[] }) {
  return (
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1 bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{item.label}</span>
            {item.trend === "up" && <TrendingUp className="size-4" />}
            {item.trend === "down" && <TrendingDown className="size-4" />}
            {!item.trend && <Info className="size-4 opacity-60" />}
          </div>
          <span className="text-3xl text-foreground font-semibold">
            {item.value}
          </span>
          {item.sublabel && (
            <span className="text-sm text-muted-foreground">{item.sublabel}</span>
          )}
        </div>
      ))}
    </div>
  );
}

const relatedOpportunities = [
  { value: "$2,500,000", type: "Upsell", date: "2026-06-30" },
  { value: "$99.99", type: "Upsell", date: "2026-06-30" },
  { value: "$199.99", type: "Upsell", date: "2026-06-30" },
  { value: "$79.99", type: "Upsell", date: "2026-06-30" },
  { value: "$399.99", type: "Upsell", date: "2026-06-30" },
];

const strategyDetails = {
  Amendment: {
    title: "Covenant Waiver/Amendment",
    detail:
      "Offer a temporary 1-quarter waiver on DSCR in exchange for an immediate fuel surcharge update.",
  },
  Upsell: {
    title: "Upsell Opportunity",
    detail:
      'Propose a Capex loan for fleet efficiency upgrades, using the "utilization spike" data as justification for the investment.',
  },
  "Hedging Req": {
    title: "Hedging Requirement",
    detail:
      "Require Harbor Crew to enter into an Interest Rate Swap (based on the Forward Curves) to stabilize debt costs.",
  },
} as const;

type StrategyKey = keyof typeof strategyDetails;

const covenantRowExtras: Array<{
  riskSignal: string;
  impact: string;
  strategy: StrategyKey;
}> = [
  { riskSignal: "Fuel Costs", impact: "Margin & DSCR", strategy: "Amendment" },
  { riskSignal: "Fuel Costs", impact: "Margin & DSCR", strategy: "Upsell" },
  { riskSignal: "Fuel Costs", impact: "Margin & DSCR", strategy: "Hedging Req" },
  { riskSignal: "Fuel Costs", impact: "Margin & DSCR", strategy: "Amendment" },
  { riskSignal: "Fuel Costs", impact: "Margin & DSCR", strategy: "Amendment" },
];

const operatingBufferSeries = [
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

const paymentFlowSeries = [
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

const networkScanSeries = [
  { month: "Nov", postings: 2, joins: 1 },
  { month: "Dec", postings: 3, joins: 2 },
  { month: "Jan", postings: 5, joins: 3 },
  { month: "Feb", postings: 8, joins: 5 },
  { month: "Mar", postings: 12, joins: 8 },
  { month: "Apr", postings: 18, joins: 12 },
];

const jobFunctionData = [
  { name: "Operations", value: 45, color: CHART_GREEN },
  { name: "Fleet management", value: 30, color: "#16a34a" },
  { name: "Driver / Field", value: 15, color: "#15803d" },
  { name: "Finance", value: 10, color: "#166534" },
];

const dscrSeries = [
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

const servicingSeries = [
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

const marketSeries = [
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

export default function BorrowerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const borrower = borrowers.find((b) => b.id === id) ?? borrowers[0];

  const expansionLabel = formatShortCurrency(borrower.creditLineExpansion);

  const opportunityBadge = borrower.opportunityTypes.includes("Upsell Candidate")
    ? "Upsell"
    : "Restructure";

  return (
    <TooltipProvider>
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <Link
          href="/opportunities"
          className="hover:text-foreground transition-colors"
        >
          Opportunity Portfolio
        </Link>
        <ChevronRight className="size-4 mx-1 inline-block" />
        <span className="text-foreground">{borrower.name}</span>
      </nav>

      {/* 1. Borrower Hero Card */}
      <div className="flex items-stretch gap-6">
        <div
          className={cn(
            "rounded-xl flex flex-col justify-between gap-4 w-[220px] min-h-[280px] shrink-0 p-6",
            getScoreClass(borrower.opportunityScore)
          )}
        >
          <div className="flex items-center gap-1 text-sm">
            <span>Opportunity Score</span>
            <Info className="size-4 opacity-80" />
          </div>
          <h2 className="text-9xl text-white leading-none tracking-tight">
            {borrower.opportunityScore}
          </h2>
          <div className="h-1 w-full rounded-full bg-black/20">
            <div
              className="h-full rounded-full bg-black/80"
              style={{ width: `${borrower.opportunityScore}%` }}
            />
          </div>
        </div>
        <div className="flex-1 bg-gray-900 rounded-xl p-6 flex flex-col gap-4 min-w-0">
          <div>
            <h1 className="text-4xl text-foreground">{borrower.name}</h1>
            <p className="text-sm text-muted-foreground">
              Facility ID: {borrower.facilityId}
            </p>
          </div>
          <div>
            <Badge variant="secondary">{opportunityBadge}</Badge>
          </div>
          <p className="text-lg text-foreground leading-relaxed max-w-3xl">
            {borrower.summary}
          </p>
        </div>
      </div>

      {/* 2. Recommended Next Steps */}
      <div className="bg-gray-900 rounded-xl p-6 flex flex-col gap-6">
        <h2 className="text-2xl text-foreground">Recommended Next Steps</h2>
        <div className="flex flex-col">
          {borrower.nextSteps.map((step, i) => (
            <div key={step.title}>
              {i > 0 && <Separator className="my-6" />}
              <div className="flex gap-4 items-center">
                <FileText className="size-6 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="shrink-0 w-[152px]"
                  render={
                    <Link
                      href={`/document-creator/${borrower.id}?template=credit-memo`}
                    />
                  }
                >
                  Generate Document
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Related successful opportunities */}
      <SectionCard
        title="Related successful opportunities"
        subtitle="Real-time Indicators"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Borrower</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relatedOpportunities.map((item, i) => (
              <TableRow key={`${item.value}-${i}`}>
                <TableCell className="text-sm max-w-[180px] truncate">
                  {borrower.name}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {item.value}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {item.type}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {item.date}
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
      </SectionCard>

      {/* 4. Covenants */}
      <SectionCard title="Covenants" subtitle="Real-time Indicators">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Next Review</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk Signal</TableHead>
              <TableHead>Impact</TableHead>
              <TableHead>Strategy</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {covenants.slice(0, 5).map((cov, i) => {
              const extras = covenantRowExtras[i] ?? covenantRowExtras[0];
              return (
                <TableRow key={cov.id}>
                  <TableCell className="text-sm max-w-[140px] truncate">
                    {cov.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {cov.type}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    2026-06-30
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={cov.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[120px] truncate">
                    {extras.riskSignal}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[120px] truncate">
                    {extras.impact}
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <button className="text-sm text-foreground underline underline-offset-4 hover:text-primary transition-colors" />
                        }
                      >
                        {extras.strategy}
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="max-w-xs bg-gray-900 text-foreground border border-border px-3 py-2 text-left"
                        arrowClassName="bg-gray-900 fill-gray-900 border-r border-b border-border"
                      >
                        <p className="text-xs leading-relaxed">
                          <span className="font-semibold">
                            {strategyDetails[extras.strategy].title}:
                          </span>{" "}
                          {strategyDetails[extras.strategy].detail}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-xs">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </SectionCard>

      {/* 5. Operating Account Buffers */}
      <SectionCard
        title="Operating Account Buffers"
        subtitle={`While revenue is up ${borrower.wowGrowthPct}%, the system sees that their Daily Ending Balance is trending lower.`}
      >
        <AnimateInView className="h-[400px] w-full mb-6 bg-gray-900 rounded-xl p-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={operatingBufferSeries}>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke={CHART_MUTED} fontSize={12} tickLine={false} />
              <RechartsTooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: "#ffffff", fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="balance"
                name="Daily ending balance ($k)"
                stroke={CHART_GREEN}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </AnimateInView>
        <StatRow
          items={[
            {
              label: "Revenue growth (YoY)",
              value: `+${borrower.wowGrowthPct}%`,
              sublabel: "Sustained above industry avg",
              trend: "up",
            },
            {
              label: "Balance change",
              value: "-32.3%",
              sublabel: "$820k → $555k (12-mo)",
              trend: "down",
            },
            {
              label: "Cash burn rate",
              value: "-$22k/mo",
              sublabel: "Accelerating vs prior 6-mo",
              trend: "down",
            },
          ]}
        />
      </SectionCard>

      {/* 6. Payment Flow Analysis */}
      <SectionCard
        title="Payment Flow Analysis"
        subtitle="The system monitors incoming ACH and wire volumes. It detected a sustained 'step-up' in transaction count, not just a one-time large payment."
      >
        <AnimateInView className="h-[400px] w-full mb-6 bg-gray-900 rounded-xl p-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paymentFlowSeries}>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" />
              <XAxis dataKey="week" stroke={CHART_MUTED} fontSize={12} tickLine={false} />
              <RechartsTooltip contentStyle={tooltipStyle} cursor={{ fill: "#030712" }} />
              <Legend wrapperStyle={{ color: "#ffffff", fontSize: 12 }} />
              <Bar dataKey="ach" name="ACH ($k)" fill={CHART_GREEN} radius={[4, 4, 0, 0]} />
              <Bar dataKey="wire" name="Wire ($k)" fill={CHART_GREEN_DARK} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnimateInView>
        <StatRow
          items={[
            { label: "6-mo ACH volume", value: "$8.44M", sublabel: "vs $6.1M prior 6-mo", trend: "up" },
            { label: "6-mo wire volume", value: "$3.92M", sublabel: "vs $2.8M prior 6-mo", trend: "up" },
            {
              label: "Avg weekly step-up",
              value: `+${borrower.wowGrowthPct}%`,
              sublabel: "ACH + wire combined",
              trend: "up",
            },
          ]}
        />
      </SectionCard>

      {/* 7. Professional Network Scanning */}
      <SectionCard
        title="Professional Network Scanning"
        subtitle={`Automated scrapers (like LinkedIn or Indeed) detected 18 new job postings and 12 new employee "joins" in the last 45 days.`}
      >
        <AnimateInView className="h-[400px] w-full mb-6 bg-gray-900 rounded-xl p-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={networkScanSeries}>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke={CHART_MUTED} fontSize={12} tickLine={false} />
              <RechartsTooltip contentStyle={tooltipStyle} cursor={{ fill: "#030712" }} />
              <Legend wrapperStyle={{ color: "#ffffff", fontSize: 12 }} />
              <Bar dataKey="postings" name="Job postings" fill={CHART_GREEN} radius={[4, 4, 0, 0]} />
              <Bar dataKey="joins" name="New joins" fill={CHART_GREEN_DARK} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnimateInView>
        <StatRow
          items={[
            { label: "New job postings", value: "18", sublabel: "Up from 3 (6 mo ago)", trend: "up" },
            { label: "New employee joins", value: "12", sublabel: "Up from 3 (6 mo ago)", trend: "up" },
            {
              label: "Headcount expansion",
              value: `+${borrower.headcountGrowthPct}%`,
              sublabel: "45-day rolling window",
              trend: "up",
            },
          ]}
        />
      </SectionCard>

      {/* 8. Job Function Breakdown */}
      <SectionCard
        title="Job Function Breakdown"
        subtitle="Most new hires are in Operations and Fleet Management."
      >
        <AnimateInView className="h-[320px] w-full mb-6 bg-gray-900 rounded-xl p-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={jobFunctionData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                dataKey="value"
                stroke="none"
              >
                {jobFunctionData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </AnimateInView>
        <StatRow
          items={[
            { label: "Operations", value: "45%", sublabel: "8 new hires" },
            { label: "Fleet management", value: "30%", sublabel: "5 new hires" },
            { label: "Driver / Field", value: "15%", sublabel: "3 new hires" },
            { label: "Finance", value: "10%", sublabel: "2 new hires" },
          ]}
        />
      </SectionCard>

      {/* 9. DSCR */}
      <SectionCard
        title="Debt service coverage ratio (DSCR)"
        subtitle={`The latest P&L — trailing 12 months for ${borrower.name}`}
      >
        <AnimateInView className="h-[400px] w-full mb-6 bg-gray-900 rounded-xl p-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dscrSeries}>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke={CHART_MUTED} fontSize={12} tickLine={false} />
              <RechartsTooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: "#ffffff", fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="dscr"
                name="DSCR"
                stroke={CHART_GREEN}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </AnimateInView>
        <StatRow
          items={[
            { label: "DSCR", value: "1.42x", sublabel: "Min covenant: 1.20x", trend: "up" },
            { label: "EBITDA (trailing 12M)", value: "$2.8M", sublabel: "+18% YoY", trend: "up" },
            {
              label: "Total debt service",
              value: "$2.0M",
              sublabel: `Includes new ${expansionLabel} line`,
              trend: "up",
            },
          ]}
        />
      </SectionCard>

      {/* 10. Servicing Signals */}
      <SectionCard
        title="Servicing Signals"
        subtitle="Health & Operational Metrics"
      >
        <AnimateInView className="h-[400px] w-full mb-6 bg-gray-900 rounded-xl p-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={servicingSeries}>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" />
              <XAxis dataKey="week" stroke={CHART_MUTED} fontSize={12} tickLine={false} />
              <RechartsTooltip contentStyle={tooltipStyle} cursor={{ fill: "#030712" }} />
              <Legend wrapperStyle={{ color: "#ffffff", fontSize: 12 }} />
              <Bar
                dataKey="volume"
                name="Servicing volume ($k)"
                fill={CHART_GREEN}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </AnimateInView>
        <StatRow
          items={[
            { label: "On-time payment rate", value: "97.2%", sublabel: "+1.8 pts YoY", trend: "up" },
            { label: "Avg utilization (12mo)", value: "84%", sublabel: "Healthy range", trend: "up" },
            {
              label: "Supplier Payment Volume",
              value: `+${borrower.wowGrowthPct}%`,
              sublabel: "WoW growth (12-wk)",
              trend: "up",
            },
          ]}
        />
      </SectionCard>

      {/* 11. Market Data */}
      <SectionCard
        title="Market Data"
        subtitle="Health & Operational Metrics"
      >
        <AnimateInView className="h-[400px] w-full mb-6 bg-gray-900 rounded-xl p-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marketSeries}>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke={CHART_MUTED} fontSize={12} tickLine={false} />
              <RechartsTooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: "#ffffff", fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="value"
                name="Real estate value ($M)"
                stroke={CHART_GREEN}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </AnimateInView>
        <StatRow
          items={[
            {
              label: "Real Estate Collateral",
              value: "$8.4M",
              sublabel: "+6.2% since origination",
              trend: "up",
            },
            { label: "Properties on file", value: "2", sublabel: "Both 1st lien position" },
            { label: "SOS Status", value: "Good Standing", sublabel: "Last checked: 48h ago" },
          ]}
        />
      </SectionCard>
    </div>
    </TooltipProvider>
  );
}
