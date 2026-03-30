interface KbdProps {
  children: React.ReactNode;
  size?: "sm" | "md";
}

/**
 * Styled keyboard key — use inline for shortcut references.
 * e.g. <Kbd>Cmd</Kbd> + <Kbd>K</Kbd>
 */
export default function Kbd({ children, size = "md" }: KbdProps) {
  return (
    <kbd
      className={`inline-flex items-center justify-center font-mono font-medium rounded border shadow-[0_1px_0_1px_hsl(214_32%_88%)] bg-docs-bg-surface border-docs-border-strong text-docs-text-secondary select-none ${
        size === "sm"
          ? "text-[10px] px-1.5 py-0.5 min-w-[20px]"
          : "text-[12px] px-2 py-0.5 min-w-[24px]"
      }`}
    >
      {children}
    </kbd>
  );
}

/**
 * A full shortcut sequence — e.g. <KbdShortcut keys={["Cmd", "Shift", "P"]} />
 */
interface KbdShortcutProps {
  keys: string[];
  size?: "sm" | "md";
}

export function KbdShortcut({ keys, size = "md" }: KbdShortcutProps) {
  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((key, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          <Kbd size={size}>{key}</Kbd>
          {i < keys.length - 1 && (
            <span className="text-docs-text-faint text-[11px]">+</span>
          )}
        </span>
      ))}
    </span>
  );
}
