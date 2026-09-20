import Link from "next/link";
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
