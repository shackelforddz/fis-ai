"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { EditableBlock } from "./editable-block";
import type { LoanEvaluation, Borrower } from "@/lib/types";
import { performanceData } from "@/lib/mock-data";

export type TemplateKey =
  | "credit-memo"
  | "term-sheet"
  | "tenant-audit"
  | "loi"
  | "restructure";

export const TEMPLATES: Record<TemplateKey, { label: string; titleSuffix: string }> = {
  "credit-memo": { label: "Credit Memo", titleSuffix: "Credit Memorandum" },
  "term-sheet": { label: "Term Sheet", titleSuffix: "Term Sheet" },
  "tenant-audit": { label: "Tenant Audit Report", titleSuffix: "Tenant Audit Report" },
  loi: { label: "Letter of Intent", titleSuffix: "Letter of Intent" },
  restructure: {
    label: "Restructuring Proposal",
    titleSuffix: "Restructuring Proposal",
  },
};

const currency = (n: number, compact = false) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: compact ? 1 : 0,
    minimumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(n);

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const recommendationByAnalysis: Record<string, string> = {
  "Likely approved":
    "<strong>Recommend approval</strong> of the facility as structured, subject to standard closing conditions and satisfactory final underwriting.",
  "Review needed":
    "<strong>Advance to Credit Committee</strong> with the additional diligence items and mitigants outlined below prior to final decision.",
  "Likely declined":
    "<strong>Decline as proposed</strong>; a counter-structure is available for the borrower's consideration under revised terms.",
};

const sectionHeadingCls =
  "text-base font-bold border-b border-gray-200 pb-2";

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <EditableBlock as="h3" initialHtml={heading} className={sectionHeadingCls} />
      {children}
    </section>
  );
}

function Paragraph({ html }: { html: string }) {
  return <EditableBlock as="p" initialHtml={html} className="text-sm leading-relaxed" />;
}

function HtmlBlock({ html, className }: { html: string; className?: string }) {
  return (
    <EditableBlock
      as="div"
      initialHtml={html}
      className={className ?? "text-sm leading-relaxed"}
    />
  );
}

export function TemplateContent({
  templateKey,
  loan,
  borrower,
}: {
  templateKey: TemplateKey;
  loan: LoanEvaluation;
  borrower?: Borrower;
}) {
  if (templateKey === "credit-memo") return <CreditMemo loan={loan} borrower={borrower} />;
  if (templateKey === "term-sheet") return <TermSheet loan={loan} borrower={borrower} />;
  if (templateKey === "tenant-audit") return <TenantAudit loan={loan} />;
  if (templateKey === "restructure") return <Restructure loan={loan} borrower={borrower} />;
  return <LetterOfIntent loan={loan} borrower={borrower} />;
}

function Restructure({
  loan,
  borrower,
}: {
  loan: LoanEvaluation;
  borrower?: Borrower;
}) {
  const industry = borrower?.industry ?? "commercial operator";
  const facility = borrower?.currentFacilitySummary ?? "";
  const amountFmt = currency(loan.loanAmount);

  return (
    <>
      <Section heading="I. Executive Summary">
        <Paragraph
          html={`This memorandum proposes a restructuring of the existing <strong>${amountFmt}</strong> ${loan.loanType} facility with <strong>${loan.borrowerName}</strong>. Recent performance indicators — including elevated line utilization, widening DSO, and compressed debt service coverage — warrant proactive covenant and structural amendments to preserve credit quality and align payment obligations with current cash flow.`}
        />
      </Section>

      <Section heading="II. Borrower Profile">
        <Paragraph
          html={`${loan.borrowerName} operates in the ${industry} sector${
            facility ? ` and currently maintains ${facility.toLowerCase()}` : ""
          }. Management has engaged cooperatively on data requests and has provided a go-forward operating plan supporting the proposed restructure.`}
        />
      </Section>

      <Section heading="III. Proposed Restructuring Terms">
        <HtmlBlock
          html={`
            <table>
              <tbody>
                <tr><td class="doc-label-cell">Existing Commitment</td><td>${amountFmt}</td></tr>
                <tr><td class="doc-label-cell">Revised Structure</td><td>Converted to a 24-month term loan with monthly amortization</td></tr>
                <tr><td class="doc-label-cell">Amortization</td><td>10-year schedule; balloon at month 24</td></tr>
                <tr><td class="doc-label-cell">Revised Rate</td><td>SOFR + 400 bps (cash), PIK step-up on covenant breach</td></tr>
                <tr><td class="doc-label-cell">DSCR Covenant</td><td>Stepped: 1.05x Q1, 1.15x Q2, 1.25x thereafter</td></tr>
                <tr><td class="doc-label-cell">Minimum Liquidity</td><td>$500,000 tested monthly</td></tr>
                <tr><td class="doc-label-cell">Restructure Fee</td><td>0.50% of outstanding at closing</td></tr>
                <tr><td class="doc-label-cell">Effective Date</td><td>Upon execution of amended credit agreement</td></tr>
              </tbody>
            </table>
          `}
        />
      </Section>

      <Section heading="IV. Rationale & Key Concessions">
        <HtmlBlock
          html={`
            <ul>
              <li>Convert revolver to term to eliminate line utilization pressure and normalize monthly obligations</li>
              <li>Introduce stepped DSCR schedule to provide runway while seasonal collections normalize</li>
              <li>Add minimum liquidity covenant as forward-looking tripwire</li>
              <li>Rate reflects revised risk profile; PIK step-up preserves optionality without forcing default</li>
              <li>Restructure fee offsets incremental workout costs and signals borrower commitment</li>
            </ul>
          `}
        />
      </Section>

      <Section heading="V. Conditions Precedent">
        <HtmlBlock
          html={`
            <ul>
              <li>Satisfactory field exam within 30 days of executing the restructure</li>
              <li>Updated 13-week cash flow forecast with weekly variance reporting for first two quarters</li>
              <li>Personal guaranty reaffirmation from principal; validity guaranty from any new subsidiaries</li>
              <li>Confirmation of insurance, tax, and UCC continuation filings in good standing</li>
              <li>No material adverse change between proposal date and closing</li>
            </ul>
          `}
        />
      </Section>

      <Section heading="VI. Monitoring & Reporting">
        <Paragraph
          html={`Monthly borrowing base certificates, weekly A/R agings, and a quarterly covenant compliance certificate co-signed by the CFO. Portfolio monitoring team to review 13-week cash flow variance monthly and escalate if cumulative burn exceeds 10% of forecast.`}
        />
      </Section>

      <Section heading="VII. Recommendation">
        <Paragraph
          html={`<strong>Approve as restructured.</strong> The proposed terms balance near-term flexibility with tighter monitoring and enhanced covenants, preserving the relationship while materially improving the lender's position relative to the as-is facility.`}
        />
      </Section>
    </>
  );
}

function CreditMemo({
  loan,
  borrower,
}: {
  loan: LoanEvaluation;
  borrower?: Borrower;
}) {
  void borrower;
  const reco =
    recommendationByAnalysis[loan.analysis] ?? recommendationByAnalysis["Review needed"];
  const submission = longDate(loan.submissionDate);

  return (
    <>
      <Section heading="I. Executive Summary">
        <Paragraph
          html={`<strong>${loan.borrowerName}</strong>, a multifamily real estate investor, is requesting a <strong>$15,000,000</strong> acquisition + value-add loan to purchase a <strong>100-unit garden-style apartment complex</strong>. The sponsor's plan is to deploy a unit-by-unit renovation program, reposition the rent roll to current market levels, and stabilize the asset within <strong>24 months</strong> of close. The request was submitted on ${submission} and assigned to ${loan.assignedOfficer}. Our automated decisioning engine has produced a confidence score of <strong>${loan.confidenceScore}/100</strong> with an initial analysis of <strong>${loan.analysis.toLowerCase()}</strong>.`}
        />
      </Section>

      <Section heading="II. Sponsor Profile">
        <Paragraph
          html={`${loan.borrowerName} is an experienced multifamily operator with a track record of value-add executions across comparable garden-style assets. The sponsor has completed multiple full-cycle renovations and has demonstrated the ability to deliver renovation programs on time and on budget. Owner equity contribution is meaningful, providing aligned incentives throughout the business plan.`}
        />
      </Section>

      <Section heading="III. Transaction Overview">
        <HtmlBlock
          html={`
            <table>
              <tbody>
                <tr><td class="doc-label-cell">Loan Amount</td><td>$15,000,000</td></tr>
                <tr><td class="doc-label-cell">Facility Type</td><td>Acquisition + Value-Add (CRE)</td></tr>
                <tr><td class="doc-label-cell">Property</td><td>100-unit garden-style apartment complex</td></tr>
                <tr><td class="doc-label-cell">Term</td><td>36 months with two 12-month extension options</td></tr>
                <tr><td class="doc-label-cell">Amortization</td><td>Interest-only during 24-month renovation/lease-up; 30-yr amortization thereafter</td></tr>
                <tr><td class="doc-label-cell">Indicative Rate</td><td>SOFR + 350 bps, with rate cap covering term</td></tr>
                <tr><td class="doc-label-cell">Origination Fee</td><td>1.00% of commitment</td></tr>
                <tr><td class="doc-label-cell">Target Close</td><td>Within 60 days of credit approval</td></tr>
              </tbody>
            </table>
          `}
        />
      </Section>

      <Section heading="IV. Property & Business Plan">
        <Paragraph
          html={`Proceeds will fund the acquisition of the 100-unit complex and a phased interior renovation program — kitchen and bath upgrades, in-unit washer/dryer additions, and selective common-area improvements. The sponsor's plan targets premiums of $175–$225 per renovated unit, with full lease-up to stabilization within 24 months of close. A dedicated CapEx reserve will be funded at close and drawn against milestone-based renovation completions; no proceeds will be distributed to ownership prior to stabilization.`}
        />
      </Section>

      <Section heading="V. Pro Forma Performance">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={performanceData}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide />
              <Line
                type="monotone"
                dataKey="series1"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                name="Effective Gross Income"
              />
              <Line
                type="monotone"
                dataKey="series2"
                stroke="#3730a3"
                strokeWidth={2}
                dot={false}
                name="Net Operating Income"
              />
              <Legend
                iconType="square"
                wrapperStyle={{ fontSize: 12, color: "#374151" }}
                align="left"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <Paragraph
          html={`Underwritten Effective Gross Income and Net Operating Income trend upward as renovated units lease at premium rents and turnover normalizes. Stabilized Year-2 NOI supports a debt yield of approximately 8.5% and a stabilized DSCR above 1.30x at the proposed indicative rate. Both base and downside scenarios maintain compliance with the proposed covenant package.`}
        />
      </Section>

      <Section heading="VI. Credit Strengths">
        <HtmlBlock
          html={`
            <ul>
              <li>Experienced multifamily sponsor with a successful value-add track record on comparable garden-style assets</li>
              <li>Tangible business plan with clear $175–$225 per-unit rent premium underwriting backed by submarket comps</li>
              <li>Meaningful sponsor equity at risk; CapEx reserve fully funded at close</li>
              <li>Stabilized Year-2 metrics support healthy debt yield (~8.5%) and DSCR (&gt;1.30x)</li>
              <li>Liquid, well-located submarket with sub-5% vacancy supporting lease-up assumptions</li>
            </ul>
          `}
        />
      </Section>

      <Section heading="VII. Risks & Mitigants">
        <HtmlBlock
          html={`
            <ul>
              <li>Renovation execution risk (cost overruns, schedule slippage) — <em>mitigated</em> by CapEx reserve, milestone-based draws, and a third-party Property Condition Needs Assessment</li>
              <li>Lease-up and rent premium risk — <em>mitigated</em> by submarket comp study, monthly leasing/occupancy reporting, and required interest-rate cap</li>
              <li>Interest rate exposure during the floating-rate period — <em>mitigated</em> by purchased rate cap covering the full term</li>
              <li>Concentration in a single asset — <em>mitigated</em> by recourse carve-outs, completion guaranty, and stabilization-based deleveraging covenants</li>
            </ul>
          `}
        />
      </Section>

      <Section heading="VIII. Collateral & Security">
        <Paragraph
          html={`The facility will be secured by a first-priority mortgage on the 100-unit apartment complex, an assignment of leases and rents, and a pledge of operating accounts. The sponsor will provide a limited (carve-out) recourse guaranty covering bad-boy events plus a completion guaranty for the renovation program. An interest-rate cap protecting the lender's debt service position is required at close. Collateral will be monitored through quarterly site inspections and renovation-progress reports.`}
        />
      </Section>

      <Section heading="IX. Proposed Covenants">
        <HtmlBlock
          html={`
            <ul>
              <li>Stabilized Debt Service Coverage Ratio of <strong>1.25x</strong>, tested upon stabilization and quarterly thereafter</li>
              <li>Minimum Debt Yield of <strong>8.0%</strong> at stabilization</li>
              <li>Maximum Loan-to-Cost of <strong>75%</strong> at close; Loan-to-Value of <strong>70%</strong> at stabilization</li>
              <li>Minimum sponsor liquidity of <strong>$1,500,000</strong> tested quarterly</li>
              <li>Renovation milestones reported monthly; completion of program within <strong>24 months</strong> of close</li>
              <li>Quarterly operating statements and rent rolls within 30 days of period end; annual CPA-reviewed financials within 120 days of fiscal year end</li>
            </ul>
          `}
        />
      </Section>

      <Section heading="X. Recommendation">
        <Paragraph
          html={`${reco} Confidence score: <strong>${loan.confidenceScore}/100</strong>.`}
        />
        <HtmlBlock
          html={`
            <div style="display:flex;gap:2rem;padding-top:0.5rem;border-top:1px solid #e5e7eb;font-size:0.75rem;color:#4b5563;">
              <div>Prepared by: <strong>${loan.assignedOfficer}</strong></div>
              <div>Submission Date: <strong>${submission}</strong></div>
            </div>
          `}
          className="text-xs text-gray-600"
        />
      </Section>
    </>
  );
}

function TermSheet({
  loan,
  borrower,
}: {
  loan: LoanEvaluation;
  borrower?: Borrower;
}) {
  const amountFmt = currency(loan.loanAmount);
  const today = longDate(new Date().toISOString());

  return (
    <>
      <Section heading="Indicative Term Sheet">
        <Paragraph
          html={`This indicative term sheet is provided for discussion purposes only and does not constitute a commitment to lend. Final terms are subject to credit approval, satisfactory due diligence, and execution of definitive loan documentation.`}
        />
        <HtmlBlock
          html={`
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:0.875rem;">
              <div><strong>Date:</strong> ${today}</div>
              <div><strong>Prepared By:</strong> ${loan.assignedOfficer}</div>
              <div><strong>Borrower:</strong> ${loan.borrowerName}</div>
              <div><strong>Facility ID:</strong> ${borrower?.facilityId ?? "—"}</div>
            </div>
          `}
        />
      </Section>

      <Section heading="I. Summary of Proposed Terms">
        <HtmlBlock
          html={`
            <table>
              <tbody>
                <tr><td class="doc-label-cell">Borrower</td><td>${loan.borrowerName}</td></tr>
                <tr><td class="doc-label-cell">Facility</td><td>${loan.loanType}</td></tr>
                <tr><td class="doc-label-cell">Amount</td><td>${amountFmt}</td></tr>
                <tr><td class="doc-label-cell">Term</td><td>60 months</td></tr>
                <tr><td class="doc-label-cell">Amortization</td><td>25-year schedule, monthly payments</td></tr>
                <tr><td class="doc-label-cell">Interest Rate</td><td>SOFR + 275 bps (indicative)</td></tr>
                <tr><td class="doc-label-cell">Collateral</td><td>First-priority lien on financed assets; blanket lien on business assets</td></tr>
                <tr><td class="doc-label-cell">Guaranty</td><td>Limited personal guaranty of principal owner(s)</td></tr>
                <tr><td class="doc-label-cell">Closing Fee</td><td>1.00% of commitment</td></tr>
                <tr><td class="doc-label-cell">Prepayment</td><td>Open after 24 months; 2% declining premium in years 1–2</td></tr>
                <tr><td class="doc-label-cell">Financial Covenants</td><td>DSCR ≥ 1.25x; Total Leverage ≤ 3.50x EBITDA; Min. Liquidity $500,000</td></tr>
                <tr><td class="doc-label-cell">Reporting</td><td>Quarterly CPA-reviewed; annual CPA-audited financials</td></tr>
                <tr><td class="doc-label-cell">Expiration</td><td>This indicative term sheet is valid for 30 days from the date above</td></tr>
              </tbody>
            </table>
          `}
        />
      </Section>

      <Section heading="II. Conditions Precedent to Closing">
        <HtmlBlock
          html={`
            <ul>
              <li>Satisfactory review of three years of CPA-reviewed financial statements</li>
              <li>Completion of background checks, OFAC and sanctions screening</li>
              <li>Satisfactory appraisal, environmental Phase I, and title insurance for collateral</li>
              <li>Executed insurance endorsements naming the lender as additional insured / loss payee</li>
              <li>Final approval by the Credit Committee</li>
            </ul>
          `}
        />
      </Section>

      <Section heading="III. Confidentiality & Acceptance">
        <Paragraph
          html={`The contents of this term sheet are confidential and intended solely for the recipient. Please indicate acceptance by countersigning below to advance the transaction to formal underwriting.`}
        />
        <HtmlBlock
          html={`
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;padding-top:1rem;">
              <div style="border-top:1px solid #9ca3af;padding-top:0.5rem;font-size:0.75rem;color:#4b5563;">Accepted By (Borrower) — Name &amp; Title</div>
              <div style="border-top:1px solid #9ca3af;padding-top:0.5rem;font-size:0.75rem;color:#4b5563;">Date</div>
            </div>
          `}
        />
      </Section>
    </>
  );
}

function TenantAudit({ loan }: { loan: LoanEvaluation }) {
  return (
    <>
      <Section heading="I. Property Summary">
        <HtmlBlock
          html={`
            <table>
              <tbody>
                <tr><td class="doc-label-cell">Subject Property</td><td>${loan.borrowerName} — Mixed-Use Building</td></tr>
                <tr><td class="doc-label-cell">Total Rentable Area</td><td>24,600 SF (Retail: 8,200 SF; Residential: 16,400 SF)</td></tr>
                <tr><td class="doc-label-cell">Units / Leases</td><td>13 (12 Residential · 1 Commercial)</td></tr>
                <tr><td class="doc-label-cell">Occupancy</td><td>92% physical / 96% economic</td></tr>
                <tr><td class="doc-label-cell">Total Monthly Rent</td><td>$46,850</td></tr>
              </tbody>
            </table>
          `}
        />
      </Section>

      <Section heading="II. Tenant Roster">
        <HtmlBlock
          html={`
            <table>
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Suite / Unit</th>
                  <th>Type</th>
                  <th>Monthly Rent</th>
                  <th>Lease End</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Corner Market Co-op</td><td>101</td><td>Commercial</td><td>$8,400</td><td>Expires in 14 months</td><td><strong>Flag</strong></td></tr>
                <tr><td>Unit 201</td><td>201</td><td>Residential</td><td>$3,200</td><td>12/2026</td><td>Current</td></tr>
                <tr><td>Unit 202</td><td>202</td><td>Residential</td><td>$3,150</td><td>08/2026</td><td>Current</td></tr>
                <tr><td>Unit 203</td><td>203</td><td>Residential</td><td>$2,975</td><td>03/2027</td><td>Current</td></tr>
                <tr><td>Unit 204</td><td>204</td><td>Residential</td><td>$3,100</td><td>11/2026</td><td>Current</td></tr>
                <tr><td>Unit 301</td><td>301</td><td>Residential</td><td>$3,300</td><td>06/2026</td><td>Current</td></tr>
                <tr><td>Unit 302</td><td>302</td><td>Residential</td><td>$3,225</td><td>09/2026</td><td>Current</td></tr>
                <tr><td>Unit 303</td><td>303</td><td>Residential</td><td>$2,950</td><td>05/2027</td><td>Current</td></tr>
                <tr><td>Unit 304</td><td>304</td><td>Residential</td><td>$3,175</td><td>07/2026</td><td>Current</td></tr>
                <tr><td>Unit 401</td><td>401</td><td>Residential</td><td>$3,450</td><td>02/2027</td><td>Current</td></tr>
                <tr><td>Unit 402</td><td>402</td><td>Residential</td><td>$3,375</td><td>10/2026</td><td>Current</td></tr>
                <tr><td>Unit 403</td><td>403</td><td>Residential</td><td>$3,100</td><td>—</td><td><strong>Vacant</strong></td></tr>
                <tr><td>Unit 404</td><td>404</td><td>Residential</td><td>$3,450</td><td>04/2027</td><td>Current</td></tr>
              </tbody>
            </table>
          `}
        />
      </Section>

      <Section heading="III. Key Observations">
        <HtmlBlock
          html={`
            <ul>
              <li><strong>Commercial lease concentration:</strong> Corner Market Co-op represents ~18% of gross monthly rent and expires within 14 months. Renewal discussions should be initiated prior to closing.</li>
              <li><strong>Residential rollover:</strong> Six residential leases roll over within the next 12 months. Current market rents are in line with existing rents — limited renewal risk.</li>
              <li><strong>Vacancy:</strong> One residential unit (403) is vacant; marketing timeline is ~30 days based on recent absorption.</li>
              <li>No material tenant payment delinquencies observed over the trailing 12 months.</li>
            </ul>
          `}
        />
      </Section>

      <Section heading="IV. Conclusion">
        <Paragraph
          html={`The tenant mix is stable, with residential cash flow providing the majority of in-place rent. The single commercial lease is the primary concentration risk and should be monitored closely through closing. Overall, the rent roll supports the proposed underwriting assumptions for the ${loan.loanType} facility.`}
        />
      </Section>
    </>
  );
}

function LetterOfIntent({
  loan,
  borrower,
}: {
  loan: LoanEvaluation;
  borrower?: Borrower;
}) {
  const amountFmt = currency(loan.loanAmount);
  const today = longDate(new Date().toISOString());

  return (
    <>
      <HtmlBlock
        html={`
          <div style="display:flex;justify-content:space-between;font-size:0.875rem;">
            <div>
              <div><strong>${loan.borrowerName}</strong></div>
              <div>Attn: Chief Financial Officer</div>
              <div>[Address Line 1]</div>
              <div>[City, State ZIP]</div>
            </div>
            <div style="text-align:right;">${today}</div>
          </div>
        `}
      />

      <Paragraph html={`<strong>Re:</strong> Proposed ${loan.loanType} Facility — ${amountFmt}`} />
      <Paragraph html="Dear Sir or Madam," />

      <Paragraph
        html={`Thank you for the opportunity to discuss financing for ${loan.borrowerName}. Based on our review to date, we are pleased to express our interest in providing a <strong>${amountFmt}</strong> ${loan.loanType} facility on the terms summarized below. This letter is non-binding and is intended to serve as the basis for further discussion and formal underwriting.`}
      />

      <Section heading="Indicative Structure">
        <HtmlBlock
          html={`
            <ul>
              <li><strong>Facility Type:</strong> ${loan.loanType}</li>
              <li><strong>Principal Amount:</strong> ${amountFmt}</li>
              <li><strong>Term:</strong> 60 months, 25-year amortization</li>
              <li><strong>Indicative Rate:</strong> SOFR + 275 bps</li>
              <li><strong>Collateral:</strong> First-priority lien on financed assets; blanket lien on business assets</li>
              <li><strong>Guaranty:</strong> Limited personal guaranty of principal owner(s)</li>
              <li><strong>Closing Fee:</strong> 1.00% of commitment</li>
            </ul>
          `}
        />
      </Section>

      <Section heading="Next Steps">
        <Paragraph
          html={`Subject to your acknowledgement of this letter and completion of satisfactory due diligence, we anticipate being in a position to present a formal commitment within <strong>30 days</strong>. In the interim, we will require the items summarized on our standard due diligence checklist, which has been provided under separate cover.`}
        />
      </Section>

      <Section heading="Non-Binding; Confidentiality">
        <Paragraph
          html={`Except for the confidentiality provisions hereof, this letter is not a commitment to lend and does not create any legally binding obligation. Any final commitment is subject to credit approval and execution of definitive loan documentation. The contents of this letter are confidential and should not be disclosed to any third party without our prior written consent.`}
        />
      </Section>

      <Paragraph html="Sincerely," />
      <HtmlBlock
        html={`
          <div style="padding-top:2rem;font-size:0.875rem;">
            <div style="border-top:1px solid #9ca3af;display:inline-block;padding-top:0.25rem;min-width:240px;">
              <strong>${loan.assignedOfficer}</strong>
            </div>
            <div style="color:#4b5563;font-size:0.75rem;">Senior Relationship Manager${
              borrower?.facilityId ? ` · Facility ${borrower.facilityId}` : ""
            }</div>
          </div>
        `}
      />
    </>
  );
}
