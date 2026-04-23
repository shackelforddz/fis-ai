"use client";

import {
  use,
  useState,
  useRef,
  useEffect,
  DragEvent,
  MouseEvent as ReactMouseEvent,
  Suspense,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
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
  Undo2,
  Redo2,
  X,
  FileText,
  FileSpreadsheet,
  FileType,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CopilotChat } from "@/components/layout/copilot-panel";
import { cn } from "@/lib/utils";
import { loanEvaluations, borrowers } from "@/lib/mock-data";
import {
  performanceData,
  erpData,
  experianScore,
  ficoScore,
  performanceStats,
  erpStats,
  experianStats,
  ficoStats,
  type Stat,
} from "@/lib/loan-detail-data";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { EditableBlock } from "./editable-block";
import { TemplateContent, TEMPLATES, type TemplateKey } from "./templates";

type VisualId = "performance" | "erp" | "experian" | "fico";

const LIBRARY_VISUALS: {
  id: VisualId;
  title: string;
  subtitle?: string;
  stats: Stat[];
}[] = [
  {
    id: "performance",
    title: "Performance Analysis",
    subtitle: "12-month trend",
    stats: performanceStats,
  },
  {
    id: "erp",
    title: "ERP Data",
    subtitle: "Revenue vs. EBITDA",
    stats: erpStats,
  },
  {
    id: "experian",
    title: "Experian Score",
    subtitle: "Credit bureau",
    stats: experianStats,
  },
  {
    id: "fico",
    title: "FICO Score",
    subtitle: "Credit bureau",
    stats: ficoStats,
  },
];

function DocStatRow({ items }: { items: Stat[] }) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
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

const LIBRARY_PALETTE = ["#4bcd3e", "#16a34a", "#15803d", "#166534"] as const;
const DOCUMENT_PALETTE = ["#6366f1", "#4f46e5", "#4338ca", "#3730a3"] as const;

type ChartVariant = "library" | "document";

function DonutScore({
  score,
  max,
  size = "sm",
  variant = "library",
}: {
  score: number;
  max: number;
  size?: "sm" | "md";
  variant?: ChartVariant;
}) {
  const percentage = (score / max) * 100;
  const data = [
    { name: "Score", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];
  const dim = size === "sm" ? 96 : 180;
  const inner = size === "sm" ? "60%" : "65%";
  const outer = size === "sm" ? "85%" : "85%";
  const palette = variant === "document" ? DOCUMENT_PALETTE : LIBRARY_PALETTE;
  return (
    <div
      className="relative mx-auto"
      style={{ width: dim, height: dim }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={inner}
            outerRadius={outer}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={palette[0]} />
            <Cell fill="rgba(255,255,255,0.1)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={cn(
            "font-bold",
            size === "sm" ? "text-lg" : "text-4xl",
            variant === "document" ? "text-gray-900" : "text-foreground",
          )}
        >
          {score}
        </span>
      </div>
    </div>
  );
}

function VisualPreview({
  id,
  size = "sm",
  variant = "library",
}: {
  id: VisualId;
  size?: "sm" | "md";
  variant?: ChartVariant;
}) {
  const h = size === "sm" ? 100 : 220;
  const palette = variant === "document" ? DOCUMENT_PALETTE : LIBRARY_PALETTE;
  if (id === "performance") {
    return (
      <ResponsiveContainer width="100%" height={h}>
        <LineChart data={performanceData}>
          {size === "md" && (
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
          )}
          <Line type="monotone" dataKey="series1" stroke={palette[0]} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="series2" stroke={palette[3]} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  if (id === "erp") {
    return (
      <ResponsiveContainer width="100%" height={h}>
        <LineChart data={erpData}>
          {size === "md" && (
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
          )}
          <Line type="monotone" dataKey="revenue" stroke={palette[1]} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="ebitda" stroke={palette[2]} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  if (id === "experian") {
    return <DonutScore score={experianScore} max={100} size={size} variant={variant} />;
  }
  return <DonutScore score={ficoScore} max={1500} size={size} variant={variant} />;
}

function ToolbarButton({
  children,
  active,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: (e: ReactMouseEvent<HTMLButtonElement>) => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`size-8 rounded-full flex items-center justify-center text-sm transition-colors ${
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

type InsertedVisual = {
  instanceId: string;
  visualId: VisualId;
  element: HTMLElement;
};

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

export default function DocumentCreatorPage({
  params,
}: {
  params: Promise<{ loanId: string }>;
}) {
  const { loanId } = use(params);
  return (
    <Suspense fallback={null}>
      <DocumentCreator loanId={loanId} />
    </Suspense>
  );
}

function DocumentCreator({ loanId }: { loanId: string }) {
  const searchParams = useSearchParams();
  const templateKey = (searchParams.get("template") as TemplateKey) || "credit-memo";
  const template = TEMPLATES[templateKey] ?? TEMPLATES["credit-memo"];

  const loan = loanEvaluations.find((l) => l.id === loanId) ?? loanEvaluations[0];
  const borrower = borrowers.find((b) =>
    b.name.toLowerCase().includes(loan.borrowerName.toLowerCase().split(" ")[0])
  );

  const [activeTab, setActiveTab] = useState<"copilot" | "library">("library");
  const [insertedVisuals, setInsertedVisuals] = useState<InsertedVisual[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [indicatorTop, setIndicatorTop] = useState<number | null>(null);
  const docRef = useRef<HTMLDivElement>(null);

  const [toolbar, setToolbar] = useState({
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
      const anchor = sel?.anchorNode as Node | null;
      const insideEditable =
        anchor instanceof Node &&
        !!(anchor.nodeType === 1
          ? (anchor as Element).closest('[contenteditable="true"]')
          : anchor.parentElement?.closest('[contenteditable="true"]'));
      if (!insideEditable) return;
      const block = (document.queryCommandValue("formatBlock") || "").toLowerCase();
      setToolbar({
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

  function runCommand(command: string, value?: string) {
    document.execCommand(command, false, value);
  }

  function toggleBlock(tag: "h1" | "h2" | "h3") {
    const current = (document.queryCommandValue("formatBlock") || "").toLowerCase();
    const next = current === tag ? "p" : tag;
    runCommand("formatBlock", next);
  }

  function handleDragStart(e: DragEvent<HTMLDivElement>, id: VisualId) {
    e.dataTransfer.setData("text/visual-id", id);
    e.dataTransfer.effectAllowed = "copy";
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    if (!e.dataTransfer.types.includes("text/visual-id")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
    const docRoot = docRef.current;
    if (!docRoot) return;
    const { top } = computeDropInsertion(docRoot, e.clientY);
    setIndicatorTop(top);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    const related = e.relatedTarget as globalThis.Node | null;
    if (related && docRef.current?.contains(related)) return;
    setIsDragOver(false);
    setIndicatorTop(null);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    const visualId = e.dataTransfer.getData("text/visual-id") as VisualId;
    if (!visualId || !LIBRARY_VISUALS.some((v) => v.id === visualId)) return;
    e.preventDefault();
    setIsDragOver(false);
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

    setInsertedVisuals((prev) => [...prev, { instanceId, visualId, element: slot }]);
  }

  function removeVisual(instanceId: string) {
    setInsertedVisuals((prev) => {
      const found = prev.find((v) => v.instanceId === instanceId);
      if (found) found.element.remove();
      return prev.filter((v) => v.instanceId !== instanceId);
    });
  }

  const documentTitle = `${loan.borrowerName} ${template.titleSuffix}`;

  return (
    <>
      {/* Main Editor Panel */}
      <main className="relative z-10 flex-1 min-w-0 backdrop-blur-xl bg-glass rounded-xl p-6 flex flex-col gap-6 h-full overflow-y-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground shrink-0">
          <Link
            href="/loan-evaluation"
            className="hover:text-foreground transition-colors"
          >
            Loan Evaluation Center
          </Link>
          <ChevronRight className="size-4 mx-1 inline-block" />
          <Link
            href={`/loan-evaluation/${loan.id}`}
            className="hover:text-foreground transition-colors"
          >
            {loan.borrowerName}
          </Link>
          <ChevronRight className="size-4 mx-1 inline-block" />
          <span className="text-foreground">Document Creator</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between gap-6 shrink-0">
          <div className="min-w-0">
            <h1 className="text-3xl text-foreground leading-9 truncate">
              {documentTitle}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Template: {template.label}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              render={<Link href={`/loan-evaluation/${loan.id}`} />}
            >
              Close
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="secondary">
                    Export
                    <ChevronDown className="size-4" data-icon="inline-end" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="min-w-40">
                <DropdownMenuItem>
                  <FileText className="size-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileSpreadsheet className="size-4" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileType className="size-4" />
                  Export as Word
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>Save</Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-0.5 bg-gray-900 rounded-full px-2 py-1">
            <ToolbarButton
              title="Bold"
              active={toolbar.bold}
              onClick={() => runCommand("bold")}
            >
              <Bold className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Italic"
              active={toolbar.italic}
              onClick={() => runCommand("italic")}
            >
              <Italic className="size-4" />
            </ToolbarButton>
            <ToolbarDivider />
            <ToolbarButton
              title="Heading 1"
              active={toolbar.h1}
              onClick={() => toggleBlock("h1")}
            >
              <Heading1 className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Heading 2"
              active={toolbar.h2}
              onClick={() => toggleBlock("h2")}
            >
              <Heading2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Heading 3"
              active={toolbar.h3}
              onClick={() => toggleBlock("h3")}
            >
              <Heading3 className="size-4" />
            </ToolbarButton>
            <ToolbarDivider />
            <ToolbarButton
              title="Bulleted list"
              active={toolbar.ul}
              onClick={() => runCommand("insertUnorderedList")}
            >
              <List className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Numbered list"
              active={toolbar.ol}
              onClick={() => runCommand("insertOrderedList")}
            >
              <ListOrdered className="size-4" />
            </ToolbarButton>
            <ToolbarDivider />
            <ToolbarButton
              title="Align left"
              active={toolbar.alignLeft}
              onClick={() => runCommand("justifyLeft")}
            >
              <AlignLeft className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Align center"
              active={toolbar.alignCenter}
              onClick={() => runCommand("justifyCenter")}
            >
              <AlignCenter className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Align right"
              active={toolbar.alignRight}
              onClick={() => runCommand("justifyRight")}
            >
              <AlignRight className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Justify"
              active={toolbar.alignJustify}
              onClick={() => runCommand("justifyFull")}
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
                  runCommand("insertImage", url);
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
                runCommand("foreColor", e.target.value);
              }}
            />
          </div>
          <div className="flex items-center gap-0.5 bg-gray-900 rounded-full px-2 py-1 ml-auto">
            <ToolbarButton title="Undo" onClick={() => runCommand("undo")}>
              <Undo2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton title="Redo" onClick={() => runCommand("redo")}>
              <Redo2 className="size-4" />
            </ToolbarButton>
          </div>
        </div>

        {/* Document Preview */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          ref={docRef}
          className={`doc-preview relative bg-white rounded-xl p-10 flex flex-col gap-6 text-gray-900 transition-colors ${
            isDragOver ? "ring-2 ring-primary" : ""
          }`}
        >
          {/* Hero */}
          <div className="bg-[#6366f1] rounded-xl py-10 px-6 text-center">
            <EditableBlock
              as="h2"
              initialHtml={documentTitle}
              className="text-2xl font-bold text-white"
            />
          </div>

          {/* Template-driven content */}
          <TemplateContent
            templateKey={templateKey}
            loan={loan}
            borrower={borrower}
          />

          {/* Trailing editable area */}
          <EditableBlock
            as="div"
            initialHtml=""
            placeholder="Start typing to add more content, or drag a visual from the Library…"
            className="text-sm leading-relaxed min-h-[60px]"
          />

          {indicatorTop !== null && (
            <div
              data-indicator="true"
              className="absolute left-10 right-10 h-1 bg-primary rounded-full pointer-events-none shadow-[0_0_0_4px_rgba(75,205,62,0.25)]"
              style={{ top: `${indicatorTop - 2}px` }}
            />
          )}
        </div>
        {insertedVisuals.map((v) => {
          const meta = LIBRARY_VISUALS.find((x) => x.id === v.visualId);
          if (!meta) return null;
          return createPortal(
            <section className="flex flex-col gap-3 group relative">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <EditableBlock
                  as="h3"
                  initialHtml={meta.title}
                  className="text-base font-bold flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeVisual(v.instanceId)}
                  className="opacity-0 group-hover:opacity-100 size-6 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-opacity"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="h-[220px]">
                <VisualPreview id={v.visualId} size="md" variant="document" />
              </div>
              <DocStatRow items={meta.stats} />
            </section>,
            v.element,
            v.instanceId,
          );
        })}
      </main>

      {/* Right Panel — Copilot / Library */}
      <aside className="relative z-10 w-[360px] shrink-0 backdrop-blur-xl bg-glass rounded-xl overflow-hidden p-6 flex flex-col gap-4 h-full">
        {/* Tabs */}
        <div className="flex items-center gap-6 shrink-0 border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab("copilot")}
            className={`text-sm pb-2 -mb-px transition-colors ${
              activeTab === "copilot"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Lenders Copilot
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("library")}
            className={`text-sm pb-2 -mb-px transition-colors ${
              activeTab === "library"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Library
          </button>
        </div>

        {activeTab === "library" ? (
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 pr-1 -mr-2">
            {LIBRARY_VISUALS.map((visual) => (
              <div
                key={visual.id}
                draggable
                onDragStart={(e) => handleDragStart(e, visual.id)}
                className="bg-gray-900 rounded-xl p-4 flex flex-col gap-3 cursor-grab active:cursor-grabbing hover:ring-1 hover:ring-primary/40 transition-all"
              >
                <div>
                  <h4 className="text-sm text-foreground">{visual.title}</h4>
                  {visual.subtitle && (
                    <p className="text-xs text-muted-foreground">
                      {visual.subtitle}
                    </p>
                  )}
                </div>
                <div className="border-t border-border pt-3">
                  <VisualPreview id={visual.id} size="sm" variant="library" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <CopilotChat />
        )}
      </aside>
    </>
  );
}
