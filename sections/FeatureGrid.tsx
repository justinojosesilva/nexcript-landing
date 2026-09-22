import { SectionHeading } from "@/components/ui/SectionHeading";

export type Feature = { title: string; description: string; number?: string };

export function FeatureGrid({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  items: Feature[];
}) {
  return (
    <section className="nx-section">
      <div className="nx-container">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="nx-feature-grid">
          {items.map((item, index) => (
            <article className="nx-feature-card" key={item.title}>
              <span>{item.number ?? String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
