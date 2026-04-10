"use client";

import Link from "next/link";
import { use } from "react";
import { ChevronDown, ChevronRight, MoreHorizontal, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
import { SectionCard } from "@/components/borrower/section-card";
import { StatCardsRow } from "@/components/borrower/stat-cards-row";
import type { StatCard } from "@/components/borrower/stat-cards-row";
import { InsightBox } from "@/components/borrower/insight-box";
import { cn } from "@/lib/utils";
import {
  borrowers,
  covenants,
  dsoHistory,
  publicRecords,
  transactions,
} from "@/lib/mock-data";

function getScoreColor(score: number) {
  if (score >= 75) return "bg-primary";
  return "bg-secondary";
}

function getScoreLabelColor(score: number) {
  if (score >= 75) return "text-primary-foreground";
  return "text-foreground";
}

// --- Mock data for the related-opportunities table ---
const relatedOpportunities = [
  {
    name: "Equipment Line Expansion",
    type: "Upsell",
    tracking: "Automatic",
    nextReview: "2026-06-15",
    status: "Compliant" as const,
  },
  {
    name: "Working Capital Increase",
    type: "Upsell",
    tracking: "Manual",
    nextReview: "2026-05-30",
    status: "Compliant" as const,
  },
  {
    name: "Term Loan Restructure",
    type: "Restructure",
    tracking: "Automatic",
    nextReview: "2026-07-01",
    status: "Non-Compliant" as const,
  },
  {
    name: "AR Facility Renewal",
    type: "Renewal",
    tracking: "Manual",
    nextReview: "2026-08-15",
    status: "Compliant" as const,
  },
];

// --- Stat card data ---
const growthStatCards: StatCard[] = [
  { label: "Headcount Expansion", value: "$5,329", status: "On-Time" },
  { label: "Capex Authorization", value: "$2.1M", status: "Stable" },
  { label: "Supplier Payment Volume", value: "+8.2%", status: "Optimal" },
];

const servicingStatCards: StatCard[] = [
  { label: "Payment Behavior", value: "+12.4%", status: "On-Time" },
  { label: "Utilization Trend", value: "$2.1M", status: "Stable" },
  { label: "Supplier Payment Volume", value: "+8.2%", status: "Optimal" },
];

const peopleStatCards: StatCard[] = [
  { label: "Key Personnel Changes", value: "0", status: "Stable" },
  { label: "Guarantor Coverage", value: "2 of 5", status: "Adequate" },
  { label: "Management Tenure", value: "12 yrs", status: "Strong" },
];

const marketStatCards: StatCard[] = [
  {
    label: "Real Estate Collateral",
    value: "HQ Value: $8.4M",
    status: "+3.2% vs Appraised Value",
  },
  {
    label: "SOS Status",
    value: "Good Standing",
    status: "Last checked: 48h ago",
  },
  { label: "Supplier Payment Volume", value: "$5,329", status: "Optimal" },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "Compliant") {
    return <Badge variant="secondary">{status}</Badge>;
  }
  if (status === "Non-Compliant") {
    return <Badge variant="destructive">{status}</Badge>;
  }
  if (status === "Pending") {
    return <Badge variant="outline">{status}</Badge>;
  }
  return <Badge variant="outline">{status}</Badge>;
}

export default function BorrowerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const borrower =
    borrowers.find((b) => b.id === id) ?? borrowers[0];
  const scoreColor = getScoreColor(borrower.opportunityScore);
  const labelColor = getScoreLabelColor(borrower.opportunityScore);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <Link href="/opportunities" className="hover:text-foreground transition-colors">
          Opportunity Portfolio
        </Link>
        <ChevronRight className="size-4 mx-1 inline-block" />
        <span className="text-foreground">{borrower.name}</span>
      </nav>

      {/* 2. Borrower Hero Card */}
      <div className="bg-card rounded-xl p-6 flex gap-6 items-start">
        {/* Score Sidebar */}
        <div
          className={cn(
            "flex flex-col items-center justify-between h-full min-w-[240px] p-6 rounded-xl shrink-0",
            scoreColor
          )}
        >
          <span className={cn("text-xs", labelColor)}>Opportunity Score</span>
          <h4 className="text-9xl leading-none m-0 text-foreground">
            {borrower.opportunityScore}
          </h4>
          <div className="w-full h-1 rounded-full bg-black/20">
            <div
              className="h-full rounded-full bg-black/80"
              style={{ width: `${borrower.opportunityScore}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-4 p-4 min-w-0">
          <div>
            <h3 className="text-4xl text-foreground">{borrower.name}</h3>
            <p className="text-xs text-muted-foreground">
              Facility ID: {borrower.facilityId}
            </p>
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            {borrower.opportunityTypes.map((type) => (
              <Badge key={type} variant="outline" className="rounded-full">
                {type === "Upsell Candidate" ? "Upsell" : "Restructure"}
              </Badge>
            ))}
          </div>

          {/* Signals as bullet points */}
          <ul className="list-disc list-inside text-sm text-foreground space-y-1">
            {borrower.signals.map((signal) => (
              <li key={signal.text}>{signal.text}</li>
            ))}
          </ul>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <p className="text-base text-foreground leading-normal">
              {borrower.currentFacilitySummary}.{" "}
              {borrower.suggestedProduct
                ? `Eligible for ${borrower.suggestedProduct.toLowerCase()}.`
                : borrower.recommendedAction || ""}
            </p>
            <p className="text-xs text-muted-foreground opacity-70">
              {borrower.suggestedProduct
                ? `Recommend "${borrower.suggestedProduct}"`
                : borrower.recommendedAction || ""}
            </p>
          </div>

          {/* Actions button */}
          <div>
            <Button variant="default" size="lg">
              Actions
              <ChevronDown className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Related Successful Opportunities */}
      <SectionCard
        title="Related successful opportunities"
        subtitle="Real-time Indicators"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Next Review</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relatedOpportunities.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="text-sm">{item.name}</TableCell>
                <TableCell className="text-sm">{item.type}</TableCell>
                <TableCell className="text-sm">{item.tracking}</TableCell>
                <TableCell className="text-sm">{item.nextReview}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell>
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
              <TableHead>Tracking</TableHead>
              <TableHead>Next Review</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {covenants.map((cov) => (
              <TableRow key={cov.id}>
                <TableCell className="text-sm">{cov.name}</TableCell>
                <TableCell className="text-sm">{cov.type}</TableCell>
                <TableCell className="text-sm">{cov.trackingMode}</TableCell>
                <TableCell className="text-sm">{cov.nextReviewDate}</TableCell>
                <TableCell>
                  <StatusBadge status={cov.status} />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-xs">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      {/* 5. Growth Signals */}
      <SectionCard title="Growth Signals" subtitle="Real-time Indicators">
        <StatCardsRow cards={growthStatCards} />
      </SectionCard>

      {/* 6. Servicing Signals */}
      <SectionCard
        title="Servicing Signals"
        subtitle="Health & Operational Metrics"
      >
        <StatCardsRow cards={servicingStatCards} />
      </SectionCard>

      {/* 7. Days Sales Outstanding (DSO) */}
      <SectionCard
        title="Days Sales Outstanding (DSO)"
        subtitle="24-month Analysis"
      >
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dsoHistory}>
              <CartesianGrid
                stroke="rgba(255,255,255,0.1)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                interval={3}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid rgba(167,243,208,0.2)",
                  borderRadius: "8px",
                  color: "#f9fafb",
                }}
              />
              <Legend
                wrapperStyle={{ color: "#9ca3af", fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="value"
                name="Borrower DSO"
                stroke="#4bcd3e"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="industryAvg"
                name="Industry Avg"
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <InsightBox
          summary="DSO has improved steadily over the past 24 months, declining from 48 days to 31 days. This outperforms the industry average of 41 days, indicating strong accounts receivable management and healthy cash conversion cycles. The consistent downward trend suggests operational improvements in collections processes."
          metrics={[
            { label: "Current DSO", value: "41" },
            { label: "Delta YoY", value: "-9.2" },
          ]}
        />
      </SectionCard>

      {/* 8. Public Records */}
      <SectionCard title="Public Records" subtitle="Real-time Indicators">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Next Review</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {publicRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="text-sm">{record.parties}</TableCell>
                <TableCell className="text-sm">{record.type}</TableCell>
                <TableCell className="text-sm">{record.source}</TableCell>
                <TableCell className="text-sm">{record.filingDate}</TableCell>
                <TableCell>
                  <StatusBadge
                    status={
                      record.severity === "Critical"
                        ? "Non-Compliant"
                        : record.severity === "Watch"
                          ? "Pending"
                          : "Compliant"
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-xs">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      {/* 9. Transaction Data */}
      <SectionCard title="Transaction Data" subtitle="Real-time Indicators">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Next Review</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell className="text-sm">{txn.description}</TableCell>
                <TableCell className="text-sm">{txn.type}</TableCell>
                <TableCell className="text-sm">
                  {txn.referenceNumber}
                </TableCell>
                <TableCell className="text-sm">{txn.date}</TableCell>
                <TableCell>
                  <StatusBadge
                    status={txn.anomalous ? "Non-Compliant" : "Compliant"}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-xs">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      {/* 10. Industry Data */}
      <SectionCard title="Industry Data" subtitle="24-month Analysis">
        <InsightBox
          summary="Apex Manufacturing Corp operates in the Manufacturing sector (NAICS 332710). The company consistently outperforms industry benchmarks across key financial metrics including revenue growth, current ratio, and operating margin. Debt-to-EBITDA remains well within acceptable thresholds, positioning the borrower favorably for additional credit capacity."
          metrics={[
            { label: "Revenue Growth", value: "34%" },
            { label: "Industry Avg", value: "8%" },
          ]}
        />
      </SectionCard>

      {/* 11. People Data */}
      <SectionCard
        title="People Data"
        subtitle="Health & Operational Metrics"
      >
        <StatCardsRow cards={peopleStatCards} />
      </SectionCard>

      {/* 12. Market Data */}
      <SectionCard
        title="Market Data"
        subtitle="Health & Operational Metrics"
      >
        <StatCardsRow cards={marketStatCards} />
      </SectionCard>
    </div>
  );
}
