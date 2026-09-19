// Central place mapping each unique QR identifier to the fixed text shown
// in the popup. A Map (not a plain object) is used deliberately: object
// literals inherit from Object.prototype, so a scanned value like
// "toString" or "constructor" would otherwise resolve to a built-in
// function instead of falling back to the "unknown code" message. Add new
// codes here only - no other file needs to change.
export const QR_MESSAGES = new Map([
  ["ASSET-001", "Server Rack A - Data Center Floor 2"],
  ["ASSET-002", "Fire Extinguisher - East Wing Hallway"],
]);
