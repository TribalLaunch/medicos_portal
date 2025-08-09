// src/routes/health/health.controller.js
export function health(_req, res) {
  res.json({ ok: true, ts: Date.now() });
}
