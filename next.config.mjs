import nextra from "nextra";
import { hostname } from "os";

/** @type {import('next').NextConfig} */

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  reactStrictMode: false,
});
const nextConfig = {
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  turbopack: {
    resolveAlias: {
      underscore: "lodash",
    },
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  compress: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.lorem.space",
      },
      // {
      //   protocol: "https",
      //   hostname: "lh3.googleusercontent.com",
      // },
      // {
      //   protocol: "https",
      //   hostname: "a0.muscache.com",
      // },
      // {
      //   protocol: "https",
      //   hostname: "avatars.githubusercontent.com",
      // },
      // {
      //   protocol: "https",
      //   hostname: "i.pravatar.cc",
      // },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "imageccp.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol:"https",
        hostname:"imageccp.s3.amazonaws.com"
      }
    ],
  },
};

export default withNextra(nextConfig);
