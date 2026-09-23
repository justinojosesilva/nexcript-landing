import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./interno.module.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.bar}>
          <Link href="/interno/leads" className={styles.brand}>
            <Image src="/nexcript-mark.svg" alt="" width={28} height={28} />
            <span>Nexcript</span>
            <span className={styles.tag}>interno</span>
          </Link>
          <nav className={styles.nav} aria-label="Área interna">
            <Link href="/interno/leads">Leads</Link>
            <a href="/" target="_blank" rel="noopener noreferrer">
              Ver site ↗
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </>
  );
}
