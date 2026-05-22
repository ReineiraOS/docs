import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import RiskCallout from "@/components/docs/RiskCallout";
import CodeBlock from "@/components/docs/CodeBlock";
import ArchitectureDiagram from "@/components/docs/ArchitectureDiagram";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import DocsBadge from "@/components/docs/DocsBadge";
import ModeToggle from "@/components/docs/ModeToggle";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "modes", title: "Public vs encrypted mode", level: 2 },
  { id: "states", title: "Escrow states", level: 2 },
  { id: "creating", title: "Creating an Escrow", level: 2 },
  { id: "funding", title: "Funding an Escrow", level: 2 },
  { id: "redeeming", title: "Redeeming an Escrow", level: 2 },
  { id: "silent-failure", title: "Silent failure pattern", level: 2 },
  { id: "virtual-escrows", title: "Virtual escrows", level: 2 },
  { id: "events", title: "Events reference", level: 2 },
];

const { prev, next } = getPrevNext("/build/escrow-lifecycle");

const stateColumns = [
  { header: "State", key: "state", width: "140px" },
  { header: "Status", key: "status", width: "100px" },
  { header: "Description", key: "desc" },
];
const stateRows = [
  {
    state: "Created",
    status: <DocsBadge variant="blue">Active</DocsBadge>,
    desc: "Escrow exists on-chain with encrypted owner and amount. Not yet funded.",
  },
  {
    state: "Funded",
    status: <DocsBadge variant="amber">Active</DocsBadge>,
    desc: "USDC deposited and wrapped into ConfidentialUSDC. The encrypted paidAmount is updated.",
  },
  {
    state: "Redeemed",
    status: <DocsBadge variant="green">Final</DocsBadge>,
    desc: "Funds released to the owner. The encrypted isRedeemed flag is set. Terminal state.",
  },
];

const eventColumns = [
  { header: "Event", key: "event", mono: true, width: "200px" },
  { header: "Emitted when", key: "when" },
];
const eventRows = [
  {
    event: "EscrowCreated(escrowId)",
    when: "A new Escrow is successfully created via create().",
  },
  {
    event: "EscrowFunded(escrowId, payer)",
    when: "USDC is deposited into the Escrow via fund() or fundFrom().",
  },
  {
    event: "EscrowRedeemed(escrowId)",
    when: "The Escrow is redeemed via redeem(). Funds transferred to owner.",
  },
  {
    event: "EscrowBatchRedeemed(escrowIds)",
    when: "Multiple Escrows redeemed in a single call via redeemMultiple().",
  },
  {
    event: "FeeSet(escrowId)",
    when: "An insurance fee is attached to the Escrow by the insurance manager.",
  },
];

export default function EscrowLifecycle() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Escrow Lifecycle"
        description="The full state machine for Escrows — from creation through funding, Gate verification, and redemption."
        readingTime="7 min read"
      />

      <RiskCallout />

      <h2
        id="overview"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Overview
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        A Escrow is a state machine with three states. Transitions are triggered
        by on-chain calls. The{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          ConfidentialEscrow
        </code>{" "}
        contract uses FHE-encrypted flags and a silent failure pattern — failed
        redemptions transfer zero instead of reverting, preventing information
        leakage.
      </p>

      <ArchitectureDiagram
        title="ESCROW STATE MACHINE"
        steps={[
          { label: "Create", sublabel: "Encrypted owner + amount" },
          { label: "Fund", sublabel: "Deposit USDC" },
          { label: "Redeem", sublabel: "Gate check → funds released" },
        ]}
      />

      <h2
        id="modes"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Public vs encrypted mode
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The Escrow primitive ships in two modes with identical interfaces.
        Chaos-net runs <strong>public mode</strong>; encrypted mode is a
        separate immutable deployment that activates at v1.0 mainnet.
      </p>

      <ModeToggle
        publicMode={
          <div>
            <p>
              State is stored in plaintext: the owner, amount, paid amount, and
              redemption flag are readable on-chain. The lifecycle (create →
              fund → redeem) and the silent-failure pattern behave identically
              to encrypted mode — only the visibility of state differs. This is
              what runs at chaos-net today.
            </p>
          </div>
        }
        encryptedMode={
          <div>
            <p>
              The owner, amount, paid amount, and redemption flag are held as
              FHE ciphertexts (<code>eaddress</code>, <code>euint64</code>,{" "}
              <code>ebool</code>). Redemption uses <code>FHE.select()</code> so
              success and failure are indistinguishable on-chain. Encrypted
              state does not exist until v1.0 mainnet (Q4 2026), gated on Fhenix
              CoFHE.
            </p>
          </div>
        }
      />

      <h2
        id="states"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Escrow states
      </h2>

      <DocsTable columns={stateColumns} rows={stateRows} />

      <Callout variant="info" title="Encrypted state flags">
        <p>
          The{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            isRedeemed
          </code>{" "}
          flag is stored as{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            ebool
          </code>{" "}
          — an FHE-encrypted boolean. On-chain observers cannot tell whether an
          Escrow has been redeemed by inspecting storage.
        </p>
      </Callout>

      <h2
        id="creating"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Creating an Escrow
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Call{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          ConfidentialEscrow.create()
        </code>{" "}
        with FHE-encrypted owner and amount, plus an optional Gate address. If a
        Gate is provided,{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          onConditionSet()
        </code>{" "}
        is called atomically during creation.
      </p>

      <CodeBlock
        filename="create-vault.ts"
        language="typescript"
        lines={[
          { content: "import { Encryptable } from '@cofhe/sdk';" },
          {
            content:
              "import { createCofheConfig, createCofheClient } from '@cofhe/sdk/node';",
          },
          { content: "import { arbSepolia } from '@cofhe/sdk/chains';" },
          { content: "" },
          { content: "// 1. Initialize the FHE client" },
          {
            content:
              "const client = createCofheClient(createCofheConfig({ supportedChains: [arbSepolia] }));",
          },
          { content: "await client.connect(publicClient, walletClient);" },
          { content: "" },
          { content: "// 2. Encrypt owner and amount client-side" },
          {
            content: "const [encOwner, encAmount] = await client",
          },
          {
            content:
              "  .encryptInputs([Encryptable.address(beneficiary), Encryptable.uint64(amount)])",
          },
          { content: "  .execute();" },
          { content: "" },
          { content: "// 2. Create the Escrow on-chain", highlighted: true },
          { content: "const tx = await escrow.create(", highlighted: true },
          {
            content: "  encOwner,       // InEaddress — encrypted beneficiary",
            highlighted: true,
          },
          {
            content: "  encAmount,      // InEuint64 — encrypted amount",
            highlighted: true,
          },
          {
            content:
              "  resolverAddr,   // Gate address (or address(0) for unconditional)",
            highlighted: true,
          },
          {
            content: "  resolverData,   // bytes passed to onConditionSet()",
            highlighted: true,
          },
          { content: ");", highlighted: true },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The contract stores the encrypted values and grants{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          FHE.allow()
        </code>{" "}
        access to the owner and the insurance manager (if set).
      </p>

      <h2
        id="funding"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Funding an Escrow
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Deposit USDC into the Escrow via{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          fund(escrowId, amount)
        </code>{" "}
        or{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          fundFrom(escrowId, amount, payer)
        </code>
        . The contract wraps the USDC into ConfidentialUSDC and updates the
        encrypted{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          paidAmount
        </code>
        . Cross-chain funding via CCTP is handled by the SDK's bridge module.
      </p>

      <h2
        id="redeeming"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Redeeming an Escrow
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Call{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          redeem(escrowId)
        </code>{" "}
        to settle the Escrow. The contract checks:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>
          The caller matches the encrypted{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            owner
          </code>{" "}
          (via FHE comparison)
        </li>
        <li>
          The Escrow has not already been redeemed (via encrypted{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            isRedeemed
          </code>{" "}
          flag)
        </li>
        <li>
          If a Gate is attached,{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            IConditionResolver.isConditionMet(escrowId)
          </code>{" "}
          returns true
        </li>
      </ul>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        All three checks are combined into a single encrypted boolean via FHE
        AND operations. If all conditions pass, the encrypted{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          paidAmount
        </code>{" "}
        is transferred. If any fail, zero is transferred — no revert.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        For batch redemption, use{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          redeemMultiple(escrowIds)
        </code>{" "}
        to settle multiple Escrows in a single transaction.
      </p>

      <h2
        id="silent-failure"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Silent failure pattern
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The escrow contract uses{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          FHE.select()
        </code>{" "}
        to choose between the actual payout or zero based on encrypted
        conditions:
      </p>

      <CodeBlock
        filename="ConfidentialEscrow.sol"
        language="solidity"
        lines={[
          { content: "// Combine all checks into a single encrypted boolean" },
          {
            content:
              "ebool canRedeem = FHE.and(isOwner, FHE.and(notRedeemed, conditionMet));",
            highlighted: true,
          },
          { content: "" },
          { content: "// Select payout or zero — no revert on failure" },
          {
            content:
              "euint64 payout = FHE.select(canRedeem, escrow.paidAmount, zeroAmount);",
            highlighted: true,
          },
        ]}
      />

      <Callout variant="warning" title="Why no revert?">
        <p>
          A revert would leak information about <em>why</em> the redemption
          failed — wrong caller, already redeemed, or condition not met. By
          always transferring (potentially zero), the contract hides the failure
          reason from on-chain observers.
        </p>
      </Callout>

      <h2
        id="virtual-escrows"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Virtual escrows
      </h2>

      <div className="mb-3">
        <DocsBadge variant="amber">Spec'd · chaos-net v1.0</DocsBadge>
      </div>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The v1.0 specification lists{" "}
        <strong>virtual escrow (event-triggered without pre-funding)</strong>{" "}
        alongside batch and conditional escrow as a supported mode. The shipped{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          ConfidentialEscrow
        </code>{" "}
        does not yet expose a dedicated virtual-escrow code path: an unfunded
        record is indistinguishable from a created-but-not-yet-funded record,
        and any cross-chain receiver can call{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          fundFrom
        </code>{" "}
        against an existing{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          escrowId
        </code>{" "}
        to satisfy the event-triggered semantics.
      </p>

      <Callout variant="info" title="Convergence tracked for chaos-net v1.0">
        <p>
          Whether a separate virtual-escrow surface is needed — or whether the
          existing{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            create
          </code>{" "}
          /{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            fundFrom
          </code>{" "}
          pair is the canonical realisation — is an open Implementation Note,
          tracked for chaos-net v1.0. Do not build against a dedicated
          virtual-escrow API until it ships.
        </p>
      </Callout>

      <h2
        id="events"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Events reference
      </h2>

      <DocsTable columns={eventColumns} rows={eventRows} />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
