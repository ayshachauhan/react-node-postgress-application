module.exports = {
  serverRuntimeConfig: {
    PORT: process.env.WEB_PORT,
  },
  publicRuntimeConfig: {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  images: {
    domains: ['img.youtube.com'],
  },
};
