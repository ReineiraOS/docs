import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import DocsTable from "@/components/docs/DocsTable";
import PageNav from "@/components/docs/PageNav";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "split", title: "Standard vs. reference code", level: 2 },
  { id: "layers", title: "License by layer", level: 2 },
  { id: "change-date", title: "Change Date", level: 2 },
];

const { prev, next } = getPrevNext("/settlement-standard/licensing");

const layerColumns = [
  { header: "Layer", key: "layer", width: "300px" },
  { header: "License", key: "now", width: "140px" },
  { header: "After 2029-06-01", key: "after" },
];

const layerRows = [
  {
    layer: "Interfaces, libraries, base contracts",
    now: "Apache 2.0",
    after: "Apache 2.0",
  },
  { layer: "SDK, plugin templates, cofhejs glue", now: "MIT", after: "MIT" },
  { layer: "Token wrappers (cUSDC, cUSDT)", now: "MIT", after: "MIT" },
  {
    layer: "Relayer coordinator (lightweight burn-notification inbox)",
    now: "Apache 2.0",
    after: "Apache 2.0",
  },
  {
    layer: "Core protocol (Escrow, Recourse)",
    now: "BUSL-1.1",
    after: "Apache 2.0",
  },
];

export default function RssLicensing() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Licensing"
        description="The standard is open and free to implement; only the reference implementation's core has a time-limited license that converts to Apache 2.0."
        readingTime="3 min read"
      />

      <h2
        id="split"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Standard vs. reference code
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        RSS is built to be implemented by third parties — that is the point of
        publishing a standard separate from any one deployment. The standard
        itself (the interfaces, the conformance criteria, the RIP process) is
        OSI-aligned and unencumbered, so you can build your own conformant venue
        from your own contracts without a commercial license.
      </p>
      <Callout variant="info" title="Two layers, two licenses">
        <p>
          The <strong>standard</strong> is free to implement against. The{" "}
          <strong>reference implementation's core</strong> (Escrow, Recourse) is
          licensed under BUSL-1.1 and converts to Apache 2.0 on the irrevocable
          Change Date <strong>2029-06-01</strong>.
        </p>
      </Callout>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        To build a conformant deployment, follow the{" "}
        <a href="/settlement-standard/conformance">conformance criteria</a> and
        implement the{" "}
        <a href="/settlement-standard/interface-surface">interface surface</a> —
        neither is gated by the core's license.
      </p>

      <h2
        id="layers"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        License by layer
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Builder-facing layers are permissive from day one; only the defensive
        core carries the time-limited term.
      </p>
      <DocsTable columns={layerColumns} rows={layerRows} />

      <h2
        id="change-date"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Change Date
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        BUSL-1.1 allows copying, modification, and non-production use today —
        only production use of the core needs a commercial license until the
        Change Date. On <strong>2029-06-01</strong> the core converts to Apache
        2.0 automatically. The date is pre-announced and can only move earlier
        (if an acceleration trigger fires), never later.
      </p>

      <Callout variant="tip" title="Where to start">
        <p>
          Compile against the published interfaces in{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            @reineira-os/shared
          </code>{" "}
          and start from the{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            plugin-examples/
          </code>{" "}
          workspace. Questions:{" "}
          <a href="mailto:engineering@reineira.xyz">engineering@reineira.xyz</a>
          .
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
