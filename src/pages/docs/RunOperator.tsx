import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import RiskCallout from "@/components/docs/RiskCallout";
import CodeBlock from "@/components/docs/CodeBlock";
import ArchitectureDiagram from "@/components/docs/ArchitectureDiagram";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import Steps, { Step } from "@/components/docs/Steps";
import StatusBadge from "@/components/docs/StatusBadge";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "requirements", title: "Requirements", level: 2 },
  { id: "setup", title: "Setup", level: 2 },
  { id: "staking", title: "Staking", level: 2 },
  { id: "task-execution-flow", title: "Task execution flow", level: 2 },
  { id: "economics", title: "Economics", level: 2 },
  { id: "monitoring", title: "Monitoring", level: 2 },
  { id: "unbonding", title: "Unbonding", level: 2 },
];

const { prev, next } = getPrevNext("/operate/run-operator");

const requirementColumns = [
  { header: "Requirement", key: "req", width: "160px" },
  { header: "Details", key: "details" },
];
const requirementRows = [
  {
    req: "Bond asset",
    details:
      "cUSDC (the immutable confidential USDC wrapper) is the specified operator bond, bound in OperatorRegistry at deployment. The bond/slashing layer is Spec'd — not yet wired live on chaos-net, so do not treat a posted bond as slashable collateral yet.",
  },
  {
    req: "ETH",
    details: "Gas funds on Arbitrum Sepolia for relay transactions",
  },
  {
    req: "RPC endpoints",
    details: "Arbitrum Sepolia and each source chain you intend to relay for",
  },
  {
    req: "Private key",
    details: "Dedicated operator wallet \u2014 do not reuse personal wallets",
  },
  { req: "Node.js", details: "v20 LTS or higher" },
  {
    req: "System",
    details: "Linux/macOS, at least 2 CPU cores, 4 GB RAM, stable internet",
  },
];

const economicsColumns = [
  { header: "Metric", key: "metric", width: "240px" },
  { header: "Value", key: "value" },
];
const economicsRows = [
  {
    metric: "Protocol fee",
    value: "None \u2014 the protocol charges nothing",
  },
  {
    metric: "Operator relay/task fee",
    value:
      "Operator's own charge, kept by the operator (no protocol cut). Spec'd \u2014 no live rate; not collected on chaos-net today",
  },
  {
    metric: "Operator subsidy / token",
    value: "None \u2014 no subsidy programme and no protocol token",
  },
  {
    metric: "Bond asset",
    value:
      "cUSDC (bound in OperatorRegistry at deployment). Spec'd \u2014 not yet wired live on chaos-net",
  },
  {
    metric: "Unbonding period",
    value: "7 days (hardcoded in OperatorRegistry)",
  },
];

export default function RunOperator() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Run an Operator"
        description="Operators are relay nodes that execute cross-chain CCTP v2 settlement tasks, relaying burn-and-mint messages between chains. You can build, run, and relay today. Operators earn relay/task fees and the protocol takes nothing. The economics that reward and discipline operators — the cUSDC stake/bond, relay/task fees, and slashing — are Spec'd: designed, not yet production-usable on chaos-net."
        readingTime="8 min read"
      />

      <RiskCallout />

      {/* Overview */}
      <h2
        id="overview"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Overview
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        You register on-chain, connect to the coordinator via SSE, and execute
        cross-chain CCTP relay tasks. The coordinator distributes tasks via
        round-robin. On-chain contracts (OperatorRegistry, TaskExecutor) enforce
        the exclusive window and the permissionless fallback. Registration is
        permissionless from chaos-net day 1: any address that meets the on-chain
        criteria, is sanctions-clean, and has not been previously slashed can
        register without Foundation invitation. The CLI, service, and relay all
        work today; the cUSDC bond, the relay/task fees operators earn (the
        protocol takes nothing), and slashing that make up the operator
        economics are{" "}
        <StatusBadge status="spec" className="align-middle" />.
      </p>

      <Callout
        variant="warning"
        title="Operator economics are Spec'd, not production-usable"
      >
        <p>
          You can build from source, register, run the service, and relay CCTP
          transfers on chaos-net today. But the incentive layer is{" "}
          <strong>designed, not yet production-usable on chaos-net</strong>:
          the cUSDC stake/bond, the relay/task fees operators earn, and slashing
          are specified but not wired end-to-end. The protocol takes no cut, and
          there is no operator subsidy and no protocol token. Run an operator to
          test the relay path, not to earn — and do not treat a posted bond as
          economically at risk yet.
        </p>
      </Callout>

      <DocsTable
        columns={[
          { header: "Property", key: "prop", width: "200px" },
          { header: "Value", key: "value" },
        ]}
        rows={[
          {
            prop: "Relay fee",
            value:
              "Spec'd operator economics — the protocol charges no fee; no live operator-fee rate",
          },
          {
            prop: "Exclusive window",
            value: "60 seconds for the assigned operator (configurable)",
          },
          {
            prop: "Permissionless fallback",
            value: "After 600 seconds, anyone can relay",
          },
          { prop: "Unbonding period", value: "7 days" },
          { prop: "Testnet", value: "Arbitrum Sepolia" },
        ]}
      />

      {/* Requirements */}
      <h2
        id="requirements"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Requirements
      </h2>

      <DocsTable columns={requirementColumns} rows={requirementRows} />

      <Callout variant="warning" title="Dedicated wallet">
        <p>
          Use a dedicated operator wallet. Do not reuse personal wallets or
          wallets used for other protocols. The private key is used to sign
          relay transactions and authenticate with the coordinator.
        </p>
      </Callout>

      {/* Setup */}
      <h2
        id="setup"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Setup
      </h2>

      <Steps>
        <Step title="Build the operator CLI from source">
          <p className="text-docs-text-secondary leading-relaxed mb-3">
            The operator CLI (
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              @reineira-os/operator-cli
            </code>
            , bin{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              reineira-operator
            </code>
            ) is{" "}
            <strong className="text-docs-text-primary font-semibold">
              not published to npm
            </strong>
            . Build it from the monorepo workspace:
          </p>
          <CodeBlock
            filename="terminal"
            language="bash"
            lines={[
              { content: "# From the repo root, install workspace deps" },
              { content: "npm install" },
              { content: "" },
              { content: "# Build the CLI workspace" },
              {
                content: "npm run build -w @reineira-os/operator-cli",
                highlighted: true,
              },
              { content: "" },
              { content: "# Verify the bin resolves" },
              { content: "npx reineira-operator --version" },
            ]}
            showLineNumbers={false}
          />
        </Step>
        <Step title="Configure environment">
          <p className="text-docs-text-secondary leading-relaxed mb-3">
            Create a{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              .env
            </code>{" "}
            file or export the variables directly:
          </p>
          <CodeBlock
            filename=".env"
            language="bash"
            lines={[
              { content: "export PRIVATE_KEY=0x..." },
              { content: "export RPC_URL=https://arbitrum-sepolia-rpc..." },
              {
                content:
                  "export SOURCE_RPC_ETH_SEPOLIA=https://ethereum-sepolia-rpc...",
              },
              {
                content:
                  "export SOURCE_RPC_BASE_SEPOLIA=https://base-sepolia-rpc...",
              },
              { content: "" },
              {
                content:
                  "# Coordinator to connect to. Defaults to http://localhost:3001 if unset —",
              },
              {
                content:
                  "# set it explicitly to point at a real coordinator.",
              },
              {
                content: "export COORDINATOR_URL=https://your-coordinator...",
                highlighted: true,
              },
            ]}
            showLineNumbers={false}
          />
        </Step>
        <Step title="Register as an operator">
          <p className="text-docs-text-secondary leading-relaxed mb-3">
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              register
            </code>{" "}
            requires a{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              --stake
            </code>{" "}
            argument and errors without it (the stake amount is part of the
            Spec'd operator economics — the figure below is illustrative):
          </p>
          <CodeBlock
            filename="terminal"
            language="bash"
            lines={[
              {
                content: "reineira-operator register --stake 5000",
                highlighted: true,
              },
              { content: "" },
              { content: "# Verify your registration" },
              { content: "reineira-operator status" },
            ]}
            showLineNumbers={false}
          />
        </Step>
        <Step title="Start the operator service">
          <p className="text-docs-text-secondary leading-relaxed mb-3">
            The operator service (
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              @reineira-os/operator
            </code>
            ) is a NestJS app with{" "}
            <strong className="text-docs-text-primary font-semibold">
              no bin
            </strong>{" "}
            — there is nothing to{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              npx
            </code>
            . Build it, then start it from the workspace:
          </p>
          <CodeBlock
            filename="terminal"
            language="bash"
            lines={[
              { content: "# Build the service workspace first" },
              { content: "npm run build -w @reineira-os/operator" },
              { content: "" },
              {
                content:
                  "# Start the service (connects to COORDINATOR_URL via SSE)",
              },
              {
                content: "npm run start -w @reineira-os/operator",
                highlighted: true,
              },
            ]}
            showLineNumbers={false}
          />
          <p className="text-docs-text-secondary leading-relaxed mt-3">
            The service connects to the coordinator at{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              COORDINATOR_URL
            </code>{" "}
            (it does not auto-connect to any hosted URL; the default is{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              http://localhost:3001
            </code>
            ) via SSE and then receives and executes relay tasks.
          </p>
        </Step>
      </Steps>

      {/* Staking */}
      <h2
        id="staking"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Staking
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Staking is part of the Spec'd operator economics{" "}
        <StatusBadge status="spec" className="align-middle" />. The bond is
        denominated in{" "}
        <strong className="text-docs-text-primary font-semibold">cUSDC</strong>{" "}
        (bound in OperatorRegistry at deployment) and the 7-day unbonding period
        is hardcoded — but the bond-and-slashing layer is not wired end-to-end on
        chaos-net, so the bond does not yet act as live, slashable collateral.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        An optional ISanctionsOracle can be wired into the OperatorRegistry;
        when configured, it blocks registration of listed addresses. Beyond that
        there is no admission gate. The operator economy is sustained by the
        relay/task fees operators earn — the protocol takes nothing, and there is{" "}
        <strong className="text-docs-text-primary font-semibold">
          no operator subsidy programme and no protocol token
        </strong>
        . Those fee mechanics are Spec'd, not yet wired live on chaos-net{" "}
        <StatusBadge status="spec" className="align-middle" />.
      </p>

      <CodeBlock
        filename="terminal"
        language="bash"
        lines={[
          { content: "# Check current stake and status" },
          { content: "reineira-operator stake info" },
          { content: "" },
          { content: "# Add to your stake" },
          { content: "reineira-operator stake add --amount 1000" },
          { content: "" },
          { content: "# Begin unbonding (starts the 7-day cooldown)" },
          { content: "reineira-operator unbond" },
          { content: "" },
          { content: "# Withdraw after unbonding completes" },
          { content: "reineira-operator withdraw" },
        ]}
        showLineNumbers={false}
      />

      {/* Task Execution Flow */}
      <h2
        id="task-execution-flow"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Task execution flow
      </h2>

      <ArchitectureDiagram
        title="OPERATOR TASK EXECUTION"
        steps={[
          { label: "SDK submits burn tx", sublabel: "POST to coordinator" },
          { label: "Coordinator distributes", sublabel: "Round-robin via SSE" },
          {
            label: "Operator claims on-chain",
            sublabel: "60s exclusive window",
          },
          { label: "Fetch attestation", sublabel: "Poll Circle Iris API" },
          {
            label: "Execute relay",
            sublabel: "TaskExecutor on destination chain",
          },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The SDK submits a burn transaction hash to the coordinator. The
        coordinator distributes it to the next operator via round-robin SSE. The
        operator claims the task on-chain (OperatorRegistry.claimTask), polls
        Circle Iris for the signed attestation, then submits the relay via{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          TaskExecutor.executeTask()
        </code>
        . CCTP mints USDC on Arbitrum Sepolia and funds are routed to the escrow
        via hook data. The protocol itself takes no fee; any operator relay fee
        is part of the Spec'd operator economics and is not collected on
        chaos-net today.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        If the assigned operator misses the 60-second exclusive window, any
        active operator can execute (60–600s). After 600 seconds, the task
        becomes fully permissionless — anyone can relay without staking.
      </p>

      {/* Economics */}
      <h2
        id="economics"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Economics
      </h2>

      <DocsTable columns={economicsColumns} rows={economicsRows} />

      <Callout
        variant="warning"
        title="No live operator earnings on chaos-net"
      >
        <p>
          The cUSDC bond, the relay/task fees operators earn, and slashing that
          would let an operator earn are <strong>Spec'd — designed, but not yet
          production-usable on chaos-net</strong>. The protocol itself charges
          no fee and takes no cut of operator fees; there is no operator subsidy
          and no protocol token. No operator relay fee is collected today. Run
          an operator to exercise and test the relay path; do not expect revenue
          until the economic layer is wired and live.
        </p>
      </Callout>

      {/* Monitoring */}
      <h2
        id="monitoring"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Monitoring
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The operator service exposes a local status API on port 3002
        (configurable via{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          PORT
        </code>{" "}
        env var).
      </p>

      <CodeBlock
        filename="terminal"
        language="bash"
        lines={[
          { content: "# Overall operator status" },
          { content: "curl http://localhost:3002/status" },
          { content: "" },
          { content: "# List relay jobs" },
          { content: "curl http://localhost:3002/status/jobs" },
          { content: "" },
          { content: "# All jobs (including completed)" },
          { content: "curl http://localhost:3002/status/jobs/all" },
          { content: "" },
          { content: "# Specific job details" },
          { content: "curl http://localhost:3002/status/jobs/:id" },
        ]}
        showLineNumbers={false}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          /status
        </code>{" "}
        endpoint returns:
      </p>

      <CodeBlock
        filename="status-response.json"
        language="typescript"
        lines={[
          { content: "{" },
          { content: '  "isRunning": true,' },
          { content: '  "isConnected": true,' },
          { content: '  "operatorAddress": "0x1234...abcd"' },
          { content: "}" },
        ]}
        showLineNumbers={false}
      />

      {/* Unbonding */}
      <h2
        id="unbonding"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Unbonding
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        To exit the operator network, initiate unbonding which starts a 7-day
        cooldown period. After the cooldown, withdraw your stake.
      </p>

      <CodeBlock
        filename="terminal"
        language="bash"
        lines={[
          { content: "# Initiate unbonding (starts 7-day cooldown)" },
          { content: "reineira-operator unbond", highlighted: true },
          { content: "" },
          { content: "# Withdraw after cooldown completes" },
          { content: "reineira-operator withdraw", highlighted: true },
        ]}
        showLineNumbers={false}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          unbond
        </code>{" "}
        supports a{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          --confirm
        </code>{" "}
        flag to skip the interactive prompt.
      </p>

      <Callout variant="info" title="Unbonding period">
        <p>
          The 7-day unbonding period is hardcoded in the OperatorRegistry
          contract (
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            UNBOND_PERIOD = 7 days
          </code>
          ). During this period your stake remains locked. Slashing of that
          stake is Spec'd — the slashing manager is implemented but not yet
          wired — so the stake is not actually slashable through the quorum
          mechanism on chaos-net today.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
