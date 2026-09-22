import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Rotas do site anterior, removidas na landing atual.
  async redirects() {
    return [
      { source: "/servicos", destination: "/#solucoes", permanent: true },
      { source: "/sobre", destination: "/", permanent: true },
      { source: "/cases", destination: "/", permanent: true },
      { source: "/blog", destination: "/", permanent: true },
      { source: "/blog/:slug*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
