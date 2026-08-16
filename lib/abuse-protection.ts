export const PORTAL_BURST_WINDOW_MS = 60_000;
export const PORTAL_BURST_LIMIT = 60;
export const MAX_DEVICE_SCAN_COUNT = 10_000;

export function validVisitToken(value: string) {
  return /^[a-f0-9]{64}$/.test(value);
}
