import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/petabytes",
  assetPrefix: "/petabytes",
};

export default nextConfig;
