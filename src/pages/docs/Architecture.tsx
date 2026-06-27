import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import CodeBlock from "@/components/docs/CodeBlock";
import ArchitectureDiagram from "@/components/docs/ArchitectureDiagram";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import DocsBadge from "@/components/docs/DocsBadge";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "layers", title: "System layers", level: 2 },
  { id: "fhe-layer", title: "FHE Layer", level: 3 },
  { id: "storage-layer", title: "Storage Layer", level: 3 },
  { id: "settlement-layer", title: "Settlement Layer", level: 3 },
  { id: "components", title: "Core components", level: 2 },
  { id: "data-flow", title: "Data flow", level: 2 },
];

const { prev, next } = getPrevNext("/learn/architecture");

const layerColumns = [
  { header: "Layer", key: "layer", width: "160px" },
  { header: "Technology", key: "tech", mono: true, width: "180px" },
  { header: "Responsibility", key: "desc" },
];
const layerRows = [
  {
    layer: "Application",
    tech: "Solidity / EVM",
    desc: "Smart contracts expose the public API — create, fund, redeem. All amount logic operates on encrypted types.",
  },
  {
    layer: "FHE",
    tech: "CoFHE coprocessor",
    desc: "Fully homomorphic encryption layer. Amounts remain encrypted at rest and in transit. Computations happen in ciphertext.",
  },
  {
    layer: "Storage",
    tech: "ERC-7201",
    desc: "Encrypted state variables stored via namespaced storage. Contracts are UUPS-upgradeable proxies on Arbitrum Sepolia testnet today (immutable bytecode is the v1.0 target); ERC-7201 + __gap[50] keep storage layout safe across upgrades. ERC-2771 meta-transaction support.",
  },
  {
    layer: "Relay coordination",
    tech: "Off-chain services",
    desc: "Coordinator notifies relayers of CCTP burn events via round-robin SSE to avoid duplicate gas costs. Running a relayer is permissionless.",
  },
  {
    layer: "Settlement",
    tech: "Circle CCTP V2",
    desc: "Cross-chain settlement routes USDC across EVM chains. Settlement is permissionless — anyone can call settle() with a valid Circle CCTP attestation, verified on-chain.",
  },
];

export default function Architecture() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Architecture"
        description="A layered overview of how ReineiraOS is structured — from FHE encryption to cross-chain settlement."
        readingTime="8 min read"
      />

      <h2
        id="overview"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Overview
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS is conditional settlement infrastructure built on the
        Ethereum Virtual Machine. It runs in two modes: a{" "}
        <strong className="text-docs-text-primary">public mode</strong> with
        plaintext amounts — the mode running on Arbitrum Sepolia testnet today —
        and an{" "}
        <strong className="text-docs-text-primary">encrypted mode</strong> that
        uses an FHE coprocessor so settlement logic executes entirely in
        ciphertext. Encrypted mode activates at the v1.0 mainnet launch (Q4
        2026) as a separate immutable deployment{" "}
        <DocsBadge variant="amber">Spec'd</DocsBadge>; until then the Arbitrum
        Sepolia testnet deployment operates in public mode{" "}
        <DocsBadge variant="blue">Arb. Sepolia</DocsBadge>.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS occupies a unique position:{" "}
        <strong className="text-docs-text-primary">
          conditional settlement with encrypted state
        </strong>
        . Simple escrow protocols (Kleros, Safe modules, basic multisig) hold
        and release funds but lack programmable conditions. Conditional
        settlement platforms (Huma, Request, Bridge/Stripe) support programmable
        release but operate on transparent, often centralized state. ReineiraOS
        combines both axes — programmable release conditions with FHE-encrypted
        amounts, parties, and conditions.
      </p>

      <Callout variant="info" title="Design principle">
        Privacy is a first-class constraint, not a post-hoc addition. In
        encrypted mode every storage write and every computation operates on
        FHE-encrypted values, with plaintext used only for public metadata like
        timestamps and escrow existence flags. The encrypted-state design and
        types described below ship at the v1.0 mainnet launch (Q4 2026); the
        live Arbitrum Sepolia testnet deployment currently runs in public
        (plaintext) mode.
      </Callout>

      <h2
        id="layers"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        System layers
      </h2>

      <DocsTable columns={layerColumns} rows={layerRows} />

      <h3
        id="fhe-layer"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        FHE Layer
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The FHE layer uses a coprocessor-based system. Encrypted types (
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          euint64
        </code>
        ,{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          ebool
        </code>
        ,{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          eaddress
        </code>
        ) are stored as handles managed by the coprocessor. Client-side
        encryption uses{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          cofhejs
        </code>{" "}
        with input types (
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          InEuint64
        </code>
        ,{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          InEaddress
        </code>
        ).
      </p>

      <CodeBlock
        filename="ConfidentialEscrow.sol"
        language="solidity"
        lines={[
          { content: "// Actual on-chain escrow struct" },
          { content: "struct Escrow {" },
          {
            content: "    eaddress owner;       // encrypted beneficiary",
            highlighted: true,
          },
          {
            content: "    eaddress caller;      // encrypted creator",
            highlighted: true,
          },
          {
            content: "    euint64  amount;       // encrypted amount",
            highlighted: true,
          },
          {
            content: "    euint64  paidAmount;   // encrypted funded amount",
            highlighted: true,
          },
          {
            content: "    ebool    isRedeemed;   // encrypted redemption flag",
            highlighted: true,
          },
          { content: "    bool     exists;       // cleartext existence flag" },
          { content: "}" },
        ]}
      />

      <h3
        id="storage-layer"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Storage Layer
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Escrow state is persisted in a Solidity mapping keyed by{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          escrowId
        </code>
        . On Arbitrum Sepolia testnet today, every protocol contract is deployed
        as a{" "}
        <strong className="text-docs-text-primary">
          UUPS-upgradeable proxy
        </strong>{" "}
        whose{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          _authorizeUpgrade
        </code>{" "}
        hook is gated by the contract owner (the base contract,{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          TestnetCoreBase
        </code>
        , is{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          UUPSUpgradeable
        </code>{" "}
        +{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          OwnableUpgradeable
        </code>
        ). Contracts use ERC-7201 namespaced storage with{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          __gap[50]
        </code>{" "}
        to keep storage layout safe as upgrades extend state, and ERC-2771
        meta-transaction support comes from the same base.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Freezing logic and storage by renouncing the upgrade key is the{" "}
        <strong className="text-docs-text-primary">v1.0 mainnet target</strong>.
        Once immutable, functional evolution would ship as{" "}
        <strong className="text-docs-text-primary">
          new contract deployments at new addresses
        </strong>{" "}
        that users opt into by migration. The canonical-deployment registry is a
        documentation surface, not an on-chain contract; it lists the deployment
        addresses across host chains. You remain free to interact with any other
        bytecode deployment.
      </p>

      <h3
        id="settlement-layer"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Settlement Layer
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Public mode can deploy on any EVM chain; the current deployment runs on
        Arbitrum Sepolia testnet (L2). Cross-chain funding arrives over Circle
        CCTP V2 for USDC — the one live rail — which funnels into{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          ConfidentialEscrow.fundFrom
        </code>
        . A second LayerZero OFT / USDT0 rail for USDT (aimed at non-U.S. and
        non-EU users) is specified but not yet shipped{" "}
        <DocsBadge variant="amber">Spec'd</DocsBadge>. A coordinator service
        notifies relayers of CCTP burn events via round-robin SSE to reduce gas
        duplication; relayers fetch the Circle attestation and call{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          settle()
        </code>
        . Settlement itself is permissionless — any account can call{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          settle()
        </code>{" "}
        with a valid Circle attestation; relayers are one optional transport
        layer.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Atlas-deployed third-party L3s are defined as a model for hosting
        protocol deployments <DocsBadge variant="amber">Spec'd</DocsBadge>.
      </p>

      <h2
        id="components"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Core components
      </h2>

      <ArchitectureDiagram
        title="SYSTEM COMPONENTS"
        steps={[
          { label: "Client (SDK)", sublabel: "Encrypts inputs via cofhejs" },
          { label: "EVM Contracts", sublabel: "ConfidentialEscrow and Gates" },
          { label: "Coordinator", sublabel: "Burn-event notification" },
          { label: "Relayers", sublabel: "CCTP relay and settlement" },
        ]}
      />

      <h2
        id="data-flow"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Data flow
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The complete data flow for Escrow creation and redemption:
      </p>

      <ol className="space-y-3 text-docs-text-secondary leading-relaxed list-decimal list-inside">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Client encrypts inputs
          </strong>{" "}
          — The SDK encrypts amount and owner address locally using{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px]">
            cofhejs.encrypt()
          </code>{" "}
          with the network's public FHE key.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Escrow created on-chain
          </strong>{" "}
          — The encrypted inputs (
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px]">
            InEaddress
          </code>
          ,{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px]">
            InEuint64
          </code>
          ) are submitted to{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px]">
            ConfidentialEscrow.create()
          </code>
          . If a Gate is attached,{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px]">
            onConditionSet()
          </code>{" "}
          is called atomically.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Escrow funded
          </strong>{" "}
          — USDC is deposited (locally or cross-chain via CCTP). The contract
          wraps it into ConfidentialUSDC and updates the encrypted{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px]">
            paidAmount
          </code>
          .
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Gate condition checked
          </strong>{" "}
          — When{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px]">
            redeem()
          </code>{" "}
          is called, the contract checks{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px]">
            IConditionResolver.isConditionMet(escrowId)
          </code>
          . If no Gate is attached, redemption proceeds unconditionally.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Funds released
          </strong>{" "}
          — On successful condition check, the encrypted amount is transferred
          to the beneficiary.
        </li>
      </ol>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
