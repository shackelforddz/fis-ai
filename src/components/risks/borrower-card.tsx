"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RiskEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

function getScoreColor(score: number) {
  if (score >= 75) return "bg-[#EB1F32]";
  return "bg-secondary";
}

function getScoreLabelColor(score: number) {
  if (score >= 75) return "text-white";
  return "text-foreground";
}

interface RiskCardProps {
  risk: RiskEntry;
}

export function RiskCard({ risk }: RiskCardProps) {
  const scoreColor = getScoreColor(risk.riskScore);
  const labelColor = getScoreLabelColor(risk.riskScore);

  return (
    <Link
      href={`/risk/${risk.borrowerId}`}
      className="bg-gray-900 rounded-xl p-6 flex gap-6 items-center overflow-hidden hover:bg-card/80 transition-colors group"
    >
      {/* Score Sidebar */}
      <div
        className={cn(
          "flex flex-col items-center justify-between min-h-[200px] min-w-[160px] p-6 rounded-xl shrink-0",
          scoreColor
        )}
      >
        <span className={cn("text-xs", labelColor)}>Risk Score</span>
        <h4 className="text-7xl leading-none text-foreground">
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
        {/* Name + Facility */}
        <div>
          <h3 className="text-2xl text-foreground">{risk.borrowerName}</h3>
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
      </div>

      {/* Arrow */}
      <ArrowRight className="size-10 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
    </Link>
  );
}
