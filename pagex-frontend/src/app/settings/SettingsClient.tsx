"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";

export default function SettingsClient() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setEmail(payload.email);
    } catch {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-lg font-semibold">Settings</h1>
          <p className="text-sm text-muted">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile */}
        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Profile</h2>

          <div className="mt-3 text-sm">
            <p className="text-muted">Email</p>
            <p className="font-medium text-foreground">
              {email || "—"}
            </p>
          </div>
        </section>

        {/* AI Preferences */}
        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">AI Preferences</h2>
          <p className="mt-2 text-sm text-muted">
            Advanced AI controls and personalization options
            will be available here soon.
          </p>
        </section>

        {/* Storage */}
        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Storage</h2>
          <p className="mt-2 text-sm text-muted">
            Storage usage, quotas, and upgrade options
            will appear here.
          </p>
        </section>

        {/* Danger Zone */}
        <section className="rounded-lg border border-danger bg-danger/5 p-5">
          <h2 className="text-sm font-medium text-danger">
            Danger Zone
          </h2>

          <p className="mt-2 text-sm text-muted">
            Logging out will remove your session from this device.
          </p>

          <button
            onClick={handleLogout}
            className="
              mt-4 inline-flex items-center rounded-md
              bg-danger px-4 py-2 text-sm font-medium text-white
              transition hover:bg-danger/90
            "
          >
            Logout
          </button>
        </section>
      </div>
    </AppShell>
  );
}
