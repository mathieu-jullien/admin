/**
 * Formats a date string to YYYY-MM-DD format for HTML date inputs
 * @param dateString - Date string in any valid format (ISO, timestamp, etc.)
 * @returns Formatted date string in YYYY-MM-DD format, or empty string if invalid
 */
export function formatDateForInput(dateString?: string | null): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return '';

    // Format to YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
}
