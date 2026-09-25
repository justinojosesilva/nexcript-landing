import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileCta } from "@/components/layout/MobileCta";
import { RevealObserver } from "@/components/ui/RevealObserver";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1" id="principal">
        {children}
      </main>
      <Footer />
      <MobileCta />
      <RevealObserver />
    </>
  );
}
