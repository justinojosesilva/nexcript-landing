import type { Metadata } from "next";
import type { PageSeo, SiteConfig } from "./types";

export function createMetadata(
  site: SiteConfig,
  page: PageSeo = {},
): Metadata {
  const title = page.title ? `${page.title} | ${site.name}` : site.name;
  const description = page.description ?? site.description;
  const canonical = new URL(page.path ?? "/", site.url).toString();

  return {
    metadataBase: new URL(site.url),
    title,
    description,
    alternates: { canonical },
    robots: page.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      locale: site.locale,
      url: canonical,
      title,
      description,
      siteName: site.name,
    },
  };
}
