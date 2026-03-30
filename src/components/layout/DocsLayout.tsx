import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import TableOfContents, { TocItem } from "./TableOfContents";

interface DocsLayoutProps {
  children: React.ReactNode;
  toc?: TocItem[];
  editHref?: string;
}

export default function DocsLayout({
  children,
  toc = [],
  editHref,
}: DocsLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-docs-bg-page">
      <Header
        onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)}
        mobileMenuOpen={mobileMenuOpen}
      />

      <div className="flex">
        {/* Sidebar — fixed on desktop, drawer on mobile */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        {/* Main content + TOC */}
        <div className="flex-1 min-w-0 flex lg:ml-[260px]">
          {/* Content area */}
          <div className="flex-1 min-w-0 flex justify-center">
            <div className="w-full max-w-[720px] px-6 py-10 lg:py-12">
              <main id="main-content" tabIndex={-1} className="outline-none">
                {children}
              </main>
            </div>
          </div>

          {/* TOC — only on xl */}
          {toc.length > 0 && (
            <TableOfContents items={toc} editHref={editHref} />
          )}
        </div>
      </div>
    </div>
  );
}
