import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import CodeBlock from "@/components/docs/CodeBlock";
import DocsBadge from "@/components/docs/DocsBadge";
import PageNav from "@/components/docs/PageNav";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "escrow", title: "Escrow lifecycle", level: 2 },
  { id: "gates", title: "Release gates", level: 2 },
  { id: "underwriting", title: "Underwriting", level: 2 },
  { id: "fees", title: "Fee modules", level: 2 },
  { id: "v02", title: "Async & agentic (v0.2)", level: 2 },
];

const { prev, next } = getPrevNext("/settlement-standard/interface-surface");

export default function RssInterfaceSurface() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Interface Surface"
        description="The Solidity interfaces a conformant deployment implements — the escrow lifecycle, pluggable gates, underwriting, and fee modules."
        readingTime="6 min read"
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        RSS is defined by interfaces, not by any one contract. Implement these
        and your deployment is conformant; plugins, indexers, and the SDK work
        against it unchanged. Every interface inherits{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          ERC-165
        </code>{" "}
        so registries can detect support before binding.
      </p>

      <Callout variant="info" title="Two modes, one shape">
        <p>
          Each primitive has a plaintext and an encrypted variant that share
          function names and ordering — the encrypted variant swaps{" "}
          <code>address</code>/<code>uint64</code> for <code>eaddress</code>/
          <code>euint64</code>. Code written against the abstract surface
          compiles for both, so public mode today and encrypted mode at mainnet
          are binary-compatible.
        </p>
      </Callout>

      {/* Escrow */}
      <h2
        id="escrow"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Escrow lifecycle
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          IEscrow
        </code>{" "}
        is create, fund, redeem, and the view accessors. The confidential
        variant takes encrypted inputs and adds{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          fundFrom
        </code>{" "}
        for the cross-chain funding sink.
      </p>
      <CodeBlock
        filename="IConfidentialEscrow.sol"
        language="solidity"
        lines={[
          { content: "interface IConfidentialEscrow {" },
          { content: "    function create(" },
          {
            content: "        InEaddress calldata encryptedOwner,",
            highlighted: true,
          },
          {
            content: "        InEuint64 calldata encryptedAmount,",
            highlighted: true,
          },
          { content: "        address resolver," },
          { content: "        bytes calldata resolverData" },
          { content: "    ) external returns (uint256 escrowId);" },
          { content: "" },
          {
            content:
              "    function fund(uint256 escrowId, InEuint64 calldata encryptedPayment) external;",
          },
          {
            content:
              "    function fundFrom(uint256 escrowId, euint64 amount) external; // cross-chain sink",
          },
          { content: "    function redeem(uint256 escrowId) external;" },
          {
            content:
              "    function redeemMultiple(uint256[] calldata escrowIds) external;",
          },
          { content: "" },
          {
            content:
              "    function getRedeemedStatus(uint256 escrowId) external view returns (bool);",
          },
          {
            content:
              "    function exists(uint256 escrowId) external view returns (bool);",
          },
          { content: "    function total() external view returns (uint256);" },
          { content: "}" },
        ]}
        showLineNumbers={true}
      />

      {/* Gates */}
      <h2
        id="gates"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Release gates
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          IConditionResolver
        </code>{" "}
        controls when an escrow may release. The escrow calls{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          onConditionSet
        </code>{" "}
        once at creation and checks{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          isConditionMet
        </code>{" "}
        on every redeem. See{" "}
        <a href="/build/condition-resolvers">Condition Resolvers</a> for full
        implementations.
      </p>
      <CodeBlock
        filename="IConditionResolver.sol"
        language="solidity"
        lines={[
          { content: "interface IConditionResolver is IERC165 {" },
          {
            content:
              "    function isConditionMet(uint256 escrowId) external view returns (bool);",
            highlighted: true,
          },
          {
            content:
              "    function onConditionSet(uint256 escrowId, bytes calldata data) external;",
          },
          { content: "    function getConditionFee(uint256 escrowId)" },
          {
            content:
              "        external view returns (uint16 bps, address recipient);",
          },
          { content: "}" },
        ]}
        showLineNumbers={true}
      />

      {/* Underwriting */}
      <h2
        id="underwriting"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Underwriting
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        An underwriter policy prices risk and judges disputes. The plaintext
        variant returns plain values; the confidential variant returns FHE
        ciphertexts so competing underwriters can't read pricing or verdicts
        off-chain.
      </p>
      <CodeBlock
        filename="IUnderwriterPolicy.sol"
        language="solidity"
        lines={[
          { content: "interface IUnderwriterPolicy is IERC165 {" },
          {
            content:
              "    function onPolicySet(uint256 coverageId, bytes calldata data) external;",
          },
          {
            content:
              "    function evaluateRisk(uint256 escrowId, bytes calldata riskProof)",
          },
          { content: "        external returns (uint256 riskScore);" },
          {
            content:
              "    function judge(uint256 coverageId, bytes calldata disputeProof)",
          },
          { content: "        external returns (bool valid);" },
          { content: "}" },
          { content: "" },
          { content: "interface IConfidentialUnderwriterPolicy is IERC165 {" },
          {
            content:
              "    function onPolicySet(uint256 coverageId, bytes calldata data) external;",
          },
          {
            content:
              "    function evaluateRisk(uint256 escrowId, bytes calldata riskProof)",
          },
          {
            content: "        external returns (euint64 riskScore);",
            highlighted: true,
          },
          {
            content:
              "    function judge(uint256 coverageId, bytes calldata disputeProof)",
          },
          {
            content: "        external returns (ebool valid);",
            highlighted: true,
          },
          { content: "}" },
        ]}
        showLineNumbers={true}
      />

      {/* Fees */}
      <h2
        id="fees"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Fee modules
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Fee modules are read at lifecycle stamp time — create, condition-set,
        coverage-purchase — never on the redeem hot path. The protocol fee bps
        is governance-settable within an immutable bytecode ceiling (
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          MAX_PROTOCOL_FEE_BPS = 50
        </code>
        ).
      </p>
      <CodeBlock
        filename="IProtocolFeeModule.sol"
        language="solidity"
        lines={[
          { content: "interface IProtocolFeeModule {" },
          { content: "    function getProtocolFee()" },
          {
            content:
              "        external view returns (uint16 bps, address recipient);",
          },
          { content: "}" },
        ]}
        showLineNumbers={true}
      />

      {/* v0.2 */}
      <h2
        id="v02"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Async &amp; agentic{" "}
        <DocsBadge variant="amber">Spec&apos;d · v0.2</DocsBadge>
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        A standard can specify ahead of code. These interfaces are designed and
        become mandatory at RSS v0.2 (Q4 2026); they are not yet shipped, so
        v0.1 conformance is judged only against the interfaces above.{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          IAsyncConditionResolver
        </code>{" "}
        adds a Pending state for gates that need off-chain work;{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          IAgenticJob
        </code>{" "}
        and{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          IExecution
        </code>{" "}
        cover the agentic layer (see{" "}
        <a href="/research/agentic-composition">Agentic Composition</a>).
      </p>
      <CodeBlock
        filename="IAsyncConditionResolver.sol"
        language="solidity"
        lines={[
          {
            content:
              "interface IAsyncConditionResolver is IConditionResolver {",
          },
          {
            content:
              "    enum Status { Unresolved, Pending, Resolved, Rejected }",
            highlighted: true,
          },
          { content: "" },
          {
            content:
              "    function requestResolution(uint256 escrowId) external;",
          },
          {
            content:
              "    function status(uint256 escrowId) external view returns (Status);",
          },
          { content: "}" },
        ]}
        showLineNumbers={true}
      />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
