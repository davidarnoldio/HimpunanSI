"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Calendar,
  MapPin,
  ExternalLink,
  Check,
} from "lucide-react";
import { useSharedStore, getValidImageUrl } from "@/lib/sharedStore";
import { type EventAdminItem } from "@/data/adminMockData";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { saveEventsAction } from "@/app/actions/adminActions";

interface AdminEventClientProps {
  initialEvents: EventAdminItem[];
}

export function AdminEventClient({ initialEvents }: AdminEventClientProps) {
  const { events, setEvents, mounted } = useSharedStore();
  const activeEvents = mounted ? events : initialEvents;

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Semua");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventAdminItem | null>(null);

  // Loading & Delete State
  const [isLoading, setIsLoading] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<EventAdminItem, "id">>({
    title: "",
    kategori: "Workshop",
    tanggal: "",
    waktu: "",
    lokasi: "",
    isOnline: true,
    status: "Pendaftaran Dibuka",
    deskripsi: "",
    bannerUrl: "",
    linkPendaftaran: "",
  });

  const filteredItems = activeEvents.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Semua" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleOpenModal = (item?: EventAdminItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        kategori: item.kategori,
        tanggal: item.tanggal,
        waktu: item.waktu,
        lokasi: item.lokasi,
        isOnline: item.isOnline,
        status: item.status,
        deskripsi: item.deskripsi,
        bannerUrl: item.bannerUrl || "",
        linkPendaftaran: item.linkPendaftaran || "",
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        kategori: "Workshop",
        tanggal: "2025-09-01",
        waktu: "09:00 WIB",
        lokasi: "Zoom Meeting",
        isOnline: true,
        status: "Pendaftaran Dibuka",
        deskripsi: "",
        bannerUrl: "https://placehold.co/800x450/0f172a/ef4444?text=Event+HIMSI",
        linkPendaftaran: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.tanggal.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const finalBannerUrl = getValidImageUrl(formData.bannerUrl, formData.title);

      let updated: EventAdminItem[];
      if (editingItem) {
        updated = activeEvents.map((i) =>
          i.id === editingItem.id ? { ...i, ...formData, bannerUrl: finalBannerUrl } : i
        );
      } else {
        const newItem: EventAdminItem = {
          id: `e_${Date.now()}`,
          ...formData,
          bannerUrl: finalBannerUrl,
        };
        updated = [newItem, ...activeEvents];
      }

      setEvents(updated);
      await saveEventsAction(updated);
      setIsModalOpen(false);
    } catch (err) {
      console.error("[AdminEvent] Save error:", err);
      alert("Gagal menyimpan data event ke database. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId || isLoading) return;
    setIsLoading(true);

    try {
      const updated = activeEvents.filter((i) => i.id !== deleteTargetId);
      setEvents(updated);
      setDeleteTargetId(null);
      await saveEventsAction(updated);
    } catch (err) {
      console.error("[AdminEvent] Delete error:", err);
      alert("Gagal menghapus event dari database.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-slate-950 dark:border-white/20 pb-4">
        <div>
          <h1 className="text-2xl font-black font-heading uppercase tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
            <Calendar size={24} className="text-[#C8102E] dark:text-[#E31B3B]" />
            KELOLA EVENT & PROGRAM KERJA
          </h1>
          <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 mt-0.5">
            Tambah, edit, dan atur publikasi kegiatan HIMSI UG (Tersinkronisasi 100% dengan Supabase DB).
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C8102E] dark:bg-[#E31B3B] text-white font-black font-mono text-xs uppercase tracking-widest border-2 border-slate-950 hover:bg-slate-950 transition-colors cursor-pointer shrink-0"
        >
          <Plus size={16} /> TAMBAH EVENT BARU
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-950 dark:text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama event..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-xs font-bold focus:outline-none focus:border-[#C8102E] text-slate-950 dark:text-white"
          />
        </div>

        {/* Filter Status Pills */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {["Semua", "Pendaftaran Dibuka", "Segera Hadir", "Berlangsung", "Selesai"].map((st) => (
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

      {/* Event Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20">
          <Calendar size={40} className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-black font-heading uppercase text-slate-950 dark:text-white">Belum ada data event</p>
          <p className="text-xs font-mono font-bold text-slate-500">Klik &quot;Tambah Event Baru&quot; untuk menambahkan event pertama.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 overflow-hidden hover:shadow-[4px_4px_0px_0px_rgba(200,16,46,1)] transition-all flex flex-col justify-between"
              >
                {/* Banner Thumbnail */}
                <div className="relative h-44 bg-slate-950 border-b-2 border-slate-950 dark:border-white/20 overflow-hidden shrink-0">
                  <img
                    src={getValidImageUrl(item.bannerUrl, item.title)}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-slate-950 text-white text-[10px] font-black font-mono border border-slate-950 uppercase tracking-wider">
                      {item.kategori}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-[#C8102E] text-white text-[10px] font-black font-mono border border-slate-950 uppercase tracking-wider">
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-black font-heading text-base text-slate-950 dark:text-white uppercase line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
                      {item.deskripsi}
                    </p>

                    <div className="pt-2 space-y-1.5 text-xs text-slate-800 dark:text-slate-200 font-mono font-bold">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-[#C8102E] dark:text-[#E31B3B] shrink-0" />
                        <span>{item.tanggal}</span>
                        {item.waktu && <span className="text-slate-500">• {item.waktu}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-[#C8102E] dark:text-[#E31B3B] shrink-0" />
                        <span className="truncate">{item.lokasi}</span>
                        {item.isOnline && (
                          <span className="px-1.5 py-0.5 bg-slate-950 text-white text-[9px] font-mono font-black uppercase border border-slate-950">
                            ONLINE
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t-2 border-slate-950/20 dark:border-white/20 flex items-center justify-between">
                    {item.linkPendaftaran ? (
                      <a
                        href={item.linkPendaftaran}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono font-black text-[#C8102E] dark:text-[#E31B3B] uppercase hover:underline inline-flex items-center gap-1"
                      >
                        LINK FORMULIR <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono italic uppercase">Tanpa Link</span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950 cursor-pointer hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors"
                        title="Edit Event"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(item.id)}
                        className="p-2 bg-[#C8102E] text-white border border-slate-950 cursor-pointer hover:bg-slate-950 transition-colors"
                        title="Hapus Event"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 shadow-[6px_6px_0px_0px_rgba(200,16,46,1)] flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b-2 border-slate-950 dark:border-white/20 shrink-0">
                <div>
                  <h2 className="text-lg font-black font-heading uppercase text-slate-950 dark:text-white">
                    {editingItem ? "EDIT DATA EVENT" : "TAMBAH EVENT BARU"}
                  </h2>
                  <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                    Data event akan langsung disinkronkan ke database Supabase.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950 cursor-pointer transition-colors ml-3 shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
                  <div>
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                      JUDUL EVENT / PROKER *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Workshop AI & Machine Learning 2025"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                        KATEGORI EVENT
                      </label>
                      <select
                        value={formData.kategori}
                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold text-sm"
                      >
                        <option value="Workshop">Workshop</option>
                        <option value="Webinar">Webinar</option>
                        <option value="Lomba">Lomba</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Internal Proker">Internal Proker</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                        STATUS EVENT
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as EventAdminItem["status"],
                          })
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold text-sm"
                      >
                        <option value="Pendaftaran Dibuka">Pendaftaran Dibuka</option>
                        <option value="Segera Hadir">Segera Hadir</option>
                        <option value="Berlangsung">Berlangsung</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                        TANGGAL KEGIATAN *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.tanggal}
                        onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                        placeholder="e.g. 15 Oktober 2025"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                        WAKTU (OPSIONAL)
                      </label>
                      <input
                        type="text"
                        value={formData.waktu}
                        onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                        placeholder="e.g. 09:00 - 12:00 WIB"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                        LOKASI KEGIATAN
                      </label>
                      <input
                        type="text"
                        value={formData.lokasi}
                        onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                        placeholder="e.g. Zoom Meeting / Auditorium Kampus J"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold text-sm"
                      />
                    </div>

                    <div className="pt-4 sm:pt-5">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.isOnline}
                          onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                          className="w-4 h-4 text-[#C8102E] border-2 border-slate-950 cursor-pointer"
                        />
                        <span className="font-black font-mono text-xs uppercase text-slate-950 dark:text-white">
                          EVENT ONLINE
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                      URL BANNER IMAGE
                    </label>
                    <input
                      type="url"
                      value={formData.bannerUrl}
                      onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                      LINK PENDAFTARAN / FORM (OPSIONAL)
                    </label>
                    <input
                      type="url"
                      value={formData.linkPendaftaran}
                      onChange={(e) => setFormData({ ...formData, linkPendaftaran: e.target.value })}
                      placeholder="https://forms.gle/..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                      DESKRIPSI EVENT
                    </label>
                    <textarea
                      rows={3}
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                      placeholder="Penjelasan singkat mengenai acara..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-medium text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t-2 border-slate-950 dark:border-white/20 bg-white dark:bg-slate-950 shrink-0">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white font-black font-mono text-xs uppercase tracking-wider border-2 border-slate-950 hover:bg-slate-300 transition-colors cursor-pointer"
                  >
                    BATAL
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.title.trim()}
                    className="px-6 py-2.5 bg-[#C8102E] dark:bg-[#E31B3B] hover:bg-slate-950 text-white font-black font-mono text-xs uppercase tracking-widest border-2 border-slate-950 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin" />
                        <span>MENYIMPAN...</span>
                      </>
                    ) : (
                      <>
                        <Check size={15} /> SIMPAN EVENT
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDeleteModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        title="Hapus Data Event"
        description="Apakah Anda yakin ingin menghapus event ini secara permanen dari Supabase Database?"
      />
    </div>
  );
}
