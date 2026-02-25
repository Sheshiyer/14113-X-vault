"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

// Password strength indicator
const PasswordStrength = ({ password }: { password: string }) => {
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
    if (score < 40) return { label: "Weak", color: "bg-life" };
    if (score < 70) return { label: "Fair", color: "bg-solar" };
    if (score < 90) return { label: "Good", color: "bg-witness" };
    return { label: "Strong", color: "bg-world" };
  };

  const strength = calculateStrength(password);
  const { label, color } = getStrengthLabel(strength);

  if (!password) return null;

  return (
    <div className="space-y-[8px]">
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-text-muted">Password strength</span>
        <span className={cn("font-medium", color.replace("bg-", "text-"))}>{label}</span>
      </div>
      <div className="flex gap-[4px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-[4px] flex-1 rounded-full transition-all duration-8",
              strength > i * 20 ? color : "bg-void-700"
            )}
          />
        ))}
      </div>
    </div>
  );
};

// Reset password form component
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get token from URL on mount
  useEffect(() => {
    const t = searchParams.get("token");
    if (t) {
      setToken(t);
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!token) {
      addToast({
        type: "error",
        title: "Invalid reset link",
        message: "The password reset link is invalid or has expired.",
        duration: 8000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        addToast({
          type: "error",
          title: "Reset failed",
          message: error.error || "Failed to reset password. Please try again.",
          duration: 8000,
        });
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      addToast({
        type: "success",
        title: "Password reset successful",
        message: "Your password has been updated. Please sign in with your new password.",
        duration: 8000,
      });
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

  // Invalid token state
  if (!token && !isSuccess) {
    return (
      <div className="w-full space-y-[21px] text-center">
        <div className="inline-flex items-center justify-center w-[80px] h-[80px] rounded-full bg-life/20 mb-[8px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-life"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" x2="9" y1="9" y2="15" />
            <line x1="9" x2="15" y1="9" y2="15" />
          </svg>
        </div>

        <h2 className="text-[24px] font-bold text-text">Invalid Reset Link</h2>
        <p className="text-text-muted leading-[1.618]">
          The password reset link is invalid or has expired. Please request a new
          password reset.
        </p>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={() => router.push("/forgot-password")}
          className="w-full"
        >
          Request new reset link
        </Button>

        <p className="text-center text-[14px] text-text-muted">
          <Link
            href="/login"
            className="text-octave hover:text-octave-light font-medium transition-colors duration-8"
          >
            Back to login
          </Link>
        </p>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="w-full space-y-[21px] text-center">
        <div className="inline-flex items-center justify-center w-[80px] h-[80px] rounded-full bg-world/20 mb-[8px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-world"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h2 className="text-[24px] font-bold text-text">Password Reset!</h2>
        <p className="text-text-muted leading-[1.618]">
          Your password has been successfully reset. You can now sign in with
          your new password.
        </p>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={() => router.push("/login")}
          className="w-full"
        >
          Sign in
        </Button>
      </div>
    );
  }

  // Reset form
  return (
    <div className="w-full space-y-[21px]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-[80px] h-[80px] rounded-full bg-octave/20 mb-[8px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-octave"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
          </svg>
        </div>
        <h2 className="text-[24px] font-bold text-text mb-[8px]">
          Create New Password
        </h2>
        <p className="text-text-muted leading-[1.618]">
          Enter your new password below. Make sure it&apos;s secure and
          memorable.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-[21px]">
        <div className="space-y-[8px]">
          <Input
            label="New Password"
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

        <div className="bg-witness/10 rounded-[13px] p-[13px]">
          <p className="text-[13px] text-text-muted">
            <span className="text-witness font-medium">Password requirements:</span>
          </p>
          <ul className="mt-[8px] space-y-[4px] text-[13px] text-text-muted">
            <li className={cn("flex items-center gap-[8px]", formData.password.length >= 8 && "text-world")}>
              <span>{formData.password.length >= 8 ? "✓" : "•"}</span>
              <span>At least 8 characters</span>
            </li>
            <li className={cn("flex items-center gap-[8px]", /[A-Z]/.test(formData.password) && "text-world")}>
              <span>{/[A-Z]/.test(formData.password) ? "✓" : "•"}</span>
              <span>One uppercase letter</span>
            </li>
            <li className={cn("flex items-center gap-[8px]", /[0-9]/.test(formData.password) && "text-world")}>
              <span>{/[0-9]/.test(formData.password) ? "✓" : "•"}</span>
              <span>One number</span>
            </li>
          </ul>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Reset password
        </Button>
      </form>
    </div>
  );
}

// Loading fallback
function LoadingState() {
  return (
    <div className="w-full space-y-[21px]">
      <div className="flex items-center justify-center py-[44px]">
        <div className="animate-spin rounded-full h-[44px] w-[44px] border-b-2 border-octave" />
      </div>
    </div>
  );
}

// Main page component
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
