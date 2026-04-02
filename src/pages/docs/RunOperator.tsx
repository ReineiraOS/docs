import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import CodeBlock from "@/components/docs/CodeBlock";
import ArchitectureDiagram from "@/components/docs/ArchitectureDiagram";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import Steps, { Step } from "@/components/docs/Steps";
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

const { prev, next } = getPrevNext("/docs/operate/run-operator");

const requirementColumns = [
  { header: "Requirement", key: "req", width: "160px" },
  { header: "Details", key: "details" },
];
const requirementRows = [
  {
    req: "Staking token",
    details:
      "TBD — mock governance token on testnet. Amount configurable via OperatorRegistry.",
  },
  {
    req: "ETH",
    details: "Gas funds on Arbitrum Sepolia for relay transactions",
  },
  {
    req: "RPC endpoints",
    details: "Arbitrum Sepolia + each source chain you intend to relay for",
  },
  {
    req: "Private key",
    details: "Dedicated operator wallet \u2014 do not reuse personal wallets",
  },
  { req: "Node.js", details: "v20 LTS or higher" },
  {
    req: "System",
    details: "Linux/macOS, 2+ CPU cores, 4 GB RAM, stable internet",
  },
];

const economicsColumns = [
  { header: "Metric", key: "metric", width: "240px" },
  { header: "Value", key: "value" },
];
const economicsRows = [
  { metric: "Operator relay fee", value: "0.35% (35 bps) of bridged USDC" },
  {
    metric: "Protocol relay fee",
    value: "0.15% (15 bps) of bridged USDC (separate from operator fee)",
  },
  {
    metric: "Escrow settlement fee",
    value: "0.25% (25 bps) on escrow redemption",
  },
  { metric: "Minimum stake", value: "TBD" },
  {
    metric: "Unbonding period",
    value: "7 days (hardcoded in OperatorRegistry)",
  },
  { metric: "Example: 10,000 USDC relay", value: "35 USDC operator earnings" },
  {
    metric: "Fee settlement",
    value: "Automatic \u2014 credited to operator wallet on task completion",
  },
];

export default function RunOperator() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Run an Operator"
        description="Operators are staked relay nodes that execute cross-chain CCTP v2 settlement tasks. They relay burn-and-mint messages between chains and earn fees on every operation."
        readingTime="8 min read"
      />

      {/* Overview */}
      <h2
        id="overview"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Overview
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Operators stake tokens on-chain, connect to the coordinator via SSE, and
        execute cross-chain CCTP relay tasks. The coordinator distributes tasks
        via round-robin. On-chain contracts (OperatorRegistry, TaskExecutor)
        enforce staking requirements, exclusive windows, and fee collection.
      </p>

      <DocsTable
        columns={[
          { header: "Property", key: "prop", width: "200px" },
          { header: "Value", key: "value" },
        ]}
        rows={[
          {
            prop: "Relay fee",
            value: "35 bps (0.35%) of bridged USDC per relay",
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
        <Step title="Install the operator CLI">
          <CodeBlock
            filename="terminal"
            language="bash"
            lines={[
              {
                content: "npm install -g @reineira-ops/operator-cli",
                highlighted: true,
              },
              { content: "" },
              { content: "# Verify installation" },
              { content: "reineira-operator --version" },
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
            ]}
            showLineNumbers={false}
          />
        </Step>
        <Step title="Register as an operator">
          <CodeBlock
            filename="terminal"
            language="bash"
            lines={[
              { content: "reineira-operator register", highlighted: true },
              { content: "" },
              { content: "# Verify your registration" },
              { content: "reineira-operator status" },
            ]}
            showLineNumbers={false}
          />
        </Step>
        <Step title="Start the operator service">
          <CodeBlock
            filename="terminal"
            language="bash"
            lines={[
              {
                content:
                  "# Start the operator agent (connects to coordinator via SSE)",
              },
              { content: "npx @reineira-ops/operator", highlighted: true },
            ]}
            showLineNumbers={false}
          />
          <p className="text-docs-text-secondary leading-relaxed mt-3">
            The operator connects to the coordinator at{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              dswtxw6k9mker.cloudfront.net
            </code>{" "}
            via SSE and automatically receives and executes relay tasks.
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
        Operators stake tokens on-chain via the OperatorRegistry contract. The
        stake acts as collateral — it is slashable for misbehavior. The staking
        token and minimum amount are configurable (TBD for production, mock
        governance token on testnet). Unbonding period is 7 days (hardcoded).
      </p>

      <CodeBlock
        filename="terminal"
        language="bash"
        lines={[
          { content: "# Check current stake and status" },
          { content: "reineira-operator stake" },
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
        . CCTP mints USDC on Arbitrum Sepolia, funds are routed to the escrow
        via hook data, and fees are collected by FeeManager.
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

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Fees are deducted from the bridged amount before settlement. For a
        10,000 USDC transfer, 50 USDC goes to the operator, 30 USDC to the
        protocol, and 9,920 USDC reaches the destination escrow.
      </p>

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

      <Callout variant="info" title="Unbonding period">
        <p>
          The 7-day unbonding period is hardcoded in the OperatorRegistry
          contract (
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            UNBOND_PERIOD = 7 days
          </code>
          ). During this period, your stake remains locked and slashable.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
