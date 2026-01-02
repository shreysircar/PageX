"use client";

import { useEffect, useState } from "react";
import { Sun, Palette } from "lucide-react";

type Theme = "light" | "dark" | "brand";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    }
  }, []);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-1">
      <ThemeButton title="Light theme" active={theme === "light"} onClick={() => changeTheme("light")}>
        <Sun className="h-4 w-4" />
      </ThemeButton>

      <ThemeButton title="AI (dark) theme" active={theme === "dark"} onClick={() => changeTheme("dark")}>
        <span className="text-[10px] font-semibold">AI</span>
      </ThemeButton>

      <ThemeButton title="Brand theme" active={theme === "brand"} onClick={() => changeTheme("brand")}>
        <Palette className="h-4 w-4" />
      </ThemeButton>
    </div>
  );
}

function ThemeButton({
  children,
  title,
  active,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition ${active ? "bg-primary text-white" : "text-muted hover:bg-border hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}
