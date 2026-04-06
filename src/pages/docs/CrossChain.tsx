import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import CodeBlock from "@/components/docs/CodeBlock";
import ArchitectureDiagram from "@/components/docs/ArchitectureDiagram";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "flow", title: "Flow", level: 2 },
  { id: "supported-chains", title: "Supported chains", level: 2 },
  { id: "sdk-usage", title: "SDK usage", level: 2 },
  { id: "timing", title: "Timing", level: 2 },
  { id: "fees", title: "Fees", level: 2 },
  { id: "fallback", title: "Fallback", level: 2 },
];

const { prev, next } = getPrevNext("/docs/build/cross-chain");

const chainColumns = [
  { header: "Chain", key: "chain" },
  { header: "CCTP Domain", key: "domain", mono: true, width: "140px" },
  { header: "Status", key: "status", width: "100px" },
];
const chainRows = [
  { chain: "Arbitrum Sepolia (destination)", domain: "3", status: "Live" },
  { chain: "Ethereum Sepolia", domain: "0", status: "Live" },
  { chain: "Base Sepolia", domain: "6", status: "Live" },
];

const timingColumns = [
  { header: "Step", key: "step" },
  { header: "Typical duration", key: "duration", width: "200px" },
];
const timingRows = [
  { step: "USDC burn on source chain", duration: "~15 seconds" },
  { step: "Circle Iris attestation", duration: "60\u2013120 seconds" },
  {
    step: "Operator relay + on-chain execution",
    duration: "10\u201360 seconds",
  },
  { step: "Total end-to-end", duration: "~90\u2013200 seconds" },
];

const feeColumns = [
  { header: "Fee", key: "fee" },
  { header: "Rate", key: "rate", width: "120px" },
  { header: "Recipient", key: "recipient" },
];
const feeRows = [
  {
    fee: "Operator relay fee",
    rate: "0.35%",
    recipient: "Relay operator who executed the task",
  },
  {
    fee: "Protocol relay fee",
    rate: "0.15%",
    recipient: "ReineiraOS protocol (FeeManager)",
  },
];

export default function CrossChain() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Cross-Chain Settlement"
        description="ReineiraOS uses Circle CCTP V2 for native USDC transfers across chains. No bridges. No wrapped tokens. Real USDC is burned on the source chain and minted on the destination chain."
        readingTime="5 min read"
      />

      <h2
        id="flow"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Flow
      </h2>

      <ArchitectureDiagram
        title="CCTP V2 SETTLEMENT FLOW"
        steps={[
          { label: "Burn", sublabel: "SDK burns USDC on source chain" },
          { label: "Attest", sublabel: "Circle Iris signs the burn message" },
          { label: "Dispatch", sublabel: "Coordinator distributes relay task" },
          { label: "Claim", sublabel: "Operator claims within 60s window" },
          { label: "Fetch", sublabel: "Operator fetches signed attestation" },
          { label: "Execute", sublabel: "Relay submitted on-chain" },
          { label: "Settle", sublabel: "USDC minted on destination chain" },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The full sequence begins when the SDK calls{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          depositForBurnWithHook()
        </code>{" "}
        on the source chain. The Circle Iris attestation network signs the burn
        message, which triggers the coordinator to dispatch a relay task to an
        eligible operator. The operator fetches the signed attestation, then
        submits the message and attestation on-chain via{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          TaskExecutor &rarr; MessageTransmitter.receiveMessage()
        </code>
        . Finally, USDC is minted on the destination chain and routed to the
        escrow via hook data.
      </p>

      <h2
        id="supported-chains"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Supported chains
      </h2>

      <DocsTable columns={chainColumns} rows={chainRows} />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Arbitrum Sepolia is the destination chain where all escrows and
        insurance contracts are deployed. Source chains are where buyers can
        fund from.
      </p>

      <h2
        id="sdk-usage"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        SDK usage
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Cross-chain funding is a single SDK call. The SDK handles burn,
        attestation polling, coordinator submission, and settlement waiting.
      </p>

      <CodeBlock
        filename="fund-cross-chain.ts"
        language="typescript"
        lines={[
          {
            content: "const result = await escrow.fund(sdk.usdc(1000), {",
            highlighted: true,
          },
          { content: "  crossChain: {", highlighted: true },
          {
            content: "    sourceRpc: 'https://ethereum-sepolia-rpc...',",
            highlighted: true,
          },
          {
            content: "    sourcePrivateKey: process.env.SOURCE_KEY,",
            highlighted: true,
          },
          { content: "  },", highlighted: true },
          { content: "  waitForSettlement: true,", highlighted: true },
          { content: "  settlementTimeoutMs: 600_000,", highlighted: true },
          { content: "});", highlighted: true },
        ]}
        showLineNumbers={true}
      />

      <Callout variant="info" title="Settlement timeout">
        <p>
          The <code>settlementTimeoutMs</code> parameter controls how long the
          SDK waits for end-to-end settlement. The default is 600 seconds (10
          minutes). If settlement does not complete within this window, the
          promise rejects with a timeout error, but the relay may still complete
          later.
        </p>
      </Callout>

      <h2
        id="timing"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Timing
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Typical durations observed on testnet. Actual times vary with network
        congestion and attestation load.
      </p>

      <DocsTable columns={timingColumns} rows={timingRows} />

      <h2
        id="fees"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Fees
      </h2>

      <DocsTable columns={feeColumns} rows={feeRows} />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Fees are deducted from the bridged amount before settlement. For a
        10,000 USDC transfer, 50 USDC goes to the operator, 30 USDC to the
        protocol (FeeManager), and 9,920 USDC reaches the destination escrow.
      </p>

      <h2
        id="fallback"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Fallback
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        If the assigned operator misses the relay, the task escalates through
        progressively more permissive windows:
      </p>

      <DocsTable
        columns={[
          { header: "Window", key: "window", width: "160px" },
          { header: "Who can relay", key: "who" },
        ]}
        rows={[
          {
            window: "0\u201360s",
            who: "Exclusive window for the assigned operator",
          },
          {
            window: "60\u2013600s",
            who: "Any registered operator can execute",
          },
          {
            window: "After 600s",
            who: "Fully permissionless \u2014 anyone can relay",
          },
        ]}
      />

      <Callout variant="tip" title="Manual relay">
        <p>
          If a relay is stuck, operators can manually trigger it using the CLI.
        </p>
      </Callout>

      <CodeBlock
        filename="terminal"
        language="bash"
        lines={[
          { content: "# Manual relay (operator CLI)" },
          {
            content: "reineira-operator relay --tx-hash 0xBurnTxHash",
            highlighted: true,
          },
        ]}
        showLineNumbers={false}
      />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
