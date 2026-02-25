"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  validateBirthDate,
  validateTimezone,
} from "@/lib/biorhythm/validation";
import type { ValidationError } from "@/lib/biorhythm/types";

export interface BirthFormData {
  birthDate: Date;
  timezone: string;
  location?: string;
}

export interface BirthFormProps {
  /** Callback when form is submitted with valid data */
  onSubmit: (data: BirthFormData) => void;
  /** Custom className */
  className?: string;
  /** Initial birth date value */
  initialBirthDate?: Date;
  /** Initial timezone value */
  initialTimezone?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Submit button text */
  submitText?: string;
  /** Show location search field */
  enableLocationSearch?: boolean;
}

interface TimezoneOption {
  value: string;
  label: string;
  region: string;
  offset: string;
}

// Common timezone options organized by region
const TIMEZONE_OPTIONS: TimezoneOption[] = [
  // North America
  { value: "America/New_York", label: "Eastern Time", region: "North America", offset: "UTC-5/-4" },
  { value: "America/Chicago", label: "Central Time", region: "North America", offset: "UTC-6/-5" },
  { value: "America/Denver", label: "Mountain Time", region: "North America", offset: "UTC-7/-6" },
  { value: "America/Los_Angeles", label: "Pacific Time", region: "North America", offset: "UTC-8/-7" },
  { value: "America/Anchorage", label: "Alaska Time", region: "North America", offset: "UTC-9/-8" },
  { value: "Pacific/Honolulu", label: "Hawaii Time", region: "North America", offset: "UTC-10" },
  
  // Europe
  { value: "Europe/London", label: "London (GMT)", region: "Europe", offset: "UTC+0/+1" },
  { value: "Europe/Paris", label: "Paris (CET)", region: "Europe", offset: "UTC+1/+2" },
  { value: "Europe/Berlin", label: "Berlin (CET)", region: "Europe", offset: "UTC+1/+2" },
  { value: "Europe/Moscow", label: "Moscow (MSK)", region: "Europe", offset: "UTC+3" },
  
  // Asia
  { value: "Asia/Dubai", label: "Dubai (GST)", region: "Asia", offset: "UTC+4" },
  { value: "Asia/Kolkata", label: "India (IST)", region: "Asia", offset: "UTC+5:30" },
  { value: "Asia/Shanghai", label: "China (CST)", region: "Asia", offset: "UTC+8" },
  { value: "Asia/Tokyo", label: "Japan (JST)", region: "Asia", offset: "UTC+9" },
  
  // Oceania
  { value: "Australia/Sydney", label: "Sydney (AEST)", region: "Oceania", offset: "UTC+10/+11" },
  { value: "Pacific/Auckland", label: "Auckland (NZST)", region: "Oceania", offset: "UTC+12/+13" },
  
  // UTC
  { value: "UTC", label: "UTC (Coordinated Universal Time)", region: "UTC", offset: "UTC+0" },
];

// Group timezones by region
const TIMEZONE_GROUPS = TIMEZONE_OPTIONS.reduce((acc, tz) => {
  if (!acc[tz.region]) acc[tz.region] = [];
  acc[tz.region].push(tz);
  return acc;
}, {} as Record<string, TimezoneOption[]>);

// Common cities for search
const CITY_TO_TIMEZONE: Record<string, string> = {
  "new york": "America/New_York",
  "los angeles": "America/Los_Angeles",
  "chicago": "America/Chicago",
  "denver": "America/Denver",
  "phoenix": "America/Phoenix",
  "london": "Europe/London",
  "paris": "Europe/Paris",
  "berlin": "Europe/Berlin",
  "tokyo": "Asia/Tokyo",
  "beijing": "Asia/Shanghai",
  "shanghai": "Asia/Shanghai",
  "mumbai": "Asia/Kolkata",
  "delhi": "Asia/Kolkata",
  "dubai": "Asia/Dubai",
  "sydney": "Australia/Sydney",
  "melbourne": "Australia/Sydney",
  "auckland": "Pacific/Auckland",
  "moscow": "Europe/Moscow",
  "honolulu": "Pacific/Honolulu",
  "anchorage": "America/Anchorage",
  "toronto": "America/New_York",
  "vancouver": "America/Los_Angeles",
  "mexico city": "America/Chicago",
  "sao paulo": "America/Sao_Paulo",
  "cairo": "Africa/Cairo",
  "johannesburg": "Africa/Johannesburg",
  "bangkok": "Asia/Bangkok",
  "singapore": "Asia/Singapore",
  "seoul": "Asia/Seoul",
  "hong kong": "Asia/Hong_Kong",
  "taipei": "Asia/Taipei",
};

/** Format date for input value (YYYY-MM-DD) */
function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parse date from input value */
function parseDateFromInput(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value + "T00:00:00");
  if (isNaN(date.getTime())) return null;
  return date;
}

/** Detect user's timezone */
function detectUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

/** Search for timezone by city/location */
function searchTimezone(query: string): TimezoneOption | null {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Direct city match
  const timezoneValue = CITY_TO_TIMEZONE[normalizedQuery];
  if (timezoneValue) {
    return TIMEZONE_OPTIONS.find((tz) => tz.value === timezoneValue) || null;
  }
  
  // Partial city match
  for (const [city, tz] of Object.entries(CITY_TO_TIMEZONE)) {
    if (city.includes(normalizedQuery) || normalizedQuery.includes(city)) {
      return TIMEZONE_OPTIONS.find((opt) => opt.value === tz) || null;
    }
  }
  
  // Search in timezone labels
  const matchingTimezone = TIMEZONE_OPTIONS.find(
    (tz) =>
      tz.label.toLowerCase().includes(normalizedQuery) ||
      tz.region.toLowerCase().includes(normalizedQuery)
  );
  
  return matchingTimezone || null;
}

export const BirthForm: React.FC<BirthFormProps> = ({
  onSubmit,
  className,
  initialBirthDate,
  initialTimezone,
  isLoading = false,
  submitText = "Calculate Biorhythm",
  enableLocationSearch = true,
}) => {
  // Form state
  const [birthDateValue, setBirthDateValue] = React.useState<string>(
    initialBirthDate ? formatDateForInput(initialBirthDate) : ""
  );
  const [timezone, setTimezone] = React.useState<string>(
    initialTimezone || detectUserTimezone()
  );
  const [locationQuery, setLocationQuery] = React.useState<string>("");
  const [searchResults, setSearchResults] = React.useState<TimezoneOption[]>([]);
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  
  // Validation state
  const [errors, setErrors] = React.useState<ValidationError[]>([]);
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  // Get validation errors for a field
  const getFieldErrors = (field: string): ValidationError[] => {
    return errors.filter((e) => e.field === field);
  };

  // Validate the form
  const validate = (): boolean => {
    const newErrors: ValidationError[] = [];
    
    // Validate birth date
    const date = parseDateFromInput(birthDateValue);
    if (date) {
      const dateErrors = validateBirthDate(date);
      newErrors.push(...dateErrors);
    } else {
      newErrors.push({
        field: "birthDate",
        message: "Please enter a valid date",
      });
    }
    
    // Validate timezone
    const tzErrors = validateTimezone(timezone);
    newErrors.push(...tzErrors);
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ birthDate: true, timezone: true });
    
    if (validate()) {
      const date = parseDateFromInput(birthDateValue)!;
      onSubmit({
        birthDate: date,
        timezone,
        location: locationQuery || undefined,
      });
    }
  };

  // Handle location search
  const handleLocationSearch = React.useCallback(
    (query: string) => {
      setLocationQuery(query);
      
      if (query.length >= 2) {
        const result = searchTimezone(query);
        if (result) {
          setSearchResults([result]);
          setShowSearchResults(true);
        } else {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    },
    []
  );

  // Select a timezone from search results
  const selectTimezone = (tz: TimezoneOption) => {
    setTimezone(tz.value);
    setLocationQuery(tz.label);
    setShowSearchResults(false);
    validate();
  };

  // Handle date change
  const handleDateChange = (value: string) => {
    setBirthDateValue(value);
    setTouched((prev) => ({ ...prev, birthDate: true }));
    
    const date = parseDateFromInput(value);
    if (date) {
      const dateErrors = validateBirthDate(date);
      setErrors((prev) => [
        ...prev.filter((e) => e.field !== "birthDate"),
        ...dateErrors,
      ]);
    }
  };

  // Handle timezone change
  const handleTimezoneChange = (value: string) => {
    setTimezone(value);
    setTouched((prev) => ({ ...prev, timezone: true }));
    
    const tzErrors = validateTimezone(value);
    setErrors((prev) => [
      ...prev.filter((e) => e.field !== "timezone"),
      ...tzErrors,
    ]);
  };

  // Calculate max date (today)
  const maxDate = formatDateForInput(new Date());
  // Calculate min date (1900-01-01)
  const minDate = "1900-01-01";

  const birthDateErrors = getFieldErrors("birthDate");
  const timezoneErrors = getFieldErrors("timezone");

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-[21px]", className)}>
      {/* Birth Date Input */}
      <div className="space-y-[8px]">
        <label
          htmlFor="birthDate"
          className="block text-[16px] font-medium text-slate-700"
        >
          Birth Date
          <span className="text-life ml-[2px]">*</span>
        </label>
        <Input
          id="birthDate"
          type="date"
          value={birthDateValue}
          onChange={(e) => handleDateChange(e.target.value)}
          min={minDate}
          max={maxDate}
          error={touched.birthDate && birthDateErrors.length > 0 ? birthDateErrors[0].message : undefined}
          hint="Enter your birth date to calculate your biorhythm cycles"
          className="w-full"
        />
      </div>

      {/* Timezone Selection */}
      <div className="space-y-[8px]">
        <label
          htmlFor="timezone"
          className="block text-[16px] font-medium text-slate-700"
        >
          Timezone
          <span className="text-life ml-[2px]">*</span>
        </label>
        
        {/* Location Search (optional) */}
        {enableLocationSearch && (
          <div className="relative mb-[8px]">
            <Input
              id="locationSearch"
              type="text"
              placeholder="Search for a city..."
              value={locationQuery}
              onChange={(e) => handleLocationSearch(e.target.value)}
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              }
              hint="Try searching for a major city like 'New York' or 'Tokyo'"
            />
            
            {/* Search results dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-[5px] bg-white border border-slate-200 rounded-[8px] shadow-lg overflow-hidden">
                {searchResults.map((result) => (
                  <button
                    key={result.value}
                    type="button"
                    onClick={() => selectTimezone(result)}
                    className="w-full px-[13px] py-[8px] text-left hover:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <span className="text-[14px]">{result.label}</span>
                    <span className="text-[11px] text-text-muted">{result.offset}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Timezone Select */}
        <select
          id="timezone"
          value={timezone}
          onChange={(e) => handleTimezoneChange(e.target.value)}
          className={cn(
            "flex w-full rounded-[8px] border bg-white px-[13px] py-[8px] text-[16px] text-slate-900",
            "transition-all duration-8",
            "focus:outline-none focus:ring-2 focus:ring-transform focus:ring-offset-1 focus:border-transform",
            "appearance-none cursor-pointer",
            timezoneErrors.length > 0 && touched.timezone
              ? "border-life focus:ring-life/50 focus:border-life"
              : "border-slate-300 hover:border-slate-400"
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23686868' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 13px center",
          }}
        >
          {Object.entries(TIMEZONE_GROUPS).map(([region, timezones]) => (
            <optgroup key={region} label={region}>
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label} ({tz.offset})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        
        {touched.timezone && timezoneErrors.length > 0 && (
          <p className="text-[13px] text-life flex items-center gap-[5px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            {timezoneErrors[0].message}
          </p>
        )}
        
        {!touched.timezone || timezoneErrors.length === 0 ? (
          <p className="text-[13px] text-text-muted">
            Select your birth timezone for accurate calculations
          </p>
        ) : null}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full"
        leftIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        }
      >
        {submitText}
      </Button>
    </form>
  );
};

export default BirthForm;
