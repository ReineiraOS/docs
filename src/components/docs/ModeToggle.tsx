import { useState, type ReactNode } from "react";
import { Eye, Lock } from "lucide-react";

interface ModeToggleProps {
  /** Behavior shown for public mode (live on Arbitrum Sepolia testnet). */
  publicMode: ReactNode;
  /** Behavior shown for encrypted mode (activates at v1.0 mainnet). */
  encryptedMode: ReactNode;
}

/**
 * Dual-mode viewer for primitive pages (Escrow, Insurance).
 *
 * Honesty contract: the Arbitrum Sepolia testnet deployment runs PUBLIC mode.
 * Encrypted mode is a SEPARATE immutable deployment that activates at v1.0
 * mainnet (Q4 2026, gated on Fhenix CoFHE). The toggle defaults to public mode
 * and badges encrypted mode as not-yet-live.
 */
export default function ModeToggle({
  publicMode,
  encryptedMode,
}: ModeToggleProps) {
  const [mode, setMode] = useState<"public" | "encrypted">("public");
  const isPublic = mode === "public";

  return (
    <div className="my-6 rounded-lg border border-docs-border-default overflow-hidden">
      {/* Toggle bar */}
      <div className="flex items-center gap-2 bg-docs-bg-code-header border-b border-docs-border-default px-3 py-2">
        <span className="text-[12px] font-medium text-docs-text-muted mr-1">
          View:
        </span>
        <button
          onClick={() => setMode("public")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
            isPublic
              ? "bg-[hsl(217_100%_61%_/_0.10)] text-brand-primary"
              : "text-docs-text-muted hover:text-docs-text-primary"
          }`}
          aria-pressed={isPublic}
        >
          <Eye size={13} />
          Public mode
        </button>
        <button
          onClick={() => setMode("encrypted")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
            !isPublic
              ? "bg-[hsl(38_92%_50%_/_0.12)] text-[hsl(var(--warning-text))]"
              : "text-docs-text-muted hover:text-docs-text-primary"
          }`}
          aria-pressed={!isPublic}
        >
          <Lock size={13} />
          Encrypted mode
        </button>

        {/* Status chip for the active mode */}
        <span className="ml-auto inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-[11px] font-medium">
          {isPublic ? (
            <span className="text-brand-primary bg-[hsl(217_100%_61%_/_0.08)] rounded-full px-2.5 py-0.5">
              Live · Arb. Sepolia
            </span>
          ) : (
            <span className="text-[hsl(var(--warning-text))] bg-[hsl(38_92%_50%_/_0.08)] rounded-full px-2.5 py-0.5">
              Spec'd · v1.0 mainnet
            </span>
          )}
        </span>
      </div>

      {/* Mode content */}
      <div className="p-5 bg-docs-bg-page text-[14px] text-docs-text-secondary leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {isPublic ? publicMode : encryptedMode}
      </div>

      {/* Honest footer */}
      <div className="px-5 py-2.5 bg-docs-bg-surface border-t border-docs-border-default text-[12px] text-docs-text-muted leading-snug">
        {isPublic
          ? "Public mode is live today on Arbitrum Sepolia testnet: state is plaintext on-chain. This is what is live now (chaos-net launches July–August 2026)."
          : "Encrypted mode — updating soon. Encrypted state does not exist on-chain until v1.0 mainnet (Q4 2026), a separate immutable deployment gated on Fhenix CoFHE. Interfaces are identical across modes."}
      </div>
    </div>
  );
}
