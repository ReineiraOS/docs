import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import Steps, { Step } from "@/components/docs/Steps";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "posture", title: "Public-Infrastructure posture", level: 2 },
  { id: "software-vendor", title: "Software Vendor, not operator", level: 2 },
  {
    id: "immutable",
    title: "Upgradeability & the immutability target",
    level: 2,
  },
  { id: "authorities", title: "What the privileged roles can do", level: 2 },
  { id: "phases", title: "Path to immutability", level: 2 },
];

const { prev, next } = getPrevNext("/learn/governance");

const authorityColumns = [
  { header: "Authority", key: "auth", width: "210px" },
  { header: "Can", key: "can" },
];

const authorityRows = [
  {
    auth: "Upgrade authority (owner)",
    can: "On Arbitrum Sepolia testnet today, every contract is UUPS-upgradeable behind a proxy: TestnetCoreBase gates _authorizeUpgrade with onlyOwner, so the contract owner can ship a new implementation. Renouncing this authority to reach immutable bytecode is the v1.0 mainnet target, not the current state.",
  },
  {
    auth: "Coverage Manager admin",
    can: "Admin setters (setEscrow, setPoolFactory) and policy registration, plus the owner-gated proxy upgrade hook on Arbitrum Sepolia testnet. At v1.0 there is no upgrade hook and no admin key on a state-bearing contract.",
  },
  {
    auth: "Fee governance",
    can: "The protocol charges nothing — zero fees are the posture maintained, not a constant baked into bytecode, and there is no protocol fee contract to set or gate.",
  },
  {
    auth: "Trusted Forwarder (ERC-2771)",
    can: "Attribute the original signer for sponsored gas. The forwarder address is bound at construction of the protocol base contract.",
  },
];

export default function Governance() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Governance Posture"
        description="ReineiraOS is Public Infrastructure published by a Software Vendor, with no token and no fees. Contracts are owner-upgradeable on Arbitrum Sepolia testnet today; renouncing that authority to reach immutable bytecode with no upgrade authority is the v1.0 mainnet target."
        readingTime="7 min read"
      />

      <h2
        id="posture"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Public-Infrastructure posture
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS launches as Public Infrastructure. On Arbitrum Sepolia
        testnet today every contract is <strong>UUPS-upgradeable</strong> behind
        a proxy, with the upgrade hook gated by the contract owner; converging
        on <strong>immutable singletons with no upgrade authority</strong> is
        the v1.0 mainnet target rather than the current state. The protocol{" "}
        <strong>charges nothing</strong> — zero fees are a posture the owner
        maintains, not a constant locked into bytecode. Running a relayer is{" "}
        <strong>permissionless</strong> — a bot watches CCTP burns, fetches the
        Circle attestation, and calls{" "}
        <code className="not-italic">settle()</code>; there is no operator bond
        and <strong>there is no token</strong>. Reineira Labs Limited deploys
        the contracts as a <strong>Software Vendor</strong>, not as an operator
        of the protocol.
      </p>

      <Callout variant="info" title="Governance on the path to immutability">
        <p>
          Today the contract owner can ship UUPS upgrades, so governance has a
          real upgrade surface to steward. The v1.0 mainnet target is to
          renounce that authority and freeze the bytecode; once there, no party
          holds upgrade authority over the deployed contracts, and new
          functionality would ship only as{" "}
          <strong>new contract deployments at new addresses</strong> that you
          opt into.
        </p>
      </Callout>

      <h2
        id="software-vendor"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Software Vendor, not operator
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong>Reineira Labs Limited is the Software Vendor.</strong> It
        authors the protocol contracts, publishes the Reineira Settlement
        Standard (RSS), distributes the builder stack, maintains documentation,
        coordinates external audits, and deploys the canonical reference
        implementation. It does <strong>not</strong> operate the protocol, does{" "}
        <strong>not</strong> custody user funds, and at v1.0 holds no admin keys
        on deployed contracts (there are none to hold). There is{" "}
        <strong>no protocol token</strong> and <strong>no protocol fee</strong>:
        any fees in the system are set and kept by independent third parties —
        Gate builders, recourse pools and their LPs, and relayers — for the work
        or capital they supply. Reineira Labs is a software company funded by
        equity.
      </p>

      <h2
        id="immutable"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Upgradeability &amp; the immutability target
      </h2>
      <blockquote className="border-l-4 border-docs-border-strong pl-4 my-6 text-docs-text-secondary leading-relaxed italic">
        <p>
          On Arbitrum Sepolia testnet today, every state-bearing contract sits
          behind a UUPS proxy. The shared base —{" "}
          <code className="not-italic">TestnetCoreBase</code> — is{" "}
          <code className="not-italic">UUPSUpgradeable</code> and{" "}
          <code className="not-italic">OwnableUpgradeable</code> and gates{" "}
          <code className="not-italic">_authorizeUpgrade(address)</code> with{" "}
          <code className="not-italic">onlyOwner</code>, so the owner can ship a
          new implementation. The deployment JSONs carry matching proxy and
          implementation pairs. Freezing logic and storage by renouncing the
          upgrade key is the <strong>v1.0 mainnet target</strong>, not a
          property that holds today.
        </p>
      </blockquote>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Contracts use ERC-7201 namespaced storage and carry a{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          __gap[50]
        </code>{" "}
        reserve so that UUPS upgrades can extend storage without colliding with
        existing slots — standard upgrade-safety practice for layout evolution.
      </p>

      <h2
        id="authorities"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        What the privileged roles can do
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Four authorities partition the protocol's privileged surface. The owner
        can ship UUPS upgrades on Arbitrum Sepolia testnet today (the
        immutable-bytecode target removes this later), but no authority can
        withdraw escrowed funds, modify escrow terms, force-resolve a gate, or
        decrypt FHE state without explicit permission.
      </p>
      <DocsTable columns={authorityColumns} rows={authorityRows} />

      <h2
        id="phases"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Path to immutability
      </h2>
      <Steps>
        <Step title="Testnet & chaos-net — owner-upgradeable (today; chaos-net Jul–Aug 2026)">
          <p className="text-docs-text-secondary leading-relaxed">
            Reineira Labs Limited authors and deploys the contracts as
            owner-upgradeable UUPS proxies, publishes RSS, and coordinates
            audits. Source under BUSL-1.1 converting to Apache 2.0 on the Change
            Date <code className="not-italic">2029-06-01</code>. The upgrade
            surface is stewarded via the owner key while the protocol is
            iterated and audited.
          </p>
        </Step>
        <Step title="v1.0 mainnet — immutable singletons, no upgrade authority">
          <p className="text-docs-text-secondary leading-relaxed">
            Ownership of the deployed contracts is renounced so they are left
            with no upgrade hook and no privileged controller. From that point
            the bytecode is the protocol: functional evolution ships only as new
            immutable deployments at new addresses, and migration is opt-in. No
            party can reach into a deployed contract to mutate it — the
            rugpull-via-upgrade failure mode is structurally eliminated, not
            mitigated.
          </p>
        </Step>
      </Steps>

      <Callout variant="tip" title="Non-custodial from day one">
        <p>
          The contracts are non-custodial regardless of upgrade status: no admin
          can steal escrowed funds, change escrow terms, bypass a gate, or
          decrypt your state. While the owner can still ship UUPS upgrades today
          on Arbitrum Sepolia testnet (the v1.0 mainnet target renounces that
          key), there is no token and no protocol fee — the Software Vendor
          publishes the open-source software and coordinates audits, it does not
          touch your money.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
