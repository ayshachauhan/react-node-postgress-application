module.exports = {
  serverRuntimeConfig: {
    PORT: process.env.WEB_PORT,
  },
  publicRuntimeConfig: {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  webpack: (config) => {
    config.cache = false; // Disables caching
    return config;
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: `azentia-${process.env.ENVIRONMENT}.s3.amazonaws.com`,
        pathname: '**',
      },
    ],
  },
};
