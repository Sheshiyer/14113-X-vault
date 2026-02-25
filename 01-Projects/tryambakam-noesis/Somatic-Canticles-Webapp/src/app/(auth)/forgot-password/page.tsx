"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export default function ForgotPasswordPage() {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Always show success to prevent email enumeration
      setIsSubmitted(true);

      if (response.ok) {
        addToast({
          type: "success",
          title: "Reset link sent",
          message: "Check your email for password reset instructions.",
          duration: 8000,
        });
      }
    } catch {
      // Still show success to prevent email enumeration
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
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
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            <path d="M12 11v6" />
            <path d="M8 11v6" />
            <path d="M16 11v6" />
          </svg>
        </div>

        <h2 className="text-[24px] font-bold text-text">Check Your Email</h2>
        <p className="text-text-muted leading-[1.618]">
          If an account exists for{" "}
          <span className="text-text font-medium">{email}</span>, we&apos;ve sent
          instructions to reset your password.
        </p>

        <div className="bg-surface-elevated/50 rounded-[13px] p-[21px] text-left space-y-[13px]">
          <p className="text-[14px] text-text-muted">
            Didn&apos;t receive the email?
          </p>
          <ul className="text-[14px] text-text-muted space-y-[8px]">
            <li className="flex items-start gap-[8px]">
              <span className="text-octave">•</span>
              <span>Check your spam or junk folder</span>
            </li>
            <li className="flex items-start gap-[8px]">
              <span className="text-octave">•</span>
              <span>Make sure you entered the correct email address</span>
            </li>
            <li className="flex items-start gap-[8px]">
              <span className="text-octave">•</span>
              <span>Wait a few minutes and try again</span>
            </li>
          </ul>
        </div>

        <div className="space-y-[13px]">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => setIsSubmitted(false)}
            className="w-full"
          >
            Try a different email
          </Button>
          <Link
            href="/login"
            className="inline-block text-octave hover:text-octave-light font-medium transition-colors duration-8"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

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
          Forgot Password?
        </h2>
        <p className="text-text-muted leading-[1.618]">
          Enter your email address and we&apos;ll send you instructions to reset
          your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-[21px]">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          disabled={isLoading}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          }
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Send reset instructions
        </Button>
      </form>

      <p className="text-center text-[14px] text-text-muted">
        Remember your password?{" "}
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
