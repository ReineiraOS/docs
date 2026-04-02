import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeLine {
  content: string;
  highlighted?: boolean;
}

interface CodeTab {
  label: string;
  language: string;
  filename?: string;
  lines: CodeLine[];
}

interface CodeBlockProps {
  tabs?: CodeTab[];
  language?: string;
  filename?: string;
  lines?: CodeLine[];
  showLineNumbers?: boolean;
}

function tokenize(line: string, language: string): React.ReactNode[] {
  // Simple syntax highlighter using regex patterns
  const tokens: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  const push = (text: string, className?: string) => {
    if (!text) return;
    tokens.push(
      className ? (
        <span key={key++} className={className}>
          {text}
        </span>
      ) : (
        <span key={key++}>{text}</span>
      ),
    );
  };

  // Comment (// and /* */ only — skip # to avoid matching hex colors)
  const commentMatch = remaining.match(/^(.*?)(\/\/.*|\/\*.*?\*\/)$/);
  if (commentMatch) {
    const before = commentMatch[1];
    const comment = commentMatch[2];
    // tokenize before part
    remaining = before;
    const beforeTokens = tokenize(before, language);
    tokens.push(...beforeTokens);
    push(comment, "syntax-comment italic");
    return tokens;
  }

  // String literals
  const patterns: [RegExp, string][] = [
    [/"[^"]*"|'[^']*'|`[^`]*`/, "syntax-string"],
    [
      /\b(function|const|let|var|return|if|else|for|while|import|export|from|contract|pragma|address|uint256|uint64|bool|bytes32|public|external|internal|private|override|virtual|mapping|memory|storage|calldata|emit|event|struct|modifier|require|revert|pure|view|payable|constructor|new|delete|this|super|type|interface|library|using|is|extends|async|await|class|extends|implements|throw|try|catch|finally|void|string|number|boolean|null|undefined|true|false)\b/,
      "syntax-keyword font-medium",
    ],
    [/\b(euint64|euint32|euint128|ebool|eaddress|TFHE|FHE)\b/, "syntax-fhe"],
    [/\b\d+(\.\d+)?(n|e\d+)?\b/, "syntax-number"],
    [/[(){}[\];,.]/, "syntax-delimiter"],
  ];

  while (remaining.length > 0) {
    let matched = false;
    for (const [regex, className] of patterns) {
      const m = remaining.match(regex);
      if (m && m.index !== undefined) {
        const before = remaining.slice(0, m.index);
        const token = m[0];
        push(before);
        push(token, className);
        remaining = remaining.slice(m.index + token.length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      push(remaining);
      break;
    }
  }

  return tokens;
}

function CodeContent({
  lines,
  language,
  showLineNumbers,
}: {
  lines: CodeLine[];
  language: string;
  showLineNumbers: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13.5px] leading-[1.65]">
        <tbody>
          {lines.map((line, i) => (
            <tr
              key={i}
              className={
                line.highlighted ? "bg-[hsl(var(--syntax-highlight-line))]" : ""
              }
            >
              {showLineNumbers && (
                <td
                  className="select-none text-right text-docs-text-faint pr-4 pl-4 border-r border-docs-border-subtle w-8 shrink-0"
                  aria-hidden="true"
                >
                  {i + 1}
                </td>
              )}
              <td className="pl-4 pr-4 whitespace-pre font-mono">
                {tokenize(line.content, language)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CodeBlock({
  tabs,
  language = "typescript",
  filename,
  lines = [],
  showLineNumbers = true,
}: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const isMultiTab = tabs && tabs.length > 0;
  const currentTab = isMultiTab ? tabs![activeTab] : null;
  const currentLines = currentTab?.lines ?? lines;
  const currentLang = currentTab?.language ?? language;
  const currentFilename = currentTab?.filename ?? filename;

  const handleCopy = () => {
    const text = currentLines.map((l) => l.content).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="rounded-lg border border-docs-border-default overflow-hidden my-6"
      style={{ boxShadow: "var(--code-shadow)" }}
    >
      {/* Header */}
      <div className="bg-docs-bg-code-header border-b border-docs-border-default">
        {isMultiTab ? (
          <div className="flex items-center justify-between">
            <div className="flex">
              {tabs!.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 ${
                    i === activeTab
                      ? "text-brand-primary border-brand-primary font-semibold"
                      : "text-docs-text-muted border-transparent hover:text-docs-text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <CopyButton copied={copied} onClick={handleCopy} />
          </div>
        ) : (
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-[13px] font-mono text-docs-text-muted">
              {currentFilename ?? currentLang}
            </span>
            <CopyButton copied={copied} onClick={handleCopy} />
          </div>
        )}
      </div>

      {/* Code */}
      <div className="bg-docs-bg-code py-3 text-[var(--syntax-variable)]">
        <CodeContent
          lines={currentLines}
          language={currentLang}
          showLineNumbers={showLineNumbers}
        />
      </div>
    </div>
  );
}

function CopyButton({
  copied,
  onClick,
}: {
  copied: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 mr-2 px-2 py-1 rounded text-[12px] text-docs-text-muted hover:text-docs-text-primary hover:bg-docs-bg-hover transition-all"
      aria-label={copied ? "Copied!" : "Copy code"}
    >
      {copied ? (
        <>
          <Check size={13} className="text-[hsl(var(--tip-border))]" />
          <span className="text-[hsl(var(--tip-text))]">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={13} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
