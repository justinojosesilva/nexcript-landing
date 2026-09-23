import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Página não encontrada | Nexcript",
};

// Fora do grupo (site), então inclui menu e rodapé por conta própria.
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 nx-landing nx-not-found" id="principal">
        <div className="nx-container">
          <p className="nx-eyebrow">
            <span /> ERRO 404
          </p>
          <h1>
            Esta página não existe
            <br />
            <span>ou mudou de endereço.</span>
          </h1>
          <p>
            O link pode estar desatualizado. Volte para o início para conhecer
            nossas soluções ou peça um diagnóstico gratuito da presença digital
            da sua empresa.
          </p>
          <div className="nx-actions">
            <Link href="/" className="nx-button">
              Voltar para o início <ArrowUpRight size={16} />
            </Link>
            <Link href="/#diagnostico" className="nx-button nx-button-outline">
              Solicitar diagnóstico <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
