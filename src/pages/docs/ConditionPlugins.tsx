import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import CodeBlock from "@/components/docs/CodeBlock";
import ArchitectureDiagram from "@/components/docs/ArchitectureDiagram";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import Steps, { Step } from "@/components/docs/Steps";
import LinkCard from "@/components/docs/LinkCard";
import { Code2 } from "lucide-react";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "the-interface", title: "The interface", level: 2 },
  { id: "pattern-1-zktls", title: "Pattern 1: zkTLS — PayPal", level: 2 },
  { id: "pattern-1-how-it-works", title: "How it works", level: 3 },
  { id: "pattern-2-oracle", title: "Pattern 2: Oracle — Chainlink", level: 2 },
  {
    id: "pattern-3-prediction",
    title: "Pattern 3: Prediction market",
    level: 2,
  },
  { id: "pattern-4-timelock", title: "Pattern 4: Time lock", level: 2 },
  { id: "unconditional-escrows", title: "Unconditional Escrows", level: 2 },
  { id: "security-checklist", title: "Security checklist", level: 2 },
  { id: "use-reineira-code", title: "Use ReineiraOS Code", level: 2 },
];

const { prev, next } = getPrevNext("/build/condition-resolvers");

const interfaceColumns = [
  { header: "Function", key: "fn", mono: true, width: "200px" },
  { header: "Called by", key: "calledBy", mono: true, width: "240px" },
  { header: "When", key: "when", width: "160px" },
  { header: "Purpose", key: "purpose" },
];
const interfaceRows = [
  {
    fn: "onConditionSet",
    calledBy: "ConfidentialEscrow.create()",
    when: "Escrow creation",
    purpose: "Parse and store your Gate configuration",
  },
  {
    fn: "getConditionFee",
    calledBy: "ConfidentialEscrow._setCondition()",
    when: "Stamp time (in create)",
    purpose:
      "Declare the resolver-author fee in bps (0–10000) and recipient. Return (0, address(0)) for no fee.",
  },
  {
    fn: "isConditionMet",
    calledBy: "ConfidentialEscrow.redeem()",
    when: "Settlement attempt",
    purpose: "Return true if the Gate condition is satisfied",
  },
];

export default function ConditionPlugins() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Condition Resolvers"
        description="Build custom verification contracts that control when an Escrow releases funds — from zkTLS proofs and oracle feeds to prediction markets and time locks."
        readingTime="12 min read"
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        A Gate is a Solidity contract that answers one question:{" "}
        <strong className="text-docs-text-primary font-semibold">
          "Should this Escrow release its funds?"
        </strong>
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        You implement one interface (
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          IConditionResolver
        </code>
        ). The protocol calls it on every redeem attempt. The Gate's logic is
        yours — the protocol doesn't care how you verify, only that you do.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="the-interface"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        The interface
      </h2>

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
            content:
              "    external view returns (uint16 bps, address recipient);",
            highlighted: true,
          },
          { content: "}" },
        ]}
        showLineNumbers={true}
      />

      <DocsTable columns={interfaceColumns} rows={interfaceRows} />

      <Callout variant="info" title="getConditionFee in the examples below">
        <p>
          Each Solidity example below shows only <code>onConditionSet</code> and{" "}
          <code>isConditionMet</code> for clarity. A production resolver must
          also implement{" "}
          <code>
            getConditionFee(uint256 escrowId) view returns (uint16 bps, address
            recipient)
          </code>{" "}
          — the simplest stub is <code>{`{ return (0, address(0)); }`}</code>{" "}
          when you don't charge a resolver-author fee. The protocol calls it
          once at escrow creation to stamp the Condition fee slot; the sum of
          all stamped fees is bounded by <code>MAX_TOTAL_BPS = 10000</code>.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="pattern-1-zktls"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Pattern 1: zkTLS — verify a PayPal payment
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The most powerful pattern. Use Reclaim Protocol to prove that a
        real-world payment happened — without revealing any payment details
        on-chain.
      </p>

      <h3
        id="pattern-1-how-it-works"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        How it works
      </h3>

      <ArchitectureDiagram
        title="ZKTLS PAYPAL FLOW"
        steps={[
          {
            label: "Seller creates escrow",
            sublabel:
              "Sets resolver to PayPalConditionResolver with merchant ID",
          },
          {
            label: "Buyer pays via PayPal",
            sublabel: "Standard PayPal payment — no crypto on buyer side",
          },
          {
            label: "Buyer generates zkTLS proof",
            sublabel:
              "Reclaim SDK proves status=CAPTURED without revealing details",
          },
          {
            label: "Proof submitted on-chain",
            sublabel: "Resolver verifies proof; escrow becomes redeemable",
          },
          {
            label: "Seller redeems",
            sublabel: "Funds transfer from confidential escrow to wallet",
          },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          Solidity contract:
        </strong>
      </p>

      <CodeBlock
        filename="PayPalConditionResolver.sol"
        language="solidity"
        lines={[
          { content: "// SPDX-License-Identifier: MIT" },
          { content: "pragma solidity ^0.8.24;" },
          { content: "" },
          {
            content:
              'import { IConditionResolver } from "@reineira-os/shared/contracts/interfaces/plugins/IConditionResolver.sol";',
          },
          {
            content:
              'import { ERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";',
          },
          { content: "" },
          {
            content:
              "contract PayPalConditionResolver is IConditionResolver, ERC165 {",
          },
          { content: "    struct EscrowConfig {" },
          { content: "        string merchantId;" },
          { content: "        bool fulfilled;" },
          { content: "    }" },
          { content: "" },
          {
            content: "    mapping(uint256 => EscrowConfig) public configs;",
          },
          {
            content:
              "    mapping(bytes32 => bool) public usedProofs; // replay protection",
          },
          { content: "" },
          {
            content:
              "    // Called once at escrow creation — store the merchant ID",
            highlighted: true,
          },
          {
            content:
              "    function onConditionSet(uint256 escrowId, bytes calldata data) external {",
            highlighted: true,
          },
          {
            content:
              "        string memory merchantId = abi.decode(data, (string));",
            highlighted: true,
          },
          {
            content:
              '        require(bytes(merchantId).length > 0, "Empty merchant ID");',
            highlighted: true,
          },
          {
            content:
              "        configs[escrowId] = EscrowConfig(merchantId, false);",
            highlighted: true,
          },
          { content: "    }", highlighted: true },
          { content: "" },
          { content: "    // Called on every redeem attempt" },
          {
            content:
              "    function isConditionMet(uint256 escrowId) external view returns (bool) {",
          },
          { content: "        return configs[escrowId].fulfilled;" },
          { content: "    }" },
          { content: "" },
          { content: "    // Buyer calls this with their zkTLS proof" },
          { content: "    function submitProof(" },
          { content: "        uint256 escrowId," },
          { content: "        bytes calldata proof," },
          { content: "        string calldata extractedStatus," },
          { content: "        string calldata extractedMerchantId" },
          { content: "    ) external {" },
          {
            content: "        EscrowConfig storage config = configs[escrowId];",
          },
          {
            content: '        require(!config.fulfilled, "Already fulfilled");',
          },
          { content: "" },
          {
            content:
              "        // 1. Verify zkTLS proof signature (Reclaim Protocol on-chain verifier)",
          },
          { content: "        bytes32 proofHash = keccak256(proof);" },
          {
            content:
              '        require(!usedProofs[proofHash], "Proof already used");',
          },
          { content: "" },
          {
            content:
              "        // 2. Verify the proof is valid via Reclaim's on-chain verifier",
          },
          { content: "        _verifyReclaimProof(proof);" },
          { content: "" },
          {
            content: "        // 3. Check extracted fields match escrow config",
          },
          { content: "        require(" },
          {
            content:
              '            keccak256(bytes(extractedStatus)) == keccak256("CAPTURED"),',
          },
          { content: '            "Payment not captured"' },
          { content: "        );" },
          { content: "        require(" },
          {
            content:
              "            keccak256(bytes(extractedMerchantId)) == keccak256(bytes(config.merchantId)),",
          },
          { content: '            "Merchant ID mismatch"' },
          { content: "        );" },
          { content: "" },
          {
            content: "        // 4. Mark as fulfilled + prevent replay",
            highlighted: true,
          },
          { content: "        config.fulfilled = true;", highlighted: true },
          {
            content: "        usedProofs[proofHash] = true;",
            highlighted: true,
          },
          { content: "    }" },
          { content: "" },
          {
            content:
              "    function _verifyReclaimProof(bytes calldata proof) internal view {",
          },
          {
            content:
              "        address RECLAIM = 0x...; // Reclaim verifier address on your chain",
          },
          { content: "        (bool success, ) = RECLAIM.staticcall(" },
          {
            content:
              '            abi.encodeWithSignature("verifyProof(bytes)", proof)',
          },
          { content: "        );" },
          {
            content: '        require(success, "Invalid zkTLS proof");',
          },
          { content: "    }" },
          { content: "" },
          {
            content:
              "    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {",
          },
          {
            content:
              "        return interfaceId == type(IConditionResolver).interfaceId",
          },
          {
            content: "            || super.supportsInterface(interfaceId);",
          },
          { content: "    }" },
          { content: "}" },
        ]}
        showLineNumbers={true}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          SDK usage:
        </strong>
      </p>

      <CodeBlock
        filename="paypal-resolver.ts"
        language="typescript"
        lines={[
          { content: "import { ethers } from 'ethers'" },
          { content: "" },
          {
            content: "// Seller creates escrow with PayPal condition",
          },
          {
            content:
              "const resolverData = ethers.AbiCoder.defaultAbiCoder().encode(['string'], ['MERCHANT_ABC123'])",
            highlighted: true,
          },
          { content: "" },
          { content: "const escrow = await sdk.escrow" },
          { content: "  .build()" },
          { content: "  .amount(sdk.usdc(500))" },
          { content: "  .owner('0xSeller...')" },
          {
            content: "  .condition('0xPayPalResolver...', resolverData)",
            highlighted: true,
          },
          { content: "  .create()" },
          { content: "" },
          {
            content: "// Buyer generates proof via Reclaim SDK (off-chain),",
          },
          {
            content: "// then submits it on-chain to the resolver contract",
          },
          {
            content:
              "const resolverAbi = ['function submitProof(uint256,bytes,string,string) external']",
          },
          {
            content:
              "const resolver = new ethers.Contract('0xPayPalResolver...', resolverAbi, buyerSigner)",
          },
          {
            content:
              "await resolver.submitProof(escrow.id, proof, 'CAPTURED', 'MERCHANT_ABC123')",
          },
          { content: "" },
          { content: "// Seller redeems" },
          {
            content: "await escrow.redeem()",
          },
        ]}
        showLineNumbers={true}
      />

      <Callout variant="tip" title="Works for any attestation source">
        <p>
          This pattern works for any service that can produce a zkTLS
          attestation via Reclaim Protocol — Stripe, Wise, bank APIs, delivery
          tracking, any service with a web interface. The attestation is
          verified on-chain by your Gate contract.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="pattern-2-oracle"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Pattern 2: Oracle — Chainlink price feed
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Release an escrow when an asset price crosses a threshold. Uses
        Chainlink's price feeds deployed natively on Arbitrum.
      </p>

      <CodeBlock
        filename="PriceFeedResolver.sol"
        language="solidity"
        lines={[
          { content: "// SPDX-License-Identifier: MIT" },
          { content: "pragma solidity ^0.8.24;" },
          { content: "" },
          {
            content:
              'import { IConditionResolver } from "@reineira-os/shared/contracts/interfaces/plugins/IConditionResolver.sol";',
          },
          {
            content:
              'import { ERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";',
          },
          { content: "" },
          { content: "interface IChainlinkFeed {" },
          {
            content: "    function latestRoundData() external view returns (",
          },
          {
            content:
              "        uint80 roundId, int256 answer, uint256 startedAt,",
          },
          {
            content: "        uint256 updatedAt, uint80 answeredInRound",
          },
          { content: "    );" },
          { content: "}" },
          { content: "" },
          {
            content:
              "contract PriceFeedResolver is IConditionResolver, ERC165 {",
          },
          { content: "    struct PriceCondition {" },
          {
            content:
              "        address feed;        // Chainlink feed address on Arbitrum",
          },
          {
            content:
              "        int256 threshold;    // target price (8 decimals for USD feeds)",
          },
          {
            content:
              "        bool above;          // true = release when price >= threshold",
          },
          {
            content:
              "        uint256 maxStaleness; // max age of price data in seconds",
          },
          { content: "    }" },
          { content: "" },
          {
            content:
              "    mapping(uint256 => PriceCondition) public conditions;",
          },
          { content: "" },
          {
            content:
              "    function onConditionSet(uint256 escrowId, bytes calldata data) external {",
            highlighted: true,
          },
          {
            content:
              "        (address feed, int256 threshold, bool above, uint256 maxStaleness) =",
            highlighted: true,
          },
          {
            content:
              "            abi.decode(data, (address, int256, bool, uint256));",
            highlighted: true,
          },
          { content: "" },
          {
            content: '        require(feed != address(0), "Invalid feed");',
          },
          {
            content:
              '        require(maxStaleness > 0 && maxStaleness <= 86400, "Staleness out of range");',
          },
          { content: "" },
          {
            content:
              "        conditions[escrowId] = PriceCondition(feed, threshold, above, maxStaleness);",
          },
          { content: "    }" },
          { content: "" },
          {
            content:
              "    function isConditionMet(uint256 escrowId) external view returns (bool) {",
            highlighted: true,
          },
          {
            content:
              "        PriceCondition memory cond = conditions[escrowId];",
          },
          {
            content: "        if (cond.feed == address(0)) return false;",
          },
          { content: "" },
          {
            content: "        (, int256 price,, uint256 updatedAt,) =",
          },
          {
            content: "            IChainlinkFeed(cond.feed).latestRoundData();",
          },
          { content: "" },
          {
            content: "        // Check staleness — don't release on stale data",
          },
          {
            content:
              "        if (block.timestamp - updatedAt > cond.maxStaleness) return false;",
          },
          { content: "" },
          {
            content:
              "        return cond.above ? price >= cond.threshold : price <= cond.threshold;",
            highlighted: true,
          },
          { content: "    }" },
          { content: "" },
          {
            content:
              "    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {",
          },
          {
            content:
              "        return interfaceId == type(IConditionResolver).interfaceId",
          },
          {
            content: "            || super.supportsInterface(interfaceId);",
          },
          { content: "    }" },
          { content: "}" },
        ]}
        showLineNumbers={true}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          SDK usage:
        </strong>
      </p>

      <CodeBlock
        filename="price-feed-resolver.ts"
        language="typescript"
        lines={[
          {
            content: "// Chainlink ETH/USD feed on Arbitrum",
          },
          {
            content:
              "const ETH_USD_FEED = '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612'",
          },
          { content: "" },
          {
            content: "// Release when ETH crosses $4,000 (8 decimals)",
          },
          {
            content:
              "const resolverData = ethers.AbiCoder.defaultAbiCoder().encode(",
          },
          {
            content: "  ['address', 'int256', 'bool', 'uint256'],",
          },
          {
            content:
              "  [ETH_USD_FEED, 400000000000n, true, 3600] // feed, $4000, above, 1h staleness",
            highlighted: true,
          },
          { content: ")" },
          { content: "" },
          { content: "const escrow = await sdk.escrow" },
          { content: "  .build()" },
          { content: "  .amount(sdk.usdc(10000))" },
          { content: "  .owner('0xCounterparty...')" },
          {
            content: "  .condition('0xPriceFeedResolver...', resolverData)",
          },
          { content: "  .create()" },
          { content: "" },
          {
            content: "// Escrow releases automatically when ETH >= $4,000",
          },
          {
            content:
              "// No manual intervention needed — anyone can call redeem()",
          },
          {
            content:
              "await escrow.waitForRedeemable({ pollIntervalMs: 30000, timeoutMs: 86400000 })",
          },
          { content: "await escrow.redeem()" },
        ]}
        showLineNumbers={true}
      />

      <Callout variant="info" title="Chainlink feeds on Arbitrum">
        <p>
          Key feeds:{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            ETH/USD
          </code>
          ,{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            BTC/USD
          </code>
          ,{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            ARB/USD
          </code>
          ,{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            USDC/USD
          </code>
          ,{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            LINK/USD
          </code>
          . Full list at{" "}
          <a
            href="https://data.chain.link"
            className="text-brand-primary font-medium hover:underline"
          >
            data.chain.link
          </a>
          .
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="pattern-3-prediction"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Pattern 3: Prediction market — Polymarket / UMA outcome
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Release an escrow based on a prediction market resolution. Uses UMA's
        Optimistic Oracle on Arbitrum to verify real-world event outcomes.
      </p>

      <CodeBlock
        filename="PredictionResolver.sol"
        language="solidity"
        lines={[
          { content: "// SPDX-License-Identifier: MIT" },
          { content: "pragma solidity ^0.8.24;" },
          { content: "" },
          {
            content:
              'import { IConditionResolver } from "@reineira-os/shared/contracts/interfaces/plugins/IConditionResolver.sol";',
          },
          {
            content:
              'import { ERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";',
          },
          { content: "" },
          { content: "interface IOptimisticOracle {" },
          { content: "    function settleAndGetPrice(" },
          {
            content:
              "        bytes32 identifier, uint256 timestamp, bytes memory ancillaryData",
          },
          { content: "    ) external returns (int256);" },
          { content: "" },
          { content: "    function hasPrice(" },
          {
            content:
              "        bytes32 identifier, uint256 timestamp, bytes memory ancillaryData",
          },
          { content: "    ) external view returns (bool);" },
          { content: "" },
          { content: "    function getPrice(" },
          {
            content:
              "        bytes32 identifier, uint256 timestamp, bytes memory ancillaryData",
          },
          { content: "    ) external view returns (int256);" },
          { content: "}" },
          { content: "" },
          {
            content:
              "contract PredictionResolver is IConditionResolver, ERC165 {",
          },
          { content: "    struct MarketCondition {" },
          {
            content:
              "        address oracle;           // UMA Optimistic Oracle on Arbitrum",
          },
          {
            content:
              "        bytes32 identifier;       // price identifier (e.g., YES_OR_NO_QUERY)",
          },
          {
            content:
              "        uint256 requestTimestamp; // when the question was asked",
          },
          {
            content:
              "        bytes ancillaryData;      // the question itself (encoded)",
          },
          {
            content: "        int256 requiredOutcome;   // 1e18 = YES, 0 = NO",
          },
          { content: "    }" },
          { content: "" },
          {
            content:
              "    mapping(uint256 => MarketCondition) public conditions;",
          },
          { content: "" },
          {
            content:
              "    function onConditionSet(uint256 escrowId, bytes calldata data) external {",
          },
          { content: "        (" },
          { content: "            address oracle," },
          { content: "            bytes32 identifier," },
          { content: "            uint256 requestTimestamp," },
          { content: "            bytes memory ancillaryData," },
          { content: "            int256 requiredOutcome" },
          {
            content:
              "        ) = abi.decode(data, (address, bytes32, uint256, bytes, int256));",
          },
          { content: "" },
          {
            content: '        require(oracle != address(0), "Invalid oracle");',
          },
          { content: "" },
          {
            content: "        conditions[escrowId] = MarketCondition(",
          },
          {
            content:
              "            oracle, identifier, requestTimestamp, ancillaryData, requiredOutcome",
          },
          { content: "        );" },
          { content: "    }" },
          { content: "" },
          {
            content:
              "    function isConditionMet(uint256 escrowId) external view returns (bool) {",
            highlighted: true,
          },
          {
            content:
              "        MarketCondition memory cond = conditions[escrowId];",
          },
          {
            content: "        if (cond.oracle == address(0)) return false;",
          },
          { content: "" },
          {
            content:
              "        IOptimisticOracle oracle = IOptimisticOracle(cond.oracle);",
          },
          { content: "" },
          {
            content: "        // Check if the question has been resolved",
          },
          {
            content:
              "        if (!oracle.hasPrice(cond.identifier, cond.requestTimestamp, cond.ancillaryData)) {",
          },
          { content: "            return false;" },
          { content: "        }" },
          { content: "" },
          {
            content: "        // Check if the outcome matches",
          },
          {
            content: "        int256 resolvedPrice = oracle.getPrice(",
          },
          {
            content:
              "            cond.identifier, cond.requestTimestamp, cond.ancillaryData",
          },
          { content: "        );" },
          { content: "" },
          {
            content: "        return resolvedPrice == cond.requiredOutcome;",
            highlighted: true,
          },
          { content: "    }" },
          { content: "" },
          {
            content:
              "    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {",
          },
          {
            content:
              "        return interfaceId == type(IConditionResolver).interfaceId",
          },
          {
            content: "            || super.supportsInterface(interfaceId);",
          },
          { content: "    }" },
          { content: "}" },
        ]}
        showLineNumbers={true}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          SDK usage:
        </strong>
      </p>

      <CodeBlock
        filename="prediction-resolver.ts"
        language="typescript"
        lines={[
          {
            content: "// UMA Optimistic Oracle V3 on Arbitrum",
          },
          {
            content:
              "const UMA_ORACLE = '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2'",
          },
          { content: "" },
          {
            content:
              '// Question: "Did Team X win the championship by Dec 31, 2025?"',
          },
          {
            content: "const ancillaryData = ethers.toUtf8Bytes(",
          },
          {
            content:
              "  'q: Did Team X win the 2025 championship? res_data: p1: 0, p2: 1, p3: 0.5'",
          },
          { content: ")" },
          { content: "" },
          {
            content:
              "const resolverData = ethers.AbiCoder.defaultAbiCoder().encode(",
          },
          {
            content: "  ['address', 'bytes32', 'uint256', 'bytes', 'int256'],",
          },
          { content: "  [" },
          { content: "    UMA_ORACLE," },
          {
            content: "    ethers.id('YES_OR_NO_QUERY'), // identifier",
          },
          {
            content: "    Math.floor(Date.now() / 1000), // request timestamp",
          },
          { content: "    ancillaryData," },
          {
            content:
              "    ethers.parseEther('1'), // requiredOutcome = YES (1e18)",
            highlighted: true,
          },
          { content: "  ]" },
          { content: ")" },
          { content: "" },
          { content: "const escrow = await sdk.escrow" },
          { content: "  .build()" },
          { content: "  .amount(sdk.usdc(25000))" },
          { content: "  .owner('0xWinner...')" },
          {
            content: "  .condition('0xPredictionResolver...', resolverData)",
          },
          { content: "  .create()" },
        ]}
        showLineNumbers={true}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        This pattern works for any binary or numeric outcome — sports results,
        election outcomes, protocol milestones, token price targets, or any
        question UMA's oracle can resolve.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="pattern-4-timelock"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Pattern 4: Time lock (simple)
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The simplest resolver — release after a deadline passes:
      </p>

      <CodeBlock
        filename="TimeLockResolver.sol"
        language="solidity"
        lines={[
          { content: "// SPDX-License-Identifier: MIT" },
          { content: "pragma solidity ^0.8.24;" },
          { content: "" },
          {
            content:
              'import { IConditionResolver } from "@reineira-os/shared/contracts/interfaces/plugins/IConditionResolver.sol";',
          },
          {
            content:
              'import { ERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";',
          },
          { content: "" },
          {
            content:
              "contract TimeLockResolver is IConditionResolver, ERC165 {",
          },
          {
            content: "    mapping(uint256 => uint256) public deadlines;",
          },
          { content: "" },
          {
            content:
              "    function onConditionSet(uint256 escrowId, bytes calldata data) external {",
          },
          {
            content: "        uint256 deadline = abi.decode(data, (uint256));",
          },
          {
            content:
              '        require(deadline > block.timestamp, "Deadline must be in the future");',
            highlighted: true,
          },
          {
            content: "        deadlines[escrowId] = deadline;",
          },
          { content: "    }" },
          { content: "" },
          {
            content:
              "    function isConditionMet(uint256 escrowId) external view returns (bool) {",
          },
          {
            content: "        return block.timestamp >= deadlines[escrowId];",
            highlighted: true,
          },
          { content: "    }" },
          { content: "" },
          {
            content:
              "    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {",
          },
          {
            content:
              "        return interfaceId == type(IConditionResolver).interfaceId",
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
      <h2
        id="unconditional-escrows"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Unconditional escrows
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Omit the{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          .condition()
        </code>{" "}
        call to create an escrow with no release condition — redeemable
        immediately after funding:
      </p>

      <CodeBlock
        filename="unconditional.ts"
        language="typescript"
        lines={[
          { content: "const escrow = await sdk.escrow.create({" },
          { content: "  amount: sdk.usdc(1000)," },
          { content: "  owner: '0xRecipient...'," },
          { content: "})" },
        ]}
        showLineNumbers={false}
      />

      {/* ------------------------------------------------------------------ */}
      <h2
        id="security-checklist"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Security checklist
      </h2>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside">
        <li>
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            isConditionMet
          </code>{" "}
          must be a{" "}
          <strong className="text-docs-text-primary font-semibold">view</strong>{" "}
          function — no state changes, no gas surprises
        </li>
        <li>
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            onConditionSet
          </code>{" "}
          should validate inputs strictly — it runs once at escrow creation
        </li>
        <li>
          Support{" "}
          <strong className="text-docs-text-primary font-semibold">
            ERC-165
          </strong>{" "}
          so the protocol can verify your contract implements the interface
        </li>
        <li>
          Protect against{" "}
          <strong className="text-docs-text-primary font-semibold">
            replay
          </strong>{" "}
          — one escrow ID should map to one condition state; for proof-based
          resolvers, track used proof hashes
        </li>
        <li>
          Keep{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            isConditionMet
          </code>{" "}
          gas low — it is called on every redeem attempt. Read from storage, do
          not compute
        </li>
        <li>
          Validate{" "}
          <strong className="text-docs-text-primary font-semibold">
            data freshness
          </strong>{" "}
          — for oracle-based resolvers, check{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            updatedAt
          </code>{" "}
          timestamps to prevent stale data attacks
        </li>
        <li>
          Never trust{" "}
          <strong className="text-docs-text-primary font-semibold">
            external calls
          </strong>{" "}
          in view functions without validating the source — use known contract
          addresses, not user-supplied ones
        </li>
      </ul>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="use-reineira-code"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Use ReineiraOS Code
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The fastest way to build a resolver is with{" "}
        <a
          href="/developer-tools/reineira-code"
          className="text-brand-primary font-medium hover:underline"
        >
          ReineiraOS Code
        </a>
        . Clone the repo, describe your verification logic in natural language,
        and Claude Code generates a production-ready resolver with tests and
        deployment scripts.
      </p>

      <LinkCard
        items={[
          {
            title: "ReineiraOS Code",
            description:
              "Generate production-ready resolvers with AI-assisted development",
            href: "/developer-tools/reineira-code",
            icon: Code2,
          },
        ]}
      />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
