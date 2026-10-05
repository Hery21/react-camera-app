// UNCHANGED - no sizing here.
export const UNKNOWN_QR_MESSAGE = 'Unrecognized QR code.';

export function resolveQrMessage(
  rawValue: string | null | undefined,
  messageMap: Map<string, string>,
): string {
  const key = rawValue?.trim();
  if (!key) return UNKNOWN_QR_MESSAGE;
  return messageMap.get(key) ?? UNKNOWN_QR_MESSAGE;
}
