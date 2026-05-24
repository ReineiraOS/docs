import { navigation, getPageByHref } from "../data/navigation";

export const SITE_URL = "https://docs.reineira.xyz";

export const DEFAULT_TITLE =
  "ReineiraOS Docs — Build on the OS for Programmable Settlement";

export const DEFAULT_DESCRIPTION =
  "Developer documentation for ReineiraOS. Encrypted flows, underwritten outcomes, AI-native tooling. FHE-encrypted escrow, condition plugins, cross-chain USDC, and protocol-native insurance — one SDK.";

const DEFAULT_OG_DESCRIPTION =
  "Encrypted flows. Underwritten outcomes. AI-native tooling. Escrow, conditions, cross-chain settlement, and insurance — one SDK.";

export interface RouteSEO {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
}

export function getRouteSEO(pathname: string): RouteSEO {
  const path = pathname || "/";

  if (path === "/" || path === "") {
    return {
      path: "/",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      canonical: `${SITE_URL}/`,
      ogTitle: DEFAULT_TITLE,
      ogDescription: DEFAULT_OG_DESCRIPTION,
      ogUrl: `${SITE_URL}/`,
    };
  }

  const match = getPageByHref(path);
  if (match) {
    const { section, page } = match;
    const title = `${page.title} · ${section.label} | ReineiraOS Docs`;
    const description = page.description || section.description;
    return {
      path,
      title,
      description,
      canonical: `${SITE_URL}${path}`,
      ogTitle: title,
      ogDescription: description,
      ogUrl: `${SITE_URL}${path}`,
    };
  }

  return {
    path,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    canonical: `${SITE_URL}${path}`,
    ogTitle: DEFAULT_TITLE,
    ogDescription: DEFAULT_OG_DESCRIPTION,
    ogUrl: `${SITE_URL}${path}`,
  };
}

export function getAllPrerenderRoutes(): RouteSEO[] {
  const routes: RouteSEO[] = [getRouteSEO("/")];
  for (const section of navigation) {
    for (const page of section.pages) {
      routes.push(getRouteSEO(page.href));
    }
  }
  return routes;
}
