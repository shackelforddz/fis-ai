"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, SlidersVertical, ChevronDown, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { loanEvaluations } from "@/lib/mock-data";
import type { LoanActionType } from "@/lib/types";

const ROWS_PER_PAGE = 10;

const actionFilterOptions: { label: string; value: LoanActionType | "all" }[] = [
  { label: "All Actions", value: "all" },
  { label: "Create Credit Memo", value: "Create Credit Memo" },
  { label: "Create Restructuring", value: "Create Restructuring" },
  { label: "Create Scenario", value: "Create Scenario" },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function AnalysisBadge({ analysis }: { analysis: string }) {
  if (analysis === "Likely approved") {
    return (
      <Badge variant="outline" className="rounded-full border-primary/30 text-primary bg-primary/10">
        {analysis}
      </Badge>
    );
  }
  if (analysis === "Review needed") {
    return (
      <Badge variant="outline" className="rounded-full border-yellow-500/30 text-yellow-500 bg-yellow-500/10">
        {analysis}
      </Badge>
    );
  }
  if (analysis === "Likely declined") {
    return (
      <Badge variant="outline" className="rounded-full border-[#EB1F32]/30 text-[#EB1F32] bg-[#EB1F32]/10">
        {analysis}
      </Badge>
    );
  }
  return <Badge variant="outline" className="rounded-full">{analysis}</Badge>;
}

export default function LoanEvaluationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<LoanActionType | "all">("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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

  const filtered = loanEvaluations.filter((loan) => {
    const matchesSearch =
      loan.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction =
      actionFilter === "all" || loan.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginatedLoans = filtered.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const activeLabel =
    actionFilterOptions.find((o) => o.value === actionFilter)?.label ?? "All Actions";

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, actionFilter]);

  return (
    <>
      {/* Header */}
      <div className="shrink-0">
        <h1 className="text-3xl text-foreground leading-9">
          Loan Evaluation Center
        </h1>
        <p className="text-lg text-muted-foreground leading-7">
          Manage and prioritize active commercial loan evaluations through our
          automated decisioning engine.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 flex flex-col gap-6">
        {/* Search + Filters */}
        <div className="flex gap-4 items-center shrink-0 bg-gray-900 rounded-full p-4">
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

          {/* Action Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="h-8 w-[200px] border border-input rounded-full flex items-center gap-1.5 px-2.5 py-1.5 shrink-0"
            >
              <span className="flex-1 text-sm text-muted-foreground text-left truncate">
                {activeLabel} ({filtered.length})
              </span>
              <ChevronDown className={`size-4 text-muted-foreground shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full mt-1 left-0 w-[200px] bg-popover border border-border rounded-xl overflow-hidden z-50 shadow-lg">
                {actionFilterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setActionFilter(option.value);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      actionFilter === option.value
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

        {/* Table */}
        <ScrollArea className="flex-1 -mr-6 pr-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Borrower Name</TableHead>
                <TableHead>Loan Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Analysis</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="text-sm">
                    <Link
                      href={`/loan-evaluation/${loan.id}`}
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      {loan.borrowerName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatCurrency(loan.loanAmount)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {loan.loanType}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {loan.status}
                  </TableCell>
                  <TableCell>
                    <AnalysisBadge analysis={loan.analysis} />
                  </TableCell>
                  <TableCell>
                    <Button size="sm" className="gap-1.5 text-xs">
                      {loan.action}
                      <ArrowRight className="size-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="size-4" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`size-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                    currentPage === page
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
