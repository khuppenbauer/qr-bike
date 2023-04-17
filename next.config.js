/** @type {import('next').NextConfig} */
const { Directus } = require('@directus/sdk');

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'production' ? false : true,
})

module.exports = withPWA({
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
  async redirects() {
    const redirect = [];
    const redirectEnabled = process.env.DIRECTUS_REDIRECT;
    if (redirectEnabled === 'true') {
      const directus = new Directus(process.env.DIRECTUS_URL);
      await directus.auth.static(process.env.DIRECTUS_TOKEN);
      const { data } = await directus.items('redirects').readByQuery({
        fields: ['source', 'destination', 'permanent'],
      });
      data.forEach((item) => {
        redirect.push(item);
      })
    }
    return redirect;
  }
})
