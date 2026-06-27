import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import CodeBlock from "@/components/docs/CodeBlock";
import DocsTable from "@/components/docs/DocsTable";
import PageNav from "@/components/docs/PageNav";
import LinkCard from "@/components/docs/LinkCard";
import { Code2, BookOpen } from "lucide-react";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "endpoint", title: "Endpoint", level: 2 },
  { id: "setup", title: "Setup", level: 2 },
  { id: "claude-code", title: "Claude Code", level: 3 },
  { id: "claude-desktop", title: "Claude Desktop", level: 3 },
  { id: "cursor", title: "Cursor / other clients", level: 3 },
  { id: "tools", title: "Available tools", level: 2 },
  { id: "examples", title: "What you can ask", level: 2 },
  { id: "combining", title: "Combining with ReineiraOS Code", level: 2 },
];

const { prev, next } = getPrevNext("/reference/mcp-server");

const toolColumns = [
  { header: "Tool", key: "tool", mono: true, width: "200px" },
  { header: "Description", key: "desc" },
];

const toolRows = [
  {
    tool: "get_docs",
    desc: "Browse documentation by section and topic. Sections: overview, guides, protocol, reference, whitepaper, litepaper.",
  },
  {
    tool: "search_docs",
    desc: "Full-text keyword search across all documentation with context snippets.",
  },
  {
    tool: "get_contracts",
    desc: "Deployed contract addresses on Arbitrum Sepolia, filterable by category (Escrow, Recourse, etc.).",
  },
  {
    tool: "get_interfaces",
    desc: "Solidity source code for plugin interfaces — IConditionResolver and IUnderwriterPolicy.",
  },
  {
    tool: "get_platform_version",
    desc: "Platform version, compiler settings, chain info, and dependency versions.",
  },
];

export default function McpServer() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="MCP Documentation Server"
        description="Give AI assistants direct access to protocol documentation, deployed contracts, and plugin interfaces via the Model Context Protocol."
        readingTime="3 min read"
      />

      {/* ── Endpoint ─────────────────────────────────────────────────── */}
      <h2
        id="endpoint"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Endpoint
      </h2>

      <CodeBlock
        filename="MCP endpoint"
        language="bash"
        showLineNumbers={false}
        lines={[
          {
            content:
              "https://zyx576c546w4m4ag7nzhf467du0wixjg.lambda-url.us-east-2.on.aws/",
          },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Transport:{" "}
        <strong className="text-docs-text-primary font-semibold">
          HTTP Streamable
        </strong>{" "}
        (SSE). No authentication required.
      </p>

      {/* ── Setup ────────────────────────────────────────────────────── */}
      <h2
        id="setup"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Setup
      </h2>

      <h3
        id="claude-code"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Claude Code
      </h3>

      <CodeBlock
        filename="terminal"
        language="bash"
        showLineNumbers={false}
        lines={[
          { content: "claude mcp add reineira-docs --transport http \\" },
          {
            content:
              "  https://zyx576c546w4m4ag7nzhf467du0wixjg.lambda-url.us-east-2.on.aws/",
          },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Restart Claude Code after adding. Five tools become available
        automatically.
      </p>

      <h3
        id="claude-desktop"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Claude Desktop
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Add to your{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          claude_desktop_config.json
        </code>
        :
      </p>

      <CodeBlock
        filename="claude_desktop_config.json"
        language="typescript"
        showLineNumbers={false}
        lines={[
          { content: "{" },
          { content: '  "mcpServers": {' },
          { content: '    "reineira-docs": {' },
          { content: '      "type": "url",' },
          {
            content:
              '      "url": "https://zyx576c546w4m4ag7nzhf467du0wixjg.lambda-url.us-east-2.on.aws/"',
          },
          { content: "    }" },
          { content: "  }" },
          { content: "}" },
        ]}
      />

      <h3
        id="cursor"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Cursor / other MCP clients
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Use the HTTP Streamable transport with the endpoint URL above. Refer to
        your client's MCP configuration documentation.
      </p>

      {/* ── Available tools ──────────────────────────────────────────── */}
      <h2
        id="tools"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Available tools
      </h2>

      <DocsTable columns={toolColumns} rows={toolRows} />

      {/* ── What you can ask ─────────────────────────────────────────── */}
      <h2
        id="examples"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        What you can ask
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Once connected, ask your AI assistant questions like:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>"Show me the deployed escrow contract addresses"</li>
        <li>"How do I build a condition resolver plugin?"</li>
        <li>"Search the docs for CCTP cross-chain settlement"</li>
        <li>"Show me the IUnderwriterPolicy interface"</li>
        <li>"What Solidity version does ReineiraOS use?"</li>
        <li>"How do I create a recourse pool?"</li>
      </ul>

      <Callout variant="info" title="Source of truth">
        <p>
          The MCP server returns structured data directly from the protocol
          source — the same documentation, interfaces, and addresses used by the
          core team.
        </p>
      </Callout>

      {/* ── Combining with ReineiraOS Code ───────────────────────────── */}
      <h2
        id="combining"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Combining with ReineiraOS Code
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        For the best development experience, use the MCP server alongside{" "}
        <a
          href="/get-started/reineira-code"
          className="text-brand-primary font-medium hover:underline"
        >
          ReineiraOS Code
        </a>
        :
      </p>

      <ol className="space-y-3 text-docs-text-secondary leading-relaxed list-decimal list-inside mb-6">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            ReineiraOS Code
          </strong>{" "}
          gives Claude Code project-level context (scaffolds, test harness,
          deployment scripts)
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            MCP Server
          </strong>{" "}
          gives Claude Code protocol-level context (docs, addresses, interfaces)
        </li>
      </ol>

      <Callout variant="tip" title="Full-stack AI development">
        <p>
          Together, Claude Code can generate complete plugin implementations
          with correct imports, addresses, and patterns — from a single natural
          language description.
        </p>
      </Callout>

      <LinkCard
        items={[
          {
            title: "ReineiraOS Code",
            description:
              "AI-assisted development environment for building plugins.",
            href: "/get-started/reineira-code",
            icon: Code2,
          },
          {
            title: "Contracts Reference",
            description: "Deployed contract addresses and ABIs.",
            href: "/reference/contracts",
            icon: BookOpen,
          },
        ]}
      />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
