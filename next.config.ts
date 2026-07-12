import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // @ts-ignore
  allowedDevOrigins: ['192.168.159.27'],
};

export default nextConfig;
