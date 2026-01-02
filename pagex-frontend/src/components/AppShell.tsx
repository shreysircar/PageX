"use client";

import { Files, Trash2, Settings } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Left Rail */}
      <aside className="flex w-14 flex-col items-center border-r border-border bg-surface py-4">
        {/* App Mark */}
        <div className="mb-8 text-xs font-semibold tracking-widest text-muted">
          PX
        </div>

        {/* Primary Navigation */}
        <nav className="flex flex-col gap-3">
          <RailLink
            href="/dashboard"
            label="Files"
            active={pathname === "/dashboard"}
          >
            <Files className="h-5 w-5" />
          </RailLink>

          <RailLink
            href="/trash"
            label="Trash"
            active={pathname === "/trash"}
          >
            <Trash2 className="h-5 w-5" />
          </RailLink>

          <RailLink
            href="/settings"
            label="Settings"
            active={pathname === "/settings"}
          >
            <Settings className="h-5 w-5" />
          </RailLink>
        </nav>

        {/* Bottom Preferences */}
        <div className="mt-auto pt-4">
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex flex-1 flex-col">
        {/* Minimal Workspace Header */}
        <header className="border-b border-border bg-surface px-6 py-3" />

        {/* Workspace Content */}
        <main className="flex-1 px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Left Rail Link Button
---------------------------------------- */
function RailLink({
  children,
  label,
  href,
  active,
}: {
  children: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`
        flex h-9 w-9 items-center justify-center rounded-md transition
        ${
          active
            ? "bg-border text-foreground"
            : "text-muted hover:bg-border hover:text-foreground"
        }
        focus:outline-none focus:ring-2 focus:ring-primary
      `}
    >
      {children}
    </Link>
  );
}
