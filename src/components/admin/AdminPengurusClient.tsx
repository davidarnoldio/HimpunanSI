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
      <rect x="2" y="2" width="20" height="20" rx="0" ry="0" />
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

const MAX_BASE64_KB = 200;
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > MAX_BASE64_KB) {
      setFotoWarning(
        `⚠️ Foto terlalu besar (${Math.round(fileSizeKB)} KB). Disarankan pakai URL eksternal agar tidak gagal upload.`
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.jabatan.trim() || isLoading) return;

    setIsLoading(true);
    try {
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

      setPengurus(updated);
      await savePengurusAction(updated);
      router.refresh();
      setIsModalOpen(false);
    } catch (err) {
      console.error("[AdminPengurus] Save error:", err);
      alert("Gagal menyimpan data BPH ke database. Pastikan koneksi internet dan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId || isLoading) return;
    setIsLoading(true);
    try {
      const updated = activePengurus.filter((i) => i.id !== deleteTargetId);
      setPengurus(updated);
      setDeleteTargetId(null);
      await savePengurusAction(updated);
      router.refresh();
    } catch (err) {
      console.error("[AdminPengurus] Delete error:", err);
      alert("Gagal menghapus pengurus dari database.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-slate-950 dark:border-white/20 pb-4">
        <div>
          <h1 className="text-2xl font-black font-heading uppercase tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
            <Shield size={24} className="text-[#C8102E] dark:text-[#E31B3B]" />
            KELOLA PIMPINAN BPH
          </h1>
          <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 mt-0.5">
            Ketua, Wakil, Sekretaris & Bendahara Umum HIMSI UG — tersinkronisasi langsung ke Beranda Utama.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C8102E] dark:bg-[#E31B3B] text-white font-black font-mono text-xs uppercase tracking-widest border-2 border-slate-950 hover:bg-slate-950 transition-colors cursor-pointer shrink-0"
        >
          <Plus size={16} /> TAMBAH BPH BARU
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20">
        <div className="relative w-full max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-950 dark:text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau jabatan pimpinan BPH..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-xs font-bold focus:outline-none focus:border-[#C8102E] text-slate-950 dark:text-white"
          />
        </div>
      </div>

      {/* Cards Grid / Empty State */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20">
          <User size={40} className="mx-auto text-slate-400 mb-3" />
          <p className="text-sm font-black font-heading uppercase text-slate-950 dark:text-white">Belum ada data Pimpinan BPH</p>
          <p className="text-xs font-mono font-bold text-slate-500 mt-1">Klik &quot;Tambah BPH Baru&quot; untuk memasukkan pimpinan kabinet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 overflow-hidden hover:shadow-[4px_4px_0px_0px_rgba(200,16,46,1)] transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-3 text-center flex-1">
                <div className="relative w-24 h-24 mx-auto border-2 border-slate-950 overflow-hidden bg-slate-950">
                  <img
                    src={getValidImageUrl(item.fotoUrl, item.nama)}
                    alt={item.nama}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="font-black font-heading text-sm text-slate-950 dark:text-white uppercase truncate">
                    {item.nama}
                  </h3>
                  <p className="text-xs font-mono font-bold text-[#C8102E] dark:text-[#E31B3B]">{item.jabatan}</p>
                  <span className="inline-block text-[10px] font-mono font-black uppercase text-white bg-slate-950 px-2 py-0.5 border border-slate-950">
                    BPH • {item.periode}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 pt-1">
                  {item.instagram && (
                    <a href={item.instagram} target="_blank" rel="noreferrer"
                      className="p-1.5 bg-slate-950 text-white border border-slate-950 hover:bg-[#C8102E] transition-colors" title="Instagram">
                      <InstagramIcon size={13} />
                    </a>
                  )}
                  {item.linkedin && (
                    <a href={item.linkedin} target="_blank" rel="noreferrer"
                      className="p-1.5 bg-slate-950 text-white border border-slate-950 hover:bg-[#C8102E] transition-colors" title="LinkedIn">
                      <LinkedinIcon size={13} />
                    </a>
                  )}
                </div>
              </div>

              <div className="px-4 py-3 bg-white dark:bg-slate-950 border-t-2 border-slate-950 dark:border-white/20 flex items-center justify-end gap-2">
                <button onClick={() => handleOpenEdit(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950 cursor-pointer text-xs font-black font-mono uppercase hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors">
                  <Edit2 size={12} /> EDIT
                </button>
                <button onClick={() => setDeleteTargetId(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C8102E] text-white border border-slate-950 cursor-pointer text-xs font-black font-mono uppercase hover:bg-slate-950 transition-colors">
                  <Trash2 size={12} /> HAPUS
                </button>
              </div>
            </motion.div>
          ))}
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
              className="w-full max-w-lg bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 shadow-[6px_6px_0px_0px_rgba(200,16,46,1)] flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b-2 border-slate-950 dark:border-white/20">
                <div>
                  <h2 className="text-lg font-black font-heading uppercase text-slate-950 dark:text-white">
                    {editingItem ? "EDIT DATA PIMPINAN BPH" : "TAMBAH PIMPINAN BPH BARU"}
                  </h2>
                  <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                    Data akan langsung tersinkron ke Beranda setelah disimpan.
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950 cursor-pointer transition-colors ml-3 shrink-0">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white">
                      NAMA LENGKAP *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Nama Lengkap..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white">
                      JABATAN *
                    </label>
                    <select
                      value={JABATAN_OPTIONS.includes(formData.jabatan) ? formData.jabatan : "custom"}
                      onChange={(e) => {
                        if (e.target.value !== "custom") {
                          setFormData({ ...formData, jabatan: e.target.value });
                        }
                      }}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold text-sm"
                    >
                      {JABATAN_OPTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
                      <option value="custom">Lainnya (ketik manual)</option>
                    </select>
                    {!JABATAN_OPTIONS.includes(formData.jabatan) && (
                      <input
                        type="text"
                        required
                        value={formData.jabatan}
                        onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                        placeholder="Tulis jabatan manual..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-[#C8102E] text-slate-950 dark:text-white focus:outline-none font-bold text-sm mt-2"
                      />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white">
                      PERIODE KEPENGURUSAN
                    </label>
                    <input
                      type="text"
                      value={formData.periode}
                      onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                      placeholder="e.g. 2025/2026"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white">
                      FOTO PROFIL
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.fotoUrl.startsWith("data:") ? "(File dari galeri terpilih)" : formData.fotoUrl}
                        onChange={(e) => {
                          setFormData({ ...formData, fotoUrl: e.target.value });
                          setFotoWarning("");
                        }}
                        placeholder="https://i.imgur.com/..."
                        className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-3 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black font-mono text-xs uppercase border border-slate-950 flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Upload size={14} /> GALERI
                      </button>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </div>
                    {fotoWarning && (
                      <div className="flex items-start gap-2 p-3 bg-[#C8102E] text-white text-xs font-mono font-bold">
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        <span>{fotoWarning}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white">
                      VISI / MOTTO (OPSIONAL)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.visiMotto || ""}
                      onChange={(e) => setFormData({ ...formData, visiMotto: e.target.value })}
                      placeholder="e.g. Bersatu, Bergerak, Berdampak untuk HIMSI UG..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-medium text-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white">
                        <LinkedinIcon size={12} /> LINKEDIN
                      </label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white">
                        <InstagramIcon size={12} /> INSTAGRAM
                      </label>
                      <input
                        type="url"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        placeholder="https://instagram.com/..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t-2 border-slate-950 dark:border-white/20 bg-white dark:bg-slate-950 shrink-0">
                  <button type="button" disabled={isLoading} onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white font-black font-mono text-xs uppercase tracking-wider border-2 border-slate-950 hover:bg-slate-300 transition-colors cursor-pointer">
                    BATAL
                  </button>
                  <button type="submit"
                    disabled={isLoading || !formData.nama.trim() || !formData.jabatan.trim()}
                    className="px-6 py-2.5 bg-[#C8102E] dark:bg-[#E31B3B] hover:bg-slate-950 text-white font-black font-mono text-xs uppercase tracking-widest border-2 border-slate-950 transition-colors cursor-pointer flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin" />
                        <span>MENYIMPAN...</span>
                      </>
                    ) : (
                      <>
                        <Check size={15} /> SIMPAN KE BERANDA
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
        title="Hapus Data BPH"
        description="Data Pimpinan BPH ini akan dihapus permanen dari Supabase Database dan tidak akan muncul di halaman Beranda."
      />
    </div>
  );
}
