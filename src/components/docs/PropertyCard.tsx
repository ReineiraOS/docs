import DocsBadge from "./DocsBadge";

interface Property {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description: string;
  deprecated?: boolean;
}

interface PropertyCardProps {
  title?: string;
  properties: Property[];
}

export default function PropertyCard({ title, properties }: PropertyCardProps) {
  return (
    <div className="my-6 rounded-lg border border-docs-border-default overflow-hidden shadow-sm">
      {title && (
        <div className="bg-docs-bg-code-header border-b border-docs-border-default px-4 py-2.5">
          <span className="text-[13px] font-semibold text-docs-text-muted tracking-wide">
            {title}
          </span>
        </div>
      )}

      <div className="divide-y divide-docs-border-subtle">
        {properties.map((prop) => (
          <div
            key={prop.name}
            className={`px-4 py-3.5 hover:bg-docs-bg-hover transition-colors ${
              prop.deprecated ? "opacity-60" : ""
            }`}
          >
            {/* Top row: name + badges */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <code className="font-mono text-[13px] font-semibold text-docs-text-primary bg-docs-bg-code border border-docs-border-default rounded px-1.5 py-0.5">
                {prop.name}
              </code>

              <span className="font-mono text-[12px] text-brand-primary">
                {prop.type}
              </span>

              {prop.required ? (
                <DocsBadge variant="red">required</DocsBadge>
              ) : (
                <DocsBadge variant="default">optional</DocsBadge>
              )}

              {prop.deprecated && (
                <DocsBadge variant="amber">deprecated</DocsBadge>
              )}

              {prop.default !== undefined && (
                <span className="text-[12px] text-docs-text-faint">
                  default:{" "}
                  <code className="font-mono text-[12px] text-docs-text-muted">
                    {prop.default}
                  </code>
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-[13.5px] text-docs-text-muted leading-snug">
              {prop.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
