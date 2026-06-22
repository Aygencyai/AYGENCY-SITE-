import Hero from "@/components/home/Hero";
import SocialProofStrip from "@/components/home/SocialProofStrip";
import SystemTeaser from "@/components/home/SystemTeaser";
import LeadGen from "@/components/home/LeadGen";
import CEOAgent from "@/components/home/CEOAgent";
import HowItWorks from "@/components/home/HowItWorks";
import WhyAygency from "@/components/home/WhyAygency";
import Compounding from "@/components/home/Compounding";
import BrainTeaser from "@/components/home/BrainTeaser";
import SelfProof from "@/components/home/SelfProof";
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
      <CEOAgent />
      <HowItWorks />
      <WhyAygency />
      <Compounding />
      <BrainTeaser />
      <SelfProof />
      <DataSecurity />
      <CTABanner />
    </PageTransition>
  );
}
