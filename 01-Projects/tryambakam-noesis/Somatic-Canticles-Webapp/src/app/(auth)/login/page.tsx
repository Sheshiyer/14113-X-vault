"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";

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

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        addToast({
          type: "error",
          title: "Login failed",
          message: result.error === "CredentialsSignin" 
            ? "Invalid email or password. Please try again." 
            : result.error,
          duration: 8000,
        });
      } else if (result?.ok) {
        addToast({
          type: "success",
          title: "Welcome back!",
          message: "You've successfully signed in.",
          duration: 5000,
        });
        router.push("/dashboard");
        router.refresh();
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
    await signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="w-full space-y-[21px]">
      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-[21px]">
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
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-[8px] cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                disabled={isLoading}
                className="sr-only peer"
              />
              <div className={cn(
                "w-[19px] h-[19px] rounded-[4px] border-2 transition-all duration-8",
                "border-slate-300 peer-checked:bg-octave peer-checked:border-octave",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-octave/50"
              )}>
                <svg 
                  className={cn(
                    "w-[15px] h-[15px] text-white transition-all duration-8",
                    formData.rememberMe ? "opacity-100" : "opacity-0"
                  )}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <span className="text-[14px] text-text-muted group-hover:text-text transition-colors duration-8">
              Remember me
            </span>
          </label>

          <Link
            href="/forgot-password"
            className="text-[14px] text-octave hover:text-octave-light transition-colors duration-8"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Sign in
        </Button>
      </form>

      {/* OAuth Section */}
      <Separator text="Or continue with" />

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

      {/* Sign up link */}
      <p className="text-center text-[14px] text-text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-octave hover:text-octave-light font-medium transition-colors duration-8"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
