import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import CodeBlock from "@/components/docs/CodeBlock";
import ArchitectureDiagram from "@/components/docs/ArchitectureDiagram";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import StatusBadge from "@/components/docs/StatusBadge";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "transport-rails", title: "Transport rails", level: 2 },
  { id: "flow", title: "Flow", level: 2 },
  { id: "supported-chains", title: "Supported chains", level: 2 },
  { id: "sdk-usage", title: "SDK usage", level: 2 },
  { id: "timing", title: "Timing", level: 2 },
  { id: "fees", title: "Fees", level: 2 },
  { id: "fallback", title: "Fallback", level: 2 },
];

const { prev, next } = getPrevNext("/build/cross-chain");

const chainColumns = [
  { header: "Chain", key: "chain" },
  { header: "CCTP Domain", key: "domain", mono: true, width: "140px" },
  { header: "Status", key: "status", width: "100px" },
];
const chainRows = [
  {
    chain: "Arbitrum Sepolia (destination)",
    domain: "3",
    status: <StatusBadge status="live" />,
  },
  { chain: "Ethereum Sepolia", domain: "0", status: <StatusBadge status="live" /> },
  { chain: "Base Sepolia", domain: "6", status: <StatusBadge status="live" /> },
];

const timingColumns = [
  { header: "Step", key: "step" },
  { header: "Typical duration", key: "duration", width: "200px" },
];
const timingRows = [
  { step: "USDC burn on source chain", duration: "~15 seconds" },
  { step: "Circle Iris attestation", duration: "60\u2013120 seconds" },
  {
    step: "Operator relay and on-chain execution",
    duration: "10\u201360 seconds",
  },
  { step: "Total end-to-end", duration: "~90\u2013200 seconds" },
];

const feeColumns = [
  { header: "Fee", key: "fee" },
  { header: "Rate", key: "rate", width: "160px" },
  { header: "Recipient", key: "recipient" },
];
const feeRows = [
  {
    fee: "Operator relay fee",
    rate: <StatusBadge status="spec" />,
    recipient: "Relay operator who executed the task",
  },
  {
    fee: "Protocol take",
    rate: "None",
    recipient: "The protocol charges nothing",
  },
];

export default function CrossChain() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Cross-Chain Settlement"
        description="ReineiraOS bridges native USDC through its only live rail, Circle CCTP V2, into one Escrow sink that future rails can reuse."
        readingTime="6 min read"
      />

      {/* Transport rails */}
      <h2
        id="transport-rails"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Transport rails
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Today there is exactly <strong>one live rail</strong>:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Circle CCTP V2
          </strong>{" "}
          for USDC — native burn-mint with attestation via the Circle Iris
          network. No wrapped tokens.{" "}
          <StatusBadge status="live" />
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            LayerZero OFT / USDT0
          </strong>{" "}
          for USDT — on the roadmap, not yet built. Adds a second native
          stablecoin transport (USDT) alongside the USDC rail.{" "}
          <StatusBadge status="spec" />
        </li>
      </ul>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The bridge is <strong>CCTP-only</strong> today. The transport layer is
        designed so additional rails (such as the spec'd LayerZero OFT / USDT0
        path) register their own handler and funnel into the same{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          ConfidentialEscrow.fundFrom
        </code>{" "}
        sink, without modifying the escrow engine.
      </p>

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
        The diagram above traces the USDC / CCTP V2 rail — the only rail live
        today. When the spec'd LayerZero OFT / USDT0 path ships, it would follow
        an analogous burn-attest-execute pattern and terminate at the same{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          ConfidentialEscrow.fundFrom
        </code>{" "}
        sink.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The SDK calls{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          depositForBurnWithHook()
        </code>{" "}
        on{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          TokenMessenger
        </code>{" "}
        on the source chain. Circle Iris signs the burn message, the coordinator
        dispatches a relay task, and an operator submits the message and
        attestation on-chain via{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          TaskExecutor &rarr; MessageTransmitter.receiveMessage()
        </code>
        . USDC is then minted on the destination chain and routed to the escrow
        via hook data.
      </p>

      <Callout variant="info" title="TokenMessenger vs MessageTransmitter">
        <p>
          These are two distinct CCTP V2 contracts.{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            TokenMessenger
          </code>{" "}
          does the <strong>burn</strong> on the source chain (
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            depositForBurn
          </code>
          );{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            MessageTransmitter
          </code>{" "}
          does the <strong>mint</strong> on the destination chain (
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            receiveMessage
          </code>
          ).
        </p>
      </Callout>

      <h2
        id="supported-chains"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Supported chains
      </h2>

      <DocsTable columns={chainColumns} rows={chainRows} />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Arbitrum Sepolia is the destination chain where all escrows and recourse
        contracts are deployed; source chains are where buyers fund from. The
        CCTP Domain column applies to the live USDC rail. The spec'd USDT rail
        would route over LayerZero OFT / USDT0 instead of CCTP domains.
      </p>

      <Callout variant="warning" title="chaos-net is public and unaudited">
        <p>
          chaos-net runs in <strong>public mode</strong> and is{" "}
          <strong>unaudited</strong>. Do not move value you are not prepared to
          lose.
        </p>
      </Callout>

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
        The <strong>protocol charges nothing</strong> on a cross-chain transfer.
        The only fee is the operator relay fee, which compensates the operator
        that fronts the relay and submits it on-chain — its economics are
        spec'd, not live, so there is no published rate to quote yet. When set,
        any such fee is deducted from the bridged amount before settlement and
        the remainder reaches the destination escrow.
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
