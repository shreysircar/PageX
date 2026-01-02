"use client";

import { Files, Search, Settings } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <RailIcon label="Files">
            <Files className="h-5 w-5" />
          </RailIcon>

          <RailIcon label="Search">
            <Search className="h-5 w-5" />
          </RailIcon>

          <RailIcon label="Settings">
            <Settings className="h-5 w-5" />
          </RailIcon>
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

function RailIcon({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition hover:bg-border hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {children}
    </button>
  );
}
