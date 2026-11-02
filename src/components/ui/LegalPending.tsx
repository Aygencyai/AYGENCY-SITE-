import SectionContainer from "@/components/ui/SectionContainer";

// Placeholder body for legal pages until the final wording is agreed.
export default function LegalPending({ title }: { title: string }) {
  return (
    <section className="bg-void pt-32 pb-24">
      <SectionContainer>
        <h1 className="font-heading text-ghost text-4xl md:text-5xl uppercase font-semibold leading-tight mb-6">
          {title}
        </h1>
        <p className="font-sans text-ghost-muted text-lg max-w-2xl leading-relaxed">
          Our {title.toLowerCase()} is being finalised. If you have a question in the
          meantime, email{" "}
          <a href="mailto:build@aygency.ai" className="text-cyan hover:underline">
            build@aygency.ai
          </a>{" "}
          and we will reply within one working day.
        </p>
      </SectionContainer>
    </section>
  );
}
