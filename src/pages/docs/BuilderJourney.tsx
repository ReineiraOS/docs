import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import CodeBlock from "@/components/docs/CodeBlock";
import DocsTable from "@/components/docs/DocsTable";
import Callout from "@/components/docs/Callout";
import Steps, { Step } from "@/components/docs/Steps";
import ArchitectureDiagram from "@/components/docs/ArchitectureDiagram";
import PageNav from "@/components/docs/PageNav";
import LinkCard from "@/components/docs/LinkCard";
import { Wrench, Code2, Layers } from "lucide-react";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  {
    id: "three-repos-one-pipeline",
    title: "Three repos, one pipeline",
    level: 2,
  },
  { id: "the-journey", title: "The journey", level: 2 },
  { id: "what-each-tool-does", title: "What each tool does", level: 2 },
  { id: "atlas", title: "Atlas", level: 3 },
  { id: "code", title: "Code", level: 3 },
  { id: "platform-modules", title: "Platform Modules", level: 3 },
  { id: "how-they-connect", title: "How they connect", level: 2 },
  { id: "requirements", title: "Requirements", level: 2 },
  { id: "next-steps", title: "Next steps", level: 2 },
];

const { prev, next } = getPrevNext("/developer-tools/builder-journey");

const repoColumns = [
  { header: "Repo", key: "repo", width: "180px" },
  { header: "Purpose", key: "purpose" },
  { header: "Stack", key: "stack" },
];

const repoRows = [
  {
    repo: "reineira-atlas",
    purpose: "Plan the venture, scaffold the app",
    stack: "Markdown + Claude Code agents",
  },
  {
    repo: "reineira-code",
    purpose: "Build on-chain plugins (Gates, Policies)",
    stack: "Foundry/Hardhat + Solidity + @cofhe/sdk",
  },
  {
    repo: "platform-modules",
    purpose: "Ship the product (backend + frontend)",
    stack: "pnpm monorepo: TypeScript + React 19",
  },
];

const requirementColumns = [
  { header: "Requirement", key: "requirement", width: "160px" },
  { header: "Version", key: "version", width: "120px" },
  { header: "Notes", key: "notes" },
];

const requirementRows = [
  {
    requirement: "Node.js",
    version: "20+",
    notes: "Required for all three repos",
  },
  {
    requirement: "Claude Code",
    version: "Latest",
    notes: "AI agent runtime — install via npm i -g @anthropic-ai/claude-code",
  },
  {
    requirement: "Git",
    version: "Any",
    notes: "Clone repos from GitHub",
  },
  {
    requirement: "pnpm",
    version: "10+",
    notes: "Platform Modules uses pnpm workspaces",
  },
  {
    requirement: "npm",
    version: "Any",
    notes: "Code and Atlas use npm",
  },
  {
    requirement: "Funded wallet",
    version: "\u2014",
    notes: "Private key for Arbitrum Sepolia deployment",
  },
];

export default function BuilderJourney() {
  return (
    <DocsLayout
      toc={toc}
      editHref="https://github.com/reineiraos/docs/edit/main/developers/builder-journey.mdx"
    >
      <Breadcrumbs />

      <PageHeader
        title="Builder Journey"
        description="The end-to-end flow of building a venture on ReineiraOS — from strategy brief to deployed product. Three tools, one pipeline."
        readingTime="7 min read"
      />

      {/* ── Three repos, one pipeline ─────────────────────────────────── */}
      <h2
        id="three-repos-one-pipeline"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Three repos, one pipeline
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS provides three developer tools that work together as a single
        pipeline — from strategy to smart contracts to shipped product. Each
        tool handles a different phase, but they are designed to flow into each
        other.
      </p>

      <DocsTable columns={repoColumns} rows={repoRows} />

      {/* ── The journey ───────────────────────────────────────────────── */}
      <h2
        id="the-journey"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        The journey
      </h2>

      <Steps>
        <Step title="Clone Atlas and write your brief">
          <p className="text-docs-text-secondary">
            Clone{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              reineira-atlas
            </code>
            , copy{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              brief.template.md
            </code>{" "}
            to{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              brief.md
            </code>
            , and describe your venture — problem, solution, vertical, business
            model, team, and priorities.
          </p>
        </Step>
        <Step title="Bootstrap your venture">
          <p className="text-docs-text-secondary mb-3">
            Run{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              /bootstrap
            </code>{" "}
            inside Atlas. This single command generates your startup OS
            (strategy docs, agent team, slash commands) AND scaffolds a working
            app from platform-modules (React 19 frontend + TypeScript backend).
            One command, full stack.
          </p>
          <CodeBlock
            filename="terminal"
            language="bash"
            showLineNumbers={false}
            lines={[{ content: 'claude "/bootstrap"' }]}
          />
        </Step>
        <Step title="Build your on-chain logic">
          <p className="text-docs-text-secondary mb-3">
            Clone{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              reineira-code
            </code>
            . Describe your Gate or Insurance Policy to Claude Code. It
            generates the Solidity contract, tests, and deployment script.
            Deploy to Arbitrum Sepolia.
          </p>
          <CodeBlock
            filename="terminal"
            language="bash"
            showLineNumbers={false}
            lines={[
              {
                content:
                  "git clone git@github.com:ReineiraOS/reineira-code.git",
              },
              { content: "cd reineira-code && npm install --legacy-peer-deps" },
              {
                content:
                  "# Describe what you want — Claude generates the contract",
              },
            ]}
          />
        </Step>
        <Step title="Wire protocol to app">
          <p className="text-docs-text-secondary mb-3">
            Back in Atlas, run{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              /integrate
            </code>
            . This connects your deployed contract to the scaffolded backend and
            frontend — SDK calls, webhook handlers, and UI flows.
          </p>
          <CodeBlock
            filename="terminal"
            language="bash"
            showLineNumbers={false}
            lines={[{ content: 'claude "/integrate"' }]}
          />
        </Step>
        <Step title="Iterate with AI agents">
          <p className="text-docs-text-secondary">
            Use Atlas agents for ongoing work.{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              /strategy
            </code>{" "}
            for business decisions,{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              /pitch-prep
            </code>{" "}
            for fundraising,{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              /weekly-plan
            </code>{" "}
            for sprint reviews. The agent team grows with your venture.
          </p>
        </Step>
      </Steps>

      {/* ── What each tool does ───────────────────────────────────────── */}
      <h2
        id="what-each-tool-does"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        What each tool does
      </h2>

      <h3
        id="atlas"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Atlas
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The operating system. Atlas is a structured set of Claude Code agents
        that run your startup. The{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          /bootstrap
        </code>{" "}
        command is the entry point — it reads your venture brief and generates
        both the startup OS (docs, agents, skills, data model) and a working
        application scaffolded from platform-modules. After bootstrap, you have
        12 specialized agents for protocol, product, strategy, growth, ops, and
        legal work.
      </p>

      <h3
        id="code"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Code
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The smart contract environment. Code is a preconfigured Hardhat project
        with Claude Code integration. It has the two protocol interfaces (
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          IConditionResolver
        </code>{" "}
        and{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          IUnderwriterPolicy
        </code>
        ) baked in, plus FHE test mocks, deployment scripts, and security
        patterns. Describe what you want and Claude generates the Solidity —
        contracts, tests, and deploy scripts.
      </p>

      <h3
        id="platform-modules"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Platform Modules
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The application layer. A pnpm monorepo with two packages: a TypeScript
        backend (Clean Architecture, Vercel-ready, DB-agnostic) and a React 19
        frontend (ZeroDev smart accounts, passkey auth, TailwindCSS). Atlas{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          /bootstrap
        </code>{" "}
        clones and customizes these into your venture directory. You can also
        use them standalone.
      </p>

      {/* ── How they connect ──────────────────────────────────────────── */}
      <h2
        id="how-they-connect"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        How they connect
      </h2>

      <Callout variant="tip" title="The bootstrap bridge">
        <p>
          Atlas is the orchestrator. When you run{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            /bootstrap
          </code>
          , it reads your brief, generates the startup OS, then scaffolds a
          working app from platform-modules — customized with your venture name,
          entities, and branding. After deploying contracts via Code,{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            /integrate
          </code>{" "}
          wires them into the app. The MCP server provides live contract
          addresses and protocol context to all three tools.
        </p>
      </Callout>

      <ArchitectureDiagram
        title="DATA FLOW"
        steps={[
          { label: "brief.md", sublabel: "Your venture brief" },
          { label: "/bootstrap", sublabel: "Atlas generates OS + app" },
          { label: "reineira-code", sublabel: "Build Gates & Policies" },
          { label: "/integrate", sublabel: "Wire protocol to app" },
          { label: "Ship", sublabel: "Deploy to Vercel + Arbitrum" },
        ]}
      />

      {/* ── Requirements ──────────────────────────────────────────────── */}
      <h2
        id="requirements"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Requirements
      </h2>

      <DocsTable columns={requirementColumns} rows={requirementRows} />

      <Callout variant="info" title="MCP server">
        <p>
          All three tools can connect to the ReineiraOS MCP server for live
          contract addresses, Solidity interfaces, and protocol docs. Run:
        </p>
        <CodeBlock
          filename="terminal"
          language="bash"
          showLineNumbers={false}
          lines={[
            {
              content:
                "claude mcp add reineira-docs --transport http https://zyx576c546w4m4ag7nzhf467du0wixjg.lambda-url.us-east-2.on.aws/",
            },
          ]}
        />
      </Callout>

      {/* ── Next steps ────────────────────────────────────────────────── */}
      <h2
        id="next-steps"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Next steps
      </h2>

      <LinkCard
        items={[
          {
            title: "Atlas",
            description:
              "Start here — write your brief and bootstrap your venture",
            href: "/developer-tools/atlas",
            icon: Wrench,
          },
          {
            title: "Code",
            description: "Build custom Gates and Insurance Policies",
            href: "/developer-tools/reineira-code",
            icon: Code2,
          },
          {
            title: "Platform Modules",
            description: "Explore the backend and React app starters",
            href: "/developer-tools/platform-modules",
            icon: Layers,
          },
        ]}
      />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
