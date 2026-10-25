/**
 * Formats a number into Indian Rupee format (e.g. ₹18,450 or ₹2,400)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.abs(rounded));

  if (rounded < 0) {
    return `-₹${formatted}`;
  }
  return `₹${formatted}`;
}

/**
 * Format currency with explicit sign for balances (+₹3,000 or -₹2,000 or ₹0)
 */
export function formatBalanceINR(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return '₹0 (Settled)';
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.abs(rounded));

  if (rounded > 0) {
    return `+₹${formatted}`;
  }
  return `-₹${formatted}`;
}

/**
 * Generates an uppercase unique invite code (e.g. "TRIP-7X92K")
 */
export function generateTripCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TRIP-${result}`;
}

/**
 * Generates a unique transaction reference ID (e.g. "DEMO-TXN-82931")
 */
export function generateTransactionReference(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `DEMO-TXN-${num}`;
}

/**
 * Formats standard ISO dates to readable string (e.g., "12 Oct 2026")
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats date range (e.g. "12 Oct 2026 — 16 Oct 2026")
 */
export function formatDateRange(startDate: string, endDate: string): string {
  return `${formatDate(startDate)} — ${formatDate(endDate)}`;
}

/**
 * Calculates days duration between start and end date
 */
export function calculateDays(startDate: string, endDate: string): number {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  } catch {
    return 1;
  }
}

/**
 * Relative time formatter (e.g., "2 minutes ago", "1 hour ago")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}
