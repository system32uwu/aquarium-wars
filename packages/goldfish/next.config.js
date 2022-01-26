// @ts-check

/**
 * @type {import('next').NextConfig}
 **/

const nextConfig = {
  experimental: {
    outputStandalone: true,
  },
  webpackDevMiddleware: (config) => {
    // Solve compiling problem via vagrant
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // delay before rebuilding
    }
    return config
  },
}

module.exports = nextConfig
