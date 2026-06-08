export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "scentiva-theme";

export function getDefaultTheme(): Theme {
  return "dark";
}

export function resolveTheme(stored: string | null): Theme {
  if (stored === "dark" || stored === "light") return stored;
  return getDefaultTheme();
}
