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
} from "lucide-react";
import Link from "next/link";
import { useSharedStore } from "@/lib/sharedStore";
import {
  INITIAL_HERO_CONTENT,
  type HeroContentData,
  type HeroStatItem,
} from "@/data/adminMockData";
import { saveHeroContentAction } from "@/app/actions/adminActions";

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
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span>{title}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/60">
            {badgeText}
          </span>
        </label>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
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
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={() => handleAdd()}
          className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Plus size={15} /> Tambah
        </button>
      </div>

      <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 min-h-[50px] items-center">
        <AnimatePresence>
          {words.map((word, idx) => (
            <motion.span
              key={`${word}-${idx}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-sm"
            >
              <span>{word}</span>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setSaveSuccess(false);

    try {
      setHeroContent(formData);
      await saveHeroContentAction(formData);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Sparkles size={24} className="text-red-600 dark:text-red-500" />
            Kelola Konten Beranda & Hero Section
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ubah kata-kata animasi typewriter, subheadline, badge, dan statistik di halaman utama (Tersinkronisasi 100% dengan Supabase DB).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
          >
            Preview Web <ExternalLink size={13} />
          </Link>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> Reset Default
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
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-xs font-bold shadow-sm"
          >
            <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
            <span>
              Perubahan konten Hero Section berhasil disimpan dan langsung diperbarui di Halaman Utama secara publik!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Form Card 1: Dynamic Running Text Words */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Type size={18} className="text-red-500" />
              Kata Animasi Running Text / Typewriter
            </h2>
            <span className="text-[11px] font-bold text-slate-400">Section Header</span>
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
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText size={18} className="text-red-500" />
              Teks Utama Hero Section
            </h2>
            <span className="text-[11px] font-bold text-slate-400">Judul & Deskripsi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-extrabold text-xs text-slate-700 dark:text-slate-300 mb-1">
                Teks Awalan Badge Top
              </label>
              <div className="relative">
                <Badge size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.badgePrefix || ""}
                  onChange={(e) => setFormData({ ...formData, badgePrefix: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-extrabold text-xs text-slate-700 dark:text-slate-300 mb-1">
                Awalan Headline Utama
              </label>
              <input
                type="text"
                value={formData.headlinePrefix || ""}
                onChange={(e) => setFormData({ ...formData, headlinePrefix: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-extrabold text-xs text-slate-700 dark:text-slate-300 mb-1">
              Akhiran Headline Utama
            </label>
            <input
              type="text"
              value={formData.headlineSuffix || ""}
              onChange={(e) => setFormData({ ...formData, headlineSuffix: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-extrabold text-xs text-slate-700 dark:text-slate-300 mb-1">
                Teks Awalan Deskripsi
              </label>
              <textarea
                rows={2}
                value={formData.descriptionBefore || ""}
                onChange={(e) => setFormData({ ...formData, descriptionBefore: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium leading-relaxed focus:outline-none focus:border-red-500 resize-none"
              />
            </div>

            <div>
              <label className="block font-extrabold text-xs text-slate-700 dark:text-slate-300 mb-1">
                Teks Akhiran Deskripsi
              </label>
              <textarea
                rows={2}
                value={formData.descriptionAfter || ""}
                onChange={(e) => setFormData({ ...formData, descriptionAfter: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium leading-relaxed focus:outline-none focus:border-red-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Form Card 3: Hero Statistics counter */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 size={18} className="text-red-500" />
                Statistik Pencapaian Himpunan
              </h2>
              <p className="text-xs text-slate-500">Angka pencapaian yang tampil di bagian bawah Hero Section.</p>
            </div>
            <button
              type="button"
              onClick={handleAddStat}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Tambah Stat
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(formData.stats || []).map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 relative group"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveStat(idx)}
                  className="absolute top-3 right-3 p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-950 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Hapus statistik"
                >
                  <Trash2 size={13} />
                </button>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">
                    Angka / Nilai
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-black text-red-600 dark:text-red-400 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">
                    Label Keterangan
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-red-500"
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
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm shadow-2xl shadow-red-900/40 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Menyimpan Perubahan...</span>
              </>
            ) : (
              <>
                <Save size={18} /> Simpan Perubahan Beranda
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
