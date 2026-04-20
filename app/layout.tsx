import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/components/auth-context";
import { Toaster } from "sonner";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vibe & Meet | Find the vibe. Meet your people.",
  description: "Discover places, join meetups, and make real connections offline without the pressure.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Vibe & Meet | Offline Social Discovery",
    description: "Discover places, join meetups, and make real connections offline.",
    type: "website",
    url: "https://vibeandmeet.com", // Placeholder
    siteName: "Vibe & Meet",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
