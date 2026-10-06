import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="no-scrollbar max-w-full overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
      <ol className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        <li className="inline-flex items-center">
          <Link to="/" className="underline-offset-4 hover:text-foreground hover:underline">
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3" aria-hidden />
            {/* The active crumb is the current page — render as text, not a link
                (a bare "#"-href would not be a valid router target). */}
            {item.active ? (
              <span className="text-foreground" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link to={item.href} className="underline-offset-4 hover:text-foreground hover:underline">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
