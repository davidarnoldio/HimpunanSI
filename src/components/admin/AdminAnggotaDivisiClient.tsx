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
} from "lucide-react";
import { useSharedStore, convertFileToBase64, getValidImageUrl } from "@/lib/sharedStore";
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
  const { anggotaDivisi, setAnggotaDivisi, divisiData, mounted } = useSharedStore();

  const activeAnggotaList = mounted ? anggotaDivisi : initialAnggota;
  const activeDivisiList = mounted ? divisiData : initialDivisi;

  const [selectedDivisiFilter, setSelectedDivisiFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnggotaDivisiItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsModalOpen(false);
      showToast("Data Anggota Divisi berhasil disimpan.");
    } catch (err) {
      console.error("[AdminAnggotaDivisi] Save error:", err);
      alert("Gagal menyimpan data anggota divisi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Toast alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white font-mono font-bold text-xs border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] flex items-center gap-2 uppercase"
          >
            <CheckCircle2 size={16} />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20">
        <div className="space-y-1">
          <h1 className="text-xl font-black font-heading uppercase tracking-tight text-slate-950 dark:text-white flex items-center gap-2.5">
            <Users className="text-[#C8102E] dark:text-[#E31B3B]" size={22} />
            KELOLA ANGGOTA & STAFF DIVISI HIMSI
          </h1>
          <p className="text-xs font-mono text-slate-600 dark:text-slate-400">
            Tambah, edit, dan atur jajaran anggota staff per divisi (Tersinkronisasi 100% dengan Supabase DB).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C8102E] hover:bg-slate-950 dark:bg-[#E31B3B] dark:hover:bg-white dark:hover:text-slate-950 text-white font-mono font-black text-xs uppercase tracking-wider border-2 border-slate-950 transition-all cursor-pointer shrink-0 shadow-[3px_3px_0px_0px_rgba(10,10,10,1)]"
        >
          <Plus size={16} /> TAMBAH ANGGOTA BARU
        </button>
      </div>

      {/* Filter Divisi Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 flex items-center gap-3 overflow-x-auto">
        <span className="text-xs font-mono font-black text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
          <Filter size={13} /> FILTER DIVISI:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDivisiFilter("ALL")}
            className={`px-3 py-1.5 font-mono text-xs font-black uppercase transition-all cursor-pointer shrink-0 border border-slate-950 ${
              selectedDivisiFilter === "ALL"
                ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            SEMUA DIVISI ({activeAnggotaList.length})
          </button>
          {activeDivisiList.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDivisiFilter(d.id)}
              className={`px-3 py-1.5 font-mono text-xs font-black uppercase transition-all cursor-pointer shrink-0 border border-slate-950 ${
                selectedDivisiFilter === d.id
                  ? "bg-[#C8102E] text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {d.singkatan} ({activeAnggotaList.filter((a) => a.divisiId === d.id).length})
            </button>
          ))}
        </div>
      </div>

      {/* Anggota Grid */}
      {filteredMembers.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border-2 border-dashed border-slate-950 dark:border-white/20">
          <User size={40} className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-black font-mono uppercase text-slate-950 dark:text-white">BELUM ADA DATA ANGGOTA</p>
          <p className="text-xs font-mono text-slate-500 mt-1">Klik &quot;Tambah Anggota Baru&quot; untuk memasukkan anggota divisi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMembers.map((member) => {
            const divisiObj = activeDivisiList.find((d) => d.id === member.divisiId);
            const isKadiv = member.role === "Ketua Divisi";

            return (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group bg-white dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 hover:border-[#C8102E] transition-all flex flex-col justify-between overflow-hidden shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
              >
                <div className="p-5 text-center space-y-3">
                  <div className="relative w-24 h-24 mx-auto overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-950">
                    <img
                      src={getValidImageUrl(member.fotoUrl, member.nama)}
                      alt={member.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isKadiv && (
                      <div className="absolute top-1 right-1 p-1 bg-amber-400 text-slate-950 font-bold border border-slate-950 shadow-sm">
                        <Crown size={12} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-black text-sm text-slate-950 dark:text-white line-clamp-1">
                      {member.nama}
                    </h3>
                    <p className="text-xs font-mono font-bold text-[#C8102E] dark:text-[#E31B3B] uppercase">
                      {isKadiv ? "Ketua Divisi (Kadiv)" : "Anggota Staff Divisi"}
                    </p>
                    <span className="inline-block text-[10px] font-mono font-bold uppercase text-slate-950 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 border border-slate-950">
                      Divisi {divisiObj?.singkatan || member.divisiId.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-100 dark:bg-slate-800 border-t-2 border-slate-950 dark:border-white/20 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 uppercase">
                    {member.npm ? `NPM: ${member.npm}` : `Periode ${member.periode}`}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="p-1.5 bg-white dark:bg-slate-950 hover:bg-slate-950 hover:text-white text-slate-950 dark:text-white border border-slate-950 transition-colors cursor-pointer"
                      title="Edit Anggota"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id, member.nama)}
                      className="p-1.5 bg-[#C8102E] text-white hover:bg-slate-950 border border-slate-950 transition-colors cursor-pointer"
                      title="Hapus Anggota"
                    >
                      <Trash2 size={13} />
                    </button>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 p-6 sm:p-8 space-y-6 my-8 shadow-[8px_8px_0px_0px_rgba(200,16,46,1)]"
            >
              <div className="flex items-center justify-between pb-4 border-b-2 border-slate-950 dark:border-white/20">
                <h2 className="text-lg font-black font-heading uppercase text-slate-950 dark:text-white">
                  {editingItem ? "EDIT DATA ANGGOTA" : "TAMBAH ANGGOTA DIVISI BARU"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-[#C8102E] hover:text-white border border-slate-950 text-slate-950 dark:text-white cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-mono font-black uppercase text-xs text-slate-950 dark:text-white mb-1">
                    Nama Lengkap Anggota *
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="e.g. Fathir Ardiansyah"
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
                      onChange={(e) =>
                        setRole(e.target.value as "Ketua Divisi" | "Anggota Divisi")
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold"
                    >
                      <option value="Anggota Divisi">Anggota Staff Divisi</option>
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
                    <label className="block font-mono font-black uppercase text-xs text-slate-950 dark:text-white mb-1">
                      Periode Kepengurusan
                    </label>
                    <input
                      type="text"
                      value={periode}
                      onChange={(e) => setPeriode(e.target.value)}
                      placeholder="2025/2026"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-mono text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono font-black uppercase text-xs text-slate-950 dark:text-white mb-1">
                    Foto Profil (Galeri HP/PC atau URL)
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
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t-2 border-slate-950 dark:border-white/20">
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

