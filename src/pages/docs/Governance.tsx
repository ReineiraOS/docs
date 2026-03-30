import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import Steps, { Step } from "@/components/docs/Steps";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "current-model", title: "Current model", level: 2 },
  { id: "admin-permissions", title: "Admin permissions", level: 2 },
  { id: "uups-proxy", title: "UUPS proxy pattern", level: 2 },
  { id: "erc-7201-storage", title: "ERC-7201 storage safety", level: 2 },
  { id: "upgrade-lifecycle", title: "Upgrade lifecycle", level: 2 },
  {
    id: "path-to-decentralization",
    title: "Path to decentralization",
    level: 2,
  },
  { id: "immutable-guarantees", title: "Immutable guarantees", level: 2 },
];

const { prev, next } = getPrevNext("/docs/learn/governance");

const adminCanColumns = [
  { header: "Action", key: "action", width: "220px" },
  { header: "Permission", key: "permission", width: "100px" },
  { header: "Details", key: "details" },
];
const adminCanRows = [
  {
    action: "Upgrade implementation",
    permission: "Can",
    details:
      "Deploy a new implementation contract and point the UUPS proxy to it. All state is preserved.",
  },
  {
    action: "Pause / unpause",
    permission: "Can",
    details:
      "Pause all escrow operations in an emergency. Existing escrows are frozen but not lost.",
  },
  {
    action: "Add / remove operators",
    permission: "Can",
    details: "Whitelist or delist operators from the relay network.",
  },
  {
    action: "Set fee parameters",
    permission: "Can",
    details: "Adjust relay fees, protocol fees, and insurance pool parameters.",
  },
  {
    action: "Access escrow funds",
    permission: "Cannot",
    details:
      "Funds are held by the contract, not the admin. No admin function can withdraw or redirect escrowed funds.",
  },
  {
    action: "Modify escrow terms",
    permission: "Cannot",
    details:
      "Once created, an escrow's amount, beneficiary, resolver, and expiry are immutable.",
  },
  {
    action: "Bypass resolvers",
    permission: "Cannot",
    details:
      "The admin cannot force-resolve an escrow. Only the attached resolver can trigger release.",
  },
  {
    action: "Redirect payouts",
    permission: "Cannot",
    details:
      "Payout destination is set at creation time and cannot be changed by any party.",
  },
  {
    action: "Decrypt FHE data",
    permission: "Cannot",
    details:
      "Decryption requires coordinator threshold signatures. The admin key is not an FHE decryption key.",
  },
  {
    action: "Mint or burn tokens",
    permission: "Cannot",
    details:
      "The protocol uses existing tokens (USDC). No mint/burn capability exists in the contracts.",
  },
];

const storageComparisonColumns = [
  { header: "Approach", key: "approach", width: "180px" },
  { header: "Storage location", key: "location" },
  { header: "Collision risk", key: "risk", width: "120px" },
];
const storageComparisonRows = [
  {
    approach: "Traditional (slot 0, 1, 2...)",
    location:
      "Sequential slots starting at 0. New variables in upgrades must be appended.",
    risk: "High",
  },
  {
    approach: "ERC-7201 namespaced",
    location:
      "Deterministic slot derived from keccak256(namespace). Each module gets a unique, non-overlapping region.",
    risk: "None",
  },
];

const upgradeLifecycleColumns = [
  { header: "Phase", key: "phase", width: "120px" },
  { header: "Current (testnet)", key: "testnet" },
];
const upgradeLifecycleRows = [
  { phase: "Proposal", testnet: "Admin deploys new implementation directly." },
  { phase: "Review", testnet: "No review period — immediate execution." },
  { phase: "Execution", testnet: "Admin calls upgradeTo() on the proxy." },
  { phase: "Verification", testnet: "Manual testing on testnet." },
  {
    phase: "Rollback",
    testnet: "Deploy previous implementation and upgrade again.",
  },
];

export default function Governance() {
  return (
    <DocsLayout
      toc={toc}
      editHref="https://github.com/reineiraos/docs/edit/main/learn/governance.mdx"
    >
      <Breadcrumbs />

      <PageHeader
        title="Governance & Upgrades"
        description="Protocol governance, upgrade process, and timelock controls."
        readingTime="10 min read"
      />

      <h2
        id="current-model"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Current model
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS is currently in testnet with an{" "}
        <strong className="text-docs-text-primary font-semibold">
          owner-controlled
        </strong>{" "}
        governance model. A single admin address (planned to be a multisig)
        controls upgrades, operator management, and fee parameters. This is
        intentional for the testnet phase — rapid iteration requires fast
        upgrades without governance overhead.
      </p>

      <Callout variant="info" title="Testnet governance">
        <p>
          The current owner-controlled model is a temporary measure for testnet.
          The protocol will progressively decentralize through the phases
          described below. The admin's powers are already limited by design —
          see the permissions table.
        </p>
      </Callout>

      <h2
        id="admin-permissions"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Admin permissions
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The admin has operational control but cannot access or redirect user
        funds. This separation is enforced at the smart contract level — there
        are no admin functions that touch escrow balances.
      </p>

      <DocsTable columns={adminCanColumns} rows={adminCanRows} />

      <h2
        id="uups-proxy"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        UUPS proxy pattern
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        All core contracts use the UUPS (Universal Upgradeable Proxy Standard)
        pattern. Unlike transparent proxies, UUPS places the upgrade logic in
        the <em>implementation</em> contract, not the proxy. This means the
        implementation can remove its own upgradeability — a key requirement for
        the immutability phase.
      </p>

      <CodeBlock
        filename="TestnetCoreBase.sol"
        language="solidity"
        lines={[
          { content: "// SPDX-License-Identifier: MIT" },
          { content: "pragma solidity ^0.8.24;" },
          { content: "" },
          {
            content:
              'import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";',
          },
          {
            content:
              'import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";',
          },
          {
            content:
              'import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";',
          },
          {
            content:
              'import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";',
          },
          { content: "" },
          {
            content: "abstract contract TestnetCoreBase is",
            highlighted: true,
          },
          { content: "    Initializable,", highlighted: true },
          { content: "    UUPSUpgradeable,", highlighted: true },
          { content: "    OwnableUpgradeable,", highlighted: true },
          { content: "    ReentrancyGuardUpgradeable", highlighted: true },
          { content: "{", highlighted: true },
          { content: "    /// @notice Only the owner can authorize upgrades" },
          {
            content:
              "    function _authorizeUpgrade(address newImplementation)",
          },
          { content: "        internal" },
          { content: "        override" },
          { content: "        onlyOwner" },
          { content: "    {}" },
          { content: "" },
          { content: "    // ... module-specific logic" },
          { content: "}" },
        ]}
        showLineNumbers={true}
      />

      <Callout variant="tip" title="Why UUPS over transparent proxy?">
        <p>
          UUPS is more gas-efficient (no admin slot check on every call) and
          gives the implementation contract control over its own upgradeability.
          This allows a future implementation to remove{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            _authorizeUpgrade()
          </code>
          , making the contract permanently immutable.
        </p>
      </Callout>

      <h2
        id="erc-7201-storage"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        ERC-7201 storage safety
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Upgradeable contracts are notoriously fragile because new storage
        variables can collide with existing ones. ERC-7201 solves this by giving
        each module a unique, deterministic storage namespace.
      </p>

      <DocsTable
        columns={storageComparisonColumns}
        rows={storageComparisonRows}
      />

      <CodeBlock
        filename="NamespacedStorage.sol"
        language="solidity"
        lines={[
          { content: "// ERC-7201: Namespaced storage pattern" },
          { content: "" },
          {
            content:
              "/// @custom:storage-location erc7201:reineira.escrow.storage",
            highlighted: true,
          },
          { content: "struct EscrowStorage {" },
          { content: "    mapping(uint256 => Escrow) escrows;" },
          { content: "    uint256 nextEscrowId;" },
          { content: "}" },
          { content: "" },
          {
            content:
              '// Storage slot = keccak256("reineira.escrow.storage") - 1',
          },
          { content: "bytes32 private constant ESCROW_STORAGE_SLOT =" },
          {
            content: "    0x...; // deterministic, collision-resistant",
            highlighted: true,
          },
          { content: "" },
          {
            content:
              "function _getEscrowStorage() private pure returns (EscrowStorage storage $) {",
          },
          { content: "    assembly { $.slot := ESCROW_STORAGE_SLOT }" },
          { content: "}" },
        ]}
        showLineNumbers={true}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Each module — escrow, insurance, settlement — has its own namespace. You
        can add new fields to a module's storage struct without affecting other
        modules, and new modules can be added without risk of overwriting
        existing state.
      </p>

      <h2
        id="upgrade-lifecycle"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Upgrade lifecycle
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The current testnet upgrade process prioritizes speed and iteration.
      </p>

      <DocsTable
        columns={upgradeLifecycleColumns}
        rows={upgradeLifecycleRows}
      />

      <h2
        id="path-to-decentralization"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Path to decentralization
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS follows a four-phase decentralization roadmap. Each phase
        reduces admin power and increases community control.
      </p>

      <Steps>
        <Step title="Phase 1: Guarded Launch (current)">
          <p className="text-docs-text-secondary leading-relaxed">
            Single owner address with full admin control. Rapid iteration on
            testnet. No timelock, no governance overhead. The admin can upgrade,
            pause, and configure all parameters instantly. This phase is
            necessary for finding and fixing bugs quickly.
          </p>
        </Step>
        <Step title="Phase 2: Governed Upgrades">
          <p className="text-docs-text-secondary leading-relaxed">
            Admin transitions to a{" "}
            <strong className="text-docs-text-primary font-semibold">
              3-of-5 multisig
            </strong>{" "}
            with a{" "}
            <strong className="text-docs-text-primary font-semibold">
              48-hour timelock
            </strong>
            . All upgrades are publicly visible before execution. Emergency
            path: 2-of-3 subset can bypass timelock for critical fixes.
            Community can monitor and exit before upgrades take effect.
          </p>
        </Step>
        <Step title="Phase 3: Full Decentralization">
          <p className="text-docs-text-secondary leading-relaxed">
            Governance token holders vote on upgrades. Proposals require quorum
            and supermajority. Timelock extended to 7 days. The multisig retains
            emergency powers only — normal upgrades go through on-chain
            governance. Operator set is fully permissionless.
          </p>
        </Step>
        <Step title="Phase 4: Immutability Option">
          <p className="text-docs-text-secondary leading-relaxed">
            Governance can vote to{" "}
            <strong className="text-docs-text-primary font-semibold">
              remove upgradeability entirely
            </strong>{" "}
            from any module. Once removed, the module's logic is frozen forever.
            This is a one-way door — there is no way to re-enable upgrades.
            Individual modules can be frozen independently.
          </p>
        </Step>
      </Steps>

      <Callout variant="warning" title="Phase 4 is irreversible">
        <p>
          Removing upgradeability is permanent. A frozen module cannot be
          patched, even for critical vulnerabilities. This trade-off makes sense
          only for mature, battle-tested modules where immutability is more
          valuable than flexibility.
        </p>
      </Callout>

      <h2
        id="immutable-guarantees"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Immutable guarantees
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Regardless of the governance phase, certain properties are enforced at
        the smart contract level and cannot be changed by any admin, multisig,
        or governance vote:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Non-custodial
          </strong>{" "}
          — Funds are held by the contract, never by an admin or operator. No
          function exists to withdraw escrowed funds to an arbitrary address.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Encrypted by default
          </strong>{" "}
          — All financial data is FHE-encrypted. There is no admin function to
          store values in plaintext or bypass encryption.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Immutable terms
          </strong>{" "}
          — Once an escrow is created, its amount, beneficiary, resolver, and
          expiry cannot be modified. Not by the creator, not by the admin, not
          by governance.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Deterministic resolution
          </strong>{" "}
          — Escrow release is determined solely by the attached resolver's{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            isConditionMet()
          </code>{" "}
          return value. No override mechanism exists.
        </li>
      </ul>

      <Callout variant="tip" title="Trust minimization">
        <p>
          These guarantees mean you do not need to trust the admin to use the
          protocol safely. Even in Phase 1, the admin cannot steal funds, change
          escrow terms, or bypass resolution logic. The governance roadmap
          reduces trust further — but the core safety properties hold from day
          one.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
