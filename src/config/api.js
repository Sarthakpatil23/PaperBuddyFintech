// API URL configuration for split deployment (Frontend: Vercel, Backend: Render)
//
// HTTP API calls → use relative /api/* paths → Vercel proxy rewrites to Render
// Socket.IO      → must connect directly to Render (Vercel cannot proxy WebSockets)

export const API_BASE_URL = '';  // Empty = use relative URLs, Vercel proxies /api/* to Render

// Direct Render URL — used ONLY for Socket.IO (WebSockets can't go through Vercel proxy)
export const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://paperbuddyfintech-backend.onrender.com';

export function getApiUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return cleanPath; // relative URL — Vercel proxy handles the forwarding to Render
}
