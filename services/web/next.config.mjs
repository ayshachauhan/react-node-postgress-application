/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    PORT: process.env.PORT,
  },
};

export default nextConfig;
