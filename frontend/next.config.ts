import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/admin/:path*",
        // eslint-disable-next-line sonarjs/no-clear-text-protocols
        destination: `${process.env.ADMIN_SERVICE_URL || "http://admin_api:5001"}/:path*`,
      },
      {
        source: "/api/file/:path*",
        // eslint-disable-next-line sonarjs/no-clear-text-protocols
        destination: `${process.env.FILE_SERVICE_URL || "http://user_api:5002"}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mwzhoacxlsxfjagvsebx.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
