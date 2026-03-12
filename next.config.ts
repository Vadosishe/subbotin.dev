import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  transpilePackages: ["react-grid-layout", "react-resizable"],
};

export default nextConfig;
