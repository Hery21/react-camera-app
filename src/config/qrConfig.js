// Single source of truth for the deployed origin that QR codes should
// point at. Used by both the CLI script (scripts/print-qr-urls.mjs) and
// the admin QR generator (src/screens/AdminQRCodes.jsx) so the two never
// drift.
//
// Update this one line if the deployment domain changes (e.g., moving off
// Vercel, adding a custom domain). After updating, re-run
// "npm run print:qr-urls" or open Admin -> QR Codes to generate new labels.

export const QR_BASE_URL = 'https://psb-2026-ikt.vercel.app'
