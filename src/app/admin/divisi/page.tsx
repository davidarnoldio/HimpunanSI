"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  Award,
  BookOpen,
  Megaphone,
  Users,
  Globe,
  Code,
  Sparkles,
  Shield,
  Heart,
  Briefcase,
  User,
  Upload,
  Crown,
  Filter,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSharedStore, convertFileToBase64, getValidImageUrl } from "@/lib/sharedStore";
import type { DivisiAdminItem, AnggotaDivisiItem } from "@/data/adminMockData";

const AVAILABLE_ICONS: { name: string; icon: LucideIcon }[] = [
  { name: "Award", icon: Award },
  { name: "BookOpen", icon: BookOpen },
  { name: "Megaphone", icon: Megaphone },
  { name: "Users", icon: Users },
  { name: "Globe", icon: Globe },
  { name: "Code", icon: Code },
  { name: "Sparkles", icon: Sparkles },
  { name: "Shield", icon: Shield },
  { name: "Heart", icon: Heart },
  { name: "Briefcase", icon: Briefcase },
  { name: "Layers", icon: Layers },
];

const COLOR_THEMES = [
  { id: "red", label: "Merah", bg: "bg-red-500" },
  { id: "blue", label: "Biru", bg: "bg-blue-500" },
  { id: "violet", label: "Ungu", bg: "bg-violet-500" },
  { id: "emerald", label: "Hijau", bg: "bg-emerald-500" },
  { id: "amber", label: "Kuning", bg: "bg-amber-500" },
  { id: "cyan", label: "Cyan", bg: "bg-cyan-500" },
];

function hasRealPhoto(fotoUrl?: string | null): boolean {
  if (!fotoUrl || typeof fotoUrl !== "string" || fotoUrl.trim() === "") return false;
  return !fotoUrl.trim().includes("placehold.co");
}

export default function AdminDivisiPage() {
  const { divisiData, setDivisiData, anggotaDivisi, setAnggotaDivisi } = useSharedStore();

  // Active Division Tab for Anggota Manager
  const [activeDivisiTab, setActiveDivisiTab] = useState<string>("akademik");

  // Modals state
  const [isDivisiModalOpen, setIsDivisiModalOpen] = useState(false);
  const [editingDivisi, setEditingDivisi] = useState<DivisiAdminItem | null>(null);

  const [isAnggotaModalOpen, setIsAnggotaModalOpen] = useState(false);
  const [editingAnggota, setEditingAnggota] = useState<AnggotaDivisiItem | null>(null);

  // Divisi Form State
  const [singkatan, setSingkatan] = useState("");
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [iconName, setIconName] = useState("BookOpen");
  const [colorTheme, setColorTheme] = useState("blue");
  const [tugasInput, setTugasInput] = useState("");

  // Anggota Form State
  const [angNama, setAngNama] = useState("");
  const [angNpm, setAngNpm] = useState("");
  const [angRole, setAngRole] = useState<"Ketua Divisi" | "Anggota Divisi">("Anggota Divisi");
  const [angBadge, setAngBadge] = useState("");
  const [angFotoUrl, setAngFotoUrl] = useState("");
  const [angPeriode, setAngPeriode] = useState("2025/2026");
  const [angInstagram, setAngInstagram] = useState("");
  const [angLinkedin, setAngLinkedin] = useState("");

  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // Filter members by selected tab (NO BPH TAB HERE!)
  const filteredMembers = anggotaDivisi.filter((a) => a.divisiId === activeDivisiTab);

  // Divisi Handlers
  const handleOpenAddDivisi = () => {
    setEditingDivisi(null);
    setSingkatan("");
    setNama("");
    setDeskripsi("");
    setIconName("BookOpen");
    setColorTheme("blue");
    setTugasInput("");
    setIsDivisiModalOpen(true);
  };

  const handleOpenEditDivisi = (item: DivisiAdminItem) => {
    setEditingDivisi(item);
    setSingkatan(item.singkatan);
    setNama(item.nama);
    setDeskripsi(item.deskripsi);
    setIconName(item.iconName || "BookOpen");
    setColorTheme(item.colorTheme || "blue");
    setTugasInput(item.tugas ? item.tugas.join("\n") : "");
    setIsDivisiModalOpen(true);
  };

  const handleDeleteDivisi = (id: string, namaDivisi: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data master ${namaDivisi}?`)) {
      const updated = divisiData.filter((d) => d.id !== id);
      setDivisiData(updated);
      showToast(`Master ${namaDivisi} berhasil dihapus.`);
    }
  };

  const handleSubmitDivisi = (e: React.FormEvent) => {
    e.preventDefault();
    const tugasList = tugasInput
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingDivisi) {
      const updated = divisiData.map((d) =>
        d.id === editingDivisi.id
          ? {
              ...d,
              singkatan,
              nama,
              deskripsi,
              iconName,
              colorTheme,
              tugas: tugasList,
            }
          : d
      );
      setDivisiData(updated);
      showToast(`Master ${nama} berhasil diperbarui.`);
    } else {
      const newItem: DivisiAdminItem = {
        id: `${nama.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}_${Date.now().toString().slice(-5)}`,
        singkatan,
        nama,
        deskripsi,
        iconName,
        colorTheme,
        tugas: tugasList,
        anggotaCount: 0,
      };
      setDivisiData([...divisiData, newItem]);
      showToast(`Divisi baru ${nama} berhasil ditambahkan.`);
    }
    setIsDivisiModalOpen(false);
  };

  // Anggota Handlers
  const handleOpenAddAnggota = () => {
    setEditingAnggota(null);
    setAngNama("");
    setAngNpm("");
    setAngRole("Anggota Divisi");
    setAngBadge("Staff Divisi");
    setAngFotoUrl("");
    setAngPeriode("2025/2026");
    setAngInstagram("");
    setAngLinkedin("");
    setIsAnggotaModalOpen(true);
  };

  const handleOpenEditAnggota = (item: AnggotaDivisiItem) => {
    setEditingAnggota(item);
    setAngNama(item.nama);
    setAngNpm(item.npm || "");
    setAngRole(item.role);
    setAngBadge(item.jabatanBadge || "");
    setAngFotoUrl(item.fotoUrl || "");
    setAngPeriode(item.periode || "2025/2026");
    setAngInstagram(item.instagram || "");
    setAngLinkedin(item.linkedin || "");
    setIsAnggotaModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await convertFileToBase64(file);
      setAngFotoUrl(base64);
      showToast("Foto profil anggota berhasil diunggah.");
    } catch (err) {
      console.error(err);
      alert("Gagal memuat gambar.");
    }
  };

  const handleDeleteAnggota = (id: string, namaAnggota: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data anggota ${namaAnggota}?`)) {
      const updated = anggotaDivisi.filter((a) => a.id !== id);
      setAnggotaDivisi(updated);
      showToast(`Anggota ${namaAnggota} berhasil dihapus.`);
    }
  };

  const handleSubmitAnggota = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAnggota) {
      const updated = anggotaDivisi.map((a) =>
        a.id === editingAnggota.id
          ? {
              ...a,
              nama: angNama,
              npm: angNpm,
              divisiId: activeDivisiTab,
              role: angRole,
              jabatanBadge: angBadge.trim() || (angRole === "Ketua Divisi" ? "Ketua Divisi" : "Staff Divisi"),
              fotoUrl: angFotoUrl,
              periode: angPeriode,
              instagram: angInstagram,
              linkedin: angLinkedin,
            }
          : a
      );
      setAnggotaDivisi(updated);
      showToast(`Data anggota ${angNama} berhasil diperbarui.`);
    } else {
      const newItem: AnggotaDivisiItem = {
        id: "ang_" + Date.now(),
        nama: angNama,
        npm: angNpm,
        divisiId: activeDivisiTab,
        role: angRole,
        jabatanBadge: angBadge.trim() || (angRole === "Ketua Divisi" ? "Ketua Divisi" : "Staff Divisi"),
        fotoUrl: angFotoUrl,
        periode: angPeriode,
        instagram: angInstagram,
        linkedin: angLinkedin,
      };
      setAnggotaDivisi([...anggotaDivisi, newItem]);
      showToast(`Anggota baru ${angNama} berhasil ditambahkan.`);
    }

    setIsAnggotaModalOpen(false);
  };

  return (
    <div className="space-y-10">
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
            <Layers className="text-red-600 dark:text-red-500" size={22} />
            Pengelolaan Master Divisi & Anggota (CMS Terintegrasi)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola Master Divisi dan susunan Anggota/Ketua Divisi secara langsung dalam alur terintegrasi.
          </p>
        </div>

        <button
          onClick={handleOpenAddDivisi}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-900/20 transition-all cursor-pointer"
        >
          <Plus size={16} /> Tambah Divisi Baru
        </button>
      </div>

      {/* ── SECTION 1: MASTER DIVISI ── */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Layers size={18} className="text-red-500" /> Master Divisi Utama HIMSI UG
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {divisiData.filter((div) => div.id !== "bph" && div.singkatan.toLowerCase() !== "bph").map((div) => {
            const IconComponent =
              AVAILABLE_ICONS.find((i) => i.name === div.iconName)?.icon || Layers;
            const count = anggotaDivisi.filter((a) => a.divisiId === div.id).length;

            return (
              <div
                key={div.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                      <IconComponent size={20} />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs">
                      {div.singkatan}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                      {div.nama}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {div.deskripsi}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{count} Anggota</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditDivisi(div)}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
                      title="Edit Master Divisi"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteDivisi(div.id, div.nama)}
                      className="p-1.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
                      title="Hapus Master Divisi"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 2: INTEGRATED ANGGOTA DIVISI MANAGER ── */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="text-red-600 dark:text-red-500" size={20} />
              Pengelolaan Anggota Divisi Operasional
            </h2>
            <p className="text-xs text-slate-500">
              Pilih tab divisi di bawah untuk melihat dan mengelola susunan Ketua & Anggota (BPH dipisah di menu tersendiri).
            </p>
          </div>

          <button
            onClick={handleOpenAddAnggota}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-extrabold text-xs hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-colors cursor-pointer"
          >
            <Plus size={15} /> Tambah Anggota di Divisi Ini
          </button>
        </div>

        {/* Division Filter Tabs (NO BPH TAB HERE!) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Filter size={14} /> Pilih Divisi:
          </span>
          {divisiData.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDivisiTab(d.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeDivisiTab === d.id
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {d.nama} ({anggotaDivisi.filter((a) => a.divisiId === d.id).length})
            </button>
          ))}
        </div>

        {/* Anggota Cards Grid for Active Divisi Tab */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pt-2">
          {filteredMembers.length === 0 ? (
            <div className="col-span-full p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
              <User size={36} className="mx-auto text-slate-400" />
              <p className="text-xs font-semibold text-slate-500">
                Belum ada anggota untuk divisi ini. Klik &quot;Tambah Anggota&quot; di atas.
              </p>
            </div>
          ) : (
            filteredMembers.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2 text-center">
                  <div className="flex justify-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 border ${
                        item.role === "Ketua Divisi"
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      {item.role === "Ketua Divisi" && <Crown size={11} />}
                      {item.jabatanBadge || item.role}
                    </span>
                  </div>

                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {hasRealPhoto(item.fotoUrl) ? (
                      <img
                        src={getValidImageUrl(item.fotoUrl)}
                        alt={item.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-500 space-y-1">
                        <User size={36} />
                        <span className="text-[9px] font-semibold">Belum Ada Foto</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {item.nama}
                    </h4>
                    {item.npm && <p className="text-[10px] font-mono text-slate-400">NPM: {item.npm}</p>}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => handleOpenEditAnggota(item)}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDeleteAnggota(item.id, item.nama)}
                    className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Form Edit / Tambah Divisi */}
      <AnimatePresence>
        {isDivisiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDivisiModalOpen(false)}
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
                  {editingDivisi ? "Edit Master Divisi" : "Tambah Divisi Baru"}
                </h3>
                <button onClick={() => setIsDivisiModalOpen(false)} className="p-1 rounded-lg text-slate-400">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitDivisi} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Divisi Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Divisi Akademik"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Singkatan / Subtitle Badge
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Akademik"
                    value={singkatan}
                    onChange={(e) => setSingkatan(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Deskripsi</label>
                  <textarea
                    rows={3}
                    required
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Icon Selector */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Ikon Divisi</label>
                  <div className="grid grid-cols-6 gap-2">
                    {AVAILABLE_ICONS.map((ic) => {
                      const IconComp = ic.icon;
                      const isSelected = iconName === ic.name;
                      return (
                        <button
                          key={ic.name}
                          type="button"
                          onClick={() => setIconName(ic.name)}
                          className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-red-500 text-white border-red-500"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <IconComp size={16} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Theme Selector */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Warna Aksentuasi</label>
                  <div className="flex items-center gap-2">
                    {COLOR_THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setColorTheme(theme.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                          colorTheme === theme.id
                            ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-700"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${theme.bg}`} />
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsDivisiModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold"
                  >
                    Simpan Master
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Form Edit / Tambah Anggota */}
      <AnimatePresence>
        {isAnggotaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAnggotaModalOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 z-10 max-h-[90vh] overflow-y-auto text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {editingAnggota ? "Edit Anggota Divisi" : "Tambah Anggota Divisi"}
                </h3>
                <button onClick={() => setIsAnggotaModalOpen(false)} className="p-1 rounded-lg text-slate-400">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitAnggota} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Anggota Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dimas Prasetyo"
                    value={angNama}
                    onChange={(e) => setAngNama(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">NPM</label>
                    <input
                      type="text"
                      placeholder="14121001"
                      value={angNpm}
                      onChange={(e) => setAngNpm(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Role Jabatan</label>
                    <select
                      value={angRole}
                      onChange={(e) => setAngRole(e.target.value as "Ketua Divisi" | "Anggota Divisi")}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-red-500"
                    >
                      <option value="Anggota Divisi">Anggota Divisi</option>
                      <option value="Ketua Divisi">Ketua Divisi</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Badge Subtitle Jabatan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Staff Akademik / Kepala Divisi"
                    value={angBadge}
                    onChange={(e) => setAngBadge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Upload Foto */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Foto Profil</label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-20 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      {hasRealPhoto(angFotoUrl) ? (
                        <img src={getValidImageUrl(angFotoUrl)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-slate-500" />
                      )}
                    </div>
                    <label className="flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 cursor-pointer bg-slate-50 dark:bg-slate-800/50">
                      <Upload size={18} className="text-slate-400 mb-1" />
                      <span className="text-slate-600 dark:text-slate-300 font-semibold">Upload Foto Anggota</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Instagram</label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/username"
                      value={angInstagram}
                      onChange={(e) => setAngInstagram(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">LinkedIn</label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/username"
                      value={angLinkedin}
                      onChange={(e) => setAngLinkedin(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAnggotaModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-lg"
                  >
                    Simpan Anggota
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
