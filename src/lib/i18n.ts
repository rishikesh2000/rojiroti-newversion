export type Locale = "en" | "hi";

const translationCache = new Map<string, string>();

export function normalizeLocale(value?: string | null): Locale {
  return value === "hi" ? "hi" : "en";
}

export function getLocaleFromLocation(pathname: string, search: string): Locale {
  const pathSegment = pathname.split("/").filter(Boolean)[0];
  if (pathSegment === "hi" || pathSegment === "en") {
    return normalizeLocale(pathSegment);
  }

  const queryLang = new URLSearchParams(search).get("lang");
  return normalizeLocale(queryLang);
}

export function getLocalizedPath(pathname: string, locale: Locale) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const cleanPath = normalizedPath.replace(/^\/(en|hi)(?=\/|$)/, "") || "/";
  return cleanPath === "/" ? `/${locale}` : `/${locale}${cleanPath}`;
}

export function withLocalePath(pathname: string, locale: Locale = "en") {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const cleanPath = normalizedPath.replace(/^\/(en|hi)(?=\/|$)/, "") || "/";
  return cleanPath === "/" ? `/${locale}` : `/${locale}${cleanPath}`;
}

export function buildLocalizedUrl(pathname: string, search: string, locale: Locale) {
  const params = new URLSearchParams(search);
  params.set("lang", locale);
  const nextPath = getLocalizedPath(pathname, locale);
  const queryString = params.toString();
  return queryString ? `${nextPath}?${queryString}` : nextPath;
}

export async function translateText(
  text: string,
  targetLocale: Locale = "en",
  sourceLocale: Locale = "en",
): Promise<string> {
  const value = String(text ?? "").trim();
  if (!value || targetLocale === sourceLocale) return value;

  const cacheKey = `${sourceLocale}|${targetLocale}|${value}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(value)}&langpair=${encodeURIComponent(sourceLocale)}|${encodeURIComponent(targetLocale)}`,
      { headers: { Accept: "application/json" } }
    );

    if (!response.ok) return value;

    const payload = await response.json();
    const translated = payload?.responseData?.translatedText ?? value;
    translationCache.set(cacheKey, translated);
    return translated;
  } catch (error) {
    console.warn(`Translation failed for: ${value}`, error);
    return value;
  }
}

export async function translateTextList(
  values: string[],
  targetLocale: Locale = "en",
  sourceLocale: Locale = "en",
): Promise<string[]> {
  return Promise.all(values.map((value) => translateText(value, targetLocale, sourceLocale)));
}

export async function translateJobData(job: any, targetLocale: Locale = "en") {
  if (!job || targetLocale === "en") return job;

  const clone = { ...job };
  const fields = [
    "job_title",
    "job_category",
    "job_type",
    "job_city",
    "address",
    "company_name",
    "location",
    "description",
    "skills_preference",
  ];

  for (const field of fields) {
    const value = clone[field];
    if (!value) continue;

    if (Array.isArray(value)) {
      clone[field] = await translateTextList(value, targetLocale, "en");
    } else if (typeof value === "string") {
      clone[field] = await translateText(value, targetLocale, "en");
    }
  }

  return clone;
}
