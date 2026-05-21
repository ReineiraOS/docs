import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

/**
 * Prominent amber risk callout for fund-touching pages.
 * Not dismissible — it re-shows every session by design. Links to /risk
 * for the full audit-status disclosure.
 */
export default function RiskCallout() {
  return (
    <div
      className="rounded-lg px-4 py-3 my-6"
      style={{
        borderLeft: "3px solid hsl(38 92% 50%)",
        backgroundColor: "hsl(38 92% 50% / 0.08)",
      }}
      role="alert"
    >
      <div
        className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.05em] mb-1.5"
        style={{ color: "hsl(32 81% 29%)" }}
      >
        <AlertTriangle size={13} style={{ color: "hsl(38 92% 50%)" }} />
        Chaos-net is unaudited
      </div>
      <div className="text-[14px] leading-[1.6] text-docs-text-secondary">
        Chaos-net is unaudited. Use for testing or at your own risk —
        interacting with deployed contracts may result in loss of funds. See the{" "}
        <Link
          to="/risk"
          className="text-brand-primary font-medium hover:underline"
        >
          Risk &amp; Audit Status
        </Link>{" "}
        page for full disclosure.
      </div>
    </div>
  );
}
