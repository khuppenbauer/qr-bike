/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    url: process.env.DIRECTUS_URL,
    prefix: process.env.DIRECTUS_PREFIX,
  },
  serverRuntimeConfig: {
    token: process.env.DIRECTUS_TOKEN,
  },
}

module.exports = nextConfig