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
  { id: "model", title: "The self-deployment model", level: 2 },
  { id: "maintenance", title: "L3-owner maintenance", level: 2 },
  { id: "liquidity", title: "Liquidity from the operator set", level: 2 },
  { id: "hosts", title: "Host inventory", level: 2 },
];

const { prev, next } = getPrevNext("/build/atlas-l3");

const hostColumns = [
  { header: "Host", key: "host", width: "210px" },
  { header: "Role", key: "role" },
  { header: "Status", key: "status", width: "130px" },
];

const hostRows = [
  {
    host: "Arbitrum L2",
    role: "Canonical host — chaos-net Jul 2026, v1.0 mainnet Q4 2026.",
    status: <DocsBadge variant="green">Live (canonical)</DocsBadge>,
  },
  {
    host: "Ethereum L1",
    role: "Planned host — institutional + L1-finality use cases.",
    status: <DocsBadge variant="amber">Planned</DocsBadge>,
  },
  {
    host: "OP-Stack chain (TBD)",
    role: "Long-term host — vendor TBD per OP ecosystem maturity.",
    status: <DocsBadge variant="default">Roadmap</DocsBadge>,
  },
  {
    host: "Third-party L3 (self-deployed via Atlas)",
    role: "L3 owner deploys and maintains; the network supplies liquidity via operators.",
    status: <DocsBadge variant="amber">Spec'd · Open</DocsBadge>,
  },
];

export default function L3Deployments() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Atlas-Deployed L3s"
        description="Third parties self-deploy ReineiraOS on their own L3 via Reineira Atlas. The L3 owner maintains it; the canonical operator set supplies cross-chain liquidity."
        readingTime="5 min read"
      />

      <div className="mb-2">
        <DocsBadge variant="amber">Spec'd</DocsBadge>
      </div>

      <Callout
        variant="warning"
        title="Self-deployment is a specified model, not a live product"
      >
        <p>
          The Atlas-deployed L3 model is specified and <strong>open</strong> —
          not gated on external protocol maturity — but it is not a shipped,
          turnkey product on v1.0. The Atlas deployment skills and the L3-owner
          maintenance posture are described here as designed; treat dates and
          tooling as roadmap, not availability.
        </p>
      </Callout>

      <h2
        id="model"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        The self-deployment model
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Third-party rollups — including Arbitrum Orbit L3s settling to Arbitrum
        One, and (when supported) OP-Stack L3s — extend ReineiraOS coverage by{" "}
        <strong>self-deploying</strong> the protocol via Reineira Atlas. The L3
        owner uses the{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          /bootstrap
        </code>{" "}
        and protocol-deployment skills in Atlas to scaffold an RSS-conformant
        deployment on their chain. Because ReineiraOS is published as a public
        standard with a working reference implementation, any rollup that wants
        the four primitives can run them on its own chain{" "}
        <strong>without entering a commercial relationship</strong> with
        Reineira Labs.
      </p>

      <h2
        id="maintenance"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        L3-owner maintenance
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The L3 owner maintains the deployment on their own cadence —{" "}
        <strong>
          upgrades, audits, fee-parameter changes, and operator-set governance
          all sit with the L3 owner
        </strong>
        . Reineira Labs does not operate or upgrade those deployments. This
        L3-owner maintenance posture is what makes self-deployment scalable.
      </p>

      <h2
        id="liquidity"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Liquidity from the operator set
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        What the L3 <em>does</em> require from the ReineiraOS network is{" "}
        <strong>liquidity</strong> — supplied by the canonical operator set.
        Operators registered on Arbitrum L2 route cross-chain funding into
        L3-deployed escrows over the <strong>native rollup bridge</strong> of
        the parent chain (the Arbitrum L2→L3 bridge for an Orbit L3; the
        corresponding native bridge for an OP-Stack L3). The operator set is a
        single pool spanning all hosts, and the per-handler fee model settles
        fees on whichever host receives the bridge sink.
      </p>
      <Callout variant="info" title="No per-L3 bridge handlers">
        <p>
          Self-deployed L3s do <strong>not</strong> ship their own CCTP V2 or
          LayerZero OFT handlers — those bridge transports operate at the L1/L2
          layer, not L3. The native rollup bridge is the only required
          transport.
        </p>
      </Callout>

      <h2
        id="hosts"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Host inventory
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The protocol is not migrated off Arbitrum L2 — additional hosts run in
        parallel.
      </p>
      <DocsTable columns={hostColumns} rows={hostRows} />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
