import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "docs-spec-drift-banner-dismissed";

/**
 * Slim, dismissible spec-drift banner. Mounted once in DocsLayout.
 * Dismissal persists for the browser session (sessionStorage), so it
 * re-shows in a fresh session — deployed contracts may differ from spec.
 */
export default function DocsBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (dismissed) return null;

  return (
    <div className="border-b border-docs-border-default bg-docs-bg-surface">
      <div className="flex items-center gap-3 px-4 py-2 text-[12.5px] text-docs-text-muted lg:pl-[284px]">
        <p className="flex-1 leading-snug">
          These docs track an actively-evolving protocol — deployed contracts
          may differ from the spec. See per-page status; latest updates in{" "}
          <a
            href="https://t.me/ReineiraOS"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary font-medium hover:underline"
          >
            Telegram
          </a>
          .
        </p>
        <button
          onClick={() => {
            sessionStorage.setItem(STORAGE_KEY, "1");
            setDismissed(true);
          }}
          className="flex items-center justify-center w-6 h-6 shrink-0 rounded-md hover:bg-docs-bg-hover transition-colors text-docs-text-faint hover:text-docs-text-primary"
          aria-label="Dismiss banner"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
