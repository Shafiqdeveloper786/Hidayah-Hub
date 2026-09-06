import type { NextConfig } from "next";

/** Minimal shape of a Next.js custom headers rule. */
interface HeaderRule {
  source: string;
  locale: false;
  headers: { key: string; value: string }[];
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /** Compress HTML/text responses with gzip (+ brotli where supported). */
  compress: true,
  images: {
    /** Serve modern AVIF/WebP formats where the client supports them (~30-50% smaller). */
    formats: ["image/avif", "image/webp"],
    /** Cache optimized images for a full year — huge win for repeat visitors. */
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/fawazahmed0/hadith-api/**",
      },
    ],
  },
  experimental: {
    /** Keep the global bundle small by compiling only the icons we actually import. */
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    // Next's header `source` uses path-to-regexp syntax, so file-extension cache
    // rules must be written one extension at a time (`/:path*.ext`).
    const assetExtensions = [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "avif",
      "gif",
      "ico",
      "svg",
      "pdf",
      "mp3",
      "ogg",
      "woff2",
    ] as const;
    const assetRules: HeaderRule[] = assetExtensions.map((ext) => ({
      // Long-lived, immutable cache for static assets (fonts, images, PDF, audio).
      source: `/:path*.${ext}`,
      locale: false,
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    }));
    const securityRules: HeaderRule[] = [
      {
        // Baseline security headers on every route.
        source: "/:path*",
        locale: false,
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
    return [...assetRules, ...securityRules];
  },
};

export default nextConfig;