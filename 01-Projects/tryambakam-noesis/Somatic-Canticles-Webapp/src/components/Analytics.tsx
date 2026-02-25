import { GoogleAnalytics } from "@next/third-parties/google";

export function Analytics() {
  // Only render GA in production and if measurement ID is provided
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const isProduction = process.env.NODE_ENV === "production";
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";

  if (!gaId || !isProduction || !isEnabled) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}
