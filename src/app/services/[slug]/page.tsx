import SectionContainer from "@/components/ui/SectionContainer";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;

  return (
    <main>
      <section className="section-padding">
        <SectionContainer>
          <h1 className="font-heading font-semibold text-text-primary text-4xl md:text-5xl leading-tight">
            Service: {slug}
          </h1>
          <p className="text-text-secondary text-lg mt-4">
            Service detail page — content coming soon.
          </p>
        </SectionContainer>
      </section>
    </main>
  );
}
