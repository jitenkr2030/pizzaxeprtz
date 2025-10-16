import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth-provider";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BoGoPizza - Authentic Italian Pizza Delivery",
  description: "Order delicious authentic Italian pizzas online from BoGoPizza. Fresh ingredients, fast delivery, and amazing taste.",
  keywords: ["pizza", "delivery", "Italian food", "BoGoPizza", "online ordering", "food delivery"],
  authors: [{ name: "BoGoPizza Team" }],
  openGraph: {
    title: "BoGoPizza - Authentic Italian Pizza Delivery",
    description: "Order delicious authentic Italian pizzas online from BoGoPizza.",
    url: "https://bogopizza.com",
    siteName: "BoGoPizza",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BoGoPizza - Authentic Italian Pizza Delivery",
    description: "Order delicious authentic Italian pizzas online from BoGoPizza.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
