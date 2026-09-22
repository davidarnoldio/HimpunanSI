"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  User,
  Upload,
  Crown,
  Filter,
  Check,
  RotateCw,
} from "lucide-react";
import { useSharedStore, convertFileToBase64, getValidImageUrl, rotateBase64Image } from "@/lib/sharedStore";
import type { AnggotaDivisiItem, DivisiAdminItem } from "@/data/adminMockData";
import { saveAnggotaDivisiAction } from "@/app/actions/adminActions";

interface AdminAnggotaDivisiClientProps {
  initialAnggota: AnggotaDivisiItem[];
  initialDivisi: DivisiAdminItem[];
}

export function AdminAnggotaDivisiClient({
  initialAnggota,
  initialDivisi,
}: AdminAnggotaDivisiClientProps) {
  const { pengurus, anggotaDivisi, setAnggotaDivisi, divisiData, mounted } = useSharedStore();

  const activeBphPeriode = pengurus.find((p) => p.divisi === "BPH" && p.periode)?.periode || "2026/2027";
  const activeAnggotaList = mounted && anggotaDivisi && anggotaDivisi.length > 0 ? anggotaDivisi : initialAnggota;
  const activeDivisiList = mounted && divisiData && divisiData.length > 0 ? divisiData : initialDivisi;

  const [selectedDivisiFilter, setSelectedDivisiFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnggotaDivisiItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [nama, setNama] = useState("");
  const [npm, setNpm] = useState("");
  const [divisiId, setDivisiId] = useState("akademik");
  const [role, setRole] = useState<"Ketua Divisi" | "Wakil Ketua Divisi" | "Anggota Divisi">("Anggota Divisi");
  const [jabatanBadge, setJabatanBadge] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [periode, setPeriode] = useState(activeBphPeriode);
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const filteredMembers =
    selectedDivisiFilter === "ALL"
      ? activeAnggotaList
      : activeAnggotaList.filter((a) => a.divisiId === selectedDivisiFilter);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setNama("");
    setNpm("");
    setDivisiId("akademik");
    setRole("Anggota Divisi");
    setJabatanBadge("Staff Divisi");
    setFotoUrl("");
    setPeriode(activeBphPeriode);
    setInstagram("");
    setLinkedin("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AnggotaDivisiItem) => {
    setEditingItem(item);
    setNama(item.nama);
    setNpm(item.npm || "");
    setDivisiId(item.divisiId);
    setRole(item.role);

    // Auto sanitize badge based on role
    if (item.role === "Ketua Divisi") {
      setJabatanBadge(item.jabatanBadge && item.jabatanBadge.toLowerCase().includes("kadiv") ? item.jabatanBadge : "Kadiv");
    } else if (item.role === "Wakil Ketua Divisi") {
      setJabatanBadge(item.jabatanBadge && item.jabatanBadge.toLowerCase().includes("wakadiv") ? item.jabatanBadge : "Wakadiv");
    } else {
      setJabatanBadge("Staff Divisi");
    }

    setFotoUrl(item.fotoUrl || "");
    setPeriode(item.periode || activeBphPeriode);
    setInstagram(item.instagram || "");
    setLinkedin(item.linkedin || "");
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      alert(`Ukuran foto terlalu besar (${sizeMB} MB). Ukuran maksimal foto adalah 2 MB.`);
      return;
    }

    try {
      const base64 = await convertFileToBase64(file);
      setFotoUrl(base64);
      showToast("Foto profil anggota berhasil diunggah.");
    } catch (err) {
      console.error(err);
      alert("Gagal membaca foto dari perangkat. Coba file gambar lain.");
    }
  };

  const handleRotatePhoto = async () => {
    if (!fotoUrl) return;
    try {
      const rotated = await rotateBase64Image(fotoUrl, 90);
      setFotoUrl(rotated);
      showToast("Foto berhasil diputar 90°.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, namaAnggota: string) => {
    if (isLoading) return;
    if (confirm(`Apakah Anda yakin ingin menghapus data anggota ${namaAnggota}?`)) {
      setIsLoading(true);
      try {
        const updated = activeAnggotaList.filter((a) => a.id !== id);
        setAnggotaDivisi(updated);
        await saveAnggotaDivisiAction(updated);
        showToast(`Anggota ${namaAnggota} berhasil dihapus.`);
      } catch (err) {
        console.error("[AdminAnggotaDivisi] Delete error:", err);
        alert("Gagal menghapus anggota.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const finalFoto = getValidImageUrl(fotoUrl, nama);

      let updated: AnggotaDivisiItem[];
      if (editingItem) {
        updated = activeAnggotaList.map((a) =>
          a.id === editingItem.id
            ? {
                ...a,
                nama,
                npm,
                divisiId,
                role,
                jabatanBadge,
                fotoUrl: finalFoto,
                periode,
                instagram,
                linkedin,
              }
            : a
        );
      } else {
        const newItem: AnggotaDivisiItem = {
          id: `ang_${Date.now()}`,
          divisiId,
          nama,
          npm,
          role,
          jabatanBadge,
          fotoUrl: finalFoto,
          periode,
          instagram,
          linkedin,
        };
        updated = [...activeAnggotaList, newItem];
      }

      setAnggotaDivisi(updated);
      await saveAnggotaDivisiAction(updated);
      showToast(editingItem ? "Data anggota diperbarui!" : "Anggota baru berhasil ditambahkan!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("[AdminAnggotaDivisi] Save error:", err);
      alert("Gagal menyimpan data anggota ke database.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 bg-[#C8102E] text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20">
        <div>
          <h1 className="text-xl font-black font-heading uppercase tracking-tight text-slate-950 dark:text-white flex items-center gap-2.5">
            <Users size={22} className="text-[#C8102E] dark:text-[#E31B3B]" />
            KELOLA ANGGOTA & STAFF DIVISI HIMASI
          </h1>
          <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-0.5">
            Tambah, edit, dan atur jajaran anggota staff per divisi — tersinkronisasi otomatis dengan periode aktif ({activeBphPeriode}).
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C8102E] dark:bg-[#E31B3B] hover:bg-slate-950 dark:hover:bg-white dark:hover:text-slate-950 text-white font-black font-mono text-xs uppercase tracking-wider border-2 border-slate-950 transition-all cursor-pointer shrink-0 shadow-[3px_3px_0px_0px_rgba(10,10,10,1)]"
        >
          <Plus size={16} /> TAMBAH ANGGOTA BARU
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 flex flex-wrap items-center gap-3 overflow-x-auto">
        <span className="text-xs font-mono font-black uppercase text-slate-500 flex items-center gap-1 shrink-0">
          <Filter size={13} /> FILTER DIVISI:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDivisiFilter("ALL")}
            className={`px-3 py-1.5 font-mono text-xs font-black uppercase border border-slate-950 transition-all cursor-pointer shrink-0 ${
              selectedDivisiFilter === "ALL"
                ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            SEMUA DIVISI ({activeAnggotaList.length})
          </button>
          {activeDivisiList.map((d) => {
            const count = activeAnggotaList.filter((a) => a.divisiId === d.id).length;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDivisiFilter(d.id)}
                className={`px-3 py-1.5 font-mono text-xs font-black uppercase border border-slate-950 transition-all cursor-pointer shrink-0 ${
                  selectedDivisiFilter === d.id
                    ? "bg-[#C8102E] text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {d.singkatan} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border-2 border-dashed border-slate-950 dark:border-white/20">
          <User size={40} className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-black font-mono uppercase text-slate-950 dark:text-white">
            BELUM ADA DATA ANGGOTA
          </p>
          <p className="text-xs font-mono text-slate-500 mt-1">
            Klik &quot;Tambah Anggota Baru&quot; untuk memasukkan anggota divisi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMembers.map((member) => {
            const divInfo = activeDivisiList.find((d) => d.id === member.divisiId);
            const isKadiv = member.role === "Ketua Divisi";
            const isWakadiv = member.role === "Wakil Ketua Divisi";
            const memberPeriode = member.periode || activeBphPeriode;

            return (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group bg-white dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 overflow-hidden hover:shadow-[4px_4px_0px_0px_rgba(200,16,46,1)] transition-all flex flex-col justify-between"
              >
                <div className="p-5 space-y-3 text-center flex-1">
                  <div className="relative w-20 h-20 mx-auto border-2 border-slate-950 overflow-hidden bg-slate-950">
                    <img
                      src={getValidImageUrl(member.fotoUrl, member.nama)}
                      alt={member.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isKadiv && (
                      <span className="absolute top-1 right-1 p-1 bg-amber-400 text-slate-950 font-bold border border-slate-950 shadow-sm" title="Ketua Divisi (Kadiv)">
                        <Crown size={12} />
                      </span>
                    )}
                    {isWakadiv && (
                      <span className="absolute top-1 right-1 p-1 bg-sky-400 text-slate-950 font-bold border border-slate-950 shadow-sm" title="Wakil Ketua Divisi (Wakadiv)">
                        <Users size={12} />
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-black font-heading text-sm text-slate-950 dark:text-white uppercase truncate">
                      {member.nama}
                    </h3>
                    <p className="text-xs font-mono font-bold text-[#C8102E] dark:text-[#E31B3B]">
                      {isKadiv ? "Ketua Divisi (Kadiv)" : isWakadiv ? "Wakil Ketua Divisi (Wakadiv)" : "Anggota Staff Divisi"}
                    </p>
                    <span className="inline-block text-[10px] font-mono font-bold uppercase text-slate-950 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 border border-slate-950">
                      Divisi {divInfo?.singkatan || member.divisiId.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-t-2 border-slate-950 dark:border-white/20 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(member)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950 cursor-pointer text-xs font-mono font-black uppercase hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors"
                  >
                    <Pencil size={12} /> EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(member.id, member.nama)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#C8102E] text-white border border-slate-950 cursor-pointer text-xs font-mono font-black uppercase hover:bg-slate-950 transition-colors"
                  >
                    <Trash2 size={12} /> HAPUS
                  </button>
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 p-6 sm:p-8 space-y-6 my-8 shadow-[8px_8px_0px_0px_rgba(200,16,46,1)] flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b-2 border-slate-950 dark:border-white/20 shrink-0">
                <h2 className="text-lg font-black font-heading uppercase text-slate-950 dark:text-white">
                  {editingItem ? "EDIT DATA ANGGOTA" : "TAMBAH ANGGOTA DIVISI BARU"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950 hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0 overflow-y-auto space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-mono font-black uppercase text-xs text-slate-950 dark:text-white mb-1">
                    Nama Lengkap Anggota *
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="e.g. Ahmad Fauzi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono font-black uppercase text-xs text-slate-950 dark:text-white mb-1">
                      Divisi *
                    </label>
                    <select
                      value={divisiId}
                      onChange={(e) => setDivisiId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold"
                    >
                      {activeDivisiList.map((d) => (
                        <option key={d.id} value={d.id}>
                          Divisi {d.singkatan} ({d.nama})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono font-black uppercase text-xs text-slate-950 dark:text-white mb-1">
                      Peran / Role *
                    </label>
                    <select
                      value={role}
                      onChange={(e) => {
                        const newRole = e.target.value as "Ketua Divisi" | "Wakil Ketua Divisi" | "Anggota Divisi";
                        setRole(newRole);
                        if (newRole === "Ketua Divisi") setJabatanBadge("Kadiv");
                        else if (newRole === "Wakil Ketua Divisi") setJabatanBadge("Wakadiv");
                        else setJabatanBadge("Staff Divisi");
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold"
                    >
                      <option value="Anggota Divisi">Anggota Staff Divisi</option>
                      <option value="Wakil Ketua Divisi">Wakil Ketua Divisi (Wakadiv)</option>
                      <option value="Ketua Divisi">Ketua Divisi (Kadiv)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono font-black uppercase text-xs text-slate-950 dark:text-white mb-1">
                      NPM Mahasiswa (Opsional)
                    </label>
                    <input
                      type="text"
                      value={npm}
                      onChange={(e) => setNpm(e.target.value)}
                      placeholder="e.g. 14121900"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-mono text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between font-mono font-black uppercase text-xs text-slate-950 dark:text-white mb-1">
                      <span>Periode Kepengurusan</span>
                      <span className="text-[10px] text-[#C8102E] dark:text-[#E31B3B] font-bold">
                        (OTOMATIS BPH: {activeBphPeriode})
                      </span>
                    </label>
                    <input
                      type="text"
                      value={periode}
                      onChange={(e) => setPeriode(e.target.value)}
                      placeholder={activeBphPeriode}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-mono text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono font-black uppercase text-xs text-slate-950 dark:text-white mb-1">
                    Foto Profil (Maksimal 2 MB — Ambil dari Perangkat/Galeri atau URL)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={fotoUrl}
                      onChange={(e) => setFotoUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-mono text-xs font-bold"
                    />
                    <label className="px-3 py-2.5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-mono font-black text-xs uppercase border-2 border-slate-950 flex items-center gap-1.5 shrink-0 cursor-pointer hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors">
                      <Upload size={14} /> GALERI
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleRotatePhoto}
                      disabled={!fotoUrl}
                      className="px-3 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black font-mono text-xs uppercase border-2 border-slate-950 flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-40 transition-colors"
                      title="Putar Foto 90 Derajat"
                    >
                      <RotateCw size={14} /> PUTAR 90°
                    </button>
                  </div>

                  {fotoUrl && (
                    <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 flex items-center gap-4">
                      <div className="w-16 h-20 bg-slate-950 border border-slate-950 overflow-hidden shrink-0">
                        <img src={getValidImageUrl(fotoUrl, nama)} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">PREVIEW FOTO ANGGOTA</p>
                        <p className="text-[11px] font-mono text-slate-500">Jika foto miring, klik <strong className="text-amber-600 dark:text-amber-400">PUTAR 90°</strong> untuk menegakkannya.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono font-black uppercase text-xs text-slate-950 dark:text-white mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-mono text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-mono font-black uppercase text-xs text-slate-950 dark:text-white mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-mono text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t-2 border-slate-950 dark:border-white/20 shrink-0">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white font-mono font-black text-xs uppercase border-2 border-slate-950 cursor-pointer hover:bg-slate-300 transition-colors"
                  >
                    BATAL
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !nama.trim()}
                    className="px-6 py-2.5 bg-[#C8102E] dark:bg-[#E31B3B] text-white font-mono font-black text-xs uppercase tracking-wider border-2 border-slate-950 disabled:opacity-50 flex items-center gap-2 cursor-pointer hover:bg-slate-950 transition-colors shadow-[3px_3px_0px_0px_rgba(10,10,10,1)]"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin" />
                        <span>MENYIMPAN...</span>
                      </>
                    ) : (
                      <>
                        <Check size={15} /> SIMPAN ANGGOTA
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
