import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ServicesPage() {
  return (
    <main>
      <section className="section-padding">
        <SectionContainer>
          <SectionHeading
            eyebrow="Services"
            heading="What we build."
            description="Custom AI agent systems designed around your business objectives."
            align="center"
          />
        </SectionContainer>
      </section>
    </main>
  );
}
