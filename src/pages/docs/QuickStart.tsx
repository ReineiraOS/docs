import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import RiskCallout from "@/components/docs/RiskCallout";
import CodeBlock from "@/components/docs/CodeBlock";
import DocsTable from "@/components/docs/DocsTable";
import ArchitectureDiagram from "@/components/docs/ArchitectureDiagram";
import PageNav from "@/components/docs/PageNav";
import DocsBadge from "@/components/docs/DocsBadge";
import Steps, { Step } from "@/components/docs/Steps";
import PropertyCard from "@/components/docs/PropertyCard";
import LinkCard from "@/components/docs/LinkCard";
import DocsAccordion, { AccordionItem } from "@/components/docs/DocsAccordion";
import ModeToggle from "@/components/docs/ModeToggle";
import { BookOpen, Code2, Rocket } from "lucide-react";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "prerequisites", title: "Prerequisites", level: 2 },
  { id: "install-sdk", title: "1 — Install the SDK", level: 2 },
  { id: "create-vault", title: "2 — Create your first Escrow", level: 2 },
  { id: "code-examples", title: "Code examples", level: 2 },
  { id: "parameters", title: "Function parameters", level: 2 },
  { id: "fhe-costs", title: "FHE cost considerations", level: 2 },
  { id: "faq", title: "FAQ", level: 2 },
  { id: "vault-flow", title: "Escrow flow diagram", level: 2 },
  { id: "next-steps", title: "Next steps", level: 2 },
];

const { prev, next } = getPrevNext("/get-started/quick-start");

// ── Code content ──────────────────────────────────────────────────────────────

const solidityLines = [
  { content: "// SPDX-License-Identifier: MIT" },
  { content: "pragma solidity ^0.8.24;" },
  { content: "" },
  { content: "// Copy IConfidentialEscrow from the ReineiraOS protocol repo" },
  {
    content:
      'import { IConfidentialEscrow } from "./interfaces/IConfidentialEscrow.sol";',
  },
  {
    content:
      'import { InEuint64, InEaddress } from "@fhenixprotocol/cofhe-contracts/FHE.sol";',
  },
  { content: "" },
  { content: "contract EscrowIntegration {" },
  { content: "    IConfidentialEscrow public immutable escrow;" },
  { content: "" },
  { content: "    constructor(address _escrow) {" },
  { content: "        escrow = IConfidentialEscrow(_escrow);" },
  { content: "    }" },
  { content: "" },
  { content: "    function createEscrow(" },
  { content: "        InEaddress calldata encryptedOwner," },
  { content: "        InEuint64 calldata encryptedAmount," },
  { content: "        address resolver," },
  { content: "        bytes calldata resolverData" },
  { content: "    ) external returns (uint256 escrowId) {", highlighted: true },
  { content: "        escrowId = escrow.create(", highlighted: true },
  { content: "            encryptedOwner,", highlighted: true },
  { content: "            encryptedAmount,", highlighted: true },
  { content: "            resolver,", highlighted: true },
  { content: "            resolverData", highlighted: true },
  { content: "        );", highlighted: true },
  { content: "    }" },
  { content: "}" },
];

const typescriptLines = [
  { content: 'import { ReineiraSDK } from "@reineira-os/sdk";' },
  { content: "" },
  { content: "const sdk = ReineiraSDK.create({" },
  { content: '  network: "testnet",' },
  { content: "  privateKey: process.env.PRIVATE_KEY," },
  { content: "});" },
  { content: "await sdk.initialize();" },
  { content: "" },
  { content: "const vault = await sdk.escrow", highlighted: true },
  { content: "  .build()", highlighted: true },
  { content: "  .amount(sdk.usdc(5000))", highlighted: true },
  { content: "  .owner('0xSeller...')", highlighted: true },
  {
    content: "  .condition('0xPayPalGate...', resolverData)",
    highlighted: true,
  },
  { content: "  .create();", highlighted: true },
  { content: "" },
  { content: "console.log(`Escrow created: ${vault.id}`);" },
];

const hardhatTestLines = [
  { content: 'import { expect } from "chai";' },
  { content: 'import hre from "hardhat";' },
  { content: 'import { Encryptable } from "@cofhe/sdk";' },
  { content: "" },
  { content: "describe('Escrow Integration', () => {" },
  {
    content:
      "  it('should create an Escrow with encrypted amount', async () => {",
  },
  { content: "    const [deployer] = await hre.viem.getWalletClients();" },
  {
    content:
      "    const client = await hre.cofhe.initializeWithHardhatSigner(deployer);",
  },
  { content: "" },
  { content: "    // Encrypt using @cofhe/sdk mocks" },
  {
    content: "    const [encOwner, encAmount] = await client",
  },
  {
    content: "      .encryptInputs([",
  },
  {
    content: "        Encryptable.address(deployer.account.address),",
  },
  {
    content: "        Encryptable.uint64(500_000000n),",
  },
  { content: "      ]).execute();" },
  { content: "" },
  { content: "    const tx = await escrow.write.create([" },
  { content: "      encOwner," },
  { content: "      encAmount," },
  { content: "      resolver.address," },
  { content: '      "0x",' },
  { content: "    ]);" },
  { content: "" },
  { content: "    expect(tx).to.not.be.undefined;" },
  { content: "  });" },
  { content: "});" },
];

// ── Table data ────────────────────────────────────────────────────────────────

const parameterColumns = [
  { header: "Parameter", key: "param", mono: true, width: "180px" },
  { header: "Type", key: "type", type: true, width: "140px" },
  { header: "Description", key: "desc" },
];

const parameterRows = [
  {
    param: "encryptedOwner",
    type: "InEaddress",
    desc: "FHE-encrypted address of the Escrow owner (beneficiary). Encrypted client-side before submission.",
  },
  {
    param: "encryptedAmount",
    type: "InEuint64",
    desc: "FHE-encrypted Escrow amount. Encrypted locally using the network's public FHE key.",
  },
  {
    param: "resolver",
    type: "address",
    desc: "Address of the Gate contract that controls release conditions. Pass address(0) for unconditional Escrows.",
  },
  {
    param: "resolverData",
    type: "bytes",
    desc: "Gate-specific configuration data passed to onConditionSet() during creation. Pass empty bytes if not needed.",
  },
];

// ── PropertyCard data ─────────────────────────────────────────────────────────

const sdkProperties = [
  {
    name: "network",
    type: "string",
    required: true,
    description: 'Target network identifier. Currently: "testnet".',
  },
  {
    name: "privateKey",
    type: "string",
    required: false,
    description:
      "Private key for the signer. Alternative to providing a signer instance.",
  },
  {
    name: "signer",
    type: "Signer",
    required: false,
    description:
      "An ethers.js v6 Signer instance connected to the target network. Alternative to privateKey.",
  },
  {
    name: "rpcUrl",
    type: "string",
    required: false,
    default: "undefined",
    description:
      "Override the default RPC endpoint. Useful for private nodes or rate-limit bypass.",
  },
];

export default function QuickStart() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Quick Start"
        description="Deploy your first Escrow in under 5 minutes."
        readingTime="5 min read"
      />

      <RiskCallout />

      {/* ── Prerequisites ─────────────────────────────────────────────────── */}
      <h2
        id="prerequisites"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Prerequisites
      </h2>

      <Callout variant="info" title="Before you begin">
        <p>
          Make sure you have the following installed and configured before
          proceeding:
        </p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Node.js 20+ and npm, yarn, or pnpm</li>
          <li>A Hardhat development environment</li>
          <li>
            A local Hardhat node with @cofhe/sdk mocks (or access to the FHE
            coprocessor testnet)
          </li>
          <li>A funded wallet on Arbitrum Sepolia</li>
        </ul>
      </Callout>

      {/* ── Steps ─────────────────────────────────────────────────────────── */}
      <h2
        id="install-sdk"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        1 — Install the SDK
      </h2>

      <Steps>
        <Step title="Install the SDK package">
          <p className="mb-3 text-docs-text-secondary">
            Install{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              @reineira-os/sdk
            </code>
            :
          </p>
          <CodeBlock
            filename="terminal"
            language="bash"
            showLineNumbers={false}
            lines={[{ content: "npm install @reineira-os/sdk" }]}
          />
          <p className="mt-3 text-docs-text-muted text-[13px]">
            The SDK bundles all FHE encryption helpers and contract
            interactions. No separate contracts or FHE package needed.
          </p>
        </Step>

        <Step title="Initialize the SDK">
          <p className="mb-3 text-docs-text-secondary">
            Create an SDK instance with your network and signer. All constructor
            options are described in the{" "}
            <a
              href="#parameters"
              className="text-brand-primary font-medium hover:underline"
            >
              property reference
            </a>{" "}
            below.
          </p>
          <CodeBlock
            filename="sdk.ts"
            language="typescript"
            showLineNumbers={false}
            lines={[
              { content: 'import { ReineiraSDK } from "@reineira-os/sdk";' },
              { content: "" },
              { content: "const sdk = ReineiraSDK.create({" },
              { content: '  network: "testnet",' },
              { content: "  privateKey: process.env.PRIVATE_KEY," },
              { content: "});" },
              { content: "await sdk.initialize();" },
            ]}
          />
        </Step>

        <Step title="Encrypt an amount">
          <p className="text-docs-text-secondary">
            In the encrypted track the SDK encrypts amounts client-side before
            they touch the chain. Use the builder pattern — the{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              .amount()
            </code>{" "}
            method handles FHE encryption automatically. The plaintext value
            never leaves your environment.
          </p>
        </Step>
      </Steps>

      <p className="text-docs-text-secondary leading-relaxed mt-6 mb-2">
        ReineiraOS runs the same primitives in two tracks. Pick one — the
        builder API is identical, only the module differs:
      </p>

      <ModeToggle
        publicMode={
          <p>
            <strong>Public (plain)</strong> is the live default on chaos-net
            today. State is plaintext on-chain, so there is no FHE gas overhead
            and everything is publicly verifiable. Use{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              sdk.escrowPlain
            </code>{" "}
            and{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              sdk.recoursePlain
            </code>
            . The examples below also run unchanged against the plain module.
          </p>
        }
        encryptedMode={
          <p>
            <strong>Encrypted (confidential)</strong> is the v1.0 mainnet form.
            Amounts, parties, and conditions are FHE-encrypted on-chain via{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              sdk.escrow
            </code>{" "}
            and{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              sdk.recourse
            </code>
            . The builder snippet below shows this track.
          </p>
        }
      />

      {/* ── Create your first Escrow ────────────────────────────────────── */}
      <h2
        id="create-vault"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        2 — Create your first Escrow
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          ReineiraSDK
        </code>{" "}
        constructor accepts the following options:
      </p>

      <PropertyCard
        title="ReineiraSDK.create(options)"
        properties={sdkProperties}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Create an Escrow using the SDK's fluent builder. The{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          sdk.escrow.build()
        </code>{" "}
        chain handles FHE encryption, Gate attachment, and on-chain submission
        in a single call:
      </p>

      <CodeBlock
        filename="create-vault.ts"
        language="typescript"
        lines={typescriptLines}
        showLineNumbers={true}
      />

      {/* ── Code examples (tabbed) ─────────────────────────────────────── */}
      <h2
        id="code-examples"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Code examples
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The same Escrow creation flow across SDK, Solidity integration, and
        Hardhat tests:
      </p>

      <CodeBlock
        tabs={[
          {
            label: "SDK",
            language: "typescript",
            filename: "create-vault.ts",
            lines: typescriptLines,
          },
          {
            label: "On-chain",
            language: "solidity",
            filename: "EscrowIntegration.sol",
            lines: solidityLines,
          },
          {
            label: "Test",
            language: "typescript",
            filename: "vault.test.ts",
            lines: hardhatTestLines,
          },
        ]}
      />

      <Callout variant="info" title="Testnet only">
        <p>
          ReineiraOS is currently deployed on <strong>Arbitrum Sepolia</strong>{" "}
          with an FHE coprocessor. Gas costs are subsidized on testnet. For
          local development, run Hardhat with{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            @cofhe/sdk
          </code>{" "}
          mocks — no external node required.
        </p>
      </Callout>

      {/* ── Parameter table ───────────────────────────────────────────────── */}
      <h2
        id="parameters"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Function parameters
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13.5px] text-docs-text-primary">
          IConfidentialEscrow.create()
        </code>{" "}
        function accepts the following parameters. Encrypted types (
        <DocsBadge variant="blue">InEuint64</DocsBadge>,{" "}
        <DocsBadge variant="blue">InEaddress</DocsBadge>) are FHE input types
        from the coprocessor.
      </p>

      <DocsTable columns={parameterColumns} rows={parameterRows} />

      {/* ── Warnings ─────────────────────────────────────────────────────── */}
      <h2
        id="fhe-costs"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        FHE cost considerations
      </h2>

      <Callout variant="warning" title="FHE operations are gas-intensive">
        <p>
          Fully homomorphic encryption operations cost significantly more gas
          than standard EVM operations. On testnet this is subsidized. Batch
          Escrow creations where possible and pre-generate encrypted inputs
          off-chain using the SDK.
        </p>
      </Callout>

      <Callout variant="tip" title="Performance optimization">
        Pre-generate encrypted inputs off-chain using the SDK before your
        transaction is broadcast. The SDK handles this automatically via the
        builder pattern.
      </Callout>

      {/* ── FAQ accordion ─────────────────────────────────────────────────── */}
      <h2
        id="faq"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        FAQ
      </h2>

      <DocsAccordion>
        <AccordionItem title="Why euint64 for amounts?" defaultOpen>
          <p>
            ReineiraOS uses{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              euint64
            </code>{" "}
            for encrypted amounts. With 6-decimal USDC this covers values up to
            ~18.4 trillion — more than sufficient for any practical use case.
          </p>
        </AccordionItem>

        <AccordionItem title="Does the Gate ever see the Escrow amount?">
          <p>
            No. The Gate's{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              isConditionMet()
            </code>{" "}
            only receives the{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              escrowId
            </code>{" "}
            — it never receives the decrypted amount. The amount stays encrypted
            on-chain and is only decrypted during settlement.
          </p>
        </AccordionItem>

        <AccordionItem title="What if I pass address(0) as the resolver?">
          <p>
            The Escrow is created without a Gate condition. It can be redeemed
            immediately after funding without any external verification. This is
            useful for simple escrow workflows that don't need conditional
            release.
          </p>
        </AccordionItem>

        <AccordionItem title="Is there an audit?">
          <p>
            Internal review is complete for escrow, Gate, cross-chain, operator,
            and Recourse contracts — Recourse ships its full pool, manager,
            factory, and registry stack. Third-party audit is planned. See{" "}
            <a
              href="/learn/security"
              className="text-brand-primary font-medium hover:underline"
            >
              Security
            </a>{" "}
            for current status.
          </p>
        </AccordionItem>
      </DocsAccordion>

      {/* ── Architecture diagram ──────────────────────────────────────────── */}
      <h2
        id="vault-flow"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Escrow flow diagram
      </h2>

      <ArchitectureDiagram
        title="ESCROW FLOW"
        steps={[
          { label: "Create Escrow", sublabel: "FHE-encrypt amounts on-chain" },
          { label: "Gate Verifies", sublabel: "Condition proof checked" },
          { label: "Settle Funds", sublabel: "Decrypt & release to recipient" },
        ]}
      />

      {/* ── Next steps link cards ─────────────────────────────────────────── */}
      <h2
        id="next-steps"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Next steps
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-2">
        You've created your first Escrow. Continue with:
      </p>

      <LinkCard
        items={[
          {
            title: "Condition Resolvers",
            description:
              "Build custom verification logic for conditional settlement.",
            href: "/build/condition-resolvers",
            icon: Code2,
          },
          {
            title: "Escrow Lifecycle",
            description: "Full state machine and event reference.",
            href: "/build/escrow-lifecycle",
            icon: BookOpen,
          },
          {
            title: "Architecture",
            description:
              "How the FHE, storage, and operator layers fit together.",
            href: "/learn/architecture",
            icon: Rocket,
            badge: "Deep dive",
          },
          {
            title: "ReineiraSDK Reference",
            description: "Complete TypeScript API documentation.",
            href: "/reference/sdk",
            icon: Code2,
          },
        ]}
      />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
