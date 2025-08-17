import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth";
import { TRPCReactProvider } from "@/trpc/client";
import { ThemeProvider } from "next-themes";
import { AuthSessionProvider } from "@/components/session-provider";
import { authOptions } from "@/server/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DayStack - Daily Habits & Metrics Tracker",
  description: "Track your daily habits and metrics with beautiful visualizations",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider session={session}>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </TRPCReactProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
