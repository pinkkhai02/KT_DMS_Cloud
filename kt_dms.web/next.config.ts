import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // bỏ qua tất cả lỗi eslint khi build
  },
};

export default nextConfig;
