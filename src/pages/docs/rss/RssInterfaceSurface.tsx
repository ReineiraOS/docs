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
  { id: "tiers", title: "Interface tiers", level: 2 },
  { id: "core", title: "Core (mandatory v0.1)", level: 2 },
  { id: "plugin", title: "Plugin extension points (v0.1)", level: 2 },
  { id: "async-agentic", title: "Async + agentic (mandatory v0.2)", level: 2 },
];

const { prev, next } = getPrevNext("/settlement-standard/interface-surface");

const v01 = <DocsBadge variant="green">Live · v0.1</DocsBadge>;
const v02 = <DocsBadge variant="amber">Spec'd · v0.2</DocsBadge>;

const tierColumns = [
  { header: "Interface", key: "iface", mono: true, width: "240px" },
  { header: "Status", key: "status", width: "130px" },
  { header: "Responsibility", key: "resp" },
];

const coreRows = [
  { iface: "ICore", status: v01, resp: "Base events surface." },
  {
    iface: "IEscrow / IConfidentialEscrow",
    status: v01,
    resp: "Escrow lifecycle — create, fund, redeem, query. Encrypted variant substitutes eaddress/euint64 with the same function names and ordering.",
  },
  {
    iface: "IEscrowEvents",
    status: v01,
    resp: "Canonical event surface for cross-implementation indexers.",
  },
  {
    iface: "IFeeModule / IProtocolFeeModule",
    status: v01,
    resp: "Stamp-time fee modules (create / condition-set / coverage-purchase) — never on the redeem hot path. bps governance-settable within an immutable bytecode ceiling (MAX_PROTOCOL_FEE_BPS = 50).",
  },
];

const pluginRows = [
  {
    iface: "IConditionResolver",
    status: v01,
    resp: "Pluggable release gates. isConditionMet (view), onConditionSet (binds per-escrow config), getConditionFee (view). Inherits ERC-165.",
  },
  {
    iface: "IUnderwriterPolicy",
    status: v01,
    resp: "Plaintext coverage pricing + dispute: evaluateRisk, judge.",
  },
  {
    iface: "IConfidentialUnderwriterPolicy",
    status: v01,
    resp: "FHE variant: onPolicySet, evaluateRisk (encrypted score), judge (encrypted verdict).",
  },
];

const asyncRows = [
  {
    iface: "IAsyncConditionResolver",
    status: v02,
    resp: "Extends IConditionResolver with Unresolved → Pending → Resolved | Rejected for gates whose verdict requires off-chain work. Release blocks on Resolved.",
  },
  {
    iface: "IAsyncUnderwriterPolicy",
    status: v02,
    resp: "Pending-state dispute judgment via requestJudge / verdict.",
  },
  {
    iface: "IAgenticJob",
    status: v02,
    resp: "Neutral agent-job lifecycle (Open → Accepted → Submitted → Evaluated → Settled → Refunded) implemented by adapters.",
  },
  {
    iface: "IExecution",
    status: v02,
    resp: "Pure-transformation / attested-execution plugin: executionType, execute.",
  },
];

export default function RssInterfaceSurface() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Interface Surface"
        description="The four-primitive interface surface. Three tiers are mandatory at RSS v0.1; the async + agentic tier becomes mandatory at v0.2."
        readingTime="6 min read"
      />

      <Callout variant="info" title="A standard may specify ahead of code">
        <p>
          The v0.1 mandatory subset is shipped to disk. The async and agentic
          interfaces below are specified in the technical reference and become
          mandatory at <strong>RSS v0.2 (Q4 2026)</strong> — they are{" "}
          <strong>Spec'd</strong>, not yet shipped. Conformance clauses
          §5.4(a)–(f) bind only over the v0.1 mandatory subset until then. (§5.5
          Implementation Note.)
        </p>
      </Callout>

      <h2
        id="tiers"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Interface tiers
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Fig. 5.1 groups the interfaces by responsibility tier. Core lifecycle,
        plugin extension points, and the protocol-fee module are mandatory at
        v0.1; async resolution semantics and the agentic-composition layer
        arrive at v0.2.
      </p>

      <h2
        id="core"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Core (mandatory v0.1)
      </h2>
      <DocsTable columns={tierColumns} rows={coreRows} />

      <h2
        id="plugin"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Plugin extension points (mandatory v0.1)
      </h2>
      <DocsTable columns={tierColumns} rows={pluginRows} />

      <h2
        id="async-agentic"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Async + agentic (mandatory v0.2)
      </h2>
      <DocsTable columns={tierColumns} rows={asyncRows} />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
