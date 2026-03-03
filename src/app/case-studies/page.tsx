import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";

export default function CaseStudiesPage() {
  return (
    <main>
      <section className="section-padding">
        <SectionContainer>
          <SectionHeading
            eyebrow="Case Studies"
            heading="Proven results."
            description="See how our AI agents deliver measurable business impact."
            align="center"
          />
        </SectionContainer>
      </section>
    </main>
  );
}
