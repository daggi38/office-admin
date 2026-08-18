import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default 1MB is too small for scanned/uploaded office documents.
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
