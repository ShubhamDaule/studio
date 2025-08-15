
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: {
    allowedDevOrigins: [
        "https://*.cloudworkstations.dev",
        "https://*.firebase.studio",
    ]
  },
  webpack: (config) => {
    config.watchOptions = {
        ...config.watchOptions,
        ignored: [
            ...config.watchOptions.ignored as string[],
            '**/src/ai/**'
        ]
    }
    return config;
  }
};

export default nextConfig;
