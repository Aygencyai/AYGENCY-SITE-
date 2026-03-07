import Hero from "@/components/home/Hero";
import OrbSceneLoader from "@/components/home/OrbSceneLoader";
import Services from "@/components/home/Services";
import Stats from "@/components/home/Stats";
import HowItWorks from "@/components/home/HowItWorks";
import CTABanner from "@/components/home/CTABanner";
import PageTransition from "@/components/ui/PageTransition";

export default function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <OrbSceneLoader />
      <Services />
      <Stats />
      <HowItWorks />
      <CTABanner />
    </PageTransition>
  );
}
