import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScrolling } from "@/components/providers/SmoothScrolling";
import { SplashScreen } from "@/components/ui/SplashScreen";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "HIMASI UG — Himpunan Mahasiswa Sistem Informasi Universitas Gunadarma",
  description:
    "Website resmi HIMASI UG. Temukan merchandise JAHIM, info kepanitiaan, aspirasi mahasiswa, dan program kerja Himpunan Mahasiswa Sistem Informasi Universitas Gunadarma.",
  keywords: [
    "HIMASI UG",
    "Himpunan Mahasiswa Sistem Informasi",
    "Universitas Gunadarma",
    "JAHIM",
    "merchandise HIMASI",
    "Bank Soal HIMASI",
  ],
  openGraph: {
    title: "HIMASI UG — Official Website",
    description: "Merchandise, kepengurusan, dan aspirasi HIMASI Universitas Gunadarma",
    type: "website",
    siteName: "HIMASI UG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" as="image" href="/hero-editorial.webp" type="image/webp" fetchPriority="high" />
        <link rel="preload" as="image" href="/himsigundar.webp" type="image/webp" />
        <link rel="preload" as="image" href="/logogundar.webp" type="image/webp" />
      </head>
      <body
        suppressHydrationWarning
        className={`${plusJakarta.className} min-h-full bg-slate-50 dark:bg-[#0a0e1f] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SplashScreen />
          <SmoothScrolling>{children}</SmoothScrolling>
        </ThemeProvider>
      </body>
    </html>
  );
}
