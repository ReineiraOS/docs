import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

interface DocsAccordionProps {
  children: React.ReactNode;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-docs-border-subtle last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 py-4 text-left group"
        aria-expanded={open}
      >
        <span
          className={`text-[14.5px] font-medium transition-colors ${
            open
              ? "text-brand-primary"
              : "text-docs-text-primary group-hover:text-brand-primary"
          }`}
        >
          {title}
        </span>
        <ChevronDown
          size={15}
          className={`shrink-0 transition-all duration-200 ${
            open
              ? "rotate-180 text-brand-primary"
              : "text-docs-text-faint group-hover:text-brand-primary"
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ease-out ${
          open ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-4 text-[14px] text-docs-text-secondary leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function DocsAccordion({ children }: DocsAccordionProps) {
  return (
    <div className="my-6 rounded-lg border border-docs-border-default bg-white overflow-hidden px-4">
      {children}
    </div>
  );
}
