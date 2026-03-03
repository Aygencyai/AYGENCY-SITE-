import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ContactPage() {
  return (
    <main>
      <section className="section-padding">
        <SectionContainer>
          <SectionHeading
            eyebrow="Contact"
            heading="Let's build something."
            description="Tell us about your business challenge. We'll show you how AI agents can solve it."
          />
        </SectionContainer>
      </section>
    </main>
  );
}
