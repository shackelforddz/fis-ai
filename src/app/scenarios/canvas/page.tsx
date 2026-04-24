"use client";

import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent as ReactDragEvent,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  Eye,
  Table2,
  Send,
  MousePointer2,
  Hand,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Image as ImageIcon,
  X,
} from "lucide-react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  reconnectEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  useStore,
  useStoreApi,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  borrowers,
  loanEvaluations,
  performanceData,
} from "@/lib/mock-data";
import type { Borrower, LoanEvaluation } from "@/lib/types";
import { TemplateContent } from "@/app/document-creator/[loanId]/templates";

const LIBRARY_NODES = [
  { id: "sensitivity", title: "Sensitivity Analysis" },
  { id: "performance", title: "Performance Analysis" },
  { id: "erp", title: "ERP Data" },
];

type DataTable = {
  title: string;
  description: string;
  columns: string[];
  rows: string[][];
};

const NODE_DATA_TABLES: Record<string, DataTable> = {
  sensitivity: {
    title: "Sensitivity Analysis",
    description:
      "Impact on key underwriting metrics across a range of single-variable shocks holding all other inputs at base case.",
    columns: [
      "Variable",
      "Downside (-20%)",
      "Downside (-10%)",
      "Base Case",
      "Upside (+10%)",
    ],
    rows: [
      ["Occupancy Rate", "78.0%", "85.5%", "95.0%", "98.5%"],
      ["Average Monthly Rent / Unit", "$2,040", "$2,295", "$2,550", "$2,805"],
      ["Effective Rental Income", "$2.29M", "$2.55M", "$2.83M", "$3.12M"],
      ["Other Operating Income", "$138K", "$155K", "$172K", "$189K"],
      ["Gross Potential Income", "$2.43M", "$2.71M", "$3.00M", "$3.31M"],
      ["Vacancy & Credit Loss", "$535K", "$393K", "$150K", "$50K"],
      ["Effective Gross Income", "$1.89M", "$2.31M", "$2.85M", "$3.26M"],
      ["Operating Expenses", "$960K", "$920K", "$880K", "$845K"],
      ["Net Operating Income", "$925K", "$1.39M", "$1.97M", "$2.41M"],
      ["Debt Service (Annual)", "$1.46M", "$1.46M", "$1.46M", "$1.46M"],
      ["DSCR", "0.63x", "0.95x", "1.35x", "1.65x"],
      ["Cap Rate Implied Value", "$13.2M", "$19.9M", "$28.1M", "$34.4M"],
      ["LTV at Refinance", "91.0%", "76.5%", "58.0%", "49.0%"],
    ],
  },
  performance: {
    title: "Performance Analysis",
    description:
      "Trailing six-quarter operating performance vs. the prior comparable period and underwriting plan.",
    columns: ["Metric", "Q3 2025", "Q4 2025", "Q1 2026", "Q2 2026", "YoY Δ"],
    rows: [
      ["Revenue", "$3.85M", "$4.00M", "$4.20M", "$4.50M", "+8.2%"],
      ["Cost of Goods Sold", "$1.92M", "$1.98M", "$2.05M", "$2.18M", "+6.1%"],
      ["Gross Profit", "$1.93M", "$2.02M", "$2.15M", "$2.32M", "+10.5%"],
      ["Operating Expenses", "$2.70M", "$2.75M", "$2.80M", "$2.90M", "+3.5%"],
      ["EBITDA", "$1.25M", "$1.35M", "$1.40M", "$1.60M", "+15.3%"],
      ["EBITDA Margin", "32.5%", "33.8%", "33.3%", "35.6%", "+3.1pp"],
      ["Net Income", "$780K", "$835K", "$890K", "$1.05M", "+18.7%"],
      ["Cash on Hand", "$1.85M", "$1.95M", "$2.10M", "$2.40M", "+14.3%"],
      ["Total Debt", "$9.20M", "$9.05M", "$8.90M", "$8.75M", "-4.1%"],
      ["Debt / EBITDA", "1.84x", "1.68x", "1.59x", "1.37x", "-0.47x"],
      ["Fixed Charge Coverage", "2.10x", "2.25x", "2.35x", "2.55x", "+0.38x"],
      ["Return on Equity", "11.2%", "11.8%", "12.4%", "13.6%", "+2.0pp"],
    ],
  },
  erp: {
    title: "ERP Data",
    description:
      "Live account balances pulled from the borrower's ERP feed, reconciled against the prior month close.",
    columns: ["Account", "Current", "Prior Period", "MoM Variance", "YoY Δ"],
    rows: [
      ["Cash & Equivalents", "$2.40M", "$2.10M", "+$300K", "+18.5%"],
      ["Accounts Receivable", "$1.85M", "$1.72M", "+$130K", "+9.2%"],
      ["Inventory — Raw", "$880K", "$845K", "+$35K", "+6.1%"],
      ["Inventory — Finished", "$1.52M", "$1.47M", "+$55K", "+8.4%"],
      ["Prepaid Expenses", "$215K", "$198K", "+$17K", "+3.5%"],
      ["Total Current Assets", "$6.87M", "$6.33M", "+$537K", "+10.3%"],
      ["Fixed Assets (Net)", "$12.40M", "$12.58M", "-$180K", "-2.1%"],
      ["Accounts Payable", "$1.15M", "$1.08M", "+$70K", "+5.8%"],
      ["Accrued Expenses", "$485K", "$462K", "+$23K", "+4.1%"],
      ["Current Portion LT Debt", "$780K", "$780K", "$0", "0.0%"],
      ["Total Current Liabilities", "$2.42M", "$2.32M", "+$93K", "+4.8%"],
      ["Working Capital", "$4.45M", "$4.01M", "+$443K", "+14.2%"],
      ["Days Sales Outstanding", "42", "38", "+4 days", "+10.5%"],
      ["Days Inventory Outstanding", "68", "71", "-3 days", "-4.2%"],
      ["Days Payable Outstanding", "35", "33", "+2 days", "+6.1%"],
      ["Cash Conversion Cycle", "75", "76", "-1 day", "-1.3%"],
    ],
  },
  multi: {
    title: "Multi-Variate Scenario Analysis",
    description:
      "Combined impact of rising rates, a six-month construction delay, and softer lease-up across four scenarios.",
    columns: [
      "Variable",
      "Base Case",
      "Mild Stress",
      "Moderate Stress",
      "Severe Stress",
    ],
    rows: [
      ["Index Rate (SOFR)", "5.50%", "6.25%", "7.00%", "7.50%"],
      ["Bank Spread", "2.00%", "2.25%", "2.35%", "2.50%"],
      ["All-in Coupon Rate", "7.50%", "8.50%", "9.35%", "10.00%"],
      ["Construction Timeline", "18 months", "20 months", "22 months", "24 months"],
      ["Lease-up Period", "6 months", "9 months", "12 months", "15 months"],
      ["Stabilized Occupancy", "95.0%", "92.5%", "88.0%", "82.0%"],
      ["Stabilized NOI", "$1.97M", "$1.78M", "$1.52M", "$1.28M"],
      ["Interest Reserve Drawn", "$425K", "$620K", "$845K", "$1.08M"],
      ["Annual Debt Service", "$1,125,000", "$1,275,000", "$1,400,000", "$1,425,000"],
      ["Resulting DSCR", "1.35x (Safe)", "1.18x (Watch)", "1.08x (Elevated)", "0.90x (Default Risk)"],
      ["LTV at Stabilization", "58.0%", "64.5%", "72.0%", "81.5%"],
      ["Debt Yield", "10.5%", "9.2%", "7.8%", "6.4%"],
      ["Equity IRR (5-Yr)", "18.4%", "12.1%", "6.8%", "-2.5%"],
      ["Recommended Action", "Approve", "Approve with covenants", "Decline or restructure", "Decline"],
    ],
  },
};

const NodeActionsContext = createContext<{
  onView: (nodeId: string) => void;
  onGenerate: (sourceNodeId: string, prompt: string) => void;
}>({ onView: () => {}, onGenerate: () => {} });

const LoanDocContext = createContext<{
  loan: LoanEvaluation;
  borrower?: Borrower;
}>({ loan: loanEvaluations[0] });

type VisualId = "sensitivity-chart" | "multi-chart" | "performance-chart" | "erp-chart";

type VisualKpi = { label: string; value: string; subLabel?: string };

const LIBRARY_VISUALS: {
  id: VisualId;
  title: string;
  kpis: VisualKpi[];
}[] = [
  {
    id: "sensitivity-chart",
    title: "Sensitivity Analysis",
    kpis: [
      { label: "Base DSCR", value: "1.35x", subLabel: "Stable" },
      { label: "Downside DSCR", value: "0.95x", subLabel: "-10% rents" },
      { label: "LTV Stress", value: "76.5%", subLabel: "Refinance" },
    ],
  },
  {
    id: "multi-chart",
    title: "Multi-Variate Scenario Analysis",
    kpis: [
      { label: "Moderate Stress DSCR", value: "1.08x", subLabel: "Elevated" },
      { label: "Equity IRR", value: "6.8%", subLabel: "5-yr, moderate" },
      { label: "Debt Yield", value: "7.8%", subLabel: "Stabilized" },
    ],
  },
  {
    id: "performance-chart",
    title: "Performance Analysis",
    kpis: [
      { label: "Revenue YoY", value: "+8.2%", subLabel: "Q2 2026" },
      { label: "EBITDA Margin", value: "35.6%", subLabel: "+3.1pp" },
      { label: "Debt / EBITDA", value: "1.37x", subLabel: "-0.47x YoY" },
    ],
  },
  {
    id: "erp-chart",
    title: "ERP Data",
    kpis: [
      { label: "Working Capital", value: "$4.45M", subLabel: "+14.2%" },
      { label: "Cash Conversion", value: "75 days", subLabel: "-1 day" },
      { label: "Current Ratio", value: "2.84x", subLabel: "Healthy" },
    ],
  },
];

type InsertedVisual = {
  instanceId: string;
  visualId: VisualId;
  element: HTMLElement;
};

const DocEditContext = createContext<{
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  insertedVisuals: InsertedVisual[];
  insertVisual: (v: InsertedVisual) => void;
  removeVisual: (instanceId: string) => void;
}>({
  editMode: false,
  setEditMode: () => {},
  insertedVisuals: [],
  insertVisual: () => {},
  removeVisual: () => {},
});

type SourceData = {
  title: string;
  subtitle?: string;
  prompt?: string;
  suggestedPrompt?: string;
  dataKey?: string;
};

type SourceNodeType = Node<SourceData, "source">;
type DocumentNodeType = Node<Record<string, never>, "document">;
type FlowNode = SourceNodeType | DocumentNodeType;

const HANDLE_CLASS =
  "!size-2 !bg-muted-foreground !border !border-gray-700";

function SourceNode({ id, data, selected }: NodeProps<SourceNodeType>) {
  const { onView, onGenerate } = useContext(NodeActionsContext);
  const [prompt, setPrompt] = useState(data.prompt ?? "");
  const [focused, setFocused] = useState(false);
  const showSuggestion =
    focused && prompt.length === 0 && !!data.suggestedPrompt;
  return (
    <div
      className={`bg-gray-900 rounded-md p-4 w-[220px] flex flex-col gap-3 transition-shadow ${
        selected ? "ring-2 ring-primary/60" : ""
      }`}
    >
      <Handle type="target" position={Position.Left} className={HANDLE_CLASS} />
      <Handle type="source" position={Position.Right} className={HANDLE_CLASS} />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <p className="flex-1 min-w-0 text-sm font-medium text-white">
            {data.title}
          </p>
          <button
            type="button"
            aria-label="View data"
            onClick={(e) => {
              e.stopPropagation();
              onView(data.dataKey ?? id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="nodrag shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Eye className="size-4" />
          </button>
        </div>
        {data.subtitle && (
          <p className="text-xs text-muted-foreground leading-4 mt-1">
            {data.subtitle}
          </p>
        )}
      </div>
      <div className="bg-gray-800 rounded-md h-[88px] flex items-center justify-center">
        <Table2 className="size-7 text-muted-foreground" />
      </div>
      <div className="relative nodrag">
        {showSuggestion && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              const suggestion = data.suggestedPrompt ?? "";
              setPrompt(suggestion);
              onGenerate(id, suggestion);
            }}
            className="absolute bottom-full left-0 right-0 mb-2 bg-popover border border-border rounded-md p-3 text-left text-xs text-muted-foreground leading-4 hover:text-foreground transition-colors"
          >
            <span className="block text-[10px] uppercase tracking-wide text-muted-foreground/70 mb-1">
              Suggested
            </span>
            {data.suggestedPrompt}
          </button>
        )}
        <div className="bg-card rounded-full flex items-center gap-2 pl-4 pr-1 py-1">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex-1 min-w-0 bg-transparent text-xs text-foreground placeholder:text-muted-foreground leading-4 outline-none"
            placeholder="Your prompt"
          />
          <button
            type="button"
            className="size-6 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <Send className="size-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function computeDropInsertion(docRoot: HTMLElement, clientY: number) {
  const children = Array.from(docRoot.children).filter(
    (el) => !(el as HTMLElement).dataset.indicator,
  ) as HTMLElement[];

  if (children.length === 0) {
    return { before: null as HTMLElement | null, top: 8 };
  }

  for (let i = 0; i < children.length; i++) {
    const rect = children[i].getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    if (clientY < mid) {
      const cur = children[i];
      const prev = i === 0 ? null : children[i - 1];
      const prevBottom = prev ? prev.offsetTop + prev.offsetHeight : 0;
      const top = (prevBottom + cur.offsetTop) / 2;
      return { before: cur, top };
    }
  }
  const last = children[children.length - 1];
  return { before: null, top: last.offsetTop + last.offsetHeight + 12 };
}

function DocumentNode({ selected }: NodeProps<DocumentNodeType>) {
  const { loan, borrower } = useContext(LoanDocContext);
  const { editMode, insertedVisuals, insertVisual, removeVisual } =
    useContext(DocEditContext);
  const [dragOver, setDragOver] = useState(false);
  const [indicatorTop, setIndicatorTop] = useState<number | null>(null);
  const docRef = useRef<HTMLDivElement>(null);

  function handleDragOver(e: ReactDragEvent<HTMLDivElement>) {
    if (!e.dataTransfer.types.includes("text/visual-id")) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setDragOver(true);
    const docRoot = docRef.current;
    if (!docRoot) return;
    const { top } = computeDropInsertion(docRoot, e.clientY);
    setIndicatorTop(top);
  }
  function handleDragLeave(e: ReactDragEvent<HTMLDivElement>) {
    const related = e.relatedTarget as globalThis.Node | null;
    if (related && docRef.current?.parentElement?.contains(related)) return;
    setDragOver(false);
    setIndicatorTop(null);
  }
  function handleDrop(e: ReactDragEvent<HTMLDivElement>) {
    const visualId = e.dataTransfer.getData("text/visual-id") as VisualId;
    if (!visualId || !LIBRARY_VISUALS.some((v) => v.id === visualId)) return;
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    setIndicatorTop(null);

    const docRoot = docRef.current;
    if (!docRoot) return;

    const { before } = computeDropInsertion(docRoot, e.clientY);

    const instanceId = `v-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const slot = document.createElement("div");
    slot.setAttribute("data-visual-slot", instanceId);

    if (before) {
      docRoot.insertBefore(slot, before);
    } else {
      docRoot.appendChild(slot);
    }

    insertVisual({ instanceId, visualId, element: slot });
  }

  return (
    <div
      className={`w-[860px] h-[1200px] rounded-xl overflow-hidden bg-white transition-shadow ${
        selected ? "ring-2 ring-primary/60" : ""
      } ${dragOver ? "ring-2 ring-primary" : ""}`}
    >
      <Handle type="target" position={Position.Left} className={HANDLE_CLASS} />
      <div
        className="nodrag nowheel w-full h-full overflow-y-auto"
        onDragOver={editMode ? handleDragOver : undefined}
        onDragLeave={editMode ? handleDragLeave : undefined}
        onDrop={editMode ? handleDrop : undefined}
      >
        <div
          ref={docRef}
          className="doc-preview relative p-10 flex flex-col gap-6 text-gray-900"
        >
          <div className="bg-[#6366f1] rounded-xl py-10 px-6 text-center">
            <h2 className="text-2xl font-bold text-white">
              {loan.borrowerName} — Credit Memorandum
            </h2>
          </div>
          <TemplateContent
            templateKey="credit-memo"
            loan={loan}
            borrower={borrower}
          />
          {indicatorTop !== null && (
            <div
              data-indicator="true"
              className="absolute left-10 right-10 h-1 bg-primary rounded-full pointer-events-none shadow-[0_0_0_4px_rgba(75,205,62,0.25)]"
              style={{ top: `${indicatorTop - 2}px` }}
            />
          )}
        </div>
      </div>
      {insertedVisuals.map((v) => {
        const meta = LIBRARY_VISUALS.find((x) => x.id === v.visualId);
        if (!meta) return null;
        return createPortal(
          <DroppedVisual
            meta={meta}
            editMode={editMode}
            onRemove={() => removeVisual(v.instanceId)}
          />,
          v.element,
          v.instanceId,
        );
      })}
    </div>
  );
}

function DroppedVisual({
  meta,
  editMode,
  onRemove,
}: {
  meta: (typeof LIBRARY_VISUALS)[number];
  editMode: boolean;
  onRemove: () => void;
}) {
  return (
    <section className="flex flex-col gap-3 group relative">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <h3 className="text-base font-bold flex-1">{meta.title}</h3>
        {editMode && (
          <button
            type="button"
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 size-6 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-opacity"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <div className="h-[220px]">
        <VisualPreview id={meta.id} variant="document" />
      </div>
      <DocKpiRow items={meta.kpis} />
    </section>
  );
}

function DocKpiRow({ items }: { items: VisualKpi[] }) {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col gap-1 border border-gray-200 rounded-lg p-3 bg-gray-50"
        >
          <span className="text-[11px] text-gray-500">{item.label}</span>
          <span className="text-lg font-semibold text-gray-900">
            {item.value}
          </span>
          {item.subLabel && (
            <span className="text-[11px] text-gray-500">{item.subLabel}</span>
          )}
        </div>
      ))}
    </div>
  );
}

const DOC_PALETTE = ["#6366f1", "#4f46e5", "#4338ca", "#3730a3"] as const;
const LIB_PALETTE = ["#4bcd3e", "#16a34a", "#15803d", "#166534"] as const;

function VisualPreview({
  id,
  variant = "library",
}: {
  id: VisualId;
  variant?: "library" | "document";
}) {
  const palette = variant === "document" ? DOC_PALETTE : LIB_PALETTE;
  const height = variant === "document" ? 220 : 120;

  if (id === "performance-chart" || id === "multi-chart") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={performanceData}>
          {variant === "document" && (
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
          )}
          <Line
            type="monotone"
            dataKey="series1"
            stroke={palette[0]}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="series2"
            stroke={palette[3]}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  if (id === "sensitivity-chart") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={performanceData}>
          {variant === "document" && (
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
          )}
          <Bar dataKey="series1" fill={palette[0]} radius={[4, 4, 0, 0]} />
          <Bar dataKey="series2" fill={palette[2]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  // erp-chart — radial donut
  const data = [
    { name: "Score", value: 72 },
    { name: "Remaining", value: 28 },
  ];
  const dim = variant === "document" ? 180 : 96;
  return (
    <div className="relative mx-auto" style={{ width: dim, height: dim }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="85%"
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={palette[0]} />
            <Cell
              fill={
                variant === "document"
                  ? "rgba(17,24,39,0.08)"
                  : "rgba(255,255,255,0.1)"
              }
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function ToolbarButton({
  children,
  active,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`size-8 rounded-full flex items-center justify-center transition-colors ${
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="w-px h-5 bg-border mx-1" />;
}

function DocumentToolbar() {
  const [state, setState] = useState({
    bold: false,
    italic: false,
    h1: false,
    h2: false,
    h3: false,
    ul: false,
    ol: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
    alignJustify: false,
  });
  const savedRange = useRef<Range | null>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function update() {
      const sel = window.getSelection();
      const anchor = sel?.anchorNode as globalThis.Node | null;
      const insideEditable =
        !!anchor &&
        !!(anchor.nodeType === 1
          ? (anchor as Element).closest('[contenteditable="true"]')
          : anchor.parentElement?.closest('[contenteditable="true"]'));
      if (!insideEditable) return;
      const block = (
        document.queryCommandValue("formatBlock") || ""
      ).toLowerCase();
      setState({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        h1: block === "h1",
        h2: block === "h2",
        h3: block === "h3",
        ul: document.queryCommandState("insertUnorderedList"),
        ol: document.queryCommandState("insertOrderedList"),
        alignLeft: document.queryCommandState("justifyLeft"),
        alignCenter: document.queryCommandState("justifyCenter"),
        alignRight: document.queryCommandState("justifyRight"),
        alignJustify: document.queryCommandState("justifyFull"),
      });
    }
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, []);

  function run(cmd: string, value?: string) {
    document.execCommand(cmd, false, value);
  }
  function toggleBlock(tag: "h1" | "h2" | "h3") {
    const current = (
      document.queryCommandValue("formatBlock") || ""
    ).toLowerCase();
    run("formatBlock", current === tag ? "p" : tag);
  }
  function saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  }
  function restoreSelection() {
    const sel = window.getSelection();
    if (sel && savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5 bg-gray-900 rounded-full px-2 py-1 flex-1">
        <ToolbarButton title="Bold" active={state.bold} onClick={() => run("bold")}>
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={state.italic}
          onClick={() => run("italic")}
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton
          title="Heading 1"
          active={state.h1}
          onClick={() => toggleBlock("h1")}
        >
          <Heading1 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          active={state.h2}
          onClick={() => toggleBlock("h2")}
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={state.h3}
          onClick={() => toggleBlock("h3")}
        >
          <Heading3 className="size-4" />
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton
          title="Bulleted list"
          active={state.ul}
          onClick={() => run("insertUnorderedList")}
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={state.ol}
          onClick={() => run("insertOrderedList")}
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton
          title="Align left"
          active={state.alignLeft}
          onClick={() => run("justifyLeft")}
        >
          <AlignLeft className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Align center"
          active={state.alignCenter}
          onClick={() => run("justifyCenter")}
        >
          <AlignCenter className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Align right"
          active={state.alignRight}
          onClick={() => run("justifyRight")}
        >
          <AlignRight className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Justify"
          active={state.alignJustify}
          onClick={() => run("justifyFull")}
        >
          <AlignJustify className="size-4" />
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton
          title="Text color"
          onClick={() => {
            saveSelection();
            colorInputRef.current?.click();
          }}
        >
          <Palette className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Insert image"
          onClick={() => {
            saveSelection();
            const url = window.prompt("Image URL");
            if (url) {
              restoreSelection();
              run("insertImage", url);
            }
          }}
        >
          <ImageIcon className="size-4" />
        </ToolbarButton>
        <input
          ref={colorInputRef}
          type="color"
          className="sr-only"
          onChange={(e) => {
            restoreSelection();
            run("foreColor", e.target.value);
          }}
        />
      </div>
      <div className="flex items-center gap-0.5 bg-gray-900 rounded-full px-2 py-1 shrink-0">
        <ToolbarButton title="Undo" onClick={() => run("undo")}>
          <Undo2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => run("redo")}>
          <Redo2 className="size-4" />
        </ToolbarButton>
      </div>
    </div>
  );
}

const nodeTypes = { source: SourceNode, document: DocumentNode };

const initialNodes: FlowNode[] = [
  {
    id: "sensitivity",
    type: "source",
    position: { x: 0, y: 0 },
    data: {
      title: "Sensitivity Analysis",
      suggestedPrompt:
        "What happens if rates go up and construction takes six months longer than planned?",
    },
  },
  {
    id: "performance",
    type: "source",
    position: { x: 0, y: 260 },
    data: { title: "Performance Analysis" },
  },
  {
    id: "erp",
    type: "source",
    position: { x: 0, y: 500 },
    data: { title: "ERP Data" },
  },
  {
    id: "doc",
    type: "document",
    position: { x: 680, y: 0 },
    data: {},
  },
];

const initialEdges: Edge[] = [
  { id: "e-s-d", source: "sensitivity", target: "doc", reconnectable: true },
  { id: "e-p-d", source: "performance", target: "doc", reconnectable: true },
  { id: "e-er-d", source: "erp", target: "doc", reconnectable: true },
];

export default function CanvasPage() {
  return (
    <Suspense fallback={null}>
      <CanvasView />
    </Suspense>
  );
}

function CanvasView() {
  const searchParams = useSearchParams();
  const loanIdParam = searchParams.get("borrower");
  const matchedLoan = loanIdParam
    ? loanEvaluations.find((l) => l.id === loanIdParam)
    : undefined;
  const loan = matchedLoan ?? loanEvaluations[0];
  const borrower = borrowers.find((b) =>
    b.name
      .toLowerCase()
      .includes(loan.borrowerName.toLowerCase().split(" ")[0]),
  );
  const borrowerName = loan.borrowerName;
  const closeHref = matchedLoan
    ? `/loan-evaluation/${matchedLoan.id}`
    : "/loan-evaluation";
  const loanDocValue = useMemo(() => ({ loan, borrower }), [loan, borrower]);

  const [editMode, setEditMode] = useState(false);
  const [insertedVisuals, setInsertedVisuals] = useState<InsertedVisual[]>([]);
  const docEditValue = useMemo(
    () => ({
      editMode,
      setEditMode,
      insertedVisuals,
      insertVisual: (v: InsertedVisual) =>
        setInsertedVisuals((prev) => [...prev, v]),
      removeVisual: (instanceId: string) =>
        setInsertedVisuals((prev) => {
          const found = prev.find((v) => v.instanceId === instanceId);
          if (found) found.element.remove();
          return prev.filter((v) => v.instanceId !== instanceId);
        }),
    }),
    [editMode, insertedVisuals],
  );

  return (
    <DocEditContext.Provider value={docEditValue}>
      <main className="relative z-10 flex-1 min-w-0 h-full backdrop-blur-xl bg-glass rounded-xl p-6 flex flex-col gap-6 overflow-hidden">
        <nav className="shrink-0 flex items-center gap-2.5 text-sm text-muted-foreground">
          <Link
            href="/loan-evaluation"
            className="hover:text-foreground transition-colors"
          >
            Loan Evaluation Center
          </Link>
          <ChevronRight className="size-4" />
          {matchedLoan ? (
            <Link
              href={`/loan-evaluation/${matchedLoan.id}`}
              className="hover:text-foreground transition-colors"
            >
              {borrowerName}
            </Link>
          ) : (
            <span>{borrowerName}</span>
          )}
          <ChevronRight className="size-4" />
          <span className="text-foreground">Scenario Creator</span>
        </nav>

        <div className="shrink-0 flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl text-foreground leading-10">
              Commercial Real Estate Loan Scenario
            </h1>
            <p className="text-lg text-muted-foreground leading-7 mt-1">
              $2,500,000 Commercial Real Estate Loan
            </p>
          </div>
          {editMode ? (
            <Button variant="secondary" onClick={() => setEditMode(false)}>
              Exit Edit
            </Button>
          ) : (
            <Button variant="secondary" render={<Link href={closeHref} />}>
              Close
            </Button>
          )}
          <Button>Save</Button>
        </div>

        {editMode && (
          <div className="shrink-0">
            <DocumentToolbar />
          </div>
        )}

        <div className="flex-1 min-h-0 relative">
          <LoanDocContext.Provider value={loanDocValue}>
            <ReactFlowProvider>
              <CanvasBoard />
            </ReactFlowProvider>
          </LoanDocContext.Provider>
        </div>
      </main>

      <LibraryPanel />
    </DocEditContext.Provider>
  );
}

function CanvasBoard() {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const [handMode, setHandMode] = useState(false);
  const [viewingNodeId, setViewingNodeId] = useState<string | null>(null);
  const reconnectSuccessful = useRef(true);
  const { screenToFlowPosition, fitView, setCenter } = useReactFlow();
  const store = useStoreApi();
  const { editMode, setEditMode } = useContext(DocEditContext);

  useEffect(() => {
    if (editMode) {
      const { width, height } = store.getState();
      const horizontalPad = 24;
      const topPad = 32;
      const docWidth = 860;
      const zoom = Math.max(
        0.4,
        Math.min(1.5, (width - horizontalPad * 2) / docWidth),
      );
      const docCenterX = 680 + docWidth / 2;
      const centerY = (height / 2 - topPad) / zoom;
      setCenter(docCenterX, centerY, { zoom, duration: 600 });
    } else {
      fitView({ padding: 0.15, duration: 600 });
    }
  }, [editMode, fitView, setCenter, store]);

  const onView = useCallback((nodeId: string) => setViewingNodeId(nodeId), []);

  const onGenerate = useCallback(
    (sourceNodeId: string, prompt: string) => {
      setNodes((nds) => {
        if (nds.some((n) => n.id === "multi")) return nds;
        const source = nds.find((n) => n.id === sourceNodeId);
        const position = source
          ? { x: source.position.x + 320, y: source.position.y }
          : { x: 320, y: 0 };
        const multiNode: SourceNodeType = {
          id: "multi",
          type: "source",
          position,
          data: {
            title: "Multi-Variate Scenario Analysis",
            subtitle: prompt,
          },
        };
        return [...nds, multiNode];
      });

      setEdges((eds) => {
        if (eds.some((e) => e.id === "e-multi-doc")) return eds;
        const rewired = eds.filter(
          (e) => !(e.source === sourceNodeId && e.target === "doc"),
        );
        return [
          ...rewired,
          {
            id: `e-${sourceNodeId}-multi`,
            source: sourceNodeId,
            target: "multi",
            reconnectable: true,
          },
          {
            id: "e-multi-doc",
            source: "multi",
            target: "doc",
            reconnectable: true,
          },
        ];
      });
    },
    [setNodes, setEdges],
  );

  const nodeActions = useMemo(
    () => ({ onView, onGenerate }),
    [onView, onGenerate],
  );

  const viewingTable = viewingNodeId ? NODE_DATA_TABLES[viewingNodeId] : null;

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, reconnectable: true }, eds)),
    [setEdges],
  );

  const onReconnectStart = useCallback(() => {
    reconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      reconnectSuccessful.current = true;
      setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
    },
    [setEdges],
  );

  const onReconnectEnd = useCallback(
    (_: unknown, edge: Edge) => {
      if (!reconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      reconnectSuccessful.current = true;
    },
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const dataKey = event.dataTransfer.getData("application/scenario-node");
      if (!dataKey) return;
      const table = NODE_DATA_TABLES[dataKey];
      if (!table) return;
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode: SourceNodeType = {
        id: `${dataKey}-${Date.now()}`,
        type: "source",
        position,
        data: { title: table.title, dataKey },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes],
  );

  return (
    <NodeActionsContext.Provider value={nodeActions}>
      <ReactFlow<FlowNode>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnectStart={onReconnectStart}
        onReconnect={onReconnect}
        onReconnectEnd={onReconnectEnd}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={(_, node) => {
          if (node.id === "doc" && !editMode) setEditMode(true);
        }}
        onPaneClick={() => {
          if (editMode) setEditMode(false);
        }}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          style: { stroke: "#9ca3af", strokeWidth: 1.5 },
        }}
        connectionLineStyle={{ stroke: "#9ca3af", strokeWidth: 1.5 }}
        nodesDraggable={!handMode && !editMode}
        nodesConnectable={!editMode}
        panOnDrag={editMode ? false : handMode ? [0, 1, 2] : [1, 2]}
        selectionOnDrag={!handMode && !editMode}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.25}
        maxZoom={2}
        deleteKeyCode={editMode ? null : ["Backspace", "Delete"]}
        proOptions={{ hideAttribution: true }}
        colorMode="dark"
        style={{ background: "transparent" }}
      />
      <CanvasControls handMode={handMode} setHandMode={setHandMode} />
      <DataTableDialog
        table={viewingTable}
        open={viewingNodeId !== null}
        onOpenChange={(open) => {
          if (!open) setViewingNodeId(null);
        }}
      />
    </NodeActionsContext.Provider>
  );
}

function DataTableDialog({
  table,
  open,
  onOpenChange,
}: {
  table: DataTable | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-background ring-0 border border-border p-0 gap-0 sm:max-w-[720px] w-[720px] max-h-[85vh] flex flex-col"
      >
        <DialogHeader className="p-4 pb-3 gap-1.5 shrink-0">
          <DialogTitle className="text-base font-medium text-foreground font-sans">
            {table?.title ?? ""}
          </DialogTitle>
          <DialogDescription>{table?.description ?? ""}</DialogDescription>
        </DialogHeader>
        {table && (
          <div className="flex-1 min-h-0 overflow-auto px-4 pb-4">
            <table className="w-full caption-bottom text-sm">
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow className="border-b border-border hover:bg-transparent">
                  {table.columns.map((col) => (
                    <TableHead
                      key={col}
                      className="h-10 px-2 text-foreground font-medium"
                    >
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.rows.map((row, rowIdx) => (
                  <TableRow
                    key={rowIdx}
                    className={
                      rowIdx === table.rows.length - 1
                        ? "border-0 hover:bg-transparent"
                        : "border-b border-border hover:bg-transparent"
                    }
                  >
                    {row.map((cell, cellIdx) => (
                      <TableCell
                        key={cellIdx}
                        className={
                          cellIdx === 0
                            ? "p-2 text-foreground font-medium"
                            : "p-2 text-foreground"
                        }
                      >
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </table>
          </div>
        )}
        <DialogFooter className="m-0 border-t border-border bg-gray-900/50 p-4 rounded-b-xl sm:justify-end shrink-0">
          <DialogClose render={<Button variant="outline" size="sm" />}>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CanvasControls({
  handMode,
  setHandMode,
}: {
  handMode: boolean;
  setHandMode: (v: boolean) => void;
}) {
  const zoom = useStore((s) => s.transform[2]);
  const { fitView } = useReactFlow();

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-gray-800 rounded-full p-2 flex items-center gap-2">
      <button
        type="button"
        onClick={() => setHandMode(false)}
        aria-label="Select tool"
        className={`size-8 rounded-full flex items-center justify-center transition ${
          !handMode
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground hover:text-foreground"
        }`}
      >
        <MousePointer2 className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => setHandMode(true)}
        aria-label="Pan tool"
        className={`size-8 rounded-full flex items-center justify-center transition ${
          handMode
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground hover:text-foreground"
        }`}
      >
        <Hand className="size-4" />
      </button>
      <span className="w-px h-5 bg-border" />
      <button
        type="button"
        aria-label="Undo"
        className="size-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition"
      >
        <Undo2 className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Redo"
        className="size-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition"
      >
        <Redo2 className="size-4" />
      </button>
      <span className="w-px h-5 bg-border" />
      <button
        type="button"
        onClick={() => fitView({ padding: 0.15 })}
        className="flex items-center gap-1 pl-2 pr-1 text-sm text-white hover:opacity-80 transition"
      >
        <span>{Math.round(zoom * 100)}%</span>
        <ChevronDown className="size-4" />
      </button>
    </div>
  );
}

function LibraryPanel() {
  const { editMode } = useContext(DocEditContext);
  return (
    <aside className="relative z-10 w-[360px] shrink-0 h-full backdrop-blur-xl bg-glass rounded-xl p-6 flex flex-col gap-6 overflow-hidden">
      <Tabs defaultValue="library">
        <TabsList variant="line">
          <TabsTrigger value="copilot">Lenders Copilot</TabsTrigger>
          <TabsTrigger value="library">Library</TabsTrigger>
        </TabsList>
      </Tabs>

      {editMode ? (
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 pr-1">
          {LIBRARY_VISUALS.map((visual) => (
            <LibraryVisualCard
              key={visual.id}
              id={visual.id}
              title={visual.title}
            />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="data" className="flex-1 min-h-0">
          <TabsList className="w-full">
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="outputs">Outputs</TabsTrigger>
          </TabsList>
          <TabsContent
            value="data"
            className="flex flex-col gap-4 min-h-0 overflow-y-auto"
          >
            {LIBRARY_NODES.map((node) => (
              <LibraryNodeCard
                key={node.id}
                dataKey={node.id}
                title={node.title}
              />
            ))}
            <Button variant="secondary" className="w-full mt-auto">
              Upload Data
            </Button>
          </TabsContent>
          <TabsContent value="outputs" className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">No outputs yet.</p>
          </TabsContent>
        </Tabs>
      )}
    </aside>
  );
}

function LibraryVisualCard({ id, title }: { id: VisualId; title: string }) {
  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/visual-id", id);
        event.dataTransfer.effectAllowed = "copy";
      }}
      className="bg-gray-900 rounded-md p-6 flex flex-col gap-4 cursor-grab active:cursor-grabbing"
    >
      <p className="text-sm font-medium text-white">{title}</p>
      <VisualPreview id={id} variant="library" />
    </div>
  );
}

function LibraryNodeCard({
  title,
  dataKey,
}: {
  title: string;
  dataKey: string;
}) {
  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("application/scenario-node", dataKey);
        event.dataTransfer.effectAllowed = "move";
      }}
      className="bg-gray-900 rounded-md p-6 flex flex-col gap-4 cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center gap-2">
        <p className="flex-1 text-sm font-medium text-white">{title}</p>
        <Eye className="size-4 text-muted-foreground" />
      </div>
      <div className="bg-gray-800 rounded-md h-[140px] flex items-center justify-center">
        <Table2 className="size-12 text-muted-foreground" />
      </div>
    </div>
  );
}
