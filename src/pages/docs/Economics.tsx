import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import CodeBlock from "@/components/docs/CodeBlock";
import PageNav from "@/components/docs/PageNav";
import DocsTable from "@/components/docs/DocsTable";
import StatusBadge from "@/components/docs/StatusBadge";
import Steps, { Step } from "@/components/docs/Steps";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "zero-fees", title: "The protocol charges nothing", level: 2 },
  { id: "fee-structure", title: "Configurable fees", level: 2 },
  { id: "protocol-level-fees", title: "Where fees come from", level: 3 },
  { id: "insurance-level-fees", title: "Recourse premiums", level: 3 },
  { id: "operator-subsidy", title: "Operator subsidy", level: 2 },
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
    how: "Stake into their own Recourse pools and earn premiums",
  },
  {
    role: "Pool Underwriters",
    what: "Provide liquidity to Recourse pools",
    how: "Earn proportional share of premiums flowing into the pool",
  },
  {
    role: "Operators",
    what: "Run bonded relay nodes that execute cross-chain CCTP tasks",
    how: "Bonding, slashing, and any subsidy are specified; the operator relay fee is slated for removal (no fee today)",
  },
];

const protocolFeeColumns = [
  { header: "Fee", key: "fee", width: "190px" },
  { header: "Set by", key: "setby", width: "190px" },
  { header: "Trigger", key: "trigger" },
  { header: "Recipient", key: "recipient" },
];
const protocolFeeRows = [
  {
    fee: "Gate condition fee",
    setby: "Builder (per Gate)",
    trigger: "Condition set / settlement, via getConditionFee",
    recipient: "The Gate's configured recipient",
  },
  {
    fee: "Recourse premium",
    setby: "Underwriter (per policy)",
    trigger: "Coverage purchase",
    recipient: "Recourse pool",
  },
  {
    fee: "Operator relay fee (to be removed)",
    setby: "Operator (operatorFeeBps)",
    trigger: "Cross-chain CCTP relay execution",
    recipient: "None — slated for removal",
  },
  {
    fee: "Slasher reward",
    setby: "Spec",
    trigger: "Successful slashing",
    recipient: "Slasher",
  },
];

const insuranceFeeColumns = [
  { header: "Fee", key: "fee", width: "180px" },
  { header: "How it's set", key: "rate", width: "210px" },
  { header: "Trigger", key: "trigger" },
  { header: "Recipient", key: "recipient" },
];
const insuranceFeeRows = [
  {
    fee: "Recourse premium",
    rate: "Underwriter policy (FHE in encrypted mode)",
    trigger: "Coverage purchase",
    recipient: "Recourse pool",
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
  {
    param: "Operator relay fee rate",
    value: "None — slated for removal",
  },
  { param: "Number of relay tasks", value: "100" },
  { param: "Bond asset", value: "Specified" },
  { param: "Unbonding period", value: "Specified" },
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

      <Callout variant="warning" title="The protocol charges nothing">
        <p>
          The protocol takes <strong>no fee of its own</strong> — there is no
          base settlement fee and no protocol cut of volume. The fees on this
          page are <strong>builder- and role-configurable</strong>: a Gate's
          condition fee, an underwriter's premium, and an operator's relay fee.
          Operator economics (bond, relay fee, slashing, subsidy) are{" "}
          <strong>specified</strong>, not yet shipped.
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
        The protocol charges nothing
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        ReineiraOS takes no protocol cut. The{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          FeeManager
        </code>{" "}
        exists so that <em>builders and roles</em> can attach their own fees —
        not so the protocol can skim volume. Its fee bps are owner-settable and
        are being held at zero; there is no base settlement fee in the protocol
        path. The fees that do exist are configured by whoever earns them: a
        Gate sets its condition fee via{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          getConditionFee
        </code>
        , an underwriter sets its premium, and an operator sets its relay fee.
      </p>

      <Callout variant="info" title="Zero-fee posture, honestly stated">
        <p>
          The zero-fee posture is a commitment, not a coded block gate. There is
          no activation-block constant in the contracts; fee bps are owner
          parameters currently set to zero. The protocol itself never takes a
          cut — the only money that moves is to the builder, underwriter, or
          operator who configured it.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="fee-structure"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Configurable fees
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The protocol itself charges nothing. Every fee below is set by the party
        that earns it — a builder, an underwriter, or an operator. None of them
        flow to the protocol, and rates are theirs to set (or zero). The
        operator relay fee and slasher reward are <StatusBadge status="spec" />.
      </p>

      <h3
        id="protocol-level-fees"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Where fees come from
      </h3>

      <DocsTable columns={protocolFeeColumns} rows={protocolFeeRows} />

      <Callout variant="info" title="No escrow creation or settlement fee">
        <p>
          Escrow creation and settlement carry no protocol fee. The only fees
          are the ones a builder, underwriter, or operator chooses to charge —
          the Gate condition fee on conditional release, the underwriter premium
          on coverage purchase, and the operator relay fee on CCTP execution.
        </p>
      </Callout>

      <h3
        id="insurance-level-fees"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Recourse premiums
      </h3>

      <DocsTable columns={insuranceFeeColumns} rows={insuranceFeeRows} />

      <Callout variant="info" title="Encrypted premium computation (v1.0)">
        <p>
          In the encrypted (confidential) track, premiums are computed entirely
          in FHE ciphertext. The illustrative formula{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            FHE.div(FHE.mul(coverageAmount, riskScore), 10000)
          </code>{" "}
          runs on encrypted values — neither the coverage amount, risk score,
          nor resulting premium are visible on-chain. The premium is the
          underwriter's, set by their policy; the protocol takes none of it.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2
        id="operator-subsidy"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Operator subsidy <StatusBadge status="spec" />
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The full operator economics — bonding, the relay fee, slashing, and a
        bootstrap subsidy that compensates operators before relay-fee volume
        ramps — are <strong>specified, not yet shipped</strong>. There is no
        subsidy contract today; this describes the intended mechanism so
        operators can build against it.
      </p>

      <Callout variant="info" title="No committed pool size">
        <p>
          No specific subsidy pool size or per-task rate is committed. The
          subsidy is designed to bootstrap operator coverage and wind down as
          operator relay-fee volume grows.
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
        into the Recourse pools that use their own policies.
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
        Stakers deposit into Recourse pools. Their liquidity backs coverage sold
        by the pool. Premiums flow into the pool as coverage is purchased.
      </p>

      <Callout variant="warning" title="Premium distribution to LPs — Spec'd">
        <p>
          Per-staker premium distribution is{" "}
          <strong>specified but not yet live</strong>. Today{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            pendingRewards()
          </code>{" "}
          returns 0 and{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            claimRewards()
          </code>{" "}
          is a no-op; premiums accumulate in the pool. Proportional LP reward
          accounting is the next release.
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
        Operators run relay nodes that execute cross-chain CCTP tasks: fetching
        Circle attestations and submitting relay transactions on-chain. They
        earn an operator relay fee they configure on the USDC amount they
        bridge, with a bootstrap subsidy while volume ramps. The full mechanism
        — bond, relay fee, slashing, subsidy — is <StatusBadge status="spec" />,
        so the worked example below is illustrative.
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
          {
            content:
              "# Monthly operator revenue — rate r is operator-set (Spec'd; not yet enabled)",
          },
          {
            content: "$500,000 x r = monthly relay revenue",
            highlighted: true,
          },
          { content: "" },
          { content: "# Per-task average" },
          {
            content: "monthly revenue / 100 tasks = per-task average",
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
        In the encrypted (confidential) track, premiums are computed on-chain
        from the encrypted risk score returned by the policy's{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          evaluateRisk()
        </code>{" "}
        function. The formula below is illustrative — the exact arithmetic is
        the underwriter's, defined in their policy:
      </p>

      <CodeBlock
        filename="ConfidentialCoverageManager.sol"
        language="solidity"
        lines={[
          {
            content: "// Illustrative — actual formula is policy-defined",
          },
          {
            content: "euint64 premium = FHE.div(",
            highlighted: true,
          },
          {
            content: "    FHE.mul(coverageAmount, riskScore),",
            highlighted: true,
          },
          {
            content: "    FHE.asEuint64(10000)",
            highlighted: true,
          },
          {
            content: ");",
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
        The protocol takes no cut, so it does not sustain itself on a treasury —
        the participants do. Two compounding loops drive that, and the value in
        each accrues to a role, never to the protocol.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          Loop 1: Cross-chain volume rewards operators.
        </strong>{" "}
        Every CCTP relay pays the executing operator their relay fee. More
        cross-chain settlement volume means more operators find it worthwhile to
        bond and relay, which deepens settlement capacity.
      </p>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <strong className="text-docs-text-primary font-semibold">
          Loop 2: Recourse volume drives staker yield.
        </strong>{" "}
        More coverage purchased = more premiums flowing to pools = higher yield
        for stakers = more liquidity deposited = more coverage capacity. This is
        the liquidity flywheel.
      </p>

      <Callout variant="info" title="Aligned incentives">
        <p>
          The protocol takes no cut of premiums or settlement — every fee
          accrues to the builder, underwriter, or operator who configured it.
          The protocol succeeds when they do. That alignment is the zero-fee
          posture, not a treasury that grows with volume.
        </p>
      </Callout>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
