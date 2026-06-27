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
  { id: "settlement-security", title: "Settlement security", level: 2 },
  { id: "cross-chain-security", title: "Cross-chain security", level: 2 },
  { id: "smart-contract-security", title: "Smart contract security", level: 2 },
  { id: "known-limitations", title: "Known limitations (testnet)", level: 2 },
];

const { prev, next } = getPrevNext("/learn/security");

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
      "Single coordinator instance for relayer burn-notification distribution. If the coordinator goes down, relayers are not notified — but settlement stays permissionless, so anyone can still settle directly.",
    plan: "Redundant coordinator instances with failover.",
  },
  {
    limitation: "Relayer liveness",
    impact:
      "Settlement speed depends on at least one relayer watching CCTP burns. If no relayer acts, cross-chain settlement is delayed until any party submits the attestation.",
    plan: "More independent relayer bots and self-serve settlement tooling.",
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
        id="settlement-security"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Settlement security
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Settlement is permissionless and secured by Circle&apos;s CCTP
        attestation, verified on-chain. Anyone can call{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          CCTPV2EscrowReceiver.settle(message, attestation)
        </code>{" "}
        to finalize a cross-chain transfer. There is no on-chain relayer
        registration, bonding, staking, or slashing — relayers are stateless
        bots that watch CCTP burns, fetch the Circle attestation, and submit the
        settlement transaction. A relayer only affects speed; if it is down,
        anyone can settle directly.
      </p>

      <Callout variant="info" title="No staking, no slashing">
        <p>
          Running a relayer requires no registration, bond, or sanctions
          screening at the contract layer — any address can run a relayer bot.
          Relayers earn no protocol fee and recover only their destination-chain
          gas. Invalid settlements are rejected at the contract level by
          verifying Circle&apos;s CCTP attestation, not through slashing or
          governance penalties. Loss coverage comes from Recourse pools, which
          are funded by LP capital and premiums and cap claims at pool liquidity
          — not from relayer collateral.
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
        <Step title="Relayer submits attestation">
          <p>
            Any relayer picks up the attestation and submits it to the
            destination chain's{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              MessageTransmitter
            </code>
            . Submission is permissionless — if no relayer acts, anyone can
            submit it directly.
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
          ReineiraOS runs the Arbitrum Sepolia testnet deployment in public mode
          and is unaudited. Do not use it for real funds or production
          applications. The security model will be audited and hardened before
          production launch.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
