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
    state: "Open",
    status: <DocsBadge variant="blue">Active</DocsBadge>,
    desc: "Escrow exists on-chain with owner and amount set. Not yet funded.",
  },
  {
    state: "Funded",
    status: <DocsBadge variant="amber">Active</DocsBadge>,
    desc: "Confidential funds deposited. The paidAmount is updated.",
  },
  {
    state: "Released",
    status: <DocsBadge variant="green">Final</DocsBadge>,
    desc: "Funds released to the owner. The isRedeemed flag is set. Terminal state.",
  },
  {
    state: "Refunded",
    status: <DocsBadge variant="default">Declared</DocsBadge>,
    desc: "Reserved in the Phase enum but not yet driven by any code path.",
  },
  {
    state: "Disputed",
    status: <DocsBadge variant="default">Declared</DocsBadge>,
    desc: "Reserved in the Phase enum but not yet driven by any code path.",
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
    event: "FeeStamped(escrowId, kind, bps, recipient)",
    when: "A third-party fee is recorded: the Condition fee at create() (from the Gate's getConditionFee), the Underwriter fee at coverage purchase. The Protocol slot is reserved and never stamped — the protocol charges nothing.",
  },
  {
    event: "FeeDistributed(escrowId, kind, amount, recipient)",
    when: "A stamped fee is paid out to its recipient during settlement.",
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
        An Escrow moves through an{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          IEscrow.Phase
        </code>{" "}
        state machine. The enum declares five values — Open, Funded, Released,
        Refunded, Disputed — though only the first three are driven today.
        Transitions are triggered by on-chain calls. The{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          ConfidentialEscrow
        </code>{" "}
        contract holds owner, caller, amount, paidAmount, and the redeemed flag
        as FHE ciphertexts (caller is retained distinctly from owner for
        fee-authorisation checks); existence is the plaintext predicate
        escrowId &lt; counter. The owner-match, fully-funded, and not-redeemed
        checks are branchless — a failing redemption transfers zero instead of
        reverting, preventing information leakage — while the Gate condition is
        checked in plaintext and reverts.
      </p>

      <ArchitectureDiagram
        title="ESCROW STATE MACHINE"
        steps={[
          { label: "Create", sublabel: "Encrypted owner and amount" },
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
              the authorized and unauthorized branches emit identical events,
              charge identical gas, and return identically-shaped ciphertext —
              cryptographically indistinguishable on-chain. Encrypted state does
              not exist until v1.0 mainnet (Q4 2026), gated on Fhenix CoFHE.
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

      <Callout variant="warning" title="status() differs by track">
        <p>
          On the public track,{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            Escrow.status()
          </code>{" "}
          returns the real phase — Open (unfunded), Funded, or Released. On the
          encrypted track,{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            ConfidentialEscrow.status()
          </code>{" "}
          is a stub that always returns Open, because the real state lives in
          ciphertext — derive progress from events or the SDK helpers instead.
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

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The SDK encrypts the inputs and submits the call for you:
      </p>

      <CodeBlock
        filename="create-vault.ts"
        language="typescript"
        lines={[
          { content: "// The SDK encrypts owner and amount, then calls create()" },
          { content: "const escrow = await sdk.escrow.create({" },
          { content: "  amount: sdk.usdc(1000),", highlighted: true },
          { content: "  owner: beneficiary,", highlighted: true },
          {
            content:
              "  resolver: resolverAddr,   // Gate address (omit for unconditional)",
            highlighted: true,
          },
          {
            content:
              "  resolverData,             // bytes passed to onConditionSet()",
            highlighted: true,
          },
          { content: "})" },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4 mt-6">
        Or call the contract directly with pre-encrypted inputs:
      </p>

      <CodeBlock
        filename="create-vault-raw.ts"
        language="typescript"
        lines={[
          { content: "import { Contract } from 'ethers';" },
          { content: "// Replace with your compiled artifact." },
          {
            content:
              "import CONFIDENTIAL_ESCROW_ABI from './abi/ConfidentialEscrow.json';",
          },
          { content: "" },
          {
            content:
              "const escrow = new Contract(addresses.escrow, CONFIDENTIAL_ESCROW_ABI, signer);",
          },
          { content: "" },
          { content: "// encOwner / encAmount are encrypted client-side" },
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
        access to the owner and the coverage manager (if set).
      </p>

      <h2
        id="funding"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Funding an Escrow
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Deposit funds into the Escrow via{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          fund(uint256 escrowId, InEuint64 encryptedPayment)
        </code>{" "}
        or{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          fundFrom(uint256 escrowId, euint64 amount)
        </code>{" "}
        — the payer is always{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          _msgSender()
        </code>
        , so there is no explicit payer argument.{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          fund()
        </code>{" "}
        pulls an already-confidential FHERC20 balance via{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          confidentialTransferFrom
        </code>{" "}
        and updates the encrypted{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          paidAmount
        </code>
        . Wrapping plain USDC into a confidential balance happens upstream — only
        in{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          CCTPV2ConfidentialEscrowReceiver.settle()
        </code>
        , before it calls{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          fundFrom
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
        to settle the Escrow. The checks run in two stages — a plaintext Gate
        check, then the encrypted conditions.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        First, if a Gate is attached, the contract checks{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          IConditionResolver.isConditionMet(escrowId)
        </code>{" "}
        in plaintext via{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          _checkCondition()
        </code>{" "}
        and <strong>reverts</strong> with{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          ConditionNotMet
        </code>{" "}
        if it is false. Only after that does it evaluate the encrypted checks:
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
          The Escrow is fully funded —{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            paidAmount &gt;= amount
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
      </ul>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        These three encrypted checks are combined into a single encrypted
        boolean via FHE AND operations. If they pass, the encrypted{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          paidAmount
        </code>{" "}
        is transferred; if any fail, zero is transferred — no revert. The Gate
        condition is the only check that leaks, because it reverts in plaintext.
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
          {
            content:
              "// Gate condition was already checked in plaintext (reverts on failure).",
          },
          {
            content:
              "// The encrypted checks: owner match, fully funded, not yet redeemed.",
          },
          {
            content: "ebool canRedeem = FHE.and(",
            highlighted: true,
          },
          {
            content: "    FHE.and(",
            highlighted: true,
          },
          {
            content: "        FHE.eq(escrow.owner, FHE.asEaddress(msg.sender)),",
            highlighted: true,
          },
          {
            content: "        FHE.gte(escrow.paidAmount, escrow.amount)",
            highlighted: true,
          },
          {
            content: "    ),",
            highlighted: true,
          },
          {
            content: "    FHE.not(escrow.isRedeemed)",
            highlighted: true,
          },
          {
            content: ");",
            highlighted: true,
          },
          { content: "" },
          { content: "// Select payout or zero — no revert on failure" },
          {
            content:
              "euint64 payout = FHE.select(canRedeem, escrow.paidAmount, FHE.asEuint64(0));",
            highlighted: true,
          },
        ]}
      />

      <Callout variant="warning" title="Why no revert?">
        <p>
          A revert would leak information about <em>why</em> the encrypted
          redemption failed — wrong caller, not fully funded, or already
          redeemed. By always transferring (potentially zero), the contract
          hides those failure reasons from on-chain observers. The Gate
          condition is the exception: it is checked in plaintext and{" "}
          <strong>does</strong> revert on a single{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            redeem()
          </code>
          , so it leaks. In{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            redeemMultiple()
          </code>
          , a failing condition is silently{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            continue
          </code>
          d instead of reverting, so the batch still settles its other entries.
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
