import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import CodeBlock from "@/components/docs/CodeBlock";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import DocsBadge from "@/components/docs/DocsBadge";
import ArchitectureDiagram from "@/components/docs/ArchitectureDiagram";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "escrow-benchmarks", title: "Escrow operation benchmarks", level: 2 },
  { id: "resolver-benchmarks", title: "Resolver gas benchmarks", level: 2 },
  { id: "fhe-cost-analysis", title: "FHE cost analysis", level: 2 },
  {
    id: "why-decryption-expensive",
    title: "Why ciphertext ops are expensive",
    level: 3,
  },
  { id: "minimizing-fhe-costs", title: "Minimizing FHE costs", level: 3 },
  { id: "insurance-benchmarks", title: "Insurance pool benchmarks", level: 2 },
  { id: "cctp-settlement", title: "CCTP v2 cross-chain settlement", level: 2 },
  {
    id: "optimization-tips",
    title: "Optimization tips for resolvers",
    level: 2,
  },
  { id: "gas-budget-guideline", title: "Gas budget guideline", level: 3 },
  { id: "l2-vs-l1", title: "L2 vs L1 comparison", level: 2 },
  { id: "why-l2-essential", title: "Why L2 is essential for FHE", level: 3 },
  { id: "full-cost-summary", title: "Full transaction cost summary", level: 2 },
];

const { prev, next } = getPrevNext("/build/gas-performance");

/* ---- table data ---- */

const escrowBenchColumns = [
  { header: "Operation", key: "op", mono: true, width: "280px" },
  { header: "Gas (estimated)", key: "gas", width: "160px" },
  { header: "FHE ops", key: "fhe" },
  { header: "Notes", key: "notes" },
];
const escrowBenchRows = [
  {
    op: "escrow.create()",
    gas: "~280,000",
    fhe: "encrypt owner, amount",
    notes: "Includes onConditionSet callback to resolver",
  },
  {
    op: "escrow.create() (no resolver)",
    gas: "~210,000",
    fhe: "encrypt owner, amount",
    notes: "Skips resolver callback, cheapest path",
  },
  {
    op: "escrow.fund()",
    gas: "~185,000",
    fhe: "homomorphic add (paidAmount += amount)",
    notes: "ERC-20 transferFrom + encrypted accumulator update",
  },
  {
    op: "escrow.redeem()",
    gas: "~320,000",
    fhe: "FHE.eq (owner check), FHE.and, FHE.select",
    notes: "Calls isConditionMet + FHE.select for silent failure payout",
  },
  {
    op: "escrow.redeem() (no resolver)",
    gas: "~250,000",
    fhe: "FHE.eq (owner check), FHE.select",
    notes: "Skips condition check, cheapest redeem path",
  },
  {
    op: "resolver.isConditionMet()",
    gas: "~25,000 - 80,000",
    fhe: "none (view)",
    notes: "Varies by resolver complexity (see below)",
  },
  {
    op: "resolver.onConditionSet()",
    gas: "~45,000 - 120,000",
    fhe: "none",
    notes: "One-time cost at escrow creation, stores config",
  },
];

const resolverBenchColumns = [
  { header: "Resolver type", key: "type", width: "220px" },
  { header: "isConditionMet gas", key: "isMet", width: "180px" },
  { header: "onConditionSet gas", key: "onSet", width: "180px" },
  { header: "Bottleneck", key: "bottleneck" },
];
const resolverBenchRows = [
  {
    type: "TimeLock",
    isMet: "~25,000",
    onSet: "~45,000",
    bottleneck: "Single SLOAD + timestamp compare",
  },
  {
    type: "PriceFeed (Chainlink)",
    isMet: "~55,000",
    onSet: "~65,000",
    bottleneck: "External call to Chainlink latestRoundData",
  },
  {
    type: "PayPal (zkTLS / Reclaim)",
    isMet: "~28,000",
    onSet: "~80,000",
    bottleneck:
      "isConditionMet is a simple boolean read; proof verification is in submitProof",
  },
  {
    type: "Prediction (UMA Oracle)",
    isMet: "~60,000",
    onSet: "~110,000",
    bottleneck: "External call to hasPrice + getPrice",
  },
  {
    type: "Multi-sig (N-of-M)",
    isMet: "~35,000 - 70,000",
    onSet: "~90,000",
    bottleneck: "Scales with M (number of signers to check)",
  },
];

const fheColumns = [
  { header: "FHE operation", key: "op", mono: true, width: "260px" },
  { header: "Gas overhead", key: "gas", width: "180px" },
  { header: "When it happens", key: "when" },
  { header: "Frequency", key: "freq", width: "140px" },
];
const fheRows = [
  {
    op: "encrypt(uint64)",
    gas: "~45,000 - 60,000",
    when: "Escrow creation, insurance deposit",
    freq: "Once per value",
  },
  {
    op: "eq / ne (equality)",
    gas: "~30,000 - 45,000",
    when: "Owner verification in redeem",
    freq: "Per check",
  },
  {
    op: "add(euint64, euint64)",
    gas: "~35,000 - 50,000",
    when: "Funding accumulation, premium totals",
    freq: "Per fund operation",
  },
  {
    op: "sub(euint64, euint64)",
    gas: "~35,000 - 50,000",
    when: "Withdrawal, partial redemption",
    freq: "Per withdraw",
  },
  {
    op: "gte / lte (comparison)",
    gas: "~30,000 - 45,000",
    when: "Balance checks, threshold validation",
    freq: "Per check",
  },
  {
    op: "select (conditional)",
    gas: "~40,000 - 55,000",
    when: "Conditional logic on encrypted values",
    freq: "Per branch",
  },
  {
    op: "and / or (boolean logic)",
    gas: "~25,000 - 40,000",
    when: "Combining conditions in redeem",
    freq: "Per logic operation",
  },
];

const insuranceBenchColumns = [
  { header: "Operation", key: "op", mono: true, width: "240px" },
  { header: "Gas (estimated)", key: "gas", width: "160px" },
  { header: "FHE ops", key: "fhe" },
  { header: "Notes", key: "notes" },
];
const insuranceBenchRows = [
  {
    op: "pool.create()",
    gas: "~180,000",
    fhe: "encrypt initial params",
    notes: "One-time setup, attaches policy contracts",
  },
  {
    op: "pool.stake()",
    gas: "~220,000",
    fhe: "encrypt stake amount, add to pool total",
    notes: "ERC-20 transfer + encrypted accumulator",
  },
  {
    op: "pool.unstake()",
    gas: "~290,000",
    fhe: "subtract from pool total",
    notes: "Removes stake and transfers tokens",
  },
  {
    op: "coverage.purchase()",
    gas: "~310,000",
    fhe: "encrypt coverage, compute premium",
    notes: "Calls evaluateRisk on the policy contract",
  },
  {
    op: "pool.payClaim()",
    gas: "~350,000",
    fhe: "deduct from pool liquidity",
    notes: "Called by coverage manager after successful dispute",
  },
  {
    op: "coverage.dispute()",
    gas: "~260,000",
    fhe: "encrypt dispute params, call judge()",
    notes: "Policy judge() returns encrypted verdict",
  },
];

const cctpColumns = [
  { header: "Step", key: "step", width: "120px" },
  { header: "Chain", key: "chain", width: "180px" },
  { header: "Gas (estimated)", key: "gas", width: "140px" },
  { header: "Typical time", key: "time", width: "160px" },
  { header: "What happens", key: "what" },
];
const cctpRows = [
  {
    step: "1. Burn",
    chain: "Source (e.g. Ethereum)",
    gas: "~65,000",
    time: "~15 seconds (1 block)",
    what: "USDC is burned on the source chain via TokenMessenger.depositForBurn",
  },
  {
    step: "2. Attestation",
    chain: "Off-chain (Circle)",
    gas: "none",
    time: "~2 - 15 minutes",
    what: "Circle attestation service observes the burn and signs an attestation",
  },
  {
    step: "3. Mint",
    chain: "Destination (Arbitrum)",
    gas: "~80,000",
    time: "~1 second (L2 block)",
    what: "MessageTransmitter.receiveMessage verifies attestation and mints USDC",
  },
  {
    step: "4. Escrow funding",
    chain: "Arbitrum",
    gas: "~185,000",
    time: "~1 second",
    what: "Minted USDC is deposited into the confidential escrow",
  },
];

const settlementColumns = [
  { header: "Route", key: "route", width: "220px" },
  { header: "Typical end-to-end", key: "time", width: "200px" },
  { header: "Gas (total, both chains)", key: "gas" },
];
const settlementRows = [
  {
    route: "Ethereum to Arbitrum",
    time: "3 - 20 minutes",
    gas: "~330,000 (combined)",
  },
  {
    route: "Arbitrum to Arbitrum",
    time: "Instant (no CCTP)",
    gas: "~185,000 (fund only)",
  },
  {
    route: "Base to Arbitrum",
    time: "3 - 15 minutes",
    gas: "~330,000 (combined)",
  },
];

const gasBudgetColumns = [
  { header: "Resolver gas range", key: "range", width: "180px" },
  { header: "Rating", key: "rating", width: "120px" },
  { header: "Guidance", key: "guidance" },
];
const gasBudgetRows = [
  {
    range: "< 30,000",
    rating: <DocsBadge variant="green">Excellent</DocsBadge>,
    guidance: "Single storage read + comparison. Ideal.",
  },
  {
    range: "30,000 - 80,000",
    rating: <DocsBadge variant="blue">Good</DocsBadge>,
    guidance:
      "One external call (oracle) or moderate storage reads. Acceptable.",
  },
  {
    range: "80,000 - 150,000",
    rating: <DocsBadge variant="amber">Caution</DocsBadge>,
    guidance:
      "Multiple external calls or complex logic. Test thoroughly on testnet.",
  },
  {
    range: "> 150,000",
    rating: <DocsBadge variant="red">Avoid</DocsBadge>,
    guidance: "Redesign your resolver. Move computation off the hot path.",
  },
];

const l2Columns = [
  { header: "Metric", key: "metric", width: "220px" },
  { header: "Ethereum L1", key: "l1" },
  { header: "Arbitrum L2", key: "l2" },
  { header: "Difference", key: "diff" },
];
const l2Rows = [
  {
    metric: "Base gas price",
    l1: "~20 - 80 gwei",
    l2: "~0.01 - 0.1 gwei",
    diff: "200 - 2,000x cheaper",
  },
  {
    metric: "escrow.create() cost",
    l1: "~$15 - $60 (280k gas)",
    l2: "~$0.01 - $0.05",
    diff: "L2 makes FHE operations economically viable",
  },
  {
    metric: "escrow.redeem() cost",
    l1: "~$18 - $70 (320k gas)",
    l2: "~$0.01 - $0.06",
    diff: "Decryption-heavy operations benefit most",
  },
  {
    metric: "Block time",
    l1: "~12 seconds",
    l2: "~0.25 seconds",
    diff: "Near-instant confirmation on L2",
  },
  {
    metric: "FHE overhead ratio",
    l1: "70 - 80% of tx cost",
    l2: "70 - 80% of tx cost",
    diff: "Same ratio, but absolute cost is negligible on L2",
  },
  {
    metric: "Calldata cost",
    l1: "Dominant L1 cost factor",
    l2: "Compressed via AnyTrust / Nitro",
    diff: "FHE ciphertexts are large \u2014 L2 compression helps significantly",
  },
  {
    metric: "Finality",
    l1: "~12 minutes (64 blocks)",
    l2: "~7 days (challenge period) / instant soft finality",
    diff: "Soft finality is sufficient for escrow operations",
  },
];

const summaryColumns = [
  { header: "User flow", key: "flow", width: "320px" },
  { header: "Total gas", key: "gas", width: "200px" },
  { header: "Estimated cost (USD)", key: "cost", width: "180px" },
  { header: "Steps", key: "steps" },
];
const summaryRows = [
  {
    flow: "Create + fund + redeem (no resolver)",
    gas: "~645,000",
    cost: "< $0.01",
    steps: "3 transactions",
  },
  {
    flow: "Create + fund + redeem (TimeLock)",
    gas: "~715,000",
    cost: "< $0.01",
    steps: "3 transactions",
  },
  {
    flow: "Create + fund + submit proof + redeem (PayPal)",
    gas: "~935,000",
    cost: "~$0.01",
    steps: "4 transactions",
  },
  {
    flow: "Cross-chain fund (CCTP) + redeem",
    gas: "~580,000 (Arbitrum side)",
    cost: "< $0.01 (Arbitrum) + L1 source cost",
    steps: "2-3 transactions on Arbitrum",
  },
  {
    flow: "Insurance: deposit + purchase coverage",
    gas: "~530,000",
    cost: "< $0.01",
    steps: "2 transactions",
  },
  {
    flow: "Insurance: claim + dispute + resolution",
    gas: "~910,000",
    cost: "~$0.01",
    steps: "3 transactions",
  },
];

export default function GasPerformance() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Gas & Performance"
        description="Detailed gas benchmarks for every protocol operation, FHE cost analysis, CCTP settlement timing, and optimization strategies for resolver writers."
        readingTime="15 min read"
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS runs on Arbitrum (L2) with FHE coprocessor for confidential
        computation. This combination gives you cheap base transactions but adds
        overhead for every FHE operation. Understanding the cost profile helps
        you design resolvers and integrations that stay fast and affordable.
      </p>

      <Callout variant="warning" title="Testnet estimates, confidential-mode focus">
        <p>
          All numbers below are testnet estimates measured on Arbitrum Sepolia
          with the FHE coprocessor devnet and apply to the{" "}
          <strong>confidential-mode</strong> contracts. Mainnet costs will
          vary with network congestion, L1 calldata pricing, and CoFHE
          operator fees.
        </p>
        <p className="mt-2">
          <strong>Plain mode</strong> (the chaos-net launch path) uses no FHE
          operations; expect roughly 40–60% of the gas figures below, because
          the encryption / decryption / select calls drop out entirely.
          Lifecycle, events, and ABI surface are the same.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="escrow-benchmarks"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Escrow operation gas benchmarks
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        These are the core protocol operations. Every escrow goes through
        create, fund, and redeem. Each step involves FHE encryption or
        decryption, which dominates the gas cost.
      </p>

      <DocsTable columns={escrowBenchColumns} rows={escrowBenchRows} />

      <Callout variant="info" title="Key insight">
        <p>
          FHE operations account for 60-75% of the gas in create and redeem. The
          base Solidity logic is cheap; encryption is what you pay for.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="resolver-benchmarks"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Resolver gas benchmarks
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Your resolver's{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          isConditionMet
        </code>{" "}
        function runs on every redeem attempt. Keep it lean. Here is how the
        built-in resolver patterns compare:
      </p>

      <DocsTable columns={resolverBenchColumns} rows={resolverBenchRows} />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          submitProof
        </code>{" "}
        call on the PayPal resolver (separate from{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          isConditionMet
        </code>
        ) costs approximately{" "}
        <strong className="text-docs-text-primary font-semibold">
          ~150,000 gas
        </strong>{" "}
        due to proof hash verification, replay protection writes, and string
        comparisons.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="fhe-cost-analysis"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        FHE cost analysis
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        FHE coprocessor operations are the single biggest cost factor in
        ReineiraOS. Every confidential value — escrow amounts, insurance stakes,
        risk scores — is an FHE ciphertext.
      </p>

      <DocsTable columns={fheColumns} rows={fheRows} />

      <h3
        id="why-decryption-expensive"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Why ciphertext operations are expensive
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The FHE coprocessor handles all encrypted operations. Encryption is
        relatively cheap (client-side with a proof), while operations like
        FHE.select, FHE.mul, and FHE.div are more expensive because they involve
        ciphertext computation on the coprocessor network.
      </p>

      <h3
        id="minimizing-fhe-costs"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Minimizing FHE costs
      </h3>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Batch operations:
          </strong>{" "}
          If you need to update multiple encrypted values, do it in one
          transaction. The per-operation overhead includes a fixed CoFHE context
          setup cost (~15,000 gas) that is amortized across operations in the
          same call.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Avoid unnecessary decryption:
          </strong>{" "}
          Use encrypted comparisons (
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            gte
          </code>
          ,{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            lte
          </code>
          ) instead of decrypting and comparing in plaintext. Comparisons cost
          roughly a third of what decryption costs.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Cache plaintext when safe:
          </strong>{" "}
          The{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            exists
          </code>{" "}
          flag on the escrow struct is a plaintext boolean — use it for cheap
          existence checks before triggering FHE operations.
        </li>
      </ul>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="insurance-benchmarks"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Insurance pool operation gas benchmarks
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Insurance operations follow the same FHE pattern — all financial values
        are encrypted.
      </p>

      <DocsTable columns={insuranceBenchColumns} rows={insuranceBenchRows} />

      {/* ------------------------------------------------------------------ */}
      <h2
        id="cctp-settlement"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        CCTP v2 cross-chain settlement
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        CCTP v2 (Circle Cross-Chain Transfer Protocol) handles USDC movement
        between chains. Settlement is not instant — it follows a
        burn-attest-mint cycle.
      </p>

      <ArchitectureDiagram
        title="CCTP SETTLEMENT FLOW"
        steps={[
          { label: "Burn USDC", sublabel: "Source chain" },
          { label: "Circle attestation", sublabel: "Off-chain (2-15 min)" },
          { label: "Mint USDC", sublabel: "Arbitrum" },
          { label: "Fund escrow", sublabel: "Confidential deposit" },
        ]}
      />

      <DocsTable columns={cctpColumns} rows={cctpRows} />

      <h3 className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3">
        Total settlement time
      </h3>

      <DocsTable columns={settlementColumns} rows={settlementRows} />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The attestation wait (step 2) is the bottleneck. Gas costs on both
        chains are minimal relative to the time spent waiting for Circle's
        attestation service.
      </p>

      <Callout variant="tip" title="Optimizing CCTP settlement">
        <p>
          <strong className="text-docs-text-primary font-semibold">
            Pre-fund escrows
          </strong>{" "}
          with USDC already on Arbitrum to skip CCTP entirely. Use the SDK's{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            awaitSettlement
          </code>{" "}
          helper — it polls the attestation service and automatically calls{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            receiveMessage
          </code>{" "}
          once the attestation is ready. Batch multiple settlements into a
          single polling loop if funding several escrows from the same source
          chain.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="optimization-tips"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Optimization tips for resolver writers
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Your{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          isConditionMet
        </code>{" "}
        function is the hot path — it runs on every{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          redeem()
        </code>{" "}
        call. Follow these rules to keep gas predictable and low.
      </p>

      <h3 className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3">
        Do
      </h3>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Read from storage, do not compute.
          </strong>{" "}
          Pre-compute results in{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            onConditionSet
          </code>{" "}
          or in a separate{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            submitProof
          </code>
          /
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            update
          </code>{" "}
          function. Make{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            isConditionMet
          </code>{" "}
          a single{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            SLOAD
          </code>{" "}
          + comparison.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Use view functions.
          </strong>{" "}
          The interface requires it, but also verify you are not accidentally
          triggering state writes through external calls.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Pack your storage.
          </strong>{" "}
          A resolver that stores a{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            bool fulfilled
          </code>{" "}
          and a{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            uint96 deadline
          </code>{" "}
          in a single slot saves ~2,100 gas per read compared to two separate
          slots.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Return early.
          </strong>{" "}
          Check the cheapest condition first. If{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            fulfilled == false
          </code>
          , return immediately before making external oracle calls.
        </li>
      </ul>

      <h3 className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3">
        Do not
      </h3>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Do not perform FHE operations inside isConditionMet.
          </strong>{" "}
          FHE ops are expensive and your resolver should not need them — the
          escrow contract handles all encrypted value manipulation.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Do not make unbounded loops.
          </strong>{" "}
          If your resolver checks M-of-N signatures, bound N explicitly and
          document the gas scaling.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Do not use string comparisons in the hot path.
          </strong>{" "}
          Pre-hash strings in{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            onConditionSet
          </code>{" "}
          and compare{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            bytes32
          </code>{" "}
          hashes in{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            isConditionMet
          </code>
          .
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Do not call untrusted external contracts.
          </strong>{" "}
          If you must make external calls (e.g., Chainlink), use hardcoded
          addresses and validate return data.
        </li>
      </ul>

      <h3
        id="gas-budget-guideline"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Gas budget guideline
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Aim to keep{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          isConditionMet
        </code>{" "}
        under{" "}
        <strong className="text-docs-text-primary font-semibold">
          80,000 gas
        </strong>
        . The escrow's{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          redeem()
        </code>{" "}
        function already costs ~250,000+ gas for FHE decryption. If your
        resolver adds another 200,000+ gas, the total transaction cost becomes
        unpredictable and expensive for users.
      </p>

      <DocsTable columns={gasBudgetColumns} rows={gasBudgetRows} />

      {/* ------------------------------------------------------------------ */}
      <h2
        id="l2-vs-l1"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        L2 vs L1 comparison
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS is deployed on Arbitrum Sepolia (L2), not Ethereum L1. Here
        is what that means for your costs.
      </p>

      <DocsTable columns={l2Columns} rows={l2Rows} />

      <h3
        id="why-l2-essential"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Why L2 is essential for FHE
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        FHE ciphertexts are large (hundreds of bytes per encrypted value) and
        operations are computationally expensive. On Ethereum L1, a single{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          escrow.create()
        </code>{" "}
        with two encrypted values would cost $15-60 depending on gas prices. On
        Arbitrum, the same operation costs fractions of a cent.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        This cost difference is why ReineiraOS targets Arbitrum exclusively. The
        protocol's confidentiality guarantees require FHE, and FHE requires L2
        economics to be practical for everyday transactions.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="full-cost-summary"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Full transaction cost summary
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        End-to-end costs for common user flows on Arbitrum Sepolia (testnet
        estimates at ~0.1 gwei gas price):
      </p>

      <DocsTable columns={summaryColumns} rows={summaryRows} />

      <Callout variant="info" title="Performance bottleneck">
        <p>
          On Arbitrum L2, even the most complex flows cost less than a cent. The
          performance bottleneck is not gas — it is the CoFHE decryption latency
          (~1-3 seconds per decryption) and CCTP attestation wait times (~2-15
          minutes for cross-chain settlement).
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
