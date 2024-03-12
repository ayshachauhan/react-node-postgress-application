module.exports = {
  serverRuntimeConfig: {
    PORT: process.env.WEB_PORT,
    API_BASE_URL: process.env.API_BASE_URL,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
};
