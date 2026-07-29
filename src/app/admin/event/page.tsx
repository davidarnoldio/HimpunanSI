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
  CheckCircle2,
  Check,
} from "lucide-react";
import { useSharedStore, getValidImageUrl } from "@/lib/sharedStore";
import { type EventAdminItem } from "@/data/adminMockData";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";

export default function CRUDEventPage() {
  const { events, setEvents } = useSharedStore();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Semua");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventAdminItem | null>(null);

  // Custom Delete Modal State
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

  const filteredItems = events.filter((item) => {
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.tanggal) return;

    const finalBannerUrl = getValidImageUrl(formData.bannerUrl, formData.title);

    if (editingItem) {
      const updated = events.map((i) =>
        i.id === editingItem.id ? { ...i, ...formData, bannerUrl: finalBannerUrl } : i
      );
      setEvents(updated);
    } else {
      const newItem: EventAdminItem = {
        id: `e_${Date.now()}`,
        ...formData,
        bannerUrl: finalBannerUrl,
      };
      setEvents([newItem, ...events]);
    }
    setIsModalOpen(false);
  };

  // Permanent Delete Event Action
  const confirmDelete = () => {
    if (deleteTargetId) {
      const updated = events.filter((i) => i.id !== deleteTargetId);
      setEvents(updated);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Kelola Event & Proker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Atur jadwal event, status pendaftaran, dan link Google Form (Penghapusan tersimpan permanen di Website Utama).
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-900/20 transition-all cursor-pointer"
        >
          <Plus size={16} /> Buat Event Baru
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["Semua", "Pendaftaran Dibuka", "Segera Hadir", "Selesai"].map((st) => (
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
            placeholder="Cari event / deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Table List Event */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold bg-slate-50/50 dark:bg-slate-900/50">
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-3">Waktu & Lokasi</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Link Form</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getValidImageUrl(item.bannerUrl, item.title)}
                        alt={item.title}
                        className="w-16 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                          {item.kategori}
                        </span>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-1">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 space-y-1">
                    <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                      <Calendar size={12} /> {item.tanggal}
                    </div>
                    <div className="flex items-center gap-1 text-[11px]">
                      <MapPin size={12} /> {item.lokasi}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      item.status === "Pendaftaran Dibuka"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                        : "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                    }`}>
                      {item.status === "Pendaftaran Dibuka" ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    {item.linkPendaftaran ? (
                      <a
                        href={item.linkPendaftaran}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-bold hover:underline"
                      >
                        Form Link <ExternalLink size={11} />
                      </a>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Edit Event"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Hapus Event"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Event */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {editingItem ? "Edit Data Event" : "Buat Event Baru"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Judul Event *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500"
                    placeholder="Judul Workshop / Webinar / Lomba"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                    <select
                      value={formData.kategori}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="Workshop">Workshop</option>
                      <option value="Lomba">Lomba</option>
                      <option value="Webinar">Webinar</option>
                      <option value="Event Himpunan">Event Himpunan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status Pendaftaran</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="Pendaftaran Dibuka">Pendaftaran Dibuka</option>
                      <option value="Segera Hadir">Segera Hadir</option>
                      <option value="Berlangsung">Berlangsung</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tanggal *</label>
                    <input
                      type="date"
                      required
                      value={formData.tanggal}
                      onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Waktu</label>
                    <input
                      type="text"
                      value={formData.waktu}
                      onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500"
                      placeholder="09:00 WIB"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Lokasi / Platform</label>
                  <input
                    type="text"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500"
                    placeholder="Zoom Meeting / Auditorium Kampus E"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Link Form Pendaftaran</label>
                  <input
                    type="url"
                    value={formData.linkPendaftaran}
                    onChange={(e) => setFormData({ ...formData, linkPendaftaran: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500"
                    placeholder="https://forms.gle/..."
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Deskripsi Ringkas</label>
                  <textarea
                    rows={3}
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500"
                    placeholder="Penjelasan singkat mengenai event..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-md shadow-red-900/20"
                  >
                    <Check size={14} /> Simpan Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTargetId)}
        title="Hapus Data Event"
        description="Apakah Anda yakin ingin menghapus data event ini? Data akan terhapus secara permanen dan tidak akan muncul kembali saat web di-refresh."
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
