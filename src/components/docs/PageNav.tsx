import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NavPage } from "@/data/navigation";

interface PageNavProps {
  prev: NavPage | null;
  next: NavPage | null;
}

function NavCard({
  page,
  direction,
}: {
  page: NavPage;
  direction: "prev" | "next";
}) {
  const isPrev = direction === "prev";
  return (
    <Link
      to={page.href}
      className={`flex-1 flex flex-col gap-1 border border-docs-border-default rounded-lg p-4 transition-all duration-200 hover:border-brand-primary hover:shadow-sm group ${
        isPrev ? "" : "items-end text-right"
      }`}
    >
      <span className="flex items-center gap-1 text-[13px] text-docs-text-faint">
        {isPrev && <ArrowLeft size={13} />}
        {isPrev ? "Previous" : "Next"}
        {!isPrev && <ArrowRight size={13} />}
      </span>
      <span className="text-[15px] font-medium text-docs-text-primary group-hover:text-brand-primary transition-colors">
        {page.title}
      </span>
    </Link>
  );
}

export default function PageNav({ prev, next }: PageNavProps) {
  if (!prev && !next) return null;

  return (
    <div className="mt-16 pt-8 border-t border-docs-border-default">
      <div className="flex gap-4">
        {prev ? (
          <NavCard page={prev} direction="prev" />
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <NavCard page={next} direction="next" />
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
