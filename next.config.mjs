/** @type {import('next').NextConfig} */

// When building for GitHub Pages (in CI), the site is served from
// https://<user>.github.io/<repo>/, so we need a base path. Locally and on a
// custom domain / Vercel, leave it empty. Set via the CI workflow.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export", // fully static site — no server required
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
