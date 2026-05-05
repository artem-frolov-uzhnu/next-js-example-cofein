// Root Layout — Server Component
// Тиждень 4: обгорнуто FavoritesProvider (Client) навколо children (Server)
// Тиждень 8: додано AuthProvider (SessionProvider) для NextAuth.js
// Тиждень 12: додано <Toaster /> для toast-нотифікацій (sonner)
// Тиждень 13: розширено metadata для production (metadataBase, OpenGraph, twitter)

import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import AuthProvider from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// metadataBase треба, щоб Next.js міг будувати абсолютні URL для openGraph/twitter.
// У production підставиться `NEXT_PUBLIC_SITE_URL` (виставлений у Vercel),
// у dev — http://localhost:3000.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Кав'ярня «Кофеїн»",
    template: "%s | Кофеїн",
  },
  description: "Найкраща кава у місті. Затишна атмосфера та бездоганний сервіс.",
  keywords: ["кав'ярня", "кава", "Кофеїн", "латте", "капучино", "еспресо"],
  authors: [{ name: "Кав'ярня «Кофеїн»" }],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "/",
    siteName: "Кофеїн",
    title: "Кав'ярня «Кофеїн»",
    description: "Найкраща кава у місті. Затишна атмосфера та бездоганний сервіс.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Кав'ярня «Кофеїн»",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Кав'ярня «Кофеїн»",
    description: "Найкраща кава у місті.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <FavoritesProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </FavoritesProvider>
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
