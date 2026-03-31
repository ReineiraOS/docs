import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, Github, X, Sun, Moon } from "lucide-react";
import { navigation } from "@/data/navigation";
import SearchModal from "@/components/docs/SearchModal";

interface HeaderProps {
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
}

export default function Header({
  onMobileMenuToggle,
  mobileMenuOpen,
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDark(initialDark);
    document.documentElement.classList.toggle("dark", initialDark);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:rounded-md focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 bg-docs-bg-page border-b border-docs-border-default flex items-center px-4 gap-4"
        style={{ height: "var(--header-height)" }}
      >
        {/* Mobile hamburger */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-docs-bg-hover transition-colors text-docs-text-muted hover:text-docs-text-primary"
          aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Logo */}
        <Link
          to="/docs"
          className="flex items-center shrink-0 text-[20px] font-bold tracking-[-0.02em] leading-none"
        >
          <span className="text-docs-text-primary">Reineira</span>
          <span className="text-brand-primary">OS</span>
        </Link>

        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden sm:flex flex-1 max-w-[280px] items-center gap-2 px-3 h-9 rounded-lg bg-docs-bg-surface border border-docs-border-default text-docs-text-muted text-sm hover:border-docs-border-strong hover:text-docs-text-secondary transition-colors text-left"
          aria-label="Search documentation"
        >
          <Search size={14} className="shrink-0" />
          <span className="flex-1 text-[13px]">Search docs...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-docs-bg-surface-alt border border-docs-border-default text-docs-text-faint">
            <span>⌘</span>K
          </kbd>
        </button>

        {/* Section tabs — shown on xl */}
        <nav
          className="hidden xl:flex items-center gap-0.5 ml-auto"
          aria-label="Documentation sections"
        >
          {navigation.map((section) => {
            const isActive = location.pathname.startsWith(
              `/docs/${section.id}`,
            );
            return (
              <Link
                key={section.id}
                to={`/docs/${section.id}`}
                className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors relative whitespace-nowrap ${
                  isActive
                    ? "text-brand-primary"
                    : "text-docs-text-muted hover:text-docs-text-secondary hover:bg-docs-bg-hover"
                }`}
              >
                {section.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right icons */}
        <div className={`flex items-center gap-2 xl:ml-2 ml-auto`}>
          {/* Mobile search icon */}
          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-docs-bg-hover transition-colors text-docs-text-muted hover:text-docs-text-primary"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-docs-bg-hover transition-colors text-docs-text-muted hover:text-docs-text-primary"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a
            href="https://github.com/reineiraos"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-docs-bg-hover transition-colors text-docs-text-muted hover:text-docs-text-primary"
            aria-label="View on GitHub"
          >
            <Github size={18} />
          </a>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
