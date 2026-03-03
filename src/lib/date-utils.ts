/**
 * Date Utility Functions for Sri Lankan Time
 * 
 * Sri Lanka uses UTC+5:30 timezone (no daylight saving time)
 * This module provides functions to format dates and times in Sri Lankan timezone
 */

// Sri Lankan timezone offset in hours
const SRI_LANKA_OFFSET_HOURS = 5.5; // UTC+5:30

/**
 * Get current date/time in Sri Lankan timezone
 */
export function getSriLankanNow(): Date {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (SRI_LANKA_OFFSET_HOURS * 3600000));
}

/**
 * Format date in YYYY-MM-DD format (Sri Lankan timezone)
 */
export function formatDateSL(date?: Date): string {
  const d = date || getSriLankanNow();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format time in HH:MM format (24-hour, Sri Lankan timezone)
 */
export function formatTimeSL(date?: Date): string {
  const d = date || getSriLankanNow();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format datetime in ISO format with Sri Lankan time
 * Returns: YYYY-MM-DDTHH:MM:SS+05:30
 */
export function formatDateTimeSL(date?: Date): string {
  const d = date || getSriLankanNow();
  const dateStr = formatDateSL(d);
  const timeStr = formatTimeSL(d);
  return `${dateStr}T${timeStr}:00+05:30`;
}

/**
 * Format datetime for display (readable format)
 * Returns: "YYYY-MM-DD HH:MM" (Sri Lankan time)
 */
export function formatDateTimeDisplay(date?: Date): string {
  const d = date || getSriLankanNow();
  return `${formatDateSL(d)} ${formatTimeSL(d)}`;
}

/**
 * Format datetime for CSV storage
 * Returns: "YYYY-MM-DD HH:MM:SS" (Sri Lankan time, no timezone indicator)
 */
export function formatDateTimeForCSV(date?: Date): string {
  const d = date || getSriLankanNow();
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${formatDateSL(d)} ${formatTimeSL(d)}:${seconds}`;
}

/**
 * Get current timestamp in Sri Lankan timezone for created_at fields
 */
export function getTimestampSL(): string {
  return formatDateTimeForCSV(getSriLankanNow());
}

/**
 * Parse a date string and convert to Sri Lankan timezone for display
 * Handles various input formats
 */
export function parseAndFormatSL(dateString: string): string {
  try {
    // Handle different formats
    let date: Date;
    
    if (dateString.includes('T')) {
      // ISO format: 2025-01-15T10:30:00.000Z or 2025-01-15T10:30:00+05:30
      date = new Date(dateString);
    } else if (dateString.includes(' ')) {
      // Format: 2025-01-15 10:30:00
      date = new Date(dateString.replace(' ', 'T'));
    } else {
      // Just date: 2025-01-15
      date = new Date(dateString);
    }
    
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    // Convert to Sri Lankan time
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const slDate = new Date(utc + (SRI_LANKA_OFFSET_HOURS * 3600000));
    
    return formatDateTimeDisplay(slDate);
  } catch {
    return dateString;
  }
}

/**
 * Parse date string and return only date part
 */
export function parseDateOnly(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString.split(' ')[0] || dateString;
    }
    
    // Convert to Sri Lankan time and extract date
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const slDate = new Date(utc + (SRI_LANKA_OFFSET_HOURS * 3600000));
    
    return formatDateSL(slDate);
  } catch {
    return dateString.split(' ')[0] || dateString;
  }
}

/**
 * Parse date and time from separate values
 * Returns a Date object in Sri Lankan timezone
 */
export function parseDateAndTime(dateStr: string, timeStr: string): Date {
  // Create date in Sri Lankan timezone
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  // Create date with the given values (treating as Sri Lankan time)
  const slDate = new Date(year, month - 1, day, hours, minutes, 0);
  
  // Convert to UTC by subtracting Sri Lanka offset
  const utcTime = slDate.getTime() - (SRI_LANKA_OFFSET_HOURS * 3600000);
  
  // Return as a date object (which will be displayed in local time but represents the SL time)
  return new Date(utcTime - (new Date().getTimezoneOffset() * 60000));
}

/**
 * Format for display in the UI
 */
export function formatForDisplay(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    // Convert to Sri Lankan time
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const slDate = new Date(utc + (SRI_LANKA_OFFSET_HOURS * 3600000));
    
    // Format: "Jan 15, 2025 10:30 AM"
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    
    const datePart = slDate.toLocaleDateString('en-US', options);
    const timePart = formatTime12Hour(slDate);
    
    return `${datePart} ${timePart}`;
  } catch {
    return dateString;
  }
}

/**
 * Format time in 12-hour format
 */
export function formatTime12Hour(date: Date): string {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Get current Sri Lankan time formatted for datetime-local input
 * Returns: "YYYY-MM-DDTHH:MM"
 */
export function getCurrentSLForInput(): string {
  const now = getSriLankanNow();
  return `${formatDateSL(now)}T${formatTimeSL(now)}`;
}

/**
 * Convert datetime-local input value to storage format
 * Input: "2025-01-15T10:30"
 * Output: "2025-01-15 10:30:00"
 */
export function inputToStorageFormat(inputValue: string): string {
  const [date, time] = inputValue.split('T');
  return `${date} ${time}:00`;
}

/**
 * Convert storage format to datetime-local input value
 * Input: "2025-01-15 10:30:00"
 * Output: "2025-01-15T10:30"
 */
export function storageToInputFormat(storageValue: string): string {
  // Handle both formats: "2025-01-15 10:30:00" and "2025-01-15T10:30:00"
  const hasTime = storageValue.includes(' ') || storageValue.includes('T');
  
  if (!hasTime) {
    // Just a date, add current time
    return `${storageValue}T${formatTimeSL()}`;
  }
  
  const parts = storageValue.includes('T') 
    ? storageValue.split('T')
    : storageValue.split(' ');
  
  const date = parts[0];
  const time = parts[1].substring(0, 5); // Take only HH:MM
  
  return `${date}T${time}`;
}
