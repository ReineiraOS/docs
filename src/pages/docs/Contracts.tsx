import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import CodeBlock from "@/components/docs/CodeBlock";
import DocsTable from "@/components/docs/DocsTable";
import Callout from "@/components/docs/Callout";
import DocsBadge from "@/components/docs/DocsBadge";
import PageNav from "@/components/docs/PageNav";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "deployment-posture", title: "Deployment posture", level: 2 },
  { id: "plain-mode", title: "Plain mode (mainnet launch path)", level: 2 },
  { id: "confidential-mode", title: "Confidential mode (FHE)", level: 2 },
  { id: "orchestration", title: "Orchestration", level: 2 },
  { id: "tokens", title: "Tokens", level: 2 },
  { id: "external-dependencies", title: "External dependencies", level: 2 },
  { id: "cctp-source-chains", title: "CCTP source chains", level: 2 },
  { id: "not-yet-deployed", title: "Specified, not yet deployed", level: 2 },
  { id: "plugin-interfaces", title: "Plugin interfaces", level: 2 },
  { id: "iconditionresolver", title: "IConditionResolver", level: 3 },
  { id: "iunderwriterpolicy", title: "IUnderwriterPolicy", level: 3 },
  {
    id: "iconfidentialunderwriterpolicy",
    title: "IConfidentialUnderwriterPolicy",
    level: 3,
  },
];

const { prev, next } = getPrevNext("/reference/contracts");

const contractColumns = [
  { header: "Contract", key: "name", width: "280px" },
  { header: "Address", key: "address", mono: true },
];

const plainEscrowRows = [
  {
    name: "Escrow",
    address: "0xa125db70c1f17E395AfFa30b32e1e4A94aF3A81c",
  },
  {
    name: "CCTPV2EscrowReceiver",
    address: "0xD4cb6F1B679C3b16AE02aAdc66e172142EAAC5a2",
  },
];

const plainInsuranceRows = [
  {
    name: "PolicyRegistry",
    address: "0xAf23b86086FC6DC74796865be3B3a8bBAd68AB95",
  },
  {
    name: "CoverageManager",
    address: "0x3fcD1896745B2b91b4397e7E762910Fbf7eE9D22",
  },
  {
    name: "PoolFactory",
    address: "0xA2D78bfaB94B93106c8Da17E6967501D54DfE772",
  },
  {
    name: "InsurancePool (implementation template)",
    address: "0xCd05D0B8854ff030d874Ec346EbB883C40E63C33",
  },
];

const confidentialEscrowRows = [
  {
    name: "ConfidentialEscrow",
    address: "0xbe1eEB78504B71beEE1b33D3E3D367A2F9a549A6",
  },
  {
    name: "CCTPV2ConfidentialEscrowReceiver",
    address: "0x67AE0C5fE86716441B38b73A66F21c6aC8e338d0",
  },
  {
    name: "SimpleCondition (example plugin)",
    address: "0xA0f6F26de1D3289425aA8A7fDDb769c61CD38e97",
  },
];

const confidentialInsuranceRows = [
  {
    name: "ConfidentialPolicyRegistry",
    address: "0x962A6c7Be4fC765B0E8B601ab4BB210938660190",
  },
  {
    name: "ConfidentialCoverageManager",
    address: "0x40A3A53d54D25cF079Bc9C2033224159d4EA3A67",
  },
  {
    name: "ConfidentialPoolFactory",
    address: "0xCBD3815244ee96a92B3Ca3C71B6eD9acB3661e80",
  },
];

const orchestrationRows = [
  {
    name: "OperatorRegistry",
    address: "0x1422ccC8B42079D810835631a5DFE1347a602959",
  },
  {
    name: "TaskExecutor",
    address: "0x7F24077A3341Af05E39fC232A77c21A03Bbd2262",
  },
  { name: "FeeManager", address: "0x5a11DC96CEfd2fB46759F08aCE49515aa23F0156" },
  {
    name: "CCTPHandler",
    address: "0xb37A83461B01097e1E440405264dA59EE9a3F273",
  },
];

const tokenRows = [
  {
    name: "ConfidentialUSDC (cUSDC)",
    address: "0x42E47f9bA89712C317f60A72C81A610A2b68c48a",
  },
  { name: "USDC (Arbitrum Sepolia)", address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" },
  {
    name: "GovernanceToken (REINEIRA)",
    address: "0xb847e041bB3bC78C3CD951286AbCa28593739D12",
  },
];

const externalRows = [
  {
    name: "CCTP MessageTransmitter V2",
    address: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275",
  },
  {
    name: "TrustedForwarder (ERC-2771)",
    address: "0x7ceA357B5AC0639F89F9e378a1f03Aa5005C0a25",
  },
];

const cctpColumns = [
  { header: "Chain", key: "chain", width: "160px" },
  { header: "Chain ID", key: "chainId", width: "120px" },
  { header: "Domain", key: "domain", width: "120px" },
  { header: "USDC Address", key: "usdc", mono: true },
  { header: "TokenMessenger V2", key: "messenger", mono: true },
];

const cctpRows = [
  {
    chain: "Ethereum Sepolia",
    chainId: "11155111",
    domain: "0",
    usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    messenger: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA",
  },
  {
    chain: "Base Sepolia",
    chainId: "84532",
    domain: "6",
    usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    messenger: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA",
  },
  {
    chain: "Arbitrum Sepolia",
    chainId: "421614",
    domain: "3 (destination)",
    usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    messenger: "—",
  },
];

const notYetDeployedColumns = [
  { header: "Contract", key: "name", width: "260px" },
  { header: "Source / status", key: "status" },
];

const notYetDeployedRows = [
  {
    name: "StrategyRouter",
    status:
      "packages/insurance — pool liquidity routing; landed on main, no testnet deployment yet",
  },
  {
    name: "OperatorSlashingManager",
    status:
      "packages/orchestration — four-stage slashing pipeline (3-day challenge / 4-day vote / 14-day expiry); contract present, not separately deployed (current slashing surface lives inside OperatorRegistry)",
  },
  {
    name: "OperatorSubsidyManager",
    status:
      "Whitepaper §8.9 — chaos-net per-task subsidy paid in cUSDC; contract not in repo yet",
  },
  {
    name: "CoordinatorRegistry",
    status:
      "Whitepaper §8.10 — on-chain coordinator registration & cross-graph slashing; v1.0-track",
  },
  {
    name: "QuorumRegistry, RiskScoreAttestor",
    status:
      "Whitepaper §7.8, §8.10 — agentic/risk-attestation registries; deferred past v1.0 RSS",
  },
  {
    name: "ConfidentialUSDT (cUSDT)",
    status:
      "Whitepaper §9.1, §9.6 — USDT0 wrapper via LayerZero OFT; tracked for v1.0, non-U.S./non-EU only",
  },
  {
    name: "LZOFTHandler / LZOFTEscrowReceiver / LZOFTForwarder",
    status:
      "Whitepaper §9.2 — LayerZero OFT handler family for USDT0; tracked for v1.0",
  },
  {
    name: "ParticipationBond",
    status:
      "Whitepaper §11.6 — $1M cUSDC bond; deployed empty pre-TGE as immutable commitment shell, funded conditionally on TGE",
  },
];

export default function Contracts() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Contracts"
        description="Canonical-deployment registry — every ReineiraOS contract on Arbitrum Sepolia, by mode. Addresses are baked into the SDK; no manual configuration needed."
        readingTime="6 min read"
      />

      <Callout variant="info" title="Testnet deployment">
        <p>
          All contracts below are deployed on{" "}
          <DocsBadge variant="blue">Arbitrum Sepolia</DocsBadge>. The SDK
          resolves addresses automatically — you do not need to configure them
          manually. Both <strong>plain mode</strong> (mainnet launch path) and{" "}
          <strong>confidential mode</strong> (FHE, gated on Fhenix CoFHE
          availability) are listed; the SDK exposes them as separate modules
          (<code>sdk.escrow</code> / <code>sdk.escrowPlain</code> etc.).
        </p>
      </Callout>

      {/* ── Deployment posture ─────────────────────────────────────────── */}
      <h2
        id="deployment-posture"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Deployment posture
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Two postures coexist between testnet and mainnet:
      </p>

      <ul className="list-disc list-outside ml-5 space-y-2 text-docs-text-secondary leading-relaxed mb-4">
        <li>
          <strong>Testnet (Arbitrum Sepolia, today):</strong> UUPS upgradeable
          proxies behind <code>TestnetCoreBase</code> (Initializable + UUPS +
          Ownable + ReentrancyGuard + ERC-2771). This lets us iterate during
          the chaos-net runway without breaking integrators on every patch.
        </li>
        <li>
          <strong>Mainnet v1.0 (Q4 2026 hardening lock onwards):</strong>{" "}
          immutable singletons. No UUPS proxy, no <code>_authorizeUpgrade</code>{" "}
          hook, no owner or admin upgrade key. Bug fixes ship as new contract
          deployments at new addresses — users opt in by migration. ERC-7201
          namespaced storage with <code>__gap[50]</code> reserves protects
          storage layout across deployment versions.
        </li>
      </ul>

      <Callout variant="warning" title="Canonical-deployment registry">
        <p>
          The tables on this page are the documentation surface of the
          canonical-deployment registry — not an on-chain contract. They list
          the addresses ReineiraOS treats as canonical on each host. Other
          bytecode-equivalent deployments may exist; you may interact with any
          of them, but Foundation services (relayer, coordinator, app
          frontend) connect only to the canonical set.
        </p>
      </Callout>

      {/* ── Plain mode ─────────────────────────────────────────────────── */}
      <h2
        id="plain-mode"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Plain mode (mainnet launch path)
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Plaintext state, no FHE dependency. This is the path that powers the
        chaos-net mainnet launch on Arbitrum L2 and underpins the SDK's{" "}
        <code>escrowPlain</code> / <code>insurancePlain</code> modules.
      </p>

      <h3 className="text-[18px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-6 mb-3">
        Escrow
      </h3>
      <DocsTable columns={contractColumns} rows={plainEscrowRows} />

      <h3 className="text-[18px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3">
        Insurance
      </h3>
      <DocsTable columns={contractColumns} rows={plainInsuranceRows} />

      {/* ── Confidential mode ──────────────────────────────────────────── */}
      <h2
        id="confidential-mode"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Confidential mode (FHE)
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Encrypted state using <code>euint64</code>, <code>eaddress</code>, and{" "}
        <code>ebool</code> via Fhenix CoFHE precompiles. This is a separate
        immutable deployment; mainnet activation is gated on Fhenix CoFHE
        readiness (target Q4 2026 hardening lock). The silent-failure pattern
        (Whitepaper §4.5, Proposition 4.3) applies to all confidential
        contracts.
      </p>

      <h3 className="text-[18px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-6 mb-3">
        Escrow
      </h3>
      <DocsTable columns={contractColumns} rows={confidentialEscrowRows} />

      <h3 className="text-[18px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3">
        Insurance
      </h3>
      <DocsTable columns={contractColumns} rows={confidentialInsuranceRows} />

      <p className="text-docs-text-secondary text-[14px] leading-relaxed mt-3">
        Individual <code>ConfidentialInsurancePool</code> instances are
        deployed lazily by <code>ConfidentialPoolFactory.createPool()</code> as{" "}
        <code>ERC1967Proxy</code> clones — they do not have a single canonical
        address.
      </p>

      {/* ── Orchestration ──────────────────────────────────────────────── */}
      <h2
        id="orchestration"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Orchestration
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Shared by both modes — operator registry, task execution, fee
        collection, and CCTP relay.
      </p>

      <DocsTable columns={contractColumns} rows={orchestrationRows} />

      {/* ── Tokens ─────────────────────────────────────────────────────── */}
      <h2
        id="tokens"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Tokens
      </h2>

      <DocsTable columns={contractColumns} rows={tokenRows} />

      <p className="text-docs-text-secondary text-[14px] leading-relaxed mt-3">
        Operator stake is denominated in <strong>cUSDC</strong> on chaos-net
        (Whitepaper §8.1) — REINEIRA token issuance is conditional on the TGE
        triggers in §12.11.
      </p>

      {/* ── External dependencies ──────────────────────────────────────── */}
      <h2
        id="external-dependencies"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        External dependencies
      </h2>

      <DocsTable columns={contractColumns} rows={externalRows} />

      {/* ── CCTP source chains ─────────────────────────────────────────── */}
      <h2
        id="cctp-source-chains"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        CCTP source chains
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Cross-chain funding originates on one of the supported source chains
        and is relayed to Arbitrum Sepolia (destination domain{" "}
        <code>3</code>) via Circle CCTP V2.
      </p>

      <DocsTable columns={cctpColumns} rows={cctpRows} />

      {/* ── Specified, not yet deployed ────────────────────────────────── */}
      <h2
        id="not-yet-deployed"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Specified, not yet deployed
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        These contracts are part of the v1.0 protocol specification but have no
        canonical Arbitrum Sepolia deployment yet. Most are tracked toward
        chaos-net Q4 2026 hardening or post-TGE.
      </p>

      <DocsTable columns={notYetDeployedColumns} rows={notYetDeployedRows} />

      {/* ── Plugin interfaces ──────────────────────────────────────────── */}
      <h2
        id="plugin-interfaces"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Plugin interfaces
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Two pluggable interfaces extend the protocol. Both require ERC-165 so
        the registries can validate at registration time. The underwriter
        policy has two variants — pick the one matching your deployment mode.
      </p>

      <h3
        id="iconditionresolver"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        IConditionResolver
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-3">
        Implemented by Gate plugins. <code>onConditionSet</code> fires at
        escrow creation; <code>getConditionFee</code> is read once at stamp
        time; <code>isConditionMet</code> is called at redemption.
      </p>

      <CodeBlock
        filename="IConditionResolver.sol"
        language="solidity"
        lines={[
          { content: "interface IConditionResolver is IERC165 {" },
          {
            content:
              "  function isConditionMet(uint256 escrowId) external view returns (bool);",
            highlighted: true,
          },
          {
            content:
              "  function onConditionSet(uint256 escrowId, bytes calldata data) external;",
          },
          {
            content:
              "  function getConditionFee(uint256 escrowId)",
            highlighted: true,
          },
          {
            content:
              "    external view returns (uint16 bps, address recipient);",
            highlighted: true,
          },
          { content: "}" },
        ]}
      />

      <p className="text-docs-text-secondary text-[14px] leading-relaxed mt-3">
        Returned <code>bps</code> is bounded by{" "}
        <code>MAX_TOTAL_BPS = 10000</code> via the fee-sum invariant in{" "}
        <code>Escrow._stampFee</code>. There is no per-fee on-chain cap; UI is
        expected to sanity-check.
      </p>

      <h3
        id="iunderwriterpolicy"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-10 mb-3"
      >
        IUnderwriterPolicy <DocsBadge variant="gray">plain mode</DocsBadge>
      </h3>

      <CodeBlock
        filename="IUnderwriterPolicy.sol"
        language="solidity"
        lines={[
          { content: "interface IUnderwriterPolicy is IERC165 {" },
          {
            content:
              "  function onPolicySet(uint256 coverageId, bytes calldata data) external;",
          },
          {
            content:
              "  function evaluateRisk(uint256 escrowId, bytes calldata riskProof)",
            highlighted: true,
          },
          {
            content: "    external returns (uint256 riskScore);",
            highlighted: true,
          },
          {
            content:
              "  function judge(uint256 coverageId, bytes calldata disputeProof)",
          },
          { content: "    external returns (bool valid);" },
          { content: "}" },
        ]}
      />

      <h3
        id="iconfidentialunderwriterpolicy"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-10 mb-3"
      >
        IConfidentialUnderwriterPolicy{" "}
        <DocsBadge variant="purple">FHE mode</DocsBadge>
      </h3>

      <CodeBlock
        filename="IConfidentialUnderwriterPolicy.sol"
        language="solidity"
        lines={[
          {
            content:
              "interface IConfidentialUnderwriterPolicy is IERC165 {",
          },
          {
            content:
              "  function onPolicySet(uint256 coverageId, bytes calldata data) external;",
          },
          {
            content:
              "  function evaluateRisk(uint256 escrowId, bytes calldata riskProof)",
            highlighted: true,
          },
          {
            content: "    external returns (euint64 riskScore);",
            highlighted: true,
          },
          {
            content:
              "  function judge(uint256 coverageId, bytes calldata disputeProof)",
          },
          { content: "    external returns (ebool valid);", highlighted: true },
          { content: "}" },
        ]}
      />

      <Callout variant="warning" title="ERC-165 required">
        <p>
          All three interfaces extend <code>IERC165</code>. Your contract must
          implement <code>supportsInterface(bytes4)</code> and return{" "}
          <code>true</code> for the relevant interface ID, otherwise the
          escrow / policy registry will reject it.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
