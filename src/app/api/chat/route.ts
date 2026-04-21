import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";

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
      system: `You are the FIS Lenders Co-pilot, an AI assistant for commercial lending officers. You help with:
- Portfolio analysis and borrower risk assessment
- Covenant monitoring and compliance tracking
- Identifying upsell and restructure opportunities
- Analyzing financial signals (DSO, DSCR, utilization trends)
- Transaction monitoring and anomaly detection
- Public records and market data interpretation

Be concise and data-driven. Use bullet points and bold text for key figures. When referencing borrowers or metrics, be specific. Keep responses focused and actionable for lending professionals.`,
      messages: await convertToModelMessages(messages),
      onError({ error }) {
        console.error("[/api/chat] streamText error:", error);
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
    console.error("[/api/chat] unhandled error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
