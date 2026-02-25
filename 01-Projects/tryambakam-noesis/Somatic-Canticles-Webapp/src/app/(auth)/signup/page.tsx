"use client";

import { useState, FormEvent, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

// Google icon component
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[19px] h-[19px]" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

// GitHub icon component
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[19px] h-[19px]" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

// Password strength indicator
interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const calculateStrength = (pwd: string): number => {
    let score = 0;
    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 12) score += 10;
    if (/[a-z]/.test(pwd)) score += 15;
    if (/[A-Z]/.test(pwd)) score += 15;
    if (/[0-9]/.test(pwd)) score += 20;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 20;
    return Math.min(100, score);
  };

  const getStrengthLabel = (score: number): { label: string; color: string } => {
    if (score < 40) return { label: "Weak", color: "life" };
    if (score < 70) return { label: "Fair", color: "solar" };
    if (score < 90) return { label: "Good", color: "witness" };
    return { label: "Strong", color: "world" };
  };

  const strength = calculateStrength(password);
  const { label, color } = getStrengthLabel(strength);

  if (!password) return null;

  return (
    <div className="space-y-[8px]">
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-text-muted">Password strength</span>
        <span className={cn("font-medium", `text-${color}`)}>{label}</span>
      </div>
      <div className="flex gap-[4px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-[4px] flex-1 rounded-full transition-all duration-8",
              strength > i * 20 ? `bg-${color}` : "bg-void-700"
            )}
          />
        ))}
      </div>
    </div>
  );
};

// Common timezones for dropdown
const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Europe/Athens", label: "Eastern European Time (EET)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
  { value: "Pacific/Auckland", label: "New Zealand Time (NZT)" },
];

export default function SignupPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
    timezone: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-detect timezone on mount
  useEffect(() => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setFormData(prev => ({ ...prev, timezone: detected }));
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.birthdate) {
      newErrors.birthdate = "Birth date is required for biorhythm calculations";
    } else {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.birthdate = "You must be at least 13 years old";
      } else if (birthDate > today) {
        newErrors.birthdate = "Birth date cannot be in the future";
      }
    }

    if (!formData.timezone) {
      newErrors.timezone = "Timezone is required";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the Terms of Service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Call Workers API to register user
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          birthdate: formData.birthdate,
          timezone: formData.timezone,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.details) {
          const fieldErrors: Record<string, string> = {};
          error.details.forEach((detail: { field: string; message: string }) => {
            fieldErrors[detail.field] = detail.message;
          });
          setErrors(fieldErrors);
        } else {
          addToast({
            type: "error",
            title: "Registration failed",
            message: error.error || "Something went wrong. Please try again.",
            duration: 8000,
          });
        }
        setIsLoading(false);
        return;
      }

      // Registration successful - auto sign in
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        addToast({
          type: "success",
          title: "Account created!",
          message: "Welcome to Somatic Canticles. Let's complete your setup.",
          duration: 5000,
        });
        router.push("/onboarding");
        router.refresh();
      } else {
        addToast({
          type: "warning",
          title: "Account created",
          message: "Please sign in with your new credentials.",
          duration: 8000,
        });
        router.push("/login");
      }
    } catch {
      addToast({
        type: "error",
        title: "Something went wrong",
        message: "An unexpected error occurred. Please try again.",
        duration: 8000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl: "/onboarding" });
  };

  return (
    <div className="w-full space-y-[21px]">
      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-[16px]">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          disabled={isLoading}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          }
        />

        <div className="space-y-[8px]">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            disabled={isLoading}
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
          />
          <PasswordStrength password={formData.password} />
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
          disabled={isLoading}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="16" r="1" />
            </svg>
          }
        />

        <div className="space-y-[8px]">
          <label className="block text-[16px] font-medium text-text">
            Birth Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.birthdate}
              onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
              disabled={isLoading}
              className={cn(
                "flex w-full rounded-[8px] border bg-surface-elevated px-[13px] py-[8px] text-[16px] text-text",
                "transition-all duration-8",
                "placeholder:text-text-muted",
                "focus:outline-none focus:ring-2 focus:ring-transform focus:ring-offset-1 focus:border-transform",
                "disabled:cursor-not-allowed disabled:opacity-50",
                errors.birthdate ? "border-life" : "border-surface-elevated/50"
              )}
            />
          </div>
          {errors.birthdate && (
            <p className="text-[13px] text-life flex items-center gap-[5px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              {errors.birthdate}
            </p>
          )}
          <p className="text-[13px] text-text-muted">
            Used to calculate your biorhythm cycles
          </p>
        </div>

        <div className="space-y-[8px]">
          <label className="block text-[16px] font-medium text-text">
            Timezone
          </label>
          <div className="relative">
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              disabled={isLoading}
              className={cn(
                "flex w-full rounded-[8px] border bg-surface-elevated px-[13px] py-[8px] text-[16px] text-text",
                "transition-all duration-8 appearance-none",
                "focus:outline-none focus:ring-2 focus:ring-transform focus:ring-offset-1 focus:border-transform",
                "disabled:cursor-not-allowed disabled:opacity-50",
                errors.timezone ? "border-life" : "border-surface-elevated/50"
              )}
            >
              <option value="">Select your timezone</option>
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            <div className="absolute right-[13px] top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
          {errors.timezone && (
            <p className="text-[13px] text-life flex items-center gap-[5px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              {errors.timezone}
            </p>
          )}
        </div>

        {/* Terms checkbox */}
        <label className="flex items-start gap-[8px] cursor-pointer group">
          <div className="relative mt-[2px]">
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              disabled={isLoading}
              className="sr-only peer"
            />
            <div className={cn(
              "w-[19px] h-[19px] rounded-[4px] border-2 transition-all duration-8 flex items-center justify-center",
              "border-surface-elevated/50 peer-checked:bg-octave peer-checked:border-octave",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-octave/50",
              errors.acceptTerms && "border-life"
            )}>
              <svg 
                className={cn(
                  "w-[13px] h-[13px] text-white transition-all duration-8",
                  formData.acceptTerms ? "opacity-100" : "opacity-0"
                )}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          <span className="text-[14px] text-text-muted leading-[1.5]">
            I agree to the{" "}
            <Link href="#" className="text-octave hover:text-octave-light transition-colors duration-8">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-octave hover:text-octave-light transition-colors duration-8">
              Privacy Policy
            </Link>
          </span>
        </label>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Create account
        </Button>
      </form>

      {/* OAuth Section */}
      <Separator text="Or sign up with" />

      <div className="grid grid-cols-2 gap-[13px]">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => handleOAuthSignIn("google")}
          disabled={isLoading}
          leftIcon={<GoogleIcon />}
        >
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => handleOAuthSignIn("github")}
          disabled={isLoading}
          leftIcon={<GitHubIcon />}
        >
          GitHub
        </Button>
      </div>

      {/* Login link */}
      <p className="text-center text-[14px] text-text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-octave hover:text-octave-light font-medium transition-colors duration-8"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
