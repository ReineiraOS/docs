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
  { id: "architecture", title: "Architecture", level: 2 },
  { id: "task-flow", title: "Task flow", level: 2 },
  { id: "api-endpoints", title: "API endpoints", level: 2 },
  { id: "operator-assignment", title: "Operator assignment", level: 2 },
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
    limitation: "Single coordinator",
    impact:
      "Single point of failure for task dispatch. If the coordinator goes down, relay tasks queue until it recovers.",
    resolution: "Redundant coordinator instances with failover.",
  },
  {
    limitation: "No stake verification",
    impact:
      "The coordinator does not verify operator stake on-chain. Any address can subscribe.",
    resolution: "On-chain stake check before accepting subscriptions.",
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
        description="The task-dispatch and coordination layer of ReineiraOS. The coordinator distributes CCTP relay tasks to staked operators via round-robin assignment."
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
        The coordinator is a lightweight service that distributes cross-chain
        relay tasks to operators. It receives CCTP burn transaction submissions
        via HTTP and pushes them to subscribed operators via Server-Sent Events
        (SSE).
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The coordinator does{" "}
        <strong className="text-docs-text-primary font-semibold">not</strong>{" "}
        watch chains for events, verify on-chain stake, or score operators. It
        is a message distribution layer — the actual relay execution and staking
        enforcement happens on-chain via the OperatorRegistry and TaskExecutor
        contracts.
      </p>

      {/* Architecture */}
      <h2
        id="architecture"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Architecture
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The coordinator is a single hosted service operated by the ReineiraOS
        team at{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          dswtxw6k9mker.cloudfront.net
        </code>
        . This is intentionally centralized during testnet to simplify debugging
        and iteration.
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
            sublabel: "Claims + executes task",
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
          The coordinator only distributes tasks. All security enforcement —
          staking requirements, exclusive windows, permissionless fallback, fee
          collection — happens on-chain via the OperatorRegistry and
          TaskExecutor contracts.
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
          {
            content:
              "curl -N https://dswtxw6k9mker.cloudfront.net/operators/0xYourAddress.../subscribe",
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
          Any active (staked, non-slashed) operator can execute
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            600+ seconds:
          </strong>{" "}
          Fully permissionless — anyone can execute, no stake required
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
        These limitations apply to the testnet coordinator and will be addressed
        as the network matures.
      </p>

      <DocsTable columns={limitationColumns} rows={limitationRows} />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
