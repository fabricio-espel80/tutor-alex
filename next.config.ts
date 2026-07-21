import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Restrict root to this folder so it does not scan the parent home directory
    root: ".",
  },
};

export default nextConfig;
