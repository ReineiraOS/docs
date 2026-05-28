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
    desc: "Operators bond cUSDC, an immutable ERC-7984 USDC wrapper — not a governance token. The OperatorRegistry accepts the configured bond asset.",
  },
  {
    param: "Minimum bond",
    value: "Config",
    desc: "Configurable via setConfig() on the OperatorRegistry. Denominated in cUSDC. The REINEIRA token does not exist yet — it is conditional on future triggers with no date.",
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
    desc: "The slasher receives 10% of the slashed cUSDC stake (1000 bps).",
  },
];

const contractSecurityColumns = [
  { header: "Mechanism", key: "mechanism", width: "200px" },
  { header: "Standard", key: "standard", mono: true, width: "140px" },
  { header: "Purpose", key: "purpose" },
];
const contractSecurityRows = [
  {
    mechanism: "Proxy pattern (testnet only)",
    standard: "UUPS",
    purpose:
      "UUPS upgradeable on chaos-net testnet via TestnetCoreBase. Removed at v1.0 mainnet: every contract becomes an immutable singleton, no _authorizeUpgrade hook, no upgrade authority (Whitepaper §11.8).",
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
      "Single-owner admin pattern on chaos-net for parameter custody and emergency response. Deploy posture is a Safe multisig behind a TimelockController (Whitepaper §10.6). Upgrade authority is eliminated entirely at v1.0 mainnet.",
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
    limitation: "Single canonical coordinator in production",
    impact:
      "Only the Foundation-operated coordinator runs in chaos-net. If it stalls, the canonical relay queue backs up. Third parties may already run independent coordinators against the same OperatorRegistry / TaskExecutor contracts.",
    plan: "On-chain CoordinatorRegistry + cross-graph slashing (votes spanning ≥3 independent coordinator–operator graphs) on the v1.0 track.",
  },
  {
    limitation: "In-memory operator state",
    impact:
      "Operator relay job state is held in-memory; on restart, pending jobs may need manual resubmission via the operator CLI.",
    plan: "Persistent state store with automatic recovery.",
  },
  {
    limitation: "Cross-graph slashing not yet shipped",
    impact:
      "The four-stage pipeline (5% bond → 3-day challenge → 4-day vote → 14-day expiry, QUORUM_BPS = 1000) is shipped. Whitepaper §8.6 argues the four-stage moat — not the quorum threshold — is the load-bearing safety property; the 10% quorum is intentional, not a transitional limitation.",
    plan: "Cross-graph slashing (multi-graph attestation) is tracked for the v1.0 hardening lock; not a blocker for chaos-net.",
  },
  {
    limitation: "Testnet UUPS proxy posture",
    impact:
      "Testnet contracts inherit TestnetCoreBase (Initializable + UUPS + Ownable + ReentrancyGuard + ERC-2771) so we can iterate. The owner can still upgrade contracts; trust is not yet structurally eliminated.",
    plan: "v1.0 mainnet contracts drop UUPS entirely and ship as immutable singletons (Whitepaper §11.8). Upgrade authority is removed at the bytecode level.",
  },
  {
    limitation: "CoFHE substrate trust (encrypted mode)",
    impact:
      "FHE coprocessor is a single-substrate trust counterparty: liveness, key management, and attestation rest on its operator quorum, not on the host chain's validator set. Confidentiality is conditional on TFHE IND-CPA security (TA1) and CoFHE correctness (TA2).",
    plan: "Threshold-FHE, MPC distribution, or hardware attestation — tracked as Open Problem 4.1 in the whitepaper, decision target pre-mainnet.",
  },
  {
    limitation: "No external audit at chaos-net launch",
    impact:
      "Phase 7 internal review remediated ~85 findings including 8 mainnet blockers; Slither / Aderyn baselines dated 2026-05-04. Use of chaos-net during Jun 2026 → Q4 2026 is at the user's own risk (Whitepaper §10.6).",
    plan: "External audit committed for v1.0 hardening (Q4 2026 mainnet); auditor selection gated on Standard-tier budget.",
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
        You post a cUSDC bond to join the relay network. Bonding aligns
        incentives — you lose money if you misbehave, and earn fees when you
        relay honestly. Registration is permissionless from chaos-net day 1: any
        address that meets the bond, is sanctions-clean, and has not been
        previously slashed can register at the contract layer, no Foundation
        invitation needed.
      </p>

      <DocsTable columns={stakingColumns} rows={stakingRows} />

      <Callout
        variant="info"
        title="Permissionless registration and sanctions screening"
      >
        <p>
          The OperatorRegistry is permissionless at the contract layer. An
          optional ISanctionsOracle, when wired in, blocks registration of
          listed addresses. A separate Foundation-funded subsidy programme
          (OperatorSubsidyManager) pays operators from a cUSDC pool during
          chaos-net only, against an off-chain eligibility list (typically
          KYB-attested). If you're not on that list you still participate
          normally — you just forgo the subsidy. The operator set grows
          organically: N∈[5,10] at chaos-net (Jul 2026) → N=20 by end-2026 →
          N≥30 by Q1 2028, bounded by market demand rather than gating.
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
        pattern. The slasher reward is 10% of the slashed cUSDC stake.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        A CoordinatorRegistry with cross-graph slashing — requiring votes
        spanning at least three independent coordinator–operator graphs — is
        planned but not yet shipped.{" "}
        <DocsBadge variant="amber">Spec&apos;d</DocsBadge> CoordinatorRegistry /
        cross-graph slashing is on the v1.0 track.
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
