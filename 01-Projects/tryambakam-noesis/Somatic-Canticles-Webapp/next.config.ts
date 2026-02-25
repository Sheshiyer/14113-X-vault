import type { NextConfig } from "next";
// import { withSentryConfig } from "@sentry/nextjs"; // TODO: Re-enable after CSS fix

const nextConfig: NextConfig = {
  // Output mode: COMMENTED OUT for development
  // Uncomment for static export (Cloudflare Pages deployment):
  // output: "export",

  // Image optimization - disabled for static export
  images: {
    unoptimized: true,
  },

  // Trailing slashes for consistent routing
  trailingSlash: true,

  // Enable typed routes for better type safety
  typedRoutes: true,
  
  experimental: {
    // Optimize package imports for common libraries
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "/api/auth/:path*",
      },
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}/api/:path*/`,
      },
    ];
  },

  webpack: (config, { isServer }) => {
    // Add power number aliases for convenience
    config.resolve.alias = {
      ...config.resolve.alias,
      "@power-numbers": "./src/lib/constants/power-numbers.ts",
    };

    return config;
  },

  // Disable server-side features not compatible with static export
  // These will be re-enabled when we add SSR support via @cloudflare/next-on-pages
};

// TODO: Re-enable Sentry after CSS is fixed
// const sentryWebpackPluginOptions = {
//   org: process.env.SENTRY_ORG,
//   project: process.env.SENTRY_PROJECT,
//   silent: !process.env.CI,
//   tunnelRoute: "/monitoring",
//   hideSourceMaps: true,
// };
// export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);

export default nextConfig;
