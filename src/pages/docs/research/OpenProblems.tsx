import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import DocsTable from "@/components/docs/DocsTable";
import DocsBadge from "@/components/docs/DocsBadge";
import PageNav from "@/components/docs/PageNav";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [{ id: "table", title: "Open Problems", level: 2 }];

const { prev, next } = getPrevNext("/research/open-problems");

const columns = [
  { header: "ID", key: "id", width: "90px" },
  { header: "Title", key: "title", width: "260px" },
  { header: "Decision target", key: "target" },
];

const rows = [
  {
    id: "2.1",
    title: "Account Abstraction",
    target: "post-chaos-net v1.0",
  },
  {
    id: "3.1",
    title: "Account-Abstraction Convergence",
    target: "prior to RSS v0.2 (Q4 2026)",
  },
  {
    id: "4.1",
    title: "CoFHE Decentralization",
    target: "pre-mainnet",
  },
  {
    id: "5.1",
    title: "Formal Conformance Suite Release",
    target: "RSS v0.2 (Q4 2026)",
  },
  {
    id: "6.1",
    title: "Batch-Redemption Fee-Order Atomicity",
    target: "chaos-net v1.0",
  },
  {
    id: "7.1",
    title: "FHE-priced dynamic-curve premium",
    target: "prior to chaos-net v1.0",
  },
  {
    id: "7.2",
    title: "Asynchronous judge return",
    target: "prior to chaos-net v1.0",
  },
  {
    id: "8.1",
    title: "Operator set growth trajectory",
    target: "tracked through chaos-net operations; no pre-deployment gate",
  },
  {
    id: "8.2",
    title: "Restaking integration",
    target:
      "open (deferred indefinitely; conditional on a future RSS revision)",
  },
  {
    id: "9.1",
    title: "OP-Stack host native bridge",
    target: "deferred to OP-Stack host activation milestone",
  },
];

export default function OpenProblems() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Open Problems"
        description="The protocol's open problems and their decision targets, none of which carries a committed delivery date."
        readingTime="4 min read"
      />

      <div className="mb-2">
        <DocsBadge variant="amber">Research</DocsBadge>
      </div>

      <Callout
        variant="info"
        title="These are the binding next-decision surface"
      >
        <p>
          These open problems are the binding next-decision surface for the v1.0
          edition. For shipped-vs-spec component status, see the{" "}
          <a href="/status">Status &amp; Roadmap</a> page.
        </p>
      </Callout>

      <h2
        id="table"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Open Problems
      </h2>
      <DocsTable columns={columns} rows={rows} />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
