import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, type LucideIcon } from "lucide-react";

interface LinkCardItem {
  title: string;
  description?: string;
  href: string;
  icon?: LucideIcon;
  external?: boolean;
  badge?: string;
}

interface LinkCardProps {
  items: LinkCardItem[];
  columns?: 1 | 2;
}

export default function LinkCard({ items, columns = 2 }: LinkCardProps) {
  return (
    <div
      className={`my-6 grid gap-3 ${
        columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
      }`}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isExternal = item.external || item.href.startsWith("http");

        const inner = (
          <div className="group flex items-start gap-3 border border-docs-border-default rounded-lg p-4 bg-docs-bg-page hover:border-brand-primary hover:shadow-sm transition-all duration-200">
            {Icon && (
              <div className="shrink-0 mt-0.5 w-8 h-8 rounded-md bg-[hsl(217_100%_61%_/_0.08)] flex items-center justify-center">
                <Icon size={16} className="text-brand-primary" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-docs-text-primary group-hover:text-brand-primary transition-colors leading-snug">
                  {item.title}
                </span>
                {item.badge && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-[hsl(217_100%_61%_/_0.08)] text-brand-primary">
                    {item.badge}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-[12.5px] text-docs-text-muted mt-0.5 leading-snug">
                  {item.description}
                </p>
              )}
            </div>

            <div className="shrink-0 mt-0.5 text-docs-text-faint group-hover:text-brand-primary transition-colors">
              {isExternal ? (
                <ExternalLink size={14} />
              ) : (
                <ArrowRight size={14} />
              )}
            </div>
          </div>
        );

        return isExternal ? (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {inner}
          </a>
        ) : (
          <Link key={item.href} to={item.href}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
