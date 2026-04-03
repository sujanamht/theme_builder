/**
 * Accepts a number or a "Npx" string (as output by RangeField) and returns a
 * plain integer suitable for use in arithmetic or CSS calc() expressions.
 *
 * Safe against all bad input: null, undefined, '', and NaN all return 0.
 * Callers should apply their own fallback: `parsePx(value) || 16`.
 *
 * @param {number|string|null|undefined} value - e.g. 16, "16px", null
 * @returns {number}
 */
export function parsePx(value) {
  return parseInt(value, 10) || 0
}
