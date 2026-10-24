import { useState } from "react";

const STORAGE_KEY = "karahi-theme";

// Reads the saved theme. Storage can throw (private windows, blocked site data),
// in which case we just fall back to light mode.
function readSavedTheme(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark";
  } catch {
    return false;
  }
}

// Dark mode on/off, remembered across reloads
export function useDarkMode() {
  const [isDark, setIsDark] = useState(readSavedTheme);

  function toggleDark() {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
      } catch {
        // not saved — the theme still applies for this visit
      }
      return next;
    });
  }

  return { isDark, toggleDark };
}
