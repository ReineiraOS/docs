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
  { id: "escrow", title: "Escrow", level: 2 },
  { id: "insurance", title: "Insurance", level: 2 },
  { id: "orchestration", title: "Orchestration", level: 2 },
  { id: "tokens", title: "Tokens", level: 2 },
  { id: "external-dependencies", title: "External dependencies", level: 2 },
  { id: "cctp-source-chains", title: "CCTP source chains", level: 2 },
  { id: "plugin-interfaces", title: "Plugin interfaces", level: 2 },
  { id: "iconditionresolver", title: "IConditionResolver", level: 3 },
  { id: "iunderwriterpolicy", title: "IUnderwriterPolicy", level: 3 },
];

const { prev, next } = getPrevNext("/reference/contracts");

const contractColumns = [
  { header: "Contract", key: "name", width: "260px" },
  { header: "Address", key: "address", mono: true },
];

const escrowRows = [
  {
    name: "ConfidentialEscrow",
    address: "0xbe1eEB78504B71beEE1b33D3E3D367A2F9a549A6",
  },
  {
    name: "CCTPV2ConfidentialEscrowReceiver",
    address: "0x67AE0C5fE86716441B38b73A66F21c6aC8e338d0",
  },
  {
    name: "SimpleCondition",
    address: "0xA0f6F26de1D3289425aA8A7fDDb769c61CD38e97",
  },
];

const insuranceRows = [
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
  { name: "USDC", address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" },
  {
    name: "GovernanceToken",
    address: "0xb847e041bB3bC78C3CD951286AbCa28593739D12",
  },
];

const externalRows = [
  {
    name: "CCTP MessageTransmitter",
    address: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275",
  },
  {
    name: "TrustedForwarder (ERC-2771)",
    address: "0x7ceA357B5AC0639F89F9e378a1f03Aa5005C0a25",
  },
];

const cctpColumns = [
  { header: "Chain", key: "chain", width: "160px" },
  { header: "Domain", key: "domain", width: "140px" },
  { header: "USDC Address", key: "usdc", mono: true },
  { header: "TokenMessenger", key: "messenger", mono: true },
];

const cctpRows = [
  {
    chain: "Ethereum Sepolia",
    domain: "0",
    usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    messenger: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA",
  },
  {
    chain: "Base Sepolia",
    domain: "6",
    usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    messenger: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA",
  },
  {
    chain: "Arbitrum Sepolia",
    domain: "3 (destination)",
    usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    messenger: "\u2014",
  },
];

export default function Contracts() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Contracts"
        description="All ReineiraOS contracts deployed on Arbitrum Sepolia as immutable singletons at fixed addresses. Addresses are baked into the SDK — no manual configuration needed."
        readingTime="4 min read"
      />

      <Callout variant="info" title="Testnet deployment">
        <p>
          All contracts below are deployed on{" "}
          <DocsBadge variant="blue">Arbitrum Sepolia</DocsBadge>. Addresses are
          baked into the SDK — you do not need to configure them manually.
        </p>
      </Callout>

      <Callout variant="warning" title="Immutable singletons">
        <p>
          Every contract below is an <strong>immutable singleton</strong>{" "}
          deployed at a fixed address (§11.8). There is no UUPS proxy, no{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            _authorizeUpgrade
          </code>{" "}
          hook, and no owner or admin upgrade key — these addresses cannot be
          upgraded in place. Functional changes ship as new contract deployments
          at new addresses that you opt into by migration. The address tables on
          this page form the canonical-deployment registry (§3.4): a
          documentation surface, not an on-chain contract, listing the v1.0
          deployment addresses across host chains. You may interact with any
          other bytecode deployment at your own choice. ERC-7201 namespaced
          storage with{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            __gap[50]
          </code>{" "}
          is retained for layout compatibility across deployment versions, not
          for in-place upgrades.
        </p>
      </Callout>

      {/* ── Escrow ─────────────────────────────────────────────────────── */}
      <h2
        id="escrow"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Escrow
      </h2>

      <DocsTable columns={contractColumns} rows={escrowRows} />

      {/* ── Insurance ──────────────────────────────────────────────────── */}
      <h2
        id="insurance"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Insurance
      </h2>

      <DocsTable columns={contractColumns} rows={insuranceRows} />

      {/* ── Orchestration ──────────────────────────────────────────────── */}
      <h2
        id="orchestration"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Orchestration
      </h2>

      <DocsTable columns={contractColumns} rows={orchestrationRows} />

      {/* ── Tokens ─────────────────────────────────────────────────────── */}
      <h2
        id="tokens"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Tokens
      </h2>

      <DocsTable columns={contractColumns} rows={tokenRows} />

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

      <DocsTable columns={cctpColumns} rows={cctpRows} />

      {/* ── Plugin interfaces ──────────────────────────────────────────── */}
      <h2
        id="plugin-interfaces"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Plugin interfaces
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        These are the two interfaces you implement to extend the protocol:
      </p>

      <h3
        id="iconditionresolver"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        IConditionResolver
      </h3>

      <CodeBlock
        filename="IConditionResolver.sol"
        language="solidity"
        lines={[
          { content: "interface IConditionResolver {" },
          {
            content:
              "  function isConditionMet(uint256 escrowId) external view returns (bool);",
            highlighted: true,
          },
          {
            content:
              "  function onConditionSet(uint256 escrowId, bytes calldata data) external;",
            highlighted: true,
          },
          { content: "}" },
        ]}
      />

      <h3
        id="iunderwriterpolicy"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        IUnderwriterPolicy
      </h3>

      <CodeBlock
        filename="IUnderwriterPolicy.sol"
        language="solidity"
        lines={[
          { content: "interface IUnderwriterPolicy {" },
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
            highlighted: true,
          },
          { content: "    external returns (ebool valid);", highlighted: true },
          { content: "}" },
        ]}
      />

      <Callout variant="warning" title="ERC-165 required">
        <p>
          Both interfaces require ERC-165 support. Your contract must implement{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            supportsInterface(bytes4)
          </code>{" "}
          and return{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            true
          </code>{" "}
          for the relevant interface ID.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
