import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  cacheComponents: true,
  outputFileTracingRoot: path.join(__dirname, "../../")
};

export default nextConfig;
