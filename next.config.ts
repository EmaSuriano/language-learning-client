import type { NextConfig } from "next";

const basePath =
  process.env.NODE_ENV === "development" ? "" : "/language-learning-client";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  basePath,
};

export default nextConfig;
