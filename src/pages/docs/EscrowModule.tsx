import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import CodeBlock from "@/components/docs/CodeBlock";
import DocsTable from "@/components/docs/DocsTable";
import PropertyCard from "@/components/docs/PropertyCard";
import Callout from "@/components/docs/Callout";
import PageNav from "@/components/docs/PageNav";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "create", title: "Create", level: 2 },
  { id: "create-options", title: "Create options", level: 3 },
  { id: "builder-pattern", title: "Builder pattern", level: 3 },
  { id: "escrow-instance", title: "EscrowInstance", level: 2 },
  { id: "fund-options", title: "Fund options", level: 2 },
  { id: "fund-params", title: "Fund parameters", level: 3 },
  { id: "redeem-options", title: "Redeem options", level: 2 },
  { id: "static-methods", title: "Static methods", level: 2 },
  { id: "events", title: "Events", level: 2 },
];

const { prev, next } = getPrevNext("/reference/escrow-module");

const createProperties = [
  {
    name: "amount",
    type: "bigint",
    required: true,
    description: "Escrow amount in token base units. Use sdk.usdc(n) for USDC.",
  },
  {
    name: "owner",
    type: "string",
    required: true,
    description: "Address of the escrow recipient/owner.",
  },
  {
    name: "resolver",
    type: "string",
    required: false,
    description: "Address of the IConditionResolver contract.",
  },
  {
    name: "resolverData",
    type: "string",
    required: false,
    description:
      "ABI-encoded data passed to the resolver's onConditionSet hook.",
  },
  {
    name: "insurance.pool",
    type: "string",
    required: false,
    description: "Insurance pool address.",
  },
  {
    name: "insurance.policy",
    type: "string",
    required: false,
    description: "Insurance policy contract address.",
  },
  {
    name: "insurance.coverageAmount",
    type: "bigint",
    required: false,
    description: "Coverage amount in token base units.",
  },
  {
    name: "insurance.expiry",
    type: "number",
    required: false,
    description: "Coverage expiry as Unix timestamp.",
  },
];

const instanceColumns = [
  { header: "Property / Method", key: "prop", mono: true, width: "240px" },
  { header: "Type", key: "type", type: true, width: "240px" },
  { header: "Description", key: "desc" },
];

const instanceRows = [
  { prop: "id", type: "bigint", desc: "Sequential escrow identifier" },
  {
    prop: "createTx",
    type: "{ hash, blockNumber, gasUsed }",
    desc: "Creation transaction details",
  },
  {
    prop: "coverage",
    type: "CoverageInstance | undefined",
    desc: "Insurance coverage (if purchased)",
  },
  {
    prop: "approve(opts?)",
    type: "Promise<TransactionResult>",
    desc: "Approve token spending",
  },
  {
    prop: "fund(amount, opts?)",
    type: "Promise<FundResult>",
    desc: "Fund the escrow",
  },
  {
    prop: "redeem()",
    type: "Promise<TransactionResult>",
    desc: "Redeem funds to owner",
  },
  {
    prop: "isApproved()",
    type: "Promise<boolean>",
    desc: "Check if operator is approved",
  },
  {
    prop: "exists()",
    type: "Promise<boolean>",
    desc: "Check if escrow exists",
  },
  {
    prop: "isFunded()",
    type: "Promise<boolean>",
    desc: "Check if fully funded",
  },
  {
    prop: "isConditionMet()",
    type: "Promise<boolean>",
    desc: "Check resolver condition",
  },
  {
    prop: "isRedeemable()",
    type: "Promise<boolean>",
    desc: "funded + condition met + not redeemed",
  },
  {
    prop: "waitForFunded(timeoutMs?)",
    type: "Promise<SettlementResult>",
    desc: "Wait for funding event (default timeout 600_000 ms)",
  },
  {
    prop: "waitForRedeemable(opts?)",
    type: "Promise<void>",
    desc: "Poll until redeemable",
  },
];

const fundProperties = [
  {
    name: "autoApprove",
    type: "boolean",
    required: false,
    default: "false",
    description: "Automatically approve token spending before funding.",
  },
  {
    name: "crossChain.sourceRpc",
    type: "string",
    required: false,
    description: "RPC URL for the source chain (cross-chain funding).",
  },
  {
    name: "crossChain.sourcePrivateKey",
    type: "string",
    required: false,
    description: "Private key on the source chain.",
  },
  {
    name: "waitForSettlement",
    type: "boolean",
    required: false,
    default: "false",
    description:
      "Wait for cross-chain settlement to complete before returning.",
  },
  {
    name: "settlementTimeoutMs",
    type: "number",
    required: false,
    default: "600000",
    description: "Timeout in milliseconds for settlement wait.",
  },
];

export default function EscrowModule() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Escrow Module"
        description="sdk.escrow — create, fund, and settle confidential (FHE) escrows. For the plaintext mainnet-launch path use sdk.escrowPlain, which exposes the same surface against the plain-mode deployment."
        readingTime="6 min read"
      />

      {/* ── Create ─────────────────────────────────────────────────────── */}
      <h2
        id="create"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Create
      </h2>

      <h3
        id="create-options"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Create options
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Simple create with minimal options:
      </p>

      <CodeBlock
        filename="simple-create.ts"
        language="typescript"
        lines={[
          { content: "// Simple create" },
          { content: "const escrow = await sdk.escrow.create({" },
          { content: "  amount: sdk.usdc(1000),", highlighted: true },
          { content: "  owner: '0xRecipient...',", highlighted: true },
          { content: "})" },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4 mt-6">
        Full create with resolver and insurance:
      </p>

      <CodeBlock
        filename="full-create.ts"
        language="typescript"
        lines={[
          { content: "const escrow = await sdk.escrow.create({" },
          { content: "  amount: sdk.usdc(1000)," },
          { content: "  owner: '0xRecipient...'," },
          { content: "  resolver: '0xResolver...'," },
          { content: "  resolverData: '0x...'," },
          { content: "  insurance: {" },
          { content: "    pool: '0xPool...'," },
          { content: "    policy: '0xPolicy...'," },
          { content: "    coverageAmount: sdk.usdc(1000)," },
          {
            content: "    expiry: Math.floor(Date.now() / 1000) + 86400 * 30,",
          },
          { content: "  }," },
          { content: "})" },
        ]}
      />

      <PropertyCard
        title="sdk.escrow.create(options)"
        properties={createProperties}
      />

      <h3
        id="builder-pattern"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Builder pattern
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Alternatively, use the fluent builder API:
      </p>

      <CodeBlock
        filename="builder.ts"
        language="typescript"
        lines={[
          { content: "const escrow = await sdk.escrow" },
          { content: "  .build()" },
          { content: "  .amount(sdk.usdc(1000))" },
          { content: "  .owner('0xRecipient...')" },
          { content: "  .condition('0xResolver...', encodedData)" },
          { content: "  .insurance({" },
          { content: "    pool: '0xPool...'," },
          { content: "    policy: '0xPolicy...'," },
          { content: "    coverageAmount: sdk.usdc(1000)," },
          { content: "    expiry," },
          { content: "  })" },
          { content: "  .create()" },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4 mt-4">
        Returns:{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          EscrowInstance
        </code>
      </p>

      {/* ── EscrowInstance ──────────────────────────────────────────────── */}
      <h2
        id="escrow-instance"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        EscrowInstance
      </h2>

      <DocsTable columns={instanceColumns} rows={instanceRows} />

      {/* ── Fund options ───────────────────────────────────────────────── */}
      <h2
        id="fund-options"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Fund options
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Same-chain funding:
      </p>

      <CodeBlock
        filename="fund-same-chain.ts"
        language="typescript"
        lines={[
          {
            content: "await escrow.fund(sdk.usdc(1000), { autoApprove: true })",
          },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4 mt-6">
        Cross-chain funding with settlement wait:
      </p>

      <CodeBlock
        filename="fund-cross-chain.ts"
        language="typescript"
        lines={[
          { content: "await escrow.fund(sdk.usdc(1000), {" },
          { content: "  autoApprove: true," },
          { content: "  crossChain: {" },
          {
            content: "    sourceRpc: 'https://eth-sepolia-rpc...',",
            highlighted: true,
          },
          {
            content: "    sourcePrivateKey: process.env.SOURCE_KEY,",
            highlighted: true,
          },
          { content: "  }," },
          { content: "  waitForSettlement: true," },
          { content: "  settlementTimeoutMs: 600_000," },
          { content: "})" },
        ]}
      />

      <h3
        id="fund-params"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Fund parameters
      </h3>

      <PropertyCard
        title="escrow.fund(amount, options)"
        properties={fundProperties}
      />

      <Callout variant="warning" title="Cross-chain settlement">
        <p>
          Cross-chain funding uses Circle CCTP v2. Settlement typically takes
          2-5 minutes. Set{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            waitForSettlement: true
          </code>{" "}
          to block until the escrow is funded on the destination chain.
        </p>
      </Callout>

      {/* ── Redeem options ──────────────────────────────────────────────── */}
      <h2
        id="redeem-options"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Redeem options
      </h2>

      <CodeBlock
        filename="redeem.ts"
        language="typescript"
        lines={[
          { content: "// Redeem a single escrow" },
          {
            content: "const result = await escrow.redeem()",
            highlighted: true,
          },
          { content: "console.log('Redeemed:', result.hash)" },
          { content: "" },
          { content: "// Batch redeem multiple escrows" },
          { content: "await sdk.escrow.redeemMultiple([0n, 1n, 2n])" },
        ]}
      />

      {/* ── Static methods ─────────────────────────────────────────────── */}
      <h2
        id="static-methods"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Static methods
      </h2>

      <CodeBlock
        filename="static-methods.ts"
        language="typescript"
        lines={[
          {
            content:
              "sdk.escrow.get(42n)              // synchronous — get EscrowInstance by ID",
          },
          {
            content:
              "sdk.escrow.exists(42n)           // Promise<boolean> — verify on-chain",
          },
          {
            content:
              "sdk.escrow.total()               // Promise<bigint> — total escrows created",
          },
          {
            content:
              "sdk.escrow.redeemMultiple([0n,1n]) // Promise<TransactionResult> — batch redeem, cap 20",
          },
          {
            content:
              "sdk.escrow.build()               // EscrowBuilder — fluent builder",
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
          { content: "sdk.events.onEscrowCreated((escrowId) => { ... });" },
          {
            content:
              "sdk.events.onEscrowFunded((escrowId, payer) => { ... }, filterEscrowId?);",
          },
          {
            content:
              "sdk.events.onEscrowRedeemed((escrowId) => { ... }, filterEscrowId?);",
          },
        ]}
      />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
