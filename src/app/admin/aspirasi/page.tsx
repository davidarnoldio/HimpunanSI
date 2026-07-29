"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import { useSharedStore } from "@/lib/sharedStore";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";

export default function AdminAspirasiPage() {
  const { aspirasi, setAspirasi } = useSharedStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Semua");

  // Custom Delete Modal State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredItems = aspirasi.filter((item) => {
    const matchSearch =
      item.pesan.toLowerCase().includes(search.toLowerCase()) ||
      (item.nama && item.nama.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === "Semua" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = (id: string, status: "Baru" | "Diproses" | "Selesai") => {
    const updated = aspirasi.map((i) => (i.id === id ? { ...i, status } : i));
    setAspirasi(updated);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      const updated = aspirasi.filter((i) => i.id !== deleteTargetId);
      setAspirasi(updated);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Aspirasi & Masukan Mahasiswa
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola masukan, kritik, dan aspirasi anonim dari mahasiswa Sistem Informasi (Tersinkronisasi otomatis dengan /aspirasi).
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["Semua", "Baru", "Diproses", "Selesai"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterStatus === st
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari aspirasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* List Aspirasi */}
      {filteredItems.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada aspirasi masuk</p>
          <p className="text-xs text-slate-500">Mahasiswa belum mengirimkan aspirasi atau telah dihapus.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs">
                  {item.isAnonim ? (
                    <span className="flex items-center gap-1 font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2.5 py-1 rounded-full border border-red-200 dark:border-red-800">
                      <ShieldAlert size={12} /> Pengirim Anonim
                    </span>
                  ) : (
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {item.nama} {item.email ? `(${item.email})` : ""}
                    </span>
                  )}
                  <span className="text-slate-400 text-[11px]">• {item.tanggal}</span>
                </div>

                {/* Checkbox status & Select & Delete */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={item.status === "Selesai"}
                      onChange={(e) =>
                        handleUpdateStatus(item.id, e.target.checked ? "Selesai" : "Baru")
                      }
                      className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <span>Sudah Dibaca/Selesai</span>
                  </label>

                  <select
                    value={item.status}
                    onChange={(e) => handleUpdateStatus(item.id, e.target.value as "Baru" | "Diproses" | "Selesai")}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    <option value="Baru">Baru</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                  <button
                    onClick={() => setDeleteTargetId(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    title="Hapus Aspirasi"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                &quot;{item.pesan}&quot;
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTargetId)}
        title="Hapus Pesan Aspirasi"
        description="Apakah Anda yakin ingin menghapus masukan aspirasi ini secara permanen?"
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
