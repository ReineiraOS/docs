import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import CodeBlock from "@/components/docs/CodeBlock";
import DocsTable from "@/components/docs/DocsTable";
import PropertyCard from "@/components/docs/PropertyCard";
import Callout from "@/components/docs/Callout";
import PageNav from "@/components/docs/PageNav";
import StatusBadge from "@/components/docs/StatusBadge";
import ModeToggle from "@/components/docs/ModeToggle";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "create", title: "Create", level: 2 },
  { id: "create-options", title: "Create options", level: 3 },
  { id: "builder-pattern", title: "Builder pattern", level: 3 },
  { id: "escrow-instance", title: "EscrowInstance", level: 2 },
  { id: "plain-track", title: "Public track (Plain)", level: 2 },
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
    name: "recourse.pool",
    type: "string",
    required: false,
    description: "Coverage pool address.",
  },
  {
    name: "recourse.policy",
    type: "string",
    required: false,
    description: "Underwriter policy contract address.",
  },
  {
    name: "recourse.coverageAmount",
    type: "bigint",
    required: false,
    description: "Coverage amount in token base units.",
  },
  {
    name: "recourse.expiry",
    type: "number",
    required: false,
    description: "Coverage expiry as Unix timestamp.",
  },
  {
    name: "recourse.policyData",
    type: "string",
    required: false,
    description: "Optional ABI-encoded data passed to the underwriter policy.",
  },
  {
    name: "recourse.riskProof",
    type: "string",
    required: false,
    description: "Optional encoded risk proof for the underwriter policy.",
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
    desc: "Recourse coverage (if purchased)",
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
    desc: "Heuristic funded check (scans EscrowFunded logs over ~last 10k blocks, not an on-chain flag)",
  },
  {
    prop: "isConditionMet()",
    type: "Promise<boolean>",
    desc: "Check resolver condition",
  },
  {
    prop: "isRedeemable()",
    type: "Promise<boolean>",
    desc: "exists && isFunded && isConditionMet",
  },
  {
    prop: "waitForFunded(timeout?)",
    type: "Promise<void>",
    desc: "Wait for funding event",
  },
  {
    prop: "waitForRedeemable(opts?)",
    type: "Promise<void>",
    desc: "Poll until redeemable",
  },
];

const plainInstanceColumns = [
  { header: "Method", key: "prop", mono: true, width: "240px" },
  { header: "Type", key: "type", type: true, width: "240px" },
  { header: "Description", key: "desc" },
];

const plainInstanceRows = [
  {
    prop: "fund(amount, opts?)",
    type: "Promise<FundResult>",
    desc: "Fund the escrow. opts.autoApprove approves token spending first.",
  },
  {
    prop: "redeem()",
    type: "Promise<TransactionResult>",
    desc: "Redeem funds to the owner",
  },
  {
    prop: "owner()",
    type: "Promise<string>",
    desc: "Read the plaintext owner address",
  },
  {
    prop: "amount()",
    type: "Promise<bigint>",
    desc: "Read the plaintext escrow amount",
  },
  {
    prop: "paidAmount()",
    type: "Promise<bigint>",
    desc: "Read the plaintext amount funded so far",
  },
  {
    prop: "isRedeemed()",
    type: "Promise<boolean>",
    desc: "Read the on-chain redeemed flag",
  },
  {
    prop: "isFunded()",
    type: "Promise<boolean>",
    desc: "Check if fully funded",
  },
  {
    prop: "exists()",
    type: "Promise<boolean>",
    desc: "Check if the escrow exists",
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
        description="sdk.escrow — create, fund, and settle Escrows. The encrypted track (sdk.escrow) targets v1.0; the public track (sdk.escrowPlain) is live on chaos-net."
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
        Full create with a Gate resolver and Recourse coverage:
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
          { content: "  recourse: {", highlighted: true },
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
          { content: "  .recourse({" },
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

      {/* ── Public track (Plain) ───────────────────────────────────────── */}
      <h2
        id="plain-track"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Public track (Plain){" "}
        <StatusBadge
          status="live"
          detail="chaos-net"
          className="align-middle"
        />
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Everything above describes{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          sdk.escrow
        </code>{" "}
        — the <strong>encrypted</strong> track (
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          ConfidentialEscrow
        </code>
        ), which targets v1.0 mainnet. A mirror <strong>public</strong> track
        runs today on chaos-net with the same shape but plaintext state.
      </p>

      <ModeToggle
        publicMode={
          <div>
            <p>
              <code>sdk.escrowPlain</code> (the <code>PlainEscrowModule</code>)
              returns a <code>PlainEscrowInstance</code> backed by the{" "}
              <code>Escrow.sol</code> contract and the <code>plain*</code>{" "}
              deployment addresses. State (owner, amount, paidAmount, redeemed)
              is readable on-chain. This is what is live on chaos-net.
            </p>
          </div>
        }
        encryptedMode={
          <div>
            <p>
              <code>sdk.escrow</code> (the <code>EscrowModule</code>) returns an{" "}
              <code>EscrowInstance</code> backed by{" "}
              <code>ConfidentialEscrow.sol</code>. State is held as FHE
              ciphertexts. This track activates at v1.0 mainnet.
            </p>
          </div>
        }
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          PlainEscrowInstance
        </code>{" "}
        exposes a comparable surface:
      </p>

      <DocsTable columns={plainInstanceColumns} rows={plainInstanceRows} />

      <CodeBlock
        filename="plain-escrow.ts"
        language="typescript"
        lines={[
          { content: "// Public track — live on chaos-net" },
          { content: "const escrow = await sdk.escrowPlain.create({" },
          { content: "  amount: sdk.usdc(1000)," },
          { content: "  owner: '0xRecipient...'," },
          { content: "})" },
          { content: "" },
          {
            content: "await escrow.fund(sdk.usdc(1000), { autoApprove: true })",
          },
          { content: "await escrow.redeem()" },
        ]}
      />

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
          { content: "sdk.escrow.get(42n)   // get EscrowInstance by ID" },
          {
            content:
              "sdk.escrow.total()    // total escrows created (Promise<bigint>)",
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
