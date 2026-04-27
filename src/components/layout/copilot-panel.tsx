"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { Chat } from "@ai-sdk/react";
import { Plus, Send, Square } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";

type PromptSuggestion = { badge?: string; prompt: string };

const DEFAULT_PROMPTS: PromptSuggestion[] = [
  {
    badge: "Market Gaps",
    prompt:
      "Find clients who have applied for new permits (commercial real estate) and determine if they have the liquidity to do it.",
  },
  {
    badge: "Portfolio triage",
    prompt:
      "Priority action items based on real-time portfolio performance signals and risk assessment modeling",
  },
  {
    badge: "Operational & Compliance",
    prompt:
      "Which borrowers are at risk of covenant violations in the next 90 days?",
  },
  {
    badge: "Performance signals",
    prompt: "Summarize DSO trends across the portfolio and flag any outliers.",
  },
  {
    badge: "Upsell signals",
    prompt:
      "Identify borrowers with high utilization that may need a credit line increase.",
  },
];

const OPPORTUNITY_PROMPTS: PromptSuggestion[] = [
  {
    badge: "Defensive insights",
    prompt:
      "Show me clients who recently had a new UCC filing with a competitor determine if they are our customer, if so summarize our last three interactions and the overall sentiment.",
  },
  {
    badge: "Networking",
    prompt:
      "I'm meeting with Vanguard provide any recent relevant news about them and summarize our last three interactions to provide me with a few talking points.",
  },
  {
    badge: "Market Gaps",
    prompt:
      "Who has grown 15% this year, but doesn't currently have a product with us?",
  },
];

const RISK_PROMPTS: PromptSuggestion[] = [
  {
    badge: "Deal intention vs reality",
    prompt:
      "Identify any borrowers whose monthly debt service is now being paid from an 'Interest Reserve' instead of property operations",
  },
  {
    badge: "Behavioral",
    prompt:
      "Identify borrowers who have requested more than two 'Payment Date' extensions in the last six months",
  },
  {
    badge: "Operational & Compliance",
    prompt:
      "Audit the portfolio for any UCC-1 filings expiring in the next 120 days where a 'Continuation' hasn't been drafted",
  },
];

const LOAN_EVAL_PROMPTS: PromptSuggestion[] = [
  {
    badge: "Deal structuring",
    prompt:
      "Suggests pricing/structure and covenants based on similar deals that have gotten approved",
  },
  ...DEFAULT_PROMPTS,
];

function usePromptSuggestions(): PromptSuggestion[] {
  const pathname = usePathname();
  if (
    pathname === "/risks" ||
    pathname.startsWith("/risks/") ||
    pathname.startsWith("/risk/")
  ) {
    return RISK_PROMPTS;
  }
  if (
    pathname === "/opportunities" ||
    pathname.startsWith("/opportunities/") ||
    pathname.startsWith("/borrower/")
  ) {
    return OPPORTUNITY_PROMPTS;
  }
  if (
    pathname === "/loan-evaluation" ||
    pathname.startsWith("/loan-evaluation/")
  ) {
    return LOAN_EVAL_PROMPTS;
  }
  return DEFAULT_PROMPTS;
}

function getMessageText(msg: { parts: ReadonlyArray<{ type: string; text?: string }> }) {
  return msg.parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => (p as { text: string }).text)
    .join("");
}

function renderInline(text: string, keyPrefix: string) {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={`${keyPrefix}-b-${i++}`} className="font-semibold">
        {match[1]}
      </strong>,
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

type ChartSpec = {
  type: "bar" | "line" | "pie";
  title?: string;
  unit?: string;
  data: Array<{ name: string; value: number }>;
};

const CHART_PALETTE = ["#4bcd3e", "#22d3ee", "#f59e0b", "#a78bfa", "#f472b6", "#2f9d24"];

function ChartBlock({ spec }: { spec: ChartSpec }) {
  const unit = spec.unit ?? "";
  const formatValue = (v: unknown) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? `${n.toLocaleString()}${unit}` : String(v);
  };
  return (
    <div className="my-1 rounded-lg bg-gray-900 p-3">
      {spec.title && (
        <p className="text-xs font-semibold text-foreground mb-2">
          {spec.title}
        </p>
      )}
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {spec.type === "bar" ? (
            <BarChart data={spec.data}>
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={formatValue}
              />
              <Bar dataKey="value" fill="#4bcd3e" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : spec.type === "line" ? (
            <LineChart data={spec.data}>
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={formatValue}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4bcd3e"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          ) : (
            <PieChart>
              <Pie
                data={spec.data}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                dataKey="value"
                stroke="none"
              >
                {spec.data.map((_, i) => (
                  <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={formatValue}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChartLoading() {
  const bars = [0.55, 0.8, 0.65, 0.9, 0.45, 0.75, 0.6];
  return (
    <div className="my-1 rounded-lg bg-gray-900 p-3">
      <div className="h-3 w-32 rounded bg-gray-800 mb-3 animate-pulse" />
      <div className="h-[180px] flex items-end gap-1.5 px-1">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-gray-800 animate-pulse"
            style={{ height: `${h * 100}%`, animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function repairChartJson(raw: string): string {
  return (
    raw
      // strip stray `{"` that appears between array entries, e.g. `,{"{"name":...`
      .replace(/,\s*\{\s*"\{\s*"/g, ',{"')
      // same pattern at array start
      .replace(/\[\s*\{\s*"\{\s*"/g, '[{"')
      // collapse accidental double opening braces `{{`
      .replace(/\{\s*\{/g, "{")
      // strip trailing commas inside arrays/objects
      .replace(/,\s*([}\]])/g, "$1")
      // missing comma between entries: `}{` → `},{`
      .replace(/\}\s*\{/g, "},{")
  );
}

// Last-resort salvage: pull fields via regex even when JSON is unrecoverable.
function salvageChartSpec(raw: string): ChartSpec | null {
  const typeMatch = raw.match(/"type"\s*:\s*"(bar|line|pie)"/);
  if (!typeMatch) return null;
  const titleMatch = raw.match(/"title"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
  const unitMatch = raw.match(/"unit"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
  const entryRegex =
    /"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*,\s*"value"\s*:\s*(-?\d+(?:\.\d+)?)/g;
  const data: Array<{ name: string; value: number }> = [];
  let m;
  while ((m = entryRegex.exec(raw)) !== null) {
    data.push({ name: m[1], value: Number(m[2]) });
  }
  if (data.length === 0) return null;
  return {
    type: typeMatch[1] as ChartSpec["type"],
    title: titleMatch?.[1],
    unit: unitMatch?.[1],
    data,
  };
}

function coerceDataEntry(
  entry: unknown,
): { name: string; value: number } | null {
  if (!entry || typeof entry !== "object") return null;
  const obj = entry as Record<string, unknown>;
  // Preferred keys first
  if (typeof obj.name === "string" && typeof obj.value === "number") {
    return { name: obj.name, value: obj.value };
  }
  // Fallback: first string field = name, first finite-number field = value
  let name: string | null = null;
  let value: number | null = null;
  for (const [, v] of Object.entries(obj)) {
    if (name === null && typeof v === "string") name = v;
    else if (value === null && typeof v === "number" && Number.isFinite(v)) {
      value = v;
    }
    if (name !== null && value !== null) break;
  }
  if (name !== null && value !== null) return { name, value };
  return null;
}

function tryParseSpec(raw: string): ChartSpec | null {
  for (const candidate of [raw, repairChartJson(raw)]) {
    try {
      const parsed = JSON.parse(candidate) as Partial<ChartSpec>;
      if (
        parsed &&
        (parsed.type === "bar" ||
          parsed.type === "line" ||
          parsed.type === "pie") &&
        Array.isArray(parsed.data)
      ) {
        const data: Array<{ name: string; value: number }> = [];
        for (const entry of parsed.data) {
          const coerced = coerceDataEntry(entry);
          if (coerced) data.push(coerced);
        }
        if (data.length > 0) {
          return {
            type: parsed.type,
            title: parsed.title,
            unit: parsed.unit,
            data,
          };
        }
      }
    } catch {
      // try next candidate
    }
  }
  const salvaged = salvageChartSpec(raw);
  if (salvaged) return salvaged;
  if (typeof console !== "undefined") {
    console.warn("[copilot] failed to parse chart block:", raw);
  }
  return null;
}

function parseChartBlocks(
  text: string,
  isStreaming: boolean,
): Array<
  | { kind: "text"; content: string }
  | { kind: "chart"; spec: ChartSpec }
  | { kind: "chart-error" }
  | { kind: "chart-loading" }
> {
  const regex = /```chart\s*\n([\s\S]*?)```/g;
  const out: Array<
    | { kind: "text"; content: string }
    | { kind: "chart"; spec: ChartSpec }
    | { kind: "chart-error" }
    | { kind: "chart-loading" }
  > = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      out.push({ kind: "text", content: text.slice(lastIndex, match.index) });
    }
    const spec = tryParseSpec(match[1]);
    if (spec) {
      out.push({ kind: "chart", spec });
    } else if (!isStreaming) {
      out.push({ kind: "chart-error" });
    }
    lastIndex = regex.lastIndex;
  }
  // Detect an unclosed ```chart … block still streaming and replace it with a loader
  const tail = text.slice(lastIndex);
  const openIdx = tail.indexOf("```chart");
  if (openIdx !== -1) {
    if (openIdx > 0) {
      out.push({ kind: "text", content: tail.slice(0, openIdx) });
    }
    if (isStreaming) {
      out.push({ kind: "chart-loading" });
    } else {
      // stream ended without a closing fence — treat as error
      out.push({ kind: "chart-error" });
    }
  } else if (tail.length > 0) {
    out.push({ kind: "text", content: tail });
  }
  return out;
}

function TextBlock({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="text-sm text-foreground leading-relaxed flex flex-col gap-2">
      {lines.map((line, i) => {
        const heading = line.match(/^\s*(#{1,6})\s+(.*)$/);
        if (heading) {
          return (
            <p key={i} className="font-semibold">
              {renderInline(heading[2], `h-${i}`)}
            </p>
          );
        }
        if (line.trim() === "") {
          return <span key={i} className="h-1" />;
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            {renderInline(line, `l-${i}`)}
          </p>
        );
      })}
    </div>
  );
}

function FormattedMessage({
  text,
  isStreaming,
}: {
  text: string;
  isStreaming: boolean;
}) {
  const blocks = parseChartBlocks(text, isStreaming);
  return (
    <div className="flex flex-col gap-2">
      {blocks.map((block, i) => {
        if (block.kind === "chart") {
          return <ChartBlock key={i} spec={block.spec} />;
        }
        if (block.kind === "chart-loading") {
          return <ChartLoading key={i} />;
        }
        if (block.kind === "chart-error") {
          return (
            <p
              key={i}
              className="text-xs italic text-muted-foreground rounded-md bg-gray-900 px-3 py-2"
            >
              Couldn&apos;t render chart — malformed data.
            </p>
          );
        }
        return <TextBlock key={i} text={block.content} />;
      })}
    </div>
  );
}

export function CopilotPanel({ className }: { className?: string }) {
  return (
    <aside className={`w-[360px] shrink-0 backdrop-blur-xl bg-glass rounded-xl overflow-hidden p-6 flex flex-col gap-4 h-full ${className ?? ""}`}>
      <div className="shrink-0">
        <h2 className="text-sm text-foreground">
          Lenders Co-pilot
        </h2>
      </div>
      <CopilotChat />
    </aside>
  );
}

export function CopilotChat() {
  const chat = useMemo(() => new Chat({ messages: [] }), []);
  const { messages, sendMessage, stop, status, error, clearError } = useChat({
    chat,
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const promptSuggestions = usePromptSuggestions();

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    sendMessage({ text: trimmed });
  }

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Chat Messages or Recommended Prompts */}
      <div className="flex-1 min-h-0 flex flex-col">
        {hasMessages ? (
          <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3 pr-1">
            {messages.map((msg: { id: string; role: string; parts: ReadonlyArray<{ type: string; text?: string }> }, msgIdx) => {
              const text = getMessageText(msg);
              if (!text) return null;
              const isLast = msgIdx === messages.length - 1;
              const msgStreaming =
                isLast && msg.role === "assistant" && status === "streaming";
              return (
                <div
                  key={msg.id}
                  className={
                    msg.role === "user"
                      ? "self-end bg-secondary rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[85%]"
                      : "self-start bg-card rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[85%]"
                  }
                >
                  <FormattedMessage text={text} isStreaming={msgStreaming} />
                </div>
              );
            })}
            {status === "submitted" && (
              <div className="self-start bg-card rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%]">
                <div className="flex gap-1.5 items-center">
                  <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                  <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                  <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-auto">
            <span className="text-xs font-medium text-foreground">
              Recommended Prompts
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-6 px-6 scrollbar-hide">
              {promptSuggestions.map((suggestion, i) => (
                <button
                  key={i}
                  className="bg-gray-900 rounded-md p-4 text-sm text-muted-foreground text-left hover:bg-secondary transition-colors w-[200px] min-w-[200px] shrink-0 flex flex-col gap-2"
                  onClick={() => handleSend(suggestion.prompt)}
                >
                  {suggestion.badge && (
                    <Badge variant="secondary" className="self-start">
                      {suggestion.badge}
                    </Badge>
                  )}
                  <span>{suggestion.prompt}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="shrink-0 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive flex items-start gap-2">
          <span className="flex-1 leading-relaxed">
            {error.message || "Something went wrong. Check the server logs."}
          </span>
          <button
            type="button"
            onClick={() => clearError()}
            className="text-destructive/70 hover:text-destructive shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Chat Input */}
      <div className="bg-card rounded-full flex items-center gap-2 px-6 py-4 shrink-0">
        <input
          type="text"
          placeholder="Your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend(input);
          }}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        <button
          type="button"
          className="size-8 rounded-full border border-input bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="size-4" />
        </button>
        {isLoading ? (
          <button
            type="button"
            onClick={() => stop()}
            className="size-8 rounded-full bg-destructive/20 flex items-center justify-center text-destructive hover:bg-destructive/30 transition-colors"
          >
            <Square className="size-3" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSend(input)}
            className="size-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Send className="size-4" />
          </button>
        )}
      </div>
    </>
  );
}
