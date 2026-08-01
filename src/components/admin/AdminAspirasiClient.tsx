"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Trash2,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import {
  getLatestAspirasiAction,
  updateAspirasiStatusAction,
  deleteAspirasiAction,
} from "@/app/actions/aspirasiActions";
import { type AspirasiAdminItem } from "@/data/adminMockData";
import { useSharedStore } from "@/lib/sharedStore";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";

interface AdminAspirasiClientProps {
  initialAspirasi: AspirasiAdminItem[];
}

export function AdminAspirasiClient({ initialAspirasi }: AdminAspirasiClientProps) {
  const { setAspirasi: setStoreAspirasi } = useSharedStore();
  const [aspirasi, setAspirasi] = useState<AspirasiAdminItem[]>(initialAspirasi);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Semua");

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const loadData = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const data = await getLatestAspirasiAction();
      setAspirasi(data);
      setStoreAspirasi(data);
    } catch (err) {
      console.error("[AdminAspirasi] Refresh error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = aspirasi.filter((item) => {
    const matchSearch =
      item.pesan.toLowerCase().includes(search.toLowerCase()) ||
      (item.nama && item.nama.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === "Semua" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = async (id: string, status: "Baru" | "Diproses" | "Selesai") => {
    setIsLoading(true);
    try {
      setAspirasi((prev) => {
        const updated = prev.map((i) => (i.id === id ? { ...i, status } : i));
        setStoreAspirasi(updated);
        return updated;
      });
      await updateAspirasiStatusAction(id, status);
    } catch (err) {
      console.error("[AdminAspirasi] Update status error:", err);
      alert("Gagal meng-update status aspirasi.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId || isLoading) return;
    const targetId = deleteTargetId;
    setIsLoading(true);

    try {
      setAspirasi((prev) => {
        const updated = prev.filter((i) => i.id !== targetId);
        setStoreAspirasi(updated);
        return updated;
      });
      setDeleteTargetId(null);
      await deleteAspirasiAction(targetId);
    } catch (err) {
      console.error("[AdminAspirasi] Delete error:", err);
      alert("Gagal menghapus aspirasi dari database.");
    } finally {
      setIsLoading(false);
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
            Kelola masukan, kritik, dan aspirasi anonim dari mahasiswa Sistem Informasi (Tersinkronisasi 100% dengan Supabase DB).
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 transition-colors shadow-sm cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Memuat Data..." : "Refresh Data DB"}
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari aspirasi..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {["Semua", "Baru", "Diproses", "Selesai"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === st
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* List Aspirasi Cards */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
          <ShieldAlert size={40} className="mx-auto text-slate-400" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada aspirasi masuk</p>
          <p className="text-xs text-slate-500">Mahasiswa belum mengirimkan aspirasi atau telah dihapus.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isBaru = item.status === "Baru";
            const isDiproses = item.status === "Diproses";
            const isSelesai = item.status === "Selesai";

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      {item.isAnonim ? "🔒 Kirim Anonim" : item.nama || "Mahasiswa SI"}
                    </span>
                    {item.email && !item.isAnonim && (
                      <span className="text-xs font-mono text-slate-400">({item.email})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-medium">{item.tanggal}</span>

                    {/* Status Pill Switcher */}
                    <select
                      disabled={isLoading}
                      value={item.status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          item.id,
                          e.target.value as "Baru" | "Diproses" | "Selesai"
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-extrabold border focus:outline-none cursor-pointer ${
                        isBaru
                          ? "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                          : isDiproses
                          ? "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                          : "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                      }`}
                    >
                      <option value="Baru">🔴 Baru</option>
                      <option value="Diproses">🟡 Diproses</option>
                      <option value="Selesai">🟢 Selesai</option>
                    </select>

                    <button
                      disabled={isLoading}
                      onClick={() => setDeleteTargetId(item.id)}
                      className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                      title="Hapus Aspirasi"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  &ldquo;{item.pesan}&rdquo;
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        title="Hapus Pesan Aspirasi"
        description="Apakah Anda yakin ingin menghapus masukan aspirasi ini secara permanen dari Supabase DB?"
      />
    </div>
  );
}
