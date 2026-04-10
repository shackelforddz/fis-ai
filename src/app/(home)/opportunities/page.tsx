"use client";

import { useState, useRef, useEffect } from "react";
import { Search, SlidersVertical, ChevronDown } from "lucide-react";
import { BorrowerCard } from "@/components/opportunities/borrower-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { borrowers } from "@/lib/mock-data";
import type { OpportunityType } from "@/lib/types";

const filterOptions: { label: string; value: OpportunityType | "all" }[] = [
  { label: "All Opportunities", value: "all" },
  { label: "Upsell Candidates", value: "Upsell Candidate" },
  { label: "Restructure Candidates", value: "Restructure Candidate" },
];

export default function OpportunityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<OpportunityType | "all">("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = borrowers.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.facilityId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "all" || b.opportunityTypes.includes(typeFilter);
    return matchesSearch && matchesType;
  });

  const activeLabel =
    filterOptions.find((o) => o.value === typeFilter)?.label ?? "All Opportunities";

  return (
    <>
      {/* Header */}
      <div className="shrink-0">
        <h1 className="text-3xl text-foreground leading-9">
          Opportunity Portfolio
        </h1>
        <p className="text-lg text-muted-foreground leading-7">
          Priority action items based on real-time portfolio performance signals
          and risk assessment modeling
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 flex flex-col gap-6">
        {/* Search + Filters */}
        <div className="flex gap-4 items-center shrink-0">
          {/* Search Input */}
          <div className="flex-1 h-8 border border-input rounded-full flex items-center gap-1.5 px-2.5 py-1">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search by Borrower or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
            />
          </div>

          {/* Opportunity Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="h-8 w-[230px] border border-input rounded-full flex items-center gap-1.5 px-2.5 py-1.5 shrink-0"
            >
              <span className="flex-1 text-sm text-muted-foreground text-left truncate">
                {activeLabel} ({filtered.length})
              </span>
              <ChevronDown className={`size-4 text-muted-foreground shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full mt-1 left-0 w-[230px] bg-popover border border-border rounded-xl overflow-hidden z-50 shadow-lg">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTypeFilter(option.value);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      typeFilter === option.value
                        ? "text-foreground bg-accent"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Button */}
          <button className="size-8 border border-input rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <SlidersVertical className="size-4" />
          </button>
        </div>

        {/* Borrower Cards */}
        <ScrollArea className="flex-1 -mr-6 pr-6">
          <div className="flex flex-col gap-6">
            {filtered
              .sort((a, b) => b.opportunityScore - a.opportunityScore)
              .map((borrower) => (
                <BorrowerCard key={borrower.id} borrower={borrower} />
              ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
