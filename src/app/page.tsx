import {
  Navbar,
  HeroSection,
  KabinetSection,
  DivisiSection,
  LegalitasSection,
  EventSection,
  Footer,
} from "@/components/landing";
import { MarqueeTicker } from "@/components/landing/MarqueeTicker";
import {
  fetchPengurusFromDB,
  fetchEventsFromDB,
  fetchDivisiFromDB,
  fetchAnggotaDivisiFromDB,
  fetchVisiMisiFromDB,
  fetchHeroContentFromDB,
} from "@/lib/supabaseData";

// Revalidate homepage every 60s + On-demand revalidation via revalidatePath("/") in Admin Actions
export const revalidate = 60;

/**
 * Halaman Utama — Portal Landing Page HIMASI UG
 * Murni Server Component (RSC).
 * Data di-fetch dari Supabase secara paralel di server (no-store) dan dialirkan via props.
 */
export default async function HomePage() {
  const [pengurus, events, divisiData, anggotaDivisi, visiMisi, heroContent] =
    await Promise.all([
      fetchPengurusFromDB(),
      fetchEventsFromDB(),
      fetchDivisiFromDB(),
      fetchAnggotaDivisiFromDB(),
      fetchVisiMisiFromDB(),
      fetchHeroContentFromDB(),
    ]);

  return (
    <>
      {/* Sticky top navbar */}
      <Navbar />

      <main id="main-content">
        {/* 1. Hero & Live Text */}
        <HeroSection heroContent={heroContent} />

        {/* 1.5 EXODA Signature Marquee Ticker */}
        <MarqueeTicker />

        {/* 2. Pimpinan Kabinet BPH */}
        <KabinetSection pengurus={pengurus} visiMisi={visiMisi} />

        {/* 3. Overview Divisi */}
        <DivisiSection divisiData={divisiData} anggotaDivisi={anggotaDivisi} />

        {/* 3.5 Surat Legalitas Himpunan */}
        <LegalitasSection visiMisi={visiMisi} />

        {/* 4. Upcoming Events & Proker */}
        <EventSection events={events} />
      </main>

      {/* 5. Footer */}
      <Footer />
    </>
  );
}
