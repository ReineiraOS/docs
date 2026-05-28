import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import CodeBlock from "@/components/docs/CodeBlock";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import DocsBadge from "@/components/docs/DocsBadge";
import Steps, { Step } from "@/components/docs/Steps";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "the-model", title: "The model", level: 2 },
  { id: "create-a-pool", title: "Create a pool", level: 2 },
  { id: "manage-policies", title: "Manage policies", level: 2 },
  { id: "provide-liquidity", title: "Provide liquidity", level: 2 },
  { id: "coverage-lifecycle", title: "Coverage lifecycle", level: 2 },
  { id: "coverage-states", title: "Coverage states", level: 2 },
  { id: "purchase-coverage", title: "Purchase coverage", level: 2 },
  { id: "withdraw-and-unstake", title: "Withdraw and unstake", level: 2 },
  { id: "privacy", title: "Privacy", level: 2 },
];

const { prev, next } = getPrevNext("/build/insurance-pools");

const lifecycleColumns = [
  { header: "Step", key: "step", width: "100px" },
  { header: "What happens", key: "what" },
  { header: "Who acts", key: "who", width: "180px" },
];
const lifecycleRows = [
  {
    step: "1. Purchase",
    what: "Builder calls SDK with pool, policy, escrow, coverage amount, expiry",
    who: "Buyer / developer",
  },
  {
    step: "2. Risk evaluation",
    what: "Policy\u2019s evaluateRisk() returns encrypted risk score",
    who: "Your policy contract",
  },
  {
    step: "3. Premium payment",
    what: "Buyer pays premium based on risk score (encrypted)",
    who: "Protocol (automatic)",
  },
  {
    step: "4. Active coverage",
    what: "Coverage is now active until expiry",
    who: "\u2014",
  },
  {
    step: "5. Dispute (if needed)",
    what: "Buyer files dispute with proof",
    who: "Buyer / developer",
  },
  {
    step: "6. Judgment",
    what: "Policy\u2019s judge() returns encrypted verdict",
    who: "Your policy contract",
  },
  {
    step: "7. Claim payout",
    what: "If valid, claim is paid from pool liquidity",
    who: "Protocol (automatic)",
  },
];

const stateColumns = [
  { header: "State", key: "state", width: "140px" },
  { header: "Meaning", key: "meaning" },
];
const stateRows = [
  {
    state: <DocsBadge variant="green">Active</DocsBadge>,
    meaning: "Coverage is live \u2014 disputes can be filed",
  },
  {
    state: <DocsBadge variant="amber">Disputed</DocsBadge>,
    meaning: "A dispute has been filed and is being judged",
  },
  {
    state: <DocsBadge variant="red">Claimed</DocsBadge>,
    meaning: "Dispute was valid \u2014 claim paid from pool",
  },
  {
    state: <DocsBadge variant="default">Expired</DocsBadge>,
    meaning: "Coverage period ended with no dispute \u2014 premium earned",
  },
];

export default function InsurancePools() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Insurance Pools"
        description="Create permissionless Insurance pools, curate policies, provide liquidity, and earn premiums from every coverage purchase."
        readingTime="8 min read"
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Anyone can create an Insurance pool (with an allowlisted payment token),
        attach policies, provide liquidity, and earn premiums. This is the open
        economy layer of ReineiraOS — the best underwriters build the best pools
        and earn the most.
      </p>

      <Callout variant="info" title="Four-role separation (Whitepaper §7.2)">
        <p>
          Every pool has four roles: <strong>Pool Creator</strong> (deploys via
          factory, owns immutable creator royalty),{" "}
          <strong>Pool Manager</strong> (parameter custody, policy admission;
          transferable to DAO/multisig), <strong>Guardian</strong> (safety veto
          and emergency-deallocate only, no earnings), and{" "}
          <strong>Operator</strong> (executes pool-routing tasks under the
          orchestration layer). Creator and Manager can be the same address at
          deploy time — pass <code>initialManager</code> and{" "}
          <code>guardian</code> to <code>createPool</code> to set them
          explicitly.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="the-model"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        The model
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Think of insurance pools like Morpho vaults:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>
          <strong className="text-docs-text-primary font-semibold">You</strong>{" "}
          create a pool and curate which policies it supports
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Stakers
          </strong>{" "}
          deposit liquidity into your pool
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Buyers / developers
          </strong>{" "}
          purchase coverage from your pool
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Premiums
          </strong>{" "}
          flow to the pool on every coverage purchase
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            You and stakers
          </strong>{" "}
          earn yield from premiums
        </li>
      </ul>

      <Callout variant="tip" title="Quality drives growth">
        <p>
          The better your policies (accurate risk scoring, fair disputes), the
          more builders trust your pool, the more coverage is purchased, the
          more everyone earns.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="create-a-pool"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Create a pool
      </h2>

      <CodeBlock
        filename="create-pool.ts"
        language="typescript"
        lines={[
          {
            content: "const pool = await sdk.insurance.createPool({",
          },
          {
            content: "  paymentToken: sdk.addresses.confidentialUSDC,",
            highlighted: true,
          },
          { content: "})" },
          { content: "" },
          { content: "console.log('Pool ID:', pool.id)" },
          {
            content: "console.log('Pool address:', pool.address)",
          },
        ]}
        showLineNumbers={false}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        You are now an underwriter. The pool is yours to manage.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="manage-policies"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Manage policies
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Add or remove{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          IUnderwriterPolicy
        </code>{" "}
        contracts that your pool supports:
      </p>

      <CodeBlock
        filename="manage-policies.ts"
        language="typescript"
        lines={[
          {
            content: "// Allow a policy to be used with your pool",
          },
          {
            content: "await pool.addPolicy('0xMarketplaceDisputePolicy...')",
            highlighted: true,
          },
          {
            content: "await pool.addPolicy('0xCargoInsurancePolicy...')",
          },
          { content: "" },
          { content: "// Remove a policy" },
          {
            content: "await pool.removePolicy('0xOldPolicy...')",
          },
        ]}
        showLineNumbers={false}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Buyers / developers can only purchase coverage using policies your pool
        has approved.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="provide-liquidity"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Provide liquidity
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Stake into your own pool or invite others:
      </p>

      <CodeBlock
        filename="stake.ts"
        language="typescript"
        lines={[
          { content: "// Approve and stake" },
          {
            content:
              "const { stakeId, tx } = await pool.stake(sdk.usdc(10000), {",
            highlighted: true,
          },
          {
            content: "  autoApprove: true,",
            highlighted: true,
          },
          { content: "})", highlighted: true },
          { content: "" },
          { content: "console.log('Stake ID:', stakeId)" },
        ]}
        showLineNumbers={false}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Staked liquidity backs the coverage your pool sells. When claims are
        paid, they come from this liquidity. Premiums accumulate in the pool as
        coverage is purchased.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="coverage-lifecycle"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Coverage lifecycle
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        When a developer purchases coverage from your pool:
      </p>

      <DocsTable columns={lifecycleColumns} rows={lifecycleRows} />

      {/* ------------------------------------------------------------------ */}
      <h2
        id="coverage-states"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Coverage states
      </h2>

      <DocsTable columns={stateColumns} rows={stateRows} />

      {/* ------------------------------------------------------------------ */}
      <h2
        id="purchase-coverage"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Purchase coverage (developer side)
      </h2>

      <CodeBlock
        tabs={[
          {
            label: "Purchase coverage",
            language: "typescript",
            filename: "purchase-coverage.ts",
            lines: [
              {
                content:
                  "const coverage = await sdk.insurance.purchaseCoverage({",
              },
              { content: "  pool: '0xPool...'," },
              { content: "  policy: '0xPolicy...'," },
              { content: "  escrowId: escrow.id," },
              {
                content: "  coverageAmount: sdk.usdc(50000),",
                highlighted: true,
              },
              {
                content:
                  "  expiry: Math.floor(Date.now() / 1000) + 86400 * 30,",
              },
              { content: "})" },
              { content: "" },
              {
                content: "console.log('Coverage ID:', coverage.id)",
              },
              { content: "" },
              { content: "// Check status" },
              {
                content:
                  "const status = await coverage.status() // Active | Disputed | Claimed | Expired",
              },
              { content: "" },
              { content: "// File a dispute" },
              {
                content: "await coverage.dispute('0xProofBytes...')",
              },
            ],
          },
          {
            label: "Atomic escrow + coverage",
            language: "typescript",
            filename: "atomic-create.ts",
            lines: [
              { content: "const escrow = await sdk.escrow" },
              { content: "  .build()" },
              { content: "  .amount(sdk.usdc(50000))" },
              { content: "  .owner('0xSeller...')" },
              {
                content: "  .condition('0xResolver...', resolverData)",
              },
              {
                content: "  .insurance({",
                highlighted: true,
              },
              {
                content: "    pool: '0xPool...',",
                highlighted: true,
              },
              {
                content: "    policy: '0xPolicy...',",
                highlighted: true,
              },
              {
                content: "    coverageAmount: sdk.usdc(50000),",
                highlighted: true,
              },
              {
                content:
                  "    expiry: Math.floor(Date.now() / 1000) + 86400 * 30,",
                highlighted: true,
              },
              { content: "  })", highlighted: true },
              { content: "  .create()" },
            ],
          },
        ]}
      />

      {/* ------------------------------------------------------------------ */}
      <h2
        id="withdraw-and-unstake"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Withdraw and unstake
      </h2>

      <CodeBlock
        filename="unstake.ts"
        language="typescript"
        lines={[
          { content: "// Unstake" },
          { content: "await pool.unstake(stakeId)" },
          { content: "" },
          {
            content:
              "// Premium distribution to individual stakers is in progress",
          },
          { content: "// Premiums accumulate in the pool for now" },
        ]}
        showLineNumbers={false}
      />

      {/* ------------------------------------------------------------------ */}
      <h2
        id="privacy"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Privacy
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        In confidential (FHE) mode, per-buyer financial values are encrypted{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          euint64
        </code>{" "}
        and never leak through events (per-buyer premium and payout are emitted
        as 0). Plain mode ships the same lifecycle without encryption.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Confidential in encrypted mode:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>Per-buyer stake amounts</li>
        <li>Per-buyer coverage amounts and risk scores</li>
        <li>Per-buyer premium payments and payout amounts</li>
        <li>Total liquidity and total premiums (aggregates also encrypted)</li>
      </ul>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Public on both modes:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>Coverage lifecycle events (without amounts)</li>
        <li>Policy and pool addresses (publishable for discovery)</li>
        <li>Pool-creation event</li>
        <li>Dispute event (with caller, without verdict)</li>
      </ul>

      <Callout variant="info" title="Disclosure bound (Whitepaper Prop 7.2)">
        <p>
          The Premium/Loss-Ratio Disclosure Bound formalises this split. In
          encrypted mode, per-buyer financial values cannot be reconstructed
          from chain state under TFHE IND-CPA security — but policy/pool
          identities and lifecycle existence remain observable so integrators
          can find your pool.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
