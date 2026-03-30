interface Column {
  header: string;
  key: string;
  mono?: boolean;
  type?: boolean;
  width?: string;
}

interface DocsTableProps {
  columns: Column[];
  rows: Record<string, React.ReactNode>[];
}

export default function DocsTable({ columns, rows }: DocsTableProps) {
  return (
    <div className="rounded-lg border border-docs-border-default overflow-hidden my-6 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="bg-docs-bg-surface-alt">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.03em] text-docs-text-muted border-b border-docs-border-default"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="bg-white border-t border-docs-border-subtle hover:bg-docs-bg-hover transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 leading-snug">
                    {col.type ? (
                      <span className="font-mono text-brand-primary text-[13px]">
                        {row[col.key]}
                      </span>
                    ) : col.mono ? (
                      <code className="font-mono text-[13px] bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5 text-docs-text-primary">
                        {row[col.key]}
                      </code>
                    ) : (
                      <span className="text-docs-text-secondary">
                        {row[col.key]}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
