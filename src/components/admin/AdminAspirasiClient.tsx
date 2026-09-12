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
      const updated = aspirasi.map((i) => (i.id === id ? { ...i, status } : i));
      setAspirasi(updated);
      setStoreAspirasi(updated);
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
      const updated = aspirasi.filter((i) => i.id !== targetId);
      setAspirasi(updated);
      setStoreAspirasi(updated);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-slate-950 dark:border-white/20 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading uppercase tracking-tight text-slate-950 dark:text-white">
            ASPIRASI & MASUKAN MAHASISWA
          </h1>
          <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 mt-1">
            Kelola masukan, kritik, dan aspirasi anonim dari mahasiswa Sistem Informasi (Tersinkronisasi 100% dengan Supabase DB).
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black font-mono text-xs uppercase tracking-widest border-2 border-slate-950 hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "MEMUAT DATA..." : "REFRESH DATA DB"}
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-950 dark:text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari aspirasi..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-xs font-bold focus:outline-none focus:border-[#C8102E] text-slate-950 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {["Semua", "Baru", "Diproses", "Selesai"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-black font-mono uppercase border-2 border-slate-950 cursor-pointer transition-colors ${
                filterStatus === st
                  ? "bg-[#C8102E] text-white"
                  : "bg-white dark:bg-slate-950 text-slate-950 dark:text-white hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* List Aspirasi Cards */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 space-y-2">
          <ShieldAlert size={40} className="mx-auto text-slate-400" />
          <p className="text-sm font-black font-heading uppercase text-slate-950 dark:text-white">Belum ada aspirasi masuk</p>
          <p className="text-xs font-mono font-bold text-slate-500">Mahasiswa belum mengirimkan aspirasi atau telah dihapus.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 space-y-4 hover:shadow-[4px_4px_0px_0px_rgba(200,16,46,1)] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-950/20 dark:border-white/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-black font-mono text-xs uppercase text-slate-950 dark:text-white">
                      {item.isAnonim ? "🔒 KIRIM ANONIM" : item.nama || "MAHASISWA SI"}
                    </span>
                    {item.email && !item.isAnonim && (
                      <span className="text-xs font-mono text-slate-500">({item.email})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-500">{item.tanggal}</span>

                    <select
                      disabled={isLoading}
                      value={item.status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          item.id,
                          e.target.value as "Baru" | "Diproses" | "Selesai"
                        )
                      }
                      className="px-3 py-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-black font-mono uppercase tracking-wider border border-slate-950 cursor-pointer"
                    >
                      <option value="Baru">🔴 BARU</option>
                      <option value="Diproses">🟡 DIPROSES</option>
                      <option value="Selesai">🟢 SELESAI</option>
                    </select>

                    <button
                      disabled={isLoading}
                      onClick={() => setDeleteTargetId(item.id)}
                      className="p-1.5 bg-[#C8102E] text-white border border-slate-950 cursor-pointer hover:bg-slate-950 transition-colors disabled:opacity-50"
                      title="Hapus Aspirasi"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium leading-relaxed">
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
