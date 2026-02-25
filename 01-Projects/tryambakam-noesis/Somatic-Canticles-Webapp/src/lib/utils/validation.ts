/**
 * Validation Utilities
 * 
 * Input validation helpers for forms, user data, and application logic.
 * All validators return clear error messages or null if valid.
 * 
 * Power numbers: 8, 13, 19, 21, 44, 125, 152
 */

import { COMMON_TIMEZONES } from "./dates";

// ============================================
// TYPES
// ============================================

/** Validation result type */
export type ValidationResult = string | null;

/** Password strength levels */
export type PasswordStrength = "weak" | "fair" | "good" | "strong";

/** Validation options */
export interface ValidationOptions {
  /** Allow empty values (skip validation) */
  allowEmpty?: boolean;
  /** Custom error message */
  message?: string;
}

// ============================================
// EMAIL VALIDATION
// ============================================

/**
 * RFC 5322 compliant email regex (simplified)
 * Allows most common email formats while rejecting obvious invalid ones
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Disposable email domains (common providers to block)
 */
const DISPOSABLE_EMAIL_DOMAINS = [
  "tempmail.com",
  "throwaway.com",
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "yopmail.com",
  "fakeinbox.com",
  "tempinbox.com",
  "sharklasers.com",
  "getairmail.com",
];

/**
 * Validate email address
 * 
 * @param email - Email to validate
 * @param options - Validation options
 * @returns Error message or null if valid
 * 
 * @example
 * validateEmail("user@example.com") // null
 * validateEmail("invalid") // "Please enter a valid email address"
 */
export function validateEmail(
  email: string,
  options: ValidationOptions = {}
): ValidationResult {
  const { allowEmpty = false, message } = options;
  
  if (!email || email.trim() === "") {
    if (allowEmpty) return null;
    return message || "Email is required";
  }
  
  const trimmed = email.trim().toLowerCase();
  
  // Check length (RFC 5321 limits to 254 characters)
  if (trimmed.length > 254) {
    return message || "Email is too long";
  }
  
  // Check local part length (max 64 characters)
  const localPart = trimmed.split("@")[0];
  if (localPart && localPart.length > 64) {
    return message || "Email local part is too long";
  }
  
  // Regex validation
  if (!EMAIL_REGEX.test(trimmed)) {
    return message || "Please enter a valid email address";
  }
  
  // Check for disposable email
  const domain = trimmed.split("@")[1];
  if (domain && DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return "Please use a permanent email address";
  }
  
  return null;
}

// ============================================
// PASSWORD VALIDATION
// ============================================

/**
 * Password requirements configuration
 */
export interface PasswordRequirements {
  /** Minimum length (default: 8) */
  minLength?: number;
  /** Maximum length (default: 128) */
  maxLength?: number;
  /** Require uppercase letter */
  requireUppercase?: boolean;
  /** Require lowercase letter */
  requireLowercase?: boolean;
  /** Require number */
  requireNumber?: boolean;
  /** Require special character */
  requireSpecial?: boolean;
}

/**
 * Default password requirements
 */
const DEFAULT_PASSWORD_REQUIREMENTS: Required<PasswordRequirements> = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: false,
};

/**
 * Validate password
 * 
 * @param password - Password to validate
 * @param requirements - Password requirements
 * @returns Error message or null if valid
 * 
 * @example
 * validatePassword("Secure123") // null
 * validatePassword("weak") // "Password must be at least 8 characters"
 */
export function validatePassword(
  password: string,
  requirements: PasswordRequirements = {}
): ValidationResult {
  const reqs = { ...DEFAULT_PASSWORD_REQUIREMENTS, ...requirements };
  
  if (!password || password === "") {
    return "Password is required";
  }
  
  if (password.length < reqs.minLength) {
    return `Password must be at least ${reqs.minLength} characters`;
  }
  
  if (password.length > reqs.maxLength) {
    return `Password must be no more than ${reqs.maxLength} characters`;
  }
  
  if (reqs.requireUppercase && !/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  
  if (reqs.requireLowercase && !/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  
  if (reqs.requireNumber && !/\d/.test(password)) {
    return "Password must contain at least one number";
  }
  
  if (reqs.requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return "Password must contain at least one special character";
  }
  
  return null;
}

/**
 * Calculate password strength
 * 
 * @param password - Password to evaluate
 * @returns Strength level
 * 
 * @example
 * getPasswordStrength("password") // "weak"
 * getPasswordStrength("Secure123!") // "strong"
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password || password.length < 8) {
    return "weak";
  }
  
  let score = 0;
  
  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 13) score += 1;
  if (password.length >= 21) score += 1;
  
  // Character variety scoring
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  // Complexity patterns
  if (/(.)\1{2,}/.test(password)) score -= 1; // Repeated characters
  if (/^(password|123|abc)/i.test(password)) score -= 2; // Common patterns
  
  // Map score to strength
  if (score <= 2) return "weak";
  if (score <= 4) return "fair";
  if (score <= 6) return "good";
  return "strong";
}

/**
 * Get password strength feedback
 * 
 * @param password - Password to evaluate
 * @returns Human-readable feedback
 */
export function getPasswordFeedback(password: string): string {
  const strength = getPasswordStrength(password);
  
  const feedback: Record<PasswordStrength, string> = {
    weak: "Add more characters and mix of letters, numbers, and symbols",
    fair: "Good start! Add more variety or length",
    good: "Strong password! Consider adding special characters",
    strong: "Excellent password!",
  };
  
  return feedback[strength];
}

// ============================================
// BIRTH DATE VALIDATION
// ============================================

/**
 * Validate birth date
 * Ensures date is in reasonable range for a living human
 * 
 * @param dateString - Date string to validate
 * @param options - Validation options
 * @returns Error message or null if valid
 * 
 * @example
 * validateBirthDate("1990-05-13") // null
 * validateBirthDate("2026-01-01") // "Birth date cannot be in the future"
 */
export function validateBirthDate(
  dateString: string,
  options: ValidationOptions = {}
): ValidationResult {
  const { allowEmpty = false, message } = options;
  
  if (!dateString || dateString.trim() === "") {
    if (allowEmpty) return null;
    return message || "Birth date is required";
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return "Please enter a valid date";
  }
  
  const now = new Date();
  
  // Check if date is in the future
  if (date > now) {
    return "Birth date cannot be in the future";
  }
  
  // Check minimum age (reasonable lower bound: 13 years)
  const minAge = 13;
  const minDate = new Date();
  minDate.setFullYear(now.getFullYear() - minAge);
  
  if (date > minDate) {
    return `You must be at least ${minAge} years old`;
  }
  
  // Check maximum age (reasonable upper bound: 125 years)
  const maxAge = 125;
  const maxDate = new Date();
  maxDate.setFullYear(now.getFullYear() - maxAge);
  
  if (date < maxDate) {
    return `Please enter a valid birth date (within ${maxAge} years)`;
  }
  
  return null;
}

/**
 * Calculate age from birth date
 * 
 * @param birthDate - Birth date
 * @returns Age in years
 */
export function calculateAge(birthDate: Date | string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// ============================================
// TIMEZONE VALIDATION
// ============================================

/**
 * Validate timezone string
 * 
 * @param timezone - Timezone to validate
 * @param options - Validation options
 * @returns Error message or null if valid
 * 
 * @example
 * validateTimezone("America/New_York") // null
 * validateTimezone("Invalid/Zone") // "Please select a valid timezone"
 */
export function validateTimezone(
  timezone: string,
  options: ValidationOptions = {}
): ValidationResult {
  const { allowEmpty = false, message } = options;
  
  if (!timezone || timezone.trim() === "") {
    if (allowEmpty) return null;
    return message || "Timezone is required";
  }
  
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return null;
  } catch {
    return message || "Please select a valid timezone";
  }
}

/**
 * Check if timezone is in common list
 * 
 * @param timezone - Timezone to check
 * @returns True if in common list
 */
export function isCommonTimezone(timezone: string): boolean {
  return COMMON_TIMEZONES.includes(timezone as typeof COMMON_TIMEZONES[number]);
}

// ============================================
// CHAPTER ID VALIDATION
// ============================================

/**
 * Valid chapter IDs (1-12)
 */
const VALID_CHAPTER_IDS = [
  "chapter-1", "chapter-2", "chapter-3", "chapter-4",
  "chapter-5", "chapter-6", "chapter-7", "chapter-8",
  "chapter-9", "chapter-10", "chapter-11", "chapter-12",
];

/**
 * Validate chapter ID
 * 
 * @param chapterId - Chapter ID to validate
 * @param options - Validation options
 * @returns Error message or null if valid
 * 
 * @example
 * validateChapterId("chapter-1") // null
 * validateChapterId("chapter-99") // "Invalid chapter ID"
 */
export function validateChapterId(
  chapterId: string,
  options: ValidationOptions = {}
): ValidationResult {
  const { allowEmpty = false, message } = options;
  
  if (!chapterId || chapterId.trim() === "") {
    if (allowEmpty) return null;
    return message || "Chapter ID is required";
  }
  
  if (!VALID_CHAPTER_IDS.includes(chapterId)) {
    return message || "Invalid chapter ID";
  }
  
  return null;
}

/**
 * Extract chapter number from ID
 * 
 * @param chapterId - Chapter ID (e.g., "chapter-5")
 * @returns Chapter number or null if invalid
 */
export function getChapterNumber(chapterId: string): number | null {
  const match = chapterId.match(/^chapter-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Validate chapter number
 * 
 * @param number - Chapter number to validate
 * @returns Error message or null if valid
 */
export function validateChapterNumber(number: number): ValidationResult {
  if (!Number.isInteger(number) || number < 1 || number > 12) {
    return "Chapter number must be between 1 and 12";
  }
  return null;
}

// ============================================
// NAME VALIDATION
// ============================================

/**
 * Validate display name
 * 
 * @param name - Name to validate
 * @param options - Validation options
 * @returns Error message or null if valid
 */
export function validateName(
  name: string,
  options: ValidationOptions = {}
): ValidationResult {
  const { allowEmpty = false, message } = options;
  
  if (!name || name.trim() === "") {
    if (allowEmpty) return null;
    return message || "Name is required";
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    return "Name must be at least 2 characters";
  }
  
  if (trimmed.length > 44) {
    return "Name must be no more than 44 characters";
  }
  
  // Allow letters, spaces, hyphens, and apostrophes
  if (!/^[\p{L}\s'-]+$/u.test(trimmed)) {
    return "Name can only contain letters, spaces, hyphens, and apostrophes";
  }
  
  return null;
}

// ============================================
// GENERIC VALIDATION UTILITIES
// ============================================

/**
 * Validate that a value is not empty
 * 
 * @param value - Value to check
 * @param fieldName - Name of field for error message
 * @returns Error message or null if valid
 */
export function validateRequired(
  value: string | null | undefined,
  fieldName: string = "Field"
): ValidationResult {
  if (!value || value.trim() === "") {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Validate string length
 * 
 * @param value - String to validate
 * @param min - Minimum length
 * @param max - Maximum length
 * @param fieldName - Name of field for error message
 * @returns Error message or null if valid
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string = "Field"
): ValidationResult {
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  if (value.length > max) {
    return `${fieldName} must be no more than ${max} characters`;
  }
  return null;
}

/**
 * Validate numeric range
 * 
 * @param value - Number to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @param fieldName - Name of field for error message
 * @returns Error message or null if valid
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = "Value"
): ValidationResult {
  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  return null;
}

/**
 * Run multiple validators and return first error
 * 
 * @param value - Value to validate
 * @param validators - Array of validator functions
 * @returns First error message or null if all pass
 */
export function validateAll<T>(
  value: T,
  validators: Array<(value: T) => ValidationResult>
): ValidationResult {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
}

// ============================================
// FORM VALIDATION
// ============================================

/**
 * Form validation result
 */
export interface FormValidationResult<T> {
  /** Whether form is valid */
  isValid: boolean;
  /** Field errors */
  errors: Partial<Record<keyof T, string>>;
}

/**
 * Validate a form object
 * 
 * @param data - Form data
 * @param validators - Validation schema
 * @returns Validation result
 * 
 * @example
 * validateForm(
 *   { email: "test@example.com", password: "secret" },
 *   {
 *     email: validateEmail,
 *     password: (v) => validatePassword(v, { minLength: 8 }),
 *   }
 * )
 */
export function validateForm<T extends Record<string, unknown>>(
  data: T,
  validators: Partial<{
    [K in keyof T]: (value: T[K]) => ValidationResult;
  }>
): FormValidationResult<T> {
  const errors: Partial<Record<keyof T, string>> = {};
  
  for (const [key, validator] of Object.entries(validators)) {
    const error = validator(data[key as keyof T]);
    if (error) {
      errors[key as keyof T] = error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================
// EXPORTS
// ============================================

export default {
  validateEmail,
  validatePassword,
  getPasswordStrength,
  getPasswordFeedback,
  validateBirthDate,
  calculateAge,
  validateTimezone,
  isCommonTimezone,
  validateChapterId,
  getChapterNumber,
  validateChapterNumber,
  validateName,
  validateRequired,
  validateLength,
  validateRange,
  validateAll,
  validateForm,
};
