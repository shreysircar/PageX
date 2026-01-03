"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function LandingPage() {
  // ✅ FORCE BRAND THEME
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "brand");
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          PageX
        </h1>

        <p className="text-lg text-muted">
          Your AI-powered document workspace
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-md border border-border px-5 py-2 text-sm font-medium hover:bg-surface"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
