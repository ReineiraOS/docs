import { useEffect, useState, useRef } from "react";
import { Pencil } from "lucide-react";

export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  items: TocItem[];
  editHref?: string;
}

export default function TableOfContents({
  items,
  editHref,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the topmost visible heading
          const sorted = visible.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
          setActiveId(sorted[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      },
    );

    const els = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);
    els.forEach((el) => observer.observe(el!));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [activeId]);

  if (items.length === 0) return null;

  return (
    <aside
      className="hidden xl:block shrink-0 w-[220px] px-6 py-12 sticky top-16 self-start max-h-[calc(100vh-64px)] overflow-y-auto thin-scrollbar"
      aria-label="Table of contents"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-docs-text-faint mb-3">
        On this page
      </p>

      <ul className="space-y-0.5">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                ref={isActive ? activeRef : undefined}
                className={`block py-1.5 text-[13px] leading-snug transition-colors border-l-2 ${
                  item.level === 3 ? "pl-4" : "pl-2"
                } ${
                  isActive
                    ? "text-brand-primary border-brand-primary font-medium"
                    : "text-docs-text-muted border-transparent hover:text-docs-text-primary"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(item.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>

      {editHref && (
        <div className="mt-6 pt-4 border-t border-docs-border-subtle">
          <a
            href={editHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] text-docs-text-faint hover:text-docs-text-muted transition-colors"
          >
            <Pencil size={12} />
            Edit this page
          </a>
        </div>
      )}
    </aside>
  );
}
