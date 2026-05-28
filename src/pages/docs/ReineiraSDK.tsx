import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import CodeBlock from "@/components/docs/CodeBlock";
import DocsTable from "@/components/docs/DocsTable";
import PropertyCard from "@/components/docs/PropertyCard";
import Callout from "@/components/docs/Callout";
import PageNav from "@/components/docs/PageNav";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "install", title: "Install", level: 2 },
  { id: "create-and-initialize", title: "Create and initialize", level: 2 },
  { id: "configuration", title: "Configuration", level: 2 },
  { id: "modules", title: "Modules", level: 2 },
  { id: "utilities", title: "Utilities", level: 2 },
  { id: "viem-interop", title: "Viem interop", level: 2 },
  { id: "error-types", title: "Error types", level: 2 },
];

const { prev, next } = getPrevNext("/reference/sdk");

const configProperties = [
  {
    name: "network",
    type: '"testnet" | "mainnet"',
    required: true,
    description:
      "Target network. Only testnet is wired into the address book today; mainnet support activates at chaos-net launch.",
  },
  {
    name: "privateKey",
    type: "string",
    required: false,
    description: "Wallet private key. Provide either privateKey or signer.",
  },
  {
    name: "signer",
    type: "ethers.Signer",
    required: false,
    description:
      "Ethers.js signer instance. Provide either privateKey or signer.",
  },
  {
    name: "provider",
    type: "ethers.Provider",
    required: false,
    description: "Custom RPC provider.",
  },
  {
    name: "rpcUrl",
    type: "string",
    required: false,
    description: "Custom RPC URL (overrides default).",
  },
  {
    name: "coordinatorUrl",
    type: "string",
    required: false,
    description: "Coordinator service URL for cross-chain operations.",
  },
  {
    name: "onFHEInit",
    type: "(status) => void",
    required: false,
    description: "FHE initialization progress callback.",
  },
  {
    name: "addresses",
    type: "Partial<NetworkAddresses>",
    required: false,
    description: "Override default contract addresses.",
  },
];

const errorColumns = [
  { header: "Error", key: "error", mono: true, width: "240px" },
  { header: "When thrown", key: "desc" },
];

const errorRows = [
  {
    error: "ApprovalRequiredError",
    desc: "Fund or stake called without token approval",
  },
  { error: "ValidationError", desc: "Invalid parameters passed to SDK method" },
  {
    error: "TransactionFailedError",
    desc: "On-chain transaction reverted (has .txHash)",
  },
  { error: "EscrowNotFoundError", desc: "Escrow ID does not exist" },
  { error: "TimeoutError", desc: "waitFor* method exceeded timeout" },
  { error: "FHEInitError", desc: "FHE backend failed to initialize" },
  { error: "EncryptionError", desc: "FHE encryption of value failed" },
  {
    error: "ConditionNotMetError",
    desc: "Redeem called when condition resolver returns false",
  },
  {
    error: "InsufficientFundsError",
    desc: "Wallet balance too low for operation",
  },
  {
    error: "CoverageNotActiveError",
    desc: "Dispute filed on non-active coverage",
  },
];

export default function ReineiraSDK() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="SDK"
        description="The main entry point for all ReineiraOS operations. Create escrows, manage insurance, bridge cross-chain, and listen to events."
        readingTime="5 min read"
      />

      {/* ── Install ────────────────────────────────────────────────────── */}
      <h2
        id="install"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Install
      </h2>

      <CodeBlock
        filename="terminal"
        language="bash"
        showLineNumbers={false}
        lines={[{ content: "npm install @reineira-os/sdk" }]}
      />

      {/* ── Create and initialize ──────────────────────────────────────── */}
      <h2
        id="create-and-initialize"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Create and initialize
      </h2>

      <CodeBlock
        filename="setup.ts"
        language="typescript"
        lines={[
          { content: "import { ReineiraSDK } from '@reineira-os/sdk'" },
          { content: "" },
          { content: "const sdk = ReineiraSDK.create({" },
          { content: "  network: 'testnet',", highlighted: true },
          { content: "  privateKey: '0x...',", highlighted: true },
          {
            content:
              "  coordinatorUrl: 'https://dswtxw6k9mker.cloudfront.net',",
          },
          { content: "  onFHEInit: (status) => console.log('FHE:', status)," },
          { content: "})" },
          { content: "" },
          { content: "await sdk.initialize()", highlighted: true },
        ]}
      />

      {/* ── Configuration ──────────────────────────────────────────────── */}
      <h2
        id="configuration"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Configuration
      </h2>

      <PropertyCard
        title="ReineiraSDK.create(options)"
        properties={configProperties}
      />

      <Callout variant="info" title="Authentication">
        <p>
          You must provide either{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            privateKey
          </code>{" "}
          or{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            signer
          </code>
          . If both are provided,{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            signer
          </code>{" "}
          takes precedence.
        </p>
      </Callout>

      {/* ── Modules ────────────────────────────────────────────────────── */}
      <h2
        id="modules"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Modules
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The SDK exposes six modules accessible as properties.{" "}
        <code>escrow</code> and <code>insurance</code> hit the confidential
        (FHE) deployment; <code>escrowPlain</code> and{" "}
        <code>insurancePlain</code> hit the mainnet-launch plaintext deployment.
      </p>

      <CodeBlock
        filename="modules.ts"
        language="typescript"
        lines={[
          {
            content:
              "sdk.escrow          // EscrowModule (FHE) — create, fund, redeem confidential escrows",
          },
          {
            content:
              "sdk.escrowPlain     // PlainEscrowModule — same surface for plaintext mainnet path",
          },
          {
            content:
              "sdk.insurance       // InsuranceModule (FHE) — pools, policies, coverage",
          },
          {
            content:
              "sdk.insurancePlain  // PlainInsuranceModule — plaintext mainnet path",
          },
          {
            content:
              "sdk.bridge          // BridgeModule — CCTP health check, coordinator submit",
          },
          {
            content:
              "sdk.events          // EventsModule — real-time event listeners",
          },
        ]}
      />

      <p className="text-docs-text-secondary text-[14px] leading-relaxed mt-4">
        Modules return <em>instance</em> objects (<code>EscrowInstance</code>,{" "}
        <code>PoolInstance</code>, <code>CoverageInstance</code>, and their
        plain variants) representing a single on-chain artifact —{" "}
        <code>escrow.fund()</code>, <code>pool.stake()</code>,{" "}
        <code>coverage.dispute()</code> etc. all live on the returned instances.
        See the individual module pages for the full method surface.
      </p>

      {/* ── Utilities ──────────────────────────────────────────────────── */}
      <h2
        id="utilities"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Utilities
      </h2>

      <CodeBlock
        filename="utilities.ts"
        language="typescript"
        lines={[
          { content: "// Amount helpers" },
          {
            content:
              "sdk.usdc(1000)              // → 1000_000000n (6 decimals)",
          },
          { content: 'sdk.formatUsdc(1000000n)    // → "1.00"' },
          { content: "" },
          { content: "// Balances" },
          { content: "const bal = await sdk.balances();" },
          { content: "// bal.usdc, bal.eth, bal.confidentialUSDC" },
          { content: "" },
          { content: "// Approval check" },
          { content: "await sdk.isOperatorApproved(spender, holder?);" },
          { content: "" },
          { content: "// Accessors" },
          { content: "sdk.signer      // ethers.Signer" },
          { content: "sdk.provider    // ethers.Provider" },
          {
            content:
              "sdk.addresses   // NetworkAddresses (all deployed contract addresses)",
          },
        ]}
      />

      {/* ── Viem interop ───────────────────────────────────────────────── */}
      <h2
        id="viem-interop"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Viem interop
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        If you use Viem instead of ethers.js, the SDK provides adapter
        functions:
      </p>

      <CodeBlock
        filename="viem-setup.ts"
        language="typescript"
        lines={[
          {
            content:
              "import { walletClientToSigner, publicClientToProvider } from '@reineira-os/sdk'",
          },
          { content: "" },
          {
            content:
              "const signer = await walletClientToSigner(viemWalletClient)",
            highlighted: true,
          },
          {
            content:
              "const provider = publicClientToProvider(viemPublicClient)",
          },
          { content: "" },
          { content: "const sdk = ReineiraSDK.create({" },
          { content: "  network: 'testnet'," },
          { content: "  signer," },
          { content: "  provider," },
          { content: "})" },
        ]}
      />

      {/* ── Error types ────────────────────────────────────────────────── */}
      <h2
        id="error-types"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Error types
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        All SDK methods throw typed errors that can be caught and handled:
      </p>

      <DocsTable columns={errorColumns} rows={errorRows} />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
