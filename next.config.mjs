/** @type {import('next').NextConfig} */
const nextConfig = {
  // Link-preview images read the brand fonts from disk at runtime.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./src/assets/fonts/**"],
    "/audit/preview": ["./src/assets/fonts/**"],
  },
  // Old service URLs, kept working after the services lineup changed.
  async redirects() {
    return [
      { source: "/services/cost-reduction", destination: "/services/back-office-agents", permanent: true },
      { source: "/services/revenue-operations", destination: "/services/lead-generation", permanent: true },
      { source: "/services/intelligence", destination: "/services/command-centre", permanent: true },
      { source: "/services/full-department", destination: "/services", permanent: true },
    ];
  },
};

export default nextConfig;
