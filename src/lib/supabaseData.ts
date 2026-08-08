/**
 * supabaseData.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single Source of Truth — Server-side Supabase data access layer.
 * Gunakan fungsi ini di Server Components (halaman publik), Server Actions, & Admin setters.
 *
 * Semua fetch memakai cache: 'no-store' untuk memastikan data selalu fresh
 * dari database di setiap request (zero Vercel Edge Cache stale data).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  type PengurusItem,
  type EventAdminItem,
  type MerchandiseAdminItem,
  type DivisiAdminItem,
  type VisiMisiData,
  type AnggotaDivisiItem,
  type HeroContentData,
  type AspirasiAdminItem,
  INITIAL_PENGURUS,
  INITIAL_EVENTS,
  INITIAL_MERCHANDISE,
  INITIAL_DIVISI_FULL,
  INITIAL_VISI_MISI,
  INITIAL_ANGGOTA_DIVISI,
  INITIAL_HERO_CONTENT,
  INITIAL_ASPIRASI,
} from "@/data/adminMockData";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://avkfevavjdgcbfleqxmn.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2a2ZldmF2amRnY2JmbGVxeG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDY0MjksImV4cCI6MjEwMDgyMjQyOX0.Ds5dLTviUjvQOfaeDK3zur3K0zl5i_Qjd-Dsp7KT79g";

const COMMON_HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
};

const FETCH_NO_STORE: RequestInit = {
  cache: "no-store",
  headers: COMMON_HEADERS,
};

// ─── SETTINGS JSON KEYS ───────────────────────────────────────────────────────
const SETTINGS_KEYS = {
  MERCHANDISE: "cms_merchandise_data",
  HERO_CONTENT: "cms_hero_content",
  VISI_MISI: "cms_visi_misi",
  DIVISI_DATA: "cms_divisi_data",
  ANGGOTA_DIVISI: "cms_anggota_divisi",
} as const;

// ─── GENERIC SETTINGS JSON HELPERS ───────────────────────────────────────────

/**
 * Fetch a JSON blob from the `settings` table by key.
 * Falls back to `fallback` if key not found or on error.
 */
export async function fetchSettingJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/settings?select=value&key=eq.${encodeURIComponent(key)}`;
    const res = await fetch(url, FETCH_NO_STORE);
    if (!res.ok) return fallback;
    const rows: { value: unknown }[] = await res.json();
    if (!rows || rows.length === 0) return fallback;
    return rows[0].value as T;
  } catch (err) {
    console.warn(`[supabaseData] fetchSettingJSON(${key}) error:`, err);
    return fallback;
  }
}

/**
 * Upsert a JSON blob into the `settings` table.
 */
export async function upsertSettingJSON<T>(key: string, data: T): Promise<void> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/settings`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...COMMON_HEADERS,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        key,
        value: data,
        updatedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.warn(`[supabaseData] upsertSettingJSON(${key}) failed:`, text);
    }
  } catch (err) {
    console.warn(`[supabaseData] upsertSettingJSON(${key}) error:`, err);
  }
}

// ─── PENGURUS ─────────────────────────────────────────────────────────────────

/**
 * Fetch all BPH pengurus from Supabase `Pengurus` table.
 *
 * BUG FIX: Menghapus filter `divisi=eq.BPH` dari query URL karena
 * kolom `divisi` menggunakan PostgreSQL enum (Divisi1) yang case-sensitive.
 * Filter dilakukan di sisi aplikasi setelah fetch agar tidak bergantung
 * pada nilai enum yang tepat di database.
 */
export async function fetchPengurusFromDB(): Promise<PengurusItem[]> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/Pengurus?order=urutan.asc,createdAt.asc&select=id,nama,jabatan,divisi,periode,fotoUrl,linkedin,instagram`;
    const res = await fetch(url, FETCH_NO_STORE);
    if (!res.ok) {
      const errText = await res.text().catch(() => res.status.toString());
      console.warn("[supabaseData] fetchPengurusFromDB failed:", res.status, errText);
      return INITIAL_PENGURUS;
    }
    const rows: Array<{
      id: string;
      nama: string;
      jabatan: string;
      divisi: string;
      periode: string;
      fotoUrl?: string | null;
      linkedin?: string | null;
      instagram?: string | null;
    }> = await res.json();

    const bphRows = rows.filter(
      (row) => row.divisi?.toLowerCase() === "bph"
    );

    return bphRows.map((row) => ({
      id: row.id,
      nama: row.nama,
      jabatan: row.jabatan,
      divisi: "BPH", // Normalize to strict upper-case "BPH"
      periode: row.periode ?? "2025/2026",
      fotoUrl: row.fotoUrl ?? "",
      linkedin: row.linkedin ?? "",
      instagram: row.instagram ?? "",
    }));
  } catch (err) {
    console.warn("[supabaseData] fetchPengurusFromDB error:", err);
    return INITIAL_PENGURUS;
  }
}

/**
 * Bulk-replace all BPH pengurus in Supabase `Pengurus` table.
 *
 * BUG FIX:
 * - DELETE query menggunakan filter `divisi=eq.BPH` — jika enum Supabase
 *   tidak exact match, baris lama tidak terhapus dan data menumpuk.
 *   Solusi: gunakan `ilike` (case-insensitive) atau upsert dengan id.
 * - Sekarang menggunakan upsert (ON CONFLICT DO UPDATE) daripada delete+insert
 *   untuk menghindari race condition dan data loss.
 * - Throw jika insert gagal, bukan hanya console.warn
 */
export async function syncPengurusToDB(data: PengurusItem[]): Promise<void> {
  try {
    // Step 1: Get existing BPH ids dari database (fetch id & divisi, filter in JS agar aman untuk PostgreSQL Enum)
    const fetchExistingUrl = `${SUPABASE_URL}/rest/v1/Pengurus?select=id,divisi`;
    const existingRes = await fetch(fetchExistingUrl, FETCH_NO_STORE);
    const existingRows: { id: string; divisi?: string | null }[] = existingRes.ok
      ? await existingRes.json()
      : [];
    const existingIds: string[] = existingRows
      .filter((r) => r.divisi && r.divisi.toLowerCase() === "bph")
      .map((r) => r.id);

    // Step 2: Build the new id set dari data yang akan di-save
    const newIds = data.map((p) => p.id);

    // Step 3: Hapus rows yang tidak ada di data baru (sudah dihapus admin)
    const idsToDelete = existingIds.filter((id) => !newIds.includes(id));
    if (idsToDelete.length > 0) {
      await fetch(
        `${SUPABASE_URL}/rest/v1/Pengurus?id=in.(${idsToDelete.map((id) => `"${id}"`).join(",")})`,
        { method: "DELETE", headers: COMMON_HEADERS }
      );
    }

    if (data.length === 0) return;

    // Step 4: Upsert (insert + update on conflict) untuk semua data
    const rows = data.map((p, idx) => ({
      id: p.id,
      nama: p.nama,
      jabatan: p.jabatan,
      divisi: "BPH",
      periode: p.periode ?? "2025/2026",
      fotoUrl: p.fotoUrl ?? null,
      linkedin: p.linkedin ?? null,
      instagram: p.instagram ?? null,
      urutan: idx,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Pengurus`, {
      method: "POST",
      headers: {
        ...COMMON_HEADERS,
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(rows),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[supabaseData] syncPengurusToDB upsert failed:", res.status, errText);
      // Throw agar UI admin bisa menampilkan error nyata (bukan silent fail)
      throw new Error(`Gagal menyimpan ke Supabase: ${res.status} — ${errText}`);
    }
  } catch (err) {
    console.error("[supabaseData] syncPengurusToDB error:", err);
    throw err; // Re-throw agar AdminPengurusClient bisa menangkap dan tampilkan alert
  }
}

// ─── EVENT ────────────────────────────────────────────────────────────────────

const EVENT_STATUS_MAP: Record<string, EventAdminItem["status"]> = {
  PENDAFTARAN_DIBUKA: "Pendaftaran Dibuka",
  SEGERA_HADIR: "Segera Hadir",
  BERLANGSUNG: "Berlangsung",
  SELESAI: "Selesai",
};

const EVENT_STATUS_REVERSE: Record<string, string> = {
  "Pendaftaran Dibuka": "PENDAFTARAN_DIBUKA",
  "Segera Hadir": "SEGERA_HADIR",
  Berlangsung: "BERLANGSUNG",
  Selesai: "SELESAI",
};

/**
 * Fetch all events from Supabase `Event` table.
 */
export async function fetchEventsFromDB(): Promise<EventAdminItem[]> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/Event?order=createdAt.desc&select=id,title,kategori,tanggal,waktu,lokasi,isOnline,status,deskripsi,bannerUrl,linkPendaftaran`;
    const res = await fetch(url, FETCH_NO_STORE);
    if (!res.ok) {
      console.warn("[supabaseData] fetchEventsFromDB failed:", res.status);
      return INITIAL_EVENTS;
    }
    const rows: Array<{
      id: string;
      title: string;
      kategori: string;
      tanggal: string;
      waktu: string;
      lokasi: string;
      isOnline: boolean;
      status: string;
      deskripsi: string;
      bannerUrl?: string | null;
      linkPendaftaran?: string | null;
    }> = await res.json();

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      kategori: row.kategori,
      tanggal: row.tanggal,
      waktu: row.waktu,
      lokasi: row.lokasi,
      isOnline: row.isOnline,
      status: EVENT_STATUS_MAP[row.status] ?? "Pendaftaran Dibuka",
      deskripsi: row.deskripsi,
      bannerUrl: row.bannerUrl ?? "",
      linkPendaftaran: row.linkPendaftaran ?? "",
    }));
  } catch (err) {
    console.warn("[supabaseData] fetchEventsFromDB error:", err);
    return INITIAL_EVENTS;
  }
}

/**
 * Bulk-replace all events in Supabase `Event` table.
 */
export async function syncEventsToDB(data: EventAdminItem[]): Promise<void> {
  try {
    // Step 1: Delete existing events
    await fetch(`${SUPABASE_URL}/rest/v1/Event?id=not.is.null`, {
      method: "DELETE",
      headers: COMMON_HEADERS,
    });

    if (data.length === 0) return;

    // Step 2: Insert new list
    const rows = data.map((e) => ({
      id: e.id,
      title: e.title,
      kategori: e.kategori,
      tanggal: e.tanggal,
      waktu: e.waktu,
      lokasi: e.lokasi,
      isOnline: e.isOnline,
      status: EVENT_STATUS_REVERSE[e.status] ?? "PENDAFTARAN_DIBUKA",
      deskripsi: e.deskripsi,
      bannerUrl: e.bannerUrl ?? null,
      linkPendaftaran: e.linkPendaftaran ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Event`, {
      method: "POST",
      headers: {
        ...COMMON_HEADERS,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(rows),
    });
    if (!res.ok) {
      const text = await res.text();
      console.warn("[supabaseData] syncEventsToDB insert failed:", text);
    }
  } catch (err) {
    console.warn("[supabaseData] syncEventsToDB error:", err);
  }
}

// ─── ASPIRASI ─────────────────────────────────────────────────────────────────

export async function fetchAspirasiFromDB(): Promise<AspirasiAdminItem[]> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/Aspirasi?order=createdAt.desc&select=id,pesan,isAnonim,nama,email,status,createdAt`;
    const res = await fetch(url, FETCH_NO_STORE);
    if (!res.ok) return INITIAL_ASPIRASI;
    const rows: Array<{
      id: string;
      pesan: string;
      isAnonim: boolean;
      nama?: string | null;
      email?: string | null;
      status: string;
      createdAt: string;
    }> = await res.json();

    return rows.map((row) => ({
      id: row.id,
      pesan: row.pesan,
      isAnonim: row.isAnonim,
      nama: row.nama ?? undefined,
      email: row.email ?? undefined,
      tanggal: row.createdAt ? row.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
      status: (row.status === "BARU"
        ? "Baru"
        : row.status === "DIPROSES"
          ? "Diproses"
          : "Selesai") as AspirasiAdminItem["status"],
    }));
  } catch (err) {
    console.warn("[supabaseData] fetchAspirasiFromDB error:", err);
    return INITIAL_ASPIRASI;
  }
}

export async function insertAspirasiToDB(item: AspirasiAdminItem): Promise<boolean> {
  try {
    const row = {
      id: item.id || `asp_${Date.now()}`,
      pesan: item.pesan,
      isAnonim: item.isAnonim,
      nama: item.isAnonim ? null : item.nama ?? null,
      email: item.email ?? null,
      status: "BARU",
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Aspirasi`, {
      method: "POST",
      headers: {
        ...COMMON_HEADERS,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[supabaseData] insertAspirasiToDB failed:", res.status, errText);
      return false;
    }

    return true;
  } catch (err) {
    console.warn("[supabaseData] insertAspirasiToDB error:", err);
    return false;
  }
}

export async function updateAspirasiStatusInDB(
  id: string,
  status: "Baru" | "Diproses" | "Selesai"
): Promise<boolean> {
  try {
    const statusMap: Record<string, string> = {
      Baru: "BARU",
      Diproses: "DIPROSES",
      Selesai: "SELESAI",
    };
    const dbStatus = statusMap[status] ?? "BARU";

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Aspirasi?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        ...COMMON_HEADERS,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ status: dbStatus }),
    });

    return res.ok;
  } catch (err) {
    console.warn("[supabaseData] updateAspirasiStatusInDB error:", err);
    return false;
  }
}

export async function deleteAspirasiFromDB(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Aspirasi?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: COMMON_HEADERS,
    });

    return res.ok;
  } catch (err) {
    console.warn("[supabaseData] deleteAspirasiFromDB error:", err);
    return false;
  }
}

// ─── MERCHANDISE ──────────────────────────────────────────────────────────────

export async function fetchMerchandiseFromDB(): Promise<MerchandiseAdminItem[]> {
  return fetchSettingJSON<MerchandiseAdminItem[]>(SETTINGS_KEYS.MERCHANDISE, INITIAL_MERCHANDISE);
}

export async function syncMerchandiseToDB(data: MerchandiseAdminItem[]): Promise<void> {
  return upsertSettingJSON(SETTINGS_KEYS.MERCHANDISE, data);
}

// ─── HERO CONTENT ─────────────────────────────────────────────────────────────

export async function fetchHeroContentFromDB(): Promise<HeroContentData> {
  return fetchSettingJSON<HeroContentData>(SETTINGS_KEYS.HERO_CONTENT, INITIAL_HERO_CONTENT);
}

export async function syncHeroContentToDB(data: HeroContentData): Promise<void> {
  return upsertSettingJSON(SETTINGS_KEYS.HERO_CONTENT, data);
}

// ─── VISI MISI ────────────────────────────────────────────────────────────────

export async function fetchVisiMisiFromDB(): Promise<VisiMisiData> {
  return fetchSettingJSON<VisiMisiData>(SETTINGS_KEYS.VISI_MISI, INITIAL_VISI_MISI);
}

export async function syncVisiMisiToDB(data: VisiMisiData): Promise<void> {
  return upsertSettingJSON(SETTINGS_KEYS.VISI_MISI, data);
}

// ─── DIVISI DATA ──────────────────────────────────────────────────────────────

export async function fetchDivisiFromDB(): Promise<DivisiAdminItem[]> {
  return fetchSettingJSON<DivisiAdminItem[]>(SETTINGS_KEYS.DIVISI_DATA, INITIAL_DIVISI_FULL);
}

export async function syncDivisiToDB(data: DivisiAdminItem[]): Promise<void> {
  return upsertSettingJSON(SETTINGS_KEYS.DIVISI_DATA, data);
}

// ─── ANGGOTA DIVISI ───────────────────────────────────────────────────────────

export async function fetchAnggotaDivisiFromDB(): Promise<AnggotaDivisiItem[]> {
  return fetchSettingJSON<AnggotaDivisiItem[]>(SETTINGS_KEYS.ANGGOTA_DIVISI, INITIAL_ANGGOTA_DIVISI);
}

export async function syncAnggotaDivisiToDB(data: AnggotaDivisiItem[]): Promise<void> {
  return upsertSettingJSON(SETTINGS_KEYS.ANGGOTA_DIVISI, data);
}