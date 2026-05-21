export interface NavPage {
  title: string;
  slug: string;
  href: string;
  description?: string;
}

export interface NavSection {
  id: string;
  label: string;
  icon: string;
  description: string;
  pages: NavPage[];
}

export const navigation: NavSection[] = [
  {
    id: "get-started",
    label: "Get Started",
    icon: "Rocket",
    description:
      "Quick start guides and setup instructions to get you up and running.",
    pages: [
      {
        title: "Overview",
        slug: "overview",
        href: "/get-started/overview",
        description:
          "Conditional settlement infrastructure — what it is, who it's for, and why it matters.",
      },
      {
        title: "Quick Start",
        slug: "quick-start",
        href: "/get-started/quick-start",
        description: "Deploy your first Escrow in under 5 minutes.",
      },
    ],
  },
  {
    id: "status",
    label: "Project Status",
    icon: "Activity",
    description:
      "Honest status of every protocol component, plus risk and audit disclosure.",
    pages: [
      {
        title: "Status & Roadmap",
        slug: "status",
        href: "/status",
        description:
          "Every protocol component × status × milestone, derived from the whitepaper Implementation Notes and Open Problems.",
      },
      {
        title: "Risk & Audit Status",
        slug: "risk",
        href: "/risk",
        description:
          "Audit posture, compliance targets, and the limits of the security model — full disclosure.",
      },
    ],
  },
  {
    id: "settlement-standard",
    label: "Settlement Standard (RSS)",
    icon: "BookOpen",
    description:
      "The Reineira Settlement Standard — the open conformance spec, separate from any one deployment.",
    pages: [
      {
        title: "What is RSS",
        slug: "what-is-rss",
        href: "/settlement-standard/what-is-rss",
        description:
          "The conformance spec, separate from any deployment; the standards-fork rationale.",
      },
      {
        title: "Conformance",
        slug: "conformance",
        href: "/settlement-standard/conformance",
        description: "The six clauses + the conformance test surface.",
      },
      {
        title: "Interface Surface",
        slug: "interface-surface",
        href: "/settlement-standard/interface-surface",
        description:
          "The four-primitive interfaces — v0.1 mandatory and v0.2 spec'd.",
      },
      {
        title: "Versioning & RIPs",
        slug: "versioning",
        href: "/settlement-standard/versioning",
        description: "v0.1 → v0.2 → v1.0 and the RIP process (the EIP analog).",
      },
      {
        title: "Implement RSS Yourself",
        slug: "implement-rss",
        href: "/settlement-standard/implement-rss",
        description:
          "The invitation + the license split (OSI-aligned standard vs. BUSL core).",
      },
    ],
  },
  {
    id: "developer-tools",
    label: "Developer Tools",
    icon: "Wrench",
    description:
      "Builder acceleration tools — from strategy to smart contracts to shipping.",
    pages: [
      {
        title: "Builder Journey",
        slug: "builder-journey",
        href: "/developer-tools/builder-journey",
        description:
          "The end-to-end flow from venture brief to shipped product.",
      },
      {
        title: "Atlas",
        slug: "atlas",
        href: "/developer-tools/atlas",
        description:
          "Startup operating system — strategy, compliance, fundraising, and app scaffolding.",
      },
      {
        title: "Code",
        slug: "reineira-code",
        href: "/developer-tools/reineira-code",
        description:
          "AI-assisted development environment for building Gates and Insurances.",
      },
      {
        title: "Platform Modules",
        slug: "platform-modules",
        href: "/developer-tools/platform-modules",
        description:
          "Plug-and-play backend and React app starters for ReineiraOS ventures.",
      },
    ],
  },
  {
    id: "learn",
    label: "Learn",
    icon: "BookOpen",
    description:
      "Mental models, architecture, core concepts, and protocol economics.",
    pages: [
      {
        title: "Mental Model",
        slug: "mental-model",
        href: "/learn/mental-model",
        description: "Four primitives: Escrow, Gate, Insurance, Operator.",
      },
      {
        title: "Architecture",
        slug: "architecture",
        href: "/learn/architecture",
        description: "System architecture and component overview.",
      },
      {
        title: "Privacy Model",
        slug: "privacy-model",
        href: "/learn/privacy-model",
        description: "How FHE encryption protects user data on-chain.",
      },
      {
        title: "Security",
        slug: "security",
        href: "/learn/security",
        description: "Security assumptions, threat model, and audit results.",
      },
      {
        title: "Resilience & Recovery",
        slug: "resilience",
        href: "/learn/resilience",
        description:
          "Fault tolerance, recovery mechanisms, and disaster scenarios.",
      },
      {
        title: "Economics & Incentives",
        slug: "economics",
        href: "/learn/economics",
        description: "Fee structures, rewards, and protocol economics.",
      },
    ],
  },
  {
    id: "build",
    label: "Build",
    icon: "Hammer",
    description:
      "Escrow lifecycle, Condition resolvers, Underwriter policies, and cross-chain settlement.",
    pages: [
      {
        title: "Escrow Lifecycle",
        slug: "escrow-lifecycle",
        href: "/build/escrow-lifecycle",
        description:
          "Create, fund, verify, and settle an Escrow — the full state machine.",
      },
      {
        title: "Condition Resolvers",
        slug: "condition-resolvers",
        href: "/build/condition-resolvers",
        description:
          "Custom verification logic that controls when an Escrow releases funds.",
      },
      {
        title: "Underwriter Policies",
        slug: "underwriter-policies",
        href: "/build/underwriter-policies",
        description:
          "Define and deploy risk evaluation and dispute resolution policies.",
      },
      {
        title: "Insurance Pools",
        slug: "insurance-pools",
        href: "/build/insurance-pools",
        description: "Liquidity pools backing Insurance coverage.",
      },
      {
        title: "Cross-Chain Settlement",
        slug: "cross-chain",
        href: "/build/cross-chain",
        description:
          "Settle Escrows across multiple EVM-compatible chains via Circle CCTP V2.",
      },
      {
        title: "Atlas-Deployed L3s",
        slug: "atlas-l3",
        href: "/build/atlas-l3",
        description:
          "Self-deploy ReineiraOS on your own L3 via Atlas; operator-routed liquidity over the native rollup bridge.",
      },
      {
        title: "Gas & Performance",
        slug: "gas-performance",
        href: "/build/gas-performance",
        description: "Optimization strategies for FHE-heavy operations.",
      },
    ],
  },
  {
    id: "operate",
    label: "Operate",
    icon: "Settings",
    description: "Operator network and node operations.",
    pages: [
      {
        title: "Operator Network",
        slug: "operator-network",
        href: "/operate/operator-network",
        description:
          "The coordinator layer — task distribution and relay routing.",
      },
      {
        title: "Run an Operator",
        slug: "run-operator",
        href: "/operate/run-operator",
        description: "Set up and run an operator node.",
      },
    ],
  },
  {
    id: "research",
    label: "Research & R&D",
    icon: "FileText",
    description:
      "Cryptographic foundations, the Open Problems table, research previews, and the deferred agentic-composition layer.",
    pages: [
      {
        title: "Cryptographic Foundations",
        slug: "cryptographic-foundations",
        href: "/research/cryptographic-foundations",
        description:
          "TFHE/CoFHE substrate, encrypted types, homomorphic costs, and the silent-failure pattern.",
      },
      {
        title: "Open Problems",
        slug: "open-problems",
        href: "/research/open-problems",
        description: "Every numbered Open Problem from the whitepaper (§14.3).",
      },
      {
        title: "Research Previews",
        slug: "research-previews",
        href: "/research/research-previews",
        description:
          "Exploratory directions — including encrypted inference — with no committed scope.",
      },
      {
        title: "Agentic Composition (Preview)",
        slug: "agentic-composition",
        href: "/research/agentic-composition",
        description:
          "The deferred agentic / AI-execution layer — not part of v1.0 RSS conformance.",
      },
    ],
  },
  {
    id: "reference",
    label: "API Reference",
    icon: "Code2",
    description: "SDK, module APIs, and deployed contract addresses.",
    pages: [
      {
        title: "Contracts",
        slug: "contracts",
        href: "/reference/contracts",
        description: "Deployed contract addresses and ABIs.",
      },
      {
        title: "SDK",
        slug: "sdk",
        href: "/reference/sdk",
        description: "TypeScript/JavaScript SDK for building on ReineiraOS.",
      },
      {
        title: "Escrow Module",
        slug: "escrow-module",
        href: "/reference/escrow-module",
        description: "Complete Escrow module API reference.",
      },
      {
        title: "Insurance Module",
        slug: "insurance-module",
        href: "/reference/insurance-module",
        description: "Complete Insurance module API reference.",
      },
      {
        title: "MCP Server",
        slug: "mcp-server",
        href: "/reference/mcp-server",
        description:
          "AI assistant access to docs, contracts, and interfaces via MCP.",
      },
    ],
  },
];

export function getSectionById(id: string): NavSection | undefined {
  return navigation.find((s) => s.id === id);
}

export function getPageByHref(
  href: string,
): { section: NavSection; page: NavPage; index: number } | undefined {
  for (const section of navigation) {
    const index = section.pages.findIndex((p) => p.href === href);
    if (index !== -1) {
      return { section, page: section.pages[index], index };
    }
  }
  return undefined;
}

export function getPrevNext(href: string): {
  prev: NavPage | null;
  next: NavPage | null;
} {
  const allPages: NavPage[] = navigation.flatMap((s) => s.pages);
  const idx = allPages.findIndex((p) => p.href === href);
  return {
    prev: idx > 0 ? allPages[idx - 1] : null,
    next: idx < allPages.length - 1 ? allPages[idx + 1] : null,
  };
}
