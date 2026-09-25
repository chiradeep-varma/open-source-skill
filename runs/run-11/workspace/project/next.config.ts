import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted via Docker: a standalone build bundles only the files the
  // server needs into .next/standalone, so the runtime image doesn't have
  // to carry the whole node_modules tree.
  output: "standalone",
};

export default nextConfig;
