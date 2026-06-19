import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import CodeBlock from "@/components/docs/CodeBlock";
import ArchitectureDiagram from "@/components/docs/ArchitectureDiagram";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import Callout from "@/components/docs/Callout";
import DocsBadge from "@/components/docs/DocsBadge";
import StatusBadge from "@/components/docs/StatusBadge";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "where-this-fits", title: "Where this fits", level: 2 },
  { id: "four-primitives", title: "Four primitives", level: 2 },
  { id: "how-they-connect", title: "How they connect", level: 2 },
  {
    id: "what-you-build",
    title: "What you build vs. protocol handles",
    level: 2,
  },
  { id: "two-interfaces", title: "Two interfaces", level: 2 },
  { id: "open-economy", title: "Open economy model", level: 2 },
];

const { prev, next } = getPrevNext("/learn/mental-model");

const buildingBlockColumns = [
  { header: "Primitive", key: "primitive", width: "140px" },
  { header: "Role", key: "role" },
  { header: "Example", key: "example" },
];
const buildingBlockRows = [
  {
    primitive: "Escrow",
    role: "Holds FHE-encrypted money until a condition is met. The chain and Operators cannot see the amount. Contract: ConfidentialEscrow.",
    example: "A freelance payment locked until deliverables are approved.",
  },
  {
    primitive: "Gate",
    role: "Decides when an Escrow releases funds through IConditionResolver logic such as oracles, zkTLS, multisig, or time locks.",
    example: "A PayPal proof-of-payment Gate using Reclaim Protocol.",
  },
  {
    primitive: "Recourse",
    role: "Capital-backed coverage pool with encrypted risk scoring, branded Shield. IUnderwriterPolicy prices risk and judges disputes.",
    example: "A P2P marketplace policy that covers chargebacks.",
  },
  {
    primitive: "Operators",
    role: "Relays cross-chain messages and routes settlement tasks; staking and relay fees are spec'd, not yet live.",
    example: "A node relaying CCTP burn/mint attestations.",
  },
];

const responsibilityColumns = [
  { header: "Layer", key: "layer", width: "120px" },
  { header: "You build", key: "you" },
  { header: "Protocol handles", key: "protocol" },
];
const responsibilityRows = [
  {
    layer: "Escrow",
    you: "Escrow parameters (amount, beneficiary, expiry)",
    protocol: "FHE encryption, storage, fund custody",
  },
  {
    layer: "Gate",
    you: "Verification logic (what condition triggers release)",
    protocol: "Condition checking, atomic settlement",
  },
  {
    layer: "Recourse",
    you: "Policy logic (risk evaluation, dispute rules)",
    protocol: "Premium calculation, pool management, encrypted accounting",
  },
  {
    layer: "UX",
    you: "Application UI, user flows",
    protocol: "SDK encryption helpers, meta-tx relaying",
  },
  {
    layer: "Operators",
    you: "Nothing — opt in or out",
    protocol: "CCTP bridging, operator staking, message relay",
  },
];

export default function MentalModel() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Mental Model"
        description="Every ReineiraOS application combines four primitives: Escrow, Gate, Recourse, and Operators."
        readingTime="6 min read"
      />

      <h2
        id="where-this-fits"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Where this fits
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS is three pillars: the{" "}
        <strong className="text-docs-text-primary font-semibold">
          Reineira Settlement Protocol
        </strong>{" "}
        (the on-chain immutable contracts), the{" "}
        <strong className="text-docs-text-primary font-semibold">
          Reineira Settlement Standard (RSS)
        </strong>{" "}
        (the open, semver-versioned conformance spec evolved via the RIP
        process), and the{" "}
        <strong className="text-docs-text-primary font-semibold">
          Builder Stack
        </strong>{" "}
        (Reineira Atlas + Reineira Code). The four primitives below are the
        mental model for the <em>protocol</em> pillar — the layer your app
        composes against.
      </p>

      <Callout variant="info" title="Public infrastructure, no token">
        <p>
          The protocol charges no protocol fee — the only fees are
          builder-configurable (a Gate's{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            getConditionFee
          </code>{" "}
          or an underwriter premium). The contracts are upgradeable today (UUPS
          with an owner); full immutability is a v1.0 target, not yet in force.
          Operator economics — staking, relay fees, any bonding — are{" "}
          <StatusBadge status="spec" />. The contracts are deployed by Reineira
          Labs Limited (RAK DAO Free Zone, UAE) as a Software Vendor.
        </p>
      </Callout>

      <h2
        id="four-primitives"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Four primitives
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Four composable building blocks — there's nothing else to learn at the
        conceptual level. Escrow holds the money, Gate verifies the condition,
        Recourse covers the outcome, Operators coordinate it all. Every app on
        the protocol is some combination of these.
      </p>

      <DocsTable columns={buildingBlockColumns} rows={buildingBlockRows} />

      <Callout variant="tip" title="Think in plugins">
        <p>
          Gates and Underwriter Policies are plugins. You deploy your own, the
          protocol calls them at the right time. This means you never touch
          encryption, settlement, or cross-chain logic directly.
        </p>
      </Callout>

      <Callout
        variant="warning"
        title="Two modes: public on testnet, encrypted at v1.0 mainnet"
      >
        <p>
          The FHE-encrypted behavior described for Escrow and Recourse is the{" "}
          <DocsBadge variant="amber">v1.0 mainnet</DocsBadge> design (Q4 2026).
          The Arbitrum Sepolia testnet deployment (
          <DocsBadge variant="blue">live today</DocsBadge>) runs{" "}
          <strong>public mode</strong> with plaintext state so the network can
          be exercised in the open — end-to-end encryption is not live yet (it
          activates at v1.0 mainnet). The interfaces and primitives are
          identical across both modes; only the state visibility changes.
        </p>
      </Callout>

      <h2
        id="how-they-connect"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        How they connect
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The four primitives form a linear pipeline. Every Escrow follows the
        same lifecycle regardless of which Gate or underwriter policy is
        attached.
      </p>

      <ArchitectureDiagram
        title="ESCROW LIFECYCLE FLOW"
        steps={[
          {
            label: "Create",
            sublabel: "Escrow created with encrypted amount and Gate address",
          },
          {
            label: "Fund",
            sublabel: "Depositor sends tokens, protocol encrypts and stores",
          },
          {
            label: "Verify",
            sublabel: "Gate checks condition (e.g. proof of payment)",
          },
          {
            label: "Settle",
            sublabel:
              "Protocol selects the encrypted payout and transfers it (still encrypted)",
          },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        If coverage is attached, a{" "}
        <strong className="text-docs-text-primary font-semibold">
          Recourse
        </strong>{" "}
        policy evaluates risk at creation time and a pool backs the coverage. If
        cross-chain settlement is enabled, an{" "}
        <strong className="text-docs-text-primary font-semibold">
          Operator
        </strong>{" "}
        relays the settlement message via CCTP. Both are optional extensions to
        the core flow.
      </p>

      <h2
        id="what-you-build"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        What you build vs. protocol handles
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The boundary between your code and the protocol is intentionally sharp.
        You define <em>what</em> should happen; the protocol handles{" "}
        <em>how</em> it happens privately and securely.
      </p>

      <DocsTable columns={responsibilityColumns} rows={responsibilityRows} />

      <h2
        id="two-interfaces"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Two interfaces
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        As a builder, you interact with the protocol through exactly two
        Solidity interfaces. Everything else is internal.
      </p>

      <CodeBlock
        filename="IConditionResolver.sol"
        language="solidity"
        lines={[
          { content: "// SPDX-License-Identifier: MIT" },
          { content: "pragma solidity ^0.8.24;" },
          { content: "" },
          { content: "interface IConditionResolver {" },
          {
            content: "    /// @notice Check if the release condition is met",
            highlighted: true,
          },
          {
            content:
              "    function isConditionMet(uint256 escrowId) external view returns (bool);",
          },
          { content: "" },
          {
            content:
              "    /// @notice Hook called when a resolver is attached to an Escrow",
            highlighted: true,
          },
          {
            content:
              "    function onConditionSet(uint256 escrowId, bytes calldata data) external;",
          },
          { content: "}" },
        ]}
        showLineNumbers={true}
      />

      <CodeBlock
        filename="IUnderwriterPolicy.sol"
        language="solidity"
        lines={[
          { content: "// SPDX-License-Identifier: MIT" },
          { content: "pragma solidity ^0.8.24;" },
          {
            content:
              'import { euint64, ebool } from "@fhenixprotocol/cofhe-contracts/FHE.sol";',
          },
          { content: "" },
          { content: "interface IUnderwriterPolicy {" },
          {
            content:
              "    /// @notice Hook called when a policy is attached to coverage",
            highlighted: true,
          },
          {
            content:
              "    function onPolicySet(uint256 coverageId, bytes calldata data) external;",
          },
          { content: "" },
          {
            content:
              "    /// @notice Evaluate risk — returns encrypted FHE risk score",
            highlighted: true,
          },
          {
            content:
              "    function evaluateRisk(uint256 escrowId, bytes calldata riskProof)",
          },
          {
            content: "        external returns (euint64 riskScore);",
            highlighted: true,
          },
          { content: "" },
          {
            content:
              "    /// @notice Judge a dispute — returns encrypted FHE verdict",
            highlighted: true,
          },
          {
            content:
              "    function judge(uint256 coverageId, bytes calldata disputeProof)",
          },
          {
            content: "        external returns (ebool valid);",
            highlighted: true,
          },
          { content: "}" },
        ]}
        showLineNumbers={true}
      />

      <Callout variant="info" title="Encrypted return values">
        <p>
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            IUnderwriterPolicy
          </code>{" "}
          methods return FHE-encrypted types (
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            euint64
          </code>
          ,{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            ebool
          </code>
          ). The protocol never exposes risk scores or verdicts in cleartext
          on-chain.
        </p>
      </Callout>

      <h2
        id="open-economy"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Open economy model
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS is designed as an open economy where multiple participant
        types contribute and earn:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Gate Builders
          </strong>{" "}
          — Deploy custom Gates (verification plugins). Earn fees each time
          their Gate is used in an Escrow.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Underwriters
          </strong>{" "}
          — Stake capital into Recourse coverage pools. Premiums are charged per
          policy and computed in encrypted space; the on-chain distribution of
          those premiums to stakers (
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            pendingRewards
          </code>{" "}
          /{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            claimRewards
          </code>
          ) is <StatusBadge status="spec" /> and not yet live.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Developers
          </strong>{" "}
          — Build end-user applications on top of the protocol. Use the SDK to
          encrypt, create Escrows, and settle — without touching cryptography
          directly.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Operators
          </strong>{" "}
          — Run relay nodes that bridge cross-chain messages. The economics
          (relay fees, staked collateral) are <StatusBadge status="spec" /> and
          not yet live.
        </li>
      </ul>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Each role is permissionless. There is no approval process — deploy a
        resolver, stake into a pool, or spin up an operator node whenever you
        are ready.
      </p>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
