import type { SiteConfig } from "./types";

export function OrganizationJsonLd({ site }: { site: SiteConfig }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    email: site.contact?.email,
    sameAs: Object.values(site.social ?? {}).filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
