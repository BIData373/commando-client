import type { InstructionStatus } from '../types';

const LOCALE = 'he-IL';

/** Formats a date as DD/MM/YYYY. Returns '—' for null. */
export function formatDate(date: Date | null): string {
  if (!date) return '—';
  return date.toLocaleDateString(LOCALE, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** Formats a date as DD/MM/YY. Returns '—' for null. */
export function formatDateShort(date: Date | null): string {
  if (!date) return '—';
  return date.toLocaleDateString(LOCALE, { day: '2-digit', month: '2-digit', year: '2-digit' });
}

/** Formats a date as "12 ינו׳". Returns '' for null. */
export function formatDateMonthShort(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short' });
}

/** Formats a date as "12 בינואר". Returns '—' for null. */
export function formatDateMonthLong(date: Date | null): string {
  if (!date) return '—';
  return date.toLocaleDateString(LOCALE, { day: 'numeric', month: 'long' });
}

export function formatDateTime(date: Date): string {
  return date.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Returns a relative time string (e.g. "לפני 5 דקות") or falls back to formatDate. */
export function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (minutes < 1) return 'עכשיו';
  if (minutes < 60) return `לפני ${minutes} דקות`;
  if (hours < 24) return `לפני ${hours === 1 ? 'שעה' : `${hours} שעות`}`;
  if (days === 1) return 'אתמול';
  return formatDate(date);
}

/** Converts a Date to an ISO date string for HTML date inputs (YYYY-MM-DD). */
export function toInputDate(date: Date | null): string {
  if (!date) return '';
  return date.toISOString().split('T')[0];
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateHebrew(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
}

export function getDueDateDisplay(dueDate: Date | null, status?: InstructionStatus) {
  if (!dueDate || status === 'completed' || status === 'archived') return null;
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0)
    return { text: `חריגה ${Math.abs(diffDays)} ימים`, color: '#ef4444', overdue: true };
  if (diffDays === 0) return { text: 'היום', color: '#f59e0b', overdue: false };
  if (diffDays <= 7) return { text: `בעוד ${diffDays} ימים`, color: '#f59e0b', overdue: false };
  return { text: `בעוד ${diffDays} ימים`, color: '#6b7280', overdue: false };
}

export function isNew(createdAt: Date): boolean {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  return createdAt > twoDaysAgo;
}
