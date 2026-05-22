import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import CodeBlock from "@/components/docs/CodeBlock";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import DocsBadge from "@/components/docs/DocsBadge";
import Steps, { Step } from "@/components/docs/Steps";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "zero-fees", title: "Zero fees during chaos-net", level: 2 },
  { id: "fee-structure", title: "Post-activation fee structure", level: 2 },
  { id: "protocol-level-fees", title: "Protocol-level fees", level: 3 },
  { id: "insurance-level-fees", title: "Insurance-level fees", level: 3 },
  { id: "operator-subsidy", title: "Operator subsidy programme", level: 2 },
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
  { id: "points", title: "Points & contributor tracks", level: 2 },
  { id: "token", title: "Conditional token (REINEIRA)", level: 2 },
  { id: "sustainability", title: "Sustainability model", level: 2 },
];

const { prev, next } = getPrevNext("/learn/economics");

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
    what: "Run cUSDC-bonded relay nodes that execute cross-chain CCTP tasks",
    how: "Subsidised from a Foundation cUSDC pool during chaos-net; earn 35 bps per bridge after mainnet activation",
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
    fee: "Base escrow settlement fee",
    rate: "25 bps (0.25%)",
    trigger: "Escrow settlement (post-activation only)",
    recipient: "Foundation treasury",
  },
  {
    fee: "Cross-chain protocol fee",
    rate: "15 bps (0.15%)",
    trigger: "Cross-chain task execution (post-activation only)",
    recipient: "Foundation treasury",
  },
  {
    fee: "Cross-chain operator fee",
    rate: "35 bps (0.35%)",
    trigger: "Cross-chain task execution (post-activation only)",
    recipient: "Operator who executed the task",
  },
  {
    fee: "Quorum voting fee",
    rate: "50 bps (0.50%)",
    trigger: "Dispute quorum vote (post-activation only)",
    recipient: "Quorum voters",
  },
  {
    fee: "Slasher reward",
    rate: "10% of slashed stake",
    trigger: "Successful slashing (all blocks)",
    recipient: "Slasher (paid in cUSDC)",
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
  { param: "Operator fee rate", value: "35 bps (0.35%)" },
  { param: "Number of relay tasks", value: "100" },
  { param: "Bond asset", value: "cUSDC (ERC-7984 USDC wrapper)" },
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
        Participants earn in proportion to the value they contribute. This page
        covers the fee structure, earning mechanics, and worked examples for
        each role.
      </p>

      <Callout variant="warning" title="No protocol fees today">
        <p>
          During the current chaos-net window the protocol charges{" "}
          <strong>zero protocol fees</strong>. The post-activation fee schedule
          below applies only after the immutable mainnet activation block is
          reached. There is no live REINEIRA token: operators bond cUSDC, not a
          token, and any token remains conditional on the token-launch trigger
          conditions with no committed date.
        </p>
      </Callout>

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
        id="zero-fees"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Zero fees during chaos-net
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          FeeManager
        </code>{" "}
        carries an immutable{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          MAINNET_ACTIVATION_BLOCK
        </code>{" "}
        constant baked into its bytecode. While{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          block.number
        </code>{" "}
        is below that block,{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          collectFee()
        </code>{" "}
        returns zero — for every protocol fee. There is no governance toggle and
        no admin override; fees turn on only when the chain reaches the
        activation block.
      </p>

      <Callout variant="info" title="Immutable, not configurable">
        <p>
          No party can change the fee schedule while chaos-net is live.
          Activation is purely a function of block height encoded at deployment,
          so the &ldquo;zero fee&rdquo; guarantee holds without trusting an
          operator or the Foundation.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="fee-structure"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Post-activation fee structure{" "}
        <DocsBadge variant="amber">Spec&apos;d</DocsBadge>
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The fees below apply only after{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          MAINNET_ACTIVATION_BLOCK
        </code>
        . Until then every rate below evaluates to zero. After activation the{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          FeeManager
        </code>{" "}
        calculates fees on the USDC amount being relayed or settled. The slasher
        reward is the one exception — it applies on all blocks.
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
          Escrow creation has no fee. After activation, the cross-chain protocol
          and operator fees apply only on CCTP relay execution — when funds move
          between chains — while the base settlement fee applies on escrow
          settlement.
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
        id="operator-subsidy"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Operator subsidy programme{" "}
        <DocsBadge variant="amber">Spec&apos;d</DocsBadge>
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Because protocol fees are zero during chaos-net, operators are
        compensated through the{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          OperatorSubsidyManager
        </code>
        , which pays operators from a Foundation-funded cUSDC pool. The subsidy
        runs only during chaos-net and becomes inert once the mainnet activation
        block is reached and standard fees take over.
      </p>

      <Callout variant="info" title="No committed pool size">
        <p>
          The Foundation does not commit to a specific subsidy pool size or
          per-task rate. The programme bootstraps operator coverage while fees
          are zero, and is structured to wind down at activation.
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
        Operators bond cUSDC — an immutable ERC-7984 USDC wrapper, not a token —
        and run relay nodes that execute cross-chain CCTP tasks: fetching Circle
        attestations and submitting relay transactions on-chain. During
        chaos-net they are paid from the Foundation subsidy pool. After the
        mainnet activation block, they earn the 35 bps (0.35%) cross-chain
        operator fee on every USDC amount they bridge. The worked example below
        reflects the post-activation fee.
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
          { content: "# Monthly operator revenue (post-activation)" },
          {
            content: "$500,000 x 0.35% = $1,750/month",
            highlighted: true,
          },
          { content: "" },
          { content: "# Per-task average" },
          {
            content: "$1,750 / 100 tasks = $17.50/task",
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
        id="points"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Points &amp; contributor tracks
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Contributor engagement runs on a three-track framework:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Cash track
          </strong>{" "}
          <DocsBadge variant="green">Committed</DocsBadge> — accepted work is
          paid in stablecoin.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Conditional token-allocation track
          </strong>{" "}
          <DocsBadge variant="amber">Conditional</DocsBadge> — non-transferable,
          non-redeemable &ldquo;Points&rdquo; that convert to a REINEIRA
          allocation <em>only if</em> a TGE occurs. Three accrual streams:
          operator-task points, LP-duration points, and builder-adoption points.
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Public recognition
          </strong>{" "}
          <DocsBadge variant="green">Committed</DocsBadge> — credit for accepted
          contributions.
        </li>
      </ul>

      <Callout
        variant="warning"
        title="Points have no economic value without a TGE"
      >
        <p>
          Points are non-transferable and non-redeemable. They carry no economic
          value unless and until a TGE occurs, at which point they may convert
          to a REINEIRA allocation. No TGE is committed and there is no date.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="token"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Conditional token (REINEIRA){" "}
        <DocsBadge variant="amber">Research</DocsBadge>
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        There is <strong>no REINEIRA token today</strong>. Any token is
        conditional on the token-launch trigger conditions, with no committed
        date. The figures below describe the supply design <em>if</em> a TGE
        were to happen — they are not live parameters.
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>
          Conditional total supply: <strong>1,000,000,000 REINEIRA</strong>.
        </li>
        <li>
          Operator-emissions allocation: <strong>13% of supply</strong>,
          declining <strong>50 / 30 / 15 / 5</strong> across Y1–Y4. It activates
          only post-TGE.
        </li>
      </ul>

      <Callout variant="warning" title="Conditional, not live">
        <p>
          No emissions, staking-rewards-in-token, or token-based fees exist
          today. Operators bond cUSDC and are subsidised in cUSDC. The supply
          schedule above only applies after a TGE that may never occur.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="sustainability"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Sustainability model
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Once fees activate at the mainnet activation block, the protocol
        sustains itself through two compounding loops. During chaos-net both
        loops run fee-free and operators are bridged by the Foundation subsidy.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          Loop 1: Cross-chain volume drives Foundation treasury revenue.
        </strong>{" "}
        After activation, every CCTP relay pays 15 bps to the Foundation
        treasury and 35 bps to the operator, plus a 25 bps base settlement fee
        on escrow settlement. More cross-chain settlement volume = more treasury
        revenue.
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
          The protocol takes no cut of insurance premiums — premiums flow to the
          pool. Even after activation, the Foundation treasury earns only from
          cross-chain and settlement fees, so the protocol succeeds when
          builders and operators succeed. Today, with fees at zero, that
          alignment is enforced by the immutable activation block.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
