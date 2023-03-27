/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    url: process.env.DIRECTUS_URL,
    prefix: process.env.DIRECTUS_PREFIX,
    token: process.env.DIRECTUS_TOKEN,
    umami: process.env.UMAMI_SITE_ID,
    umamiSrc: process.env.UMAMI_SITE_SRC,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.DIRECTUS_HOSTNAME,
      },
    ],
  },
}

module.exports = nextConfig