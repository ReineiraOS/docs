import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "encrypted-vs-public", title: "Encrypted vs. public", level: 2 },
  { id: "how-fhe-works", title: "How FHE works", level: 2 },
  { id: "client-side-encryption", title: "Client-side encryption", level: 3 },
  { id: "event-privacy", title: "Event privacy", level: 2 },
  {
    id: "implications-for-builders",
    title: "Implications for builders",
    level: 2,
  },
];

const { prev, next } = getPrevNext("/learn/privacy-model");

const encryptedColumns = [
  { header: "Data", key: "data", width: "200px" },
  { header: "Visibility", key: "visibility", width: "120px" },
  { header: "Details", key: "details" },
];
const encryptedRows = [
  {
    data: "Escrow amount",
    visibility: "Encrypted",
    details:
      "Stored as euint64 — an FHE ciphertext handle. No party sees the cleartext amount on-chain.",
  },
  {
    data: "Escrow owner",
    visibility: "Encrypted",
    details:
      "Stored as eaddress. The beneficiary address is hidden from all on-chain observers.",
  },
  {
    data: "Paid amount",
    visibility: "Encrypted",
    details:
      "Running total of payments made, encrypted to prevent balance inference.",
  },
  {
    data: "Redemption status",
    visibility: "Encrypted",
    details: "Whether an Escrow has been settled is hidden via ebool.",
  },
  {
    data: "Insurance stakes",
    visibility: "Encrypted",
    details:
      "Underwriter stake amounts in insurance pools are stored as euint64.",
  },
  {
    data: "Risk scores",
    visibility: "Encrypted",
    details:
      "Policy risk evaluations (evaluateRisk) return euint64 — never exposed on-chain.",
  },
  {
    data: "Premiums",
    visibility: "Encrypted",
    details:
      "Computed homomorphically from encrypted coverage amount and risk score via FHE.mul() / FHE.div().",
  },
  {
    data: "Coverage amounts",
    visibility: "Encrypted",
    details: "Coverage amounts are stored as euint64 in the coverage manager.",
  },
  {
    data: "Dispute verdicts",
    visibility: "Encrypted",
    details: "Judge decisions return ebool — encrypted boolean verdicts.",
  },
  {
    data: "Escrow ID",
    visibility: "Public",
    details: "Sequential identifier — reveals existence but not contents.",
  },
  {
    data: "Gate address",
    visibility: "Public",
    details:
      "The Gate (condition resolver) contract address is visible on-chain.",
  },
  {
    data: "Transaction sender",
    visibility: "Public",
    details:
      "The msg.sender (or ERC-2771 forwarder) is visible as with any EVM transaction.",
  },
];

const eventColumns = [
  { header: "Event", key: "event", mono: true, width: "200px" },
  { header: "Emitted data", key: "emitted" },
  { header: "Hidden data", key: "hidden" },
];
const eventRows = [
  {
    event: "EscrowCreated",
    emitted: "escrowId",
    hidden: "amount, owner, Gate config",
  },
  {
    event: "EscrowFunded",
    emitted: "escrowId, payer address",
    hidden: "deposit amount, running total",
  },
  {
    event: "EscrowRedeemed",
    emitted: "escrowId",
    hidden: "settled amount, recipient",
  },
  {
    event: "CoveragePurchased",
    emitted: "coverageId",
    hidden: "coverage amount, holder, premium",
  },
  { event: "DisputeFiled", emitted: "coverageId", hidden: "dispute details" },
  {
    event: "CoverageClaimed",
    emitted: "coverageId",
    hidden: "payout amount, verdict",
  },
];

export default function PrivacyModel() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Privacy Model"
        description="How FHE encryption protects user data on-chain."
        readingTime="5 min read"
      />

      <h2
        id="encrypted-vs-public"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Encrypted vs. public
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS divides all on-chain data into two categories:{" "}
        <strong className="text-docs-text-primary font-semibold">
          encrypted
        </strong>{" "}
        (stored as FHE ciphertext handles, never readable on-chain) and{" "}
        <strong className="text-docs-text-primary font-semibold">public</strong>{" "}
        (visible to anyone inspecting the chain). The protocol defaults to
        encrypted for all financial and identity data.
      </p>

      <DocsTable columns={encryptedColumns} rows={encryptedRows} />

      <Callout variant="info" title="Default encrypted">
        <p>
          The protocol encrypts by default. You must explicitly opt data into
          public visibility — not the other way around. This prevents accidental
          data leakage from smart contract bugs or misconfiguration.
        </p>
      </Callout>

      <h2
        id="how-fhe-works"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        How FHE works
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Fully Homomorphic Encryption (FHE) allows computation on encrypted data
        without decrypting it first. In ReineiraOS, this means the smart
        contracts can add escrow amounts, compare balances, and evaluate
        conditions — all while the underlying values remain ciphertext.
      </p>

      <h3
        id="client-side-encryption"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Client-side encryption
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Encryption happens on the client before the transaction is submitted.
        The SDK fetches the network's public FHE key and encrypts locally — the
        plaintext value never leaves the user's device.
      </p>

      <CodeBlock
        filename="encrypt-client.ts"
        language="typescript"
        lines={[
          { content: "import { Encryptable } from '@cofhe/sdk';" },
          { content: "// client is a connected createCofheClient() instance" },
          { content: "" },
          {
            content:
              "// 1. Plaintext values — exist only in the user's environment",
          },
          {
            content: "const amount = 1000_000000n; // 1000 USDC (6 decimals)",
            highlighted: true,
          },
          { content: "const owner = '0xBeneficiary...';", highlighted: true },
          { content: "" },
          {
            content:
              "// 2. Encrypt client-side using the network's public FHE key",
          },
          {
            content:
              "const [encOwner, encAmount] = await client",
            highlighted: true,
          },
          {
            content:
              "  .encryptInputs([Encryptable.address(owner), Encryptable.uint64(amount)])",
            highlighted: true,
          },
          {
            content: "  .execute();",
            highlighted: true,
          },
          { content: "" },
          {
            content:
              "// 3. Send ciphertext to the contract — values are now opaque",
          },
          {
            content:
              "await escrow.create(encOwner, encAmount, resolver, resolverData);",
          },
          { content: "" },
          {
            content:
              "// On-chain: amount stored as euint64, owner stored as eaddress",
          },
          {
            content:
              "// No party can read the values without explicit FHE.allow() access.",
          },
        ]}
        showLineNumbers={true}
      />

      <Callout variant="warning" title="Plaintext responsibility">
        <p>
          Your application holds the plaintext value in memory before
          encryption. Use secure coding practices: clear sensitive variables
          after use, avoid logging amounts, and never persist plaintext to local
          storage or analytics.
        </p>
      </Callout>

      <h2
        id="event-privacy"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Event privacy
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Solidity events are public by design — any indexer or block explorer can
        read them. ReineiraOS carefully limits what data is emitted in events to
        prevent metadata leakage.
      </p>

      <DocsTable columns={eventColumns} rows={eventRows} />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The event design ensures that on-chain observers can track <em>that</em>{" "}
        an escrow exists and <em>when</em> it transitions, but never learn{" "}
        <em>how much</em> is at stake or <em>who</em> the parties are.
      </p>

      <h2
        id="implications-for-builders"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Implications for builders
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The privacy model has practical implications for how you build on
        ReineiraOS:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Your app holds plaintext
          </strong>{" "}
          — The SDK encrypts before sending, but your frontend knows the values.
          You are responsible for not leaking them through logs, analytics, or
          insecure storage.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Gates see IDs, not amounts
          </strong>{" "}
          — Your Gate (
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            IConditionResolver
          </code>
          ) receives an{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            escrowId
          </code>
          , not the encrypted amount. Condition logic should be based on
          external proofs (e.g. Reclaim attestations), not on Escrow internals.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Insurance policies compute on encrypted data
          </strong>{" "}
          —{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            IUnderwriterPolicy
          </code>{" "}
          implementations use FHE operations (mul, div, compare) on ciphertext
          handles. You never see cleartext risk scores or premiums in your
          policy code.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Access is explicit via FHE.allow()
          </strong>{" "}
          — The contract grants encrypted value access to specific addresses
          using{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            FHE.allow()
          </code>
          . Only authorized parties (owner, insurance manager) can read specific
          encrypted fields.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Selective disclosure for compliance
          </strong>{" "}
          —{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            FHE.allow()
          </code>{" "}
          supports granting access to specific fields for specific addresses,
          enabling compliance without exposing the entire Escrow state.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Metadata can still leak
          </strong>{" "}
          — Timing, gas usage, and transaction patterns may reveal information.
          Consider batching operations and using meta-transactions via the
          ERC-2771 forwarder to reduce fingerprinting.
        </li>
      </ul>

      <Callout variant="tip" title="Meta-transactions">
        <p>
          Use the built-in ERC-2771 trusted forwarder for meta-transactions.
          This hides the real sender address and lets a relayer pay gas, adding
          an extra privacy layer for your users.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
