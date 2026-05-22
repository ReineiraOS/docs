import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import PageNav from "@/components/docs/PageNav";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "summary", title: "Summary", level: 2 },
  { id: "audit-posture", title: "Known audit posture", level: 2 },
  {
    id: "compliance",
    title: "Compliance & alignment targets",
    level: 2,
  },
  { id: "limits", title: "Limits of the model", level: 2 },
];

const { prev, next } = getPrevNext("/risk");

export default function Risk() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Risk & Audit Status"
        description="Full disclosure of the protocol's audit posture, compliance position, and the explicit limits of its security model."
        readingTime="5 min read"
      />

      <Callout variant="danger" title="Chaos-net is unaudited">
        <p>
          Chaos-net is unaudited. Use for testing or at your own risk —
          interacting with deployed contracts may result in loss of funds. No
          external smart-contract audit is complete as of publication.
        </p>
      </Callout>

      <h2
        id="summary"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Summary
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS is actively-developed, pre-audit infrastructure. This page
        states our current audit and compliance position. Nothing here is a
        certification, an audit result, or a guarantee.
      </p>

      <h2
        id="audit-posture"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Known audit posture
      </h2>
      <blockquote className="border-l-4 border-docs-border-strong pl-4 my-6 text-docs-text-secondary leading-relaxed italic">
        <p>
          No external smart-contract audit is complete as of publication. The
          audit-readiness package is an internal Phase 7 self-review
          (scope-freeze 2026-05-05) covering the four in-scope contract packages
          — tokens, escrow, orchestration, and insurance — with ~85 manual
          findings and eight mainnet blockers routed to remediation. A companion
          checklist (2026-05-07) records the pinned dependency hashes and
          Safe-plus-Timelock mainnet-deploy posture the external auditor will
          verify. Tool-baseline reports from Slither (v0.11.5) and Aderyn
          (v0.6.8), dated 2026-05-04, are retained internally. The external
          auditor is not yet engaged; firm selection is gated on the
          Standard-tier audit-budget activation.
        </p>
      </blockquote>

      <h2
        id="compliance"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Compliance &amp; alignment targets
      </h2>
      <blockquote className="border-l-4 border-docs-border-strong pl-4 my-6 text-docs-text-secondary leading-relaxed italic">
        <p className="mb-4">
          Compliance posture is framed as forward-looking alignment targets,
          never as current certification. The targets surfaced for the
          protocol's institutional readiness are: ISO/IEC 27001 Information
          Security Management System; SOC 2 Type II service-organisation
          controls; ISO/IEC 27701 Privacy Information Management System; ISAE
          3000 assurance engagement for non-financial-information attestation on
          protocol metrics; FATF Recommendation 16 (Travel Rule), whose
          applicability to encrypted-amount transfers remains an open question;
          and MiCA (EU Regulation 2023/1114) alignment posture for EU operator
          activity.
        </p>
        <p>
          As of publication, none of the ISO or SOC items above are certified.
          They are forward-looking objectives committed to a post-mainnet
          implementation timeline conditional on resourcing. The roadmap is
          open.
        </p>
      </blockquote>

      <h2
        id="limits"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Limits of the model
      </h2>
      <blockquote className="border-l-4 border-docs-border-strong pl-4 my-6 text-docs-text-secondary leading-relaxed italic">
        <p>
          The security model explicitly does not cover: the correctness of
          operator-binary off-chain code, which the protocol observes only
          through its attestation surface and slashing-evidence hashes;
          substrate-level (CoFHE) denial-of-service against homomorphic
          evaluation, against which the operator-set's fee-routing posture
          offers economic disincentive but no protocol-layer guarantee; bridge
          counterparty risk during in-flight cross-chain transfers, bounded but
          not eliminated; compromise of off-chain key material on operator
          hardware (HSM posture is the operator's responsibility, out of scope
          for the protocol layer); and MEV at the wrap boundary, whose
          mitigation is the underlying-chain sequencer ordering, not a
          protocol-layer defence.
        </p>
      </blockquote>

      <Callout variant="info" title="Tracking changes">
        <p>
          Audit status changes are announced in{" "}
          <a
            href="https://t.me/ReineiraOS"
            target="_blank"
            rel="noopener noreferrer"
          >
            Telegram
          </a>
          . For audit-readiness or security questions, contact{" "}
          <a href="mailto:engineering@reineira.xyz">engineering@reineira.xyz</a>
          .
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
