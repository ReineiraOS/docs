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
  { id: "backend-layers", title: "Backend layers", level: 3 },
  { id: "app-module", title: "App module", level: 2 },
  { id: "app-features", title: "App features", level: 3 },
  { id: "application-layers", title: "Application layers", level: 3 },
  { id: "auth-flow", title: "Auth flow", level: 3 },
  { id: "configuration", title: "Configuration", level: 2 },
  { id: "environment-variables", title: "Environment variables", level: 3 },
  { id: "compatibility", title: "Compatibility", level: 3 },
  { id: "deployment", title: "Deployment", level: 2 },
  { id: "atlas-integration", title: "Atlas integration", level: 2 },
  { id: "ecosystem", title: "Ecosystem", level: 2 },
];

const packageColumns = [
  { header: "Package", key: "package", width: "160px" },
  { header: "Name", key: "name", width: "240px" },
  { header: "Stack", key: "stack" },
  { header: "Purpose", key: "purpose" },
];

const packageRows = [
  {
    package: "backend",
    name: "@reineira-os/modules-backend",
    stack: "TypeScript + Clean Architecture",
    purpose: "Backend API (Vercel-ready, DB-agnostic)",
  },
  {
    package: "app",
    name: "@reineira-os/modules-app",
    stack: "React 19 + Vite + ZeroDev",
    purpose: "Platform dashboard with smart accounts",
  },
];

const backendLayerColumns = [
  { header: "Layer", key: "layer", width: "160px" },
  { header: "Directory", key: "directory", mono: true, width: "200px" },
  { header: "Responsibility", key: "responsibility" },
];

const backendLayerRows = [
  {
    layer: "Domain",
    directory: "src/domain/",
    responsibility: "Business entities, value objects, repository interfaces",
  },
  {
    layer: "Application",
    directory: "src/application/",
    responsibility: "Use cases, DTOs, mappers",
  },
  {
    layer: "Infrastructure",
    directory: "src/infrastructure/",
    responsibility: "Database repos, auth services, webhooks, FHE",
  },
  {
    layer: "Interface",
    directory: "src/interface/",
    responsibility: "API handlers, request/response DTOs, routing",
  },
  {
    layer: "Core",
    directory: "src/core/",
    responsibility: "Shared utilities, config, error handling",
  },
];

const appLayerColumns = [
  { header: "Layer", key: "layer", width: "160px" },
  { header: "Directory", key: "directory", mono: true, width: "200px" },
  { header: "Responsibility", key: "responsibility" },
];

const appLayerRows = [
  {
    layer: "Routes",
    directory: "src/routes/",
    responsibility: "Page components (TanStack Router file-based)",
  },
  {
    layer: "Components",
    directory: "src/components/",
    responsibility: "UI components (shadcn/ui + feature components)",
  },
  {
    layer: "Stores",
    directory: "src/stores/",
    responsibility: "Zustand state management",
  },
  {
    layer: "Services",
    directory: "src/services/",
    responsibility: "Business logic (escrow, transaction, withdrawal)",
  },
  {
    layer: "Hooks",
    directory: "src/hooks/",
    responsibility: "Custom React hooks (auth, contract calls, flows)",
  },
  {
    layer: "Providers",
    directory: "src/providers/",
    responsibility: "Context providers (ZeroDev, wallet)",
  },
  {
    layer: "HTTP Client",
    directory: "src/http-client/",
    responsibility: "Axios-based API client with typed endpoints",
  },
];

const envColumns = [
  { header: "Variable", key: "variable", mono: true, width: "260px" },
  { header: "Package", key: "pkg", width: "120px" },
  { header: "Required", key: "required", width: "80px" },
  { header: "Description", key: "desc" },
];

const envRows = [
  {
    variable: "JWT_SECRET",
    pkg: "backend",
    required: "Yes",
    desc: "JWT signing secret (minimum 32 characters)",
  },
  {
    variable: "JWT_ISSUER",
    pkg: "backend",
    required: "Yes",
    desc: "JWT issuer identifier",
  },
  {
    variable: "ESCROW_CONTRACT_ADDRESS",
    pkg: "backend",
    required: "Yes",
    desc: "Deployed ConfidentialEscrow contract address",
  },
  {
    variable: "PUSDC_WRAPPER_ADDRESS",
    pkg: "backend",
    required: "Yes",
    desc: "Deployed confidential USDC wrapper address",
  },
  {
    variable: "VITE_API_BASE_URL",
    pkg: "app",
    required: "Yes",
    desc: "Backend API endpoint (default: /api)",
  },
  {
    variable: "VITE_ZERODEV_BUNDLER_URL",
    pkg: "app",
    required: "Yes",
    desc: "ZeroDev bundler RPC endpoint for smart accounts",
  },
  {
    variable: "VITE_ZERODEV_PASSKEY_SERVER_URL",
    pkg: "app",
    required: "Yes",
    desc: "ZeroDev passkey server for WebAuthn registration",
  },
  {
    variable: "VITE_COFHE_RPC_URL",
    pkg: "app",
    required: "No",
    desc: "CoFHE RPC endpoint (default: Arbitrum Sepolia)",
  },
  {
    variable: "VITE_CHAIN_ID",
    pkg: "app",
    required: "No",
    desc: "Target chain ID (default: 421614 Arbitrum Sepolia)",
  },
];

const compatColumns = [
  { header: "Requirement", key: "requirement", width: "200px" },
  { header: "Version", key: "version" },
];

const compatRows = [
  { requirement: "Node.js", version: ">= 18.0.0" },
  { requirement: "pnpm", version: ">= 10.0.0" },
  { requirement: "ReineiraOS SDK", version: "^0.1.0" },
  { requirement: "Platform version", version: "0.1" },
];

const ecosystemColumns = [
  { header: "Repo", key: "repo", width: "240px" },
  { header: "What you do there", key: "purpose" },
  { header: "Platform", key: "platform", width: "100px" },
];

const ecosystemRows = [
  {
    repo: "reineira-atlas",
    purpose: "Plan the venture, bootstrap the app",
    platform: "0.1",
  },
  {
    repo: "reineira-code",
    purpose: "Build Gates and Insurance Policies",
    platform: "0.1",
  },
  {
    repo: "platform-modules (this repo)",
    purpose: "Ship the product — backend + frontend",
    platform: "0.1",
  },
];

export default function PlatformModules() {
  const { prev, next } = getPrevNext("/developer-tools/platform-modules");

  return (
    <DocsLayout
      toc={toc}
      editHref="https://github.com/reineiraos/docs/edit/main/developer-tools/platform-modules.mdx"
    >
      <Breadcrumbs />

      <PageHeader
        title="Platform Modules"
        description="Plug-and-play backend and React app starters for ReineiraOS ventures."
        readingTime="8 min"
      />

      {/* ── Architecture ───────────────────────────────────────────────── */}
      <h2
        id="architecture"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Architecture
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Platform Modules is a pnpm monorepo with two plug-and-play application
        starters. Clone them, customize for your vertical, and ship on Vercel.
        Atlas{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          /bootstrap
        </code>{" "}
        can scaffold these automatically from your venture brief.
      </p>

      <ArchitectureDiagram
        title="Monorepo structure"
        steps={[
          {
            label: "platform-modules/",
            sublabel: "pnpm workspace root",
          },
          {
            label: "packages/backend",
            sublabel: "@reineira-os/modules-backend",
          },
          {
            label: "packages/app",
            sublabel: "@reineira-os/modules-app",
          },
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

      <Steps>
        <Step title="Clone and install">
          <CodeBlock
            filename="terminal"
            language="bash"
            showLineNumbers={false}
            lines={[
              {
                content:
                  "git clone git@github.com:ReineiraOS/platform-modules.git",
              },
              { content: "cd platform-modules" },
              { content: "pnpm install" },
            ]}
          />
        </Step>

        <Step title="Run locally">
          <CodeBlock
            filename="terminal"
            language="bash"
            showLineNumbers={false}
            lines={[
              { content: "pnpm dev:backend    # Backend API" },
              { content: "pnpm dev:app        # React app on port 4831" },
            ]}
          />
        </Step>

        <Step title="Build and test">
          <CodeBlock
            filename="terminal"
            language="bash"
            showLineNumbers={false}
            lines={[
              { content: "pnpm build          # Build all packages" },
              { content: "pnpm test           # Run all tests" },
              { content: "pnpm lint           # TypeScript type check" },
              { content: "pnpm format:check   # Prettier check" },
            ]}
          />
        </Step>
      </Steps>

      <Callout variant="tip" title="Prefer Atlas bootstrap?">
        <p>
          If you're starting a new venture, use Atlas{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            /bootstrap
          </code>{" "}
          instead of cloning manually. It scaffolds a customized copy of these
          modules with your venture name, entities, and branding already
          configured.
        </p>
      </Callout>

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
        is a TypeScript backend following Clean Architecture (DDD). It ships as
        serverless functions on Vercel with a DB-agnostic repository pattern so
        you can swap data stores without touching business logic.
      </p>

      <h3
        id="backend-features"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Backend features
      </h3>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-6">
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Clean Architecture (DDD)
          </strong>{" "}
          — Domain, Application, Infrastructure, Interface, and Core layers with
          clear separation of concerns
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            DB-agnostic
          </strong>{" "}
          — Repository pattern with Drizzle ORM. Swap Postgres (Neon), DynamoDB,
          Supabase, Turso, or any data store
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            ReineiraOS SDK integration
          </strong>{" "}
          — Escrow creation, funding, redemption, and insurance via{" "}
          <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
            @reineira-os/sdk
          </code>
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Webhook handlers
          </strong>{" "}
          — QuickNode blockchain event processing
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            SIWE authentication
          </strong>{" "}
          — Sign-In with Ethereum for wallet-based auth
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            JWT sessions
          </strong>{" "}
          — Stateless auth with JOSE
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Vercel-ready
          </strong>{" "}
          — Deploy as serverless functions with zero config
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            OpenAPI generation
          </strong>{" "}
          — Auto-generated API schema from Zod validators
        </li>
      </ul>

      <h3
        id="backend-layers"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Backend layers
      </h3>

      <DocsTable columns={backendLayerColumns} rows={backendLayerRows} />

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
        is a React 19 platform dashboard — the interface your end users interact
        with to manage escrows, view transactions, and trigger releases. It uses
        ZeroDev smart accounts for gasless, passwordless authentication.
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
            React 19
          </strong>{" "}
          — Latest React with TypeScript and Vite 6
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            ZeroDev smart accounts
          </strong>{" "}
          — ERC-4337 account abstraction with gasless transactions
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Passkey authentication
          </strong>{" "}
          — WebAuthn passkeys for passwordless login
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            Zustand state management
          </strong>{" "}
          — Lightweight stores for transactions, withdrawals, wallet, chain, and
          balance
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            TanStack Router
          </strong>{" "}
          — Type-safe file-based routing
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            TailwindCSS
          </strong>{" "}
          — Utility-first styling with shadcn/ui components
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            TanStack React Query
          </strong>{" "}
          — Data fetching with caching and background refresh
        </li>
        <li>
          <strong className="text-docs-text-primary font-semibold">
            cofhe SDK
          </strong>{" "}
          — FHE encryption/decryption in the browser
        </li>
      </ul>

      <h3
        id="application-layers"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Application layers
      </h3>

      <DocsTable columns={appLayerColumns} rows={appLayerRows} />

      <h3
        id="auth-flow"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Auth flow
      </h3>

      <ArchitectureDiagram
        title="Passkey authentication"
        steps={[
          {
            label: "Create passkey",
            sublabel: "WebAuthn registration",
          },
          {
            label: "Derive smart account",
            sublabel: "ZeroDev ERC-4337",
          },
          {
            label: "Sign SIWE message",
            sublabel: "Prove wallet ownership",
          },
          {
            label: "Verify on backend",
            sublabel: "Issue JWT session",
          },
        ]}
      />

      {/* ── Configuration ──────────────────────────────────────────────── */}
      <h2
        id="configuration"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Configuration
      </h2>

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
        file. Required and optional variables:
      </p>

      <DocsTable columns={envColumns} rows={envRows} />

      <h3
        id="compatibility"
        className="text-[20px] font-semibold tracking-[-0.01em] leading-[1.4] text-docs-text-primary mt-8 mb-3"
      >
        Compatibility
      </h3>

      <DocsTable columns={compatColumns} rows={compatRows} />

      {/* ── Deployment ────────────────────────────────────────────────── */}
      <h2
        id="deployment"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Deployment
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Both packages include{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          vercel.json
        </code>{" "}
        configs optimized for Vercel deployment from a monorepo. Each package
        deploys as a separate Vercel project pointing to the same repo.
      </p>

      <Steps>
        <Step title="Backend — create Vercel project">
          <p className="text-docs-text-secondary mb-2">
            Set the root directory to{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              packages/backend
            </code>
            . The included{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              vercel.json
            </code>{" "}
            handles monorepo install, build, API rewrites, and CORS headers
            automatically.
          </p>
          <CodeBlock
            filename="vercel.json (already included)"
            language="json"
            showLineNumbers={false}
            lines={[
              { content: "{" },
              {
                content:
                  '  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",',
              },
              { content: '  "buildCommand": "pnpm run build",' },
              {
                content:
                  '  "rewrites": [{ "source": "/api/(.*)", "destination": "/api/$1" }]',
              },
              { content: "}" },
            ]}
          />
        </Step>
        <Step title="App — create second Vercel project">
          <p className="text-docs-text-secondary mb-2">
            Set the root directory to{" "}
            <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
              packages/app
            </code>
            . The config includes SPA rewrites and COOP/COEP headers required
            for WebAuthn passkey authentication.
          </p>
          <CodeBlock
            filename="vercel.json (already included)"
            language="json"
            showLineNumbers={false}
            lines={[
              { content: "{" },
              {
                content:
                  '  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",',
              },
              { content: '  "buildCommand": "pnpm run build",' },
              { content: '  "outputDirectory": "dist",' },
              { content: '  "headers": [{ "source": "/(.*)", "headers": [' },
              {
                content:
                  '    { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },',
              },
              {
                content:
                  '    { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" }',
              },
              { content: "  ]}]" },
              { content: "}" },
            ]}
          />
        </Step>
        <Step title="Set environment variables">
          <p className="text-docs-text-secondary">
            Add the environment variables from the table above to each Vercel
            project. Backend variables go to the backend project, app variables
            go to the app project. Contract addresses can be queried from the
            MCP server or the protocol docs.
          </p>
        </Step>
      </Steps>

      <Callout variant="info" title="Other platforms">
        <p>
          The modules work on any platform that supports Node.js. The backend
          deploys as standard serverless functions (Netlify, AWS Lambda,
          Railway, Fly.io). The app builds to static files (Cloudflare Pages,
          AWS Amplify, any CDN).
        </p>
      </Callout>

      {/* ── Atlas integration ──────────────────────────────────────────── */}
      <h2
        id="atlas-integration"
        className="text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-docs-text-primary mt-12 mb-4"
      >
        Atlas integration
      </h2>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        Atlas{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          /bootstrap
        </code>{" "}
        is the recommended way to start with Platform Modules. When you run the
        bootstrap command, Atlas reads your venture brief and:
      </p>

      <ul className="space-y-2 text-docs-text-secondary leading-relaxed list-disc list-inside mb-6">
        <li>Clones platform-modules into your venture directory</li>
        <li>Customizes package names and branding</li>
        <li>
          Generates data entities from your brief (backend domain models + app
          stores)
        </li>
        <li>Wires API routes and React pages for your entities</li>
        <li>Sets up environment templates with the right variables</li>
        <li>
          Creates the startup OS alongside (strategy docs, agents, slash
          commands)
        </li>
      </ul>

      <p className="text-docs-text-secondary leading-relaxed mb-4">
        After bootstrap, run{" "}
        <code className="bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 font-mono text-[13px] text-docs-text-primary">
          /integrate
        </code>{" "}
        to connect your deployed smart contracts from reineira-code to the
        scaffolded app — SDK calls, webhook handlers, and UI flows.
      </p>

      <Callout variant="info" title="Standalone usage">
        <p>
          You can also use platform-modules without Atlas. Clone the repo,
          install dependencies, and customize manually. The modules are standard
          TypeScript/React packages with no Atlas-specific dependencies.
        </p>
      </Callout>

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

      <LinkCard
        items={[
          {
            title: "Builder Journey",
            description: "See how Atlas, Code, and Modules fit together",
            href: "/developer-tools/builder-journey",
            icon: Layers,
          },
          {
            title: "Atlas",
            description: "Start here — bootstrap your venture",
            href: "/developer-tools/atlas",
            icon: Globe,
          },
          {
            title: "Code",
            description: "Build custom Gates and Policies",
            href: "/developer-tools/reineira-code",
            icon: Code2,
          },
        ]}
      />

      <PageNav prev={prev} next={next} />
    </DocsLayout>
  );
}
