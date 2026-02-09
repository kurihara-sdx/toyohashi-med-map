import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/toyohashi-med-map',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
