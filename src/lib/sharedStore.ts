// Shared Data Store with Permanent LocalStorage Persistence and Real-time Event Bus
// Keeps Admin CMS & Public Pages in sync live

import { useState, useEffect, startTransition } from "react";
import {
  triggerRevalidateDivisi,
  triggerRevalidateMerchandise,
  triggerRevalidateEvent,
  triggerRevalidateBeranda,
  triggerRevalidateVisiMisi,
  triggerRevalidatePengurus,
  triggerRevalidateAspirasi,
} from "@/app/actions/revalidateActions";
import {
  syncPengurusToDB,
  syncEventsToDB,
  syncMerchandiseToDB,
  syncHeroContentToDB,
  syncVisiMisiToDB,
  syncDivisiToDB,
  syncAnggotaDivisiToDB,
  fetchPengurusFromDB,
  fetchEventsFromDB,
  fetchMerchandiseFromDB,
  fetchHeroContentFromDB,
  fetchVisiMisiFromDB,
  fetchDivisiFromDB,
  fetchAnggotaDivisiFromDB,
  fetchAspirasiFromDB,
} from "@/lib/supabaseData";
import {
  INITIAL_PENGURUS,
  INITIAL_EVENTS,
  INITIAL_ASPIRASI,
  INITIAL_MERCHANDISE,
  INITIAL_DIVISI_FULL,
  INITIAL_VISI_MISI,
  INITIAL_ANGGOTA_DIVISI,
  INITIAL_HEADLINE_WORDS,
  INITIAL_BADGE_WORDS,
  INITIAL_SUBHEADLINE_WORDS,
  INITIAL_HERO_CONTENT,
  type PengurusItem,
  type EventAdminItem,
  type AspirasiAdminItem,
  type MerchandiseAdminItem,
  type DivisiAdminItem,
  type VisiMisiData,
  type AnggotaDivisiItem,
  type HeroContentData,
} from "@/data/adminMockData";

const STORAGE_KEYS = {
  PENGURUS: "HIMASI_pengurus_data_v3",
  EVENTS: "HIMASI_events_data_v3",
  ASPIRASI: "HIMASI_aspirasi_data_v3",
  DIVISI: "HIMASI_divisi_list_v3",
  DIVISI_FULL: "HIMASI_divisi_full_data_v3",
  MERCHANDISE: "HIMASI_merchandise_data_v3",
  VISI_MISI: "HIMASI_visi_misi_v3",
  ANGGOTA_DIVISI: "HIMASI_anggota_divisi_v3",
  HEADLINE_WORDS: "HIMASI_headline_words_v3",
  BADGE_WORDS: "HIMASI_badge_words_v3",
  SUBHEADLINE_WORDS: "HIMASI_subheadline_words_v3",
  HERO_CONTENT: "HIMASI_hero_content_v3",
};

/**
 * Fix #6 – localStorage Cache Versioning
 * Increment this number every time a breaking schema change is deployed.
 * On mismatch, all stored keys are wiped and re-seeded from INITIAL data.
 */
const DATA_SCHEMA_VERSION = 8; // bumped: sanitize all legacy 2025/2026 periods to 2026/2027
const SCHEMA_VERSION_KEY = "HIMASI_data_schema_version";

/**
 * Runs once at startup. Detects stale localStorage data from a previous schema
 * version and safely wipes it so parsing errors never crash the app.
 */
function runStoreMigration(): void {
  if (typeof window === "undefined") return;
  try {
    const storedVersion = parseInt(localStorage.getItem(SCHEMA_VERSION_KEY) ?? "0", 10);
    if (storedVersion < DATA_SCHEMA_VERSION) {
      // Wipe all managed keys so stale data is replaced by fresh INITIAL defaults
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
      localStorage.setItem(SCHEMA_VERSION_KEY, String(DATA_SCHEMA_VERSION));
      console.info(
        `[HIMASI Store] Schema upgraded v${storedVersion}→v${DATA_SCHEMA_VERSION}. LocalStorage reset to defaults.`
      );
    }
  } catch (e) {
    console.warn("[HIMASI Store] Migration check failed:", e);
  }
}

const STORE_EVENT_NAME = "HIMASI_store_updated";

/**
 * Helper to ensure image URLs are valid non-empty strings
 */
export function getValidImageUrl(url?: string | null, fallbackText = "HIMASI"): string {
  if (!url || typeof url !== "string" || url.trim() === "") {
    const encodedText = encodeURIComponent(fallbackText);
    return `https://placehold.co/600x800/0f172a/dc2626?text=${encodedText}`;
  }
  return url.trim();
}

/**
 * Format WhatsApp Link seamlessly whether user inputs full URL (https://wa.me/...) or phone number
 */
export function formatWhatsAppUrl(input?: string | null, defaultMessage?: string): string {
  if (!input || typeof input !== "string" || input.trim() === "") {
    const msg = defaultMessage ? `?text=${encodeURIComponent(defaultMessage)}` : "";
    return `https://wa.me/6281234567890${msg}`;
  }
  const trimmed = input.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const cleaned = trimmed.replace(/[^0-9]/g, "");
  const msg = defaultMessage ? `?text=${encodeURIComponent(defaultMessage)}` : "";
  return `https://wa.me/${cleaned}${msg}`;
}

/**
 * Convert selected File from file input into Base64 string for persistent storage
 */
export function convertFileToBase64(file: File): Promise<string> {
  return compressAndConvertFileToBase64(file, 2);
}

/**
 * Rotates an image (Base64 data URL or HTTP URL) by specified degrees (default 90 deg clockwise)
 */
export function rotateBase64Image(imageUrl: string, degrees = 90): Promise<string> {
  return new Promise((resolve) => {
    if (!imageUrl || typeof imageUrl !== "string") return resolve(imageUrl);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(imageUrl);

      const normalizedDeg = ((degrees % 360) + 360) % 360;
      if (normalizedDeg === 90 || normalizedDeg === 270) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((normalizedDeg * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const rotatedBase64 = canvas.toDataURL("image/jpeg", 0.88);
      resolve(rotatedBase64);
    };
    img.onerror = () => resolve(imageUrl);
    img.src = imageUrl;
  });
}

/**
 * Convert selected File from device file picker into Base64 with canvas compression (Max 2 MB guarantee)
 */
export function compressAndConvertFileToBase64(file: File, maxMB = 2): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const maxBytes = maxMB * 1024 * 1024;

    if (file.size > maxBytes && !file.type.startsWith("image/")) {
      return reject(new Error(`Ukuran file melebihi batas maksimal ${maxMB} MB.`));
    }

    // Try createImageBitmap for automatic EXIF orientation normalization
    if (typeof createImageBitmap === "function") {
      try {
        let bitmap: ImageBitmap | null = null;
        try {
          bitmap = await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
        } catch {
          bitmap = await createImageBitmap(file);
        }

        if (bitmap) {
          const maxDim = 1200;
          let width = bitmap.width;
          let height = bitmap.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.drawImage(bitmap, 0, 0, width, height);
            bitmap.close();
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);
            return resolve(compressedBase64);
          }
          bitmap.close();
        }
      } catch (e) {
        console.warn("createImageBitmap failed, falling back to FileReader:", e);
      }
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const src = event.target?.result as string;
      if (!src) return reject(new Error("Gagal membaca file gambar dari perangkat."));

      const img = new Image();
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(src);

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);
        resolve(compressedBase64);
      };
      img.onerror = () => resolve(src);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Read item from LocalStorage with permanent persistence guarantee
 */
function getStoredData<T>(key: string, initialData: T): T {
  if (typeof window === "undefined") return initialData;
  try {
    const item = localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item);
    }
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return initialData;
  }
}

function setStoredDataSilent<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

/**
 * Save item to LocalStorage and notify all open tabs/pages
 */
function setStoredData<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(STORE_EVENT_NAME));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

// Low-level sync functions
export const store = {
  getPengurus: (): PengurusItem[] => {
    const data = getStoredData(STORAGE_KEYS.PENGURUS, INITIAL_PENGURUS);
    return data
      .map((p) => (!p.periode || p.periode === "2025/2026" ? { ...p, periode: "2026/2027" } : p))
      .filter((p) => p.divisi === "BPH");
  },
  setPengurus: (data: PengurusItem[]) => {
    const cleaned = data.filter((p) => p.divisi === "BPH");
    setStoredData(STORAGE_KEYS.PENGURUS, cleaned);
  },

  getEvents: (): EventAdminItem[] => getStoredData(STORAGE_KEYS.EVENTS, INITIAL_EVENTS),
  setEvents: (data: EventAdminItem[]) => setStoredData(STORAGE_KEYS.EVENTS, data),

  getAspirasi: (): AspirasiAdminItem[] => getStoredData(STORAGE_KEYS.ASPIRASI, INITIAL_ASPIRASI),
  setAspirasi: (data: AspirasiAdminItem[]) => setStoredData(STORAGE_KEYS.ASPIRASI, data),

  getMerchandise: (): MerchandiseAdminItem[] => getStoredData(STORAGE_KEYS.MERCHANDISE, INITIAL_MERCHANDISE),
  setMerchandise: (data: MerchandiseAdminItem[]) => setStoredData(STORAGE_KEYS.MERCHANDISE, data),

  // STRICT RULE 1: Filter out BPH explicitly from Master Divisi Data
  getDivisiFull: (): DivisiAdminItem[] => {
    const data = getStoredData(STORAGE_KEYS.DIVISI_FULL, INITIAL_DIVISI_FULL);
    return data.filter((d) => d.id !== "bph" && d.singkatan.toLowerCase() !== "bph");
  },
  setDivisiFull: (data: DivisiAdminItem[]) => {
    const cleaned = data.filter((d) => d.id !== "bph" && d.singkatan.toLowerCase() !== "bph");
    setStoredData(STORAGE_KEYS.DIVISI_FULL, cleaned);
  },

  getVisiMisi: (): VisiMisiData => getStoredData(STORAGE_KEYS.VISI_MISI, INITIAL_VISI_MISI),
  setVisiMisi: (data: VisiMisiData) => setStoredData(STORAGE_KEYS.VISI_MISI, data),

  getAnggotaDivisi: (): AnggotaDivisiItem[] => {
    const data = getStoredData(STORAGE_KEYS.ANGGOTA_DIVISI, INITIAL_ANGGOTA_DIVISI);
    return data.map((a) => (!a.periode || a.periode === "2025/2026" ? { ...a, periode: "2026/2027" } : a));
  },
  setAnggotaDivisi: (data: AnggotaDivisiItem[]) => setStoredData(STORAGE_KEYS.ANGGOTA_DIVISI, data),

  getDivisiList: (): string[] => getStoredData(STORAGE_KEYS.DIVISI, ["Akademik", "Medinfo", "PSDM", "Humas"]),
  setDivisiList: (data: string[]) => setStoredData(STORAGE_KEYS.DIVISI, data),

  getHeadlineWords: (): string[] => getStoredData(STORAGE_KEYS.HEADLINE_WORDS, INITIAL_HEADLINE_WORDS),
  setHeadlineWords: (data: string[]) => setStoredData(STORAGE_KEYS.HEADLINE_WORDS, data),

  getBadgeWords: (): string[] => getStoredData(STORAGE_KEYS.BADGE_WORDS, INITIAL_BADGE_WORDS),
  setBadgeWords: (data: string[]) => setStoredData(STORAGE_KEYS.BADGE_WORDS, data),

  getSubheadlineWords: (): string[] => getStoredData(STORAGE_KEYS.SUBHEADLINE_WORDS, INITIAL_SUBHEADLINE_WORDS),
  setSubheadlineWords: (data: string[]) => setStoredData(STORAGE_KEYS.SUBHEADLINE_WORDS, data),

  getHeroContent: (): HeroContentData => getStoredData(STORAGE_KEYS.HERO_CONTENT, INITIAL_HERO_CONTENT),
  setHeroContent: (data: HeroContentData) => setStoredData(STORAGE_KEYS.HERO_CONTENT, data),
};

let primarySyncPromise: Promise<void> | null = null;
let lastPrimarySyncTime = 0;
const SYNC_COOLDOWN_MS = 30000; // 30 seconds request deduplication

function triggerPrimarySync(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const now = Date.now();
  if (primarySyncPromise) {
    return primarySyncPromise;
  }

  if (now - lastPrimarySyncTime < SYNC_COOLDOWN_MS) {
    return Promise.resolve();
  }

  lastPrimarySyncTime = now;
  primarySyncPromise = Promise.all([
    fetchPengurusFromDB(),     // [0] → pengurus
    fetchEventsFromDB(),       // [1] → events
    fetchMerchandiseFromDB(),  // [2] → merchandise
    fetchHeroContentFromDB(),  // [3] → heroContent
    fetchVisiMisiFromDB(),     // [4] → visiMisi
    fetchDivisiFromDB(),       // [5] → divisi
    fetchAnggotaDivisiFromDB(), // [6] → anggota
    fetchAspirasiFromDB(),     // [7] → aspirasi
  ])
    .then(([pengurus, events, merchandise, heroContent, visiMisi, divisi, anggota, aspirasi]) => {
      // Use silent updates to avoid 8 sequential custom event re-render storms
      setStoredDataSilent(STORAGE_KEYS.PENGURUS, pengurus.filter((p) => p.divisi === "BPH"));
      setStoredDataSilent(STORAGE_KEYS.EVENTS, events);
      setStoredDataSilent(STORAGE_KEYS.MERCHANDISE, merchandise);
      setStoredDataSilent(STORAGE_KEYS.HERO_CONTENT, heroContent);
      setStoredDataSilent(STORAGE_KEYS.VISI_MISI, visiMisi);
      setStoredDataSilent(STORAGE_KEYS.DIVISI_FULL, divisi.filter((d) => d.id !== "bph" && d.singkatan.toLowerCase() !== "bph"));
      setStoredDataSilent(STORAGE_KEYS.ANGGOTA_DIVISI, anggota);
      setStoredDataSilent(STORAGE_KEYS.ASPIRASI, aspirasi);

      // Dispatch single consolidated update event
      window.dispatchEvent(new CustomEvent(STORE_EVENT_NAME));
    })
    .catch((err) => {
      console.warn("[HIMASI Store] Supabase primary sync error:", err);
    })
    .finally(() => {
      primarySyncPromise = null;
    });

  return primarySyncPromise;
}

/**
 * React Hook for automatically syncing public & admin pages with shared store
 */
export function useSharedStore() {
  const [pengurus, setPengurusState] = useState<PengurusItem[]>(INITIAL_PENGURUS.filter((p) => p.divisi === "BPH"));
  const [events, setEventsState] = useState<EventAdminItem[]>(INITIAL_EVENTS);
  const [aspirasi, setAspirasiState] = useState<AspirasiAdminItem[]>(INITIAL_ASPIRASI);
  const [merchandise, setMerchandiseState] = useState<MerchandiseAdminItem[]>(INITIAL_MERCHANDISE);
  const [divisiData, setDivisiDataState] = useState<DivisiAdminItem[]>(
    INITIAL_DIVISI_FULL.filter((d) => d.id !== "bph" && d.singkatan.toLowerCase() !== "bph")
  );
  const [visiMisi, setVisiMisiState] = useState<VisiMisiData>(INITIAL_VISI_MISI);
  const [anggotaDivisi, setAnggotaDivisiState] = useState<AnggotaDivisiItem[]>(INITIAL_ANGGOTA_DIVISI);
  const [divisiList, setDivisiListState] = useState<string[]>(["Akademik", "Medinfo", "PSDM", "Humas"]);
  const [headlineWords, setHeadlineWordsState] = useState<string[]>(INITIAL_HEADLINE_WORDS);
  const [badgeWords, setBadgeWordsState] = useState<string[]>(INITIAL_BADGE_WORDS);
  const [subheadlineWords, setSubheadlineWordsState] = useState<string[]>(INITIAL_SUBHEADLINE_WORDS);
  const [heroContent, setHeroContentState] = useState<HeroContentData>(INITIAL_HERO_CONTENT);
  const [mounted, setMounted] = useState(false);

  const reloadAll = () => {
    startTransition(() => {
      setPengurusState(store.getPengurus());
      setEventsState(store.getEvents());
      setAspirasiState(store.getAspirasi());
      setMerchandiseState(store.getMerchandise());
      setDivisiDataState(store.getDivisiFull());
      setVisiMisiState(store.getVisiMisi());
      setAnggotaDivisiState(store.getAnggotaDivisi());
      setDivisiListState(store.getDivisiList());
      setHeadlineWordsState(store.getHeadlineWords());
      setBadgeWordsState(store.getBadgeWords());
      setSubheadlineWordsState(store.getSubheadlineWords());
      setHeroContentState(store.getHeroContent());
    });
  };

  useEffect(() => {
    runStoreMigration();
    queueMicrotask(() => {
      setMounted(true);
      reloadAll();
    });

    // Defer client-side DB re-fetching until main thread paint is complete (eliminates TBT)
    const timerId = setTimeout(() => {
      triggerPrimarySync().then(() => {
        reloadAll();
      });
    }, 400);

    const handleUpdate = () => {
      reloadAll();
    };

    window.addEventListener(STORE_EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      clearTimeout(timerId);
      window.removeEventListener(STORE_EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    mounted,
    pengurus,
    events,
    aspirasi,
    merchandise,
    divisiData,
    visiMisi,
    anggotaDivisi,
    divisiList,
    headlineWords,
    badgeWords,
    subheadlineWords,
    heroContent,
    setPengurus: (data: PengurusItem[]) => {
      store.setPengurus(data);
      setPengurusState(data);
      // Sync to Supabase DB (fire-and-forget) — ensures cross-device real-time update
      syncPengurusToDB(data).catch(() => { });
      triggerRevalidatePengurus().catch(() => { });
    },
    setEvents: (data: EventAdminItem[]) => {
      store.setEvents(data);
      setEventsState(data);
      // Sync to Supabase DB (fire-and-forget)
      syncEventsToDB(data).catch(() => { });
      triggerRevalidateEvent().catch(() => { });
    },
    setAspirasi: (data: AspirasiAdminItem[]) => {
      store.setAspirasi(data);
      setAspirasiState(data);
      triggerRevalidateAspirasi().catch(() => { });
    },
    setMerchandise: (data: MerchandiseAdminItem[]) => {
      store.setMerchandise(data);
      setMerchandiseState(data);
      // Sync to Supabase DB (fire-and-forget)
      syncMerchandiseToDB(data).catch(() => { });
      triggerRevalidateMerchandise().catch(() => { });
    },
    setDivisiData: (data: DivisiAdminItem[], slug?: string) => {
      store.setDivisiFull(data);
      setDivisiDataState(data);
      // Sync to Supabase DB (fire-and-forget)
      syncDivisiToDB(data).catch(() => { });
      triggerRevalidateDivisi(slug).catch(() => { });
    },
    setVisiMisi: (data: VisiMisiData) => {
      store.setVisiMisi(data);
      setVisiMisiState(data);
      // Sync to Supabase DB (fire-and-forget)
      syncVisiMisiToDB(data).catch(() => { });
      triggerRevalidateVisiMisi().catch(() => { });
    },
    setAnggotaDivisi: (data: AnggotaDivisiItem[], slug?: string) => {
      store.setAnggotaDivisi(data);
      setAnggotaDivisiState(data);
      // Sync to Supabase DB (fire-and-forget)
      syncAnggotaDivisiToDB(data).catch(() => { });
      triggerRevalidateDivisi(slug).catch(() => { });
    },
    setDivisiList: (data: string[]) => {
      store.setDivisiList(data);
      setDivisiListState(data);
      triggerRevalidateDivisi().catch(() => { });
    },
    setHeadlineWords: (data: string[]) => {
      store.setHeadlineWords(data);
      setHeadlineWordsState(data);
      triggerRevalidateBeranda().catch(() => { });
    },
    setBadgeWords: (data: string[]) => {
      store.setBadgeWords(data);
      setBadgeWordsState(data);
      triggerRevalidateBeranda().catch(() => { });
    },
    setSubheadlineWords: (data: string[]) => {
      store.setSubheadlineWords(data);
      setSubheadlineWordsState(data);
      triggerRevalidateBeranda().catch(() => { });
    },
    setHeroContent: (data: HeroContentData) => {
      store.setHeroContent(data);
      setHeroContentState(data);
      // Sync to Supabase DB (fire-and-forget)
      syncHeroContentToDB(data).catch(() => { });
      triggerRevalidateBeranda().catch(() => { });

      // Keep legacy arrays in sync as well
      if (data.headlineDynamicWords) {
        store.setHeadlineWords(data.headlineDynamicWords);
        setHeadlineWordsState(data.headlineDynamicWords);
      }
      if (data.badgeDynamicWords) {
        store.setBadgeWords(data.badgeDynamicWords);
        setBadgeWordsState(data.badgeDynamicWords);
      }
      if (data.descriptionDynamicWords) {
        store.setSubheadlineWords(data.descriptionDynamicWords);
        setSubheadlineWordsState(data.descriptionDynamicWords);
      }
    },
  };
}
