"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { Chat } from "@ai-sdk/react";
import { Plus, Send, Square } from "lucide-react";

const recommendedPrompts = [
  "Find clients who have applied for new permits (commercial real estate) and determine if they have the liquidity to do it.",
  "Priority action items based on real-time portfolio performance signals and risk assessment modeling",
  "Which borrowers are at risk of covenant violations in the next 90 days?",
  "Summarize DSO trends across the portfolio and flag any outliers.",
  "Identify borrowers with high utilization that may need a credit line increase.",
];

function getMessageText(msg: { parts: ReadonlyArray<{ type: string; text?: string }> }) {
  return msg.parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => (p as { text: string }).text)
    .join("");
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
            {messages.map((msg: { id: string; role: string; parts: ReadonlyArray<{ type: string; text?: string }> }) => {
              const text = getMessageText(msg);
              if (!text) return null;
              return (
                <div
                  key={msg.id}
                  className={
                    msg.role === "user"
                      ? "self-end bg-secondary rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[85%]"
                      : "self-start bg-card rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[85%]"
                  }
                >
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                    {text}
                  </p>
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
              {recommendedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  className="bg-gray-900 rounded-md p-4 text-sm text-muted-foreground text-left hover:bg-secondary transition-colors w-[200px] min-w-[200px] shrink-0"
                  onClick={() => handleSend(prompt)}
                >
                  {prompt}
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
