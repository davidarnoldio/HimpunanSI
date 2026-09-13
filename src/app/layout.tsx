import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScrolling } from "@/components/providers/SmoothScrolling";
import { SplashScreen } from "@/components/ui/SplashScreen";

const inconsolata = Inconsolata({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inconsolata",
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
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/himsigundar.webp", type: "image/webp" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
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
      className={`${inconsolata.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" as="image" href="/hero-editorial-mobile.webp" type="image/webp" media="(max-width: 640px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/hero-editorial.webp" type="image/webp" media="(min-width: 641px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/himsigundar.webp" type="image/webp" />
        <link rel="preload" as="image" href="/logogundar.webp" type="image/webp" />
      </head>
      <body
        suppressHydrationWarning
        className={`${inconsolata.className} min-h-full bg-slate-50 dark:bg-[#0a0e1f] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SplashScreen />
          <SmoothScrolling>{children}</SmoothScrolling>
        </ThemeProvider>
      </body>
    </html>
  );
}
