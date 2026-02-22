/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
  ],
};

export default nextConfig;
