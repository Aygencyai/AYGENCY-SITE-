import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Faq as FaqItem } from "@/types";

// FAQ list plus matching FAQPage JSON-LD. Edit the questions in src/lib/data.ts.
export default function Faq({ items }: { items?: FaqItem[] }) {
  if (!items?.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="bg-void section-padding">
      <SectionContainer>
        <div className="max-w-3xl">
          <SectionHeading eyebrow="FAQ" heading="Common questions" />
          <div className="flex flex-col gap-4">
            {items.map((f) => (
              <details key={f.q} className="border-b border-white/10 pb-4">
                <summary className="font-heading text-lg font-semibold text-white cursor-pointer">
                  {f.q}
                </summary>
                <p className="font-sans text-ghost-muted mt-3 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </SectionContainer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
