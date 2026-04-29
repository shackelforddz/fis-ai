"use client";

import Link from "next/link";
import { use } from "react";
import {
  ChevronRight,
  FileText,
  Info,
  MoreHorizontal,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
} from "recharts";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SectionCard } from "@/components/borrower/section-card";
import { AnimateInView } from "@/components/ui/animate-in-view";
import { cn } from "@/lib/utils";
import {
  riskEntries,
  dsoSeries,
  utilizationSeries,
  sofrSeries,
  industrySeries,
} from "@/lib/mock-data";

const RISK_RED = "#EB1F32";
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

function getScoreClass(score: number) {
  if (score >= 75) return "bg-[#EB1F32] text-white";
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
  valueTone?: "default" | "destructive" | "primary";
}

function StatRow({ items }: { items: StatItem[] }) {
  return (
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col gap-1 bg-gray-900 rounded-xl p-6"
        >
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{item.label}</span>
            <Info className="size-4 opacity-60" />
          </div>
          <span
            className={cn(
              "text-3xl font-semibold",
              item.valueTone === "primary"
                ? "text-primary"
                : "text-foreground"
            )}
          >
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

const relatedOpportunities = [
  {
    borrower: "Meridian Freight Co.",
    value: "$2,500,000",
    type: "Upsell",
    date: "2025-11-18",
  },
  {
    borrower: "Cascade Industrial Group",
    value: "$4,150,000",
    type: "Refinance",
    date: "2025-09-02",
  },
  {
    borrower: "Northline Manufacturing",
    value: "$1,850,000",
    type: "Upsell",
    date: "2025-07-24",
  },
  {
    borrower: "Harbor Point Holdings",
    value: "$3,200,000",
    type: "Restructure",
    date: "2025-05-10",
  },
  {
    borrower: "Summit Logistics Partners",
    value: "$975,000",
    type: "Upsell",
    date: "2025-03-31",
  },
];

const covenantRows: Array<{
  name: string;
  type: string;
  nextReview: string;
  status: "Compliant" | "Non-Compliant" | "Pending";
  riskSignal: string;
  impact: string;
  strategy: StrategyKey;
}> = [
  {
    name: "Debt Service Coverage Ratio",
    type: "Financial",
    nextReview: "2026-06-30",
    status: "Compliant",
    riskSignal: "Fuel Costs +10%",
    impact: "Margin & DSCR Floor",
    strategy: "Amendment",
  },
  {
    name: "Minimum Liquidity",
    type: "Financial",
    nextReview: "2026-05-15",
    status: "Compliant",
    riskSignal: "Cash burn +22%",
    impact: "Working capital runway",
    strategy: "Upsell",
  },
  {
    name: "Maximum Leverage Ratio",
    type: "Financial",
    nextReview: "2026-07-20",
    status: "Non-Compliant",
    riskSignal: "EBITDA down 9%",
    impact: "Debt/EBITDA ceiling",
    strategy: "Hedging Req",
  },
  {
    name: "Insurance Maintenance",
    type: "Non-Financial",
    nextReview: "2026-04-30",
    status: "Compliant",
    riskSignal: "Carrier renewal pending",
    impact: "Collateral protection",
    strategy: "Amendment",
  },
  {
    name: "Quarterly Financial Reporting",
    type: "Non-Financial",
    nextReview: "2026-05-31",
    status: "Pending",
    riskSignal: "Q1 filing overdue 11d",
    impact: "Monitoring visibility",
    strategy: "Amendment",
  },
];

// DSO accelerating from 45.6 → 52.4 days. +15.1% change, +3.4 days velocity
export default function BorrowerRiskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const risk = riskEntries.find((r) => r.borrowerId === id) ?? riskEntries[0];

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground">
          <Link
            href="/risks"
            className="hover:text-foreground transition-colors"
          >
            Risk Portfolio
          </Link>
          <ChevronRight className="size-4 mx-1 inline-block" />
          <span className="text-foreground">{risk.borrowerName}</span>
        </nav>

        {/* Risk Hero Card */}
        <div className="flex items-stretch gap-6">
          <div
            className={cn(
              "rounded-xl flex flex-col justify-between gap-4 w-[220px] min-h-[280px] shrink-0 p-6",
              getScoreClass(risk.riskScore)
            )}
          >
            <div className="flex items-center gap-1 text-sm">
              <span>Risk Score</span>
              <Info className="size-4 opacity-80" />
            </div>
            <h2 className="text-9xl text-white leading-none tracking-tight">
              {risk.riskScore}
            </h2>
            <div className="h-1 w-full rounded-full bg-black/20">
              <div
                className="h-full rounded-full bg-black/80"
                style={{ width: `${risk.riskScore}%` }}
              />
            </div>
          </div>
          <div className="flex-1 bg-gray-900 rounded-xl p-6 flex flex-col gap-4 min-w-0">
            <div>
              <h1 className="text-4xl text-foreground">{risk.borrowerName}</h1>
              <p className="text-sm text-muted-foreground">
                Facility ID: {risk.facilityId}
              </p>
            </div>
            <div>
              <Badge variant="outline">{risk.warningType}</Badge>
            </div>
            <p className="text-base text-foreground leading-relaxed max-w-3xl">
              {risk.actionDescription}
            </p>
          </div>
        </div>

        {/* Recommended Next Steps */}
        <div className="bg-gray-900 rounded-xl p-6 flex flex-col gap-6">
          <h2 className="text-2xl text-foreground">Recommended Next Steps</h2>
          <div className="flex gap-4 items-center">
            <FileText className="size-6 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-base text-foreground">
                {risk.nextStep.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {risk.nextStep.description}
              </p>
            </div>
            <Button
              variant="secondary"
              className="shrink-0 w-[152px]"
              render={
                <Link
                  href={`/document-creator/${risk.borrowerId}?template=restructure`}
                />
              }
            >
              Generate Document
            </Button>
          </div>
        </div>

        {/* Related successful resolutions */}
        <SectionCard
          title="Related Successful Resolutions"
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
                    {item.borrower}
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

        {/* Covenants */}
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
              {covenantRows.map((row, i) => (
                <TableRow key={`${row.strategy}-${i}`}>
                  <TableCell className="text-sm max-w-[200px] truncate">
                    {row.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.type}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.nextReview}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.riskSignal}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.impact}
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <button className="text-sm text-foreground underline underline-offset-4 hover:text-primary transition-colors" />
                        }
                      >
                        {row.strategy}
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="max-w-xs bg-gray-900 text-foreground border border-border px-3 py-2 text-left"
                        arrowClassName="bg-gray-900 fill-gray-900 border-r border-b border-border"
                      >
                        <p className="text-xs leading-relaxed">
                          <span className="font-semibold">
                            {strategyDetails[row.strategy].title}:
                          </span>{" "}
                          {strategyDetails[row.strategy].detail}
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
              ))}
            </TableBody>
          </Table>
        </SectionCard>

        {/* Liquidity Erosion */}
        <SectionCard
          title="Liquidity Erosion"
          subtitle="DSO velocity & spend rate"
        >
          <AnimateInView className="min-h-[320px] w-full mb-6 bg-gray-900 rounded-xl p-6">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={dsoSeries}>
                <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" />
                <XAxis
                  dataKey="week"
                  stroke={CHART_MUTED}
                  fontSize={12}
                  tickLine={false}
                />
                <RechartsTooltip contentStyle={tooltipStyle} />
                <ReferenceLine
                  y={45}
                  stroke={RISK_RED}
                  strokeDasharray="4 4"
                  strokeOpacity={0.7}
                  label={{
                    value: "Level 1 threshold",
                    position: "insideTopRight",
                    fill: RISK_RED,
                    fontSize: 11,
                  }}
                />
                <ReferenceLine
                  y={50}
                  stroke={RISK_RED}
                  strokeDasharray="4 4"
                  strokeOpacity={0.7}
                  label={{
                    value: "Level 2 threshold",
                    position: "insideTopRight",
                    fill: RISK_RED,
                    fontSize: 11,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="dso"
                  name="DSO (days)"
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
                label: "Current DSO",
                value: "52.4 days",
                sublabel: "Up from 45.6 days (8 wks ago)",
                valueTone: "destructive",
              },
              {
                label: "DSO change (2mo)",
                value: "+15.1%",
                sublabel: "Level 1 evidence threshold",
                valueTone: "destructive",
              },
              {
                label: "DSO velocity (mo/mo)",
                value: "+3.4 days",
                sublabel: "Accelerating each month",
                valueTone: "destructive",
              },
            ]}
          />
        </SectionCard>

        {/* Utilization Spikes */}
        <SectionCard
          title="Utilization Spikes"
          subtitle="revolving line vs. purchase order coverage"
        >
          <AnimateInView className="min-h-[320px] w-full mb-6 bg-gray-900 rounded-xl p-6">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={utilizationSeries}>
                <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  stroke={CHART_MUTED}
                  fontSize={12}
                  tickLine={false}
                />
                <RechartsTooltip contentStyle={tooltipStyle} />
                <ReferenceLine
                  y={95}
                  stroke={RISK_RED}
                  strokeDasharray="4 4"
                  strokeOpacity={0.7}
                  label={{
                    value: "95% utilization threshold",
                    position: "insideTopRight",
                    fill: RISK_RED,
                    fontSize: 11,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="lineUtil"
                  name="Line utilization (%)"
                  stroke={CHART_GREEN}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="poCoverage"
                  name="PO coverage (%)"
                  stroke={CHART_GREEN_DARK}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </AnimateInView>
          <StatRow
            items={[
              {
                label: "Current line utilization",
                value: "98%",
                sublabel: "Near-maxed — $2.45M of $2.5M",
                valueTone: "destructive",
              },
              {
                label: "Draw without PO coverage",
                value: "$620K",
                sublabel: "No linked purchase order",
                valueTone: "destructive",
              },
              {
                label: "PO coverage ratio",
                value: "74.7%",
                sublabel: "Down from 97% last quarter",
                valueTone: "destructive",
              },
            ]}
          />
        </SectionCard>

        {/* SOFR Forward Curve */}
        <SectionCard
          title="SOFR Forward Curve"
          subtitle="the exact month interest expense will outpace operational cash flow."
        >
          <AnimateInView className="min-h-[320px] w-full mb-6 bg-gray-900 rounded-xl p-6">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={sofrSeries}>
                <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  stroke={CHART_MUTED}
                  fontSize={12}
                  tickLine={false}
                />
                <RechartsTooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="sofr"
                  name="SOFR rate (%)"
                  stroke={CHART_GREEN}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="opCashFlow"
                  name="Op cash flow ($M)"
                  stroke={CHART_GREEN_DARK}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </AnimateInView>
          <StatRow
            items={[
              {
                label: "Current SOFR rate",
                value: "4.83%",
                sublabel: "+18 bps vs 90 days ago",
                valueTone: "destructive",
              },
              {
                label: "Projected SOFR (Q3 2026)",
                value: "5.41%",
                sublabel: "Forward curve implied",
                valueTone: "destructive",
              },
              {
                label: "Cash Flow Crossover",
                value: "Aug 2026",
                sublabel: "Interest outpaces op. CF",
                valueTone: "destructive",
              },
            ]}
          />
        </SectionCard>

        {/* Industry Benchmarks */}
        <SectionCard
          title="Industry Benchmarks"
          subtitle="Real-time data showing a decline in maritime shipping volumes or port efficiency scores globally"
        >
          <AnimateInView className="min-h-[320px] w-full mb-6 bg-gray-900 rounded-xl p-6">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={industrySeries}>
                <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  stroke={CHART_MUTED}
                  fontSize={12}
                  tickLine={false}
                />
                <RechartsTooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "#030712" }}
                />
                <Bar
                  dataKey="volume"
                  name="Shipping volume index"
                  fill={CHART_GREEN}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </AnimateInView>
          <StatRow
            items={[
              {
                label: "Global shipping volume (6mo)",
                value: "-8.4%",
                sublabel: "Worst decline since 2020",
                valueTone: "destructive",
              },
              {
                label: "Port efficiency (global avg)",
                value: "61/100",
                sublabel: "Down from 74 (Q1 2025)",
                valueTone: "destructive",
              },
              {
                label: "Avg vessel turnaround",
                value: "6.2 days",
                sublabel: "Up from 4.8 days (+29%)",
                valueTone: "destructive",
              },
            ]}
          />
        </SectionCard>

        {/* Simulations */}
        <SectionCard
          title="Simulations"
          subtitle="Projected outcomes with and without a restructuring of the facility."
        >
          <div className="grid grid-cols-2 gap-6">
            {/* Scenario A — status quo */}
            <div className="bg-gray-900 rounded-xl p-6 flex flex-col gap-4">
              <Badge variant="destructive" className="w-fit">
                Scenario A — status quo
              </Badge>
              <div>
                <h3 className="text-xl text-foreground">No restructuring</h3>
                <p className="text-sm text-muted-foreground">
                  Current loan terms maintained through Q3 2026
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex-1 text-foreground">
                  Covenant breach probability
                </span>
                <span className="text-[#EB1F32]">85%</span>
              </div>
              <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#EB1F32]"
                  style={{ width: "85%" }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex-1 text-foreground">Breach timing</span>
                <span className="text-[#EB1F32]">Q3 2026</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex-1 text-foreground">
                  DSCR at breach point
                </span>
                <span className="text-muted-foreground">
                  1.07× (floor: 1.25×)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex-1 text-foreground">
                  Interest expense at crossover
                </span>
                <span className="text-muted-foreground">$297K/mo</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex-1 text-foreground">
                  Projected cash shortfall
                </span>
                <span className="text-[#EB1F32]">-$15K/mo</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex-1 text-foreground">NIM impact to bank</span>
                <span className="text-[#EB1F32]">-0.8% (write-down risk)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex-1 text-foreground">Action required</span>
                <span className="text-muted-foreground">Waiver or workout</span>
              </div>
            </div>

            {/* Scenario B — proposed step-up */}
            <div className="bg-gray-900 rounded-xl p-6 flex flex-col gap-4">
              <Badge variant="secondary" className="w-fit">
                Scenario B — proposed step-up
              </Badge>
              <div>
                <h3 className="text-xl text-foreground">Restructured facility</h3>
                <p className="text-sm text-muted-foreground">
                  Rate step-up + covenant reset + advance rate adjustment
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex-1 text-foreground">
                  Covenant breach probability
                </span>
                <span className="text-primary">12%</span>
              </div>
              <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: "12%" }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex-1 text-foreground">
                  Breach timing (if occurs)
                </span>
                <span className="text-muted-foreground">
                  Q1 2027 (low probability)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex-1 text-foreground">DSCR at Q3 2026</span>
                <span className="text-primary">
                  1.34× (above 1.25× floor)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex-1 text-foreground">
                  Rate step-up applied
                </span>
                <span className="text-muted-foreground">+75 bps over SOFR</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex-1 text-foreground">
                  NIM increase to bank
                </span>
                <span className="text-primary">+4.0%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex-1 text-foreground">
                  Advance rate adjustment
                </span>
                <span className="text-muted-foreground">
                  85% → 80% on eligible AR
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex-1 text-foreground">
                  Borrower cash cushion
                </span>
                <span className="text-muted-foreground">
                  +$38K/mo post-restructure
                </span>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </TooltipProvider>
  );
}
