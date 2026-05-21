import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import Steps, { Step } from "@/components/docs/Steps";
import DocsBadge from "@/components/docs/DocsBadge";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "operator-staking", title: "Operator staking", level: 2 },
  { id: "slashing", title: "Slashing mechanism", level: 2 },
  { id: "cross-chain-security", title: "Cross-chain security", level: 2 },
  { id: "smart-contract-security", title: "Smart contract security", level: 2 },
  { id: "known-limitations", title: "Known limitations (testnet)", level: 2 },
];

const { prev, next } = getPrevNext("/learn/security");

const stakingColumns = [
  { header: "Parameter", key: "param", width: "200px" },
  { header: "Value", key: "value", mono: true, width: "140px" },
  { header: "Description", key: "desc" },
];
const stakingRows = [
  {
    param: "Bond asset",
    value: "cUSDC",
    desc: "Operators bond cUSDC, an immutable ERC-7984 USDC wrapper — not a governance token. The OperatorRegistry accepts the configured bond asset (§8, §8.4).",
  },
  {
    param: "Minimum bond",
    value: "Config",
    desc: "Configurable via setConfig() on the OperatorRegistry. Denominated in cUSDC. The REINEIRA token does not exist yet; it is conditional on the §12.11 triggers with no date (§8.4, §12).",
  },
  {
    param: "Unbonding period",
    value: "7 days",
    desc: "After initiating withdrawal, staked funds are locked for 7 days to allow challenge windows to close.",
  },
  {
    param: "Relay window (exclusive)",
    value: "60 seconds",
    desc: "The assigned operator has 60 seconds of exclusive relay rights before the task opens to other operators. Configurable.",
  },
  {
    param: "Relay window (permissionless)",
    value: "600 seconds",
    desc: "After the permissionless delay, any staked operator can relay. First valid relay earns the fee. Configurable.",
  },
  {
    param: "Relay fee",
    value: "0.50%",
    desc: "Total fee split: 0.15% protocol fee + 0.35% operator fee. Configurable via FeeManager.setFeeConfig(). An additional 0.25% escrow settlement fee is collected on redemption.",
  },
];

const slashingColumns = [
  { header: "Parameter", key: "param", width: "200px" },
  { header: "Value", key: "value", mono: true, width: "120px" },
  { header: "Description", key: "desc" },
];
const slashingRows = [
  {
    param: "Challenge period",
    value: "3 days",
    desc: "Anyone can submit a challenge against an operator within 3 days of the disputed action.",
  },
  {
    param: "Voting period",
    value: "4 days",
    desc: "Staked operators vote on the challenge validity.",
  },
  {
    param: "Expiry period",
    value: "14 days",
    desc: "Unchallenged actions become final after 14 days. No retroactive slashing.",
  },
  {
    param: "Quorum",
    value: "10%",
    desc: "At least 10% of total staked weight must vote for the result to be valid (1000 bps).",
  },
  {
    param: "Proposer / Challenger bond",
    value: "5%",
    desc: "Both the proposer and challenger must post a 5% bond (500 bps) to participate.",
  },
  {
    param: "Slasher reward",
    value: "10%",
    desc: "The slasher receives 10% of the slashed cUSDC stake (1000 bps) (§8.7).",
  },
];

const contractSecurityColumns = [
  { header: "Mechanism", key: "mechanism", width: "200px" },
  { header: "Standard", key: "standard", mono: true, width: "140px" },
  { header: "Purpose", key: "purpose" },
];
const contractSecurityRows = [
  {
    mechanism: "Proxy pattern",
    standard: "UUPS",
    purpose:
      "Upgradeable contracts with minimal proxy overhead. Upgrade logic lives in the implementation, not the proxy.",
  },
  {
    mechanism: "Namespaced storage",
    standard: "ERC-7201",
    purpose:
      "Each module stores state in a deterministic, collision-resistant slot. Prevents storage layout conflicts on upgrade.",
  },
  {
    mechanism: "Reentrancy guard",
    standard: "ReentrancyGuard",
    purpose:
      "All external-facing functions use nonReentrant modifier to prevent callback-based exploits.",
  },
  {
    mechanism: "Meta-transactions",
    standard: "ERC-2771",
    purpose:
      "Trusted forwarder pattern for gasless transactions. Validates forwarder address to prevent spoofing.",
  },
  {
    mechanism: "Access control",
    standard: "Ownable",
    purpose:
      "Single-owner admin pattern for testnet. Multi-sig and timelock planned for future releases.",
  },
  {
    mechanism: "Initializer",
    standard: "Initializable",
    purpose:
      "Prevents re-initialization of proxy contracts. Constructor is disabled; initialize() can only be called once.",
  },
];

const limitationColumns = [
  { header: "Limitation", key: "limitation", width: "220px" },
  { header: "Impact", key: "impact" },
  { header: "Planned fix", key: "plan" },
];
const limitationRows = [
  {
    limitation: "Single coordinator",
    impact:
      "Single point of failure for relay task distribution. If the coordinator goes down, cross-chain settlement stalls.",
    plan: "Redundant coordinator instances with failover.",
  },
  {
    limitation: "In-memory operator state",
    impact:
      "Operator relay state is lost on restart. Pending messages may need manual resubmission.",
    plan: "Persistent state store with automatic recovery.",
  },
  {
    limitation: "Single-quorum slashing only",
    impact:
      "OperatorSlashingManager enforces a single stake-weighted quorum across the active set. Cross-graph slashing (votes spanning ≥3 independent coordinator–operator graphs) is spec'd but not yet shipped.",
    plan: "CoordinatorRegistry with cross-graph slashing on the v1.0 track (§8.10).",
  },
  {
    limitation: "Testnet FHE",
    impact:
      "FHE coprocessor is testnet-grade. Encryption is functional but security parameters may change before production.",
    plan: "Production FHE parameters audited by cryptography team.",
  },
  {
    limitation: "No timelock",
    impact:
      "Admin upgrades are immediate with no delay. No governance review period.",
    plan: "Timelock on admin actions with emergency multisig override.",
  },
];

export default function Security() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Security"
        description="Security assumptions, threat model, and audit results."
        readingTime="7 min read"
      />

      <h2
        id="operator-staking"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Operator staking
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Operators must post a cUSDC bond to participate in the relay network.
        Bonding creates economic alignment — operators lose money if they
        misbehave, and earn fees when they relay honestly. Registration is
        permissionless from chaos-net day 1: any address meeting the bond,
        sanctions-clean, and not-previously-slashed criteria can register at the
        contract layer without Foundation invitation (§8.4, §8.11).
      </p>

      <DocsTable columns={stakingColumns} rows={stakingRows} />

      <Callout
        variant="info"
        title="Permissionless registration and sanctions screening"
      >
        <p>
          The OperatorRegistry is permissionless at the contract layer. An
          optional ISanctionsOracle, when wired in, blocks registration of
          listed addresses (§8.5/§10.5). A separate Foundation-funded subsidy
          programme (OperatorSubsidyManager) pays operators from a cUSDC pool
          during chaos-net only, against an off-chain eligibility list
          (typically KYB-attested). Operators absent from that list still
          participate normally — they only forgo the subsidy (§8.9). The
          operator set grows organically: N∈[5,10] at chaos-net (Jul 2026) →
          N=20 by end-2026 → N≥30 by Q1 2028, bounded by market emergence rather
          than gating (§8.11).
        </p>
      </Callout>

      <h2
        id="slashing"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Slashing mechanism
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Slashing is the penalty for operator misbehavior — submitting invalid
        proofs, censoring messages, or failing to relay within the designated
        window. The OperatorSlashingManager enforces a single stake-weighted
        quorum across the active operator set, using a challenge-vote-execute
        pattern. The slasher reward is 10% of the slashed cUSDC stake (§8.7,
        §8.10).
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The protocol specification calls for a CoordinatorRegistry with
        cross-graph slashing — requiring votes spanning at least three
        independent coordinator–operator graphs — but this is not yet shipped.{" "}
        <DocsBadge variant="amber">Spec&apos;d</DocsBadge> CoordinatorRegistry /
        cross-graph slashing is on the v1.0 track (§8.10).
      </p>

      <DocsTable columns={slashingColumns} rows={slashingRows} />

      <Callout variant="warning" title="chaos-net caveat">
        <p>
          chaos-net runs in public mode and is unaudited. Single-quorum slashing
          via OperatorSlashingManager is enforced, but the cross-graph slashing
          model is not yet shipped. Do not rely on the full slashing security
          model for production guarantees at this stage.
        </p>
      </Callout>

      <h2
        id="cross-chain-security"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Cross-chain security
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Cross-chain settlement uses Circle's CCTP (Cross-Chain Transfer
        Protocol) for native USDC bridging. The 5-step flow ensures that funds
        are never at risk in a third-party bridge contract.
      </p>

      <Steps>
        <Step title="Burn on source chain">
          <p>
            The escrow contract calls{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              TokenMessenger.depositForBurn()
            </code>{" "}
            on the source chain, burning the USDC and emitting a message.
          </p>
        </Step>
        <Step title="Attestation">
          <p>
            Circle's attestation service observes the burn event and produces a
            signed attestation confirming the burn amount and destination.
          </p>
        </Step>
        <Step title="Operator relays attestation">
          <p>
            A staked operator picks up the attestation and submits it to the
            destination chain's{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              MessageTransmitter
            </code>
            .
          </p>
        </Step>
        <Step title="Mint on destination chain">
          <p>
            The destination chain's CCTP contract verifies the attestation and
            mints fresh USDC to the settlement contract.
          </p>
        </Step>
        <Step title="Settlement completes">
          <p>
            The settlement contract on the destination chain releases the minted
            USDC to the escrow beneficiary. The escrow is marked as settled.
          </p>
        </Step>
      </Steps>

      <Callout variant="info" title="Trust assumption">
        <p>
          Cross-chain security depends on Circle's CCTP attestation service. If
          Circle's attesters are compromised, invalid mints could occur. This is
          the same trust assumption used by all CCTP-based applications.
        </p>
      </Callout>

      <h2
        id="smart-contract-security"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Smart contract security
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The contract stack uses battle-tested OpenZeppelin patterns combined
        with FHE-specific safeguards.
      </p>

      <DocsTable
        columns={contractSecurityColumns}
        rows={contractSecurityRows}
      />

      <h2
        id="known-limitations"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Known limitations (testnet)
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The current testnet deployment has several known limitations. These are
        documented transparently so builders can account for them.
      </p>

      <DocsTable columns={limitationColumns} rows={limitationRows} />

      <Callout variant="danger" title="Not production-ready">
        <p>
          ReineiraOS runs chaos-net in public mode and is unaudited. Do not use
          it for real funds or production applications. The security model will
          be audited and hardened before production launch.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
