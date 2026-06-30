import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with conditional logic
 * Uses clsx for conditional classes and tailwind-merge to avoid conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string or Date object to a human-readable format
 * @param date - Date string, timestamp, or Date object
 * @param options - Intl.DateTimeFormatOptions for customization
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(
  date: string | number | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return "Invalid date";
  }
  return d.toLocaleDateString("en-US", options);
}

/**
 * Format duration in seconds to a human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "1:30", "45s", "2:15:30")
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

/**
 * Truncate text to a specified length with an ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

/**
 * Generate a placeholder video URL for development/testing
 * @param width - Video width (default: 1280)
 * @param height - Video height (default: 720)
 * @returns Placeholder video URL from placehold.co
 */
export function getPlaceholderVideoUrl(
  width: number = 1280,
  height: number = 720
): string {
  return `https://placehold.co/${width}x${height}/0f0f11/f97316.mp4?text=AI+Generated+Video&font=montserrat`;
}

/**
 * Format file size in bytes to a human-readable string
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size (e.g., "1.5 MB", "256 KB")
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Generate a random ID string
 * @param length - Length of the ID (default: 8)
 * @returns Random alphanumeric ID
 */
export function generateId(length: number = 8): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Debounce function to limit how often a function can be called
 * @param func - The function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get aspect ratio dimensions from aspect ratio string
 * @param aspectRatio - Aspect ratio string (e.g., "16:9", "9:16", "1:1")
 * @returns Object with width and height
 */
export function getAspectRatioDimensions(aspectRatio: string): {
  width: number;
  height: number;
} {
  const [width, height] = aspectRatio.split(":").map(Number);
  return { width, height };
}

/**
 * Get aspect ratio label from aspect ratio string
 * @param aspectRatio - Aspect ratio string (e.g., "16:9", "9:16", "1:1")
 * @returns Human-readable label (e.g., "Landscape", "Portrait", "Square")
 */
export function getAspectRatioLabel(aspectRatio: string): string {
  switch (aspectRatio) {
    case "16:9":
      return "Landscape";
    case "9:16":
      return "Portrait";
    case "1:1":
      return "Square";
    default:
      return aspectRatio;
  }
}