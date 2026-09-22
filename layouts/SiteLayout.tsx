import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

/** Layout padrão para sites institucionais de até cinco páginas. */
export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1" id="principal">{children}</main>
      <Footer />
    </>
  );
}
