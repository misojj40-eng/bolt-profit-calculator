import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const geist = localFont({
  src: "./fonts/Geist.ttf",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});

const notoThai = localFont({
  src: "./fonts/NotoSansThai.ttf",
  variable: "--font-thai",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  applicationName: "Bolt Profit",
  title: "Bolt Driver Profit Calculator — Your true net profit",
  description:
    "Go beyond gross earnings. Calculate your real take-home profit per hour and per kilometre after fuel, depreciation, maintenance, tyres, insurance, tax and more.",
  keywords: ["Bolt", "driver", "profit", "earnings", "rideshare", "calculator", "EV", "fintech"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bolt Profit",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${notoThai.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
