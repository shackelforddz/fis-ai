"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Borrower } from "@/lib/types";
import { cn } from "@/lib/utils";

function getScoreColor(score: number) {
  if (score >= 75) return "bg-primary";
  return "bg-secondary";
}

function getScoreLabelColor(score: number) {
  if (score >= 75) return "text-primary-foreground";
  return "text-foreground";
}

interface BorrowerCardProps {
  borrower: Borrower;
}

export function BorrowerCard({ borrower }: BorrowerCardProps) {
  const scoreColor = getScoreColor(borrower.opportunityScore);
  const labelColor = getScoreLabelColor(borrower.opportunityScore);

  return (
    <Link
      href={`/borrower/${borrower.id}`}
      className="bg-gray-900 rounded-xl p-6 flex gap-6 items-center overflow-hidden hover:bg-card/80 transition-colors group"
    >
      {/* Score Sidebar */}
      <div
        className={cn(
          "flex flex-col items-center justify-between min-h-[200px] min-w-[160px] p-6 rounded-xl shrink-0",
          scoreColor
        )}
      >
        <span className={cn("text-xs", labelColor)}>Opportunity Score</span>
        <h4 className="text-7xl leading-none text-foreground">
          {borrower.opportunityScore}
        </h4>
        {/* Progress bar */}
        <div className="w-full h-1 rounded-full bg-black/20">
          <div
            className="h-full rounded-full bg-black/80"
            style={{ width: `${borrower.opportunityScore}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-4 p-4 min-w-0">
        {/* Name + Facility */}
        <div>
          <h3 className="text-2xl text-foreground">
            {borrower.name}
          </h3>
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
          {borrower.signals.slice(0, 2).map((signal) => (
            <Badge
              key={signal.text}
              variant="outline"
              className="rounded-full"
            >
              {signal.text.length > 25
                ? signal.text.slice(0, 25) + "..."
                : signal.text}
            </Badge>
          ))}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-4">
          <p className="text-base text-foreground leading-normal">
            {borrower.suggestedProduct
              ? `${borrower.suggestedProduct}`
              : borrower.recommendedAction || ""}
          </p>
          <p className="text-sm text-muted-foreground opacity-70">
            {borrower.signals[0]?.text}.{" "}
            {borrower.suggestedProduct
              ? `Eligible for ${borrower.suggestedProduct.toLowerCase()}.`
              : borrower.recommendedAction || ""}
          </p>
        </div>
      </div>

      {/* Arrow */}
      <ArrowRight className="size-10 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
    </Link>
  );
}
