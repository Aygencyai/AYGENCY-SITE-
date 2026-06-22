import HomeBackground from "@/components/home/HomeBackground";
import Hero from "@/components/home/Hero";
import SocialProofStrip from "@/components/home/SocialProofStrip";
import SystemTeaser from "@/components/home/SystemTeaser";
import LeadGen from "@/components/home/LeadGen";
import BrainTeaser from "@/components/home/BrainTeaser";
import CEOAgent from "@/components/home/CEOAgent";
import SelfProof from "@/components/home/SelfProof";
import HowItWorks from "@/components/home/HowItWorks";
import WhyAygency from "@/components/home/WhyAygency";
import Compounding from "@/components/home/Compounding";
import DataSecurity from "@/components/home/DataSecurity";
import CTABanner from "@/components/home/CTABanner";
import PageTransition from "@/components/ui/PageTransition";

export default function HomePage() {
  return (
    <>
      <HomeBackground />
      <PageTransition>
        <Hero />
        <SocialProofStrip />
        <SystemTeaser />
        <LeadGen />
        <BrainTeaser />
        <CEOAgent />
        <SelfProof />
        <HowItWorks />
        <WhyAygency />
        <Compounding />
        <DataSecurity />
        <CTABanner />
      </PageTransition>
    </>
  );
}
