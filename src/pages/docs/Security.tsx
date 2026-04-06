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
    param: "Staking token",
    value: "TBD",
    desc: "Will be the REINEIRA governance token. On testnet a mock ERC-20 is used. The OperatorRegistry accepts any ERC-20 configured at deployment.",
  },
  {
    param: "Minimum stake",
    value: "TBD",
    desc: "Configurable via setConfig() on the OperatorRegistry. Final amount will be set with the REINEIRA token launch.",
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
    param: "Slash reward",
    value: "10%",
    desc: "The challenger receives 10% of the slashed amount (1000 bps).",
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
    limitation: "No slashing enforcement",
    impact:
      "Slash parameters are defined in contracts but not enforced on testnet. Malicious operators face no penalty.",
    plan: "Full slashing contract with on-chain challenge/vote/execute flow.",
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
        Operators must post collateral to participate in the relay network.
        Staking creates economic alignment — operators lose money if they
        misbehave, and earn fees when they relay honestly.
      </p>

      <DocsTable columns={stakingColumns} rows={stakingRows} />

      <h2
        id="slashing"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Slashing mechanism
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Slashing is the penalty for operator misbehavior — submitting invalid
        proofs, censoring messages, or failing to relay within the designated
        window. The mechanism uses a challenge-vote-execute pattern.
      </p>

      <DocsTable columns={slashingColumns} rows={slashingRows} />

      <Callout variant="warning" title="Testnet caveat">
        <p>
          Slashing parameters are defined in the protocol specification but are
          not enforced on testnet. Operators can misbehave without penalty
          during the testnet phase. Do not rely on slashing for security
          guarantees at this stage.
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
          ReineiraOS is in active testnet. Do not use it for real funds or
          production applications. The security model will be audited and
          hardened before production launch.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
