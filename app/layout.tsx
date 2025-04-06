import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinanceTrack - Your Budget Buddy",
  description: "Track your expenses and manage your budget efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider defaultTheme='dark' storageKey='budget-buddy-theme'>
            <SubscriptionProvider>{children}</SubscriptionProvider>
            <Toaster position='top-right' />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
