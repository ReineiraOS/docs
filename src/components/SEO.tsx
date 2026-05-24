import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getRouteSEO } from "@/lib/seo";

export default function SEO() {
  const { pathname } = useLocation();
  const meta = getRouteSEO(pathname);

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.canonical} />
      <meta property="og:title" content={meta.ogTitle} />
      <meta property="og:description" content={meta.ogDescription} />
      <meta property="og:url" content={meta.ogUrl} />
      <meta name="twitter:title" content={meta.ogTitle} />
      <meta name="twitter:description" content={meta.ogDescription} />
    </Helmet>
  );
}
