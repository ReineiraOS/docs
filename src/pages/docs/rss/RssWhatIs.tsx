import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import DocsBadge from "@/components/docs/DocsBadge";
import PageNav from "@/components/docs/PageNav";
import LinkCard from "@/components/docs/LinkCard";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";
import { CheckCircle2, GitFork, FileCode2 } from "lucide-react";

const toc: TocItem[] = [
  { id: "definition", title: "Standard vs. implementation", level: 2 },
  { id: "scope", title: "What RSS covers", level: 2 },
  { id: "standards-fork", title: "The standards-fork commitment", level: 2 },
  { id: "next", title: "Next", level: 2 },
];

const { prev, next } = getPrevNext("/settlement-standard/what-is-rss");

export default function RssWhatIs() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="What is RSS"
        description="The Reineira Settlement Standard is the abstract conformance specification for confidential settlement — published as a layer separate from any one deployment."
        readingTime="5 min read"
      />

      <div className="mb-2">
        <DocsBadge variant="green">Standard · OSI-aligned licence</DocsBadge>
      </div>

      <h2
        id="definition"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Standard vs. implementation
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The Reineira Settlement Standard (RSS) is the abstract conformance
        specification for confidential settlement on the four primitives —
        escrow, gate, insurance, operator. The contracts under{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          packages/
        </code>{" "}
        are <strong>one reference implementation</strong>, maintained by
        Reineira Labs Limited (RAK DAO Free Zone). Other parties may publish
        conforming implementations against their own contract code; conformance
        is established by the criteria in the Conformance page and the test
        surface that ships with the standard. (Whitepaper §5.1.)
      </p>

      <Callout variant="info" title="Two layers, two licenses">
        <p>
          The RSS specification — the interfaces, the conformance criteria, the
          RIP process — is published under an OSI-aligned licence, unencumbered
          for any party to implement against. The reference implementation
          maintained by Reineira Labs Limited ships under BUSL-1.1 with a Change
          Date of 2029-06-01 (Change License Apache 2.0). The two licenses
          address different layers and are designed to be coherent jointly.
          (§5.9, §13.) See{" "}
          <a href="/settlement-standard/implement-rss">
            Implement RSS yourself
          </a>
          .
        </p>
      </Callout>

      <h2
        id="scope"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        What RSS covers
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Per §5.2, RSS covers: (a) the four-primitive interface surface and the
        canonical interfaces; (b) the encrypted-type contract conventions and
        the silent-failure pattern; (c) the storage conventions (ERC-7201
        namespacing under{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          reineira.storage.&lt;ContractName&gt;
        </code>
        ,{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          __gap[50]
        </code>{" "}
        reserves) and ERC-2771 meta-transaction support; and (d) the cross-chain
        transport-binding contract by which any bridge funnels into the escrow
        funding sink.
      </p>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        RSS does <strong>not</strong> mandate upgradeability — conforming
        implementations may be upgradeable, immutable, or hybrid (the v1.0
        reference implementation is immutable per §11.8). RSS does not cover
        token economics, fee policy, DAO governance, the execution stack for
        third-party self-hosted deployments, or the builder stack (Atlas, Code).
      </p>

      <h2
        id="standards-fork"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        The standards-fork commitment
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Publishing the standard as a layer separate from the implementation is
        the protocol's load-bearing commitment (§5.9). The split forces any
        competing settlement contract to choose between two outcomes:{" "}
        <strong>implement RSS</strong> — legitimising the standard and
        inheriting its plugin ecosystem — or <strong>fork it</strong>,
        fragmenting the addressable plugin and operator surface against the
        conforming majority.
      </p>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        An RSS-conformant alternative implementation reduces vendor lock-in for
        protocol users: any conforming deployment can host the same plugins,
        accept the same bridge handlers, be observed by the same indexers and
        slashing oracles, and present the same SDK surface — independently of
        who maintains its contracts. The reference implementation competes on
        operational quality, fee schedule, and audit history, not on
        incompatibility.
      </p>

      <h2
        id="next"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Next
      </h2>
      <LinkCard
        items={[
          {
            title: "Conformance",
            description:
              "The six clauses that define an RSS-conformant deployment.",
            href: "/settlement-standard/conformance",
            icon: CheckCircle2,
          },
          {
            title: "Interface Surface",
            description:
              "The four-primitive interfaces, v0.1 mandatory and v0.2 spec'd.",
            href: "/settlement-standard/interface-surface",
            icon: FileCode2,
          },
          {
            title: "Implement RSS yourself",
            description:
              "The license split and the invitation to build a conforming venue.",
            href: "/settlement-standard/implement-rss",
            icon: GitFork,
          },
        ]}
      />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
