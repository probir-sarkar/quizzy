import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
