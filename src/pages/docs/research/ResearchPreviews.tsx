import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import DocsBadge from "@/components/docs/DocsBadge";
import PageNav from "@/components/docs/PageNav";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "encrypted-inference", title: "Encrypted inference", level: 2 },
  { id: "why", title: "Why it is interesting", level: 2 },
  { id: "status", title: "Status & caveats", level: 2 },
];

const { prev, next } = getPrevNext("/research/research-previews");

export default function ResearchPreviews() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Research Previews"
        description="Exploratory directions with no committed scope or delivery date. These are research notes, not roadmap items."
        readingTime="4 min read"
      />

      <Callout variant="warning" title="Research only — no commitment">
        <p>
          <DocsBadge variant="amber">Research</DocsBadge> Everything on this
          page is exploratory. It is <strong>not</strong> part of the v1.0
          specification, the RSS conformance surface, or any shipped contract.
          The encrypted-inference note below is a research preview only — there
          is{" "}
          <strong>no delivery promise, no date, and no committed design</strong>
          . Do not build against it.
        </p>
      </Callout>

      <h2
        id="encrypted-inference"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Encrypted inference
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The same FHE substrate that powers encrypted-mode settlement can, in
        principle, evaluate richer functions over encrypted inputs than the
        protocol uses today. <strong>Encrypted inference</strong> is the
        research direction of running model-style scoring over ciphertexts — for
        example, computing a risk score from encrypted features without ever
        revealing those features on-chain or to the scorer. The appeal is a
        natural extension of the underwriter-policy surface: a policy that
        prices risk from sensitive inputs the buyer never has to disclose.
      </p>

      <h2
        id="why"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Why it is interesting
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Confidential underwriting already returns encrypted risk scores via{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          IConfidentialUnderwriterPolicy
        </code>
        . Encrypted inference asks how far the <em>computation</em> behind that
        score can move on-chain while keeping inputs private. The hard limits
        are the same ones that bound all FHE work: homomorphic operations carry
        a large multiplicative cost over their plaintext analogues, and any
        non-trivial circuit composes many programmable bootstraps. Whether a
        useful inference circuit fits within practical cost and latency budgets
        is exactly the open question — which is why this is a research preview
        and not a feature.
      </p>

      <h2
        id="status"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Status &amp; caveats
      </h2>
      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>
          No contract, interface, or RSS surface implements encrypted inference.
        </li>
        <li>It is not on the v1.0, chaos-net, or mainnet roadmap.</li>
        <li>
          It carries no committed design — the framing here may change or be
          dropped entirely.
        </li>
      </ul>

      <Callout variant="info" title="Talk to us">
        <p>
          If you are researching FHE inference and want to compare notes, reach
          out at{" "}
          <a href="mailto:engineering@reineira.xyz">engineering@reineira.xyz</a>
          .
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
