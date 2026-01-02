"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "brand";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  // Load theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;

    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    }
  }, []);

  // Update theme in DOM + localStorage
  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
      <ThemeButton
        label="Light"
        active={theme === "light"}
        onClick={() => changeTheme("light")}
      />
      <ThemeButton
        label="AI"
        active={theme === "dark"}
        onClick={() => changeTheme("dark")}
      />
      <ThemeButton
        label="Brand"
        active={theme === "brand"}
        onClick={() => changeTheme("brand")}
      />
    </div>
  );
}

function ThemeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-md text-sm font-medium transition-all
        ${
          active
            ? "bg-primary text-white"
            : "text-muted hover:bg-border"
        }
      `}
    >
      {label}
    </button>
  );
}
