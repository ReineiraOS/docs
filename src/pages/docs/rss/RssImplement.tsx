import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import Callout from "@/components/docs/Callout";
import CodeBlock from "@/components/docs/CodeBlock";
import DocsTable from "@/components/docs/DocsTable";
import PageNav from "@/components/docs/PageNav";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "what-you-build", title: "What you build", level: 2 },
  { id: "skeleton", title: "A conformant contract", level: 2 },
  { id: "license", title: "Licensing", level: 2 },
];

const { prev, next } = getPrevNext("/settlement-standard/implement-rss");

const layerColumns = [
  { header: "Layer", key: "layer", width: "280px" },
  { header: "License", key: "now", width: "150px" },
  { header: "After 2029-06-01", key: "after" },
];

const layerRows = [
  {
    layer: "Interfaces, libraries, base contracts",
    now: "Apache 2.0",
    after: "Apache 2.0",
  },
  {
    layer: "SDK, plugin templates, cofhejs glue",
    now: "MIT",
    after: "MIT",
  },
  {
    layer: "Token wrappers (cUSDC, cUSDT)",
    now: "MIT",
    after: "MIT",
  },
  {
    layer: "Operator services (orchestrator, coordinator, CLI)",
    now: "Apache 2.0",
    after: "Apache 2.0",
  },
  {
    layer: "Core protocol (escrow, insurance, orchestration)",
    now: "BUSL-1.1",
    after: "Apache 2.0",
  },
];

export default function RssImplement() {
  return (
    <DocsLayout toc={toc} editHref="">
      <Breadcrumbs />

      <PageHeader
        title="Implement RSS Yourself"
        description="Build your own conformant settlement venue against your own contracts. The standard is free to implement; only the reference core carries a time-limited license."
        readingTime="5 min read"
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        RSS is built to be implemented by third parties. Satisfy the{" "}
        <a href="/settlement-standard/conformance">conformance criteria</a> and
        your deployment hosts the same plugins, accepts the same bridge
        handlers, is read by the same indexers, and presents the same SDK
        surface — no matter who maintains the contracts.
      </p>

      {/* What you build */}
      <h2
        id="what-you-build"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        What you build
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        A conformant deployment implements the{" "}
        <a href="/settlement-standard/interface-surface">interface surface</a>{" "}
        and follows five conventions:
      </p>
      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-4">
        <li>
          Implement the mandatory interfaces for your mode (public or
          encrypted).
        </li>
        <li>
          Store settlement state as encrypted types in encrypted mode; run the
          same contracts with plaintext types in public mode.
        </li>
        <li>
          Route every condition-checked redemption through the silent-failure
          pattern, so success and failure look identical on-chain.
        </li>
        <li>
          Use{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            ERC-7201
          </code>{" "}
          namespaced storage with a{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            __gap[50]
          </code>{" "}
          reserve, and accept{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            ERC-2771
          </code>{" "}
          meta-transactions.
        </li>
        <li>
          Emit the canonical events so cross-implementation tooling can follow
          state.
        </li>
      </ul>

      {/* Skeleton */}
      <h2
        id="skeleton"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        A conformant contract
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Inherit the shared base, implement the interface, and declare ERC-165.
        The base wires namespaced storage, the meta-tx forwarder, and the
        canonical events for you.
      </p>
      <CodeBlock
        filename="MyEscrow.sol"
        language="solidity"
        lines={[
          { content: "// SPDX-License-Identifier: MIT" },
          { content: "pragma solidity ^0.8.24;" },
          { content: "" },
          {
            content:
              'import { IConfidentialEscrow } from "@reineira-os/shared/contracts/interfaces/core/IConfidentialEscrow.sol";',
          },
          {
            content:
              'import { TestnetCoreBase } from "@reineira-os/shared/contracts/common/TestnetCoreBase.sol";',
          },
          { content: "" },
          {
            content:
              "contract MyEscrow is TestnetCoreBase, IConfidentialEscrow {",
            highlighted: true,
          },
          {
            content:
              "    /// @custom:storage-location erc7201:myvenue.storage.MyEscrow",
          },
          { content: "    struct Layout {" },
          { content: "        mapping(uint256 => Escrow) escrows;" },
          { content: "        uint256 nextId;" },
          {
            content:
              "        uint256[50] __gap; // reserve for cross-version compatibility",
            highlighted: true,
          },
          { content: "    }" },
          { content: "" },
          { content: "    function create(" },
          { content: "        InEaddress calldata encryptedOwner," },
          { content: "        InEuint64 calldata encryptedAmount," },
          { content: "        address resolver," },
          { content: "        bytes calldata resolverData" },
          { content: "    ) external returns (uint256 escrowId) {" },
          {
            content:
              "        // _msgSender() resolves through the ERC-2771 forwarder",
          },
          {
            content:
              "        // ... store encrypted state, call resolver.onConditionSet ...",
          },
          {
            content: "        emit EscrowCreated(escrowId); // canonical event",
            highlighted: true,
          },
          { content: "    }" },
          { content: "" },
          { content: "    // ... fund / redeem (silent-failure) / views ..." },
          { content: "}" },
        ]}
        showLineNumbers={true}
      />

      <Callout variant="tip" title="Start from the templates">
        <p>
          Compile against the published interfaces in{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            @reineira-os/shared
          </code>{" "}
          and start from the{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            plugin-examples/
          </code>{" "}
          workspace. Questions:{" "}
          <a href="mailto:engineering@reineira.xyz">engineering@reineira.xyz</a>
          .
        </p>
      </Callout>

      {/* License */}
      <h2
        id="license"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Licensing
      </h2>
      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The standard itself — interfaces, conformance criteria, the RIP process
        — is OSI-aligned and free to implement against. Building your own venue
        from your own contracts is unencumbered. Only the reference
        implementation's defensive core is licensed under BUSL-1.1, which
        converts to Apache 2.0 on the irrevocable Change Date{" "}
        <strong>2029-06-01</strong> (sooner if any acceleration trigger fires,
        never later).
      </p>
      <DocsTable columns={layerColumns} rows={layerRows} />
      <p className="text-docs-text-secondary leading-relaxed mt-4">
        BUSL-1.1 allows copying, modification, and non-production use today —
        only production use of the core needs a commercial license until the
        Change Date. The builder-facing layers above are permissive from day
        one, so nothing blocks you from shipping a conformant venue.
      </p>

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
