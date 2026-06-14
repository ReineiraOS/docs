import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import CodeBlock from "@/components/docs/CodeBlock";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import DocsBadge from "@/components/docs/DocsBadge";
import StatusBadge from "@/components/docs/StatusBadge";
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

const { prev, next } = getPrevNext("/build/recourse-pools");

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
    what: "Buyer files dispute with proof; policy\u2019s judge() runs and, if valid, the coverage moves Active \u2192 Claimed in the same call",
    who: "Buyer / developer",
  },
  {
    step: "6. Claim payout",
    what: "If the verdict is valid, the claim is paid from pool liquidity; otherwise the call reverts DisputeRejected",
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
    state: <DocsBadge variant="red">Claimed</DocsBadge>,
    meaning:
      "Dispute was valid \u2014 claim paid from pool. dispute() moves Active \u2192 Claimed atomically.",
  },
  {
    state: <DocsBadge variant="default">Expired</DocsBadge>,
    meaning: "Coverage period ended with no dispute \u2014 premium earned",
  },
];

const plainPoolColumns = [
  { header: "Member", key: "member", mono: true, width: "200px" },
  { header: "Role", key: "role", width: "150px" },
  { header: "Description", key: "desc" },
];
const plainPoolRows = [
  {
    member: "creator / manager / guardian",
    role: "view",
    desc: "Current role holders on the pool",
  },
  {
    member: "isOpen / paymentToken",
    role: "view",
    desc: "Whether the pool is open, and its allow-listed payment token",
  },
  {
    member: "totalLiquidity / stakedAmount",
    role: "view",
    desc: "Pool-level liquidity and your staked balance",
  },
  {
    member: "transferManager(addr)",
    role: "Creator",
    desc: "Hand the Manager role to another address",
  },
  {
    member: "addPolicy / removePolicy",
    role: "Creator",
    desc: "Curate registered policies (reverts InvalidPolicy if unregistered)",
  },
  {
    member: "isPolicy(addr)",
    role: "view",
    desc: "Check whether a policy is approved on this pool",
  },
  {
    member: "stake / unstake",
    role: "LP",
    desc: "Deposit or withdraw liquidity",
  },
  {
    member: "pendingRewards / claimRewards",
    role: "Spec'd",
    desc: "No-op today \u2014 returns 0 / transfers nothing (per-LP rewards Spec'd)",
  },
];

export default function RecoursePools() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Recourse Pools"
        description="Create Recourse pools, curate policies, provide liquidity, and collect premiums on every coverage purchase."
        readingTime="8 min read"
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Anyone can create a Recourse pool, attach policies, and provide
        liquidity. This is the open economy layer of ReineiraOS — the best
        underwriters build the best pools. The public track (
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          sdk.recoursePlain
        </code>
        ) is live on chaos-net; the encrypted track (
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          sdk.recourse
        </code>
        ) is the v1.0 target.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="the-model"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        The model
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Think of Recourse pools like Morpho vaults:
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
          accrue to the pool on every coverage purchase, into a single pool
          bucket
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            The Manager
          </strong>{" "}
          withdraws accrued premiums via{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            claimPremiums()
          </code>
        </li>
      </ul>

      <Callout variant="warning" title="Per-LP reward distribution is Spec'd">
        <p>
          Today premiums accrue to one pool bucket and are withdrawable only by
          the Manager. Per-staker reward distribution is not live:{" "}
          <code>pendingRewards()</code> returns <code>0</code> and{" "}
          <code>claimRewards()</code> emits an event but transfers nothing on
          both <code>RecoursePool</code> and <code>ConfidentialRecoursePool</code>
          . Build against the interface; do not promise stakers a yield stream
          yet. <StatusBadge status="spec" detail="per-LP rewards" />
        </p>
      </Callout>

      <Callout variant="tip" title="Quality drives growth">
        <p>
          The better your policies (accurate risk scoring, fair disputes), the
          more builders trust your pool and the more coverage is purchased.
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
          { content: "// Public track (live on chaos-net)" },
          {
            content: "const pool = await sdk.recoursePlain.createPool({",
          },
          {
            content: "  paymentToken: sdk.addresses.plainUSDC,",
            highlighted: true,
          },
          { content: "  // optional — default to caller / open pool" },
          { content: "  initialManager: '0xManager...'," },
          { content: "  guardian: '0xGuardian...'," },
          { content: "  isOpen: true," },
          { content: "})" },
          { content: "" },
          { content: "console.log('Pool ID:', pool.id)" },
          {
            content: "console.log('Pool address:', pool.address)",
          },
        ]}
        showLineNumbers={false}
      />

      <Callout variant="warning" title="Allow-list the payment token first">
        <p>
          <code>paymentToken</code> must be allow-listed via{" "}
          <code>PoolFactory.addAllowedToken()</code> (owner-only) or{" "}
          <code>createPool</code> reverts <code>TokenNotAllowed</code>. Only{" "}
          <code>paymentToken</code> is required; <code>initialManager</code>,{" "}
          <code>guardian</code>, and <code>isOpen</code> are optional. The pool
          container is a <code>RecoursePool</code> (or{" "}
          <code>ConfidentialRecoursePool</code> on the encrypted track) proxy
          deployed by <code>PoolFactory</code>.
        </p>
      </Callout>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        You are now the pool Creator. The pool is yours to manage — assign a
        Manager and Guardian, curate policies, and gate liquidity if you keep it
        private.
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
            content: "await pool.addPolicy('0xCargoRecoursePolicy...')",
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
        has approved. A policy must first be allow-listed protocol-wide via{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          PolicyRegistry.registerPolicy()
        </code>{" "}
        (owner-only, ERC-165-checked);{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          addPolicy()
        </code>{" "}
        reverts <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          InvalidPolicy
        </code>{" "}
        otherwise.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        On the public track, <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          PlainPoolInstance
        </code>{" "}
        exposes the full Creator / Manager surface:
      </p>

      <DocsTable columns={plainPoolColumns} rows={plainPoolRows} />

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
        paid, they come from this liquidity. Premiums accumulate in a single
        pool bucket as coverage is purchased, and the Manager withdraws them via{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          claimPremiums()
        </code>
        .
      </p>

      <Callout variant="warning" title="LP yield is not wired yet">
        <p>
          The yield subsystem (<code>StrategyRouter</code>,{" "}
          <code>IYieldAdapter</code>, <code>PoolRiskLib</code>) is built but not
          wired to the pool — the pool↔router hook is deferred (ADR-0002) and
          only a <code>MockYieldAdapter</code> exists. Combined with the no-op
          reward accounting above, there is no live per-LP yield stream today.{" "}
          <StatusBadge status="spec" detail="pool↔router hook" />
        </p>
      </Callout>

      <h3 className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3">
        Open vs private pools
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Pools carry an <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          isOpen
        </code>{" "}
        flag. Open pools let anyone purchase coverage. Private pools require an
        EIP-712 coverage-invite voucher signed by the Manager (
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          CoverageInviteLib
        </code>
        ) — vouchers are revocable and carry a <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          maxUses
        </code>{" "}
        cap. On the public track,{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          purchaseCoverage
        </code>{" "}
        accepts <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          invite
        </code>{" "}
        and <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          inviteSig
        </code>{" "}
        fields; the encrypted (FHE) coverage path does not support invites yet.
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
                  "const coverage = await sdk.recourse.purchaseCoverage({",
              },
              { content: "  pool: '0xPool...'," },
              { content: "  policy: '0xPolicy...'," },
              { content: "  escrowId: escrow.id,", highlighted: true },
              {
                content: "  coverageAmount: sdk.usdc(50000), // capped to escrow",
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
                  "const status = await coverage.status() // Active | Claimed | Expired",
              },
              { content: "" },
              { content: "// File a dispute — resolves Active -> Claimed atomically" },
              {
                content: "await coverage.dispute('0xProofBytes...')",
              },
            ],
          },
          {
            label: "Atomic Escrow and coverage",
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
                content: "  .recourse({",
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
              "// Per-LP reward distribution is Spec'd (not live):",
          },
          { content: "// pendingRewards() returns 0, claimRewards() is a no-op." },
          {
            content: "// Premiums accrue to the pool; the Manager calls claimPremiums().",
          },
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
        On the encrypted track (<code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          sdk.recourse
        </code>
        ), all financial values in the Recourse system are FHE-encrypted:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>Stake amounts</li>
        <li>Coverage amounts</li>
        <li>Risk scores</li>
        <li>Premium payments</li>
        <li>Claim payouts</li>
      </ul>

      <Callout variant="info" title="On-chain privacy">
        <p>
          On-chain events emit only indexed IDs. No amounts, no addresses, no
          policy details are visible to chain observers.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
