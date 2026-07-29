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
} from "lucide-react";
import { useSharedStore, convertFileToBase64, getValidImageUrl } from "@/lib/sharedStore";
import type { AnggotaDivisiItem } from "@/data/adminMockData";

function hasRealPhoto(fotoUrl?: string | null): boolean {
  if (!fotoUrl || typeof fotoUrl !== "string" || fotoUrl.trim() === "") return false;
  return !fotoUrl.trim().includes("placehold.co");
}

export default function AdminAnggotaDivisiPage() {
  const { anggotaDivisi, setAnggotaDivisi, divisiData } = useSharedStore();

  const [selectedDivisiFilter, setSelectedDivisiFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnggotaDivisiItem | null>(null);

  // Form State
  const [nama, setNama] = useState("");
  const [npm, setNpm] = useState("");
  const [divisiId, setDivisiId] = useState("akademik");
  const [role, setRole] = useState<"Ketua Divisi" | "Anggota Divisi">("Anggota Divisi");
  const [jabatanBadge, setJabatanBadge] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [periode, setPeriode] = useState("2025/2026");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const filteredMembers =
    selectedDivisiFilter === "ALL"
      ? anggotaDivisi
      : anggotaDivisi.filter((a) => a.divisiId === selectedDivisiFilter);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setNama("");
    setNpm("");
    setDivisiId("akademik");
    setRole("Anggota Divisi");
    setJabatanBadge("Staff Divisi");
    setFotoUrl("");
    setPeriode("2025/2026");
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
    setJabatanBadge(item.jabatanBadge || "");
    setFotoUrl(item.fotoUrl || "");
    setPeriode(item.periode || "2025/2026");
    setInstagram(item.instagram || "");
    setLinkedin(item.linkedin || "");
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await convertFileToBase64(file);
      setFotoUrl(base64);
      showToast("Foto profil anggota berhasil diunggah.");
    } catch (err) {
      console.error(err);
      alert("Gagal memuat gambar.");
    }
  };

  const handleDelete = (id: string, namaAnggota: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data anggota ${namaAnggota}?`)) {
      const updated = anggotaDivisi.filter((a) => a.id !== id);
      setAnggotaDivisi(updated);
      showToast(`Anggota ${namaAnggota} berhasil dihapus.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      // Update
      const updated = anggotaDivisi.map((a) =>
        a.id === editingItem.id
          ? {
              ...a,
              nama,
              npm,
              divisiId,
              role,
              jabatanBadge: jabatanBadge.trim() || (role === "Ketua Divisi" ? "Ketua Divisi" : "Staff Divisi"),
              fotoUrl,
              periode,
              instagram,
              linkedin,
            }
          : a
      );
      setAnggotaDivisi(updated);
      showToast(`Data ${nama} berhasil diperbarui.`);
    } else {
      // Create new
      const newItem: AnggotaDivisiItem = {
        id: "ang_" + Date.now(),
        nama,
        npm,
        divisiId,
        role,
        jabatanBadge: jabatanBadge.trim() || (role === "Ketua Divisi" ? "Ketua Divisi" : "Staff Divisi"),
        fotoUrl,
        periode,
        instagram,
        linkedin,
      };
      setAnggotaDivisi([...anggotaDivisi, newItem]);
      showToast(`Anggota baru ${nama} berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
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
            <Users className="text-red-600 dark:text-red-500" size={22} />
            Pengelolaan Anggota & Staff Divisi
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola data Ketua & Anggota Divisi secara dinamis dengan pilihan Role dan Foto dari perangkat.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-900/20 transition-all cursor-pointer"
        >
          <Plus size={16} /> Tambah Anggota Baru
        </button>
      </div>

      {/* Filter Divisi Bar */}
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <span className="text-xs font-bold text-slate-500 px-3 flex items-center gap-1">
          <Filter size={14} /> Divisi:
        </span>
        <button
          onClick={() => setSelectedDivisiFilter("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${
            selectedDivisiFilter === "ALL"
              ? "bg-red-600 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          Semua Divisi ({anggotaDivisi.length})
        </button>
        {divisiData.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDivisiFilter(d.id)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${
              selectedDivisiFilter === d.id
                ? "bg-red-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            {d.singkatan}
          </button>
        ))}
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMembers.map((item) => {
          const divInfo = divisiData.find((d) => d.id === item.divisiId);

          return (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-4 hover:border-red-500/40 transition-all"
            >
              <div className="space-y-3 text-center">
                {/* Role Badge */}
                <div className="flex justify-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 border ${
                      item.role === "Ketua Divisi"
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {item.role === "Ketua Divisi" && <Crown size={12} />}
                    {item.jabatanBadge || item.role}
                  </span>
                </div>

                {/* Photo */}
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                  {hasRealPhoto(item.fotoUrl) ? (
                    <img
                      src={item.fotoUrl}
                      alt={item.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500 space-y-1">
                      <User size={40} />
                      <span className="text-[10px] font-semibold">Foto Belum Ada</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 truncate">
                    {item.nama}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {divInfo ? divInfo.nama : item.divisiId.toUpperCase()} • {item.periode || "2025/2026"}
                  </p>
                  {item.npm && <p className="text-[11px] font-mono text-slate-400 mt-0.5">NPM: {item.npm}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
                  title="Edit Anggota"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.nama)}
                  className="p-2 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
                  title="Hapus Anggota"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 z-10 max-h-[90vh] overflow-y-auto text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {editingItem ? "Edit Data Anggota Divisi" : "Tambah Anggota Divisi"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Anggota Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dimas Prasetyo"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">NPM</label>
                    <input
                      type="text"
                      placeholder="14121001"
                      value={npm}
                      onChange={(e) => setNpm(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Divisi Target</label>
                    <select
                      value={divisiId}
                      onChange={(e) => setDivisiId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-red-500"
                    >
                      {divisiData.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.nama} ({d.singkatan})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ROLE DROPDOWN */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Role Jabatan</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as "Ketua Divisi" | "Anggota Divisi")}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-red-500"
                    >
                      <option value="Anggota Divisi">Anggota Divisi</option>
                      <option value="Ketua Divisi">Ketua Divisi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Badge Jabatan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Staff Akademik"
                      value={jabatanBadge}
                      onChange={(e) => setJabatanBadge(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Upload Foto */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Foto Profil</label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-20 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      {hasRealPhoto(fotoUrl) ? (
                        <img src={getValidImageUrl(fotoUrl)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-slate-500" />
                      )}
                    </div>
                    <label className="flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 cursor-pointer bg-slate-50 dark:bg-slate-800/50">
                      <Upload size={18} className="text-slate-400 mb-1" />
                      <span className="text-slate-600 dark:text-slate-300 font-semibold">Pilih Foto dari Galeri</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Link Instagram</label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/username"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Link LinkedIn</label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/username"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-lg"
                  >
                    {editingItem ? "Simpan Perubahan" : "Tambah Anggota"}
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
