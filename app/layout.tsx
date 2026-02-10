import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AstroGuide Pro — Vedic Astrology SaaS",
  description: "Professional Vedic Astrology tools: Birth Chart Calculator, Muhurta Finder, Jyotish AI Assistant. Accurate Swiss Ephemeris calculations. Free tier available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white`}
      >
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-amber-900/20">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center text-slate-950 font-bold text-sm">AG</div>
              <span className="font-semibold text-lg text-amber-100">AstroGuide <span className="text-amber-400">Pro</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-7 text-sm">
              <Link href="/birth-chart" className="text-slate-300 hover:text-amber-300 transition">Birth Chart</Link>
              <Link href="/muhurta" className="text-slate-300 hover:text-amber-300 transition">Muhurta</Link>
              <Link href="/jyotish-ai" className="text-slate-300 hover:text-amber-300 transition">Jyotish AI</Link>
              <Link href="/#pricing" className="text-slate-300 hover:text-amber-300 transition">Pricing</Link>
              <Link href="/#contact" className="bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 px-5 py-2 rounded-full hover:from-amber-400 hover:to-orange-500 transition font-semibold text-sm">Start Free</Link>
            </div>
          </div>
        </nav>
        <main className="pt-16">
          {children}
        </main>
        <footer className="py-10 px-6 border-t border-amber-900/20 mt-20">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center text-slate-950 font-bold text-[10px]">AG</div>
              <span className="font-medium text-amber-100 text-sm">AstroGuide Pro</span>
              <span className="text-slate-500 text-xs ml-2">by NKJ Development</span>
            </div>
            <div className="flex items-center gap-5 text-xs text-slate-500">
              <Link href="/birth-chart" className="hover:text-amber-300 transition">Birth Chart</Link>
              <Link href="/muhurta" className="hover:text-amber-300 transition">Muhurta</Link>
              <Link href="/jyotish-ai" className="hover:text-amber-300 transition">Jyotish AI</Link>
              <a href="https://github.com/qaaph-zyld" target="_blank" className="hover:text-amber-300 transition">GitHub</a>
              <span>&copy; 2026</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
