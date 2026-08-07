"use client";

import { useState, useRef } from "react";
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
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSharedStore, convertFileToBase64, getValidImageUrl } from "@/lib/sharedStore";
import type { DivisiAdminItem, AnggotaDivisiItem } from "@/data/adminMockData";
import { saveDivisiAction, saveAnggotaDivisiAction } from "@/app/actions/adminActions";

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

interface AdminDivisiClientProps {
  initialDivisi: DivisiAdminItem[];
  initialAnggota: AnggotaDivisiItem[];
}

export function AdminDivisiClient({ initialDivisi, initialAnggota }: AdminDivisiClientProps) {
  const { divisiData, setDivisiData, anggotaDivisi, setAnggotaDivisi, mounted } = useSharedStore();

  const activeDivisiList = mounted ? divisiData : initialDivisi;
  const activeAnggotaList = mounted ? anggotaDivisi : initialAnggota;

  const [activeDivisiTab, setActiveDivisiTab] = useState<string>("akademik");

  // Modals state
  const [isDivisiModalOpen, setIsDivisiModalOpen] = useState(false);
  const [editingDivisi, setEditingDivisi] = useState<DivisiAdminItem | null>(null);

  const [isAnggotaModalOpen, setIsAnggotaModalOpen] = useState(false);
  const [editingAnggota, setEditingAnggota] = useState<AnggotaDivisiItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    setTimeout(() => setToastMsg(""), 3500);
  };

  const filteredMembers = activeAnggotaList.filter((a) => a.divisiId === activeDivisiTab);

  // Open Divisi Modal
  const handleOpenDivisiModal = (item?: DivisiAdminItem) => {
    if (item) {
      setEditingDivisi(item);
      setSingkatan(item.singkatan);
      setNama(item.nama);
      setDeskripsi(item.deskripsi);
      setIconName(item.iconName || "BookOpen");
      setColorTheme(item.colorTheme || "blue");
      setTugasInput(item.tugas?.join("\n") || "");
    } else {
      setEditingDivisi(null);
      setSingkatan("");
      setNama("");
      setDeskripsi("");
      setIconName("BookOpen");
      setColorTheme("blue");
      setTugasInput("");
    }
    setIsDivisiModalOpen(true);
  };

  // Save Divisi
  const handleSaveDivisi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singkatan.trim() || !nama.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const slug = singkatan.toLowerCase().replace(/[^a-z0-9]/g, "");
      const tugasArray = tugasInput
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean);

      let updated: DivisiAdminItem[];
      if (editingDivisi) {
        updated = activeDivisiList.map((d) =>
          d.id === editingDivisi.id
            ? {
                ...d,
                singkatan,
                nama,
                deskripsi,
                iconName,
                colorTheme,
                tugas: tugasArray,
              }
            : d
        );
      } else {
        const newDivisi: DivisiAdminItem = {
          id: slug,
          singkatan,
          nama,
          deskripsi,
          iconName,
          colorTheme,
          tugas: tugasArray,
        };
        updated = [...activeDivisiList, newDivisi];
      }

      setDivisiData(updated, slug);
      await saveDivisiAction(updated);
      setIsDivisiModalOpen(false);
      showToast("Data Divisi berhasil disimpan ke Supabase DB.");
    } catch (err) {
      console.error("[AdminDivisi] Save error:", err);
      alert("Gagal menyimpan data divisi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Divisi
  const handleDeleteDivisi = async (id: string) => {
    if (isLoading) return;
    if (confirm("Apakah Anda yakin ingin menghapus divisi ini beserta seluruh anggotanya?")) {
      setIsLoading(true);
      try {
        const updatedDivisi = activeDivisiList.filter((d) => d.id !== id);
        const updatedAnggota = activeAnggotaList.filter((a) => a.divisiId !== id);

        setDivisiData(updatedDivisi);
        setAnggotaDivisi(updatedAnggota);

        await saveDivisiAction(updatedDivisi);
        await saveAnggotaDivisiAction(updatedAnggota);
        showToast("Divisi berhasil dihapus.");
      } catch (err) {
        console.error("[AdminDivisi] Delete error:", err);
        alert("Gagal menghapus divisi.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Open Anggota Modal
  const handleOpenAnggotaModal = (item?: AnggotaDivisiItem) => {
    if (item) {
      setEditingAnggota(item);
      setAngNama(item.nama);
      setAngNpm(item.npm || "");
      setAngRole(item.role);
      setAngBadge(item.jabatanBadge || "");
      setAngFotoUrl(item.fotoUrl || "");
      setAngPeriode(item.periode || "2025/2026");
      setAngInstagram(item.instagram || "");
      setAngLinkedin(item.linkedin || "");
    } else {
      setEditingAnggota(null);
      setAngNama("");
      setAngNpm("");
      setAngRole("Anggota Divisi");
      setAngBadge("");
      setAngFotoUrl("");
      setAngPeriode("2025/2026");
      setAngInstagram("");
      setAngLinkedin("");
    }
    setIsAnggotaModalOpen(true);
  };

  // Save Anggota
  const handleSaveAnggota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!angNama.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const finalFoto = getValidImageUrl(angFotoUrl, angNama);

      let updated: AnggotaDivisiItem[];
      if (editingAnggota) {
        updated = activeAnggotaList.map((a) =>
          a.id === editingAnggota.id
            ? {
                ...a,
                nama: angNama,
                npm: angNpm,
                role: angRole,
                jabatanBadge: angBadge,
                fotoUrl: finalFoto,
                periode: angPeriode,
                instagram: angInstagram,
                linkedin: angLinkedin,
              }
            : a
        );
      } else {
        const newAng: AnggotaDivisiItem = {
          id: `ang_${Date.now()}`,
          divisiId: activeDivisiTab,
          nama: angNama,
          npm: angNpm,
          role: angRole,
          jabatanBadge: angBadge,
          fotoUrl: finalFoto,
          periode: angPeriode,
          instagram: angInstagram,
          linkedin: angLinkedin,
        };
        updated = [...activeAnggotaList, newAng];
      }

      setAnggotaDivisi(updated, activeDivisiTab);
      await saveAnggotaDivisiAction(updated);
      setIsAnggotaModalOpen(false);
      showToast("Data Anggota Divisi berhasil disimpan.");
    } catch (err) {
      console.error("[AdminAnggota] Save error:", err);
      alert("Gagal menyimpan data anggota divisi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Anggota
  const handleDeleteAnggota = async (id: string) => {
    if (isLoading) return;
    if (confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
      setIsLoading(true);
      try {
        const updated = activeAnggotaList.filter((a) => a.id !== id);
        setAnggotaDivisi(updated, activeDivisiTab);
        await saveAnggotaDivisiAction(updated);
        showToast("Anggota berhasil dihapus.");
      } catch (err) {
        console.error("[AdminAnggota] Delete error:", err);
        alert("Gagal menghapus anggota.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAnggotaFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setAngFotoUrl(base64);
      } catch (err) {
        console.error("Gagal membaca foto:", err);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
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
            Kelola Divisi & Anggota Staff HIMSI UG
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola nama divisi, deskripsi proker, serta jajaran Ketua & Anggota Staff Divisi (Tersinkronisasi 100% dengan Supabase DB).
          </p>
        </div>

        <button
          onClick={() => handleOpenDivisiModal()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-900/20 transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} /> Tambah Divisi Baru
        </button>
      </div>

      {/* SECTION 1: DIVISI OVERVIEW CARDS */}
      <div className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">Daftar Divisi HIMSI</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeDivisiList.map((div) => {
            const IconComp = AVAILABLE_ICONS.find((i) => i.name === div.iconName)?.icon || BookOpen;

            return (
              <div
                key={div.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                        <IconComp size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-base text-slate-900 dark:text-slate-100">
                          {div.singkatan}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-bold">{div.nama}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 font-medium">
                    {div.deskripsi}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">
                    {activeAnggotaList.filter((a) => a.divisiId === div.id).length} Anggota Staff
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenDivisiModal(div)}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      title="Edit Divisi"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteDivisi(div.id)}
                      className="p-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 hover:bg-red-100 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                      title="Hapus Divisi"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: ANGGOTA MANAGER BY DIVISION TAB */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users size={18} className="text-red-500" />
              Pengelolaan Anggota Staff Divisi
            </h2>
            <p className="text-xs text-slate-500">Pilih tab divisi di bawah untuk mengelola Ketua & Anggota Staff divisi tersebut.</p>
          </div>

          <button
            onClick={() => handleOpenAnggotaModal()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-xs shadow-md transition-all cursor-pointer shrink-0"
          >
            <Plus size={15} /> Tambah Anggota Divisi
          </button>
        </div>

        {/* Divisi Tabs Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {activeDivisiList.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDivisiTab(d.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeDivisiTab === d.id
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-900/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              Divisi {d.singkatan} ({activeAnggotaList.filter((a) => a.divisiId === d.id).length})
            </button>
          ))}
        </div>

        {/* Anggota Cards Grid */}
        {filteredMembers.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
            <User size={36} className="mx-auto text-slate-400" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Belum ada anggota di Divisi ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMembers.map((member) => {
              const isKetua = member.role === "Ketua Divisi";

              return (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-300 dark:border-slate-700">
                      <img
                        src={getValidImageUrl(member.fotoUrl, member.nama)}
                        alt={member.nama}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {member.nama}
                      </h4>
                      <p className="text-[11px] font-bold text-slate-400 truncate">
                        {isKetua ? "👑 Kadiv" : "Staff Divisi"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">
                      {member.npm ? `NPM: ${member.npm}` : `Periode ${member.periode}`}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenAnggotaModal(member)}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
                        title="Edit Anggota"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteAnggota(member.id)}
                        className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-950 text-red-600 transition-colors cursor-pointer"
                        title="Hapus Anggota"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DIVISI CREATE/EDIT MODAL */}
      <AnimatePresence>
        {isDivisiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {editingDivisi ? "Edit Data Divisi" : "Tambah Divisi Baru"}
                </h2>
                <button
                  onClick={() => setIsDivisiModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveDivisi} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      Singkatan Divisi *
                    </label>
                    <input
                      type="text"
                      required
                      value={singkatan}
                      onChange={(e) => setSingkatan(e.target.value)}
                      placeholder="e.g. PTI / Litbang"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lengkap Divisi *
                    </label>
                    <input
                      type="text"
                      required
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="e.g. Pengembangan Teknologi Informasi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    Deskripsi Tugas Divisi
                  </label>
                  <textarea
                    rows={3}
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Penjelasan fungsi & tanggung jawab divisi..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-medium resize-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setIsDivisiModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !singkatan.trim() || !nama.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-900/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Check size={15} /> Simpan Divisi
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ANGGOTA CREATE/EDIT MODAL */}
      <AnimatePresence>
        {isAnggotaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {editingAnggota ? "Edit Data Anggota Divisi" : "Tambah Anggota Staff Baru"}
                </h2>
                <button
                  onClick={() => setIsAnggotaModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveAnggota} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap Anggota *
                  </label>
                  <input
                    type="text"
                    required
                    value={angNama}
                    onChange={(e) => setAngNama(e.target.value)}
                    placeholder="e.g. Ahmad Rizky"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      Jabatan / Peran
                    </label>
                    <select
                      value={angRole}
                      onChange={(e) =>
                        setAngRole(e.target.value as "Ketua Divisi" | "Anggota Divisi")
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-semibold"
                    >
                      <option value="Anggota Divisi">Anggota Staff Divisi</option>
                      <option value="Ketua Divisi">Ketua Divisi (Kadiv)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      NPM Mahasiswa (Opsional)
                    </label>
                    <input
                      type="text"
                      value={angNpm}
                      onChange={(e) => setAngNpm(e.target.value)}
                      placeholder="e.g. 10121001"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    Foto Profil (Galeri HP/PC atau URL)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={angFotoUrl}
                      onChange={(e) => setAngFotoUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Upload size={14} /> Galeri
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAnggotaFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setIsAnggotaModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !angNama.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-900/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Check size={15} /> Simpan Anggota
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
