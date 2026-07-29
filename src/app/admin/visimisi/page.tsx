"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Compass, CheckCircle2, Plus, Trash2, Save } from "lucide-react";
import { useSharedStore } from "@/lib/sharedStore";

export default function AdminVisiMisiPage() {
  const { visiMisi, setVisiMisi } = useSharedStore();

  const [prevVisiMisi, setPrevVisiMisi] = useState(visiMisi);
  const [visiText, setVisiText] = useState(visiMisi?.visi || "");
  const [misiList, setMisiList] = useState<string[]>(visiMisi?.misi || []);
  const [newMisi, setNewMisi] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  if (visiMisi !== prevVisiMisi) {
    setPrevVisiMisi(visiMisi);
    setVisiText(visiMisi?.visi || "");
    setMisiList(visiMisi?.misi || []);
  }

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleAddMisi = () => {
    if (!newMisi.trim()) return;
    setMisiList([...misiList, newMisi.trim()]);
    setNewMisi("");
  };

  const handleDeleteMisi = (index: number) => {
    setMisiList(misiList.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setVisiMisi({
      visi: visiText,
      misi: misiList,
    });
    showToast("Visi & Misi Himpunan berhasil disimpan dan diperbarui di landing page.");
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
            Edit teks Visi & Misi Himpunan secara realtime untuk ditampilkan di atas section Kabinet.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-900/20 transition-all cursor-pointer"
        >
          <Save size={16} /> Simpan Perubahan Visi Misi
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

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs mb-1.5">
              Pernyataan Visi Utama:
            </label>
            <textarea
              rows={6}
              required
              value={visiText}
              onChange={(e) => setVisiText(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium text-xs sm:text-sm focus:outline-none focus:border-red-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Form Box MISI */}
        <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-3 rounded-2xl bg-rose-600/10 text-rose-600 dark:text-rose-400">
              <Compass size={22} />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Kelola Pilar Misi Himpunan
              </h2>
              <p className="text-[11px] text-slate-500">
                Tambah, ubah, atau hapus poin-poin Misi utama
              </p>
            </div>
          </div>

          {/* Add New Misi Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tuliskan poin Misi baru..."
              value={newMisi}
              onChange={(e) => setNewMisi(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddMisi())}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-red-500"
            />
            <button
              type="button"
              onClick={handleAddMisi}
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              <Plus size={15} /> Tambah
            </button>
          </div>

          {/* List of Misi Items */}
          <div className="space-y-2 pt-2">
            {misiList.map((misiItem, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60"
              >
                <div className="flex items-start gap-2 text-xs font-medium text-slate-800 dark:text-slate-200">
                  <CheckCircle2 size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{misiItem}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteMisi(idx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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
