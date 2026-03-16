import Hero from "@/components/home/Hero";
import SocialProofStrip from "@/components/home/SocialProofStrip";
import OrbSceneLoader from "@/components/home/OrbSceneLoader";
import Services from "@/components/home/Services";
import CEOAgent from "@/components/home/CEOAgent";
import HowItWorks from "@/components/home/HowItWorks";
import WhyAygency from "@/components/home/WhyAygency";
import DataSecurity from "@/components/home/DataSecurity";
import CTABanner from "@/components/home/CTABanner";
import PageTransition from "@/components/ui/PageTransition";

export default function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <SocialProofStrip />
      <OrbSceneLoader />
      <Services />
      <CEOAgent />
      <HowItWorks />
      <WhyAygency />
      <DataSecurity />
      <CTABanner />
    </PageTransition>
  );
}
