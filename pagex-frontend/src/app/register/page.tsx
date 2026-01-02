"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <form
        onSubmit={handleRegister}
        className="
          w-full max-w-sm rounded-lg border border-border
          bg-surface p-6 shadow-sm
        "
      >
        <h1 className="mb-1 text-2xl font-semibold">
          Create PageX Account
        </h1>
        <p className="mb-4 text-sm text-muted">
          Get started with AI-powered search
        </p>

        {error && (
          <p className="mb-3 text-sm text-danger">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="
            mb-3 w-full rounded-md border border-border bg-background px-3 py-2
            text-sm text-foreground placeholder:text-muted
            focus:outline-none focus:ring-2 focus:ring-primary
          "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="
            mb-4 w-full rounded-md border border-border bg-background px-3 py-2
            text-sm text-foreground placeholder:text-muted
            focus:outline-none focus:ring-2 focus:ring-primary
          "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="
            w-full rounded-md bg-primary px-4 py-2
            text-sm font-medium text-white
            transition hover:bg-primary-hover
          "
        >
          Register
        </button>
      </form>
    </div>
  );
}
