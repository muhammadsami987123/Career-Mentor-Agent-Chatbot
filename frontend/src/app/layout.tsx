import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Career Mentor Agent - AI-Powered Career Guidance",
  description: "Get personalized career guidance from our AI agents. Explore career paths, build skills, and find job opportunities that match your aspirations.",
  keywords: ["career guidance", "AI mentor", "job opportunities", "skill development", "career exploration"],
  authors: [{ name: "Career Mentor Agent" }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="antialiased bg-gray-50">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
