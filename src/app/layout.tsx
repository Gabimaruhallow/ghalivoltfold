import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "VoltFold Electric Scooter — Fold. Charge. Glide.",
  description: "A premium folding electric scooter with up to 60 km range and 25 km/h speed. Pay with PayPal. $799.",
  keywords: ["VoltFold", "electric scooter", "folding scooter", "electric mobility", "city commute", "PayPal", "premium scooter"],
  authors: [{ name: "VoltFold" }],
  openGraph: {
    title: "VoltFold Electric Scooter — Fold. Charge. Glide.",
    description: "A premium folding electric scooter with up to 60 km range and 25 km/h speed. Pay with PayPal. $799.",
    url: "https://voltfold.com",
    siteName: "VoltFold",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VoltFold Electric Scooter — Fold. Charge. Glide.",
    description: "A premium folding electric scooter with up to 60 km range and 25 km/h speed. Pay with PayPal. $799.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
