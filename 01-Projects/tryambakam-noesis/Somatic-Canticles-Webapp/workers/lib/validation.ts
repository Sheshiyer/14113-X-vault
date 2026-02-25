export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationException extends Error {
  errors: ValidationError[];
  
  constructor(errors: ValidationError[]) {
    super("Validation failed");
    this.errors = errors;
    this.name = "ValidationException";
  }
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_MIN_LENGTH = 8;

export function validateEmail(email: string): ValidationError | null {
  const trimmed = email.trim().toLowerCase();
  
  if (!trimmed) {
    return { field: "email", message: "Email is required" };
  }
  
  if (trimmed.length > 254) {
    return { field: "email", message: "Email address too long" };
  }
  
  if (!EMAIL_REGEX.test(trimmed)) {
    return { field: "email", message: "Invalid email format" };
  }
  
  if (trimmed.includes("..")) {
    return { field: "email", message: "Invalid email format" };
  }
  
  return null;
}

export function validatePassword(password: string): ValidationError | null {
  if (!password) {
    return { field: "password", message: "Password is required" };
  }
  
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { field: "password", message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { field: "password", message: "Password must contain at least one uppercase letter" };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { field: "password", message: "Password must contain at least one lowercase letter" };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { field: "password", message: "Password must contain at least one number" };
  }
  
  return null;
}

export function validateBirthdate(birthdate: string): ValidationError | null {
  if (!birthdate) {
    return { field: "birthdate", message: "Birthdate is required" };
  }
  
  const date = new Date(birthdate);
  if (isNaN(date.getTime())) {
    return { field: "birthdate", message: "Invalid date format" };
  }
  
  // Check if date is in the past
  if (date > new Date()) {
    return { field: "birthdate", message: "Birthdate must be in the past" };
  }
  
  // Check if date is reasonable (not too old)
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 150);
  if (date < minDate) {
    return { field: "birthdate", message: "Invalid birthdate" };
  }
  
  return null;
}

export function validateTimezone(timezone: string): ValidationError | null {
  if (!timezone) {
    return { field: "timezone", message: "Timezone is required" };
  }
  
  // Basic validation - check if it's a valid timezone format
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return null;
  } catch {
    return { field: "timezone", message: "Invalid timezone" };
  }
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function sanitizeName(name: string): string {
  return name.trim().replace(/[<>"'&]/g, "");
}

export function validateLoginRequest(email: string, password: string): void {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(email);
  if (emailError) errors.push(emailError);
  
  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  }
  
  if (errors.length > 0) {
    throw new ValidationException(errors);
  }
}

export function validateRegisterRequest(
  email: string,
  password: string,
  birthdate: string,
  timezone: string
): void {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(email);
  if (emailError) errors.push(emailError);
  
  const passwordError = validatePassword(password);
  if (passwordError) errors.push(passwordError);
  
  const birthdateError = validateBirthdate(birthdate);
  if (birthdateError) errors.push(birthdateError);
  
  const timezoneError = validateTimezone(timezone);
  if (timezoneError) errors.push(timezoneError);
  
  if (errors.length > 0) {
    throw new ValidationException(errors);
  }
}
