import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

const backendUrl = "http://localhost:8000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },

  turbopack: {
    root: rootDir,
  },

  // Ngăn Next.js tự redirect /abc/ -> /abc gây vòng redirect với FastAPI
  skipTrailingSlashRedirect: true,

  // Cho phép truy cập Next dev server qua domain ngrok
  allowedDevOrigins: [
    "uninjured-boggle-polish.ngrok-free.dev",
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
  ],

  async rewrites() {
    return [
      // =========================
      // API proxy chính
      // =========================
      {
        source: "/api-backend/:path*",
        destination: `${backendUrl}/:path*`,
      },

      // =========================
      // Fix riêng các route FastAPI có dấu "/" cuối
      // để tránh 307/308 redirect
      // =========================
      {
        source: "/tracks",
        destination: `${backendUrl}/tracks/`,
      },
      {
        source: "/tracks/",
        destination: `${backendUrl}/tracks/`,
      },
      {
        source: "/api-backend/tracks",
        destination: `${backendUrl}/tracks/`,
      },
      {
        source: "/api-backend/tracks/",
        destination: `${backendUrl}/tracks/`,
      },

      {
        source: "/recommend",
        destination: `${backendUrl}/recommend/`,
      },
      {
        source: "/recommend/",
        destination: `${backendUrl}/recommend/`,
      },
      {
        source: "/api-backend/recommend",
        destination: `${backendUrl}/recommend/`,
      },
      {
        source: "/api-backend/recommend/",
        destination: `${backendUrl}/recommend/`,
      },

      {
        source: "/playlists",
        destination: `${backendUrl}/playlists/`,
      },
      {
        source: "/playlists/",
        destination: `${backendUrl}/playlists/`,
      },
      {
        source: "/api-backend/playlists",
        destination: `${backendUrl}/playlists/`,
      },
      {
        source: "/api-backend/playlists/",
        destination: `${backendUrl}/playlists/`,
      },

      {
        source: "/feedback",
        destination: `${backendUrl}/feedback/`,
      },
      {
        source: "/feedback/",
        destination: `${backendUrl}/feedback/`,
      },
      {
        source: "/api-backend/feedback",
        destination: `${backendUrl}/feedback/`,
      },
      {
        source: "/api-backend/feedback/",
        destination: `${backendUrl}/feedback/`,
      },

      // =========================
      // Proxy tương thích code cũ
      // Nếu frontend cũ gọi /auth, /likes, /payment-orders...
      // thì vẫn tự chuyển về backend.
      // =========================
      {
        source: "/auth/:path*",
        destination: `${backendUrl}/auth/:path*`,
      },
      {
        source: "/users/:path*",
        destination: `${backendUrl}/users/:path*`,
      },
      {
        source: "/likes/:path*",
        destination: `${backendUrl}/likes/:path*`,
      },
      {
        source: "/history/:path*",
        destination: `${backendUrl}/history/:path*`,
      },
      {
        source: "/emotion/:path*",
        destination: `${backendUrl}/emotion/:path*`,
      },
      {
        source: "/recommend/:path*",
        destination: `${backendUrl}/recommend/:path*`,
      },
      {
        source: "/feedback/:path*",
        destination: `${backendUrl}/feedback/:path*`,
      },
      {
        source: "/lyrics-mood/:path*",
        destination: `${backendUrl}/lyrics-mood/:path*`,
      },
      {
        source: "/payment-orders/:path*",
        destination: `${backendUrl}/payment-orders/:path*`,
      },
      {
        source: "/playlists/:path*",
        destination: `${backendUrl}/playlists/:path*`,
      },
      {
        source: "/tracks/:path*",
        destination: `${backendUrl}/tracks/:path*`,
      },

      // =========================
      // Swagger / health
      // =========================
      {
        source: "/docs",
        destination: `${backendUrl}/docs`,
      },
      {
        source: "/openapi.json",
        destination: `${backendUrl}/openapi.json`,
      },
      {
        source: "/health",
        destination: `${backendUrl}/health`,
      },
    ];
  },
};

export default nextConfig;
