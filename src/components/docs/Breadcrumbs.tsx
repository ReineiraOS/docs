import { Link, useLocation } from "react-router-dom";
import { navigation } from "@/data/navigation";
import { Home } from "lucide-react";

export default function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);
  // parts = ["section", "page"]

  const crumbs: { label: string; href: string }[] = [
    { label: "Docs", href: "/" },
  ];

  if (parts.length >= 1) {
    const sectionId = parts[0];
    const section = navigation.find((s) => s.id === sectionId);
    if (section) {
      crumbs.push({ label: section.label, href: `/${sectionId}` });
    }
  }

  if (parts.length >= 2) {
    const sectionId = parts[0];
    const pageSlug = parts[1];
    const section = navigation.find((s) => s.id === sectionId);
    const page = section?.pages.find((p) => p.slug === pageSlug);
    if (page) {
      crumbs.push({ label: page.title, href: page.href });
    }
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-0 text-[13px] text-docs-text-faint mb-4"
    >
      <Home size={12} className="mr-1.5 text-docs-text-faint" />
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center">
            {i > 0 && <span className="mx-1.5">›</span>}
            {isLast ? (
              <span className="text-docs-text-muted">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.href}
                className="hover:text-docs-text-primary transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
