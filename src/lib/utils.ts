import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistance, formatRelative } from "date-fns";
import { v4 as uuidv4 } from "uuid";

/**
 * Combines class names using clsx and tailwind-merge
 * This ensures Tailwind classes are properly merged without conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date using date-fns
 * @param date - The date to format
 * @param formatStr - The format string (default: "PPP" which is like "April 29, 2024")
 */
export function formatDate(
  date: Date | number | string,
  formatStr: string = "PPP"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format a date relative to now (e.g., "3 days ago")
 */
export function formatDateRelative(
  date: Date | number | string,
  baseDate: Date = new Date()
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistance(dateObj, baseDate, { addSuffix: true });
}

/**
 * Format a date relative to a base date with context
 * (e.g., "last Friday at 4:00 PM")
 */
export function formatDateRelativeWithContext(
  date: Date | number | string,
  baseDate: Date = new Date()
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatRelative(dateObj, baseDate);
}

/**
 * Generate a unique ID using UUID v4
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * Generate a short ID (first 8 characters of UUID)
 */
export function generateShortId(): string {
  return uuidv4().slice(0, 8);
}
