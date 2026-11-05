import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import SystemTeaser from "@/components/home/SystemTeaser";
import ServicesGrid from "@/components/home/ServicesGrid";
import Quality from "@/components/home/Quality";
import SystemCore from "@/components/home/SystemCore";
import WhyAygency from "@/components/home/WhyAygency";
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
      <SystemTeaser />
      <SystemCore />
      <WhyAygency />
      <Quality />
      <ServicesGrid />
      <DataSecurity />
      <CTABanner />
    </PageTransition>
  );
}
