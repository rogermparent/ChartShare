import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [
    { url: "/~offline", revision: crypto.randomUUID() },
  ],
});

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["chartshare-common"],
};

export default withSerwist(nextConfig);
