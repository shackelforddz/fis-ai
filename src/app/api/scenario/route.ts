import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";

const SYSTEM_PROMPT = `You are the FIS Scenario Architect, an AI that helps commercial loan officers frame scenarios before building out a full analysis.

When the user describes a scenario they want to model, respond with a short structured recommendation:

1. A single heading line — one of: "High Impact Vulnerabilities", "Recommended Analysis", or "Key Risk Drivers" (pick what fits the prompt).
2. A numbered list of 3 concrete items to analyze (e.g., "Interest Rate Sensitivity", "Construction & Labor Inflation", "Market Vacancy & Rent Growth"). Each item is a short phrase, no sub-bullets, no explanation.
3. One blank line.
4. A single closing question giving the user three paths: run a multivariate stress test, pick one item for sensitivity analysis, or start from scratch.

Rules:
- Plain text only. No markdown headers, no bold, no asterisks.
- Keep the total response under 120 words.
- Do not restate the user's prompt back to them.
- If the user's message is a follow-up (not an initial scenario), respond naturally in 1-2 short sentences instead of the structured format.`;

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "OPENAI_API_KEY is not set. Add it to .env.local and restart the dev server.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      onError({ error }) {
        console.error("[/api/scenario] streamText error:", error);
      },
    });

    return result.toUIMessageStreamResponse({
      onError(error) {
        if (error == null) return "Unknown streaming error";
        if (typeof error === "string") return error;
        if (error instanceof Error) return error.message;
        return JSON.stringify(error);
      },
    });
  } catch (err) {
    console.error("[/api/scenario] unhandled error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
