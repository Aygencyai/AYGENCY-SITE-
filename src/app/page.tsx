import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import SocialProofStrip from "@/components/home/SocialProofStrip";
import SystemTeaser from "@/components/home/SystemTeaser";
import ServicesGrid from "@/components/home/ServicesGrid";
import OperationsEngine from "@/components/home/OperationsEngine";
import SystemCore from "@/components/home/SystemCore";
import SelfProof from "@/components/home/SelfProof";
import HowItWorks from "@/components/home/HowItWorks";
import WhyAygency from "@/components/home/WhyAygency";
import Compounding from "@/components/home/Compounding";
import DataSecurity from "@/components/home/DataSecurity";
import CTABanner from "@/components/home/CTABanner";
import PageTransition from "@/components/ui/PageTransition";

// Canonical lives here, not in the root layout, so other pages never inherit "/".
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <SocialProofStrip />
      <SystemTeaser />
      <OperationsEngine />
      <SystemCore />
      <ServicesGrid />
      <WhyAygency />
      <HowItWorks />
      <SelfProof />
      <Compounding />
      <DataSecurity />
      <CTABanner />
    </PageTransition>
  );
}
