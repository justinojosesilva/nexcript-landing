"use client";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "../panel.module.css";

export type DialogTab = { id: string; label: string; content: ReactNode };

/**
 * Abas do diálogo de detalhe. O conteúdo vem pronto do servidor; aqui só se
 * escolhe qual painel aparece. Setas ← → trocam de aba, como no padrão ARIA.
 */
export function DialogTabs({ tabs, initial }: { tabs: DialogTab[]; initial?: string }) {
  const [active, setActive] = useState(initial ?? tabs[0]?.id);
  const baseId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent, index: number) {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + tabs.length) % tabs.length;
    setActive(tabs[next].id);
    buttons.current[next]?.focus();
  }

  return (
    <div className={styles.tabs}>
      <div role="tablist" aria-label="Seções do prospect" className={styles.tabList}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              buttons.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-${tab.id}-tab`}
            aria-selected={active === tab.id}
            aria-controls={`${baseId}-${tab.id}-panel`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-${tab.id}-panel`}
          aria-labelledby={`${baseId}-${tab.id}-tab`}
          hidden={active !== tab.id}
          className={styles.tabPanel}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
