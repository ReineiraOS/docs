import { Link } from "react-router-dom";
import {
  Rocket,
  BookOpen,
  Wrench,
  Hammer,
  Settings,
  Code2,
  ArrowRight,
} from "lucide-react";
import { navigation } from "@/data/navigation";
import DocsLayout from "@/components/layout/DocsLayout";
import type { LucideIcon } from "lucide-react";

const sectionIconMap: Record<string, LucideIcon> = {
  Rocket,
  BookOpen,
  Wrench,
  Hammer,
  Settings,
  Code2,
};

const sectionColors: Record<string, string> = {
  "get-started": "text-brand-primary",
  "developer-tools": "text-[hsl(var(--tip-text))]",
  learn: "text-[hsl(271_81%_55%)]",
  build: "text-[hsl(var(--warning-text))]",
  operate: "text-[hsl(var(--tip-text))]",
  reference: "text-[hsl(var(--brand-steel))]",
};

export default function DocsHub() {
  return (
    <DocsLayout>
      {/* Hero */}
      <div>
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[hsl(217_100%_61%_/_0.08)] text-brand-primary border border-[hsl(217_100%_61%_/_0.2)]">
            v0.1 — Protocol Documentation
          </span>
        </div>
        <h1 className="text-[36px] font-bold tracking-[-0.03em] leading-[1.15] text-docs-text-primary mt-4 mb-4">
          <span>Reineira</span>
          <span className="text-brand-primary">OS</span> Documentation
        </h1>
        <p className="text-[17px] text-docs-text-muted leading-relaxed max-w-[600px] mb-10">
          Conditional settlement infrastructure — confidential Escrows,
          pluggable Gates, protocol-native Insurance, and an operator-secured
          cross-chain settlement layer. Everything you need to make money
          conditional and private.
        </p>

        {/* Section cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {navigation.map((section) => {
            const IconComp = sectionIconMap[section.icon] ?? Rocket;
            const colorClass =
              sectionColors[section.id] ?? "text-brand-primary";

            return (
              <Link
                key={section.id}
                to={`/${section.id}`}
                className="group flex flex-col bg-docs-bg-page border border-docs-border-default rounded-xl p-6 transition-colors duration-200 hover:border-brand-primary"
              >
                <div className={`mb-3 ${colorClass}`}>
                  <IconComp size={26} strokeWidth={1.8} />
                </div>
                <h2 className="text-[16px] font-semibold text-docs-text-primary mb-1.5">
                  {section.label}
                </h2>
                <p className="text-[13px] text-docs-text-muted leading-relaxed flex-1 mb-4">
                  {section.description}
                </p>
                <div className="flex items-center gap-1 text-[13px] font-medium text-brand-primary">
                  {section.pages.length}{" "}
                  {section.pages.length === 1 ? "guide" : "guides"}
                  <ArrowRight size={13} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick links */}
        <div className="mt-12 pt-8 border-t border-docs-border-subtle">
          <h2 className="text-[14px] font-semibold text-docs-text-primary mb-3">
            Popular pages
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Quick Start", href: "/get-started/quick-start" },
              { label: "Architecture", href: "/learn/architecture" },
              {
                label: "Escrow Lifecycle",
                href: "/build/escrow-lifecycle",
              },
              { label: "ReineiraSDK", href: "/reference/sdk" },
              { label: "Contracts", href: "/reference/contracts" },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-docs-border-default text-[13px] text-docs-text-secondary hover:border-brand-primary hover:text-brand-primary transition-all"
              >
                {link.label}
                <ArrowRight size={12} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
