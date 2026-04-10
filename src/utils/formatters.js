/**
 * Format a number as USD currency.
 * @param {number} amount
 * @param {boolean} [showSign=false] - Prefix with +/- for positive/negative
 * @returns {string}
 */
export function formatCurrency(amount, showSign = false) {
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (showSign) {
    const prefix = amount > 0 ? "+" : amount < 0 ? "-" : "";
    return `${prefix}$${formatted}`;
  }

  return `$${formatted}`;
}

/**
 * Format an ISO date string for display.
 * @param {string} dateStr - ISO date string (e.g. "2026-04-06")
 * @param {object} [options] - Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatDate(dateStr, options = { month: "short", day: "numeric" }) {
  return new Date(dateStr).toLocaleDateString("en-US", options);
}

/**
 * Format a date with year included.
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDateLong(dateStr) {
  return formatDate(dateStr, { month: "short", day: "numeric", year: "numeric" });
}

/**
 * Format a number as a percentage string.
 * @param {number} value - The decimal value (e.g. 0.85 or 85)
 * @param {number} [decimals=1]
 * @returns {string}
 */
export function formatPercentage(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}
