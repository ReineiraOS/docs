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
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "requirements", title: "Requirements", level: 2 },
  { id: "setup", title: "Setup", level: 2 },
  { id: "settlement-flow", title: "Settlement flow", level: 2 },
  { id: "economics", title: "Economics", level: 2 },
  { id: "monitoring", title: "Monitoring", level: 2 },
];

const { prev, next } = getPrevNext("/operate/run-operator");

const requirementColumns = [
  { header: "Requirement", key: "req", width: "160px" },
  { header: "Details", key: "details" },
];
const requirementRows = [
  {
    req: "Bond / stake",
    details:
      "None. Running a relayer is permissionless — no registration, bond, or stake is required. Recourse pools (Shield) are funded by LPs and premiums and provide coverage capped at pool liquidity, not relayer collateral.",
  },
  {
    req: "ETH",
    details: "Gas funds on Arbitrum Sepolia for settlement transactions",
  },
  {
    req: "RPC endpoints",
    details: "Arbitrum Sepolia and each source chain you intend to relay for",
  },
  {
    req: "Private key",
    details: "Dedicated relayer wallet \u2014 do not reuse personal wallets",
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
    metric: "Relayer reward",
    value:
      "None at the protocol level. Relayers run permissionlessly and recover only their own destination-chain gas costs",
  },
  {
    metric: "Relayer subsidy / token",
    value: "None \u2014 no subsidy programme and no protocol token",
  },
  {
    metric: "Bond / stake",
    value:
      "None \u2014 running a relayer requires no bond, stake, or registration",
  },
];

export default function RunOperator() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Run a Relayer"
        description="Relayers are permissionless bots that watch CCTP burns, fetch Circle's signed attestation, and call settle() to complete cross-chain settlement. Running one requires no registration, bond, or stake — any address can relay. Settlement itself is permissionless and secured by Circle's CCTP attestation verified on-chain, so a relayer only affects speed: if it is down, anyone can still settle."
        readingTime="6 min read"
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
        Connect to the coordinator via SSE and relay cross-chain CCTP
        settlements. Running a relayer is permissionless: watch CCTP burns,
        fetch Circle's signed attestation, and call settle(). The coordinator
        does round-robin SSE notification of burn events to avoid duplicate gas,
        but there is no on-chain operator registry or task assignment — no
        registration, bond, or stake is required. Settlement itself is
        permissionless and secured by Circle's CCTP attestation verified
        on-chain, so the relayer only affects speed.
      </p>

      <Callout
        variant="info"
        title="Relaying is permissionless — you only need gas"
      >
        <p>
          You can build from source, run the service, and relay CCTP transfers
          on Arbitrum Sepolia testnet today. There is{" "}
          <strong>no registration, bond, stake, or slashing</strong>: any
          address can fetch Circle's attestation and call settle(). The protocol
          takes no cut, and there is no relayer subsidy and no protocol token. A
          relayer recovers only its own destination-chain gas; if it is down,
          anyone else can still settle.
        </p>
      </Callout>

      <DocsTable
        columns={[
          { header: "Property", key: "prop", width: "200px" },
          { header: "Value", key: "value" },
        ]}
        rows={[
          {
            prop: "Protocol fee",
            value: "None — the protocol charges nothing",
          },
          {
            prop: "Registration",
            value: "None — relaying is permissionless from the start",
          },
          {
            prop: "Settlement",
            value:
              "Permissionless — anyone can call settle() with a valid Circle attestation",
          },
          { prop: "Bond / stake", value: "None" },
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
                content: "# set it explicitly to point at a real coordinator.",
              },
              {
                content: "export COORDINATOR_URL=https://your-coordinator...",
                highlighted: true,
              },
            ]}
            showLineNumbers={false}
          />
        </Step>
        <Step title="Start the relayer service">
          <p className="text-docs-text-secondary leading-relaxed mb-3">
            There is no registration or staking step. The relayer service (
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
            ) via SSE and then receives burn notifications and settles them
            permissionlessly.
          </p>
        </Step>
      </Steps>

      {/* Settlement Flow */}
      <h2
        id="settlement-flow"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Settlement flow
      </h2>

      <ArchitectureDiagram
        title="PERMISSIONLESS CCTP SETTLEMENT"
        steps={[
          { label: "SDK submits burn tx", sublabel: "POST to coordinator" },
          {
            label: "Coordinator notifies",
            sublabel: "Round-robin via SSE",
          },
          { label: "Fetch attestation", sublabel: "Poll Circle Iris API" },
          {
            label: "Call settle()",
            sublabel: "CCTPV2EscrowReceiver on destination chain",
          },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The SDK submits a burn transaction hash to the coordinator. The
        coordinator notifies the next relayer of the burn via round-robin SSE so
        relayers do not duplicate gas. The relayer polls Circle Iris for the
        signed attestation, then calls{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          CCTPV2EscrowReceiver.settle(message, attestation)
        </code>{" "}
        on Arbitrum Sepolia. CCTP mints USDC on the destination chain and funds
        are routed to the escrow via hook data. The protocol takes no fee.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Settlement is permissionless from the start: anyone can call{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          settle()
        </code>{" "}
        with a valid Circle attestation, verified on-chain, regardless of
        registration or stake. The relayer's role is to surface settlements
        quickly; if the relayer is down, settlement is not blocked — any account
        can settle the same burn.
      </p>

      {/* Economics */}
      <h2
        id="economics"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Economics
      </h2>

      <DocsTable columns={economicsColumns} rows={economicsRows} />

      <Callout variant="info" title="Relaying is permissionless and unpaid">
        <p>
          There is{" "}
          <strong>no bond, stake, slashing, or protocol relay fee</strong>. The
          protocol charges nothing, and there is no relayer subsidy and no
          protocol token. A relayer recovers only its own destination-chain gas.
          Run a relayer to keep cross-chain settlement fast; settlement itself
          is permissionless and proceeds whether or not any particular relayer
          is online.
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

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
