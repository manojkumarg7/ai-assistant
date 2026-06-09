"use client";

import { useEffect } from "react";

const ENDPOINT =
  "http://127.0.0.1:7614/ingest/df98a9cd-ddfd-4b82-82a9-44e5c4a6af98";

function logProbe(
  hypothesisId: string,
  location: string,
  message: string,
  data: Record<string, unknown>
) {
  // #region agent log
  fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "c2118a",
    },
    body: JSON.stringify({
      sessionId: "c2118a",
      runId: "pre-fix",
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}

export function HydrationProbe() {
  useEffect(() => {
    logProbe("ALL", "hydration-probe.tsx:mount", "HydrationProbe mounted", {
      pathname: window.location.pathname,
      htmlClass: document.documentElement.className,
      htmlAttrs: Array.from(document.documentElement.attributes).map(
        (a) => `${a.name}=${a.value}`
      ),
      bodyAttrs: Array.from(document.body.attributes).map(
        (a) => `${a.name}=${a.value}`
      ),
    });

    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      const first = args[0];
      const text =
        typeof first === "string"
          ? first
          : first instanceof Error
            ? first.message
            : String(first ?? "");

      if (
        text.includes("hydration") ||
        text.includes("did not match") ||
        text.includes("Hydration failed")
      ) {
        logProbe("ALL", "hydration-probe.tsx:console.error", "Hydration console error", {
          text,
          args: args.map((a) =>
            typeof a === "string" ? a.slice(0, 500) : String(a).slice(0, 500)
          ),
          pathname: window.location.pathname,
        });
      }

      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
}
