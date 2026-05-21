import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import DocsTable from "@/components/docs/DocsTable";
import DocsBadge from "@/components/docs/DocsBadge";
import CodeBlock from "@/components/docs/CodeBlock";
import PageNav from "@/components/docs/PageNav";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "substrate", title: "Cryptographic substrate (TFHE/CoFHE)", level: 2 },
  { id: "types", title: "Encrypted types", level: 2 },
  { id: "operations", title: "Homomorphic operations & cost", level: 2 },
  { id: "silent-failure", title: "The silent-failure pattern", level: 2 },
];

const { prev, next } = getPrevNext("/research/cryptographic-foundations");

const typeColumns = [
  { header: "Type", key: "type", mono: true, width: "120px" },
  { header: "Plaintext analogue", key: "plain", width: "150px" },
  { header: "Use in the protocol", key: "use" },
];

const typeRows = [
  {
    type: "euint64",
    plain: "uint64",
    use: "Canonical amount type — target amount, cumulative paid amount (six-decimal stablecoin amounts up to ~18.4T units).",
  },
  {
    type: "eaddress",
    plain: "address",
    use: "Encrypted account identifiers — escrow owner and caller. eq / ne / select only.",
  },
  {
    type: "ebool",
    plain: "bool",
    use: "Encrypted-Boolean intermediate that drives the silent-failure pattern (e.g. the redemption flag).",
  },
];

const costColumns = [
  { header: "Operation", key: "op", mono: true, width: "200px" },
  { header: "Cost class", key: "cost" },
];

const costRows = [
  { op: "FHE.and / or / not", cost: "cheap" },
  { op: "FHE.eq / ne", cost: "cheap" },
  { op: "FHE.add / sub", cost: "medium" },
  { op: "FHE.lt / lte / gt / gte", cost: "medium" },
  { op: "FHE.select", cost: "medium–expensive" },
  { op: "FHE.mul", cost: "expensive" },
  { op: "decrypt / re-encrypt", cost: "substrate round-trip (latency-bound)" },
];

export default function CryptographicFoundations() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Cryptographic Foundations"
        description="How encrypted mode works: the TFHE substrate via Fhenix CoFHE, the encrypted types, homomorphic operation costs, and the silent-failure pattern."
        readingTime="6 min read"
      />

      <Callout variant="info" title="Encrypted mode activates at v1.0 mainnet">
        <p>
          <DocsBadge variant="amber">Spec'd · v1.0 mainnet</DocsBadge> The
          cryptographic substrate below powers <strong>encrypted mode</strong>,
          which activates at v1.0 mainnet (Q4 2026), gated on the Fhenix CoFHE
          deployment. Chaos-net (Jul 2026) runs <strong>public mode</strong>{" "}
          (plaintext). The substrate's coprocessor is treated as a separately-
          administered execution counterparty outside the EVM trust boundary
          (§4.1, §4.8, §10).
        </p>
      </Callout>

      <h2
        id="substrate"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Cryptographic substrate (TFHE/CoFHE)
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The protocol's confidentiality guarantees rest on <strong>TFHE</strong>{" "}
        (Fully Homomorphic Encryption over the Torus), instantiated through
        Fhenix's coprocessor-based FHE (<strong>CoFHE</strong>) — a service
        co-located with the EVM that holds the substrate secret key, evaluates
        homomorphic circuits on submitted ciphertexts, and returns attested
        results to the calling contract. TFHE security reduces to the Learning
        With Errors (LWE) hardness assumption; CoFHE exposes homomorphic
        operations as Solidity precompiles, and full decryption requires a
        coprocessor round-trip outside the EVM execution context. (§4.1.)
      </p>

      <h2
        id="types"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Encrypted types
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The per-escrow record carries five ciphertext fields: encrypted owner
        and caller (each <code>eaddress</code>), encrypted target amount and
        cumulative paid amount (each <code>euint64</code>), and an encrypted
        redemption flag (<code>ebool</code>). No settlement-bearing field is
        stored in plaintext in encrypted mode. (§4.2.)
      </p>
      <DocsTable columns={typeColumns} rows={typeRows} />

      <h2
        id="operations"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Homomorphic operations &amp; cost
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Operation cost is asymmetric: bitwise Boolean ops and equality
        comparisons are cheapest; ordered comparisons and add/sub are mid-tier;
        multiplication and the conditional-select gate compose multiple
        programmable bootstraps; decryption is latency-bound on the coprocessor.
        <strong> Property 4.1</strong>: any homomorphic op on ciphertexts is
        monotonically more expensive than its plaintext analogue. (§4.3.)
      </p>
      <DocsTable columns={costColumns} rows={costRows} />

      <h2
        id="silent-failure"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        The silent-failure pattern
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The silent-failure pattern is the protocol's load-bearing
        confidentiality design. On a state-mutating call whose outcome would
        otherwise leak through a revert, the contract evaluates the decision
        predicate homomorphically, combines the per-condition <code>ebool</code>{" "}
        handles into a single encrypted Boolean <code>eValid</code>, and routes
        the state change through a homomorphic <code>select</code> between the
        intended effect and a no-op — so the on-chain trace is identical across
        success and failure. (§4.5.)
      </p>
      <CodeBlock
        filename="silent-failure.sol"
        language="solidity"
        lines={[
          { content: "// Combine conditions into one encrypted boolean" },
          {
            content:
              "ebool eValid = FHE.and(isOwner, FHE.and(notRedeemed, conditionMet));",
            highlighted: true,
          },
          { content: "" },
          { content: "// Select payout or zero — identical trace either way" },
          {
            content:
              "euint64 payout = FHE.select(eValid, paidAmount, zeroAmount);",
            highlighted: true,
          },
        ]}
      />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
