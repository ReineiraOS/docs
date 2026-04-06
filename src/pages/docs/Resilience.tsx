import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import ArchitectureDiagram from "@/components/docs/ArchitectureDiagram";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "design-philosophy", title: "Design philosophy", level: 2 },
  { id: "failure-scenarios", title: "Failure scenarios", level: 2 },
  {
    id: "cctp-attestation-failure",
    title: "CCTP attestation failure",
    level: 3,
  },
  { id: "operator-offline", title: "Operator offline", level: 3 },
  {
    id: "pool-liquidity-exhaustion",
    title: "Pool liquidity exhaustion",
    level: 3,
  },
  { id: "malicious-resolver", title: "Malicious resolver", level: 3 },
  { id: "relayer-down", title: "Meta-tx relayer down", level: 3 },
  { id: "trust-assumptions", title: "Trust assumptions", level: 2 },
  { id: "circuit-breakers", title: "Circuit breakers", level: 2 },
];

const { prev, next } = getPrevNext("/learn/resilience");

const maliciousResolverColumns = [
  { header: "Failure mode", key: "mode", width: "180px" },
  { header: "Behavior", key: "behavior" },
  { header: "Protocol response", key: "response" },
];
const maliciousResolverRows = [
  {
    mode: "Always returns true",
    behavior:
      "Escrow is redeemable immediately regardless of actual condition.",
    response:
      "No protocol-level defense — escrow creator chose this resolver. Escrow terms are immutable once created.",
  },
  {
    mode: "Always returns false",
    behavior: "Escrow cannot be redeemed. Funds remain locked.",
    response:
      "The protocol uses a silent failure pattern — redeem() transfers zero instead of reverting. No funds are at risk of being stolen, but they remain locked.",
  },
  {
    mode: "Reverts on call",
    behavior: "isConditionMet() reverts, blocking redemption attempts.",
    response:
      "Same as always-false — the escrow cannot be redeemed through normal flow.",
  },
];

const trustColumns = [
  { header: "Component", key: "component", width: "180px" },
  { header: "Trust level", key: "trust", width: "140px" },
  { header: "What if compromised", key: "impact" },
];
const trustRows = [
  {
    component: "Circle CCTP",
    trust: "External dependency",
    impact:
      "Invalid USDC mints on destination chain. All CCTP-based apps would be affected.",
  },
  {
    component: "FHE coprocessor",
    trust: "External dependency",
    impact:
      "FHE key compromise could expose encrypted values. All on-chain privacy guarantees would be void.",
  },
  {
    component: "Resolvers (Gates)",
    trust: "User-selected",
    impact:
      "Incorrect release or permanent lock. The creator chose the resolver — the protocol cannot override that choice.",
  },
  {
    component: "Operators",
    trust: "Staked + slashable",
    impact:
      "Censorship or delayed relay. Mitigated by 3-tier fallback and permissionless relay after timeout.",
  },
  {
    component: "Meta-tx relayer",
    trust: "Convenience only",
    impact:
      "Users cannot send gasless transactions. Users must send transactions directly — no fund risk.",
  },
  {
    component: "Proxy admin",
    trust: "Owner-controlled",
    impact:
      "Malicious upgrade could change contract logic. Mitigated by planned timelock and eventual decentralization.",
  },
  {
    component: "Solidity compiler",
    trust: "Toolchain",
    impact:
      "Compiler bug could produce incorrect bytecode. Standard risk for all EVM projects.",
  },
];

const circuitBreakerColumns = [
  { header: "Mechanism", key: "mechanism", width: "200px" },
  { header: "Protects against", key: "protects" },
  { header: "Details", key: "details" },
];
const circuitBreakerRows = [
  {
    mechanism: "Silent failure (FHE.select)",
    protects: "Information leakage on failed redemption",
    details:
      "Failed redeem() calls transfer zero instead of reverting. FHE.select() chooses between paidAmount or zero based on encrypted conditions — hiding why a redemption failed.",
  },
  {
    mechanism: "Reentrancy guards",
    protects: "Callback-based exploits",
    details:
      "All external functions use nonReentrant. State is updated before external calls (checks-effects-interactions).",
  },
  {
    mechanism: "ERC-7201 namespaced storage",
    protects: "Storage collisions on upgrade",
    details:
      "Each module has a unique storage namespace derived from a deterministic hash. No two modules can overwrite each other's state.",
  },
  {
    mechanism: "Replay protection",
    protects: "Proof reuse attacks",
    details:
      "Every Reclaim proof has a unique nullifier. Used nullifiers are stored in a mapping and rejected on resubmission.",
  },
  {
    mechanism: "Freshness checks",
    protects: "Stale proof attacks",
    details:
      "Proofs must be generated within a configurable time window. Expired proofs are rejected.",
  },
  {
    mechanism: "Escrow isolation",
    protects: "Cross-escrow contamination",
    details:
      "Each escrow is an independent state machine. A failure in one escrow cannot affect another.",
  },
  {
    mechanism: "Initializer guards",
    protects: "Re-initialization attacks",
    details:
      "Proxy contracts can only be initialized once. Subsequent calls to initialize() revert.",
  },
];

export default function Resilience() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Resilience & Recovery"
        description="Fault tolerance, recovery mechanisms, and failure scenarios."
        readingTime="8 min read"
      />

      <h2
        id="design-philosophy"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Design philosophy
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS is designed around two resilience principles:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Privacy-preserving failure
          </strong>{" "}
          — When something breaks, encrypted data stays encrypted. The silent
          failure pattern (FHE.select) ensures failed redemptions transfer zero
          instead of reverting, preventing information leakage about why a
          redemption failed.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Operator fallback
          </strong>{" "}
          — Cross-chain relay has a 3-tier fallback. If the assigned operator
          goes offline, other operators can relay. After the permissionless
          delay, anyone can relay — no stake required.
        </li>
      </ul>

      <h2
        id="failure-scenarios"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Failure scenarios
      </h2>

      <h3
        id="cctp-attestation-failure"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        CCTP attestation failure
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          What breaks:
        </strong>{" "}
        Circle's attestation service is unavailable or delayed. The burn event
        on the source chain is confirmed, but no attestation is produced.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          Impact:
        </strong>{" "}
        Cross-chain settlement is paused. Funds are burned on the source chain
        but not yet minted on the destination. The escrow is in a "pending
        settlement" state.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          Recovery:
        </strong>{" "}
        Once the attestation service recovers, an operator (or anyone after the
        permissionless delay) can submit the attestation to the destination
        chain and complete the settlement.
      </p>

      <h3
        id="operator-offline"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Operator offline
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          What breaks:
        </strong>{" "}
        The assigned operator fails to relay a cross-chain message within the
        exclusive window.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          Impact:
        </strong>{" "}
        Settlement is delayed but never permanently blocked. The 3-tier fallback
        system ensures another operator or any user can complete the relay.
      </p>

      <ArchitectureDiagram
        title="3-TIER OPERATOR FALLBACK"
        steps={[
          {
            label: "Exclusive (0–60s)",
            sublabel: "Assigned operator has sole relay rights",
          },
          {
            label: "Open (60–600s)",
            sublabel: "Any staked operator can relay for the fee",
          },
          {
            label: "Permissionless (600s+)",
            sublabel: "Anyone can relay — no stake required",
          },
        ]}
      />

      <Callout variant="info" title="Liveness guarantee">
        <p>
          After the permissionless delay (600 seconds), relay is open to any
          address. Even if every operator in the network is offline, any EOA can
          submit the attestation and complete settlement.
        </p>
      </Callout>

      <h3
        id="pool-liquidity-exhaustion"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Pool liquidity exhaustion
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          What breaks:
        </strong>{" "}
        An insurance pool does not have enough liquidity to cover a claim.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          Impact:
        </strong>{" "}
        The claim payout is limited to whatever is available in the pool.
        Insurance pools are isolated — one pool's exhaustion cannot drain
        another.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          Recovery:
        </strong>{" "}
        As new premiums flow in or underwriters add capital, the pool regains
        liquidity. All accounting is encrypted — claimants cannot see the pool's
        remaining balance.
      </p>

      <h3
        id="malicious-resolver"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Malicious resolver
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          What breaks:
        </strong>{" "}
        A resolver contract is buggy or intentionally malicious.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          Impact:
        </strong>{" "}
        Depends on the failure mode. The escrow creator chose the resolver, so
        the protocol treats it as a user decision. A malicious resolver can
        block redemption (griefing) but cannot redirect funds.
      </p>

      <DocsTable
        columns={maliciousResolverColumns}
        rows={maliciousResolverRows}
      />

      <Callout variant="warning" title="Resolver selection is critical">
        <p>
          The protocol cannot protect you from a bad resolver — it can only
          ensure that a bad resolver cannot affect <em>other</em> escrows.
          Always audit resolver code before attaching it to an escrow with real
          value.
        </p>
      </Callout>

      <h3
        id="relayer-down"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Meta-tx relayer down
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          What breaks:
        </strong>{" "}
        The ERC-2771 trusted forwarder / relayer service is unavailable.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          Impact:
        </strong>{" "}
        Users cannot send gasless transactions. The privacy benefit of hiding
        the real sender is temporarily lost.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          Recovery:
        </strong>{" "}
        Users send transactions directly from their wallet. The user's wallet
        pays gas and{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          msg.sender
        </code>{" "}
        becomes the actual user address. No funds are at risk — only the
        convenience and privacy benefits of meta-transactions are temporarily
        unavailable.
      </p>

      <h2
        id="trust-assumptions"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Trust assumptions
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Every protocol has trust assumptions. Here is an honest accounting of
        what ReineiraOS depends on and what happens if each component is
        compromised.
      </p>

      <DocsTable columns={trustColumns} rows={trustRows} />

      <h2
        id="circuit-breakers"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Circuit breakers
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Defensive mechanisms built into the protocol that activate automatically
        when something goes wrong.
      </p>

      <DocsTable columns={circuitBreakerColumns} rows={circuitBreakerRows} />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
