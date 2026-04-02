/**
 * Accepts a number or a "Npx" string (as output by RangeField) and returns a
 * plain integer suitable for use in arithmetic or CSS calc() expressions.
 *
 * @param {number|string} value - e.g. 16 or "16px"
 * @returns {number}
 */
export function parsePx(value) {
  return parseInt(value, 10) || 0
}
