const raw = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

// Normalize in case someone sets WS URL for socket auth (fetch can't use ws://).
const API_URL = raw
  .replace(/^ws:\/\//, "http://")
  .replace(/^wss:\/\//, "https://")
  .replace(/\/$/, "");

export default API_URL;
