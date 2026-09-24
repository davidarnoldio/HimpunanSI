"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Plus,
  X,
  RotateCcw,
  CheckCircle2,
  Tag,
  Type,
  Badge,
  FileText,
  ExternalLink,
  BarChart3,
  Save,
  Trash2,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useSharedStore, convertFileToBase64 } from "@/lib/sharedStore";
import {
  INITIAL_HERO_CONTENT,
  type HeroContentData,
  type HeroStatItem,
} from "@/data/adminMockData";
import { saveHeroContentAction, uploadFotoStorageAction } from "@/app/actions/adminActions";

interface WordTagInputProps {
  title: string;
  badgeText: string;
  words: string[];
  onChange: (words: string[]) => void;
}

function WordTagInput({ title, badgeText, words, onChange }: WordTagInputProps) {
  const [inputVal, setInputVal] = useState("");

  const handleAdd = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    if (words.some((w) => w.toLowerCase() === trimmed.toLowerCase())) return;
    onChange([...words, trimmed]);
    setInputVal("");
  };

  const handleRemove = (idxToRemove: number) => {
    if (words.length <= 1) return;
    onChange(words.filter((_, idx) => idx !== idxToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white flex items-center gap-2">
          <span>{title}</span>
          <span className="px-2 py-0.5 bg-[#C8102E] text-white text-[10px] font-mono font-bold uppercase border border-slate-950">
            {badgeText}
          </span>
        </label>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-950 dark:text-slate-400" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder={`Tambah kata animasi ${title.toLowerCase()}...`}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-xs font-bold focus:outline-none focus:border-[#C8102E] text-slate-950 dark:text-white"
          />
        </div>
        <button
          type="button"
          onClick={() => handleAdd()}
          className="px-4 py-2.5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black font-mono text-xs uppercase border-2 border-slate-950 hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
        >
          <Plus size={15} /> TAMBAH
        </button>
      </div>

      <div className="flex flex-wrap gap-2 p-3 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 min-h-[50px] items-center">
        <AnimatePresence>
          {words.map((word, idx) => (
            <motion.span
              key={`${word}-${idx}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-white dark:bg-slate-800 text-xs font-mono font-bold uppercase border border-slate-950"
            >
              <span>{word}</span>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="text-slate-400 hover:text-[#C8102E] transition-colors cursor-pointer"
                title="Hapus kata"
              >
                <X size={12} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface AdminBerandaClientProps {
  initialHeroContent: HeroContentData;
}

export function AdminBerandaClient({ initialHeroContent }: AdminBerandaClientProps) {
  const { heroContent, setHeroContent } = useSharedStore();
  const activeHero = heroContent || initialHeroContent;

  const [formData, setFormData] = useState<HeroContentData>(activeHero);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleHeroPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = 3 * 1024 * 1024;
    if (file.size > maxBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      alert(`Ukuran foto terlalu besar (${sizeMB} MB). Ukuran maksimal foto adalah 3 MB.`);
      return;
    }

    try {
      setIsLoading(true);
      const base64 = await convertFileToBase64(file);
      const uploadRes = await uploadFotoStorageAction(base64, "hero-editorial");
      if (uploadRes.success && uploadRes.url) {
        setFormData((prev) => ({ ...prev, heroImageUrl: uploadRes.url }));
      } else {
        setFormData((prev) => ({ ...prev, heroImageUrl: base64 }));
      }
    } catch (err) {
      console.error("Gagal mengunggah foto hero:", err);
      alert("Gagal membaca foto hero dari perangkat.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setSaveSuccess(false);

    try {
      const payload = { ...formData };
      if (payload.heroImageUrl && payload.heroImageUrl.startsWith("data:")) {
        try {
          const uploadRes = await uploadFotoStorageAction(payload.heroImageUrl, "hero-editorial");
          if (uploadRes.success && uploadRes.url) {
            payload.heroImageUrl = uploadRes.url;
            setFormData(payload);
          }
        } catch (uploadErr) {
          console.warn("Client storage upload failed for hero image, using payload:", uploadErr);
        }
      }

      setHeroContent(payload);
      await saveHeroContentAction(payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error("[AdminBeranda] Save error:", err);
      alert("Gagal menyimpan perubahan Beranda ke Supabase Database.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefault = async () => {
    if (isLoading) return;
    if (confirm("Reset seluruh teks Beranda ke pengaturan default awal?")) {
      setIsLoading(true);
      try {
        setFormData(INITIAL_HERO_CONTENT);
        setHeroContent(INITIAL_HERO_CONTENT);
        await saveHeroContentAction(INITIAL_HERO_CONTENT);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } catch (err) {
        console.error("[AdminBeranda] Reset error:", err);
        alert("Gagal mereset konten.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddStat = () => {
    const newStat: HeroStatItem = {
      label: "Statistik Baru",
      value: "100+",
    };
    setFormData({
      ...formData,
      stats: [...(formData.stats || []), newStat],
    });
  };

  const handleRemoveStat = (idxToRemove: number) => {
    setFormData({
      ...formData,
      stats: formData.stats.filter((_, idx) => idx !== idxToRemove),
    });
  };

  const handleStatChange = (idx: number, field: keyof HeroStatItem, val: string) => {
    const updated = [...(formData.stats || [])];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData({ ...formData, stats: updated });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-slate-950 dark:border-white/20 pb-6">
        <div>
          <h1 className="text-2xl font-black font-heading uppercase tracking-tight text-slate-950 dark:text-white flex items-center gap-2.5">
            <Sparkles size={24} className="text-[#C8102E] dark:text-[#E31B3B]" />
            KELOLA KONTEN BERANDA & HERO SECTION
          </h1>
          <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 mt-1">
            Ubah kata-kata animasi typewriter, subheadline, badge, dan statistik di halaman utama (Tersinkronisasi 100% dengan Supabase DB).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black font-mono text-xs uppercase tracking-wider border-2 border-slate-950 hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors"
          >
            PREVIEW WEB <ExternalLink size={13} />
          </Link>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white font-black font-mono text-xs uppercase tracking-wider border-2 border-slate-950 hover:bg-slate-300 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> RESET DEFAULT
          </button>
        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-[#C8102E] text-white border-2 border-slate-950 font-mono font-bold text-xs flex items-center gap-3 uppercase shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]"
          >
            <CheckCircle2 size={18} className="shrink-0 text-white" />
            <span>
              Perubahan konten Hero Section berhasil disimpan dan langsung diperbarui di Halaman Utama secara publik!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Form Card 0: Hero Editorial Photograph */}
        <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-950 dark:border-white/20 pb-4">
            <h2 className="font-black font-heading text-base uppercase text-slate-950 dark:text-white flex items-center gap-2">
              <ImageIcon size={18} className="text-[#C8102E] dark:text-[#E31B3B]" />
              FOTO UTAMA HERO SECTION (EDITORIAL PHOTOGRAPHY)
            </h2>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">VISUAL ANCHOR</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Image Preview Box */}
            <div className="md:col-span-4 relative aspect-[4/3] bg-slate-950 border-2 border-slate-950 dark:border-white/20 overflow-hidden shadow-[4px_4px_0px_0px_rgba(200,16,46,1)]">
              <img
                src={formData.heroImageUrl || "/hero-editorial.webp"}
                alt="Preview Hero Editorial"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#C8102E] text-white text-[9px] font-mono font-bold uppercase border border-black">
                LIVE PREVIEW
              </div>
            </div>

            {/* Inputs & Upload button */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <label className="block font-black font-mono text-xs uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                  URL FOTO HERO EDITORIAL
                </label>
                <input
                  type="text"
                  value={formData.heroImageUrl || "/hero-editorial.webp"}
                  onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                  placeholder="Isi URL foto atau upload file foto baru..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-xs font-bold focus:outline-none focus:border-[#C8102E] text-slate-950 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-black font-mono text-xs uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                  UPLOAD FOTO DARI PERANGKAT (LOCAL FILE)
                </label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black font-mono text-xs uppercase border-2 border-slate-950 hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors cursor-pointer">
                    <Upload size={14} /> UNGGAH FOTO BARU
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroPhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    Disarankan format .jpg/.png horizontal 16:9 atau 4:3.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card 1: Dynamic Running Text Words */}
        <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-950 dark:border-white/20 pb-4">
            <h2 className="font-black font-heading text-base uppercase text-slate-950 dark:text-white flex items-center gap-2">
              <Type size={18} className="text-[#C8102E] dark:text-[#E31B3B]" />
              KATA ANIMASI RUNNING TEXT / TYPEWRITER
            </h2>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">SECTION HEADER</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WordTagInput
              title="Kata Animasi Headline Utama"
              badgeText="Judul Besar"
              words={formData.headlineDynamicWords || []}
              onChange={(newWords) => setFormData({ ...formData, headlineDynamicWords: newWords })}
            />

            <WordTagInput
              title="Kata Animasi Badge Atas"
              badgeText="Pill Badge"
              words={formData.badgeDynamicWords || []}
              onChange={(newWords) => setFormData({ ...formData, badgeDynamicWords: newWords })}
            />
          </div>

          <WordTagInput
            title="Kata Animasi Deskripsi Subheadline"
            badgeText="Teks Penjelas"
            words={formData.descriptionDynamicWords || []}
            onChange={(newWords) => setFormData({ ...formData, descriptionDynamicWords: newWords })}
          />
        </div>

        {/* Form Card 2: Main Text Header */}
        <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-950 dark:border-white/20 pb-4">
            <h2 className="font-black font-heading text-base uppercase text-slate-950 dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-[#C8102E] dark:text-[#E31B3B]" />
              TEKS UTAMA HERO SECTION
            </h2>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">JUDUL & DESKRIPSI</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-black font-mono text-xs uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                TEKS AWALAN BADGE TOP
              </label>
              <div className="relative">
                <Badge size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-950 dark:text-slate-400" />
                <input
                  type="text"
                  value={formData.badgePrefix || ""}
                  onChange={(e) => setFormData({ ...formData, badgePrefix: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-xs font-bold focus:outline-none focus:border-[#C8102E] text-slate-950 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-black font-mono text-xs uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                AWALAN HEADLINE UTAMA
              </label>
              <input
                type="text"
                value={formData.headlinePrefix || ""}
                onChange={(e) => setFormData({ ...formData, headlinePrefix: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-xs font-bold focus:outline-none focus:border-[#C8102E] text-slate-950 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-black font-mono text-xs uppercase tracking-wider text-slate-950 dark:text-white mb-1">
              AKHIRAN HEADLINE UTAMA
            </label>
            <input
              type="text"
              value={formData.headlineSuffix || ""}
              onChange={(e) => setFormData({ ...formData, headlineSuffix: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-xs font-bold focus:outline-none focus:border-[#C8102E] text-slate-950 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-black font-mono text-xs uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                TEKS AWALAN DESKRIPSI
              </label>
              <textarea
                rows={2}
                value={formData.descriptionBefore || ""}
                onChange={(e) => setFormData({ ...formData, descriptionBefore: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-xs font-medium leading-relaxed focus:outline-none focus:border-[#C8102E] resize-none text-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-black font-mono text-xs uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                TEKS AKHIRAN DESKRIPSI
              </label>
              <textarea
                rows={2}
                value={formData.descriptionAfter || ""}
                onChange={(e) => setFormData({ ...formData, descriptionAfter: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-xs font-medium leading-relaxed focus:outline-none focus:border-[#C8102E] resize-none text-slate-950 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Form Card 3: Hero Statistics counter */}
        <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-950 dark:border-white/20 pb-4">
            <div>
              <h2 className="font-black font-heading text-base uppercase text-slate-950 dark:text-white flex items-center gap-2">
                <BarChart3 size={18} className="text-[#C8102E] dark:text-[#E31B3B]" />
                STATISTIK PENCAPAIAN HIMPUNAN
              </h2>
              <p className="text-xs font-mono font-bold text-slate-500">Angka pencapaian yang tampil di bagian bawah Hero Section.</p>
            </div>
            <button
              type="button"
              onClick={handleAddStat}
              className="px-3 py-1.5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black font-mono text-xs uppercase border border-slate-950 flex items-center gap-1 cursor-pointer hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors"
            >
              <Plus size={14} /> TAMBAH STAT
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(formData.stats || []).map((stat, idx) => (
              <div
                key={idx}
                className="p-4 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 space-y-3 relative group"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveStat(idx)}
                  className="absolute top-3 right-3 p-1 bg-[#C8102E] text-white border border-slate-950 hover:bg-slate-950 transition-colors cursor-pointer"
                  title="Hapus statistik"
                >
                  <Trash2 size={13} />
                </button>

                <div>
                  <label className="block text-[10px] font-mono font-black uppercase text-slate-500 mb-1">
                    ANGKA / NILAI
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-950 dark:border-white/20 text-xs font-black text-[#C8102E] dark:text-[#E31B3B] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-black uppercase text-slate-500 mb-1">
                    LABEL KETERANGAN
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-950 dark:border-white/20 text-xs font-black font-mono tracking-wider uppercase text-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="sticky bottom-6 z-20 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3.5 bg-[#C8102E] dark:bg-[#E31B3B] hover:bg-slate-950 text-white font-black font-mono text-xs uppercase tracking-widest border-2 border-slate-950 transition-colors cursor-pointer flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                <span>MENYIMPAN...</span>
              </>
            ) : (
              <>
                <Save size={18} /> SIMPAN PERUBAHAN BERANDA
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
