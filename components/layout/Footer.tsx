import Link from "next/link";
import { contactEmail, whatsappNumber } from "@/lib/contact";

const phoneLabel = (n: string) => n.replace(/^55(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3");
export function Footer() {
  return (
    <footer className="nx-footer">
      <div className="nx-container">
        <div className="nx-footer-top">
          <div>
            <Link href="/" className="nx-logo">
              nexcript<span className="nx-logo-dot">.</span>
            </Link>
            <p>Sites, automações e software para empresas.</p>
            {/* O e-mail aparece quando NEXT_PUBLIC_CONTACT_EMAIL estiver configurado. */}
            {(contactEmail || whatsappNumber) && (
              <address className="nx-footer-contact">
                {whatsappNumber && <a href={`https://wa.me/${whatsappNumber}`}>WhatsApp {phoneLabel(whatsappNumber)}</a>}
                {contactEmail && <a href={`mailto:${contactEmail}`}>{contactEmail}</a>}
              </address>
            )}
          </div>
          <div className="nx-footer-links">
            <Link href="/#solucoes">Soluções</Link>
            <Link href="/#care">Nexcript Care</Link>
            <Link href="/#duvidas">Perguntas frequentes</Link>
            <Link href="/#diagnostico">Fale com a Nexcript</Link>
          </div>
        </div>
        <div className="nx-footer-bottom">
          <span>
            © {new Date().getFullYear()} Nexcript. Todos os direitos reservados.
          </span>
          <span>Seu próximo passo começa com uma conversa.</span>
        </div>
      </div>
    </footer>
  );
}
