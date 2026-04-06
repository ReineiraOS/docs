import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import CodeBlock from "@/components/docs/CodeBlock";
import DocsTable from "@/components/docs/DocsTable";
import ArchitectureDiagram from "@/components/docs/ArchitectureDiagram";
import PageNav from "@/components/docs/PageNav";
import LinkCard from "@/components/docs/LinkCard";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";
import { Rocket, Brain, Puzzle } from "lucide-react";

const toc: TocItem[] = [
  { id: "the-problem", title: "The problem", level: 2 },
  { id: "what-is-reineira", title: "What is ReineiraOS?", level: 2 },
  { id: "core-properties", title: "Core properties", level: 2 },
  { id: "confidential-by-default", title: "Confidential by default", level: 3 },
  { id: "pluggable-verification", title: "Pluggable verification", level: 3 },
  { id: "open-insurance-economy", title: "Open coverage economy", level: 3 },
  { id: "what-you-get", title: "What you get", level: 2 },
  { id: "sdk-example", title: "SDK example", level: 2 },
  { id: "who-is-it-for", title: "Who is it for?", level: 2 },
  { id: "next-steps", title: "Next steps", level: 2 },
];

const { prev, next } = getPrevNext("/get-started/overview");

// -- Table data ---------------------------------------------------------------

const whatYouGetColumns = [
  { header: "Capability", key: "capability", width: "200px" },
  { header: "Description", key: "description" },
];

const whatYouGetRows = [
  {
    capability: "Escrow",
    description:
      "FHE-encrypted escrow that holds funds — amounts, parties, and conditions are never exposed on-chain in cleartext.",
  },
  {
    capability: "Gate",
    description:
      "Pluggable verification contract that controls when an Escrow releases funds — zkTLS proofs, oracles, prediction markets, time locks, or your own logic.",
  },
  {
    capability: "Insurance",
    description:
      "Protocol-native coverage pools for chargebacks, fraud, and delivery failures. Underwriters earn yield by staking capital.",
  },
  {
    capability: "Operators",
    description:
      "Staked operator network that coordinates cross-chain messaging and settlement relay.",
  },
  {
    capability: "Cross-Chain Settlement",
    description:
      "Native USDC settlement across EVM chains via Circle CCTP V2. Fund Escrows from any supported chain.",
  },
];

// -- Code data ----------------------------------------------------------------

const sdkLines = [
  { content: "import { ReineiraSDK } from '@reineira-os/sdk'" },
  { content: "" },
  { content: "const sdk = ReineiraSDK.create({" },
  { content: "  network: 'testnet'," },
  { content: "  privateKey: process.env.PRIVATE_KEY," },
  { content: "})" },
  { content: "await sdk.initialize()" },
  { content: "" },
  { content: "// 1. Create an Escrow with a Gate condition" },
  { content: "const vault = await sdk.escrow", highlighted: true },
  { content: "  .build()", highlighted: true },
  { content: "  .amount(sdk.usdc(5000))", highlighted: true },
  { content: "  .owner('0xSeller...')", highlighted: true },
  {
    content: "  .condition('0xPayPalGate...', resolverData)",
    highlighted: true,
  },
  { content: "  .create()", highlighted: true },
  { content: "" },
  { content: "// 2. Purchase insurance for the Escrow" },
  {
    content: "const coverage = await sdk.insurance.purchaseCoverage({",
    highlighted: true,
  },
  { content: "  pool: '0xPool...',", highlighted: true },
  { content: "  policy: '0xPolicy...',", highlighted: true },
  { content: "  escrowId: vault.id,", highlighted: true },
  { content: "  coverageAmount: sdk.usdc(5000),", highlighted: true },
  {
    content: "  expiry: Math.floor(Date.now() / 1000) + 86400 * 30,",
    highlighted: true,
  },
  { content: "})", highlighted: true },
  { content: "" },
  { content: "// 3. Fund the Escrow (cross-chain from another EVM chain)" },
  { content: "await vault.fund(sdk.usdc(5000), {" },
  { content: "  crossChain: {" },
  { content: "    sourceRpc: process.env.ETH_RPC," },
  { content: "    sourcePrivateKey: process.env.SOURCE_KEY," },
  { content: "  }," },
  { content: "  waitForSettlement: true," },
  { content: "})" },
];

export default function Overview() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Overview"
        description="Conditional settlement infrastructure — money that only moves when cryptographic conditions are met, and nobody sees the state."
        readingTime="5 min read"
      />

      {/* -- The problem -------------------------------------------------------- */}
      <h2
        id="the-problem"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        The problem
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Every crypto payment today is fire-and-forget. You send money and hope
        the other side delivers. There is no escrow, no conditional release, no
        insurance. $2 trillion in assets and $300 billion in stablecoin supply —
        with zero settlement assurance infrastructure.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Every financial system eventually grows a settlement assurance layer.
        Stock exchanges built clearing houses. Credit cards built chargeback
        systems. E-commerce built escrow. Crypto has none of this.
      </p>

      {/* -- What is ReineiraOS ------------------------------------------------ */}
      <h2
        id="what-is-reineira"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        What is ReineiraOS?
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS is conditional settlement infrastructure. Money only moves
        when cryptographic conditions are met, and the entire state is
        encrypted. Install the SDK, define how money moves, and ship
        non-custodial payment products — marketplaces, agent wallets, payroll,
        cargo settlement — without building escrow, compliance, or cross-chain
        plumbing yourself.
      </p>

      <Callout variant="info" title="What ReineiraOS is not">
        <p>
          ReineiraOS is <strong>not</strong> a privacy chain (it deploys on
          existing EVM chains), <strong>not</strong> a payment processor (the
          money moves through USDC/CCTP), <strong>not</strong> a DeFi protocol
          (revenue comes from fees, not emissions), and <strong>not</strong> an
          oracle network (Gates consume oracles — they don't replace them).
        </p>
      </Callout>

      <ArchitectureDiagram
        title="CONDITIONAL SETTLEMENT FLOW"
        steps={[
          { label: "Create Escrow", sublabel: "FHE-encrypted on-chain" },
          { label: "Attach Gate", sublabel: "Pluggable verification logic" },
          { label: "Verify & Settle", sublabel: "Gate opens → funds release" },
        ]}
      />

      {/* -- Core properties --------------------------------------------------- */}
      <h2
        id="core-properties"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Core properties
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS is built on three foundational properties that distinguish it
        from traditional payment infrastructure:
      </p>

      <h3
        id="confidential-by-default"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        1. Confidential by default (Escrows)
      </h3>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Every Escrow is encrypted end-to-end using Fully Homomorphic Encryption
        (FHE). Amounts, parties, and conditions remain private on-chain. No one
        — not even node operators — can see the contents of an Escrow without
        explicit decryption authorization. Encrypted state means competitors
        can't front-run your settlement and chain analysts can't
        reverse-engineer your margins.
      </p>

      <h3
        id="pluggable-verification"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        2. Pluggable verification (Gates)
      </h3>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        A Gate is a smart contract that implements{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          IConditionResolver
        </code>
        . It controls when an Escrow releases funds. Attach any verification
        logic — zkTLS proofs from Reclaim Protocol, Chainlink oracles,
        prediction market outcomes, or your own custom contract. The protocol
        does not dictate how conditions are verified; you do.
      </p>

      <h3
        id="open-insurance-economy"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        3. Open coverage economy (Insurance)
      </h3>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Insurance pools provide LP-backed coverage with encrypted risk scoring.
        The{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          IUnderwriterPolicy
        </code>{" "}
        interface lets underwriters define risk evaluation and dispute
        resolution logic. Underwriters stake into coverage pools, earn premiums,
        and cover chargebacks, fraud, and delivery failures. Buyers get coverage
        without leaving the protocol.
      </p>

      {/* -- What you get ------------------------------------------------------ */}
      <h2
        id="what-you-get"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        What you get
      </h2>

      <DocsTable columns={whatYouGetColumns} rows={whatYouGetRows} />

      {/* -- SDK example ------------------------------------------------------- */}
      <h2
        id="sdk-example"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        SDK example
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Create an Escrow, purchase insurance, and fund it cross-chain — three
        steps:
      </p>

      <CodeBlock
        filename="create-escrow.ts"
        language="typescript"
        lines={sdkLines}
        showLineNumbers={true}
      />

      <Callout variant="tip" title="Builder pattern">
        <p>
          The SDK uses a fluent builder for Escrow creation. Chain{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            .amount()
          </code>{" "}
          and{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            .condition()
          </code>{" "}
          calls before calling{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            .create()
          </code>
          . Insurance is purchased separately via{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            sdk.insurance.purchaseCoverage()
          </code>{" "}
          after the Escrow exists.
        </p>
      </Callout>

      {/* -- Who is it for ----------------------------------------------------- */}
      <h2
        id="who-is-it-for"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Who is it for?
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Anyone shipping payment products where money must move conditionally —
        businesses building marketplaces, developers integrating escrow into
        dApps, AI agents that need programmatic conditional settlement, and
        plugin builders extending the protocol with new Gates or insurance
        policies.
      </p>

      <Callout variant="info" title="No crypto experience required">
        <p>
          The SDK abstracts away FHE encryption, cross-chain bridging, and smart
          contract interactions. If you can write TypeScript, you can build on
          ReineiraOS.
        </p>
      </Callout>

      {/* -- Next steps -------------------------------------------------------- */}
      <h2
        id="next-steps"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Next steps
      </h2>

      <LinkCard
        items={[
          {
            title: "Quick Start",
            description: "Deploy your first Escrow in under 5 minutes.",
            href: "/get-started/quick-start",
            icon: Rocket,
          },
          {
            title: "Mental Model",
            description: "Core primitives: Escrow, Gate, Insurance, Operators.",
            href: "/learn/mental-model",
            icon: Brain,
          },
          {
            title: "Condition Resolvers",
            description:
              "Build custom verification logic for conditional settlement.",
            href: "/build/condition-resolvers",
            icon: Puzzle,
          },
        ]}
      />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
