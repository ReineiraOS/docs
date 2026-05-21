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
  { id: "semver", title: "Semver release line", level: 2 },
  { id: "bumps", title: "Minor vs. major bumps", level: 2 },
  { id: "rip", title: "The RIP process", level: 2 },
];

const { prev, next } = getPrevNext("/settlement-standard/versioning");

const releaseColumns = [
  { header: "Version", key: "version", width: "120px" },
  { header: "Milestone", key: "milestone", width: "200px" },
  { header: "Status", key: "status", width: "140px" },
  { header: "Notes", key: "notes" },
];

const releaseRows = [
  {
    version: "v0.1",
    milestone: "testnet (June 2026)",
    status: <DocsBadge variant="green">Live</DocsBadge>,
    notes: "Mandatory core, plugin, and fee-module interface subset.",
  },
  {
    version: "v0.2",
    milestone: "chaos-net (Q4 2026)",
    status: <DocsBadge variant="amber">Spec'd</DocsBadge>,
    notes:
      "Adds async + agentic interfaces and the first five RIPs; bundles the formal conformance suite.",
  },
  {
    version: "v1.0",
    milestone: "TGE (Q3 / Q4 2027)",
    status: <DocsBadge variant="amber">Spec'd</DocsBadge>,
    notes:
      "Conformance suite extends to the async, agentic, and execution surfaces.",
  },
];

export default function RssVersioning() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Versioning & RIPs"
        description="RSS is semver-versioned per the manifest. Changes are admitted through the Reineira Improvement Proposal (RIP) process — the EIP analog."
        readingTime="4 min read"
      />

      <h2
        id="semver"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Semver release line
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        RSS is semver-versioned per the §0 manifest. (§5.3.)
      </p>
      <DocsTable columns={releaseColumns} rows={releaseRows} />

      <h2
        id="bumps"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Minor vs. major bumps
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong>Minor-version bumps</strong> are interface-compatible additions:
        new optional interfaces, new optional events, and new optional fields in
        tagged structs. <strong>Major-version bumps</strong> are breaking and
        require a coordinated reference-implementation upgrade or a{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          v(N).0
        </code>{" "}
        adapter contract that translates the deprecated surface. The RIP process
        governs the inclusion of any change in a versioned release.
      </p>

      <h2
        id="rip"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        The RIP process
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        A Reineira Improvement Proposal (RIP) is the EIP analog for the
        standard: a versioned proposal that governs whether a change is admitted
        to a release. The first five RIPs are slated to ship alongside RSS v0.2
        at chaos-net (Q4 2026), bundled with the formal conformance suite.
      </p>

      <Callout
        variant="warning"
        title="RIP governance details are not fully specified"
      >
        <p>
          <DocsBadge variant="amber">Spec'd</DocsBadge> The whitepaper commits
          to the RIP process as the change-admission mechanism and pins the
          first five RIPs to RSS v0.2, but the exact RIP authoring, review, and
          ratification governance is not enumerated in the v1.0 edition. We will
          document the concrete process when it is published; nothing here
          should be read as a finalised governance specification.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
