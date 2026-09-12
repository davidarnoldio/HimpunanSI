"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Compass, CheckCircle2, Plus, Trash2, Save } from "lucide-react";
import { useSharedStore } from "@/lib/sharedStore";
import { type VisiMisiData } from "@/data/adminMockData";
import { saveVisiMisiAction } from "@/app/actions/adminActions";

interface AdminVisiMisiClientProps {
  initialVisiMisi: VisiMisiData;
}

export function AdminVisiMisiClient({ initialVisiMisi }: AdminVisiMisiClientProps) {
  const { visiMisi, setVisiMisi } = useSharedStore();
  const activeVisiMisi = visiMisi || initialVisiMisi;

  const [visiText, setVisiText] = useState(activeVisiMisi?.visi || "");
  const [misiList, setMisiList] = useState<string[]>(activeVisiMisi?.misi || []);
  const [newMisi, setNewMisi] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handleAddMisi = () => {
    if (!newMisi.trim()) return;
    setMisiList([...misiList, newMisi.trim()]);
    setNewMisi("");
  };

  const handleDeleteMisi = (index: number) => {
    setMisiList(misiList.filter((_, i) => i !== index));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const payload: VisiMisiData = {
        visi: visiText,
        misi: misiList,
      };
      setVisiMisi(payload);
      await saveVisiMisiAction(payload);
      showToast("Visi & Misi Himpunan berhasil disimpan dan diperbarui di landing page.");
    } catch (err) {
      console.error("[AdminVisiMisi] Save error:", err);
      alert("Gagal menyimpan Visi & Misi ke database.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 p-4 bg-[#C8102E] text-white font-mono font-black text-xs border-2 border-slate-950 flex items-center gap-2 uppercase shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]"
          >
            <CheckCircle2 size={16} />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20">
        <div className="space-y-1">
          <h1 className="text-xl font-black font-heading uppercase tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
            <Target className="text-[#C8102E] dark:text-[#E31B3B]" size={22} />
            PENGELOLAAN VISI & MISI HIMSI UG
          </h1>
          <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
            Edit teks Visi & Misi Himpunan secara realtime untuk ditampilkan di atas section Kabinet (Tersinkronisasi 100% dengan Supabase DB).
          </p>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleSave()}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#C8102E] dark:bg-[#E31B3B] text-white font-black font-mono text-xs uppercase tracking-widest border-2 border-slate-950 hover:bg-slate-950 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin" />
              <span>MENYIMPAN...</span>
            </>
          ) : (
            <>
              <Save size={16} /> SIMPAN PERUBAHAN
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Box VISI */}
        <div className="p-7 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-950 dark:border-white/20">
            <div className="p-2.5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950">
              <Target size={22} />
            </div>
            <div>
              <h2 className="font-black font-heading text-base uppercase text-slate-950 dark:text-white">
                KELOLA VISI HIMPUNAN
              </h2>
              <p className="text-[11px] font-mono font-bold text-slate-500">
                Tuliskan pernyataan Visi utama HIMSI UG
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white">
              TEKS PERNYATAAN VISI *
            </label>
            <textarea
              required
              rows={5}
              value={visiText}
              onChange={(e) => setVisiText(e.target.value)}
              placeholder="Tuliskan Visi Himpunan..."
              className="w-full p-4 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-xs sm:text-sm font-semibold text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Form Box MISI */}
        <div className="p-7 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-950 dark:border-white/20">
            <div className="p-2.5 bg-[#C8102E] text-white border border-slate-950">
              <Compass size={22} />
            </div>
            <div>
              <h2 className="font-black font-heading text-base uppercase text-slate-950 dark:text-white">
                KELOLA POIN MISI HIMPUNAN
              </h2>
              <p className="text-[11px] font-mono font-bold text-slate-500">
                Tambah dan hapus daftar poin Misi organisasi
              </p>
            </div>
          </div>

          {/* Input Misi Baru */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newMisi}
              onChange={(e) => setNewMisi(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddMisi();
                }
              }}
              placeholder="Tulis poin misi baru..."
              className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E]"
            />
            <button
              type="button"
              onClick={handleAddMisi}
              className="px-4 py-2.5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black font-mono text-xs uppercase tracking-wider border-2 border-slate-950 flex items-center gap-1 shrink-0 cursor-pointer hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors"
            >
              <Plus size={16} /> TAMBAH
            </button>
          </div>

          {/* List Poin Misi */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {misiList.map((misi, idx) => (
              <div
                key={idx}
                className="p-3 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 flex items-start justify-between gap-3 text-xs font-semibold text-slate-950 dark:text-white"
              >
                <div className="flex gap-2 items-start">
                  <span className="font-mono font-black text-[#C8102E] dark:text-[#E31B3B]">{idx + 1}.</span>
                  <span>{misi}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteMisi(idx)}
                  className="p-1 bg-[#C8102E] text-white border border-slate-950 hover:bg-slate-950 transition-colors shrink-0 cursor-pointer"
                  title="Hapus Misi"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
