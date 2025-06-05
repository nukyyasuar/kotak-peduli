/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "clear-mammal-simply.ngrok-free.app",
      },
      {
        protocol: "https",
        hostname: "organic-katydid-truly.ngrok-free.app",
      },
      {
        protocol: "https",
        hostname: "wired-snipe-deep.ngrok-free.app",
      },
      {
        protocol: "http",
        hostname: "35.219.57.198",
      },
    ],
  },
};

export default nextConfig;
