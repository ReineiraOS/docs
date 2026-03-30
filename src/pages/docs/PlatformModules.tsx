import DocsLayout from "@/components/layout/DocsLayout";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import PageHeader from "@/components/docs/PageHeader";
import CodeBlock from "@/components/docs/CodeBlock";
import DocsTable from "@/components/docs/DocsTable";
import Callout from "@/components/docs/Callout";
import Steps, { Step } from "@/components/docs/Steps";
import ArchitectureDiagram from "@/components/docs/ArchitectureDiagram";
import PageNav from "@/components/docs/PageNav";
import LinkCard from "@/components/docs/LinkCard";
import { Code2, Layers, Globe } from "lucide-react";
import { getPrevNext } from "@/data/navigation";
import type { TocItem } from "@/components/layout/TableOfContents";

const toc: TocItem[] = [
  { id: "architecture", title: "Architecture", level: 2 },
  { id: "getting-started", title: "Getting started", level: 2 },
  { id: "backend-module", title: "Backend module", level: 2 },
  { id: "backend-features", title: "Backend features", level: 3 },
  { id: "backend-deployment", title: "Backend deployment", level: 3 },
  { id: "app-module", title: "App module", level: 2 },
  { id: "app-features", title: "App features", level: 3 },
  { id: "application-layers", title: "Application layers", level: 3 },
  { id: "auth-flow", title: "Auth flow", level: 3 },
  { id: "payment-link-module", title: "Payment Link module", level: 2 },
  { id: "payment-link-features", title: "Payment Link features", level: 3 },
  { id: "payment-flow", title: "Payment flow", level: 3 },
  { id: "store-architecture", title: "Store architecture", level: 3 },
  { id: "configuration", title: "Configuration", level: 2 },
  { id: "reineira-json", title: "reineira.json", level: 3 },
  { id: "environment-variables", title: "Environment variables", level: 3 },
  { id: "deployment", title: "Deployment", level: 2 },
  { id: "ecosystem", title: "Ecosystem", level: 2 },
];

const { prev, next } = getPrevNext("/docs/build/platform-modules");

const packageColumns = [
  { header: "Package", key: "package", width: "260px" },
  { header: "Stack", key: "stack" },
  { header: "Purpose", key: "purpose" },
];

const packageRows = [
  {
    package: "@reineira-os/modules-backend",
    stack: "TypeScript, Clean Architecture, Vercel-ready, DB-agnostic",
    purpose:
      "Backend API — order management, webhook handlers, SDK orchestration",
  },
  {
    package: "@reineira-os/modules-app",
    stack: "Vue 3, ZeroDev smart accounts, passkey auth",
    purpose: "Platform app — the dashboard your users interact with",
  },
  {
    package: "@reineira-os/modules-payment-link",
    stack: "Vue 3, Wagmi, RainbowKit, CCTP v2",
    purpose:
      "Shareable payment link — external payers fund escrows cross-chain",
  },
];

const storeColumns = [
  { header: "Store", key: "store", mono: true, width: "160px" },
  { header: "Responsibility", key: "responsibility" },
];

const storeRows = [
  {
    store: "invoiceStore",
    responsibility:
      "Fetches and holds invoice/escrow metadata from the backend",
  },
  {
    store: "paymentStore",
    responsibility:
      "Manages payment transaction state — pending, confirming, settled",
  },
  {
    store: "walletStore",
    responsibility:
      "Tracks connected wallet address, chain, and connection status",
  },
  {
    store: "chainStore",
    responsibility: "Lists supported chains, handles chain switching",
  },
  {
    store: "balanceStore",
    responsibility: "Reads USDC balance on the connected chain",
  },
];

const envColumns = [
  { header: "Variable", key: "variable", mono: true, width: "260px" },
  { header: "Package", key: "pkg", width: "140px" },
  { header: "Description", key: "desc" },
];

const envRows = [
  {
    variable: "REINEIRA_SDK_KEY",
    pkg: "backend",
    desc: "SDK API key for escrow and insurance operations",
  },
  {
    variable: "DATABASE_URL",
    pkg: "backend",
    desc: "Connection string for your database of choice",
  },
  {
    variable: "JWT_SECRET",
    pkg: "backend",
    desc: "Secret for signing authentication tokens",
  },
  {
    variable: "VITE_API_URL",
    pkg: "app, payment-link",
    desc: "Backend API base URL",
  },
  {
    variable: "VITE_ZERODEV_PROJECT_ID",
    pkg: "app",
    desc: "ZeroDev project ID for smart account creation",
  },
  {
    variable: "VITE_WALLETCONNECT_PROJECT_ID",
    pkg: "payment-link",
    desc: "WalletConnect project ID for RainbowKit",
  },
  {
    variable: "VITE_CHAIN_ID",
    pkg: "app, payment-link",
    desc: "Default chain ID for the escrow network",
  },
];

const deployColumns = [
  { header: "Package", key: "package", width: "200px" },
  { header: "Recommended", key: "recommended" },
  { header: "Alternatives", key: "alternatives" },
];

const deployRows = [
  {
    package: "modules-backend",
    recommended: "Vercel (serverless functions)",
    alternatives: "AWS Lambda, Railway, Fly.io, any Node.js host",
  },
  {
    package: "modules-app",
    recommended: "Vercel (static + SSR)",
    alternatives: "Netlify, Cloudflare Pages, AWS Amplify",
  },
  {
    package: "modules-payment-link",
    recommended: "Vercel (static)",
    alternatives: "Netlify, Cloudflare Pages, S3 + CloudFront",
  },
];

const compatColumns = [
  { header: "Component", key: "component", width: "140px" },
  { header: "Requirement", key: "requirement" },
];

const compatRows = [
  { component: "Platform", requirement: "ReineiraOS 0.1" },
  { component: "Node.js", requirement: "18+" },
  { component: "pnpm", requirement: "9+" },
  { component: "SDK", requirement: "@reineira-os/sdk ^0.1.0" },
];

const ecosystemColumns = [
  { header: "Repo", key: "repo", width: "200px" },
  { header: "What you do there", key: "purpose" },
];

const ecosystemRows = [
  {
    repo: "reineira-atlas",
    purpose: "Run the startup — strategy, ops, growth, compliance, pitch decks",
  },
  {
    repo: "reineira-code",
    purpose:
      "Build smart contracts — condition resolvers, insurance policies, tests, deploy",
  },
  {
    repo: "platform-modules (this repo)",
    purpose: "Ship the product — backend API, platform app, payment link",
  },
];

export default function PlatformModules() {
  return (
    <DocsLayout
      toc={toc}
      editHref="https://github.com/reineiraos/docs/edit/main/developers/platform-modules.mdx"
    >
      <Breadcrumbs />

      <PageHeader
        title="Platform Modules"
        description="A pnpm monorepo of production-ready application starters for ventures building on ReineiraOS. Backend API, platform app, and shareable payment link with cross-chain settlement."
        readingTime="10 min read"
      />

      {/* ── Architecture ───────────────────────────────────────────────── */}
      <h2
        id="architecture"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Architecture
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        The monorepo is split into three independent packages that can be
        deployed together or individually:
      </p>

      <CodeBlock
        filename="project structure"
        language="bash"
        showLineNumbers={false}
        lines={[
          { content: "platform-modules/" },
          { content: "  packages/" },
          { content: "    backend/        @reineira-os/modules-backend" },
          { content: "    app/            @reineira-os/modules-app" },
          { content: "    payment-link/   @reineira-os/modules-payment-link" },
          { content: "  reineira.json     Platform version & ecosystem links" },
          { content: "  package.json      Workspace root" },
        ]}
      />

      <DocsTable columns={packageColumns} rows={packageRows} />

      {/* ── Getting started ────────────────────────────────────────────── */}
      <h2
        id="getting-started"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Getting started
      </h2>

      <CodeBlock
        filename="terminal"
        language="bash"
        showLineNumbers={false}
        lines={[
          {
            content:
              "git clone https://github.com/ReineiraOS/platform-modules.git",
          },
          { content: "cd platform-modules" },
          { content: "pnpm install" },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4 mt-6">
        Run any package in development mode:
      </p>

      <CodeBlock
        filename="terminal"
        language="bash"
        showLineNumbers={false}
        lines={[
          { content: "pnpm dev:backend          # Backend dev server" },
          { content: "pnpm dev:app              # Platform app (port 4831)" },
          { content: "pnpm dev:payment-link     # Payment link app" },
        ]}
      />

      <p className="text-docs-text-secondary leading-relaxed mb-4 mt-6">
        Build and test the entire workspace:
      </p>

      <CodeBlock
        filename="terminal"
        language="bash"
        showLineNumbers={false}
        lines={[
          { content: "pnpm build                # Build all packages" },
          { content: "pnpm test                 # Test all packages" },
        ]}
      />

      {/* ── Backend module ─────────────────────────────────────────────── */}
      <h2
        id="backend-module"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Backend module
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          @reineira-os/modules-backend
        </code>{" "}
        is a TypeScript backend following Clean Architecture (DDD). It is
        structured in five layers:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-6">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Domain
          </strong>{" "}
          — entities, value objects, business rules
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Application
          </strong>{" "}
          — use cases and service orchestration
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Infrastructure
          </strong>{" "}
          — database adapters, SDK client, external integrations
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Interface
          </strong>{" "}
          — HTTP routes, request validation, response serialization
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">Core</strong>{" "}
          — shared utilities, error types, configuration
        </li>
      </ul>

      <h3
        id="backend-features"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Backend features
      </h3>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-6">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            DB-agnostic
          </strong>{" "}
          — repository pattern lets you swap Postgres, DynamoDB, Supabase,
          Turso, or any store without touching business logic
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            SDK integration
          </strong>{" "}
          — calls{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            escrow.create()
          </code>
          ,{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            escrow.fund()
          </code>
          ,{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            escrow.redeem()
          </code>
          , and{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            insurance
          </code>{" "}
          methods through the ReineiraOS SDK
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Webhook handlers
          </strong>{" "}
          — endpoints for condition resolver callbacks and payment processor
          notifications
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Vercel-ready
          </strong>{" "}
          — deploy with{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            vercel deploy
          </code>{" "}
          out of the box, or target AWS Lambda, Railway, or any Node.js host
        </li>
      </ul>

      <h3
        id="backend-deployment"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Backend deployment
      </h3>

      <CodeBlock
        filename="terminal"
        language="bash"
        showLineNumbers={false}
        lines={[
          { content: "# Vercel (fastest path)" },
          { content: "cd packages/backend" },
          { content: "vercel deploy" },
          { content: "" },
          { content: "# Any Node.js host" },
          { content: "pnpm --filter @reineira-os/modules-backend run build" },
          { content: "node dist/index.js" },
        ]}
      />

      {/* ── App module ─────────────────────────────────────────────────── */}
      <h2
        id="app-module"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        App module
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          @reineira-os/modules-app
        </code>{" "}
        is a Vue 3 platform app — the dashboard your end users interact with to
        manage escrows, view transactions, and trigger releases.
      </p>

      <h3
        id="app-features"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        App features
      </h3>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-6">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            ZeroDev ERC-4337 smart accounts
          </strong>{" "}
          — gasless transactions via account abstraction, no seed phrases
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Passkey authentication
          </strong>{" "}
          — WebAuthn passkeys create and sign with the smart account, then SIWE
          produces a backend JWT
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Vue 3 + Vite + Pinia
          </strong>{" "}
          — reactive state management with hot module replacement
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            TailwindCSS
          </strong>{" "}
          — utility-first styling, fully customizable to your brand
        </li>
      </ul>

      <h3
        id="application-layers"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Application layers
      </h3>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-6">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Views
          </strong>{" "}
          — page components mapped to routes
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Router
          </strong>{" "}
          — Vue Router with auth guards
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Stores
          </strong>{" "}
          — Pinia stores for escrow state, user session, wallet
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Services
          </strong>{" "}
          — SDK wrappers and API clients
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Composables
          </strong>{" "}
          — reusable Vue composition functions
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Components
          </strong>{" "}
          — shared UI building blocks
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Helpers
          </strong>{" "}
          — formatting, validation, constants
        </li>
      </ul>

      <h3
        id="auth-flow"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Auth flow
      </h3>

      <Steps>
        <Step title="User creates or selects a passkey (WebAuthn)">
          <p className="text-docs-text-secondary">
            The browser prompts for biometric or device-level authentication.
          </p>
        </Step>
        <Step title="ZeroDev derives an ERC-4337 smart account from the passkey">
          <p className="text-docs-text-secondary">
            A deterministic smart account address is generated from the passkey
            credential.
          </p>
        </Step>
        <Step title="Smart account signs a SIWE message">
          <p className="text-docs-text-secondary">
            Sign-In with Ethereum authenticates the session.
          </p>
        </Step>
        <Step title="Backend verifies the signature and returns a JWT">
          <p className="text-docs-text-secondary">
            The JWT is used for all subsequent API calls.
          </p>
        </Step>
        <Step title="Authenticated session">
          <p className="text-docs-text-secondary">
            All subsequent API calls use the JWT for authentication.
          </p>
        </Step>
      </Steps>

      {/* ── Payment Link module ────────────────────────────────────────── */}
      <h2
        id="payment-link-module"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Payment Link module
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          @reineira-os/modules-payment-link
        </code>{" "}
        is a standalone Vue 3 app that renders a shareable payment page.
        External parties — customers, counterparties, anyone with the link —
        connect their own wallet and pay into an escrow.
      </p>

      <h3
        id="payment-link-features"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Payment Link features
      </h3>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-6">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Any wallet via RainbowKit
          </strong>{" "}
          — WalletConnect, MetaMask, Coinbase Wallet, and more
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Wagmi integration
          </strong>{" "}
          — type-safe contract reads and writes
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            CCTP v2 cross-chain settlement
          </strong>{" "}
          — payers fund from any supported chain and Circle CCTP burns/mints
          USDC to the escrow chain automatically
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Invoice display
          </strong>{" "}
          — shows amount, currency, merchant details, and escrow conditions
        </li>
      </ul>

      <h3
        id="payment-flow"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Payment flow
      </h3>

      <ArchitectureDiagram
        title="PAYMENT LINK FLOW"
        steps={[
          { label: "Generate Link", sublabel: "Builder creates payment link" },
          {
            label: "Connect Wallet",
            sublabel: "Payer connects via RainbowKit",
          },
          { label: "Detect Chain", sublabel: "App checks chain and balance" },
          {
            label: "CCTP Bridge",
            sublabel: "Cross-chain USDC transfer if needed",
          },
          { label: "Fund Escrow", sublabel: "USDC arrives and funds escrow" },
        ]}
      />

      <h3
        id="store-architecture"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Store architecture
      </h3>

      <DocsTable columns={storeColumns} rows={storeRows} />

      {/* ── Configuration ──────────────────────────────────────────────── */}
      <h2
        id="configuration"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Configuration
      </h2>

      <h3
        id="reineira-json"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        reineira.json
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Every platform-modules repo includes a{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          reineira.json
        </code>{" "}
        at the root that declares platform compatibility:
      </p>

      <CodeBlock
        filename="reineira.json"
        language="typescript"
        lines={[
          { content: "{" },
          { content: '  "name": "platform-modules",' },
          { content: '  "version": "0.1.0",' },
          { content: '  "platform": "0.1",' },
          { content: '  "type": "modules",' },
          { content: '  "packages": {' },
          { content: '    "backend": "@reineira-os/modules-backend",' },
          { content: '    "app": "@reineira-os/modules-app",' },
          {
            content: '    "payment-link": "@reineira-os/modules-payment-link"',
          },
          { content: "  }," },
          { content: '  "compatibility": {' },
          { content: '    "sdk": "^0.1.0",' },
          { content: '    "node": ">=18.0.0"' },
          { content: "  }" },
          { content: "}" },
        ]}
      />

      <Callout variant="warning" title="Version compatibility">
        <p>
          When the platform version bumps, breaking contract interface changes
          may require upgrading. Check the{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            platform
          </code>{" "}
          field against the SDK version you are importing.
        </p>
      </Callout>

      <h3
        id="environment-variables"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Environment variables
      </h3>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Each package reads its own{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          .env
        </code>{" "}
        file. Common variables across packages:
      </p>

      <DocsTable columns={envColumns} rows={envRows} />

      {/* ── Deployment ─────────────────────────────────────────────────── */}
      <h2
        id="deployment"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Deployment
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Each package deploys independently. Recommended targets:
      </p>

      <DocsTable columns={deployColumns} rows={deployRows} />

      <h3 className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3">
        Compatibility requirements
      </h3>

      <DocsTable columns={compatColumns} rows={compatRows} />

      {/* ── Ecosystem ──────────────────────────────────────────────────── */}
      <h2
        id="ecosystem"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Ecosystem
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Platform Modules is one of three repos that make up the ReineiraOS
        builder platform:
      </p>

      <DocsTable columns={ecosystemColumns} rows={ecosystemRows} />

      <p className="text-docs-text-secondary leading-relaxed mb-4 mt-6">
        All repos declare their platform compatibility in{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          reineira.json
        </code>
        . Start with{" "}
        <a
          href="/docs/developers/reineira-code"
          className="text-brand-primary font-medium hover:underline"
        >
          ReineiraOS Code
        </a>{" "}
        for smart contracts, then use Platform Modules to build the product
        layer on top.
      </p>

      <LinkCard
        items={[
          {
            title: "ReineiraOS Code",
            description: "Build smart contracts with AI-assisted development.",
            href: "/docs/developers/reineira-code",
            icon: Code2,
          },
          {
            title: "ReineiraOS Atlas",
            description: "Run the startup — strategy, ops, growth, compliance.",
            href: "/docs/developers/atlas",
            icon: Layers,
          },
          {
            title: "ReineiraSDK",
            description: "TypeScript SDK for escrow and insurance operations.",
            href: "/docs/developers/sdk",
            icon: Globe,
          },
        ]}
      />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
