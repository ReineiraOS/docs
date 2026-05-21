import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import DocsTable from "@/components/docs/DocsTable";
import PageNav from "@/components/docs/PageNav";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "invitation", title: "An explicit invitation", level: 2 },
  { id: "license-split", title: "The license split", level: 2 },
  { id: "layer-vector", title: "Layer-asymmetric license vector", level: 2 },
  { id: "change-date", title: "Change Date & acceleration", level: 2 },
];

const { prev, next } = getPrevNext("/settlement-standard/implement-rss");

const layerColumns = [
  { header: "Layer", key: "layer", width: "260px" },
  { header: "License at publication", key: "now", width: "180px" },
  { header: "After 2029-06-01", key: "after" },
];

const layerRows = [
  {
    layer: "Core protocol (escrow, insurance, orchestration on-chain core)",
    now: "BUSL-1.1",
    after: "Apache License 2.0",
  },
  {
    layer: "Shared interfaces, libraries, base contracts",
    now: "Apache License 2.0",
    after: "Apache License 2.0",
  },
  {
    layer: "Confidential token wrappers (cUSDC, cUSDT)",
    now: "MIT",
    after: "MIT",
  },
  {
    layer: "SDK, integration libraries, plugin templates, cofhejs glue",
    now: "MIT",
    after: "MIT",
  },
  {
    layer: "Operator services (off-chain orchestrator, coordinator, CLI)",
    now: "Apache License 2.0",
    after: "Apache License 2.0",
  },
  {
    layer: "Documentation (whitepaper, lightpaper, architecture specs)",
    now: "CC-BY-4.0",
    after: "CC-BY-4.0",
  },
];

export default function RssImplement() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Implement RSS Yourself"
        description="You can build your own RSS-conformant settlement venue. The standard is OSI-aligned and free to implement; only the reference implementation's defensive core carries BUSL-1.1."
        readingTime="5 min read"
      />

      <h2
        id="invitation"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        An explicit invitation
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        RSS is designed to be implemented by third parties. Any deployment that
        satisfies the{" "}
        <a href="/settlement-standard/conformance">conformance criteria</a> and
        passes the test suite can host the same plugins, accept the same bridge
        handlers, be observed by the same indexers and slashing oracles, and
        present the same SDK surface — independently of who maintains its
        contracts (§5.9). Builder-facing layers are permissively licensed at
        publication specifically so any third party can implement an
        RSS-conformant venue without a commercial license.
      </p>

      <h2
        id="license-split"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        The license split
      </h2>
      <Callout
        variant="info"
        title="Standard: free. Reference implementation core: BUSL-1.1."
      >
        <p>
          The <strong>RSS specification</strong> — the interfaces, the
          conformance criteria, the RIP process — is published under an
          OSI-aligned licence and is unencumbered for any party to implement
          against. The{" "}
          <strong>reference implementation's defensive core</strong> (escrow,
          insurance, orchestration) carries BUSL-1.1 during the contestability
          window and converts to Apache License 2.0 on the irrevocable Change
          Date <strong>2029-06-01</strong>. (§13.1, §13.2, §5.9.)
        </p>
      </Callout>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        BUSL-1.1 permits copy, modify, derivative works, redistribution, and
        non-production use — academic review, audit, security research, and
        non-production integration require no commercial license. It restricts{" "}
        <strong>production use</strong> of the core during the BUSL window; the
        Additional Use Grant is "None", so production deployment of the core
        requires a commercial license from the Licensor until the Change Date.
        This is framed as a contestability-window defense against hard-fork
        attacks, not a long-run posture. (§13.3.)
      </p>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Building your own conforming implementation against your own contract
        code, against the OSI-aligned standard, is unaffected by the core's BUSL
        term.
      </p>

      <h2
        id="layer-vector"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Layer-asymmetric license vector
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Different reference-implementation layers carry different licenses at
        publication (§13.2):
      </p>
      <DocsTable columns={layerColumns} rows={layerRows} />

      <h2
        id="change-date"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Change Date &amp; acceleration
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The Change Date <strong>2029-06-01</strong> is irrevocable and
        pre-announced. On that date the BUSL-licensed corpus converts to Apache
        License 2.0 by operation of the Change License clause, without further
        act of the Licensor. Five pre-announced triggers (§13.5) can each{" "}
        <strong>accelerate</strong> conversion — a GMV/operator-set/no-fork
        threshold, CoFHE access non-exclusivity, rolling per-release
        auto-relicense (18 months + 2 audits), OpenR-class fork dissolution, and
        a supermajority override — but none can delay it. Pre-announcement
        forecloses any later mid-life license tightening.
      </p>

      <Callout variant="tip" title="Where the code lives">
        <p>
          Plugin authors compile against the published interfaces in{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            @reineira-os/shared
          </code>{" "}
          and deploy independently. The{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            plugin-examples/
          </code>{" "}
          workspace ships a reference template. Questions:{" "}
          <a href="mailto:engineering@reineira.xyz">engineering@reineira.xyz</a>
          .
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
