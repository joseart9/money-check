import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { ServiceWorkerProvider } from "./sw-provider";
import { QueryProvider } from "./query-provider";
import { Toaster } from "sileo";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Money Check",
  description: "Track your money on mobile.",
  appleWebApp: {
    capable: true,
    title: "Money Check",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#020817",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("h-dvh", "font-sans", figtree.variable)} content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-dvh overflow-hidden`}
      >
        <QueryProvider>
          <ServiceWorkerProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
          <Toaster position="top-center" theme="dark" />
            {children}
            </ThemeProvider>
            </ServiceWorkerProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
