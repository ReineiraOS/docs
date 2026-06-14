import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import CodeBlock from "@/components/docs/CodeBlock";
import DocsTable from "@/components/docs/DocsTable";
import Callout from "@/components/docs/Callout";
import DocsBadge from "@/components/docs/DocsBadge";
import StatusBadge from "@/components/docs/StatusBadge";
import PageNav from "@/components/docs/PageNav";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "escrow", title: "Escrow", level: 2 },
  { id: "insurance", title: "Recourse", level: 2 },
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
  { header: "Contract", key: "name", width: "300px" },
  { header: "Address", key: "address", mono: true },
  { header: "Mode / Status", key: "status", width: "180px" },
];

// Public mode (PLAIN) — live on chaos-net. Values are in the clear; the SDK
// reaches these via sdk.escrow / sdk.recoursePlain.
const escrowPlainRows = [
  {
    name: "Escrow",
    address: "0xAf4e9b2f19a2BF7CF05B7eAae20369FBE3823B8D",
    status: <StatusBadge status="live" detail="public mode" />,
  },
  {
    name: "EscrowReceiver",
    address: "0x495b4E97C1983B79B926994D8278E06b9BbdC834",
    status: <StatusBadge status="live" detail="public mode" />,
  },
];

// Encrypted mode (CONFIDENTIAL) — deployed on chaos-net against MOCKED Fhenix
// CoFHE; real encryption arrives at v1.0.
const escrowConfidentialRows = [
  {
    name: "ConfidentialEscrow",
    address: "0xF50A9CF008a79CFCA39aa9a345aa06e8D12727E2",
    status: <StatusBadge status="chaos-net" detail="encrypted, v1.0" />,
  },
  {
    name: "CCTPV2ConfidentialEscrowReceiver",
    address: "0xe0E6CC9Ee62Fa36b96eC4F50CDc462Fd14aa0fD3",
    status: <StatusBadge status="chaos-net" detail="encrypted, v1.0" />,
  },
];

// Recourse — public mode (PLAIN). RecoursePool is factory-created by PoolFactory.
const recoursePlainRows = [
  {
    name: "RecoursePool (factory-created)",
    address: "0xb07967Ac5d301C65C70Fe3C0B7B8513B15B23047",
    status: <StatusBadge status="live" detail="public mode" />,
  },
  {
    name: "PoolFactory",
    address: "0x2AA20E195290426ad626F65C540FCE2A58DFF9AF",
    status: <StatusBadge status="live" detail="public mode" />,
  },
  {
    name: "PolicyRegistry",
    address: "0x44A8314006E036047586bA90cD3FC153B8990361",
    status: <StatusBadge status="live" detail="public mode" />,
  },
  {
    name: "CoverageManager",
    address: "0xE93191EE7C275E2C8a93FE9A6a2a67f2124daB8E",
    status: <StatusBadge status="live" detail="public mode" />,
  },
];

// Recourse — encrypted mode (CONFIDENTIAL). ConfidentialRecoursePool is
// factory-created by ConfidentialPoolFactory.
const recourseConfidentialRows = [
  {
    name: "ConfidentialRecoursePool (factory-created)",
    address: "— (deployed per pool by factory)",
    status: <StatusBadge status="chaos-net" detail="encrypted, v1.0" />,
  },
  {
    name: "ConfidentialPolicyRegistry",
    address: "0x17a3222BD2167C7620815CD6a1C8d215F11CAa25",
    status: <StatusBadge status="chaos-net" detail="encrypted, v1.0" />,
  },
  {
    name: "ConfidentialCoverageManager",
    address: "0x636084Da863569bd90c94C1C7a5180eBF8F88AAd",
    status: <StatusBadge status="chaos-net" detail="encrypted, v1.0" />,
  },
  {
    name: "ConfidentialPoolFactory",
    address: "0x278c43aB5B8726EbdFD6E7352c128aDA48269442",
    status: <StatusBadge status="chaos-net" detail="encrypted, v1.0" />,
  },
];

const orchestrationRows = [
  {
    name: "OperatorRegistry",
    address: "0x5Ac3a3750e0a9f7d4ddBC0B52c3f13E8f927FB59",
    status: <StatusBadge status="chaos-net" />,
  },
  {
    name: "TaskExecutor",
    address: "0x4D239335f39E585Bb75631C4683538EFC496a5EB",
    status: <StatusBadge status="chaos-net" />,
  },
  {
    name: "FeeManager",
    address: "0x639f5cB99DcF9681A0461A1452c3845811d3308A",
    status: <StatusBadge status="chaos-net" />,
  },
  {
    name: "CCTPHandler",
    address: "0x575186a64B9FC49E135A2440DC4A1395edc0F3aD",
    status: <StatusBadge status="chaos-net" />,
  },
];

const tokenRows = [
  {
    name: "ConfidentialUSDC (cUSDC)",
    address: "0x42E47f9bA89712C317f60A72C81A610A2b68c48a",
    status: <StatusBadge status="chaos-net" detail="encrypted, v1.0" />,
  },
  {
    name: "USDC",
    address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    status: <StatusBadge status="chaos-net" />,
  },
];

const externalRows = [
  {
    name: "CCTP MessageTransmitter",
    address: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275",
    status: <StatusBadge status="chaos-net" />,
  },
  {
    name: "TrustedForwarder (ERC-2771)",
    address: "0x7ceA357B5AC0639F89F9e378a1f03Aa5005C0a25",
    status: <StatusBadge status="chaos-net" />,
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
        description="All ReineiraOS contracts deployed on chaos-net at fixed addresses across two modes — public (PLAIN) and encrypted (CONFIDENTIAL). Addresses are baked into the SDK — no manual configuration needed."
        readingTime="4 min read"
      />

      <Callout variant="info" title="chaos-net deployment">
        <p>
          All contracts below are deployed on{" "}
          <DocsBadge variant="blue">chaos-net</DocsBadge>. Addresses are baked
          into the SDK — you do not need to configure them manually. Each table
          is split into <strong>public mode (PLAIN)</strong> — live, values in
          the clear — and <strong>encrypted mode (CONFIDENTIAL)</strong> —
          deployed on chaos-net against mocked Fhenix CoFHE, with real
          encryption arriving at v1.0.
        </p>
      </Callout>

      <Callout variant="warning" title="Upgradeable today, immutable at v1.0">
        <p>
          The contracts below are <strong>upgradeable today</strong> on
          chaos-net. They are deployed behind <strong>UUPS proxies</strong> with
          an{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            Ownable
          </code>{" "}
          owner that gates an owner-only{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            _authorizeUpgrade
          </code>{" "}
          hook — the deployment JSONs carry a proxy-and-implementation pair for
          each address, and the implementation can be swapped behind the same
          proxy address.{" "}
          <strong>Immutability is the v1.0 mainnet target</strong>, not today's
          state: at v1.0 the upgrade key is relinquished so the addresses can no
          longer be upgraded in place. ERC-7201 namespaced storage with{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            __gap[50]
          </code>{" "}
          keeps the storage layout forward-compatible across upgrades. The
          tables on this page list the current chaos-net addresses; they are a
          documentation surface, not an on-chain registry.
        </p>
      </Callout>

      {/* ── Escrow ─────────────────────────────────────────────────────── */}
      <h2
        id="escrow"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Escrow
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Public mode (PLAIN) — <code>Escrow.sol</code>, values in the clear, live
        on chaos-net via <code>sdk.escrow</code>:
      </p>

      <DocsTable columns={contractColumns} rows={escrowPlainRows} />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Encrypted mode (CONFIDENTIAL) — amounts and balances encrypted; deployed
        on chaos-net against mocked Fhenix CoFHE, with real encryption at v1.0:
      </p>

      <DocsTable columns={contractColumns} rows={escrowConfidentialRows} />

      {/* ── Recourse ───────────────────────────────────────────────────── */}
      <h2
        id="insurance"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Recourse
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Public mode (PLAIN) — <code>RecoursePool.sol</code> and the surrounding
        coverage stack, live on chaos-net via <code>sdk.recoursePlain</code>.
        Pools are created by the factory, so each <code>RecoursePool</code> is
        deployed per pool (the address below is one such factory-created pool):
      </p>

      <DocsTable columns={contractColumns} rows={recoursePlainRows} />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Encrypted mode (CONFIDENTIAL) — the confidential coverage stack;{" "}
        <code>ConfidentialRecoursePool</code> instances are created per pool by{" "}
        <code>ConfidentialPoolFactory</code>:
      </p>

      <DocsTable columns={contractColumns} rows={recourseConfidentialRows} />

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
        These are the interfaces you implement to extend the protocol:
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
          { content: "interface IConditionResolver is IERC165 {" },
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
          {
            content: "  function getConditionFee(uint256 escrowId)",
            highlighted: true,
          },
          {
            content: "    external view",
            highlighted: true,
          },
          {
            content: "    returns (uint16 bps, address recipient);",
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

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Public mode (PLAIN) — risk score and dispute outcome are returned in the
        clear:
      </p>

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
            content: "    external returns (uint256 riskScore);",
            highlighted: true,
          },
          {
            content:
              "  function judge(uint256 coverageId, bytes calldata disputeProof)",
            highlighted: true,
          },
          { content: "    external returns (bool valid);", highlighted: true },
          { content: "}" },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Encrypted mode (CONFIDENTIAL) — the same shape, but the risk score and
        dispute outcome stay encrypted as Fhenix FHE handles (
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          euint64
        </code>{" "}
        /{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          ebool
        </code>
        ):
      </p>

      <CodeBlock
        filename="IConfidentialUnderwriterPolicy.sol"
        language="solidity"
        lines={[
          { content: "interface IConfidentialUnderwriterPolicy {" },
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

      <Callout
        variant="warning"
        title="ERC-165 expected (not enforced at wiring)"
      >
        <p>
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            IConditionResolver
          </code>{" "}
          inherits{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            IERC165
          </code>
          , so your contract should implement{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            supportsInterface(bytes4)
          </code>{" "}
          and return{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            true
          </code>{" "}
          for the interface ID. Note that this is an interface requirement and
          best practice, but the escrow does <strong>not</strong> call{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            supportsInterface
          </code>{" "}
          when a resolver is wired. The only on-chain guard at wiring time is a{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            resolver.code.length != 0
          </code>{" "}
          check (it reverts with{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            InvalidResolver
          </code>{" "}
          otherwise).
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
