import type { Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";

export interface RouteStub {
  /** Site-root-relative path, e.g. "/learn/security". The "/" root is skipped. */
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
}

/**
 * For a CSR SPA: writes one `index.html` per route into `dist/<route>/index.html`,
 * cloned from the root `dist/index.html` with `<title>`, `<meta description>`,
 * `<link canonical>`, and the OG/Twitter title/description/url swapped to
 * route-specific values. Body content is still the SPA shell — non-JS crawlers
 * get correct meta tags; JS-capable crawlers hydrate the real page.
 */
export function routeStubs(routes: RouteStub[]): Plugin {
  return {
    name: "route-stubs",
    apply: "build",
    closeBundle() {
      const distDir = path.resolve("dist");
      const indexPath = path.join(distDir, "index.html");
      if (!fs.existsSync(indexPath)) {
        this.warn(`route-stubs: dist/index.html not found, skipping`);
        return;
      }
      const baseHtml = fs.readFileSync(indexPath, "utf-8");
      let written = 0;

      for (const route of routes) {
        if (route.path === "/" || route.path === "") continue;
        const outDir = path.join(distDir, route.path);
        fs.mkdirSync(outDir, { recursive: true });

        const customized = baseHtml
          .replace(
            /<title>[^<]*<\/title>/,
            `<title>${escape(route.title)}</title>`,
          )
          .replace(
            /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
            `<meta name="description" content="${escape(route.description)}" />`,
          )
          .replace(
            /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
            `<link rel="canonical" href="${route.canonical}" />`,
          )
          .replace(
            /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
            `<meta property="og:url" content="${route.ogUrl}" />`,
          )
          .replace(
            /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
            `<meta property="og:title" content="${escape(route.ogTitle)}" />`,
          )
          .replace(
            /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
            `<meta property="og:description" content="${escape(route.ogDescription)}" />`,
          )
          .replace(
            /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
            `<meta name="twitter:title" content="${escape(route.ogTitle)}" />`,
          )
          .replace(
            /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
            `<meta name="twitter:description" content="${escape(route.ogDescription)}" />`,
          );

        fs.writeFileSync(path.join(outDir, "index.html"), customized);
        written++;
      }

      this.info(`route-stubs: wrote ${written} per-route HTML stubs`);
    },
  };
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
