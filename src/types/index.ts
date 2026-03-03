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
  relatedCaseStudy?: string;
  ctaHeading: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  industry: string;
  service: string;
  challenge: string;
  solution: string;
  results: string[];
  quote: string;
  quoteAttribution: string;
  tech: string[];
  keyMetric: { value: string; label: string };
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
