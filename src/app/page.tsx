import Hero from "@/components/home/Hero";
import SocialProofStrip from "@/components/home/SocialProofStrip";
import Problem from "@/components/home/Problem";
import SystemTeaser from "@/components/home/SystemTeaser";
import CEOAgent from "@/components/home/CEOAgent";
import HowItWorks from "@/components/home/HowItWorks";
import WhyAygency from "@/components/home/WhyAygency";
import Compounding from "@/components/home/Compounding";
import DataSecurity from "@/components/home/DataSecurity";
import SelfProof from "@/components/home/SelfProof";
import CTABanner from "@/components/home/CTABanner";
import PageTransition from "@/components/ui/PageTransition";

export default function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <SocialProofStrip />
      <Problem />
      <SystemTeaser />
      <CEOAgent />
      <HowItWorks />
      <WhyAygency />
      <Compounding />
      <DataSecurity />
      <SelfProof />
      <CTABanner />
    </PageTransition>
  );
}
