import type { Metadata, Viewport } from "next";
import { Golos_Text, Oswald } from "next/font/google";
import "./globals.css";
import { site, siteUrl } from "@/lib/site";

/**
 * subsets обязателен: без явной кириллицы браузер тянет латиницу и кириллицу
 * отдельными файлами. display: swap — текст виден, пока шрифт грузится.
 */
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["cyrillic", "latin"],
  weight: ["600", "700"],
  display: "swap",
});

const golos = Golos_Text({
  variable: "--font-golos",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — барбершоп в Санкт-Петербурге`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: site.name,
    title: `${site.name} — ${site.slogan}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.slogan}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0F0E0D",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${oswald.variable} ${golos.variable}`}>
      <body className="bg-coal text-chalk min-h-svh antialiased">{children}</body>
    </html>
  );
}
