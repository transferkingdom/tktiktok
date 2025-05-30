/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    TIKTOK_CLIENT_KEY: process.env.TIKTOK_CLIENT_KEY,
    TIKTOK_CLIENT_SECRET: process.env.TIKTOK_CLIENT_SECRET,
    TIKTOK_REDIRECT_URI: process.env.TIKTOK_REDIRECT_URI,
  },
  experimental: {
    serverActions: true
  }
}

module.exports = nextConfig 