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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://himsigundar.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HIMASI UG — Himpunan Mahasiswa Sistem Informasi Universitas Gunadarma",
    template: "%s | HIMASI UG",
  },
  description:
    "Website resmi HIMASI UG. Informasi kabinet, event & proker, katalog merchandise resmi JAHIM, aspirasi mahasiswa, serta kegiatan Himpunan Mahasiswa Sistem Informasi Universitas Gunadarma.",
  keywords: [
    "HIMASI UG",
    "Himpunan Mahasiswa Sistem Informasi",
    "Universitas Gunadarma",
    "JAHIM Gunadarma",
    "Merchandise HIMASI",
    "Aspirasi Mahasiswa Gunadarma",
    "Proker HIMASI",
    "Kabinet Formasi",
  ],
  authors: [{ name: "HIMASI UG", url: SITE_URL }],
  creator: "HIMASI UG",
  publisher: "HIMASI UG",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
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
    description:
      "Website resmi HIMASI UG. Informasi kabinet, event & proker, merchandise JAHIM, serta layanan aspirasi mahasiswa.",
    url: SITE_URL,
    siteName: "HIMASI UG",
    images: [
      {
        url: "/hero-editorial.webp",
        width: 1200,
        height: 630,
        alt: "HIMASI UG — Himpunan Mahasiswa Sistem Informasi Gunadarma",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HIMASI UG — Official Website",
    description:
      "Informasi kabinet, event & proker, merchandise JAHIM, serta layanan aspirasi mahasiswa Sistem Informasi Gunadarma.",
    images: ["/hero-editorial.webp"],
    creator: "@himasi_gunadarma",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "HIMASI UG",
  alternateName: "Himpunan Mahasiswa Sistem Informasi Universitas Gunadarma",
  url: SITE_URL,
  logo: `${SITE_URL}/himsigundar.webp`,
  image: `${SITE_URL}/hero-editorial.webp`,
  description: "Website resmi Himpunan Mahasiswa Sistem Informasi (HIMASI) Universitas Gunadarma.",
  sameAs: [
    "https://instagram.com/himasi_gunadarma",
    "https://linkedin.com",
    "https://youtube.com",
    "https://tiktok.com",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Sekretariat HIMASI UG, Kampus E Universitas Gunadarma, Jl. Akses UI No.9, Kelapa Dua",
    addressLocality: "Depok",
    addressRegion: "Jawa Barat",
    postalCode: "16951",
    addressCountry: "ID",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
