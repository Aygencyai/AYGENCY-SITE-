export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  icon: string;
  useCases: string[];
  problem: string;
  approach: { title: string; desc: string }[];
  ctaHeading: string;
  ctaBody: string;
}

export interface UseCase {
  slug: string;
  title: string;
  sector: string;
  systemType: string;
  subtext: string;
  problem: string;
  agents: { name: string; description: string }[];
  estimatedImpact: string;
  ctaHeading: string;
  ctaBody: string;
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

export interface Metric {
  value: string;
  label: string;
  suffix?: string;
  numericValue: number;
}
