"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Global error boundary component
 * Catches errors in the app and displays a user-friendly error page
 */
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  React.useEffect(() => {
    // Log error to monitoring service (Sentry)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* Error icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-8 rounded-full bg-life/10 flex items-center justify-center"
        >
          <AlertTriangle className="w-10 h-10 text-life" />
        </motion.div>

        {/* Error title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">
          Something Went Wrong
        </h1>

        {/* Error description */}
        <p className="text-text-muted mb-8 leading-relaxed">
          We apologize for the disruption. An unexpected error has occurred in
          the application. Our team has been notified and is working to resolve
          the issue.
        </p>

        {/* Error details (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 p-4 rounded-lg bg-surface-elevated border border-white/5 text-left"
          >
            <p className="text-sm font-medium text-life mb-2">Error Details:</p>
            <p className="text-sm text-text-muted font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-text-muted/50 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={reset} className="group">
            <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </Button>

          <Link href="/">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>

        {/* Support link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-white/5"
        >
          <p className="text-sm text-text-muted mb-4">
            Still experiencing issues?
          </p>
          <a
            href="mailto:support@somaticcanticles.com"
            className="inline-flex items-center gap-2 text-sm text-octave hover:text-octave-light transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </a>
        </motion.div>

        {/* Power numbers decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex items-center justify-center gap-2 text-xs text-text-muted/30"
        >
          <span>8</span>
          <span>·</span>
          <span>13</span>
          <span>·</span>
          <span>19</span>
          <span>·</span>
          <span>21</span>
          <span>·</span>
          <span>44</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
