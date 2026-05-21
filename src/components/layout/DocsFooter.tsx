import { Mail, Send } from "lucide-react";

/**
 * Slim docs footer / contact surface. Mounted once in DocsLayout so it appears
 * at the bottom of every page. Uses the protocol contact address — does not
 * touch the @reineira-os/* package scopes referenced in code examples.
 */
export default function DocsFooter() {
  return (
    <footer className="mt-16 border-t border-docs-border-default">
      <div className="flex flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-docs-text-faint leading-snug">
          ReineiraOS docs · Reineira Labs Limited (RAK DAO Free Zone, UAE).
          These docs track an actively-evolving protocol — see per-page status.
        </p>
        <div className="flex items-center gap-4 text-[13px]">
          <a
            href="mailto:engineering@reineira.xyz"
            className="inline-flex items-center gap-1.5 text-docs-text-muted hover:text-brand-primary transition-colors"
          >
            <Mail size={13} />
            engineering@reineira.xyz
          </a>
          <a
            href="https://t.me/ReineiraOS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-docs-text-muted hover:text-brand-primary transition-colors"
          >
            <Send size={13} />
            Telegram
          </a>
        </div>
      </div>
    </footer>
  );
}
