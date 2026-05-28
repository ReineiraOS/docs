import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import CodeBlock from "@/components/docs/CodeBlock";
import ArchitectureDiagram from "@/components/docs/ArchitectureDiagram";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import ModeToggle from "@/components/docs/ModeToggle";
import Steps, { Step } from "@/components/docs/Steps";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "modes", title: "Public vs encrypted mode", level: 2 },
  { id: "the-interface", title: "The interface", level: 2 },
  {
    id: "example-p2p-policy",
    title: "Example: P2P marketplace Insurance policy",
    level: 2,
  },
  { id: "risk-evaluation", title: "Risk evaluation", level: 3 },
  { id: "economics-flow", title: "How the economics work", level: 3 },
  { id: "register-and-deploy", title: "Register and deploy", level: 3 },
  { id: "design-patterns", title: "Policy design patterns", level: 2 },
  { id: "revenue-opportunity", title: "The revenue opportunity", level: 2 },
];

const { prev, next } = getPrevNext("/build/underwriter-policies");

const interfaceColumns = [
  { header: "Function", key: "fn", mono: true, width: "160px" },
  { header: "When called", key: "when", width: "160px" },
  { header: "Returns", key: "returns", width: "240px" },
  { header: "Purpose", key: "purpose" },
];
const interfaceRows = [
  {
    fn: "onPolicySet",
    when: "Coverage purchase",
    returns: "\u2014",
    purpose: "Initialize policy-specific data for this coverage",
  },
  {
    fn: "evaluateRisk",
    when: "Coverage purchase",
    returns: "Encrypted risk score (0\u201310000 bps)",
    purpose: "Determines the premium the buyer pays",
  },
  {
    fn: "judge",
    when: "Dispute filed",
    returns: "Encrypted boolean",
    purpose: "Determines if the claim is valid and should be paid out",
  },
];

const designColumns = [
  { header: "Domain", key: "domain", width: "180px" },
  { header: "Risk evaluation", key: "risk" },
  { header: "Dispute evidence", key: "dispute" },
];
const designRows = [
  {
    domain: "P2P marketplace",
    risk: "Tiered by transaction size",
    dispute: "zkTLS proof of payment reversal (PayPal, Stripe)",
  },
  {
    domain: "Cargo / logistics",
    risk: "Route risk \u00d7 cargo value \u00d7 carrier rating",
    dispute: "IoT sensor data or inspection report via oracle",
  },
  {
    domain: "Freelance / milestones",
    risk: "Contractor reputation score",
    dispute: "On-chain proof of milestone non-completion",
  },
  {
    domain: "Cross-border payroll",
    risk: "Fixed low risk for verified employers",
    dispute: "Government API proof of employment termination (zkTLS)",
  },
  {
    domain: "DeFi settlement",
    risk: "Volatility-adjusted by asset pair",
    dispute: "Chainlink price deviation beyond threshold at settlement time",
  },
];

export default function InsurancePolicies() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Underwriter Policies"
        description="Build underwriter policy contracts that price risk and resolve disputes using FHE-encrypted computations — then earn premiums from every coverage purchase."
        readingTime="10 min read"
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        An insurance policy is a Solidity contract that answers two questions:{" "}
        <strong className="text-docs-text-primary font-semibold">
          "How risky is this Escrow?"
        </strong>{" "}
        and{" "}
        <strong className="text-docs-text-primary font-semibold">
          "Is this dispute legitimate?"
        </strong>
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Build a great policy, attach it to a pool, and earn premiums from every
        coverage purchase.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="modes"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Public vs encrypted mode
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Like Escrow, the Insurance primitive ships in two modes with identical
        interfaces. The plaintext{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          IUnderwriterPolicy
        </code>{" "}
        and the encrypted{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          IConfidentialUnderwriterPolicy
        </code>{" "}
        share function names and ordering.
      </p>

      <ModeToggle
        publicMode={
          <div>
            <p>
              Risk scores, premiums, and dispute verdicts are plaintext
              on-chain. Coverage holder and amount are visible. The policy logic
              (evaluateRisk → premium, judge → payout) is identical to encrypted
              mode — only visibility differs. This is what runs at chaos-net
              today via <code>IUnderwriterPolicy</code>.
            </p>
          </div>
        }
        encryptedMode={
          <div>
            <p>
              <code>IConfidentialUnderwriterPolicy.evaluateRisk</code> and{" "}
              <code>judge</code> return FHE ciphertexts, so competing
              underwriters cannot reverse-engineer pricing or verdict reasoning
              from on-chain traces. Coverage holder, amount, risk score,
              premium, and payout are encrypted. Activates at v1.0 mainnet (Q4
              2026), gated on Fhenix CoFHE.
            </p>
          </div>
        }
      />

      {/* ------------------------------------------------------------------ */}
      <h2
        id="the-interface"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        The interface
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The encrypted-mode interface — used by the example below:
      </p>

      <CodeBlock
        filename="IConfidentialUnderwriterPolicy.sol"
        language="solidity"
        lines={[
          { content: "interface IConfidentialUnderwriterPolicy is IERC165 {" },
          {
            content:
              "  function onPolicySet(uint256 coverageId, bytes calldata data) external;",
          },
          { content: "" },
          {
            content:
              "  function evaluateRisk(uint256 escrowId, bytes calldata riskProof)",
            highlighted: true,
          },
          {
            content: "    external returns (euint64 riskScore);",
            highlighted: true,
          },
          { content: "" },
          {
            content:
              "  function judge(uint256 coverageId, bytes calldata disputeProof)",
            highlighted: true,
          },
          {
            content: "    external returns (ebool valid);",
            highlighted: true,
          },
          { content: "}" },
        ]}
        showLineNumbers={true}
      />

      <p className="text-docs-text-secondary leading-relaxed mt-4 mb-4">
        The plain-mode interface, used by the mainnet launch path, swaps the
        FHE types for primitives but keeps the same shape:
      </p>

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
          },
          { content: "    external returns (uint256 riskScore);" },
          {
            content:
              "  function judge(uint256 coverageId, bytes calldata disputeProof)",
          },
          { content: "    external returns (bool valid);" },
          { content: "}" },
        ]}
        showLineNumbers={true}
      />

      <DocsTable columns={interfaceColumns} rows={interfaceRows} />

      <Callout variant="info" title="FHE-encrypted return values">
        <p>
          Both{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            evaluateRisk
          </code>{" "}
          and{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            judge
          </code>{" "}
          return FHE-encrypted values. The protocol performs arithmetic on
          encrypted data — nobody sees the raw risk score or dispute verdict.{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            FHE.allowThis()
          </code>{" "}
          and{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            FHE.allow(value, msg.sender)
          </code>{" "}
          grant the protocol permission to operate on your encrypted return
          values.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="example-p2p-policy"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Example: P2P marketplace dispute policy
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        A real policy for a P2P marketplace where buyers pay sellers via PayPal
        (using the zkTLS resolver from the{" "}
        <a
          href="/build/condition-resolvers"
          className="text-brand-primary font-medium hover:underline"
        >
          Condition Resolvers
        </a>{" "}
        page). Insurance covers the case where a buyer disputes a PayPal
        transaction after the seller already redeemed crypto.
      </p>

      <h3
        id="risk-evaluation"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Risk evaluation
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Risk scoring based on escrow parameters — higher coverage relative to
        typical transaction sizes = higher risk:
      </p>

      <CodeBlock
        filename="P2PMarketplacePolicy.sol"
        language="solidity"
        lines={[
          { content: "// SPDX-License-Identifier: MIT" },
          { content: "pragma solidity ^0.8.24;" },
          { content: "" },
          {
            content:
              'import { IConfidentialUnderwriterPolicy } from "@reineira-os/shared/contracts/interfaces/plugins/IConfidentialUnderwriterPolicy.sol";',
          },
          {
            content:
              'import { ERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";',
          },
          {
            content:
              'import { FHE, euint64, ebool } from "@fhenixprotocol/cofhe-contracts/FHE.sol";',
          },
          { content: "" },
          {
            content:
              "contract P2PMarketplacePolicy is IConfidentialUnderwriterPolicy, ERC165 {",
          },
          {
            content: "    // Risk tiers in basis points (100 bps = 1%)",
          },
          {
            content:
              "    uint64 constant LOW_RISK  = 200;   // 2% premium — small transactions",
            highlighted: true,
          },
          {
            content:
              "    uint64 constant MED_RISK  = 500;   // 5% premium — medium transactions",
            highlighted: true,
          },
          {
            content:
              "    uint64 constant HIGH_RISK = 1000;  // 10% premium — large transactions",
            highlighted: true,
          },
          { content: "" },
          {
            content: "    // Coverage amount thresholds (6 decimals, USDC)",
          },
          {
            content:
              "    uint256 constant MED_THRESHOLD  = 5000e6;   // $5,000",
          },
          {
            content:
              "    uint256 constant HIGH_THRESHOLD = 25000e6;  // $25,000",
          },
          { content: "" },
          { content: "    struct CoverageConfig {" },
          {
            content:
              "        uint256 coverageAmount;  // stored from onPolicySet",
          },
          { content: "        uint256 createdAt;" },
          { content: "    }" },
          { content: "" },
          {
            content: "    mapping(uint256 => CoverageConfig) public coverages;",
          },
          { content: "" },
          {
            content:
              "    function onPolicySet(uint256 coverageId, bytes calldata data) external {",
          },
          {
            content:
              "        uint256 coverageAmount = abi.decode(data, (uint256));",
          },
          {
            content:
              "        coverages[coverageId] = CoverageConfig(coverageAmount, block.timestamp);",
          },
          { content: "    }" },
          { content: "" },
          {
            content:
              "    function evaluateRisk(uint256, bytes calldata riskProof)",
          },
          { content: "        external returns (euint64)" },
          { content: "    {" },
          {
            content:
              "        uint256 amount = abi.decode(riskProof, (uint256));",
          },
          { content: "" },
          {
            content: "        // Tiered risk based on transaction size",
          },
          { content: "        uint64 score;" },
          {
            content: "        if (amount >= HIGH_THRESHOLD) {",
          },
          { content: "            score = HIGH_RISK;" },
          {
            content: "        } else if (amount >= MED_THRESHOLD) {",
          },
          { content: "            score = MED_RISK;" },
          { content: "        } else {" },
          { content: "            score = LOW_RISK;" },
          { content: "        }" },
          { content: "" },
          {
            content:
              "        // Encrypt the score — protocol uses it to calculate premium",
            highlighted: true,
          },
          {
            content: "        euint64 encryptedScore = FHE.asEuint64(score);",
            highlighted: true,
          },
          {
            content: "        FHE.allowThis(encryptedScore);",
            highlighted: true,
          },
          {
            content: "        FHE.allow(encryptedScore, msg.sender);",
            highlighted: true,
          },
          {
            content: "        return encryptedScore;",
            highlighted: true,
          },
          { content: "    }" },
          { content: "" },
          {
            content:
              "    function judge(uint256 coverageId, bytes calldata disputeProof)",
          },
          { content: "        external returns (ebool)" },
          { content: "    {" },
          {
            content:
              "        CoverageConfig memory config = coverages[coverageId];",
          },
          {
            content:
              "        bool isValid = _evaluateDispute(coverageId, config, disputeProof);",
          },
          { content: "" },
          {
            content: "        ebool result = FHE.asEbool(isValid);",
            highlighted: true,
          },
          {
            content: "        FHE.allowThis(result);",
            highlighted: true,
          },
          {
            content: "        FHE.allow(result, msg.sender);",
            highlighted: true,
          },
          { content: "        return result;", highlighted: true },
          { content: "    }" },
          { content: "" },
          { content: "    function _evaluateDispute(" },
          { content: "        uint256 coverageId," },
          {
            content: "        CoverageConfig memory config,",
          },
          { content: "        bytes calldata disputeProof" },
          {
            content: "    ) internal view returns (bool) {",
          },
          { content: "        // Decode dispute evidence" },
          { content: "        (" },
          {
            content:
              "            bool hasPayPalDispute,    // PayPal opened a dispute case",
          },
          {
            content:
              "            uint256 disputeTimestamp, // when PayPal dispute was filed",
          },
          {
            content:
              "            bytes memory zkProof      // zkTLS proof of PayPal dispute status",
          },
          {
            content:
              "        ) = abi.decode(disputeProof, (bool, uint256, bytes));",
          },
          { content: "" },
          {
            content: "        // Rule 1: Must have an active PayPal dispute",
          },
          {
            content: "        if (!hasPayPalDispute) return false;",
          },
          { content: "" },
          {
            content:
              "        // Rule 2: Dispute must have been filed within 30 days of coverage",
          },
          {
            content:
              "        if (disputeTimestamp > config.createdAt + 30 days) return false;",
          },
          {
            content:
              "        if (disputeTimestamp < config.createdAt) return false;",
          },
          { content: "" },
          {
            content: "        // Rule 3: zkTLS proof must be present",
          },
          {
            content: "        if (zkProof.length == 0) return false;",
          },
          { content: "" },
          {
            content: "        // All checks passed — claim is legitimate",
          },
          { content: "        return true;" },
          { content: "    }" },
          { content: "" },
          {
            content:
              "    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {",
          },
          {
            content:
              "        return interfaceId == type(IConfidentialUnderwriterPolicy).interfaceId",
          },
          {
            content: "            || super.supportsInterface(interfaceId);",
          },
          { content: "    }" },
          { content: "}" },
        ]}
        showLineNumbers={true}
      />

      {/* ------------------------------------------------------------------ */}
      <h3
        id="economics-flow"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        How the economics work
      </h3>

      <Steps>
        <Step title="Buyer purchases coverage">
          <p className="text-docs-text-secondary leading-relaxed mb-2">
            Buyer wants to insure a $1,000 P2P trade. Policy evaluates risk at
            200 bps (2%).
          </p>
          <p className="text-docs-text-secondary leading-relaxed">
            <strong className="text-docs-text-primary font-semibold">
              Premium = $1,000 x 2% = $20
            </strong>
          </p>
        </Step>
        <Step title="Premium flows to pool">
          <p className="text-docs-text-secondary leading-relaxed">
            The $20 premium is transferred (encrypted) to the insurance pool.
            Pool stakers earn yield from this premium.
          </p>
        </Step>
        <Step title="Trade completes normally">
          <p className="text-docs-text-secondary leading-relaxed">
            Most trades complete without issues. The coverage expires after 30
            days. The pool keeps the $20 premium — pure profit for stakers.
          </p>
        </Step>
        <Step title="Or: dispute filed">
          <p className="text-docs-text-secondary leading-relaxed mb-2">
            Buyer proves PayPal reversed the payment (zkTLS proof). Policy{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              judge()
            </code>{" "}
            validates the evidence and approves the claim.
          </p>
          <p className="text-docs-text-secondary leading-relaxed">
            <strong className="text-docs-text-primary font-semibold">
              $1,000 claim paid from pool liquidity
            </strong>
          </p>
        </Step>
      </Steps>

      {/* ------------------------------------------------------------------ */}
      <h3
        id="register-and-deploy"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Register and deploy
      </h3>

      <CodeBlock
        filename="register-policy.ts"
        language="typescript"
        lines={[
          {
            content: "// Deploy your policy contract to Arbitrum",
          },
          {
            content: "// Then register it with the protocol",
          },
          {
            content: "// Get your pool and add the policy",
          },
          {
            content: "const pool = await sdk.insurance.getPool(0n)",
          },
          {
            content: "await pool.addPolicy('0xP2PMarketplacePolicy...')",
            highlighted: true,
          },
        ]}
        showLineNumbers={false}
      />

      {/* ------------------------------------------------------------------ */}
      <h2
        id="design-patterns"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Policy design patterns
      </h2>

      <DocsTable columns={designColumns} rows={designRows} />

      {/* ------------------------------------------------------------------ */}
      <h2
        id="revenue-opportunity"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        The revenue opportunity
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Policy builders who write accurate risk models attract more pools, more
        stakers, and more coverage purchases. The math is simple:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>A pool with $100K liquidity backing your policy</li>
        <li>Average 3% premium across all coverages</li>
        <li>$500K in monthly coverage volume</li>
        <li>
          ={" "}
          <strong className="text-docs-text-primary font-semibold">
            $15K/month in premiums
          </strong>{" "}
          flowing to the pool
        </li>
        <li>Pool stakers earn their share; you can stake into your own pool</li>
      </ul>

      <Callout variant="tip" title="Accuracy is the moat">
        <p>
          The best policy builders — those whose claim rates match their risk
          predictions — build the most trusted pools in the ecosystem. Like
          Morpho vault curators, accuracy is the moat.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
