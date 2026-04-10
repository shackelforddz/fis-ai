"use client";

import { TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface StatCard {
  label: string;
  value: string;
  status: string;
}

interface StatCardsRowProps {
  cards: StatCard[];
}

export function StatCardsRow({ cards }: StatCardsRowProps) {
  return (
    <div className="flex items-center gap-0">
      {cards.map((card, i) => (
        <div key={card.label} className="flex items-center flex-1">
          {i > 0 && <Separator orientation="vertical" className="h-16 mx-4" />}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="size-4" />
              <span>{card.label}</span>
            </div>
            <p className="text-2xl font-medium text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
