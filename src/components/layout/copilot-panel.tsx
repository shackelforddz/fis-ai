"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Send } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const recommendedPrompts = [
  "Find clients who have applied for new permits (commercial real estate) and determine if they have the liquidity to do it.",
  "Priority action items based on real-time portfolio performance signals and risk assessment modeling",
  "Which borrowers are at risk of covenant violations in the next 90 days?",
  "Summarize DSO trends across the portfolio and flag any outliers.",
  "Identify borrowers with high utilization that may need a credit line increase.",
];

const simulatedResponses: Record<string, string> = {
  [recommendedPrompts[0]]:
    "I found 3 clients with recent commercial real estate permit applications:\n\n1. **Apex Manufacturing Corp** — Filed for a 12,000 sq ft warehouse expansion permit on 03/15. Current liquidity ratio is 2.4x with $3.2M in available credit. They have sufficient liquidity to support the project.\n\n2. **Greenfield Logistics** — Applied for a new distribution center permit on 02/28. Liquidity ratio is 1.1x with limited cash reserves. This may require additional financing.\n\n3. **Summit Healthcare** — Filed for a medical office build-out on 03/01. Strong liquidity at 3.1x with $5.8M undrawn on their revolver.\n\nWould you like me to generate a detailed risk assessment for any of these borrowers?",
  [recommendedPrompts[1]]:
    "Based on current portfolio signals, here are your top priority actions:\n\n1. **Apex Manufacturing Corp** (Score: 82) — Revenue up 34% YoY with declining DSO. Strong upsell candidate for equipment line expansion. Recommend scheduling a review this week.\n\n2. **Greenfield Logistics** (Score: 68) — Utilization trending above 85% for 3 consecutive months. Consider a working capital increase before covenant pressure builds.\n\n3. **Pacific Coast Distributors** (Score: 45) — Missed last covenant reporting deadline. Payment behavior deteriorating. Flag for proactive outreach.\n\nShall I draft outreach emails or pull detailed signal reports for any of these?",
  [recommendedPrompts[2]]:
    "I've identified 2 borrowers at elevated covenant risk within the next 90 days:\n\n1. **Pacific Coast Distributors** — Current ratio at 1.18x against a 1.15x minimum. Declining cash flow and a missed reporting deadline suggest potential breach by Q3.\n\n2. **Greenfield Logistics** — Debt-to-EBITDA at 3.8x versus a 4.0x cap. Seasonal revenue dip expected in May could push them over the threshold.\n\nAll other borrowers have comfortable headroom. Would you like me to set up monitoring alerts for these two?",
  [recommendedPrompts[3]]:
    "Portfolio DSO summary (trailing 12 months):\n\n- **Average DSO**: 38 days (down from 43 days YoY)\n- **Best performer**: Apex Manufacturing at 31 days (-17 days YoY)\n- **Outlier**: Pacific Coast Distributors at 56 days (+8 days YoY) — significantly above the 41-day industry average\n\nThe overall trend is positive, driven by improved collections at Apex and Summit Healthcare. Pacific Coast is the clear outlier and warrants a review of their AR processes.\n\nWant me to pull the full DSO breakdown by borrower?",
  [recommendedPrompts[4]]:
    "3 borrowers are showing sustained high utilization:\n\n1. **Greenfield Logistics** — 87% average utilization over 3 months on a $4.5M revolver. Projected to hit 92% by end of quarter.\n\n2. **Pacific Coast Distributors** — 81% utilization with seasonal inventory build-up expected. May need a temporary overline.\n\n3. **Summit Healthcare** — 78% on equipment line, driven by new facility build-out. Likely short-term.\n\nGreenfield is the strongest candidate for a permanent line increase. Shall I draft a credit memo or schedule a portfolio review?",
};

const defaultResponse =
  "I've analyzed your request against the current portfolio data. Let me pull together the relevant signals and borrower profiles. Could you provide more detail on which segment or risk tier you'd like me to focus on?";

export function CopilotPanel({ className }: { className?: string }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessage("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setIsTyping(true);

    setTimeout(() => {
      const response = simulatedResponses[trimmed] ?? defaultResponse;
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1200);
  }

  const hasMessages = messages.length > 0;

  return (
    <aside className={`w-[360px] shrink-0 backdrop-blur-xl bg-glass rounded-xl overflow-hidden p-6 flex flex-col gap-4 h-full ${className ?? ""}`}>
      {/* Header */}
      <div className="shrink-0">
        <h2 className="text-xl text-foreground">
          Lenders Co-pilot
        </h2>
        <p className="text-lg text-muted-foreground">Your loan assistant</p>
      </div>

      {/* Chat Messages or Recommended Prompts */}
      <div className="flex-1 min-h-0 flex flex-col">
        {hasMessages ? (
          <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3 pr-1">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.role === "user"
                    ? "self-end bg-secondary rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[85%]"
                    : "self-start bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[85%]"
                }
              >
                <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                  {msg.content}
                </p>
              </div>
            ))}
            {isTyping && (
              <div className="self-start bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%]">
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
              {recommendedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  className="bg-card rounded-md p-4 text-sm text-muted-foreground text-left hover:bg-secondary transition-colors w-[200px] min-w-[200px] shrink-0"
                  onClick={() => handleSend(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="bg-card rounded-full flex items-center gap-2 px-6 py-4 shrink-0">
        <input
          type="text"
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend(message);
          }}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        <button className="size-8 rounded-full border border-input bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Plus className="size-4" />
        </button>
        <button
          onClick={() => handleSend(message)}
          className="size-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Send className="size-4" />
        </button>
      </div>
    </aside>
  );
}
