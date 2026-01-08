/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['pokebuildapi.fr', 'images3.alphacoders.com', 'raw.githubusercontent.com', 'pokeapi.co'],
    unoptimized: false,
  },
}

module.exports = nextConfig

