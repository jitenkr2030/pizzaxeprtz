import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  output: undefined, // Remove any output config that might cause static export
  webpack: (config, { dev }) => {
    if (dev) {
<<<<<<< HEAD
      // 禁用 webpack 的热模块替换
      config.watchOptions = {
        ignored: ['**/*'], // 忽略所有文件变化
=======
      // 优化 webpack 配置但不禁用热模块替换
      config.watchOptions = {
        // 不再忽略所有文件变化，允许静态资源正常服务
        aggregateTimeout: 300,
        poll: 1000,
>>>>>>> 9d74d848449b91ae002cca39340c62649c8c9c3d
      };
    }
    return config;
  },
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
