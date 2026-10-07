/** @type {import('next').NextConfig} */
// Numele repo-ului de pe GitHub (apare in link: https://USERNAME.github.io/proiect-special/)
const repo = 'proiect-special';

const nextConfig = {
  output: "export",
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
