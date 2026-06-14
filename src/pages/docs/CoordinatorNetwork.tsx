import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import CodeBlock from "@/components/docs/CodeBlock";
import ArchitectureDiagram from "@/components/docs/ArchitectureDiagram";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import DocsBadge from "@/components/docs/DocsBadge";
import StatusBadge from "@/components/docs/StatusBadge";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "registration", title: "Operator registration", level: 2 },
  { id: "architecture", title: "Architecture", level: 2 },
  { id: "task-flow", title: "Task flow", level: 2 },
  { id: "api-endpoints", title: "API endpoints", level: 2 },
  { id: "operator-assignment", title: "Operator assignment", level: 2 },
  { id: "slashing", title: "Slashing", level: 2 },
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
    desc: "Submit a CCTP burn transaction for relay. The coordinator distributes it to a subscribed operator.",
  },
  {
    method: "GET",
    endpoint: "/operators/:address/subscribe",
    desc: "SSE stream. Operators maintain a persistent connection to receive relay tasks in real time.",
  },
  {
    method: "GET",
    endpoint: "/operators/stats",
    desc: "Returns the count and list of currently subscribed operators.",
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
      "Only the Foundation's canonical coordinator runs in chaos-net, so if it goes down, relay tasks queue until it recovers. Third parties may already run independent coordinators against the same on-chain contracts.",
    resolution:
      "On-chain coordinator registration (CoordinatorRegistry) and cross-graph slashing land on the v1.0 track (Spec'd).",
  },
  {
    limitation: "Coordinator does not pre-verify stake",
    impact:
      "The off-chain coordinator does not pre-check operator bond before accepting an SSE subscription. Registration and eligibility live on-chain in the OperatorRegistry; the bond-and-slashing economics that would back them are Spec'd, not yet wired.",
    resolution:
      "Optional coordinator-side stake check, once the bond economics are live, to reduce wasted dispatch to unbonded subscribers.",
  },
  {
    limitation: "Round-robin only",
    impact:
      "Tasks are assigned by simple round-robin, not weighted by stake, uptime, or performance.",
    resolution: "Stake-weighted assignment with operator scoring.",
  },
  {
    limitation: "No health checks",
    impact:
      "The coordinator does not monitor operator uptime, latency, or completion rate.",
    resolution: "Health monitoring with automatic deregistration.",
  },
  {
    limitation: "In-memory state",
    impact:
      "Subscribed operator list and round-robin index are lost on restart.",
    resolution: "Persistent state store with automatic recovery.",
  },
  {
    limitation: "SSE only",
    impact:
      "Task dispatch uses Server-Sent Events over HTTP. No WebSocket or P2P transport.",
    resolution: "Additional transport options planned.",
  },
];

export default function CoordinatorNetwork() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Operator Network"
        description="The task-dispatch and coordination layer of ReineiraOS. Operators register on-chain and relay CCTP tasks; off-chain coordinators dispatch those tasks. Registration is permissionless from chaos-net Day 1. Operators earn relay/task fees and the protocol takes nothing. The economic-security layer (cUSDC bond, relay/task fees, slashing) is Spec'd — designed, not yet production-usable on chaos-net."
        readingTime="6 min read"
      />

      {/* Overview */}
      <h2
        id="overview"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Overview
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The Operator Network has two layers. On-chain, operators register in the
        OperatorRegistry, then claim and execute relay tasks via the
        TaskExecutor. Off-chain, a{" "}
        <strong className="text-docs-text-primary font-semibold">
          coordinator service
        </strong>{" "}
        monitors source chains, dispatches tasks, and pushes them to subscribed{" "}
        <strong className="text-docs-text-primary font-semibold">
          operator nodes
        </strong>{" "}
        via Server-Sent Events (SSE). The operator node and CLI are open-source.
        Operators can run today and relay CCTP transfers; the{" "}
        <strong className="text-docs-text-primary font-semibold">
          economic-security layer
        </strong>{" "}
        that incentivizes and disciplines them — the cUSDC stake/bond, the
        relay/task fees operators earn (the protocol takes nothing), and
        slashing — is <StatusBadge status="spec" className="align-middle" />.
      </p>

      <Callout
        variant="warning"
        title="Operator economics are Spec'd, not production-usable"
      >
        <p>
          The relay machinery works on chaos-net today — the coordinator
          dispatches, and operators can claim and execute CCTP tasks. But the
          incentive layer is{" "}
          <strong>designed, not yet production-usable on chaos-net</strong>: the
          cUSDC bond, the relay/task fees operators earn, and slashing are
          specified but not wired end-to-end. The protocol takes no cut of those
          fees, and there is no operator subsidy and no protocol token.{" "}
          <code>OperatorSlashingManager</code> is implemented but undeployed and
          unwired (only an owner-emergency path can slash today). Do not treat
          the operator network as economically secured.
        </p>
      </Callout>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The coordinator is a{" "}
        <strong className="text-docs-text-primary font-semibold">
          dispatch layer only
        </strong>
        : it does not custody funds or enforce eligibility. The Foundation
        operates a canonical coordinator at a published URL, but any third party
        may run an independent coordinator against the same on-chain
        OperatorRegistry and TaskExecutor contracts. Security enforcement that
        is live — registration, exclusive windows, permissionless fallback —
        happens on-chain; the protocol itself charges no fee.
      </p>

      {/* Operator registration */}
      <h2
        id="registration"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Operator registration
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Registration is{" "}
        <strong className="text-docs-text-primary font-semibold">
          permissionless from chaos-net Day 1
        </strong>{" "}
        at the contract layer — there is no Foundation invitation and no
        allowlist (a pre-approved set of addresses that would gate who may
        join). Any address that meets the on-chain criteria may register and
        begin claiming tasks:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>
          Posts the required{" "}
          <strong className="text-docs-text-primary font-semibold">
            operator bond
          </strong>{" "}
          to the OperatorRegistry. The bond is denominated in{" "}
          <strong className="text-docs-text-primary font-semibold">
            cUSDC
          </strong>{" "}
          (the immutable confidential USDC wrapper), but the bond-and-slashing
          economics are part of the Spec'd operator layer — not yet wired live
          on chaos-net{" "}
          <StatusBadge status="spec" className="ml-1 align-middle" />
        </li>
        <li>
          Passes sanctions screening via the optional{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            ISanctionsOracle
          </code>{" "}
          configured on the OperatorRegistry
        </li>
        <li>Has not been previously slashed</li>
      </ul>

      <Callout
        variant="info"
        title="Any coordinator list is a signal, not a gate"
      >
        <p>
          The Foundation may publish an{" "}
          <strong>off-chain list of operators it has worked with</strong> as a
          curation signal — it is <strong>not</strong> a permission gate.
          Operators that are not on any such list can still register, claim, and
          execute tasks permissionlessly, against the canonical coordinator or
          their own.
        </p>
      </Callout>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The operator economy is sustained entirely by the relay/task fees
        operators earn — there is{" "}
        <strong className="text-docs-text-primary font-semibold">
          no operator subsidy programme and no protocol token
        </strong>
        . The protocol takes no cut of operator fees. Those fee mechanics are
        part of the Spec'd operator layer, not yet wired live on chaos-net.{" "}
        <StatusBadge status="spec" className="ml-1 align-middle" />
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
        independent coordinator against the same on-chain OperatorRegistry and
        TaskExecutor. During chaos-net the canonical instance is the only one in
        production, which keeps debugging and iteration simple.
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
            detail: "Operators connect via SSE (Server-Sent Events)",
          },
          {
            prop: "Assignment",
            detail: "Round-robin distribution across subscribed operators",
          },
          {
            prop: "State",
            detail:
              "In-memory — operator subscriptions and round-robin index reset on restart",
          },
        ]}
      />

      {/* Task Flow */}
      <h2
        id="task-flow"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Task flow
      </h2>

      <ArchitectureDiagram
        title="RELAY TASK FLOW"
        steps={[
          { label: "SDK submits burn tx", sublabel: "POST to coordinator" },
          {
            label: "Coordinator distributes",
            sublabel: "Round-robin to next operator",
          },
          {
            label: "Operator receives via SSE",
            sublabel: "Relay event pushed",
          },
          {
            label: "Operator executes on-chain",
            sublabel: "Claims and executes task",
          },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        When the SDK performs a cross-chain fund operation, it submits the burn
        transaction hash to the coordinator via{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          POST /bridges/cctp/transactions
        </code>
        . The coordinator selects the next operator in round-robin order and
        pushes the relay event via SSE. The operator then claims and executes
        the task on-chain via the TaskExecutor contract, which enforces the
        3-tier fallback (exclusive → open → permissionless).
      </p>

      <Callout variant="info" title="On-chain enforcement">
        <p>
          The coordinator only distributes tasks. Live security enforcement —
          the exclusive window and the permissionless fallback — happens
          on-chain via the OperatorRegistry and TaskExecutor contracts. The
          protocol charges no fee; any operator relay fee is part of the Spec'd
          operator economics, and the slashing that would back staking
          requirements is Spec'd (see below).
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
        Example — subscribing to relay events:
      </p>

      <CodeBlock
        filename="terminal"
        language="bash"
        lines={[
          { content: "# Subscribe to relay events for your operator address" },
          { content: "curl -N \\", highlighted: true },
          {
            content:
              "  https://dswtxw6k9mker.cloudfront.net/operators/0xYourAddress.../subscribe",
            highlighted: true,
          },
        ]}
        showLineNumbers={false}
      />

      {/* Operator Assignment */}
      <h2
        id="operator-assignment"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Operator assignment
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The coordinator uses{" "}
        <strong className="text-docs-text-primary font-semibold">
          simple round-robin
        </strong>{" "}
        to distribute tasks across subscribed operators. Each new transaction
        goes to the next operator in the list. There is no stake-weighting,
        scoring, or prioritization at the coordinator level.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        On-chain, the OperatorRegistry enforces the 3-tier execution window:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            0–60 seconds:
          </strong>{" "}
          Only the claiming operator can execute (exclusive window)
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            60–600 seconds:
          </strong>{" "}
          Any active, registered operator can execute (the stake-and-slashing
          gate behind "active" is part of the Spec'd operator economics)
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            600+ seconds:
          </strong>{" "}
          Fully permissionless — anyone can execute, no stake required
        </li>
      </ul>

      {/* Slashing */}
      <h2
        id="slashing"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Slashing
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Stake-weighted quorum slashing is{" "}
        <StatusBadge status="spec" className="align-middle" />. The{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          OperatorSlashingManager
        </code>{" "}
        is{" "}
        <strong className="text-docs-text-primary font-semibold">
          implemented
        </strong>{" "}
        — it would slash a misbehaving operator's bond via a single
        stake-weighted quorum across the active operator set — but it is{" "}
        <strong className="text-docs-text-primary font-semibold">
          not deployed and not wired
        </strong>
        :{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          setSlashingManager
        </code>{" "}
        is never called, so the registry does not delegate to it. Today the only
        active path is{" "}
        <strong className="text-docs-text-primary font-semibold">
          owner-direct emergency slashing
        </strong>{" "}
        — the contract owner can slash, but the quorum mechanism is inert. Do
        not rely on quorum slashing as a live discipline.
      </p>

      <Callout
        variant="warning"
        title="Slashing is designed, not yet production-usable on chaos-net"
      >
        <p>
          Because the slashing manager is undeployed and unwired, an operator's
          bond is not actually at risk through the quorum mechanism today. The
          economic security that slashing is meant to provide does not yet hold
          on chaos-net.
        </p>
      </Callout>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Two related mechanisms are also specified for the v1.0 track but are{" "}
        <strong className="text-docs-text-primary font-semibold">
          not yet shipped
        </strong>
        :
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>
          On-chain coordinator registration and subscription via a{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            CoordinatorRegistry
          </code>{" "}
          <DocsBadge variant="amber" className="ml-1">
            Spec'd
          </DocsBadge>
        </li>
        <li>
          Cross-graph slashing — slashing votes spanning{" "}
          <strong className="text-docs-text-primary font-semibold">
            three or more independent coordinator–operator graphs
          </strong>{" "}
          <DocsBadge variant="amber" className="ml-1">
            Spec'd
          </DocsBadge>
        </li>
      </ul>

      {/* Current Limitations */}
      <h2
        id="current-limitations"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Current limitations
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        These limitations apply to the chaos-net coordinator and will be
        addressed as the network matures. chaos-net runs in{" "}
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
