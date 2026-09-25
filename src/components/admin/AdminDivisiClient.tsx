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
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSharedStore, convertFileToBase64, getValidImageUrl } from "@/lib/sharedStore";
import type { DivisiAdminItem, AnggotaDivisiItem } from "@/data/adminMockData";
import { saveDivisiAction, saveAnggotaDivisiAction, uploadFotoStorageAction } from "@/app/actions/adminActions";

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

interface AdminDivisiClientProps {
  initialDivisi: DivisiAdminItem[];
  initialAnggota: AnggotaDivisiItem[];
}

export function AdminDivisiClient({ initialDivisi, initialAnggota }: AdminDivisiClientProps) {
  const { pengurus, divisiData, setDivisiData, anggotaDivisi, setAnggotaDivisi, mounted } = useSharedStore();

  const activeBphPeriode = pengurus.find((p) => p.divisi === "BPH" && p.periode)?.periode || "2026/2027";
  const activeDivisiList = mounted && divisiData && divisiData.length > 0 ? divisiData : initialDivisi;
  const activeAnggotaList = mounted && anggotaDivisi && anggotaDivisi.length > 0 ? anggotaDivisi : initialAnggota;

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
  const [angRole, setAngRole] = useState<"Ketua Divisi" | "Wakil Ketua Divisi" | "Anggota Divisi">("Anggota Divisi");
  const [angBadge, setAngBadge] = useState("");
  const [angFotoUrl, setAngFotoUrl] = useState("");
  const [angPeriode, setAngPeriode] = useState(activeBphPeriode);
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
      setAngPeriode(item.periode || activeBphPeriode);
      setAngInstagram(item.instagram || "");
      setAngLinkedin(item.linkedin || "");
    } else {
      setEditingAnggota(null);
      setAngNama("");
      setAngNpm("");
      setAngRole("Anggota Divisi");
      setAngBadge("");
      setAngFotoUrl("");
      setAngPeriode(activeBphPeriode);
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
      let finalFoto = getValidImageUrl(angFotoUrl, angNama);

      if (finalFoto.startsWith("data:")) {
        try {
          const uploadRes = await uploadFotoStorageAction(finalFoto, angNama);
          if (uploadRes.success && uploadRes.url) {
            finalFoto = uploadRes.url;
          }
        } catch (uploadErr) {
          console.warn("Client storage upload failed, falling back to server action:", uploadErr);
        }
      }

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
      const res = await saveAnggotaDivisiAction(updated);
      if (res && res.success === false) {
        throw new Error("Server action returned success=false");
      }
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
    if (!file) return;

    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      alert(`Ukuran foto terlalu besar (${sizeMB} MB). Ukuran maksimal foto adalah 2 MB.`);
      return;
    }

    try {
      const base64 = await convertFileToBase64(file);
      setAngFotoUrl(base64);
    } catch (err) {
      console.error("Gagal membaca foto:", err);
      alert("Gagal membaca foto anggota dari perangkat.");
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
            className="fixed top-6 right-6 z-50 p-4 bg-[#C8102E] text-white font-mono font-black text-xs border-2 border-slate-950 flex items-center gap-2 uppercase shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]"
          >
            <CheckCircle2 size={16} />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20">
        <div className="space-y-1">
          <h1 className="text-xl font-black font-heading uppercase tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
            <Layers className="text-[#C8102E] dark:text-[#E31B3B]" size={22} />
            KELOLA DIVISI & ANGGOTA STAFF HIMASI UG
          </h1>
          <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
            Kelola nama divisi, deskripsi proker, serta jajaran Ketua & Anggota Staff Divisi (Tersinkronisasi 100% dengan Supabase DB).
          </p>
        </div>

        <button
          onClick={() => handleOpenDivisiModal()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C8102E] dark:bg-[#E31B3B] text-white font-black font-mono text-xs uppercase tracking-widest border-2 border-slate-950 hover:bg-slate-950 transition-colors cursor-pointer shrink-0"
        >
          <Plus size={16} /> TAMBAH DIVISI BARU
        </button>
      </div>

      {/* SECTION 1: DIVISI OVERVIEW CARDS */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-black uppercase tracking-widest text-[#C8102E] dark:text-[#E31B3B]">[ DAFTAR DIVISI HIMASI ]</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeDivisiList.map((div) => {
            const IconComp = AVAILABLE_ICONS.find((i) => i.name === div.iconName)?.icon || BookOpen;

            return (
              <div
                key={div.id}
                className="p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 hover:shadow-[4px_4px_0px_0px_rgba(200,16,46,1)] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950">
                        <IconComp size={20} />
                      </div>
                      <div>
                        <h3 className="font-black font-heading text-base uppercase text-slate-950 dark:text-white">
                          {div.singkatan}
                        </h3>
                        <p className="text-[11px] font-mono font-bold text-slate-500">{div.nama}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 font-medium">
                    {div.deskripsi}
                  </p>
                </div>

                <div className="pt-3 border-t-2 border-slate-950/20 dark:border-white/20 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                    {activeAnggotaList.filter((a) => a.divisiId === div.id).length} ANGGOTA STAFF
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenDivisiModal(div)}
                      className="p-1.5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950 cursor-pointer hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors"
                      title="Edit Divisi"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteDivisi(div.id)}
                      className="p-1.5 bg-[#C8102E] text-white border border-slate-950 cursor-pointer hover:bg-slate-950 transition-colors"
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
      <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-950 dark:border-white/20 pb-4">
          <div>
            <h2 className="text-base font-black font-heading uppercase tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
              <Users size={18} className="text-[#C8102E] dark:text-[#E31B3B]" />
              PENGELOLAAN ANGGOTA STAFF DIVISI
            </h2>
            <p className="text-xs font-mono font-bold text-slate-500">Pilih tab divisi di bawah untuk mengelola Ketua & Anggota Staff divisi tersebut.</p>
          </div>

          <button
            onClick={() => handleOpenAnggotaModal()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black font-mono text-xs uppercase tracking-widest border-2 border-slate-950 hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <Plus size={15} /> TAMBAH ANGGOTA DIVISI
          </button>
        </div>

        {/* Divisi Tabs Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {activeDivisiList.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDivisiTab(d.id)}
              className={`px-4 py-2 text-xs font-black font-mono uppercase tracking-wider border-2 border-slate-950 cursor-pointer shrink-0 transition-colors ${activeDivisiTab === d.id
                ? "bg-[#C8102E] dark:bg-[#E31B3B] text-white"
                : "bg-white dark:bg-slate-950 text-slate-950 dark:text-white hover:bg-slate-200"
                }`}
            >
              DIVISI {d.singkatan} ({activeAnggotaList.filter((a) => a.divisiId === d.id).length})
            </button>
          ))}
        </div>

        {/* Anggota Cards Grid */}
        {filteredMembers.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 space-y-2">
            <User size={36} className="mx-auto text-slate-400" />
            <p className="text-xs font-black font-mono uppercase text-slate-950 dark:text-white">
              Belum ada anggota di Divisi ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMembers.map((member) => {
              const isKetua = member.role === "Ketua Divisi";
              const isWakadiv = member.role === "Wakil Ketua Divisi";
              const memberPeriode = (!member.periode || member.periode === "2025/2026") ? activeBphPeriode : member.periode;

              return (
                <div
                  key={member.id}
                  className="p-4 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 flex flex-col justify-between space-y-3 hover:shadow-[4px_4px_0px_0px_rgba(200,16,46,1)] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 border border-slate-950 overflow-hidden bg-slate-950 shrink-0">
                      <img
                        src={getValidImageUrl(member.fotoUrl, member.nama)}
                        alt={member.nama}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-black font-heading text-xs text-slate-950 dark:text-white uppercase truncate">
                        {member.nama}
                      </h4>
                      <p className="text-[11px] font-mono font-bold text-[#C8102E] dark:text-[#E31B3B] uppercase truncate">
                        {isKetua ? "👑 KADIV" : isWakadiv ? "🛡️ WAKADIV" : "STAFF DIVISI"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t-2 border-slate-950/20 dark:border-white/20 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                      {member.npm ? `NPM: ${member.npm}` : `PERIODE ${memberPeriode}`}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenAnggotaModal(member)}
                        className="p-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950 cursor-pointer"
                        title="Edit Anggota"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteAnggota(member.id)}
                        className="p-1 bg-[#C8102E] text-white border border-slate-950 cursor-pointer"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(200,16,46,1)] space-y-6 my-8"
            >
              <div className="flex items-center justify-between pb-4 border-b-2 border-slate-950 dark:border-white/20">
                <h2 className="text-lg font-black font-heading uppercase text-slate-950 dark:text-white">
                  {editingDivisi ? "EDIT DATA DIVISI" : "TAMBAH DIVISI BARU"}
                </h2>
                <button
                  onClick={() => setIsDivisiModalOpen(false)}
                  className="p-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveDivisi} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                      SINGKATAN DIVISI *
                    </label>
                    <input
                      type="text"
                      required
                      value={singkatan}
                      onChange={(e) => setSingkatan(e.target.value)}
                      placeholder="e.g. PTI / Litbang"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                      NAMA LENGKAP DIVISI *
                    </label>
                    <input
                      type="text"
                      required
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="e.g. Pengembangan Teknologi Informasi"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                    DESKRIPSI TUGAS DIVISI
                  </label>
                  <textarea
                    rows={3}
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Penjelasan fungsi & tanggung jawab divisi..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-medium resize-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t-2 border-slate-950 dark:border-white/20">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setIsDivisiModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white font-black font-mono text-xs uppercase tracking-wider border-2 border-slate-950 hover:bg-slate-300 transition-colors"
                  >
                    BATAL
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !singkatan.trim() || !nama.trim()}
                    className="px-6 py-2.5 bg-[#C8102E] dark:bg-[#E31B3B] hover:bg-slate-950 text-white font-black font-mono text-xs uppercase tracking-widest border-2 border-slate-950 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin" />
                        <span>MENYIMPAN...</span>
                      </>
                    ) : (
                      <>
                        <Check size={15} /> SIMPAN DIVISI
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(200,16,46,1)] space-y-6 my-8"
            >
              <div className="flex items-center justify-between pb-4 border-b-2 border-slate-950 dark:border-white/20">
                <h2 className="text-lg font-black font-heading uppercase text-slate-950 dark:text-white">
                  {editingAnggota ? "EDIT DATA ANGGOTA DIVISI" : "TAMBAH ANGGOTA STAFF BARU"}
                </h2>
                <button
                  onClick={() => setIsAnggotaModalOpen(false)}
                  className="p-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveAnggota} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                    NAMA LENGKAP ANGGOTA *
                  </label>
                  <input
                    type="text"
                    required
                    value={angNama}
                    onChange={(e) => setAngNama(e.target.value)}
                    placeholder="e.g. Ahmad Rizky"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                      JABATAN / PERAN
                    </label>
                    <select
                      value={angRole}
                      onChange={(e) => {
                        const newRole = e.target.value as "Ketua Divisi" | "Wakil Ketua Divisi" | "Anggota Divisi";
                        setAngRole(newRole);
                        if (newRole === "Ketua Divisi") setAngBadge("Kadiv");
                        else if (newRole === "Wakil Ketua Divisi") setAngBadge("Wakadiv");
                        else setAngBadge("Staff Divisi");
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold"
                    >
                      <option value="Anggota Divisi">Anggota Staff Divisi</option>
                      <option value="Wakil Ketua Divisi">Wakil Ketua Divisi (Wakadiv)</option>
                      <option value="Ketua Divisi">Ketua Divisi (Kadiv)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                      NPM MAHASISWA (OPSIONAL)
                    </label>
                    <input
                      type="text"
                      value={angNpm}
                      onChange={(e) => setAngNpm(e.target.value)}
                      placeholder="e.g. 10121001"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                    FOTO PROFIL (GALERI OR URL)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={angFotoUrl}
                      onChange={(e) => setAngFotoUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2.5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black font-mono text-xs uppercase border border-slate-950 flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Upload size={14} /> GALERI
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

                <div className="pt-4 flex items-center justify-end gap-3 border-t-2 border-slate-950 dark:border-white/20">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setIsAnggotaModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white font-black font-mono text-xs uppercase tracking-wider border-2 border-slate-950 hover:bg-slate-300 transition-colors"
                  >
                    BATAL
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !angNama.trim()}
                    className="px-6 py-2.5 bg-[#C8102E] dark:bg-[#E31B3B] hover:bg-slate-950 text-white font-black font-mono text-xs uppercase tracking-widest border-2 border-slate-950 transition-colors cursor-pointer flex items-center gap-2"
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
