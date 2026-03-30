import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import CodeBlock from "@/components/docs/CodeBlock";
import DocsTable from "@/components/docs/DocsTable";
import Callout from "@/components/docs/Callout";
import Steps, { Step } from "@/components/docs/Steps";
import PageNav from "@/components/docs/PageNav";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "how-it-works", title: "How it works", level: 2 },
  { id: "agent-framework", title: "Agent framework", level: 2 },
  { id: "skills-and-commands", title: "Skills and commands", level: 2 },
  { id: "protocol-commands", title: "Protocol", level: 3 },
  { id: "product-commands", title: "Product", level: 3 },
  { id: "strategy-commands", title: "Strategy", level: 3 },
  { id: "growth-ops-commands", title: "Growth and operations", level: 3 },
  { id: "getting-started", title: "Getting started", level: 2 },
  { id: "venture-brief", title: "Venture brief", level: 2 },
  { id: "data-model", title: "Data model", level: 2 },
  { id: "documents", title: "Documents", level: 2 },
  { id: "use-cases", title: "Use cases", level: 2 },
  { id: "ecosystem", title: "Ecosystem", level: 2 },
  { id: "status", title: "Status", level: 2 },
];

const { prev, next } = getPrevNext("/docs/get-started/atlas");

const agentColumns = [
  { header: "Agent", key: "agent", width: "180px" },
  { header: "Domain", key: "domain", width: "100px" },
  { header: "What it does", key: "desc" },
];

const agentRows = [
  {
    agent: "core-chief",
    domain: "Operations",
    desc: "Sprint planning, weekly reviews, progress tracking, and team coordination",
  },
  {
    agent: "protocol-resolver",
    domain: "Protocol",
    desc: "Guides design of IConditionResolver contracts for escrow release conditions",
  },
  {
    agent: "protocol-policy",
    domain: "Protocol",
    desc: "Guides design of IUnderwriterPolicy contracts for insurance risk evaluation and dispute resolution",
  },
  {
    agent: "product-frontend",
    domain: "Product",
    desc: "Vue 3 frontend development using the platform-modules app starter",
  },
  {
    agent: "product-backend",
    domain: "Product",
    desc: "TypeScript backend development using the platform-modules backend starter",
  },
  {
    agent: "product-integrator",
    domain: "Product",
    desc: "Wires protocol contracts to frontend and backend end-to-end",
  },
  {
    agent: "strategy-advisor",
    domain: "Strategy",
    desc: "Business strategy, market positioning, pricing, and decision-making",
  },
  {
    agent: "strategy-tokenomics",
    domain: "Strategy",
    desc: "Incentive design, flywheel mechanics, and fee structure for the open economy",
  },
  {
    agent: "strategy-pitch",
    domain: "Strategy",
    desc: "Investor preparation, pitch materials, and fund intro readiness",
  },
  {
    agent: "growth-content",
    domain: "Growth",
    desc: "Tutorials, blog posts, social threads, and developer documentation",
  },
  {
    agent: "growth-community",
    domain: "Growth",
    desc: "Community building, developer relations, and partnership strategy",
  },
  {
    agent: "legal-crypto",
    domain: "Legal",
    desc: "Crypto regulatory compliance: MiCA, AML/KYC, data privacy, smart contract audit guidance",
  },
];

const protocolCmdColumns = [
  { header: "Command", key: "command", mono: true, width: "140px" },
  { header: "What it does", key: "desc" },
  { header: "Agent", key: "agent", mono: true, width: "160px" },
];

const protocolCmdRows = [
  {
    command: "/resolver",
    desc: "Design a condition resolver for escrow release",
    agent: "protocol-resolver",
  },
  {
    command: "/policy",
    desc: "Design an insurance underwriter policy",
    agent: "protocol-policy",
  },
  {
    command: "/integrate",
    desc: "Wire protocol to app end-to-end",
    agent: "product-integrator",
  },
];

const productCmdRows = [
  {
    command: "/dev-frontend",
    desc: "Frontend development (Vue 3 + ZeroDev)",
    agent: "product-frontend",
  },
  {
    command: "/dev-backend",
    desc: "Backend development (TypeScript, Vercel-ready)",
    agent: "product-backend",
  },
];

const strategyCmdRows = [
  {
    command: "/strategy",
    desc: "Strategic analysis and recommendation",
    agent: "strategy-advisor",
  },
  {
    command: "/tokenomics",
    desc: "Incentive design and fee structure",
    agent: "strategy-tokenomics",
  },
  {
    command: "/pitch-prep",
    desc: "Prepare materials for fund intro",
    agent: "strategy-pitch",
  },
];

const growthCmdRows = [
  {
    command: "/content",
    desc: "Write tutorials, blogs, social threads",
    agent: "growth-content",
  },
  {
    command: "/community",
    desc: "Community building, developer relations",
    agent: "growth-community",
  },
  {
    command: "/compliance",
    desc: "Crypto regulatory compliance review",
    agent: "legal-crypto",
  },
  {
    command: "/weekly-plan",
    desc: "Weekly sprint review and planning",
    agent: "core-chief",
  },
];

const dataColumns = [
  { header: "Stream", key: "stream", width: "120px" },
  { header: "Directory", key: "dir", mono: true, width: "160px" },
  { header: "What gets recorded", key: "desc" },
];

const dataRows = [
  {
    stream: "Decisions",
    dir: "data/decisions/",
    desc: "Strategic decisions with rationale, alternatives considered, and expected outcomes. Logged by any agent after a significant choice.",
  },
  {
    stream: "Metrics",
    dir: "data/metrics/",
    desc: "KPI snapshots with protocol metrics (GMV, escrow volume), business metrics (revenue, active wallets), and growth metrics (community, contributors).",
  },
  {
    stream: "Signals",
    dir: "data/signals/",
    desc: "Market intelligence, competitive moves, regulatory changes, and ecosystem updates. Captured by research and growth agents.",
  },
];

const docsColumns = [
  { header: "Directory", key: "dir", mono: true, width: "140px" },
  { header: "Contents", key: "contents" },
  { header: "Updated by", key: "updatedBy", width: "240px" },
];

const docsRows = [
  {
    dir: "strategy/",
    contents: "Business model, roadmap, tokenomics",
    updatedBy: "strategy-advisor, strategy-tokenomics",
  },
  {
    dir: "execution/",
    contents: "Sprint log, action items",
    updatedBy: "core-chief",
  },
  {
    dir: "product/",
    contents: "Architecture, protocol integration",
    updatedBy: "product-*, protocol-*",
  },
  {
    dir: "growth/",
    contents: "Community strategy, developer relations",
    updatedBy: "growth-community, growth-content",
  },
  {
    dir: "intelligence/",
    contents: "Metrics dashboard, competitive landscape",
    updatedBy: "core-chief, strategy-advisor",
  },
  {
    dir: "legal/",
    contents: "MiCA, AML/KYC, data privacy",
    updatedBy: "legal-crypto",
  },
];

const ecosystemColumns = [
  { header: "Repo", key: "repo", width: "180px" },
  { header: "What you do there", key: "purpose" },
  { header: "Platform", key: "platform", width: "80px" },
];

const ecosystemRows = [
  {
    repo: "reineira-atlas",
    purpose: "Run the startup: strategy, ops, growth, compliance, pitch",
    platform: "0.1",
  },
  {
    repo: "reineira-code",
    purpose: "Build smart contracts: resolvers, policies, tests, deploy",
    platform: "0.1",
  },
  {
    repo: "platform-modules",
    purpose: "Ship the product: backend API, platform app, payment link",
    platform: "0.1",
  },
];

export default function ReineiraAtlas() {
  return (
    <DocsLayout
      toc={toc}
      editHref="https://github.com/reineiraos/docs/edit/main/developers/atlas.mdx"
    >
      <Breadcrumbs />

      <PageHeader
        title="ReineiraOS Atlas"
        description="The startup operating system for ventures building on ReineiraOS. Strategy, operations, growth, compliance, fundraising, and team coordination — powered by a 12-agent AI team."
        readingTime="12 min read"
      />

      <Callout variant="tip" title="Who is Atlas for?">
        <p>
          Atlas is for founders, ops leads, and non-technical team members who
          need to run a startup in the confidential finance ecosystem. You do
          not need to write code to use it.
        </p>
      </Callout>

      {/* ── How it works ───────────────────────────────────────────────── */}
      <h2
        id="how-it-works"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        How it works
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Atlas is a structured directory of AI agents, slash commands, strategy
        documents, and living data files. It is designed to be opened in an
        editor with Claude Code support. When you ask a question or run a slash
        command, Atlas routes your prompt to the right agent, which reads your
        venture context, checks your metrics, consults the relevant playbooks,
        and produces an actionable output.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The system follows a strict loading order:
      </p>

      <Steps>
        <Step title="SYSTEM.md loads phase, conventions, and economy roles">
          <p className="text-docs-text-secondary">
            Global system configuration and operating context.
          </p>
        </Step>
        <Step title="CLAUDE.md loads ecosystem repos, contract addresses, and tech stack">
          <p className="text-docs-text-secondary">
            Technical context for the AI agents.
          </p>
        </Step>
        <Step title="Dispatch routes your prompt to the right agent">
          <p className="text-docs-text-secondary">
            Prompt analysis and agent selection.
          </p>
        </Step>
        <Step title="Agent reads its dependencies and executes the playbook">
          <p className="text-docs-text-secondary">
            Context-aware execution with document dependencies.
          </p>
        </Step>
        <Step title="Data gets updated if the action was strategic">
          <p className="text-docs-text-secondary">
            Append-only logging to decision, metrics, and signal streams.
          </p>
        </Step>
      </Steps>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Every decision, metric update, and strategic insight gets logged to
        append-only data files so your team builds institutional memory over
        time.
      </p>

      {/* ── Agent framework ────────────────────────────────────────────── */}
      <h2
        id="agent-framework"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Agent framework
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Atlas ships with 12 specialized AI agents organized into six domains.
        Each agent has a defined role, a set of document dependencies it reads
        before acting, and specific documents it is authorized to update.
      </p>

      <DocsTable columns={agentColumns} rows={agentRows} />

      <p className="text-docs-text-secondary leading-relaxed mb-4 mt-4">
        Agents are not independent chatbots. They form chains: the dispatch
        layer reads your prompt, selects the right agent (or sequence of
        agents), and each agent reads the documents it depends on before
        producing output. After any strategic change, agents log to{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          data/decisions/
        </code>{" "}
        and update the sprint log automatically.
      </p>

      {/* ── Skills and commands ─────────────────────────────────────────── */}
      <h2
        id="skills-and-commands"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Skills and commands
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Atlas provides 12 slash commands that trigger structured workflows. Each
        command maps to a skill definition and a backing agent.
      </p>

      <h3
        id="protocol-commands"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Protocol
      </h3>

      <DocsTable columns={protocolCmdColumns} rows={protocolCmdRows} />

      <h3
        id="product-commands"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Product
      </h3>

      <DocsTable columns={protocolCmdColumns} rows={productCmdRows} />

      <h3
        id="strategy-commands"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Strategy
      </h3>

      <DocsTable columns={protocolCmdColumns} rows={strategyCmdRows} />

      <h3
        id="growth-ops-commands"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Growth and operations
      </h3>

      <DocsTable columns={protocolCmdColumns} rows={growthCmdRows} />

      <p className="text-docs-text-secondary leading-relaxed mb-4 mt-6">
        Example usage:
      </p>

      <CodeBlock
        filename="terminal"
        language="bash"
        showLineNumbers={false}
        lines={[
          {
            content:
              "/resolver Design a payment verification resolver using zkTLS proof from Reclaim Protocol",
          },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4 mt-4">
        The agent reads your venture brief, checks the protocol integration
        docs, reviews the{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          IConditionResolver
        </code>{" "}
        interface spec, and produces a complete resolver design with storage
        layout, verification logic, and test plan.
      </p>

      {/* ── Getting started ────────────────────────────────────────────── */}
      <h2
        id="getting-started"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Getting started
      </h2>

      <Steps>
        <Step title="Clone the repo">
          <CodeBlock
            filename="terminal"
            language="bash"
            showLineNumbers={false}
            lines={[
              {
                content:
                  "git clone https://github.com/ReineiraOS/reineira-atlas.git",
              },
              { content: "cd reineira-atlas" },
            ]}
          />
        </Step>
        <Step title="Configure your venture brief">
          <p className="text-docs-text-secondary">
            Open{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              brief.md
            </code>{" "}
            in the project root and fill in your venture details. This is the
            single source of truth that every agent reads to understand your
            business.
          </p>
        </Step>
        <Step title="Run the starter agent">
          <CodeBlock
            filename="terminal"
            language="bash"
            showLineNumbers={false}
            lines={[
              {
                content:
                  'claude "Read .claude/agents/_starter.md then read brief.md and execute the full setup."',
              },
            ]}
          />
          <p className="text-docs-text-secondary mt-3">
            The starter agent reads your brief, populates all strategy documents
            with your venture-specific context, configures the agent team, and
            initializes your sprint log.
          </p>
        </Step>
        <Step title="Start using Atlas">
          <p className="text-docs-text-secondary mb-3">
            Open the project in an editor with Claude Code support. Ask
            questions naturally or use slash commands:
          </p>
          <CodeBlock
            filename="terminal"
            language="bash"
            showLineNumbers={false}
            lines={[
              {
                content:
                  "/strategy Should we charge per escrow or per monthly active user?",
              },
              {
                content:
                  "/tokenomics Model the flywheel for a P2P trading desk on ReineiraOS",
              },
              {
                content:
                  "/compliance What MiCA requirements apply to a non-custodial escrow service?",
              },
              {
                content:
                  "/pitch-prep We have a call with a seed-stage fund next week",
              },
              {
                content:
                  "/weekly-plan Review last sprint and plan the next one",
              },
            ]}
          />
        </Step>
      </Steps>

      {/* ── Venture brief ──────────────────────────────────────────────── */}
      <h2
        id="venture-brief"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Venture brief
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          brief.md
        </code>{" "}
        file at the project root is the starting point for your entire Atlas
        configuration. Every agent reads it. Every document template pulls from
        it. The starter agent uses it to bootstrap your full operating system.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Your brief should include:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-6">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Venture name
          </strong>{" "}
          and one-line description
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Problem
          </strong>{" "}
          you are solving and for whom
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Solution
          </strong>{" "}
          and how ReineiraOS enables it
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Vertical
          </strong>{" "}
          (P2P trading, invoice finance, gift cards, gaming assets,
          cross-border, or custom)
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Open economy role
          </strong>{" "}
          (policy builder, pool underwriter, LP staker, operator, or a
          combination)
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Business model
          </strong>{" "}
          and revenue streams
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">Team</strong>{" "}
          and current stage (idea, MVP, launched, growing)
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Priorities
          </strong>{" "}
          for the next 30 days
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Constraints
          </strong>{" "}
          (budget, team size, regulatory, technical)
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Unfair advantage
          </strong>{" "}
          or moat
        </li>
      </ul>

      <Callout variant="tip" title="Keep it real">
        <p>
          The brief does not need to be polished. It is an operational document,
          not a pitch deck. Write what is true today; the agents will help you
          refine it.
        </p>
      </Callout>

      {/* ── Data model ─────────────────────────────────────────────────── */}
      <h2
        id="data-model"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Data model
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Atlas uses an append-only data model stored in{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          .claude/data/
        </code>
        . Data is organized into three streams:
      </p>

      <DocsTable columns={dataColumns} rows={dataRows} />

      <h3 className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3">
        Rules
      </h3>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-6">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Append-only.
          </strong>{" "}
          Past entries are never edited. This creates a reliable decision trail.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Date-stamped.
          </strong>{" "}
          Each entry is a file named{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            YYYY-MM-DD.md
          </code>{" "}
          in its stream directory.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Agent-written.
          </strong>{" "}
          Agents create data entries automatically after strategic actions. You
          can also add entries manually.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Read before write.
          </strong>{" "}
          Every strategic agent checks the metrics dashboard before making
          recommendations.
        </li>
      </ul>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The data directory, combined with the strategy documents in{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          .claude/docs/
        </code>
        , gives your venture institutional memory that persists across sessions
        and team members.
      </p>

      {/* ── Documents ──────────────────────────────────────────────────── */}
      <h2
        id="documents"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Documents
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Atlas maintains structured documents in{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          .claude/docs/
        </code>{" "}
        organized by domain:
      </p>

      <DocsTable columns={docsColumns} rows={docsRows} />

      {/* ── Use cases ──────────────────────────────────────────────────── */}
      <h2
        id="use-cases"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Use cases
      </h2>

      <h3 className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3">
        Strategy planning
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Run{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          /strategy
        </code>{" "}
        to analyze business model options, pricing, and market positioning. The
        strategy advisor reads your brief, metrics, and roadmap, then produces
        recommendations grounded in your current state.
      </p>

      <CodeBlock
        filename="terminal"
        language="bash"
        showLineNumbers={false}
        lines={[
          {
            content:
              "/strategy We're building a P2P crypto trading desk. Should we focus on Africa or Southeast Asia first?",
          },
        ]}
      />

      <h3 className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3">
        Tokenomics and incentive design
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Run{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          /tokenomics
        </code>{" "}
        to model fee structures, flywheel mechanics, and the open economy roles
        that apply to your venture.
      </p>

      <CodeBlock
        filename="terminal"
        language="bash"
        showLineNumbers={false}
        lines={[
          {
            content:
              "/tokenomics Model the unit economics for an escrow fee of 0.5% with insurance premium of 2%",
          },
        ]}
      />

      <h3 className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3">
        Compliance review
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Run{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          /compliance
        </code>{" "}
        to assess your regulatory posture. The legal agent covers MiCA, AML/KYC
        requirements, data privacy obligations, and smart contract audit
        planning.
      </p>

      <CodeBlock
        filename="terminal"
        language="bash"
        showLineNumbers={false}
        lines={[
          {
            content:
              "/compliance We want to launch in the EU. What MiCA requirements apply to our non-custodial escrow product?",
          },
        ]}
      />

      <h3 className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3">
        Pitch preparation
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Run{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          /pitch-prep
        </code>{" "}
        before investor meetings. The pitch agent reviews your business model,
        metrics, roadmap, and competitive landscape. Teams building on
        ReineiraOS may qualify for warm fund introductions through the protocol
        team.
      </p>

      <CodeBlock
        filename="terminal"
        language="bash"
        showLineNumbers={false}
        lines={[
          {
            content:
              "/pitch-prep We have a 30-minute call with a pre-seed fund that focuses on DeFi infrastructure",
          },
        ]}
      />

      <h3 className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3">
        Sprint planning and operations
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Run{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          /weekly-plan
        </code>{" "}
        for structured sprint reviews. The operations agent reads the sprint
        log, checks metrics against targets, and produces a plan for the next
        week.
      </p>

      <h3 className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3">
        Content and community
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Run{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          /content
        </code>{" "}
        to write technical tutorials, blog posts, or social threads. Run{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          /community
        </code>{" "}
        to plan developer relations, partnership outreach, and community
        building strategy.
      </p>

      <CodeBlock
        filename="terminal"
        language="bash"
        showLineNumbers={false}
        lines={[
          {
            content:
              "/content Write a technical tutorial explaining how our zkTLS resolver works",
          },
          {
            content:
              "/community Plan our first 100 users strategy for Telegram and Twitter",
          },
        ]}
      />

      {/* ── Ecosystem ──────────────────────────────────────────────────── */}
      <h2
        id="ecosystem"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Ecosystem
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Atlas is one of three repos that make up the ReineiraOS builder
        platform:
      </p>

      <DocsTable columns={ecosystemColumns} rows={ecosystemRows} />

      <p className="text-docs-text-secondary leading-relaxed mb-4 mt-4">
        All repos declare their platform compatibility in{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          reineira.json
        </code>
        . When the platform version bumps (e.g., 0.1 to 0.2), breaking contract
        interface changes may require upgrading. The current platform version is
        0.1.
      </p>

      {/* ── Status ─────────────────────────────────────────────────────── */}
      <h2
        id="status"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Status
      </h2>

      <Callout variant="info" title="Active development">
        <p>
          ReineiraOS Atlas is in active development at platform version 0.1. The
          agent team, skill commands, and document templates are stable. The
          repo is designed to evolve with your venture: as you make decisions,
          log metrics, and capture signals, Atlas becomes more context-aware and
          its recommendations become more specific to your situation.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
