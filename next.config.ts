import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Empty turbopack config to silence the warning
  // PWA features will still work via manifest.json and service worker
  turbopack: {},
};

export default nextConfig;
