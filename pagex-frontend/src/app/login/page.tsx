"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ FORCE BRAND THEME
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "brand");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", res.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg"
      >
        <h1 className="mb-1 text-2xl font-semibold">Login to PageX</h1>
        <p className="mb-4 text-sm text-muted">
          Access your AI-powered documents
        </p>

        {error && <p className="mb-3 text-sm text-danger">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="mb-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Login
        </button>

        {/* ✅ Register link */}
        <p className="mt-4 text-center text-xs text-muted">
          Don’t have an account?{" "}
          <a href="/register" className="text-primary hover:underline">
            Create one
          </a>
        </p>
      </form>
    </div>
  );
}
