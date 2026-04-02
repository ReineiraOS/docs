import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { NavSection } from "@/data/navigation";

interface SectionHubProps {
  section: NavSection;
}

export default function SectionHub({ section }: SectionHubProps) {
  return (
    <div>
      <div className="mb-8">
        <p className="text-[18px] text-docs-text-muted leading-relaxed mt-3">
          {section.description}
        </p>
        <div className="mt-8 h-px bg-docs-border-subtle" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {section.pages.map((page) => (
          <Link
            key={page.href}
            to={page.href}
            className="group flex items-start justify-between gap-3 border border-docs-border-default rounded-lg p-5 hover:border-brand-primary hover:shadow-sm transition-all duration-200 bg-docs-bg-page"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-semibold text-docs-text-primary group-hover:text-brand-primary transition-colors mb-1">
                {page.title}
              </h3>
              {page.description && (
                <p className="text-[13px] text-docs-text-muted leading-snug line-clamp-2">
                  {page.description}
                </p>
              )}
            </div>
            <ArrowRight
              size={16}
              className="shrink-0 mt-0.5 text-docs-text-faint group-hover:text-brand-primary transition-colors"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
