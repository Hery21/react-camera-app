export const UNKNOWN_QR_MESSAGE = "Unrecognized QR code.";

/**
 * Pure lookup: a decoded QR string maps to fixed, predefined text only -
 * no partial or fuzzy matching. `messageMap` is a Map so keys like
 * "toString" or "__proto__" can never accidentally resolve to something
 * other than our own data (a plain object would be unsafe here).
 */
export function resolveQrMessage(
  rawValue: string | null | undefined,
  messageMap: Map<string, string>,
): string {
  const key = rawValue?.trim();
  if (!key) return UNKNOWN_QR_MESSAGE;
  return messageMap.get(key) ?? UNKNOWN_QR_MESSAGE;
}
