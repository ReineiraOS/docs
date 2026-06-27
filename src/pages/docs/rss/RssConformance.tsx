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
  { id: "criteria", title: "Conformance criteria", level: 2 },
  { id: "definition", title: "Definition", level: 2 },
  { id: "test-surface", title: "Conformance test surface", level: 2 },
];

const { prev, next } = getPrevNext("/settlement-standard/conformance");

const criteriaColumns = [
  { header: "Clause", key: "clause", width: "190px" },
  { header: "Requirement", key: "req" },
];

const criteriaRows = [
  {
    clause: "(a) Interface coverage",
    req: "Implements every interface declared mandatory for the deployment's mode (public or encrypted), per the canonical surface.",
  },
  {
    clause: "(b) Encrypted state",
    req: "In encrypted mode, stores owner, payment amount, paid-amount accumulator, and condition-derived intermediates as encrypted types; in public mode, runs the same contracts with plaintext types — preserving the same interface shape so plugins stay binary-compatible across modes.",
  },
  {
    clause: "(c) Silent-failure pattern",
    req: "Every redemption path that evaluates an encrypted condition produces success and failure transcripts that are computationally indistinguishable to an adversary without decryption authority.",
  },
  {
    clause: "(d) Namespaced storage",
    req: "ERC-7201 namespaced storage, inherits the protocol base contract, carries a uint256[50] private __gap reserve. Upgradeable deployments additionally follow UUPS (EIP-1822/1967); the v1.0 reference implementation is immutable.",
  },
  {
    clause: "(e) Meta-transactions",
    req: "Sponsored user paths route through an ERC-2771 trusted forwarder so msg.sender is recovered from the forwarder context — gasless flows without compromising authorisation.",
  },
  {
    clause: "(f) Canonical events",
    req: "Emits the events declared in ICore and IEscrowEvents (and the recourse event set) so cross-implementation indexers and oracles can observe state without implementation-specific schemas.",
  },
];

export default function RssConformance() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Conformance"
        description="A deployment is RSS-conformant if it satisfies all six conformance clauses and passes the conformance test suite at the RSS version it claims."
        readingTime="5 min read"
      />

      <h2
        id="criteria"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Conformance criteria
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The test suite is necessary for conformance, but the criteria below are
        the authoritative definition. All six clauses must hold.
      </p>
      <DocsTable columns={criteriaColumns} rows={criteriaRows} />

      <h2
        id="definition"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Definition: a conformant implementation
      </h2>
      <blockquote className="border-l-4 border-docs-border-strong pl-4 my-6 text-docs-text-secondary leading-relaxed italic">
        <p>
          A deployment that satisfies the conformance criteria and passes the
          conformance test suite at the RSS version it claims to implement.
        </p>
      </blockquote>

      <h2
        id="test-surface"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Conformance test surface
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The RSS publication ships the conformance test suite under{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          packages/&lt;pkg&gt;/test/
        </code>
        . The current Foundry surface counts roughly 36 unit-test contracts
        across escrow, recourse, and tokens — FHE and plaintext unit tests,
        integration tests, and invariant tests. The RSS v0.1 conformance suite
        freezes a binding subset of these. The intent is platform-agnostic: the
        suite should run against any conforming deployment by pointing Foundry
        at its deployed addresses.
      </p>

      <Callout
        variant="warning"
        title="The exact binding subset is not yet frozen"
      >
        <p>
          <DocsBadge variant="amber">Research</DocsBadge> Which test files make
          up the binding RSS v0.1 conformance suite is still an open question as
          of v1.0 publication. The decision target is{" "}
          <strong>RSS v0.2 (Q4 2026)</strong>, bundled with the first RIPs.
          Until then, conformance clauses bind only over the v0.1 mandatory
          subset.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
