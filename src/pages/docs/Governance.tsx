import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import DocsBadge from "@/components/docs/DocsBadge";
import Steps, { Step } from "@/components/docs/Steps";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "posture", title: "Public-Infrastructure posture", level: 2 },
  { id: "entity-stack", title: "Three-entity stack", level: 2 },
  { id: "immutable", title: "Immutable contracts", level: 2 },
  { id: "authorities", title: "What the privileged roles can do", level: 2 },
  { id: "participation", title: "Participation Policy & bond", level: 2 },
  { id: "conditional-tge", title: "Conditional TGE & the DAO", level: 2 },
  { id: "phases", title: "Phases", level: 2 },
];

const { prev, next } = getPrevNext("/learn/governance");

const entityColumns = [
  { header: "Entity", key: "entity", width: "200px" },
  { header: "Jurisdiction", key: "juris", width: "130px" },
  { header: "Role", key: "role" },
];

const entityRows = [
  {
    entity: "Reineira Labs Limited (DevCo)",
    juris: "RAK DAO Free Zone, UAE",
    role: "Software Vendor — authors the contracts, publishes the RSS standard, maintains docs, deploys the canonical reference implementation, coordinates audits. Does not operate the protocol, custody funds, or provide financial services.",
  },
  {
    entity: "Reineira HoldCo",
    juris: "British Virgin Islands",
    role: "Parent entity; counterparty to Convertible Note / SAFE instruments (Reg S, non-U.S. investors). Holds equity in DevCo. Does not custody protocol IP.",
  },
  {
    entity: "Reineira Foundation",
    juris: "Cayman Islands",
    role: "IP assignee from Phase 2; conditional token issuance (if the token-launch triggers are met); DAO custody; ParticipationBond custody; grant-programme and Foundation-operated-services administrator.",
  },
];

const authorityColumns = [
  { header: "Authority", key: "auth", width: "210px" },
  { header: "Can", key: "can" },
];

const authorityRows = [
  {
    auth: "Upgrade authority",
    can: "None. Contracts are immutable singletons — no UUPS proxy, no _authorizeUpgrade hook, no admin upgrade key on any contract.",
  },
  {
    auth: "slashingManager",
    can: "Execute OperatorRegistry.slash and route slashed stake, via OperatorSlashingManager (with owner as backstop).",
  },
  {
    auth: "Coverage Manager admin",
    can: "Admin setters (setEscrow, setPoolFactory) and policy registration. Cannot upgrade or migrate state-bearing contracts. DevCo (Phase 1) → Foundation multisig (Phase 2).",
  },
  {
    auth: "Fee governance (post-activation)",
    can: "Set fee bps into storage within an immutable bytecode ceiling. Cannot raise the ceiling (requires a new immutable FeeManager) and cannot collect any fee before MAINNET_ACTIVATION_BLOCK.",
  },
  {
    auth: "Trusted Forwarder (ERC-2771)",
    can: "Attribute the original signer for sponsored gas. Foundation-published, KYB-pinned allowlist.",
  },
];

export default function Governance() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Governance & Entity Stack"
        description="ReineiraOS is Public Infrastructure: immutable contracts deployed by a Software Vendor, with no upgrade authority and no token at launch."
        readingTime="9 min read"
      />

      <h2
        id="posture"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Public-Infrastructure posture
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS launches as Public Infrastructure. Every contract is an{" "}
        <strong>immutable singleton</strong> with no upgrade authority; protocol
        fees are pinned at zero through chaos-net by a block-locked activation
        constant; operators bond <strong>cUSDC</strong>, not a token; and a{" "}
        <strong>REINEIRA token does not exist yet</strong> — any issuance is
        conditional on the token-launch trigger conditions. Reineira Labs
        Limited (RAK DAO Free Zone, UAE) deploys the contracts as a{" "}
        <strong>Software Vendor</strong>, not as an operator of the protocol.
      </p>

      <Callout variant="info" title="Governance does not vote on upgrades">
        <p>
          Because the contracts are immutable, there is no upgrade to govern. No
          entity — DevCo, HoldCo, Foundation, or any future DAO — holds upgrade
          authority. New functionality ships as{" "}
          <strong>new contract deployments at new addresses</strong> that you
          opt into.
        </p>
      </Callout>

      <h2
        id="entity-stack"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Three-entity stack
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Governance is split across three entities. The full stack is reached at
        Phase 2.{" "}
        <DocsBadge variant="amber">Spec'd · Phase 2 (Q1–Q2 2027)</DocsBadge>
      </p>
      <DocsTable columns={entityColumns} rows={entityRows} />

      <h2
        id="immutable"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Immutable contracts
      </h2>
      <blockquote className="border-l-4 border-docs-border-strong pl-4 my-6 text-docs-text-secondary leading-relaxed italic">
        <p>
          Every contract is an immutable singleton at a fixed address. No entity
          holds upgrade authority. There is no UUPS proxy, no{" "}
          <code className="not-italic">_authorizeUpgrade</code> hook, no Owner
          role with upgrade privileges, and no admin key on any escrow, coverage
          manager, operator registry, fee manager, or token wrapper. Storage and
          logic are both frozen at deployment.
        </p>
      </blockquote>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Contracts still use ERC-7201 namespaced storage and carry a{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          __gap[50]
        </code>{" "}
        reserve — not for in-place upgrades (there are none) but so a future
        immutable redeployment can share storage conventions.
      </p>

      <h2
        id="authorities"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        What the privileged roles can do
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Five authorities partition the protocol's privileged surface. None can
        upgrade a contract, withdraw escrowed funds, modify escrow terms,
        force-resolve a gate, or decrypt FHE state without explicit permission.
      </p>
      <DocsTable columns={authorityColumns} rows={authorityRows} />

      <h2
        id="participation"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Participation Policy &amp; bond
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Under the Participation Policy, the Foundation commits to{" "}
        <strong>not</strong> act as operator, pool creator, pool manager, or
        curator on any role-collapsed venue. The commitment is collateralised by
        a <strong>$1M-equivalent ParticipationBond denominated in cUSDC</strong>
        , deployed empty at chaos-net and funded from Phase 2 capital if and
        when SAFT/QF rounds execute. Any Foundation key that participates on a
        role-collapsed venue forfeits the bond; quarterly{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          NonParticipationAttestation
        </code>{" "}
        events build an immutable record.
      </p>
      <Callout variant="info" title="Three sequenced commitments">
        <ul className="space-y-2 list-disc list-inside">
          <li>
            <strong>Phase 1</strong> — DevCo publishes Participation Policy v0.1
            as a bylaws-draft commitment.
          </li>
          <li>
            <strong>Phase 2</strong> — Foundation adopts v1.0 as a board-level
            commitment (modifiable only by board 2/3 supermajority).
          </li>
          <li>
            <strong>Phase 3 (conditional, post-TGE)</strong> — Foundation
            deploys v1.1 to an immutable contract for 3 years, modifiable only
            by token-holder 2/3 supermajority under a 30-day timelock.
          </li>
        </ul>
      </Callout>

      <h2
        id="conditional-tge"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Conditional TGE &amp; the DAO
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <DocsBadge variant="amber">Research · conditional</DocsBadge> There is
        no REINEIRA token and no DAO today. The Foundation executes a Token
        Generation Event only if <strong>all four</strong> triggers are met:
      </p>
      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>
          A basin condition sustained ≥12 months: ≥30 operator entities,
          cumulative GMV ≥$5B, LP TVL ≥$10M, ≥50 integrated applications, across
          4 consecutive quarters.
        </li>
        <li>
          External-counsel sign-off on digital-commodity classification OR a
          permanent U.S. geo-fence.
        </li>
        <li>A Foundation board 2/3 supermajority attestation.</li>
        <li>A completed independent governance-design review.</li>
      </ul>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        If a TGE occurs, the DAO governs grant/treasury and Participation-Policy
        parameters — never contract upgrades, which do not exist.
      </p>

      <h2
        id="phases"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Phases
      </h2>
      <Steps>
        <Step title="Phase 1 — DevCo as Software Vendor (chaos-net, from Jul 2026)">
          <p className="text-docs-text-secondary leading-relaxed">
            Reineira Labs Limited authors and deploys the immutable contracts,
            publishes RSS, and coordinates audits. IP held under BUSL-1.1.
            Capital via the BVI HoldCo Convertible Note (Reg S). No token, no
            SAFT, no DAO.
          </p>
        </Step>
        <Step title="Phase 2 — Foundation operational (Q1–Q2 2027)">
          <p className="text-docs-text-secondary leading-relaxed">
            The Cayman Foundation becomes operational; IP transfers from DevCo
            to Foundation via the CLA assignment chain; DevCo continues as
            Software Vendor under a maintenance contract. Token issuance is{" "}
            <strong>not</strong> a Phase 2 milestone.
          </p>
        </Step>
        <Step title="Phase 3 — Conditional, post-TGE (only if the token-launch triggers are met)">
          <p className="text-docs-text-secondary leading-relaxed">
            Only if the four triggers are satisfied, a TGE issues the REINEIRA
            token, the DAO activates, and Participation Policy v1.1 is deployed
            immutable. The protocol operates fully without ever reaching this
            phase.
          </p>
        </Step>
      </Steps>

      <Callout variant="tip" title="Trust minimization holds from day one">
        <p>
          Because contracts are immutable and non-custodial, you do not need to
          trust any entity to use the protocol safely: no admin can steal funds,
          change escrow terms, bypass a gate, or decrypt your state. The entity
          stack governs grants, audits, and the standard — not your money.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
