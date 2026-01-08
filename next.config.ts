import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // cacheComponents: true
  experimental: {
    serverMinification: false,
  }
};

export default nextConfig;
