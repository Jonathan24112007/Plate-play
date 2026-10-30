import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/common/AuthProvider";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#8C1538",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "PlatePlay · Cook · Create · Connect | Interactive Cooking Experiences",
  description:
    "PlatePlay is an interactive social cooking experience. Reserve a private kitchen with your group, cook something amazing together, and make unforgettable memories.",
  keywords: [
    "PlatePlay",
    "interactive cooking",
    "private kitchen experience",
    "social cooking studio",
    "group activities",
    "cook create connect",
    "experiential dining",
  ],
  authors: [{ name: "PlatePlay" }],
  openGraph: {
    title: "PlatePlay · Don't Just Eat It. Make It.",
    description:
      "Your people. Your kitchen. Your creation. Reserve a private kitchen, cook something incredible, and turn ordinary outings into stories worth sharing.",
    url: "https://plateplay.com",
    siteName: "PlatePlay",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Friends cooking together at PlatePlay",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlatePlay · Cook · Create · Connect",
    description: "Your people. Your kitchen. Your creation. Book a private kitchen experience.",
    images: ["https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-cream text-charcoal selection:bg-burgundy selection:text-cream">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
