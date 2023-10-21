const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['www.quantumcybersolutions.com', 'quantumcybersolutions.com','www.Lucidsoftware.dev','Lucidsoftware.dev'],
  },
}

module.exports = withPWA(nextConfig);
