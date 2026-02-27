import type { NextConfig } from "next";

// Use basePath only for GitHub Pages deployment, not for local dev
const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  ...(isProduction && {
    basePath: "/petabytes",
    assetPrefix: "/petabytes",
  }),
  env: {
    NEXT_PUBLIC_BASE_PATH: isProduction ? "/petabytes" : "",
  },
};

export default nextConfig;
