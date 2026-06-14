import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import Steps, { Step } from "@/components/docs/Steps";
import PageNav from "@/components/docs/PageNav";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "whats-inside", title: "What's inside", level: 2 },
  { id: "get-started", title: "Get started", level: 2 },
  { id: "workflow", title: "Workflow", level: 2 },
  { id: "what-you-can-build", title: "What you can build", level: 2 },
  { id: "after-deploying", title: "After deploying", level: 2 },
  { id: "status", title: "Status", level: 2 },
];

const { prev, next } = getPrevNext("/developer-tools/reineira-code");

export default function ReineiraCode() {
  return (
    <DocsLayout
      toc={toc}
      editHref="https://github.com/reineiraos/docs/edit/main/developers/reineira-code.mdx"
    >
      <Breadcrumbs />

      <PageHeader
        title="Code"
        description="A preconfigured Claude Code environment with full protocol context for building condition resolvers and Recourse policies with AI assistance."
        readingTime="4 min read"
      />

      {/* ── What's inside ──────────────────────────────────────────────── */}
      <h2
        id="whats-inside"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        What's inside
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The repo ships with everything you need to build, test, and deploy
        plugins for ReineiraOS:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-6">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Hardhat project
          </strong>{" "}
          — Solidity compiler, FHE test mocks, deployment scripts, all
          preconfigured
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              .claude/
            </code>{" "}
            configuration
          </strong>{" "}
          — Claude Code context files containing protocol interfaces, deployed
          addresses, architectural patterns, and best practices
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Plugin scaffolds
          </strong>{" "}
          — Starter templates for{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            IConditionResolver
          </code>{" "}
          and{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            IUnderwriterPolicy
          </code>{" "}
          implementations
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Test harness
          </strong>{" "}
          — FHE-enabled test suite with cofhejs mocks so you can test encrypted
          logic locally
        </li>
      </ul>

      {/* ── Get started ────────────────────────────────────────────────── */}
      <h2
        id="get-started"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Get started
      </h2>

      <CodeBlock
        filename="terminal"
        language="bash"
        showLineNumbers={false}
        lines={[
          {
            content:
              "git clone https://github.com/ReineiraOS/reineira-code.git",
          },
          { content: "cd reineira-code" },
          { content: "npm install" },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4 mt-6">
        Open in VS Code or any editor with Claude Code support. The AI agent has
        full context about:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-6">
        <li>
          The{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            IConditionResolver
          </code>{" "}
          and{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            IUnderwriterPolicy
          </code>{" "}
          interfaces
        </li>
        <li>Deployed contract addresses on testnet</li>
        <li>FHE encryption patterns with cofhejs</li>
        <li>Deployment and upgrade workflows</li>
        <li>Security best practices for plugin development</li>
      </ul>

      {/* ── Workflow ───────────────────────────────────────────────────── */}
      <h2
        id="workflow"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Workflow
      </h2>

      <Steps>
        <Step title="Describe what you want">
          <p className="text-docs-text-secondary">
            "Build a condition resolver that verifies Stripe payment via zkTLS"
          </p>
        </Step>
        <Step title="Claude Code generates the contract">
          <p className="text-docs-text-secondary">
            Implements the interface, handles storage, adds ERC-165 support.
          </p>
        </Step>
        <Step title="Run tests">
          <CodeBlock
            filename="terminal"
            language="bash"
            showLineNumbers={false}
            lines={[{ content: "npx hardhat test" }]}
          />
        </Step>
        <Step title="Deploy">
          <p className="text-docs-text-secondary">
            Claude Code generates the deployment script targeting Arbitrum
            Sepolia.
          </p>
        </Step>
        <Step title="Attach to an Escrow">
          <p className="text-docs-text-secondary mb-3">
            Use the SDK to create Escrows with your new resolver:
          </p>
          <CodeBlock
            filename="create-escrow.ts"
            language="typescript"
            showLineNumbers={false}
            lines={[
              { content: "const escrow = await sdk.escrow" },
              { content: "  .build()" },
              { content: "  .amount(sdk.usdc(1000))" },
              { content: "  .owner('0xSeller...')" },
              {
                content:
                  "  .condition('0xYourDeployedResolver...', encodedData)",
              },
              { content: "  .create()" },
            ]}
          />
        </Step>
      </Steps>

      {/* ── What you can build ─────────────────────────────────────────── */}
      <h2
        id="what-you-can-build"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        What you can build
      </h2>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-6">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Payment verification Gates
          </strong>{" "}
          — zkTLS proofs of PayPal, Stripe, bank transfers via Reclaim Protocol
          attestations
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Oracle Gates
          </strong>{" "}
          — release Escrow when a Chainlink price feed crosses a threshold
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Prediction market Gates
          </strong>{" "}
          — settle based on Polymarket or UMA resolution
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Multi-signature Gates
          </strong>{" "}
          — M-of-N parties must sign before release
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Time-locked Gates
          </strong>{" "}
          — automatic release after a deadline
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Custom Recourse policies
          </strong>{" "}
          — define risk scoring and dispute resolution for any domain
        </li>
      </ul>

      {/* ── After deploying ─────────────────────────────────────────────── */}
      <h2
        id="after-deploying"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        After deploying
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Once your Gate or Policy is deployed to Arbitrum Sepolia, head back to
        Atlas and run{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          /integrate
        </code>
        . This wires your deployed contract into the scaffolded app from
        platform-modules — SDK calls in the backend, webhook handlers for
        on-chain events, and UI flows in the React frontend.
      </p>

      <Callout variant="tip" title="Full builder flow">
        <p>
          Atlas{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            /bootstrap
          </code>{" "}
          scaffolds the app, Code builds the on-chain logic,{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            /integrate
          </code>{" "}
          connects them. See the{" "}
          <a
            href="/developer-tools/builder-journey"
            className="text-brand-primary hover:underline"
          >
            Builder Journey
          </a>{" "}
          for the full picture.
        </p>
      </Callout>

      {/* ── Status ─────────────────────────────────────────────────────── */}
      <h2
        id="status"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Status
      </h2>

      <Callout variant="info" title="Active development">
        <p>
          ReineiraOS Code is in active development. The repo and Claude Code
          agents are being finalized for public release. The interfaces and
          deployment targets are stable — you can start building plugins today
          using the SDK and the interface definitions in these docs.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
