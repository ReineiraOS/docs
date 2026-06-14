import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import CodeBlock from "@/components/docs/CodeBlock";
import DocsTable from "@/components/docs/DocsTable";
import PropertyCard from "@/components/docs/PropertyCard";
import PageNav from "@/components/docs/PageNav";
import Callout from "@/components/docs/Callout";
import StatusBadge from "@/components/docs/StatusBadge";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "pools", title: "Pools", level: 2 },
  { id: "create-a-pool", title: "Create a pool", level: 3 },
  { id: "get-existing-pool", title: "Get existing pool", level: 3 },
  { id: "pool-instance", title: "PoolInstance", level: 3 },
  { id: "coverage", title: "Coverage", level: 2 },
  { id: "purchase-coverage", title: "Purchase coverage", level: 3 },
  { id: "coverage-instance", title: "CoverageInstance", level: 3 },
  { id: "policy-registration", title: "Policy registration", level: 3 },
  { id: "bridge", title: "Bridge", level: 2 },
  { id: "events", title: "Events", level: 2 },
];

const { prev, next } = getPrevNext("/reference/recourse-module");

const poolColumns = [
  { header: "Method", key: "method", mono: true, width: "220px" },
  { header: "Returns", key: "returns", type: true, width: "220px" },
  { header: "Description", key: "desc" },
];

const poolRows = [
  {
    method: "addPolicy(address)",
    returns: "Promise<TransactionResult>",
    desc: "Allow a policy contract on this pool",
  },
  {
    method: "removePolicy(address)",
    returns: "Promise<TransactionResult>",
    desc: "Revoke a policy from this pool",
  },
  {
    method: "stake(amount, opts?)",
    returns: "Promise<StakeResult>",
    desc: "Deposit liquidity. Returns { stakeId, tx }.",
  },
  {
    method: "unstake(stakeId)",
    returns: "Promise<TransactionResult>",
    desc: "Withdraw staked liquidity",
  },
  {
    method: "approve()",
    returns: "Promise<TransactionResult>",
    desc: "Approve token spending for staking",
  },
  {
    method: "isApproved()",
    returns: "Promise<boolean>",
    desc: "Check if token spending is approved",
  },
];

const coverageProperties = [
  {
    name: "pool",
    type: "string",
    required: true,
    description: "Recourse pool address.",
  },
  {
    name: "policy",
    type: "string",
    required: true,
    description: "Policy contract address.",
  },
  {
    name: "escrowId",
    type: "bigint",
    required: true,
    description:
      "Escrow ID to cover. Coverage is hard-bound to this escrow — reverts EscrowDoesNotExist if it does not exist.",
  },
  {
    name: "coverageAmount",
    type: "bigint",
    required: true,
    description:
      "Coverage amount in token base units. Capped to the escrow amount.",
  },
  {
    name: "expiry",
    type: "number",
    required: true,
    description: "Coverage expiry as Unix timestamp.",
  },
  {
    name: "policyData",
    type: "string",
    required: false,
    description: "Optional ABI-encoded data for the policy contract.",
  },
  {
    name: "riskProof",
    type: "string",
    required: false,
    description: "Optional risk assessment proof bytes.",
  },
];

const coverageInstanceColumns = [
  { header: "Method", key: "method", mono: true, width: "200px" },
  { header: "Returns", key: "returns", type: true, width: "220px" },
  { header: "Description", key: "desc" },
];

const coverageInstanceRows = [
  {
    method: "status()",
    returns: "Promise<CoverageStatus>",
    desc: "Active, Claimed, or Expired",
  },
  {
    method: "dispute(proof)",
    returns: "Promise<TransactionResult>",
    desc: "File a dispute with proof bytes. Resolves Active → Claimed atomically; reverts DisputeRejected on failure.",
  },
  { method: "id", returns: "bigint", desc: "Coverage identifier" },
  {
    method: "createTx",
    returns: "{ hash }",
    desc: "Purchase transaction details",
  },
];

export default function RecourseModule() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Recourse Module"
        description="sdk.recourse — create Recourse pools, manage policies, purchase coverage, and handle disputes."
        readingTime="5 min read"
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4 mt-2">
        This is{" "}
        <strong className="text-docs-text-primary font-semibold">
          Recourse
        </strong>{" "}
        — the protocol primitive behind the Shield product. The encrypted track
        (
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          sdk.recourse
        </code>
        ,{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          ConfidentialRecoursePool
        </code>
        ) is the v1.0 target; the public track (
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          sdk.recoursePlain
        </code>
        ,{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          RecoursePool.sol
        </code>
        ) is live on chaos-net today.{" "}
        <StatusBadge status="chaos-net" detail="public track" />
      </p>

      {/* ── Pools ──────────────────────────────────────────────────────── */}
      <h2
        id="pools"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Pools
      </h2>

      <h3
        id="create-a-pool"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Create a pool
      </h3>

      <CodeBlock
        filename="create-pool.ts"
        language="typescript"
        lines={[
          { content: "const pool = await sdk.recourse.createPool({" },
          {
            content: "  paymentToken: sdk.addresses.confidentialUSDC,",
            highlighted: true,
          },
          { content: "  // optional — default to caller / open pool" },
          { content: "  initialManager: '0xManager...'," },
          { content: "  guardian: '0xGuardian...'," },
          { content: "  isOpen: true," },
          { content: "})" },
          { content: "// pool.id, pool.address, pool.createTx.hash" },
        ]}
      />

      <Callout variant="warning" title="Payment token must be allow-listed">
        <p>
          <code>paymentToken</code> must be allow-listed via{" "}
          <code>PoolFactory.addAllowedToken()</code> (owner-only) before you
          create a pool with it. Otherwise <code>createPool</code> reverts{" "}
          <code>TokenNotAllowed</code>. Only <code>paymentToken</code> is
          required — <code>initialManager</code>, <code>guardian</code>, and{" "}
          <code>isOpen</code> are optional.
        </p>
      </Callout>

      <h3
        id="get-existing-pool"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Get existing pool
      </h3>

      <CodeBlock
        filename="get-pool.ts"
        language="typescript"
        lines={[
          { content: "const pool = await sdk.recourse.getPool(0n)" },
          { content: "const count = await sdk.recourse.poolCount()" },
        ]}
      />

      <h3
        id="pool-instance"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        PoolInstance
      </h3>

      <DocsTable columns={poolColumns} rows={poolRows} />

      {/* ── Coverage ───────────────────────────────────────────────────── */}
      <h2
        id="coverage"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Coverage
      </h2>

      <h3
        id="purchase-coverage"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Purchase coverage
      </h3>

      <CodeBlock
        filename="purchase-coverage.ts"
        language="typescript"
        lines={[
          { content: "// Required fields" },
          {
            content: "const coverage = await sdk.recourse.purchaseCoverage({",
          },
          { content: "  pool: '0xPool...'," },
          { content: "  policy: '0xPolicy...'," },
          { content: "  escrowId: escrow.id,", highlighted: true },
          { content: "  coverageAmount: sdk.usdc(50000),", highlighted: true },
          { content: "  expiry: Math.floor(Date.now() / 1000) + 86400 * 30," },
          { content: "})" },
        ]}
      />

      <Callout variant="info" title="Coverage is bound to an Escrow">
        <p>
          Every coverage is hard-bound to an Escrow. Purchase reverts{" "}
          <code>EscrowDoesNotExist</code> or <code>EscrowNotConfigured</code> if
          the escrow is missing or not set up, the coverage amount is capped to
          the Escrow amount, and an Escrow can carry at most{" "}
          <code>MAX_COVERAGES_PER_ESCROW</code> (5) coverages. There is no
          parametric or standalone cover.
        </p>
      </Callout>

      <p className="text-docs-text-secondary leading-relaxed mb-4 mt-6">
        With optional policy data and risk proof:
      </p>

      <CodeBlock
        filename="purchase-coverage-full.ts"
        language="typescript"
        lines={[
          {
            content: "const coverage = await sdk.recourse.purchaseCoverage({",
          },
          { content: "  pool: '0xPool...'," },
          { content: "  policy: '0xPolicy...'," },
          { content: "  escrowId: escrow.id," },
          { content: "  coverageAmount: sdk.usdc(50000)," },
          { content: "  expiry: Math.floor(Date.now() / 1000) + 86400 * 30," },
          { content: "  policyData: '0x...'," },
          { content: "  riskProof: '0x...'," },
          { content: "})" },
        ]}
      />

      <PropertyCard
        title="sdk.recourse.purchaseCoverage(options)"
        properties={coverageProperties}
      />

      <h3
        id="coverage-instance"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        CoverageInstance
      </h3>

      <DocsTable
        columns={coverageInstanceColumns}
        rows={coverageInstanceRows}
      />

      <h3
        id="policy-registration"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Policy management
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Onboarding a policy is a{" "}
        <strong className="text-docs-text-primary font-semibold">
          two-gate
        </strong>{" "}
        process:
      </p>

      <ol className="space-y-2 text-docs-text-secondary leading-relaxed list-decimal list-inside mb-4">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Protocol allow-list.
          </strong>{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            PolicyRegistry.registerPolicy(policy)
          </code>{" "}
          is owner-only and ERC-165-checked — the policy must advertise the
          underwriter-policy interface.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Pool curation.
          </strong>{" "}
          Then the pool Creator calls{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            pool.addPolicy()
          </code>{" "}
          /{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            removePolicy()
          </code>{" "}
          on PoolInstance.{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            addPolicy()
          </code>{" "}
          reverts{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            InvalidPolicy
          </code>{" "}
          unless the policy is already registered.
        </li>
      </ol>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        See the Pools section above for the Creator-only pool methods.
      </p>

      {/* ── Bridge ─────────────────────────────────────────────────────── */}
      <h2
        id="bridge"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Bridge
      </h2>

      <CodeBlock
        filename="bridge.ts"
        language="typescript"
        lines={[
          { content: "// Check operator network health" },
          { content: "const health = await sdk.bridge.checkHealth()" },
          {
            content:
              "// health.reachable, health.connectedOperators, health.operators[]",
          },
          { content: "" },
          {
            content:
              "// Submit burn tx to coordinator (used internally by fund())",
          },
          {
            content:
              "const taskId = await sdk.bridge.submitToCoordinator('0xBurnTxHash...')",
          },
        ]}
      />

      {/* ── Events ─────────────────────────────────────────────────────── */}
      <h2
        id="events"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Events
      </h2>

      <CodeBlock
        filename="events.ts"
        language="typescript"
        lines={[
          {
            content: "sdk.events.onPoolCreated((",
          },
          {
            content: "  poolId, pool, creator, manager, guardian, isOpen",
          },
          {
            content: ") => { ... });",
          },
          {
            content: "sdk.events.onCoveragePurchased((coverageId) => { ... });",
          },
          { content: "sdk.events.onDisputeFiled((coverageId) => { ... });" },
          { content: "" },
          { content: "// Query past events" },
          {
            content:
              'const logs = await sdk.events.queryEscrowEvents("EscrowCreated", fromBlock);',
          },
          { content: "" },
          { content: "// Cleanup" },
          { content: "sdk.events.removeAllListeners();" },
        ]}
      />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
