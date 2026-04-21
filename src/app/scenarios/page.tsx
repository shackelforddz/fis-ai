"use client";

import { Suspense, useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Chat, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loanEvaluations } from "@/lib/mock-data";

const TEMPLATE_PROMPTS = [
  "An investor is seeking a $15 million loan to purchase a 100-unit apartment complex. Their plan is to renovate the units, raise rents, and stabilize the property within 24 months.",
  "Priority action items based on real-time portfolio performance signals and risk assessment modeling",
  "Stress test Harbor Crew against a 100 bps rate increase and a six-month receivables slowdown",
];

function getMessageText(msg: {
  parts: ReadonlyArray<{ type: string; text?: string }>;
}) {
  return msg.parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => (p as { text: string }).text)
    .join("");
}

export default function ScenariosPage() {
  return (
    <Suspense fallback={null}>
      <ScenarioPrompt />
    </Suspense>
  );
}

function ScenarioPrompt() {
  const searchParams = useSearchParams();
  const borrowerId = searchParams.get("borrower");
  const borrower = borrowerId
    ? loanEvaluations.find((l) => l.id === borrowerId)
    : undefined;
  const borrowerName = borrower?.borrowerName ?? "Vanguard Logistics Ltd.";

  const chat = useMemo(
    () =>
      new Chat({
        messages: [],
        transport: new DefaultChatTransport({ api: "/api/scenario" }),
      }),
    [],
  );
  const { messages, sendMessage, status, error, clearError } = useChat({ chat });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "submitted" || status === "streaming";
  const hasMessages = messages.length > 0;

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

  const lastAssistantIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") return i;
    }
    return -1;
  })();

  return (
    <main className="relative z-10 flex-1 min-w-0 h-full backdrop-blur-xl bg-glass rounded-xl p-6 flex flex-col gap-12">
      {/* Breadcrumb */}
      <nav className="shrink-0 flex items-center gap-2.5 text-sm text-muted-foreground">
        <Link
          href="/loan-evaluation"
          className="hover:text-foreground transition-colors"
        >
          Loan Evaluation Center
        </Link>
        <ChevronRight className="size-4" />
        {borrower ? (
          <Link
            href={`/loan-evaluation/${borrower.id}`}
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

      {hasMessages ? (
        <div className="flex-1 min-h-0 flex flex-col items-center justify-end w-full">
          <div className="w-full max-w-[600px] flex flex-col gap-6">
            <div
              ref={scrollRef}
              className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-6 pr-1"
            >
              {messages.map((msg, i) => {
                const text = getMessageText(msg);
                if (!text) return null;
                const isUser = msg.role === "user";
                const showCta =
                  !isUser && i === lastAssistantIndex && !isLoading;
                return (
                  <div
                    key={msg.id}
                    className={isUser ? "flex justify-end" : "flex justify-start"}
                  >
                    <div
                      className={
                        isUser
                          ? "bg-gray-900 rounded-md p-4 max-w-[352px]"
                          : "bg-card rounded-md p-4 max-w-[351px] flex flex-col gap-2"
                      }
                    >
                      <p className="text-sm text-muted-foreground whitespace-pre-line leading-5">
                        {text}
                      </p>
                      {showCta && (
                        <div>
                          <Button
                            size="xs"
                            render={
                              <Link
                                href={
                                  borrowerId
                                    ? `/scenarios/canvas?borrower=${borrowerId}`
                                    : "/scenarios/canvas"
                                }
                              />
                            }
                          >
                            Generate Scenario
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {status === "submitted" && (
                <div className="flex justify-start">
                  <div className="bg-card rounded-md p-4 flex gap-1.5 items-center">
                    <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                    <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                    <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive flex items-start gap-2">
                <span className="flex-1 leading-relaxed">
                  {error.message || "Something went wrong."}
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

            <PromptInput
              value={input}
              onChange={setInput}
              onSend={() => handleSend(input)}
              placeholder="Your message"
              disabled={isLoading}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center w-full">
          <div className="w-full max-w-[600px] flex flex-col gap-6">
            <h1 className="text-xl font-medium text-foreground">
              What scenario would you like to run?
            </h1>

            <PromptInput
              value={input}
              onChange={setInput}
              onSend={() => handleSend(input)}
              placeholder="Describe your scenario"
              disabled={isLoading}
            />

            <div className="flex flex-col gap-2 w-full">
              <span className="text-xs font-medium text-foreground">
                Start from a template
              </span>
              <div className="flex gap-2 w-full">
                {TEMPLATE_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="flex-1 min-w-0 bg-gray-900 rounded-md p-4 text-left text-sm text-muted-foreground leading-5 hover:bg-secondary transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive flex items-start gap-2">
                <span className="flex-1 leading-relaxed">
                  {error.message || "Something went wrong."}
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
          </div>
        </div>
      )}
    </main>
  );
}

function PromptInput({
  value,
  onChange,
  onSend,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div className="bg-card rounded-full flex items-center gap-2 px-6 py-4 w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSend();
        }}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
      />
      <button
        type="button"
        onClick={onSend}
        disabled={disabled}
        className="size-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
      >
        <Send className="size-4" />
      </button>
    </div>
  );
}
