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
  { id: "overview", title: "Overview", level: 2 },
  { id: "running-a-relayer", title: "Running a relayer", level: 2 },
  { id: "architecture", title: "Architecture", level: 2 },
  { id: "settlement-flow", title: "Settlement flow", level: 2 },
  { id: "api-endpoints", title: "API endpoints", level: 2 },
  { id: "settlement", title: "Settlement", level: 2 },
  { id: "current-limitations", title: "Current limitations", level: 2 },
];

const { prev, next } = getPrevNext("/operate/operator-network");

const apiColumns = [
  { header: "Method", key: "method", mono: true, width: "80px" },
  { header: "Endpoint", key: "endpoint", mono: true, width: "280px" },
  { header: "Description", key: "desc" },
];
const apiRows = [
  {
    method: "POST",
    endpoint: "/bridges/cctp/transactions",
    desc: "Notify the coordinator of a CCTP burn transaction. The coordinator forwards it to a subscribed relayer.",
  },
  {
    method: "GET",
    endpoint: "/operators/:address/subscribe",
    desc: "SSE stream. Relayers maintain a persistent connection to receive burn notifications in real time.",
  },
  {
    method: "GET",
    endpoint: "/operators/stats",
    desc: "Returns the count and list of currently subscribed relayers.",
  },
];

const limitationColumns = [
  { header: "Limitation", key: "limitation", width: "200px" },
  { header: "Impact", key: "impact" },
  { header: "Planned resolution", key: "resolution" },
];
const limitationRows = [
  {
    limitation: "Single coordinator in production",
    impact:
      "Only the Foundation's canonical coordinator runs on Arbitrum Sepolia testnet, so if it goes down, burn notifications queue until it recovers. Third parties may already run independent coordinators, and settlement does not depend on any coordinator at all.",
    resolution:
      "Additional independent coordinators. Because settlement is permissionless on-chain, coordinator availability only affects relay speed, not safety.",
  },
  {
    limitation: "Round-robin only",
    impact:
      "Notifications are dispatched by simple round-robin, not weighted by uptime or performance.",
    resolution: "Smarter dispatch with relayer scoring.",
  },
  {
    limitation: "No health checks",
    impact:
      "The coordinator does not monitor relayer uptime, latency, or completion rate.",
    resolution: "Health monitoring with automatic pruning.",
  },
  {
    limitation: "In-memory state",
    impact:
      "Subscribed relayer list and round-robin index are lost on restart.",
    resolution: "Persistent state store with automatic recovery.",
  },
  {
    limitation: "SSE only",
    impact:
      "Notification dispatch uses Server-Sent Events over HTTP. No WebSocket or P2P transport.",
    resolution: "Additional transport options planned.",
  },
];

export default function CoordinatorNetwork() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Relayer Network"
        description="The off-chain relay layer for CCTP settlement. Relayers watch burns, fetch Circle attestations, and call settle() for speed; settlement remains permissionless on-chain."
        readingTime="5 min read"
      />

      {/* Overview */}
      <h2
        id="overview"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Overview
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Settlement is{" "}
        <strong className="text-docs-text-primary font-semibold">
          permissionless
        </strong>
        : anyone can call{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          CCTPV2EscrowReceiver.settle()
        </code>{" "}
        with a CCTP attestation from Circle, verified on-chain. Relayers are{" "}
        <strong className="text-docs-text-primary font-semibold">
          lightweight bots
        </strong>{" "}
        that watch CCTP burns, fetch the attestation, and call{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          settle()
        </code>{" "}
        — no registration required. Off-chain, a{" "}
        <strong className="text-docs-text-primary font-semibold">
          coordinator service
        </strong>{" "}
        notifies relayers of CCTP burns via Server-Sent Events (SSE) so they can
        fetch the attestation and settle faster. The relayer node and CLI are
        open-source.
      </p>

      <Callout
        variant="info"
        title="Relaying is permissionless and unpaid by the protocol"
      >
        <p>
          Anyone can run a relayer: there is{" "}
          <strong>
            no on-chain registration, bond, staking, protocol fee, or slashing
          </strong>
          . A relayer only affects how fast a transfer settles — if every
          relayer is down, any account can still call <code>settle()</code>{" "}
          directly. Relayers cover their own destination-chain gas; the protocol
          takes nothing. Coverage for loss events comes from{" "}
          <strong>Recourse pools</strong> (LP-funded capital plus premiums,
          capped at pool liquidity), not from relayer collateral.
        </p>
      </Callout>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The coordinator is a{" "}
        <strong className="text-docs-text-primary font-semibold">
          burn-notification inbox only
        </strong>
        : it does not custody funds, enforce eligibility, or gate settlement.
        The Foundation operates a canonical coordinator at a published URL, but
        any third party may run an independent coordinator, and relayers may
        subscribe to any of them. Because settlement is verified on-chain via
        Circle's CCTP attestation, coordinator availability affects relay speed
        only — never safety. The protocol charges no fee.
      </p>

      {/* Running a relayer */}
      <h2
        id="running-a-relayer"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Running a relayer
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Running a relayer is{" "}
        <strong className="text-docs-text-primary font-semibold">
          permissionless
        </strong>{" "}
        — there is no Foundation invitation, no allowlist (a pre-approved set of
        addresses that would gate who may join), and no on-chain registration. A
        relayer simply does the following:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>
          Watches for{" "}
          <strong className="text-docs-text-primary font-semibold">
            CCTP burn events
          </strong>{" "}
          on source chains — either directly or via a coordinator's SSE feed
        </li>
        <li>
          Polls Circle's attestation service (Iris) for the signed attestation
          backing the burn
        </li>
        <li>
          Calls{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            CCTPV2EscrowReceiver.settle(message, attestation)
          </code>{" "}
          on the destination chain to finalize the transfer
        </li>
      </ul>

      <Callout
        variant="info"
        title="Any coordinator list is a signal, not a gate"
      >
        <p>
          The Foundation may publish an{" "}
          <strong>off-chain list of relayers it has worked with</strong> as a
          curation signal — it is <strong>not</strong> a permission gate.
          Relayers that are not on any such list can still subscribe and settle
          permissionlessly, against the canonical coordinator or their own. No
          bond, stake, or sanctions screening is enforced on-chain; any such
          screening is each relayer's own choice.
        </p>
      </Callout>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Relayers earn{" "}
        <strong className="text-docs-text-primary font-semibold">
          no protocol fee
        </strong>{" "}
        — there is no relayer subsidy programme and no protocol token. Whoever
        submits the settlement transaction pays the destination-chain gas. More
        cross-chain settlement volume simply means more relayers can run
        economically on gas-cost recovery alone.
      </p>

      {/* Architecture */}
      <h2
        id="architecture"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Architecture
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The Foundation operates the canonical coordinator at a published URL (
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          dswtxw6k9mker.cloudfront.net
        </code>
        ). Coordinators are not privileged: any third party may run an
        independent coordinator, and settlement itself is permissionless via
        on-chain CCTP attestation verification. On Arbitrum Sepolia testnet
        today the canonical instance is the only one in production, which keeps
        debugging and iteration simple.
      </p>

      <DocsTable
        columns={[
          { header: "Property", key: "prop", width: "200px" },
          { header: "Detail", key: "detail" },
        ]}
        rows={[
          { prop: "Instances", detail: "Single coordinator instance" },
          {
            prop: "Transport",
            detail: "Relayers connect via SSE (Server-Sent Events)",
          },
          {
            prop: "Dispatch",
            detail: "Round-robin notification across subscribed relayers",
          },
          {
            prop: "State",
            detail:
              "In-memory — relayer subscriptions and round-robin index reset on restart",
          },
        ]}
      />

      {/* Settlement Flow */}
      <h2
        id="settlement-flow"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Settlement flow
      </h2>

      <ArchitectureDiagram
        title="CCTP SETTLEMENT FLOW"
        steps={[
          { label: "SDK submits burn tx", sublabel: "POST to coordinator" },
          {
            label: "Coordinator notifies",
            sublabel: "Round-robin SSE to next relayer",
          },
          {
            label: "Relayer fetches attestation",
            sublabel: "Polls Circle Iris",
          },
          {
            label: "Anyone calls settle()",
            sublabel: "Permissionless on-chain settlement",
          },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        When the SDK performs a cross-chain fund operation, it notifies the
        coordinator of the burn transaction hash via{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          POST /bridges/cctp/transactions
        </code>
        . The coordinator forwards the notification to the next relayer in
        round-robin order via SSE. That relayer polls Circle's Iris service for
        the signed attestation and calls{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          CCTPV2EscrowReceiver.settle(message, attestation)
        </code>
        , which verifies the attestation on-chain and releases the funds.
        Settlement is permissionless: any account can call{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          settle()
        </code>{" "}
        with a valid attestation; the relayer is one optional transport layer.
      </p>

      <Callout variant="info" title="Settlement security is on-chain">
        <p>
          The coordinator only notifies relayers of burns. The actual security
          comes from{" "}
          <strong>Circle's CCTP attestation verified on-chain</strong> inside{" "}
          <code>CCTPV2EscrowReceiver.settle()</code> — not from any
          registration, stake, or task framework. The protocol charges no fee,
          and relayers have no protocol-enforced economics; the relayer being
          down never blocks settlement.
        </p>
      </Callout>

      {/* API Endpoints */}
      <h2
        id="api-endpoints"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        API endpoints
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Base URL:{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          https://dswtxw6k9mker.cloudfront.net
        </code>
      </p>

      <DocsTable columns={apiColumns} rows={apiRows} />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Example — subscribing to burn notifications:
      </p>

      <CodeBlock
        filename="terminal"
        language="bash"
        lines={[
          {
            content:
              "# Subscribe to burn notifications for your relayer address",
          },
          { content: "curl -N \\", highlighted: true },
          {
            content:
              "  https://dswtxw6k9mker.cloudfront.net/operators/0xYourAddress.../subscribe",
            highlighted: true,
          },
        ]}
        showLineNumbers={false}
      />

      {/* Settlement */}
      <h2
        id="settlement"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Settlement
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The coordinator uses{" "}
        <strong className="text-docs-text-primary font-semibold">
          simple round-robin
        </strong>{" "}
        to distribute burn notifications across subscribed relayers. Each new
        burn goes to the next relayer in the list. This only reduces duplicate
        gas spend by avoiding several relayers racing the same settlement — it
        is not a stake-weighting, scoring, or assignment mechanism, and it does
        not gate who may settle.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Settlement is{" "}
        <strong className="text-docs-text-primary font-semibold">
          permissionless from the moment a valid CCTP attestation from Circle is
          available on-chain
        </strong>
        . Any address can call{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          CCTPV2EscrowReceiver.settle(message, attestation)
        </code>{" "}
        with the attestation — there is no exclusive window, no registered
        operator set, and no claim mechanism. A relayer that was notified first
        will usually settle first simply because it sees the burn first, but
        nothing prevents any other account from settling.
      </p>

      <Callout
        variant="info"
        title="No staking or slashing in the current architecture"
      >
        <p>
          There is no operator staking, bonding, or slashing. Invalid
          settlements are rejected at the contract level by attestation
          verification, not through governance penalties. Coverage for loss
          events comes from <strong>Recourse pools</strong> (LP-funded capital
          plus premiums, capped at pool liquidity), not from relayer collateral
          or slashed bonds.
        </p>
      </Callout>

      {/* Current Limitations */}
      <h2
        id="current-limitations"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Current limitations
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        These limitations apply to the current testnet coordinator and will be
        addressed as the network matures. The Arbitrum Sepolia testnet
        deployment runs in{" "}
        <strong className="text-docs-text-primary font-semibold">
          public mode
        </strong>{" "}
        and is{" "}
        <strong className="text-docs-text-primary font-semibold">
          unaudited
        </strong>
        .
      </p>

      <DocsTable columns={limitationColumns} rows={limitationRows} />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
