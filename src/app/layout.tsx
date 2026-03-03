import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f97316" },
    { media: "(prefers-color-scheme: dark)", color: "#f97316" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Charcoal Station Business Manager",
    template: "%s | Charcoal Station",
  },
  description: "Business management app for charcoal stations with sales tracking, expense management, and profit splitting features. Track your charcoal business sales, expenses, and partner profit distributions easily.",
  keywords: ["charcoal", "business", "sales", "expenses", "profit", "management", "tracking", "partner split"],
  authors: [{ name: "Charcoal Station" }],
  creator: "Charcoal Station",
  publisher: "Charcoal Station",
  applicationName: "Charcoal Station Business Manager",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    title: "Charcoal Station",
    startupImage: [
      { url: "/icon-512.png", sizes: "512x512" },
    ],
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    date: true,
    address: true,
    email: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://charcoal-station.app",
    siteName: "Charcoal Station Business Manager",
    title: "Charcoal Station Business Manager",
    description: "Business management app for charcoal stations with sales tracking, expense management, and profit splitting features.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Charcoal Station Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Charcoal Station Business Manager",
    description: "Business management app for charcoal stations with sales tracking, expense management, and profit splitting features.",
    images: ["/icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Charcoal Station" />
        <meta name="application-name" content="Charcoal Station" />
        <meta name="msapplication-TileColor" content="#f97316" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
