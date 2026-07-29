"use client";

import { useState, useEffect } from "react";
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
          className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
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
                className="text-slate-400 hover:text-red-500 transition-colors"
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

export default function AdminBerandaPage() {
  const { heroContent, setHeroContent } = useSharedStore();

  const [formData, setFormData] = useState<HeroContentData>(INITIAL_HERO_CONTENT);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    if (heroContent) {
      setFormData(heroContent);
    }
  }, [heroContent]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroContent(formData);
    showToast("Berhasil menyimpan seluruh konfigurasi Hero Section!");
  };

  const handleResetDefaults = () => {
    if (confirm("Apakah Anda yakin ingin mengembalikan seluruh teks Hero Section ke default awal?")) {
      setFormData(INITIAL_HERO_CONTENT);
      setHeroContent(INITIAL_HERO_CONTENT);
      showToast("Seluruh teks Hero Section dikembalikan ke bawaan.");
    }
  };

  // Stat item handlers
  const handleStatChange = (index: number, field: keyof HeroStatItem, val: string) => {
    const updatedStats = formData.stats.map((s, idx) =>
      idx === index ? { ...s, [field]: val } : s
    );
    setFormData({ ...formData, stats: updatedStats });
  };

  const handleAddStat = () => {
    if (formData.stats.length >= 6) {
      showToast("Maksimal 6 statistik!");
      return;
    }
    const newStat: HeroStatItem = { value: "100+", label: "Statistik Baru" };
    setFormData({ ...formData, stats: [...formData.stats, newStat] });
  };

  const handleRemoveStat = (index: number) => {
    if (formData.stats.length <= 1) {
      showToast("Minimal harus ada 1 statistik!");
      return;
    }
    const updatedStats = formData.stats.filter((_, idx) => idx !== index);
    setFormData({ ...formData, stats: updatedStats });
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-5xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs shadow-2xl flex items-center gap-2.5 border border-slate-800 dark:border-slate-200"
          >
            <CheckCircle2 size={16} className="text-emerald-400 dark:text-emerald-600" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-1.5">
              <Sparkles size={14} /> Full CMS Hero Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-2">
            Kelola Seluruh Teks & Konten Hero Section
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1">
            Ubah teks statis, kata animasi live text, dan statistik di Hero Section Public Web secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RotateCcw size={14} /> Reset Default
          </button>

          <Link
            href="/#beranda"
            target="_blank"
            className="px-4 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-md flex items-center gap-1.5"
          >
            Pratinjau <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* BAGIAN 1: BADGE */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
              <Badge size={18} />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">1. Badge Atas Hero</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pengaturan teks awalan dan kata berganti di badge teratas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Awalan Teks Badge (`badgePrefix`)
              </label>
              <input
                type="text"
                value={formData.badgePrefix}
                onChange={(e) => setFormData({ ...formData, badgePrefix: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-red-500"
              />
            </div>

            <WordTagInput
              title="Kata Berganti Badge"
              badgeText="`badgeDynamicWords`"
              words={formData.badgeDynamicWords}
              onChange={(newWords) => setFormData({ ...formData, badgeDynamicWords: newWords })}
            />
          </div>
        </div>

        {/* BAGIAN 2: HEADLINE */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
              <Type size={18} />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">2. Judul Utama (Headline)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pengaturan awalan, kata berganti warna merah, dan akhiran judul</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Awalan Judul (`headlinePrefix`)
                </label>
                <input
                  type="text"
                  value={formData.headlinePrefix}
                  onChange={(e) => setFormData({ ...formData, headlinePrefix: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Akhiran Judul (`headlineSuffix`)
                </label>
                <input
                  type="text"
                  value={formData.headlineSuffix}
                  onChange={(e) => setFormData({ ...formData, headlineSuffix: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <WordTagInput
              title="Kata Berganti Headline"
              badgeText="`headlineDynamicWords`"
              words={formData.headlineDynamicWords}
              onChange={(newWords) => setFormData({ ...formData, headlineDynamicWords: newWords })}
            />
          </div>
        </div>

        {/* BAGIAN 3: SUBHEADLINE / DESKRIPSI */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
              <FileText size={18} />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">3. Deskripsi Subheadline</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pengaturan kalimat pembuka, kata berganti bergaris bawah, dan kalimat penutup</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Teks Sebelum Kata Berganti (`descriptionBefore`)
              </label>
              <input
                type="text"
                value={formData.descriptionBefore}
                onChange={(e) => setFormData({ ...formData, descriptionBefore: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-red-500"
              />
            </div>

            <WordTagInput
              title="Kata Berganti Deskripsi"
              badgeText="`descriptionDynamicWords`"
              words={formData.descriptionDynamicWords}
              onChange={(newWords) => setFormData({ ...formData, descriptionDynamicWords: newWords })}
            />

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Teks Setelah Kata Berganti (`descriptionAfter`)
              </label>
              <textarea
                rows={2}
                value={formData.descriptionAfter}
                onChange={(e) => setFormData({ ...formData, descriptionAfter: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-red-500 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* BAGIAN 4: STATISTIK BAR */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                <BarChart3 size={18} />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">4. Kotak Statistik Bar (`stats`)</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pengaturan angka dan label untuk 4 (atau lebih) kotak statistik di bawah Hero</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddStat}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-red-600 font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <Plus size={14} /> Tambah Kotak
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {formData.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    Stat #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStat(idx)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title="Hapus Kotak Stat"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Angka / Nilai</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-red-600 dark:text-red-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Label Keterangan</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating / Sticky Save Bar */}
        <div className="sticky bottom-6 p-4 rounded-2xl bg-slate-900/90 dark:bg-slate-100/90 text-white dark:text-slate-900 backdrop-blur-xl border border-slate-800 dark:border-slate-200 shadow-2xl flex items-center justify-between gap-4">
          <span className="text-xs font-bold hidden sm:inline">
            Pastikan menekan tombol &quot;Simpan Perubahan&quot; untuk memperbarui Public Web.
          </span>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition-all"
          >
            <Save size={16} /> Simpan Perubahan Hero Section
          </button>
        </div>
      </form>
    </div>
  );
}
