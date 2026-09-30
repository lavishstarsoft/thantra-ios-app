import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow opening the dev server from other devices on the LAN (e.g. phone).
  allowedDevOrigins: ["192.168.29.8"],
  images: {
    // Thumbnails/carousel images come from the dashboard/R2, loaded via <img>.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
