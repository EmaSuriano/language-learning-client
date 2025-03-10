import type { NextConfig } from "next";

const isLocal = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  basePath: isLocal ? "" : "/language-learning-client",
};

export default nextConfig;
