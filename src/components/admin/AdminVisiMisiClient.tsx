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
            className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Target className="text-red-600 dark:text-red-500" size={22} />
            Pengelolaan Visi & Misi HIMSI UG
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Edit teks Visi & Misi Himpunan secara realtime untuk ditampilkan di atas section Kabinet (Tersinkronisasi 100% dengan Supabase DB).
          </p>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleSave()}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-red-900/20 transition-all cursor-pointer"
        >
          {isLoading ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Menyimpan Visi & Misi...</span>
            </>
          ) : (
            <>
              <Save size={16} /> Simpan Perubahan Visi Misi
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Box VISI */}
        <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-3 rounded-2xl bg-red-600/10 text-red-600 dark:text-red-500">
              <Target size={22} />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Kelola Visi Himpunan
              </h2>
              <p className="text-[11px] text-slate-500">
                Tuliskan pernyataan Visi utama HIMSI UG
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Teks Pernyataan Visi *
            </label>
            <textarea
              required
              rows={5}
              value={visiText}
              onChange={(e) => setVisiText(e.target.value)}
              placeholder="Tuliskan Visi Himpunan..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Form Box MISI */}
        <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-3 rounded-2xl bg-rose-600/10 text-rose-600 dark:text-rose-500">
              <Compass size={22} />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Kelola Poin Misi Himpunan
              </h2>
              <p className="text-[11px] text-slate-500">
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
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-red-500"
            />
            <button
              type="button"
              onClick={handleAddMisi}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Plus size={16} /> Tambah
            </button>
          </div>

          {/* List Poin Misi */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {misiList.map((misi, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                <div className="flex gap-2 items-start">
                  <span className="font-bold text-red-600 dark:text-red-500">{idx + 1}.</span>
                  <span>{misi}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteMisi(idx)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-600 transition-colors shrink-0 cursor-pointer"
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
