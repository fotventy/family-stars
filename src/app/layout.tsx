import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
// Ads disabled for now — re-enable when ready
// import AdBanner from "@/components/AdBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Family Stars — Kids Achievement Tracker",
  description: "Motivate kids through gamification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
            {/* <AdBanner position="bottom" className="ad-banner-slot" /> */}
          </div>
        </Providers>
      </body>
    </html>
  );
}
