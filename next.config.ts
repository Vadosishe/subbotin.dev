import type { NextConfig } from "next";

const nextConfig: any = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  transpilePackages: ["react-grid-layout", "react-resizable"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
