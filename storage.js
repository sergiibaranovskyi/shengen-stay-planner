/**
 * storage.js
 * Client-side localStorage helpers for the Schengen Calculator.
 * No backend, no network — everything stays in the browser.
 */

const STORAGE_KEY = 'schengen_calculator_v1';

/**
 * Persist the current state to localStorage.
 * @param {Array<{start: Date, end: Date}>} ranges
 * @param {Date|null} entryDate
 */
function storageSave(ranges, entryDate) {
  try {
    const payload = {
      ranges: ranges.map(r => ({
        start: r.start.toISOString(),
        end:   r.end.toISOString(),
      })),
      entryDate: entryDate ? entryDate.toISOString() : null,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('[Schengen] Could not save to localStorage:', e);
  }
}

/**
 * Load previously saved state from localStorage.
 * @returns {{ ranges: Array<{start: Date, end: Date}>, entryDate: Date|null } | null}
 *          Returns null if nothing is saved or the data is unreadable.
 */
function storageLoad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const payload = JSON.parse(raw);

    const ranges = (payload.ranges || []).map(r => ({
      start: new Date(r.start),
      end:   new Date(r.end),
    })).filter(r => !isNaN(r.start) && !isNaN(r.end));

    const entryDate = payload.entryDate ? new Date(payload.entryDate) : null;

    return { ranges, entryDate: isNaN(entryDate) ? null : entryDate };
  } catch (e) {
    console.warn('[Schengen] Could not load from localStorage:', e);
    return null;
  }
}

/**
 * Wipe all saved data from localStorage.
 */
function storageClear() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('[Schengen] Could not clear localStorage:', e);
  }
}
