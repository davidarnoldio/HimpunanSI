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
  Clock,
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Kelola Event & Program Kerja
          </h1>
          <p className="text-xs text-slate-500">
            Tambah, edit, dan atur publikasi kegiatan HIMSI UG (Tersinkronisasi 100% dengan Supabase DB).
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-900/20 transition-all cursor-pointer"
        >
          <Plus size={16} /> Tambah Event Baru
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama event..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Filter Status Pills */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {["Semua", "Pendaftaran Dibuka", "Segera Hadir", "Berlangsung", "Selesai"].map((st) => (
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

      {/* Event Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
          <Calendar size={40} className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada data event</p>
          <p className="text-xs text-slate-500">Klik &quot;Tambah Event Baru&quot; untuk menambahkan event pertama.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isPendaftaran = item.status === "Pendaftaran Dibuka";
            const isBerlangsung = item.status === "Berlangsung";
            const isSelesai = item.status === "Selesai";

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Banner Thumbnail */}
                <div className="relative h-44 bg-slate-950 overflow-hidden shrink-0">
                  <img
                    src={getValidImageUrl(item.bannerUrl, item.title)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Kategori Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold border border-white/10 uppercase tracking-wider">
                      {item.kategori}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border shadow-sm ${
                        isPendaftaran
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 backdrop-blur-md"
                          : isBerlangsung
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/40 backdrop-blur-md"
                          : isSelesai
                          ? "bg-slate-500/20 text-slate-400 border-slate-500/40 backdrop-blur-md"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/40 backdrop-blur-md"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.deskripsi}
                    </p>

                    <div className="pt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-red-500 shrink-0" />
                        <span>{item.tanggal}</span>
                        {item.waktu && <span className="text-slate-400">• {item.waktu}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-red-500 shrink-0" />
                        <span className="truncate">{item.lokasi}</span>
                        {item.isOnline && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold">
                            Online
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    {item.linkPendaftaran ? (
                      <a
                        href={item.linkPendaftaran}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1"
                      >
                        Link Formulir <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Tanpa Link</span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                        title="Edit Event"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(item.id)}
                        className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    {editingItem ? "Edit Data Event" : "Tambah Event Baru"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data event akan langsung disinkronkan ke database Supabase.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer transition-colors ml-3 shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
                {/* Scrollable Fields */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">
                      Judul Event / Proker *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Workshop AI & Machine Learning 2025"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 font-semibold text-sm transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">
                        Kategori Event
                      </label>
                      <select
                        value={formData.kategori}
                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 font-semibold text-sm transition-colors"
                      >
                        <option value="Workshop">Workshop</option>
                        <option value="Webinar">Webinar</option>
                        <option value="Lomba">Lomba</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Internal Proker">Internal Proker</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">
                        Status Event
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as EventAdminItem["status"],
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 font-semibold text-sm transition-colors"
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
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">
                        Tanggal Kegiatan *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.tanggal}
                        onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                        placeholder="e.g. 15 Oktober 2025"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 font-semibold text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">
                        Waktu (Opsional)
                      </label>
                      <input
                        type="text"
                        value={formData.waktu}
                        onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                        placeholder="e.g. 09:00 - 12:00 WIB"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 font-semibold text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">
                        Lokasi Kegiatan
                      </label>
                      <input
                        type="text"
                        value={formData.lokasi}
                        onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                        placeholder="e.g. Zoom Meeting / Auditorium Kampus J"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 font-semibold text-sm transition-colors"
                      />
                    </div>

                    {/* Instant Online Checkbox Toggle */}
                    <div className="pt-4 sm:pt-5">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.isOnline}
                          onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                          className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                        />
                        <span className="font-extrabold text-xs text-slate-700 dark:text-slate-300">
                          Event Online
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">
                      URL Banner Image
                    </label>
                    <input
                      type="url"
                      value={formData.bannerUrl}
                      onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 font-mono text-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">
                      Link Pendaftaran / Form (Opsional)
                    </label>
                    <input
                      type="url"
                      value={formData.linkPendaftaran}
                      onChange={(e) => setFormData({ ...formData, linkPendaftaran: e.target.value })}
                      placeholder="https://forms.gle/..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 font-mono text-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">
                      Deskripsi Event
                    </label>
                    <textarea
                      rows={3}
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                      placeholder="Penjelasan singkat mengenai acara, pembicara, materi, atau benefit..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 font-medium text-sm leading-relaxed resize-none transition-colors"
                    />
                  </div>
                </div>

                {/* Sticky Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-3xl shrink-0">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.title.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-900/20 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Menyimpan Event...</span>
                      </>
                    ) : (
                      <>
                        <Check size={15} /> Simpan Event
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
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
