/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'ar',
  },
  images: {
    domains: [
      'cdn.discordapp.com',
      'i.ytimg.com',
      'static-cdn.jtvnw.net',
      'p16-sign-sg.tiktokcdn.com',
    ],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
}

module.exports = nextConfig
