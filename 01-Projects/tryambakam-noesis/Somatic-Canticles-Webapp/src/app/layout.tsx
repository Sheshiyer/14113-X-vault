import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// TODO: Re-enable providers after CSS is verified
// import { AuthProvider } from "@/components/auth/AuthProvider";
// import { ToastProvider } from "@/components/ui/toast";
// import { AudioProvider } from "@/components/audio/audio-provider";
// import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Somatic Canticles | Biorhythm-Synced Somatic Practice",
    template: "%s | Somatic Canticles",
  },
  description:
    "A mystical journey through body and consciousness. Somatic Canticles uses your biorhythm cycles to unlock chapters of somatic practice, guiding you through 12 transformative canticles aligned with your body's natural rhythms.",
  keywords: [
    "somatic practice",
    "biorhythm",
    "meditation",
    "embodiment",
    "consciousness",
    "wellness",
    "mindfulness",
    "body awareness",
    "spiritual practice",
    "personal growth",
  ],
  authors: [{ name: "Somatic Canticles" }],
  creator: "Somatic Canticles",
  publisher: "Somatic Canticles",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://somaticcanticles.com",
    siteName: "Somatic Canticles",
    title: "Somatic Canticles | Biorhythm-Synced Somatic Practice",
    description:
      "Your body's rhythm unlocks chapters. A companion experience to the Somatic Canticles manuscript.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Somatic Canticles - Biorhythm-Synced Practice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Somatic Canticles | Biorhythm-Synced Somatic Practice",
    description:
      "Your body's rhythm unlocks chapters. A companion experience to the Somatic Canticles manuscript.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#FF6B6B",
      },
    ],
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://somaticcanticles.com"),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0F" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-surface text-text antialiased">
        {/* Minimal layout for CSS verification - providers temporarily disabled */}
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
          <footer className="w-full bg-surface-elevated/30 border-t border-surface-elevated/50 py-8 mt-auto">
            <div className="container mx-auto px-4 text-center text-sm text-text-muted">
              <p>Somatic Canticles • Biorhythm-Synced Practice</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
