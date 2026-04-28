import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin Turbopack's workspace root to this project so the build doesn't
  // accidentally pick up an unrelated package-lock.json from a parent dir.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
