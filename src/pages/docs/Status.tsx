import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import DocsTable from "@/components/docs/DocsTable";
import PageNav from "@/components/docs/PageNav";
import StatusBadge from "@/components/docs/StatusBadge";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "taxonomy", title: "Status taxonomy", level: 2 },
  { id: "components", title: "Protocol components", level: 2 },
  { id: "spec-deltas", title: "Spec-vs-code deltas", level: 2 },
  { id: "open-problems", title: "Open Problems (Research)", level: 2 },
];

const { prev, next } = getPrevNext("/status");

const taxonomyColumns = [
  { header: "Status", key: "status", width: "130px" },
  { header: "Meaning", key: "meaning" },
];

const taxonomyRows = [
  {
    status: <StatusBadge status="live" />,
    meaning: "Shipped and operating in production.",
  },
  {
    status: <StatusBadge status="chaos-net" />,
    meaning:
      "Ships at the chaos-net milestone (July 2026). Unaudited; runs in public mode.",
  },
  {
    status: <StatusBadge status="spec" />,
    meaning:
      "Designed and specified, not yet shipped in the reference implementation — build against the interface.",
  },
  {
    status: <StatusBadge status="research" />,
    meaning: "Exploratory, no committed delivery date.",
  },
];

// Component status table.
const componentColumns = [
  { header: "Component", key: "component", width: "240px" },
  { header: "Status", key: "status", width: "150px" },
  { header: "Notes", key: "notes" },
];

const componentRows = [
  {
    component: "Confidential Escrow",
    status: <StatusBadge status="chaos-net" />,
    notes:
      "Runs in public mode at chaos-net (July 2026); encrypted state activates at v1.0 mainnet.",
  },
  {
    component: "Pluggable release gates (IConditionResolver)",
    status: <StatusBadge status="chaos-net" />,
    notes:
      "Core interface ships; reference resolvers are spec'd separately below.",
  },
  {
    component: "Encrypted-state Insurance",
    status: <StatusBadge status="chaos-net" />,
    notes: "Coverage manager + IUnderwriterPolicy. Public mode at chaos-net.",
  },
  {
    component: "Operator set (OperatorRegistry, TaskExecutor)",
    status: <StatusBadge status="chaos-net" />,
    notes: "Permissionless registration from Day 1; cUSDC bond.",
  },
  {
    component: "FeeManager (zero-fee posture)",
    status: <StatusBadge status="chaos-net" />,
    notes:
      "Zero fees through chaos-net, block-locked by MAINNET_ACTIVATION_BLOCK — no governance toggle.",
  },
  {
    component: "OperatorSubsidyManager",
    status: <StatusBadge status="chaos-net" />,
    notes:
      "Active during the chaos-net window only — Foundation-funded cUSDC subsidies; inert after mainnet activation.",
  },
  {
    component: "OperatorSlashingManager",
    status: <StatusBadge status="chaos-net" />,
    notes:
      "Single stake-weighted quorum across the active set (see CoordinatorRegistry below).",
  },
  {
    component: "CCTPHandler (Circle CCTP V2 relay)",
    status: <StatusBadge status="chaos-net" />,
    notes: "Cross-chain USDC settlement task handler.",
  },
  {
    component: "LayerZero OFT Handlers (USDT0 rail)",
    status: <StatusBadge status="chaos-net" />,
    notes: "Shipped at v1.0 alongside CCTP V2, for non-U.S./non-EU users.",
  },
  {
    component: "Encrypted mode (Fhenix CoFHE)",
    status: <StatusBadge status="spec" detail="v1.0 mainnet" />,
    notes:
      "Encrypted state does not exist on-chain until v1.0 mainnet (Q4 2026 hardening); a separate immutable deployment, gated on CoFHE.",
  },
  {
    component: "Virtual Escrow surface",
    status: <StatusBadge status="spec" detail="chaos-net v1.0" />,
    notes: "Specified, not yet shipped.",
  },
  {
    component: "QuorumAttestedPolicy (async underwriter base)",
    status: <StatusBadge status="spec" detail="chaos-net v1.0" />,
    notes: "Specified, not yet shipped.",
  },
  {
    component: "PoolFactory v1.0 (full routing / unstake)",
    status: <StatusBadge status="spec" detail="chaos-net v1.0" />,
    notes: "Specified, not yet shipped.",
  },
  {
    component: "CoordinatorRegistry (cross-graph slashing)",
    status: <StatusBadge status="spec" detail="v1.0-track" />,
    notes:
      "Shipped slashing uses a single quorum; coordinator-partitioned slashing is not yet shipped.",
  },
  {
    component:
      "Reference resolvers (zkTLS / oracle / prediction-market / multisig)",
    status: <StatusBadge status="spec" />,
    notes: "Ship in the plugin-examples package; specified, not yet shipped.",
  },
  {
    component: "Plugin surface (async variants, IAgenticJob, IExecution)",
    status: <StatusBadge status="spec" detail="RSS v0.2" />,
    notes: "Standard specifies ahead of code; lands at RSS v0.2 (Q4 2026).",
  },
  {
    component: "Three-entity stack (Entity Stack)",
    status: <StatusBadge status="spec" detail="Phase 2" />,
    notes:
      "Single entity today; full three-entity stack at Phase 2 (Q1–Q2 2027).",
  },
  {
    component: "Agentic handlers (AgentCall / VerdictSubmit / PoolRouting)",
    status: <StatusBadge status="spec" detail="post-v1.0" />,
    notes:
      "Out of scope for v1.0 — only CCTPHandler ships. TASK_AGENT_CALL reserved, no handler.",
  },
  {
    component: "Agent identity / quorum registries",
    status: <StatusBadge status="research" />,
    notes:
      "Deferred from v1.0 — AgentIdentityRegistry, QuorumRegistry, etc.; none shipped.",
  },
  {
    component: "RiskScoreAttestor / @reineira-os/identity",
    status: <StatusBadge status="research" />,
    notes: "Not on the roadmap; risk-input is policy-internal.",
  },
];

// Open Problems.
const openColumns = [
  { header: "Open Problem", key: "id", width: "230px" },
  { header: "Status", key: "status", width: "130px" },
  { header: "Decision target", key: "target" },
];

const openRows = [
  {
    id: "2.1 / 3.1 Account Abstraction",
    status: <StatusBadge status="research" />,
    target: "post-chaos-net v1.0 / prior to RSS v0.2 (Q4 2026)",
  },
  {
    id: "4.1 CoFHE Decentralization",
    status: <StatusBadge status="research" />,
    target: "pre-mainnet",
  },
  {
    id: "5.1 Formal Conformance Suite",
    status: <StatusBadge status="research" />,
    target: "RSS v0.2 (Q4 2026)",
  },
  {
    id: "6.1 Batch-Redemption Fee-Order Atomicity",
    status: <StatusBadge status="research" />,
    target: "chaos-net v1.0",
  },
  {
    id: "7.1 / 7.2 FHE-priced premium / async judge",
    status: <StatusBadge status="research" />,
    target: "prior to chaos-net v1.0",
  },
  {
    id: "8.1 Operator set growth trajectory",
    status: <StatusBadge status="research" />,
    target: "tracked through chaos-net; no pre-deployment gate",
  },
  {
    id: "8.2 Restaking integration",
    status: <StatusBadge status="research" />,
    target: "deferred indefinitely; conditional on a future RSS revision",
  },
  {
    id: "9.1 / 9.2 Token bridge / OP-Stack native bridge",
    status: <StatusBadge status="research" />,
    target: "conditional on TGE / host activation milestones",
  },
  {
    id: "10.1 / 13.1 Compliance certification roadmap",
    status: <StatusBadge status="research" />,
    target: "post-mainnet activation",
  },
  {
    id: "11.1 FATF Travel Rule applicability",
    status: <StatusBadge status="research" />,
    target: "pre-mainnet activation",
  },
  {
    id: "11.2 DevCo → Foundation transition",
    status: <StatusBadge status="research" />,
    target: "prior to Phase 2 (Q1–Q2 2027)",
  },
  {
    id: "12.1 / 12.2 REINEIRA token decimals / TGE trigger calibration",
    status: <StatusBadge status="research" />,
    target: "prior to any TGE event",
  },
];

export default function Status() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Status & Roadmap"
        description="An honest, component-by-component view of what ships when. Built from the protocol's implementation notes and open problems."
        readingTime="6 min read"
      />

      <Callout variant="warning" title="Chaos-net runs public mode, unaudited">
        <p>
          The chaos-net deployment runs the protocol in{" "}
          <strong>public mode</strong> — encrypted state does not exist on-chain
          until encrypted mode unlocks at v1.0 mainnet hardening (Q4 2026, gated
          on Fhenix CoFHE). Chaos-net is <strong>unaudited</strong>; see the{" "}
          <a href="/risk">Risk &amp; Audit Status</a> page.
        </p>
      </Callout>

      <h2
        id="taxonomy"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Status taxonomy
      </h2>
      <DocsTable columns={taxonomyColumns} rows={taxonomyRows} />

      <h2
        id="components"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Protocol components
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Every protocol surface, its honest status, and the milestone it targets.
        Components marked <strong>Spec'd</strong> are described by the v1.0 RSS
        specification but are not yet shipped in the reference implementation.
      </p>
      <DocsTable columns={componentColumns} rows={componentRows} />

      <h2
        id="spec-deltas"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Spec-vs-code deltas
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        These are the surfaces where the v1.0 RSS specification describes
        something that is not yet shipped in the reference implementation. They
        are the binding next-decision items for the v1.0 edition and appear
        inline in the component table above with a <StatusBadge status="spec" />{" "}
        badge.
      </p>

      <h2
        id="open-problems"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Open Problems (Research)
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Every numbered open problem we're still deciding on, with its decision
        target. None carries a committed delivery date.
      </p>
      <DocsTable columns={openColumns} rows={openRows} />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
