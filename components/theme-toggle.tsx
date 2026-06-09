"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // #region agent log
    fetch("http://127.0.0.1:7614/ingest/df98a9cd-ddfd-4b82-82a9-44e5c4a6af98", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "c2118a",
      },
      body: JSON.stringify({
        sessionId: "c2118a",
        runId: "post-fix",
        hypothesisId: "B",
        location: "theme-toggle.tsx:useEffect",
        message: "ThemeToggle mounted state",
        data: {
          resolvedTheme,
          mounted: true,
          htmlClass: document.documentElement.className,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [resolvedTheme]);

  if (!mounted) {
    return (
      <div
        className="h-10 w-10 shrink-0"
        aria-hidden="true"
        data-debug-theme-toggle
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      data-debug-theme-toggle
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
