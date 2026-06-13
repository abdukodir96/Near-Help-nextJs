// ── Backend connection settings ─────────────────────────────────────────────
// All values can be overridden via environment variables at build time so the
// same code works on localhost and in production (Docker/Hostinger).

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3007';

export const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? `${BACKEND_URL}/graphql`;

export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? `${BACKEND_URL.replace(/^http/, 'ws')}/graphql`;

export const WS_CHAT_URL =
  process.env.NEXT_PUBLIC_WS_CHAT_URL ?? `${BACKEND_URL.replace(/^http/, 'ws')}/ws/chat`;

/** Resolve an uploaded asset's relative path (e.g. "/uploads/images/x.jpg") to an absolute URL. */
export const getAssetUrl = (path?: string | null): string => {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  return `${BACKEND_URL}${path}`;
};
