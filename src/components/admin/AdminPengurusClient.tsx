"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Shield,
  Upload,
  User,
  Check,
  AlertCircle,
} from "lucide-react";
import { useSharedStore, getValidImageUrl, convertFileToBase64 } from "@/lib/sharedStore";
import { type PengurusItem } from "@/data/adminMockData";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { savePengurusAction } from "@/app/actions/adminActions";

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

// ─── Constants ─────────────────────────────────────────────────────────────
const MAX_BASE64_KB = 200; // Batas aman agar payload tidak melebihi kapasitas Supabase
const JABATAN_OPTIONS = [
  "Ketua Himpunan",
  "Wakil Ketua Himpunan",
  "Sekretaris Umum 1",
  "Sekretaris Umum 2",
  "Bendahara Umum 1",
  "Bendahara Umum 2",
];

interface AdminPengurusClientProps {
  initialPengurus: PengurusItem[];
}

export function AdminPengurusClient({ initialPengurus }: AdminPengurusClientProps) {
  const router = useRouter();
  const { pengurus, setPengurus, mounted } = useSharedStore();
  const activePengurus = mounted ? pengurus : initialPengurus;

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PengurusItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fotoWarning, setFotoWarning] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const EMPTY_FORM: Omit<PengurusItem, "id"> = {
    nama: "",
    jabatan: "",
    divisi: "BPH",
    periode: "2025/2026",
    fotoUrl: "",
    visiMotto: "",
    linkedin: "",
    instagram: "",
  };

  const [formData, setFormData] = useState<Omit<PengurusItem, "id">>(EMPTY_FORM);

  const bphPengurus = activePengurus.filter((item) => item.divisi === "BPH");
  const filteredItems = bphPengurus.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.jabatan.toLowerCase().includes(search.toLowerCase())
  );

  // ─── Handle file upload with size guard ─────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Warn if file is too large — Base64 of >150KB will bloat Supabase payload
    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > MAX_BASE64_KB) {
      setFotoWarning(
        `⚠️ Foto terlalu besar (${Math.round(fileSizeKB)} KB). Disarankan pakai URL eksternal (Google Drive/Imgur) agar tidak gagal upload ke database.`
      );
    } else {
      setFotoWarning("");
    }

    try {
      const base64 = await convertFileToBase64(file);
      setFormData((prev) => ({ ...prev, fotoUrl: base64 }));
    } catch (err) {
      console.error("Gagal mengunggah foto:", err);
      setFotoWarning("Gagal membaca file foto. Coba gunakan URL gambar langsung.");
    }
  };

  // ─── Modal open helpers ──────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(EMPTY_FORM);
    setFotoWarning("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PengurusItem) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      jabatan: item.jabatan,
      divisi: "BPH",
      periode: item.periode || "2025/2026",
      fotoUrl: item.fotoUrl || "",
      visiMotto: item.visiMotto || "",
      linkedin: item.linkedin || "",
      instagram: item.instagram || "",
    });
    setFotoWarning("");
    setIsModalOpen(true);
  };

  // ─── Save handler ────────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.jabatan.trim() || isLoading) return;

    setIsLoading(true);
    try {
      // Gunakan URL placeholder jika foto tidak diisi, jangan simpan Base64 kosong
      const finalFotoUrl = getValidImageUrl(formData.fotoUrl, formData.nama);

      let updated: PengurusItem[];
      if (editingItem) {
        updated = activePengurus.map((i) =>
          i.id === editingItem.id
            ? { ...i, ...formData, divisi: "BPH", fotoUrl: finalFotoUrl }
            : i
        );
      } else {
        const newItem: PengurusItem = {
          id: `bph_${Date.now()}`,
          ...formData,
          divisi: "BPH",
          fotoUrl: finalFotoUrl,
        };
        updated = [...activePengurus, newItem];
      }

      // 1. Update shared store (instant UI update)
      setPengurus(updated);

      // 2. Sync ke Supabase DB + trigger revalidatePath("/")
      await savePengurusAction(updated);

      // 3. Refresh RSC (Server Component) agar data landing page ikut ter-update
      //    tanpa harus reload manual — Next.js router.refresh() re-fetches server data
      router.refresh();

      setIsModalOpen(false);
    } catch (err) {
      console.error("[AdminPengurus] Save error:", err);
      alert("Gagal menyimpan data BPH ke database. Pastikan koneksi internet dan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Delete handler ──────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTargetId || isLoading) return;
    setIsLoading(true);
    try {
      const updated = activePengurus.filter((i) => i.id !== deleteTargetId);
      setPengurus(updated);
      setDeleteTargetId(null);
      await savePengurusAction(updated);
      router.refresh(); // Refresh RSC setelah delete
    } catch (err) {
      console.error("[AdminPengurus] Delete error:", err);
      alert("Gagal menghapus pengurus dari database.");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Shield size={24} className="text-red-600 dark:text-red-500" />
            Kelola Pimpinan BPH
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ketua, Wakil, Sekretaris & Bendahara Umum HIMSI UG — tersinkronisasi langsung ke Beranda Utama.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-900/20 transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} /> Tambah BPH Baru
        </button>
      </div>

      {/* ── Search Bar ── */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau jabatan pimpinan BPH..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-red-500 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* ── Cards Grid / Empty State ── */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
          <User size={40} className="mx-auto text-slate-400 mb-3" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada data Pimpinan BPH</p>
          <p className="text-xs text-slate-500 mt-1">Klik &quot;Tambah BPH Baru&quot; untuk memasukkan pimpinan kabinet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-3 text-center flex-1">
                {/* Avatar */}
                <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-red-500/20 group-hover:border-red-500/60 transition-colors">
                  <img
                    src={getValidImageUrl(item.fotoUrl, item.nama)}
                    alt={item.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                    {item.nama}
                  </h3>
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">{item.jabatan}</p>
                  <span className="inline-block text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    BPH • {item.periode}
                  </span>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  {item.instagram && (
                    <a href={item.instagram} target="_blank" rel="noreferrer"
                      className="p-1.5 rounded-lg bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 hover:scale-110 transition-transform" title="Instagram">
                      <InstagramIcon size={13} />
                    </a>
                  )}
                  {item.linkedin && (
                    <a href={item.linkedin} target="_blank" rel="noreferrer"
                      className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform" title="LinkedIn">
                      <LinkedinIcon size={13} />
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-4 py-3 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button onClick={() => handleOpenEdit(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer text-xs font-bold">
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => setDeleteTargetId(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 hover:bg-red-100 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 transition-colors cursor-pointer text-xs font-bold">
                  <Trash2 size={12} /> Hapus
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── CREATE / EDIT MODAL ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    {editingItem ? "Edit Data Pimpinan BPH" : "Tambah Pimpinan BPH Baru"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data akan langsung tersinkron ke Beranda setelah disimpan.
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer transition-colors ml-3 shrink-0">
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form — scrollable body */}
              <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
                {/* Scrollable fields */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                {/* Nama Lengkap */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="e.g. Ahmad Fathir Ramadhan"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 font-semibold text-sm transition-colors"
                  />
                </div>

                {/* Jabatan — dropdown + text fallback */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Jabatan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={JABATAN_OPTIONS.includes(formData.jabatan) ? formData.jabatan : "custom"}
                    onChange={(e) => {
                      if (e.target.value !== "custom") {
                        setFormData({ ...formData, jabatan: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 font-semibold text-sm transition-colors"
                  >
                    {JABATAN_OPTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
                    <option value="custom">Lainnya (ketik manual)</option>
                  </select>
                  {/* Custom jabatan input */}
                  {!JABATAN_OPTIONS.includes(formData.jabatan) && (
                    <input
                      type="text"
                      required
                      value={formData.jabatan}
                      onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                      placeholder="Tulis jabatan manual..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-red-300 dark:border-red-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 font-semibold text-sm mt-2"
                    />
                  )}
                </div>

                {/* Periode */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Periode Kepengurusan
                  </label>
                  <input
                    type="text"
                    value={formData.periode}
                    onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                    placeholder="e.g. 2025/2026"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 font-semibold text-sm"
                  />
                </div>

                {/* Foto Profil */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Foto Profil
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.fotoUrl.startsWith("data:") ? "(File dari galeri terpilih)" : formData.fotoUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, fotoUrl: e.target.value });
                        setFotoWarning("");
                      }}
                      placeholder="https://i.imgur.com/... atau link Google Drive"
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer border border-slate-200 dark:border-slate-700 transition-colors"
                    >
                      <Upload size={14} /> Galeri
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </div>
                  {/* Foto warning */}
                  {fotoWarning && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <span>{fotoWarning}</span>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400">
                    💡 Rekomendasikan URL eksternal (Imgur, Google Drive share link) agar performa lebih stabil.
                  </p>
                </div>

                {/* Visi / Motto */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Visi / Motto (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.visiMotto || ""}
                    onChange={(e) => setFormData({ ...formData, visiMotto: e.target.value })}
                    placeholder="e.g. Bersatu, Bergerak, Berdampak untuk HIMSI UG..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 font-medium text-sm leading-relaxed resize-none"
                  />
                </div>

                {/* Sosial Media */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      <LinkedinIcon size={12} /> LinkedIn
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      <InstagramIcon size={12} /> Instagram
                    </label>
                    <input
                      type="url"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 text-xs font-mono"
                    />
                  </div>
                </div>

                </div>

                {/* Sticky footer — always visible */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-3xl shrink-0">
                  <button type="button" disabled={isLoading} onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50">
                    Batal
                  </button>
                  <button type="submit"
                    disabled={isLoading || !formData.nama.trim() || !formData.jabatan.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-900/20 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Menyimpan & Sinkronisasi...</span>
                      </>
                    ) : (
                      <>
                        <Check size={15} /> Simpan ke Beranda
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DELETE CONFIRMATION ── */}
      <ConfirmDeleteModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        title="Hapus Data BPH"
        description="Data Pimpinan BPH ini akan dihapus permanen dari Supabase Database dan tidak akan muncul di halaman Beranda."
      />
    </div>
  );
}
