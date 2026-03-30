import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import CodeBlock from "@/components/docs/CodeBlock";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import Steps, { Step } from "@/components/docs/Steps";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "fee-structure", title: "Fee structure", level: 2 },
  { id: "protocol-level-fees", title: "Protocol-level fees", level: 3 },
  { id: "insurance-level-fees", title: "Insurance-level fees", level: 3 },
  { id: "policy-builders", title: "Earning: Policy Builders", level: 2 },
  { id: "pool-underwriters", title: "Earning: Pool Underwriters", level: 2 },
  { id: "pool-economics-example", title: "Pool economics example", level: 3 },
  { id: "operators", title: "Earning: Operators", level: 2 },
  {
    id: "operator-economics-example",
    title: "Operator economics example",
    level: 3,
  },
  { id: "premium-calculation", title: "Premium calculation", level: 2 },
  { id: "dispute-resolution", title: "Dispute resolution", level: 2 },
  { id: "sustainability", title: "Sustainability model", level: 2 },
];

const { prev, next } = getPrevNext("/docs/learn/economics");

/* ---- table data ---- */

const overviewColumns = [
  { header: "Role", key: "role", width: "200px" },
  { header: "What they do", key: "what" },
  { header: "How they earn", key: "how" },
];
const overviewRows = [
  {
    role: "Policy Builders",
    what: "Write IUnderwriterPolicy contracts that price risk and resolve disputes",
    how: "Stake into their own insurance pools and earn premiums",
  },
  {
    role: "Pool Underwriters",
    what: "Provide liquidity to insurance pools",
    how: "Earn proportional share of premiums flowing into the pool",
  },
  {
    role: "Operators",
    what: "Run staked relay nodes that execute cross-chain CCTP tasks",
    how: "Earn 50 bps on every USDC amount they bridge",
  },
];

const protocolFeeColumns = [
  { header: "Fee", key: "fee", width: "180px" },
  { header: "Rate", key: "rate", width: "160px" },
  { header: "Trigger", key: "trigger" },
  { header: "Recipient", key: "recipient" },
];
const protocolFeeRows = [
  {
    fee: "Protocol fee",
    rate: "30 bps (0.3%)",
    trigger: "Cross-chain task execution",
    recipient: "Protocol (accumulated in FeeManager)",
  },
  {
    fee: "Operator relay fee",
    rate: "50 bps (0.5%)",
    trigger: "Cross-chain task execution",
    recipient: "Relay operator who executed the task",
  },
];

const insuranceFeeColumns = [
  { header: "Fee", key: "fee", width: "180px" },
  { header: "Rate", key: "rate", width: "200px" },
  { header: "Trigger", key: "trigger" },
  { header: "Recipient", key: "recipient" },
];
const insuranceFeeRows = [
  {
    fee: "Insurance premium",
    rate: "Computed on-chain (FHE)",
    trigger: "Coverage purchase",
    recipient: "Insurance pool",
  },
];

const poolParamColumns = [
  { header: "Parameter", key: "param", width: "280px" },
  { header: "Value", key: "value" },
];
const poolParamRows = [
  { param: "Pool TVL", value: "100,000 USDC" },
  { param: "Monthly escrow volume covered", value: "50 escrows" },
  { param: "Average coverage amount", value: "2,000 USDC per escrow" },
  { param: "Average premium rate", value: "2.5% (250 bps)" },
  { param: "Monthly claim rate", value: "2% of covered volume" },
];

const operatorParamColumns = [
  { header: "Parameter", key: "param", width: "280px" },
  { header: "Value", key: "value" },
];
const operatorParamRows = [
  { param: "Monthly relay volume", value: "500,000 USDC" },
  { param: "Operator fee rate", value: "50 bps (0.5%)" },
  { param: "Number of relay tasks", value: "100" },
  { param: "Minimum stake", value: "TBD" },
  { param: "Unbonding period", value: "7 days" },
];

const premiumColumns = [
  { header: "Risk tier", key: "tier", width: "120px" },
  { header: "Score (bps)", key: "score", width: "140px" },
  { header: "Effective rate", key: "rate", width: "140px" },
  { header: "Example premium on $10K coverage", key: "example" },
];
const premiumRows = [
  {
    tier: "Low",
    score: "100\u2013200",
    rate: "1%\u20132%",
    example: "$100\u2013$200",
  },
  {
    tier: "Medium",
    score: "200\u2013500",
    rate: "2%\u20135%",
    example: "$200\u2013$500",
  },
  {
    tier: "High",
    score: "500\u20131000",
    rate: "5%\u201310%",
    example: "$500\u2013$1,000",
  },
];

export default function Economics() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Economics & Incentives"
        description="Fee structure, earning mechanics, and worked numerical examples for protocol roles — policy builders, stakers, and operators."
        readingTime="10 min read"
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS is designed so that participants — policy builders, stakers,
        and operators — earn revenue proportional to the value they contribute.
        This page covers the fee structure, earning mechanics, and worked
        numerical examples for each role.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="overview"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Overview
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Three roles earn from protocol activity:
      </p>

      <DocsTable columns={overviewColumns} rows={overviewRows} />

      {/* ------------------------------------------------------------------ */}
      <h2
        id="fee-structure"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Fee structure
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Fees are charged on cross-chain task execution. The{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          FeeManager
        </code>{" "}
        calculates fees on the USDC amount being relayed. Both rates are
        configurable via{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          setFeeConfig()
        </code>
        .
      </p>

      <h3
        id="protocol-level-fees"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Protocol-level fees
      </h3>

      <DocsTable columns={protocolFeeColumns} rows={protocolFeeRows} />

      <Callout variant="info" title="No escrow creation fee">
        <p>
          Escrow creation itself has no fee. Protocol and operator fees are only
          charged on cross-chain CCTP relay execution — when funds move between
          chains.
        </p>
      </Callout>

      <h3
        id="insurance-level-fees"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Insurance-level fees
      </h3>

      <DocsTable columns={insuranceFeeColumns} rows={insuranceFeeRows} />

      <Callout variant="info" title="Encrypted premium computation">
        <p>
          Insurance premiums are computed entirely in FHE ciphertext. The
          formula{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            FHE.div(FHE.mul(coverageAmount, riskScore), 10000)
          </code>{" "}
          runs on encrypted values — neither the coverage amount, risk score,
          nor resulting premium are ever visible on-chain.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="policy-builders"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Earning role: Policy Builders
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Policy builders write{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          IUnderwriterPolicy
        </code>{" "}
        contracts — three core functions:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              onPolicySet()
            </code>
          </strong>{" "}
          — hook called when a policy is attached to coverage
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              evaluateRisk()
            </code>
          </strong>{" "}
          — returns an encrypted risk score (euint64, 0–10000 bps) that
          determines the premium
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              judge()
            </code>
          </strong>{" "}
          — returns an encrypted boolean verdict (ebool) on disputes
        </li>
      </ul>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The better your risk model, the more pools adopt your policy, and the
        more coverage volume flows through it. Policy builders earn by staking
        into the pools that use their own policies.
      </p>

      <Callout variant="tip" title="Accuracy is the moat">
        <p>
          A policy that prices risk correctly attracts more stakers (because the
          pool is profitable) and more buyers (because premiums are fair). A
          policy that misprices risk either bleeds the pool on claims or loses
          buyers to cheaper alternatives.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="pool-underwriters"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Earning role: Pool Underwriters (LP Stakers)
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Stakers deposit into insurance pools. Their liquidity backs coverage
        sold by the pool. Premiums flow into the pool as coverage is purchased.
      </p>

      <Callout variant="warning" title="Premium distribution — in progress">
        <p>
          Premium distribution to individual stakers is not yet implemented.
          Premiums accumulate in the pool and are currently claimable by the
          pool underwriter. LP reward distribution will be added in a future
          release.
        </p>
      </Callout>

      <h3
        id="pool-economics-example"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Pool economics — illustrative example
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Consider a pool with the following parameters:
      </p>

      <DocsTable columns={poolParamColumns} rows={poolParamRows} />

      <CodeBlock
        filename="pool-math"
        language="bash"
        lines={[
          {
            content: "# Monthly premium income",
          },
          {
            content: "50 escrows x $2,000 x 2.5% = $2,500 in premiums",
            highlighted: true,
          },
          { content: "" },
          { content: "# Monthly claim payouts" },
          {
            content: "50 escrows x $2,000 x 2% = $2,000 in claims",
          },
          { content: "" },
          { content: "# Net pool profit" },
          {
            content: "$2,500 - $2,000 = $500/month net",
            highlighted: true,
          },
        ]}
        showLineNumbers={false}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        These numbers are illustrative. Actual premiums are computed on-chain
        via FHE from the policy's risk score — the exact rates depend on the
        policy implementation.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="operators"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Earning role: Operators
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Operators run staked relay nodes that execute cross-chain CCTP tasks —
        fetching Circle attestations and submitting relay transactions on-chain.
        They earn 50 bps (0.5%) of every USDC amount they bridge.
      </p>

      <h3
        id="operator-economics-example"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Operator economics — illustrative example
      </h3>

      <DocsTable columns={operatorParamColumns} rows={operatorParamRows} />

      <CodeBlock
        filename="operator-math"
        language="bash"
        lines={[
          { content: "# Monthly operator revenue" },
          {
            content: "$500,000 x 0.5% = $2,500/month",
            highlighted: true,
          },
          { content: "" },
          { content: "# Per-task average" },
          {
            content: "$2,500 / 100 tasks = $25/task",
          },
        ]}
        showLineNumbers={false}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Operators compete for relay tasks on a first-claim basis. The first
        operator to call{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          claimTask()
        </code>{" "}
        gets a 60-second exclusive window to execute. After that, any staked
        operator can execute. After 600 seconds, execution is permissionless.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="premium-calculation"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Premium calculation
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Insurance premiums are computed on-chain using the encrypted risk score
        returned by the policy's{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          evaluateRisk()
        </code>{" "}
        function:
      </p>

      <CodeBlock
        filename="ConfidentialCoverageManager.sol"
        language="solidity"
        lines={[
          {
            content:
              "euint64 premium = FHE.div(FHE.mul(coverageAmount, riskScore), FHE.asEuint64(10000));",
            highlighted: true,
          },
        ]}
        showLineNumbers={false}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Where{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          riskScore
        </code>{" "}
        is an encrypted{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          euint64
        </code>{" "}
        in the range 0–10000 (0% to 100%). Typical tiers:
      </p>

      <DocsTable columns={premiumColumns} rows={premiumRows} />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The entire calculation is performed as FHE arithmetic on encrypted
        values. Neither the coverage amount, the risk score, nor the resulting
        premium are ever visible on-chain.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="dispute-resolution"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Dispute resolution
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        When a coverage holder disputes a claim:
      </p>

      <Steps>
        <Step title="Holder files dispute">
          <p className="text-docs-text-secondary leading-relaxed">
            The coverage holder calls{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              dispute()
            </code>{" "}
            with proof bytes. The coverage status changes to Disputed.
          </p>
        </Step>
        <Step title="Policy judges">
          <p className="text-docs-text-secondary leading-relaxed">
            The pool's{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              IUnderwriterPolicy.judge()
            </code>{" "}
            evaluates the dispute proof and returns an encrypted boolean verdict
            (ebool).
          </p>
        </Step>
        <Step title="Claim paid or rejected">
          <p className="text-docs-text-secondary leading-relaxed">
            If the verdict is valid, the coverage amount is paid from pool
            liquidity via{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              payClaim()
            </code>
            . If invalid, the coverage status remains Disputed with no payout.
          </p>
        </Step>
      </Steps>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="sustainability"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Sustainability model
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The protocol sustains itself through two compounding loops:
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          Loop 1: Cross-chain volume drives protocol revenue.
        </strong>{" "}
        Every CCTP relay pays 30 bps to the protocol and 50 bps to the operator.
        More cross-chain settlement volume = more protocol revenue.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          Loop 2: Insurance volume drives staker yield.
        </strong>{" "}
        More coverage purchased = more premiums flowing to pools = higher yield
        for stakers = more liquidity deposited = more coverage capacity. This is
        the liquidity flywheel.
      </p>

      <Callout variant="info" title="Aligned incentives">
        <p>
          The protocol takes no cut of insurance premiums. Premiums flow to the
          pool. The protocol earns only from cross-chain relay fees — aligning
          incentives so the protocol succeeds when builders and operators
          succeed.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
