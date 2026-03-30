import React, { useState } from "react";

interface TabItemProps {
  label: string;
  children: React.ReactNode;
}

interface ContentTabsProps {
  children: React.ReactNode;
  defaultTab?: number;
}

export function TabItem({ children }: TabItemProps) {
  return <>{children}</>;
}

export default function ContentTabs({
  children,
  defaultTab = 0,
}: ContentTabsProps) {
  const [active, setActive] = useState(defaultTab);

  const tabs = React.Children.toArray(children).filter(
    React.isValidElement,
  ) as React.ReactElement<TabItemProps>[];

  return (
    <div className="my-6 rounded-lg border border-docs-border-default overflow-hidden">
      {/* Tab bar */}
      <div className="flex bg-docs-bg-code-header border-b border-docs-border-default overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab.props.label}
            onClick={() => setActive(i)}
            className={`px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors border-b-2 ${
              i === active
                ? "text-brand-primary border-brand-primary font-semibold"
                : "text-docs-text-muted border-transparent hover:text-docs-text-primary"
            }`}
          >
            {tab.props.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5 bg-white text-[14px] text-docs-text-secondary leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {tabs[active]?.props.children}
      </div>
    </div>
  );
}
