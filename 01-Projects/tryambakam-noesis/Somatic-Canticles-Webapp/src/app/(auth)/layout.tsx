"use client";

import { AuthLayout } from "@/components/layout/auth-layout";
import { ToastProvider } from "@/components/ui/toast";

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider position="top-right">
      <AuthLayout>{children}</AuthLayout>
    </ToastProvider>
  );
}
