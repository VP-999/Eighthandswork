/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["v0.blob.com", "images.pexels.com"],
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Add a rule to handle the Supabase Realtime client
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/@supabase/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    });
    return config;
  },
}

module.exports = nextConfig
