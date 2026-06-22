import Hero from "@/components/home/Hero";
import SocialProofStrip from "@/components/home/SocialProofStrip";
import SystemTeaser from "@/components/home/SystemTeaser";
import LeadGen from "@/components/home/LeadGen";
import OperationsEngine from "@/components/home/OperationsEngine";
import SystemCore from "@/components/home/SystemCore";
import SelfProof from "@/components/home/SelfProof";
import HowItWorks from "@/components/home/HowItWorks";
import WhyAygency from "@/components/home/WhyAygency";
import Compounding from "@/components/home/Compounding";
import DataSecurity from "@/components/home/DataSecurity";
import CTABanner from "@/components/home/CTABanner";
import PageTransition from "@/components/ui/PageTransition";

export default function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <SocialProofStrip />
      <SystemTeaser />
      <LeadGen />
      <OperationsEngine />
      <SystemCore />
      <SelfProof />
      <HowItWorks />
      <WhyAygency />
      <Compounding />
      <DataSecurity />
      <CTABanner />
    </PageTransition>
  );
}
