/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "clear-mammal-simply.ngrok-free.app",
        // pathname: '/account123/**',
      },
      {
        protocol: "https",
        hostname: "organic-katydid-truly.ngrok-free.app",
      },
      {
        protocol: "https",
        hostname: "wired-snipe-deep.ngrok-free.app",
      },
    ],
  },
};

export default nextConfig;
