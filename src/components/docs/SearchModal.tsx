import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Hash, X } from "lucide-react";
import { navigation } from "@/data/navigation";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const allPages = navigation.flatMap((section) =>
  section.pages.map((page) => ({
    ...page,
    sectionLabel: section.label,
    sectionId: section.id,
  })),
);

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = query.trim()
    ? allPages.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          (p.description ?? "").toLowerCase().includes(query.toLowerCase()),
      )
    : allPages.slice(0, 6);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleSelect = (href: string) => {
    navigate(href);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      handleSelect(filtered[activeIndex].href);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search documentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div className="relative w-full max-w-[580px] bg-white rounded-xl shadow-xl border border-docs-border-default overflow-hidden animate-fade-in">
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-docs-border-default">
          <Search size={16} className="text-docs-text-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search documentation..."
            className="flex-1 text-[15px] text-docs-text-primary placeholder:text-docs-text-faint outline-none bg-transparent"
            aria-label="Search documentation"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-docs-text-faint hover:text-docs-text-muted transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-docs-bg-surface-alt border border-docs-border-default text-docs-text-faint">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto thin-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[14px] text-docs-text-muted">
                No results for "{query}"
              </p>
              <p className="text-[13px] text-docs-text-faint mt-1">
                Try different keywords
              </p>
            </div>
          ) : (
            <ul role="listbox" className="py-2">
              {!query && (
                <li className="px-4 pt-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-docs-text-faint">
                  Recent pages
                </li>
              )}
              {filtered.map((page, i) => (
                <li
                  key={page.href}
                  role="option"
                  aria-selected={i === activeIndex}
                >
                  <button
                    className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                      i === activeIndex
                        ? "bg-docs-bg-hover"
                        : "hover:bg-docs-bg-hover"
                    }`}
                    onClick={() => handleSelect(page.href)}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <FileText
                      size={15}
                      className="mt-0.5 shrink-0 text-docs-text-faint"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-medium text-docs-text-primary truncate">
                          {page.title}
                        </span>
                        <span className="shrink-0 text-[11px] px-1.5 py-0.5 rounded-full bg-docs-bg-surface-alt text-docs-text-faint">
                          {page.sectionLabel}
                        </span>
                      </div>
                      {page.description && (
                        <p className="text-[12px] text-docs-text-muted mt-0.5 truncate">
                          {page.description}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-docs-border-subtle px-4 py-2 flex items-center gap-4 text-[11px] text-docs-text-faint">
          <span className="flex items-center gap-1">
            <kbd className="border border-docs-border-default rounded px-1">
              ↑
            </kbd>
            <kbd className="border border-docs-border-default rounded px-1">
              ↓
            </kbd>{" "}
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border border-docs-border-default rounded px-1">
              ↵
            </kbd>{" "}
            select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border border-docs-border-default rounded px-1">
              Esc
            </kbd>{" "}
            close
          </span>
        </div>
      </div>
    </div>
  );
}
