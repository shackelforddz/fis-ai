"use client";

import Link from "next/link";
import { use } from "react";
import { ChevronDown, ChevronRight, MoreHorizontal, TrendingUp, ArrowRight, TrendingDown } from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
  borrowers,
  covenants,
  riskEntries,
} from "@/lib/mock-data";

function getScoreColor(score: number) {
  if (score >= 75) return "bg-[#EB1F32]";
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

// --- Transaction anomalies ---
const transactionAnomalies = [
  {
    date: "Oct 24, 2023",
    description: "Missing Tax Disbursement",
    amount: "$142,500.00",
    refId: "ID: TX-90022h",
    status: "Overdue",
    highlighted: true,
  },
  {
    date: "Oct 15, 2023",
    description: "Significant outflow to undisclosed entity",
    amount: "$2,400,000.00",
    refId: "ID: TX-900198",
    status: "Pending Audit",
    highlighted: false,
  },
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

export default function BorrowerRiskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const risk = riskEntries.find((r) => r.borrowerId === id) ?? riskEntries[0];
  const borrower = borrowers.find((b) => b.id === id) ?? borrowers[0];
  const scoreColor = getScoreColor(risk.riskScore);
  const labelColor = getScoreLabelColor(risk.riskScore);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <Link href="/risks" className="hover:text-foreground transition-colors">
          Risk Portfolio
        </Link>
        <ChevronRight className="size-4 mx-1 inline-block" />
        <span className="text-foreground">{risk.borrowerName}</span>
      </nav>

      {/* 2. Risk Hero Card */}
      <div className="bg-gray-900 rounded-xl p-6 flex gap-6 items-start">
        {/* Score Sidebar */}
        <div
          className={cn(
            "flex flex-col items-center justify-between h-full min-w-[220px] p-6 rounded-xl shrink-0",
            scoreColor
          )}
        >
          <span className={cn("text-xs", labelColor)}>Risk Score</span>
          <h4 className="text-9xl leading-none m-0 text-foreground">
            {risk.riskScore}
          </h4>
          <div className="w-full h-1 rounded-full bg-black/20">
            <div
              className="h-full rounded-full bg-black/80"
              style={{ width: `${risk.riskScore}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-4 p-4 min-w-0">
          <div>
            <h3 className="text-4xl text-foreground">{risk.borrowerName}</h3>
            <p className="text-xs text-muted-foreground">
              Facility ID: {risk.facilityId}
            </p>
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="rounded-full">
              {risk.recommendedAction}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              {risk.warningType}
            </Badge>
          </div>

          {/* Action Description */}
          <p className="text-base text-foreground leading-normal">
            {risk.actionDescription}
          </p>

          {/* Reasoning */}
          <p className="text-sm text-muted-foreground leading-normal">
            {risk.reasoning}
          </p>

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

      {/* 5. Covenant Trends (DSCR) */}
      <SectionCard title="Covenant Trends (DSCR)" subtitle="Trending Down: 17% Decline">
        <div className="flex gap-4">
          <div className="flex-1 bg-secondary rounded-xl p-6 flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Q1 FY24</span>
            <div className="flex items-center gap-2">
              <span className="text-3xl text-foreground">1.35x</span>
              <ArrowRight className="size-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex-1 bg-secondary rounded-xl p-6 flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Q2 FY24</span>
            <div className="flex items-center gap-2">
              <span className="text-3xl text-foreground">$2.1M</span>
              <ArrowRight className="size-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex-1 bg-[#EB1F32]/10 border border-[#EB1F32]/30 rounded-xl p-6 flex flex-col gap-2">
            <span className="text-xs text-[#EB1F32]">Q3 FY24 Current</span>
            <div className="flex items-center gap-2">
              <span className="text-3xl text-[#EB1F32]">1.12x</span>
              <TrendingDown className="size-4 text-[#EB1F32]" />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* 6. Transaction Monitoring */}
      <SectionCard title="Transaction Monitoring" subtitle="2 Anomalies Detected">
        <div className="flex flex-col gap-4">
          {transactionAnomalies.map((txn) => (
            <div
              key={txn.refId}
              className={cn(
                "rounded-xl p-5 flex items-start justify-between",
                txn.highlighted
                  ? "bg-[#EB1F32]/10 border border-[#EB1F32]/30"
                  : "bg-secondary"
              )}
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">{txn.date}</span>
                <span className="text-sm text-foreground">{txn.description}</span>
                {txn.highlighted && (
                  <Badge variant="destructive" className="w-fit mt-1 rounded-full">
                    {txn.status}
                  </Badge>
                )}
                {!txn.highlighted && (
                  <span className="text-xs text-muted-foreground mt-1">{txn.status}</span>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="text-lg text-foreground">{txn.amount}</span>
                <p className="text-xs text-muted-foreground">{txn.refId}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 7. Ecosystem Signals */}
      <SectionCard title="Ecosystem Signals" subtitle="Trending Down: 17% Decline">
        <div className="flex flex-col gap-4">
          <h4 className="text-lg text-foreground">Cap Rate Expansion</h4>
          <div className="flex gap-4">
            <div className="flex-1 bg-secondary rounded-xl p-6 flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">Previous</span>
              <span className="text-3xl text-foreground">5.0%</span>
            </div>
            <div className="flex items-center shrink-0">
              <ArrowRight className="size-4 text-muted-foreground" />
            </div>
            <div className="flex-1 bg-[#EB1F32]/10 border border-[#EB1F32]/30 rounded-xl p-6 flex flex-col gap-2">
              <span className="text-xs text-[#EB1F32]">Current</span>
              <span className="text-3xl text-[#EB1F32]">6.5%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Industrial sub-market experiencing inventory surge. Downward valuation pressure confirmed via external aggregator signals.
          </p>
        </div>
      </SectionCard>

      {/* 8. Compliance Signals */}
      <SectionCard title="Compliance Signals" subtitle="Trending Down: 17% Decline">
        <div className="bg-[#EB1F32]/10 border border-[#EB1F32]/30 rounded-xl p-5 flex flex-col gap-2">
          <span className="text-xs text-[#EB1F32]">Notice of Violation (EPA)</span>
          <p className="text-sm text-foreground">
            Unsecured Chemical Storage detected. Non-disclosure by borrower constitutes a Tier 1 violation of Section 8.2.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
