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

const monoAddr =
  "font-mono text-[13px] bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 text-docs-text-primary break-all";

/**
 * Renders a contract address. For UUPS-proxied contracts, pass `impl` to show
 * the implementation address beneath the proxy — the proxy is the stable entry
 * point, the implementation is the real contract behind it.
 */
function Addr({ proxy, impl }: { proxy: string; impl?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span>
        {impl ? (
          <span className="text-[11px] text-docs-text-muted mr-1.5">proxy</span>
        ) : null}
        <code className={monoAddr}>{proxy}</code>
      </span>
      {impl ? (
        <span>
          <span className="text-[11px] text-docs-text-muted mr-1.5">impl</span>
          <code className="font-mono text-[12px] text-docs-text-secondary break-all">
            {impl}
          </code>
        </span>
      ) : null}
    </div>
  );
}

const contractColumns = [
  { header: "Contract", key: "name", width: "280px" },
  { header: "Address", key: "address" },
  { header: "Status", key: "status", width: "170px" },
];

// Public mode (PLAIN) — live on Arbitrum Sepolia testnet. Values are in the
// clear; the SDK reaches these via sdk.escrow / sdk.recoursePlain. Published as
// single SDK entry points (no proxy/implementation split in a deployment JSON).
const escrowPlainRows = [
  {
    name: "Escrow",
    address: <Addr proxy="0xa125db70c1f17E395AfFa30b32e1e4A94aF3A81c" />,
    status: <StatusBadge status="testnet" />,
  },
  {
    name: "EscrowReceiver",
    address: <Addr proxy="0xD4cb6F1B679C3b16AE02aAdc66e172142EAAC5a2" />,
    status: <StatusBadge status="testnet" />,
  },
];

// Encrypted mode (CONFIDENTIAL) — live on Arbitrum Sepolia testnet against
// MOCKED Fhenix CoFHE; real encryption arrives at v1.0. Proxy + implementation
// pairs are from packages/escrow/deployments/arbitrumSepolia.json.
const escrowConfidentialRows = [
  {
    name: "ConfidentialEscrow",
    address: (
      <Addr
        proxy="0xF50A9CF008a79CFCA39aa9a345aa06e8D12727E2"
        impl="0xe734660419626d1d1714901416e467da63a92367"
      />
    ),
    status: <StatusBadge status="testnet" />,
  },
  {
    name: "CCTPV2ConfidentialEscrowReceiver",
    address: (
      <Addr
        proxy="0xe0E6CC9Ee62Fa36b96eC4F50CDc462Fd14aa0fD3"
        impl="0xaeed75f58bc498ff5954f9d9071b8cc8d09ede7f"
      />
    ),
    status: <StatusBadge status="testnet" />,
  },
];

// Recourse — public mode (PLAIN). RecoursePool is factory-created by PoolFactory.
// Published as single SDK entry points.
const recoursePlainRows = [
  {
    name: "RecoursePool (factory-created)",
    address: <Addr proxy="0xCd05D0B8854ff030d874Ec346EbB883C40E63C33" />,
    status: <StatusBadge status="testnet" />,
  },
  {
    name: "PoolFactory",
    address: <Addr proxy="0xA2D78bfaB94B93106c8Da17E6967501D54DfE772" />,
    status: <StatusBadge status="testnet" />,
  },
  {
    name: "PolicyRegistry",
    address: <Addr proxy="0xAf23b86086FC6DC74796865be3B3a8bBAd68AB95" />,
    status: <StatusBadge status="testnet" />,
  },
  {
    name: "CoverageManager",
    address: <Addr proxy="0x3fcD1896745B2b91b4397e7E762910Fbf7eE9D22" />,
    status: <StatusBadge status="testnet" />,
  },
];

// Recourse — encrypted mode (CONFIDENTIAL). ConfidentialRecoursePool is
// factory-created by ConfidentialPoolFactory — the listed address is the
// implementation the factory clones per pool. Proxy + implementation pairs are
// from packages/recourse/deployments/arbitrumSepolia.json.
const recourseConfidentialRows = [
  {
    name: "ConfidentialRecoursePool",
    address: (
      <div className="flex flex-col gap-1">
        <span>
          <span className="text-[11px] text-docs-text-muted mr-1.5">impl</span>
          <code className={monoAddr}>
            0x75189520f2f618b2E52eeF1007CcbCeAAbB8446b
          </code>
        </span>
        <span className="text-[11px] text-docs-text-muted">
          cloned per pool by the factory
        </span>
      </div>
    ),
    status: <StatusBadge status="testnet" />,
  },
  {
    name: "ConfidentialPolicyRegistry",
    address: (
      <Addr
        proxy="0x17a3222BD2167C7620815CD6a1C8d215F11CAa25"
        impl="0x6420eca79233e831450018292217b6214cb5353e"
      />
    ),
    status: <StatusBadge status="testnet" />,
  },
  {
    name: "ConfidentialCoverageManager",
    address: (
      <Addr
        proxy="0x636084Da863569bd90c94C1C7a5180eBF8F88AAd"
        impl="0x19d06d2812e56dd8097ee2d587fe9ca45a63a0eb"
      />
    ),
    status: <StatusBadge status="testnet" />,
  },
  {
    name: "ConfidentialPoolFactory",
    address: (
      <Addr
        proxy="0x278c43aB5B8726EbdFD6E7352c128aDA48269442"
        impl="0x1af525bdbd758a44c26f781d1c6e55b3e40ae18c"
      />
    ),
    status: <StatusBadge status="testnet" />,
  },
];

// Orchestration — live on Arbitrum Sepolia testnet. Proxy + implementation
// pairs are from packages/orchestration/deployments/arbitrumSepolia.json.
const orchestrationRows = [
  {
    name: "OperatorRegistry",
    address: (
      <Addr
        proxy="0x5Ac3a3750e0a9f7d4ddBC0B52c3f13E8f927FB59"
        impl="0x681bd064ee0ac16cf005cf3f8894805ef3a7a694"
      />
    ),
    status: <StatusBadge status="testnet" />,
  },
  {
    name: "TaskExecutor",
    address: (
      <Addr
        proxy="0x4D239335f39E585Bb75631C4683538EFC496a5EB"
        impl="0xb1a93d5919e9970f29f84ba8a1fcdc9ce106cba0"
      />
    ),
    status: <StatusBadge status="testnet" />,
  },
  {
    name: "FeeManager",
    address: (
      <Addr
        proxy="0x639f5cB99DcF9681A0461A1452c3845811d3308A"
        impl="0x9212b3e6bc449d933ec228a820c4820ce3e7e86e"
      />
    ),
    status: <StatusBadge status="testnet" />,
  },
  {
    name: "CCTPHandler",
    address: (
      <Addr
        proxy="0x575186a64B9FC49E135A2440DC4A1395edc0F3aD"
        impl="0x12b7bec24cc534854751af524119b97a86ef4466"
      />
    ),
    status: <StatusBadge status="testnet" />,
  },
];

const tokenRows = [
  {
    name: "ConfidentialUSDC (cUSDC)",
    address: <Addr proxy="0x42E47f9bA89712C317f60A72C81A610A2b68c48a" />,
    status: <StatusBadge status="testnet" detail="mock / interim" />,
  },
  {
    name: "USDC",
    address: <Addr proxy="0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" />,
    status: <StatusBadge status="testnet" detail="Circle testnet" />,
  },
  {
    name: "MockGovernanceToken (operator staking)",
    address: <Addr proxy="0xb847e041bB3bC78C3CD951286AbCa28593739D12" />,
    status: <StatusBadge status="testnet" detail="mock" />,
  },
];

const externalRows = [
  {
    name: "CCTP MessageTransmitter",
    address: <Addr proxy="0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275" />,
    status: <StatusBadge status="testnet" />,
  },
  {
    name: "TrustedForwarder (ERC-2771)",
    address: <Addr proxy="0x7ceA357B5AC0639F89F9e378a1f03Aa5005C0a25" />,
    status: <StatusBadge status="testnet" />,
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
    messenger: "—",
  },
];

export default function Contracts() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Contracts"
        description="All ReineiraOS contracts are live on Arbitrum Sepolia testnet at fixed addresses across two modes — public (PLAIN) and encrypted (CONFIDENTIAL). Addresses are baked into the SDK — no manual configuration needed."
        readingTime="4 min read"
      />

      <Callout variant="info" title="Arbitrum Sepolia testnet deployment">
        <p>
          All contracts below are live on{" "}
          <DocsBadge variant="blue">Arbitrum Sepolia</DocsBadge> testnet
          (chainId 421614). Addresses are baked into the SDK — you do not need
          to configure them manually. Each table is split into{" "}
          <strong>public mode (PLAIN)</strong> — values in the clear — and{" "}
          <strong>encrypted mode (CONFIDENTIAL)</strong> — running against
          mocked Fhenix CoFHE on testnet, with real encryption arriving at v1.0.
          No chaos-net or mainnet deployment exists yet.
        </p>
      </Callout>

      <Callout variant="warning" title="Upgradeable today, immutable at v1.0">
        <p>
          The contracts below are <strong>upgradeable today</strong> on Arbitrum
          Sepolia testnet. They are deployed behind{" "}
          <strong>UUPS proxies</strong> with an{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            Ownable
          </code>{" "}
          owner that gates an owner-only{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            _authorizeUpgrade
          </code>{" "}
          hook. Where a deployment JSON carries a proxy-and-implementation pair,
          the tables below list both: the <strong>proxy</strong> is the stable
          address you call, and the <strong>implementation</strong> is the real
          contract behind it (it can be swapped without changing the proxy
          address). <strong>Immutability is the v1.0 mainnet target</strong>,
          not today's state: at v1.0 the upgrade key is relinquished so the
          addresses can no longer be upgraded in place. ERC-7201 namespaced
          storage with{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            __gap[50]
          </code>{" "}
          keeps the storage layout forward-compatible across upgrades. The
          tables on this page list the current Arbitrum Sepolia addresses; they
          are a documentation surface, not an on-chain registry.
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
        on Arbitrum Sepolia testnet via <code>sdk.escrow</code>:
      </p>

      <DocsTable columns={contractColumns} rows={escrowPlainRows} />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Encrypted mode (CONFIDENTIAL) — amounts and balances encrypted; live on
        Arbitrum Sepolia testnet against mocked Fhenix CoFHE, with real
        encryption at v1.0:
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
        coverage stack, live on Arbitrum Sepolia testnet via{" "}
        <code>sdk.recoursePlain</code>. Pools are created by the factory, so
        each <code>RecoursePool</code> is deployed per pool (the address below
        is one such factory-created pool):
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
