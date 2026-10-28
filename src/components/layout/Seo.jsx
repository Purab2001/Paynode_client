import { useLocation } from "react-router";
import { pageMeta, site } from "@/config/site";

/** Renders the title, description and Open Graph tags for the current public route (React hoists them into <head>). */
export default function Seo() {
  const { pathname } = useLocation();
  const meta = pageMeta[pathname] ?? pageMeta["/"];
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const url = `${origin}${pathname}`;

  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${origin}/logo.png`} />
      <meta name="twitter:card" content="summary" />
    </>
  );
}
