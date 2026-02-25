import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function getInitialPreference(defaultValue: boolean): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return defaultValue;
  }

  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function useReducedMotion(defaultValue = false): boolean {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    getInitialPreference(defaultValue)
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleChange = () => {
      setReducedMotion(mediaQuery.matches);
    };

    handleChange();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    mediaQuery.addListener(handleChange);
    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  return reducedMotion;
}
