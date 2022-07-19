/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    domains: [
      "yt3.ggpht.com",
      "images.unsplash.com",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
