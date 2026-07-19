/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/kuaiyou-open-source",
  // Export docs/index.html so GitHub Pages directory-style /docs/ routes work.
  trailingSlash: true,
};

export default nextConfig;
