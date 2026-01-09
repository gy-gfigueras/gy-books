import { Activity } from '@/domain/activity.model';

/**
 * Sort activities by date in descending order (most recent first)
 */
export function sortActivitiesByDate(a: Activity, b: Activity): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

/**
 * Extract bookId from activity message
 * Looks for pattern [bookId] in message
 */
export function extractBookId(message: string): string | null {
  const pattern = /\[(\d+)\]/;
  const match = message.match(pattern);
  return match && match[1] ? match[1] : null;
}

/**
 * Clean activity message by removing [bookId] tag
 */
export function cleanActivityMessage(message: string): string {
  return message.replace(/\[\d+\]\s*/, '');
}

/**
 * Format date to dd/mm/yyyy
 */
export function formatActivityDate(date: Date | string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format date as relative time (e.g., "hace 2 horas", "hace 3 días")
 */
export function formatRelativeDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return 'hace unos segundos';
  } else if (diffMinutes < 60) {
    return `hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffHours < 24) {
    return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  } else if (diffDays < 7) {
    return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
  } else if (diffWeeks < 4) {
    return `hace ${diffWeeks} ${diffWeeks === 1 ? 'semana' : 'semanas'}`;
  } else if (diffMonths < 12) {
    return `hace ${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'}`;
  } else {
    return `hace ${diffYears} ${diffYears === 1 ? 'año' : 'años'}`;
  }
}
