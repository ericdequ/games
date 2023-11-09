/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.lucidsoftware.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.quantumcybersolutions.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  pwa: {
    dest: "public",
    skipWaiting: true,
    clientsClaim: true,
  },
};

module.exports = nextConfig;
