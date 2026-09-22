export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  locale: string;
  contact?: {
    whatsapp?: string;
    email?: string;
  };
  social?: {
    instagram?: string;
    linkedin?: string;
  };
};

export type PageSeo = {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
};
