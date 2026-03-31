import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Rocket,
  BookOpen,
  Hammer,
  Settings,
  Code2,
  FileText,
} from "lucide-react";
import { navigation, NavSection } from "@/data/navigation";
import type { LucideIcon } from "lucide-react";

const sectionIconMap: Record<string, LucideIcon> = {
  Rocket,
  BookOpen,
  Hammer,
  Settings,
  Code2,
  FileText,
};

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function SectionGroup({
  section,
  isInitiallyOpen,
}: {
  section: NavSection;
  isInitiallyOpen: boolean;
}) {
  const [open, setOpen] = useState(isInitiallyOpen);
  const location = useLocation();
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isInitiallyOpen) setOpen(true);
  }, [isInitiallyOpen]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [location.pathname]);

  const IconComp = sectionIconMap[section.icon] ?? FileText;

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-1.5 px-2 rounded-md text-[11px] font-semibold uppercase tracking-[0.05em] text-docs-text-faint hover:text-docs-text-primary hover:bg-docs-bg-hover transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-1.5">
          <IconComp size={12} />
          {section.label}
        </span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ease-out ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="mt-0.5 space-y-0.5 pb-1">
          {section.pages.map((page) => {
            const isActive = location.pathname === page.href;
            return (
              <li key={page.href}>
                <Link
                  to={page.href}
                  ref={isActive ? activeRef : undefined}
                  className={`block py-1.5 px-3 ml-1 rounded-r-md text-[13.5px] transition-colors border-l-2 ${
                    isActive
                      ? "text-brand-primary bg-brand-primary-light border-brand-primary font-medium"
                      : "text-docs-text-muted border-transparent hover:text-docs-text-primary hover:bg-docs-bg-hover"
                  }`}
                >
                  {page.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();

  const activeSection = navigation.find(
    (s) =>
      s.pages.some((p) => p.href === location.pathname) ||
      location.pathname.startsWith(`/docs/${s.id}`),
  );

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[260px]
          bg-docs-bg-sidebar border-r border-docs-border-default
          flex flex-col
          transition-transform duration-[250ms] ease-out
          lg:fixed lg:top-16 lg:h-[calc(100vh-64px)] lg:translate-x-0
          ${mobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0"}
        `}
        aria-label="Documentation navigation"
      >
        {/* Mobile header */}
        <div className="lg:hidden h-16 border-b border-docs-border-default flex items-center px-4 shrink-0">
          <span className="text-[18px] font-bold tracking-[-0.02em]">
            <span className="text-docs-text-primary">Reineira</span>
            <span className="text-brand-primary">OS</span>
          </span>
        </div>

        <nav
          className="flex-1 overflow-y-auto thin-scrollbar py-4 px-3"
          aria-label="Sidebar navigation"
        >
          {navigation.map((section) => (
            <SectionGroup
              key={section.id}
              section={section}
              isInitiallyOpen={activeSection?.id === section.id}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
