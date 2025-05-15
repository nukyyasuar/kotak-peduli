/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "clear-mammal-simply.ngrok-free.app",
        // pathname: '/account123/**',
      },
    ],
  },
};

export default nextConfig;
