import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import DocsTable from "@/components/docs/DocsTable";
import PageNav from "@/components/docs/PageNav";
import DocsBadge from "@/components/docs/DocsBadge";
import Steps, { Step } from "@/components/docs/Steps";
import LinkCard from "@/components/docs/LinkCard";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";
import { BookOpen, Rocket } from "lucide-react";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "adoption-phases", title: "Adoption phases", level: 2 },
  { id: "technical-requirements", title: "Technical requirements", level: 2 },
  { id: "security-audit-status", title: "Security audit status", level: 2 },
  { id: "support-sla", title: "Support & SLA", level: 2 },
  { id: "next-steps", title: "Next steps", level: 2 },
];

const { prev, next } = getPrevNext("/get-started/enterprise-checklist");

// -- Table data ---------------------------------------------------------------

const techReqColumns = [
  { header: "Requirement", key: "requirement", width: "200px" },
  { header: "Details", key: "details" },
];

const techReqRows = [
  { requirement: "Runtime", details: "Node.js 18+" },
  { requirement: "SDK", details: "@reineira-os/sdk" },
  { requirement: "Smart contracts", details: "Solidity 0.8.24+, Hardhat" },
  { requirement: "FHE backend", details: "CoFHE coprocessor" },
  { requirement: "Testnet chain", details: "Arbitrum Sepolia" },
  { requirement: "Cross-chain", details: "Circle CCTP V2" },
  { requirement: "Smart accounts", details: "ERC-4337 compatible" },
  { requirement: "Meta-transactions", details: "ERC-2771 support" },
  {
    requirement: "Contract pattern",
    details: "UUPS upgradeable, ERC-7201 namespaced storage",
  },
];

const auditColumns = [
  { header: "Component", key: "component", width: "220px" },
  { header: "Status", key: "status" },
];

const auditRows = [
  {
    component: "Escrow (ConfidentialEscrow)",
    status: <DocsBadge variant="green">Internal review complete</DocsBadge>,
  },
  {
    component: "Gate (IConditionResolver)",
    status: <DocsBadge variant="green">Internal review complete</DocsBadge>,
  },
  {
    component: "Insurance contracts",
    status: <DocsBadge variant="amber">Interfaces defined</DocsBadge>,
  },
  {
    component: "Cross-Chain (CCTP V2)",
    status: <DocsBadge variant="green">Internal review complete</DocsBadge>,
  },
  {
    component: "Operator network",
    status: <DocsBadge variant="green">Internal review complete</DocsBadge>,
  },
  {
    component: "Third-party audit",
    status: <DocsBadge variant="blue">Planned</DocsBadge>,
  },
];

const slaColumns = [
  { header: "Channel", key: "channel", width: "200px" },
  { header: "Response time", key: "response" },
];

const slaRows = [
  { channel: "Telegram community", response: "Best effort < 24h" },
  { channel: "Scheduled calls", response: "By appointment" },
  { channel: "GitHub issues", response: "Triaged within 48h" },
  { channel: "Enterprise support", response: "Custom SLA available" },
];

export default function EnterpriseChecklist() {
  return (
    <DocsLayout
      toc={toc}
      editHref="https://github.com/reineiraos/docs/edit/main/get-started/enterprise-checklist.mdx"
    >
      <Breadcrumbs />

      <PageHeader
        title="Enterprise Checklist"
        description="A structured adoption guide for engineering teams integrating ReineiraOS into production systems."
        readingTime="6 min read"
      />

      {/* -- Overview ---------------------------------------------------------- */}
      <h2
        id="overview"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Overview
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        This checklist walks engineering teams through five phases of ReineiraOS
        adoption — from initial evaluation through production launch. Each phase
        builds on the previous one and includes concrete deliverables.
      </p>

      <Callout variant="info" title="Not a linear process">
        <p>
          While the phases are numbered sequentially, compliance and security
          reviews often run in parallel with integration work. Start Phase 4
          early to avoid blocking your launch timeline.
        </p>
      </Callout>

      {/* -- Adoption phases --------------------------------------------------- */}
      <h2
        id="adoption-phases"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Adoption phases
      </h2>

      <Steps>
        <Step title="Phase 1 — Evaluate">
          <p className="text-docs-text-secondary leading-relaxed mb-3">
            Build a mental model of the protocol and assess fit for your use
            case.
          </p>
          <ul className="space-y-1.5 list-disc list-inside text-docs-text-secondary">
            <li>
              Read the{" "}
              <a
                href="/get-started/overview"
                className="text-brand-primary font-medium hover:underline"
              >
                Overview
              </a>
              ,{" "}
              <a
                href="/learn/mental-model"
                className="text-brand-primary font-medium hover:underline"
              >
                Mental Model
              </a>
              ,{" "}
              <a
                href="/learn/architecture"
                className="text-brand-primary font-medium hover:underline"
              >
                Architecture
              </a>
              , and{" "}
              <a
                href="/learn/privacy-model"
                className="text-brand-primary font-medium hover:underline"
              >
                Privacy Model
              </a>{" "}
              docs
            </li>
            <li>
              Identify the{" "}
              <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
                IConditionResolver
              </code>{" "}
              pattern that fits your release conditions
            </li>
            <li>
              Determine cross-chain settlement requirements (source and
              destination chains)
            </li>
            <li>
              Assess insurance coverage requirements for your transaction types
            </li>
          </ul>
        </Step>

        <Step title="Phase 2 — Integrate">
          <p className="text-docs-text-secondary leading-relaxed mb-3">
            Build and connect your application to the ReineiraOS protocol.
          </p>
          <ul className="space-y-1.5 list-disc list-inside text-docs-text-secondary">
            <li>
              Complete the{" "}
              <a
                href="/get-started/quick-start"
                className="text-brand-primary font-medium hover:underline"
              >
                Quick Start
              </a>{" "}
              guide end-to-end
            </li>
            <li>
              Set up{" "}
              <a
                href="/developers/reineira-code"
                className="text-brand-primary font-medium hover:underline"
              >
                ReineiraOS Code
              </a>{" "}
              as your development environment
            </li>
            <li>
              Build your custom{" "}
              <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
                IConditionResolver
              </code>{" "}
              implementation
            </li>
            <li>
              Implement the full{" "}
              <a
                href="/build/escrow-lifecycle"
                className="text-brand-primary font-medium hover:underline"
              >
                escrow lifecycle
              </a>{" "}
              — create, fund, resolve, redeem
            </li>
            <li>
              Integrate{" "}
              <a
                href="/operate/cross-chain"
                className="text-brand-primary font-medium hover:underline"
              >
                cross-chain settlement
              </a>{" "}
              if needed
            </li>
            <li>
              Configure{" "}
              <a
                href="/build/insurance-policies"
                className="text-brand-primary font-medium hover:underline"
              >
                insurance policies
              </a>{" "}
              and pool coverage
            </li>
          </ul>
        </Step>

        <Step title="Phase 3 — Test">
          <p className="text-docs-text-secondary leading-relaxed mb-3">
            Validate correctness, security, and performance before going to
            production.
          </p>
          <ul className="space-y-1.5 list-disc list-inside text-docs-text-secondary">
            <li>
              Write unit tests for your resolver and integration contracts
            </li>
            <li>Run end-to-end tests on Arbitrum Sepolia</li>
            <li>
              Test cross-chain settlement paths (source chain to destination
              chain)
            </li>
            <li>
              Simulate failure modes — expired escrows, failed conditions,
              network outages
            </li>
            <li>Load test FHE operations to validate gas budgets</li>
            <li>
              Verify event emission and indexing for all escrow state
              transitions
            </li>
          </ul>
        </Step>

        <Step title="Phase 4 — Compliance">
          <p className="text-docs-text-secondary leading-relaxed mb-3">
            Address regulatory and legal requirements for your jurisdiction.
          </p>
          <ul className="space-y-1.5 list-disc list-inside text-docs-text-secondary">
            <li>
              Map money transmission requirements for your operating
              jurisdictions
            </li>
            <li>
              Document the non-custodial architecture (escrows are
              self-custodied, not held by a third party)
            </li>
            <li>
              Review the{" "}
              <a
                href="/learn/privacy-model"
                className="text-brand-primary font-medium hover:underline"
              >
                privacy model
              </a>{" "}
              with your legal team
            </li>
            <li>
              Implement KYC/KYB checks at the application layer (not enforced by
              the protocol)
            </li>
            <li>Set up AML transaction monitoring for your application</li>
            <li>
              Define data retention and deletion policies compatible with FHE
              constraints
            </li>
            <li>Review insurance pool terms and underwriter obligations</li>
          </ul>
        </Step>

        <Step title="Phase 5 — Launch">
          <p className="text-docs-text-secondary leading-relaxed mb-3">
            Deploy to production and establish operational readiness.
          </p>
          <ul className="space-y-1.5 list-disc list-inside text-docs-text-secondary">
            <li>Deploy resolver contracts to production chains</li>
            <li>Configure the SDK with testnet endpoints and signing keys</li>
            <li>
              Set up monitoring dashboards for escrow state, gas usage, and
              settlement latency
            </li>
            <li>
              Configure alerting for failed resolutions, stuck escrows, and
              cross-chain timeouts
            </li>
            <li>
              Implement key management with HSM or multi-sig for deployer and
              admin roles
            </li>
            <li>Document the UUPS upgrade path and governance approval flow</li>
            <li>Write an incident runbook covering common failure scenarios</li>
          </ul>
        </Step>
      </Steps>

      <Callout variant="warning" title="Do not skip Phase 3">
        <p>
          FHE operations behave differently under load than standard EVM calls.
          Gas estimation, transaction ordering, and decryption latency can all
          surface issues that only appear at scale. Test thoroughly on testnet
          before committing to production.
        </p>
      </Callout>

      {/* -- Technical requirements -------------------------------------------- */}
      <h2
        id="technical-requirements"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Technical requirements
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The following tools and standards are required or recommended for
        building on ReineiraOS:
      </p>

      <DocsTable columns={techReqColumns} rows={techReqRows} />

      {/* -- Security audit status --------------------------------------------- */}
      <h2
        id="security-audit-status"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Security audit status
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Current audit and review status for each protocol component:
      </p>

      <DocsTable columns={auditColumns} rows={auditRows} />

      <Callout variant="info" title="Audit timeline">
        <p>
          A comprehensive third-party audit is planned prior to production
          launch. Follow the{" "}
          <a
            href="/learn/security"
            className="text-brand-primary font-medium hover:underline"
          >
            Security
          </a>{" "}
          page for updates.
        </p>
      </Callout>

      {/* -- Support & SLA ----------------------------------------------------- */}
      <h2
        id="support-sla"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Support & SLA
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Available support channels and expected response times:
      </p>

      <DocsTable columns={slaColumns} rows={slaRows} />

      {/* -- Next steps -------------------------------------------------------- */}
      <h2
        id="next-steps"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Next steps
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-2">
        Ready to start? Begin with Phase 1:
      </p>

      <LinkCard
        items={[
          {
            title: "Overview",
            description: "Understand what ReineiraOS is and how it works.",
            href: "/get-started/overview",
            icon: BookOpen,
          },
          {
            title: "Quick Start",
            description: "Deploy your first Escrow in under 5 minutes.",
            href: "/get-started/quick-start",
            icon: Rocket,
          },
        ]}
      />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
