/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true, // Ignores lint errors in production builds
  },
  images: { unoptimized: true }, // Disables Next.js image optimization (useful for static sites)
  webpack: (config) => {
    config.cache = {
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
    };
    return config;
  },
};

module.exports = nextConfig;
