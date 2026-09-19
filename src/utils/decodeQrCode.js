import jsQR from "jsqr";

/**
 * Thin wrapper around jsQR - the rest of the app depends on this small
 * interface, not on jsQR's own return shape, and this is the only file
 * that ever imports the decoding library.
 */
export function decodeQrCode(imageData) {
  if (!imageData) return null;
  const result = jsQR(imageData.data, imageData.width, imageData.height);
  return result?.data || null;
}
