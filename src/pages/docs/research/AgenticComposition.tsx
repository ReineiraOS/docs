import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import DocsTable from "@/components/docs/DocsTable";
import DocsBadge from "@/components/docs/DocsBadge";
import PageNav from "@/components/docs/PageNav";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "scope", title: "Scope & status", level: 2 },
  { id: "handlers", title: "Agentic task handlers", level: 2 },
  { id: "registries", title: "Agent identity & quorum registries", level: 2 },
  { id: "interfaces", title: "Interfaces (RSS v0.2)", level: 2 },
];

const { prev, next } = getPrevNext("/research/agentic-composition");

const handlerColumns = [
  { header: "Handler", key: "handler", mono: true, width: "210px" },
  { header: "Intended role", key: "role" },
  { header: "Status", key: "status", width: "150px" },
];

const handlerRows = [
  {
    handler: "AgentCallHandler",
    role: "On-chain agent invocation. TASK_AGENT_CALL is reserved as a selector in TaskLib but has no registered handler.",
    status: <DocsBadge variant="amber">Spec'd · post-v1.0</DocsBadge>,
  },
  {
    handler: "VerdictSubmitHandler",
    role: "Off-chain quorum verdict submission.",
    status: <DocsBadge variant="amber">Spec'd · post-v1.0</DocsBadge>,
  },
  {
    handler: "PoolRoutingHandler",
    role: "IRecoursePool routing.",
    status: <DocsBadge variant="amber">Spec'd · post-v1.0</DocsBadge>,
  },
  {
    handler: "LZOFTHandler",
    role: "LayerZero OFT relay for USDT0. The LayerZero/USDT0 rail is not built — CCTP V2/USDC is the only live bridge rail; this second rail is research/roadmap.",
    status: <DocsBadge variant="amber">Spec'd · post-v1.0</DocsBadge>,
  },
];

const registryColumns = [
  { header: "Contract", key: "contract", mono: true, width: "240px" },
  { header: "Intended role", key: "role" },
];

const registryRows = [
  {
    contract: "AgentIdentityRegistry",
    role: "Agent identity attribution (ERC-8004).",
  },
  {
    contract: "QuorumRegistry",
    role: "Quorum membership and verdict aggregation.",
  },
  {
    contract: "RiskScoreAttestor",
    role: "Risk-input attestation (not on roadmap; risk-input is policy-internal).",
  },
  {
    contract: "AgentInvocationAdapter",
    role: "Adapter wiring agent jobs to the task surface.",
  },
  { contract: "EIP8183Adapter", role: "EIP-8183 adapter." },
  { contract: "ModelCallTicketRegistry", role: "Model-call ticketing." },
  { contract: "AgentConfigRegistry", role: "Per-agent configuration." },
];

export default function AgenticComposition() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Agentic Composition (Preview)"
        description="The deferred agentic / AI-execution layer — task handlers, agent and quorum registries, and the async/agentic interfaces. Isolated here because it is not part of v1.0."
        readingTime="5 min read"
      />

      <Callout variant="warning" title="Not part of v1.0 RSS conformance">
        <p>
          <DocsBadge variant="amber">Spec'd · post-v1.0</DocsBadge> The
          agentic-composition layer is{" "}
          <strong>out of scope for v1.0 RSS</strong> and deferred from the v1.0
          reference implementation. None of the registries below are shipped in
          any package, and the agentic layer is explicitly not part of v1.0 RSS
          conformance. This page documents the designed surface so you can track
          it — not because any of it is live.
        </p>
      </Callout>

      <h2
        id="scope"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Scope &amp; status
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS specifies an agentic / AI-execution composition layer above
        the protocol perimeter. None of the agentic task handlers ship in v1.0;
        CCTP settlement is a separate permissionless rail, not part of this
        handler surface. The agentic handlers and the agent/quorum registries
        are deferred.
      </p>

      <h2
        id="handlers"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Agentic task handlers
      </h2>
      <DocsTable columns={handlerColumns} rows={handlerRows} />

      <h2
        id="registries"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Agent identity &amp; quorum registries
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The specification calls for the following contracts;{" "}
        <strong>none are shipped</strong> — these agentic registries are
        deferred from v1.0 and not yet built. The agentic-composition layer
        stays deferred from v1.0 RSS until they ship.
      </p>
      <DocsTable columns={registryColumns} rows={registryRows} />

      <h2
        id="interfaces"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Interfaces (RSS v0.2)
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The agentic interfaces — <code>IAgenticJob</code> (neutral agent-job
        lifecycle) and <code>IExecution</code> (pure-transformation plugin) —
        become mandatory at <strong>RSS v0.2 (Q4 2026)</strong>, alongside the
        async resolver and underwriter variants. They are not part of the v0.1
        mandatory subset. See{" "}
        <a href="/settlement-standard/interface-surface">Interface Surface</a>.
      </p>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
