/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: 'https://chegoudelivery-api.onrender.com',
    NEXT_PUBLIC_WS_URL: 'wss://chegoudelivery-api.onrender.com',
  },
};

module.exports = nextConfig;