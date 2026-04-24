import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import {
  borrowers,
  loanEvaluations,
  riskEntries,
  covenants,
  covenantSchedule,
  utilizationHistory,
  dsoHistory,
  publicRecords,
  commercialPermits,
  growthSignals,
  industryBenchmarks,
  homeMetrics,
  concentrationData,
  servicingIndicators,
  followUpHistory,
  performanceData,
  erpData,
  experianScore,
  ficoScore,
  performanceStats,
  erpStats,
  experianStats,
  ficoStats,
  operatingBufferSeries,
  paymentFlowSeries,
  networkScanSeries,
  jobFunctionData,
  dscrSeries,
  servicingSeries,
  marketSeries,
  dsoSeries,
  utilizationSeries,
  sofrSeries,
  industrySeries,
} from "@/lib/mock-data";

const PORTFOLIO_CONTEXT = JSON.stringify({
  homeMetrics,
  borrowers,
  loanEvaluations,
  riskEntries,
  covenants,
  covenantSchedule,
  utilizationHistory,
  dsoHistory,
  publicRecords,
  commercialPermits,
  growthSignals,
  industryBenchmarks,
  concentrationData,
  servicingIndicators,
  followUpHistory,
  loanDetailCharts: {
    performanceData,
    erpData,
    experianScore,
    ficoScore,
    performanceStats,
    erpStats,
    experianStats,
    ficoStats,
  },
  borrowerDetailCharts: {
    operatingBufferSeries,
    paymentFlowSeries,
    networkScanSeries,
    jobFunctionData,
    dscrSeries,
    servicingSeries,
    marketSeries,
  },
  riskDetailCharts: {
    dsoSeries,
    utilizationSeries,
    sofrSeries,
    industrySeries,
  },
});

const SYSTEM_PROMPT = `You are the FIS Lenders Co-pilot, an AI assistant for commercial lending officers. You help with:
- Portfolio analysis and borrower risk assessment
- Covenant monitoring and compliance tracking
- Identifying upsell and restructure opportunities
- Analyzing financial signals (DSO, DSCR, utilization trends)
- Transaction monitoring and anomaly detection
- Public records and market data interpretation

Be concise and data-driven. Use bullet points and bold text for key figures. When referencing borrowers or metrics, be specific. Keep responses focused and actionable for lending professionals.

## Generating charts

When a chart would make the answer clearer (comparing borrowers, trending a metric over time, showing distributions), emit a fenced code block with the language tag "chart" containing a JSON spec. You may include zero, one, or multiple chart blocks interleaved with text.

Chart JSON schema (use these exact key names):
{
  "type": "bar" | "line" | "pie",
  "title": string,
  "data": [{ "name": string, "value": number }, ...],
  "unit"?: string // optional suffix for tooltip values, e.g. "%" or "$M"
}

IMPORTANT: Each data entry MUST use the keys "name" and "value" literally — never "month"/"balance", "week"/"dso", "quarter"/"volume", etc. If you pull from a source series like operatingBufferSeries ({month, balance}), transform each row to {"name": <month>, "value": <balance>} before emitting.

Rules:
- Keep data arrays under 12 entries.
- Use real values from <portfolio_data>; never invent numbers for charts.
- Pie charts should sum to ~100% or represent a clear composition.
- Put the chart block on its own lines. Do not wrap the JSON in any other formatting.
- If the user's question doesn't call for a visualization, answer in text only.

JSON formatting rules (critical):
- Each object in "data" starts with exactly one opening brace: {"name":"...","value":...}. Never emit {"{"name":...}.
- Separate array entries with a single comma. No trailing commas. No repeated braces.
- Property keys and string values use double quotes. Numeric values have no quotes.
- Validate your JSON in your head before outputting. If in doubt, omit the chart rather than emit malformed JSON.

Example:
\`\`\`chart
{"type":"bar","title":"Line utilization by borrower","unit":"%","data":[{"name":"Vanguard","value":85},{"name":"Coastal","value":72}]}
\`\`\`

You have access to the following portfolio data (JSON). Treat it as the source of truth. When the user asks about borrowers, covenants, loan evaluations, risk scores, DSO, utilization, or any other portfolio metric, query this data rather than inventing figures. If the data does not cover the question, say so explicitly.

<portfolio_data>
${PORTFOLIO_CONTEXT}
</portfolio_data>`;

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
      model: openai("gpt-4o"),
      system: SYSTEM_PROMPT,
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
