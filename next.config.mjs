/** @type {import('next').NextConfig} */
const nextConfig = {
  // Link-preview images read the brand fonts from disk at runtime.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./src/assets/fonts/**"],
    "/audit/preview": ["./src/assets/fonts/**"],
  },
};

export default nextConfig;
