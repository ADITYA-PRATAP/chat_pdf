/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tree-shake large icon / UI packages so only used exports are bundled.
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-slot"],
  },
};

export default nextConfig;
