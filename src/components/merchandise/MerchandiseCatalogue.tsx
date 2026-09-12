"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, X, Sparkles } from "lucide-react";
import { MERCHANDISE_ITEMS, CATEGORY_LABELS, type MerchandiseCategory, type MerchandiseItem } from "@/data/merchandise";
import { MerchandiseCard } from "./MerchandiseCard";
import { MerchandiseModal } from "./MerchandiseModal";
import { HackerMatrixBackground } from "@/components/ui/HackerMatrixBackground";

// ─────────────────────────────────────────────
// Category Tab Filter Component
// ─────────────────────────────────────────────

const CATEGORIES: MerchandiseCategory[] = ["all", "apparel", "accessories", "stationery", "bundle"];

function CategoryTabs({
  active,
  onSelect,
  counts,
}: {
  active: MerchandiseCategory;
  onSelect: (c: MerchandiseCategory) => void;
  counts: Record<MerchandiseCategory, number>;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {CATEGORIES.map((cat) => (
        <motion.button
          key={cat}
          onClick={() => onSelect(cat)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${active === cat
              ? "bg-red-600/20 text-red-400 border-red-500/60 shadow-[0_0_16px_rgba(220,38,38,0.25)]"
              : "bg-slate-900/50 text-slate-400 border-slate-700/60 hover:border-red-500/30 hover:text-slate-200"
            }`}
          aria-pressed={active === cat}
          aria-label={`Filter: ${CATEGORY_LABELS[cat]}`}
        >
          {CATEGORY_LABELS[cat]}
          <span
            className={`ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${active === cat ? "bg-red-500/30 text-red-300" : "bg-slate-800 text-slate-500"
              }`}
          >
            {counts[cat]}
          </span>
          {active === cat && (
            <motion.div
              layoutId="active-category"
              className="absolute inset-0 rounded-xl bg-red-500/5 border border-red-500/30 -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Sort & Filter Bar
// ─────────────────────────────────────────────

type SortOption = "default" | "price-asc" | "price-desc" | "newest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Harga: Terendah" },
  { value: "price-desc", label: "Harga: Tertinggi" },
  { value: "newest", label: "Terbaru" },
];

function FilterBar({
  search,
  setSearch,
  sort,
  setSort,
  resultCount,
}: {
  search: string;
  setSearch: (s: string) => void;
  sort: SortOption;
  setSort: (s: SortOption) => void;
  resultCount: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          type="search"
          placeholder="Cari produk HIMASI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/70 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 transition-all duration-200"
          id="merch-search"
          aria-label="Cari produk merchandise"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            aria-label="Hapus pencarian"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Sort select */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as SortOption)}
        className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/70 text-slate-300 text-sm focus:outline-none focus:border-red-500/60 transition-all duration-200 cursor-pointer appearance-none pr-8 bg-no-repeat"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundPosition: "calc(100% - 12px) center" }}
        id="merch-sort"
        aria-label="Urutkan produk"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value} className="bg-slate-900">
            {o.label}
          </option>
        ))}
      </select>

      {/* Result count */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
        <ShoppingBag size={12} />
        <span><span className="text-slate-300 font-semibold">{resultCount}</span> produk</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Empty State Component
// ─────────────────────────────────────────────

function EmptyState({ search, onReset }: { search: string; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-24 gap-5 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center">
        <ShoppingBag size={32} className="text-slate-600" />
      </div>
      <div className="space-y-1">
        <p className="text-slate-300 font-semibold text-lg">
          Produk &ldquo;{search}&rdquo; tidak ditemukan
        </p>
        <p className="text-slate-600 text-sm">Coba kata kunci lain atau ubah filter</p>
      </div>
      <button
        onClick={onReset}
        className="px-5 py-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-600/30 text-sm font-semibold hover:bg-red-600/30 transition-all duration-200"
      >
        Reset Filter
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main Catalogue Component
// ─────────────────────────────────────────────

export function MerchandiseCatalogue() {
  const [activeCategory, setActiveCategory] = useState<MerchandiseCategory>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("default");
  const [selectedItem, setSelectedItem] = useState<MerchandiseItem | null>(null);

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts = {} as Record<MerchandiseCategory, number>;
    CATEGORIES.forEach((cat) => {
      counts[cat] =
        cat === "all"
          ? MERCHANDISE_ITEMS.length
          : MERCHANDISE_ITEMS.filter((i) => i.category === cat).length;
    });
    return counts;
  }, []);

  // Filter + search + sort
  const filteredItems = useMemo(() => {
    let items = MERCHANDISE_ITEMS;

    if (activeCategory !== "all") {
      items = items.filter((i) => i.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case "price-asc":
        return [...items].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...items].sort((a, b) => b.price - a.price);
      case "newest":
        return [...items].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default:
        return items;
    }
  }, [activeCategory, search, sort]);

  const handleReset = () => {
    setSearch("");
    setActiveCategory("all");
    setSort("default");
  };

  return (
    <section
      id="merchandise"
      className="relative min-h-screen bg-slate-950 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      aria-label="Katalog Merchandise JAHIM HIMASI UG"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <HackerMatrixBackground />
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-red-900/10 blur-[140px]" />
        <div className="absolute -bottom-20 right-1/4 w-[400px] h-[400px] rounded-full bg-rose-900/8 blur-[120px]" />
        <div className="absolute top-1/2 left-0 w-px h-2/3 bg-gradient-to-b from-transparent via-red-800/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14 space-y-4"
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/40 border border-red-800/50 text-red-400 text-xs font-bold tracking-widest uppercase"
          >
            <Sparkles size={12} />
            JAHIM × HIMASI UG Official Merch
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-100 leading-tight tracking-tight">
            Katalog{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
              Merchandise
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Koleksi eksklusif JAHIM & HIMASI UG — dari hoodie premium hingga stationery keren.
            Tampil bangga dengan identitas Sistem Informasi Gunadarma.
          </p>
        </motion.div>

        {/* Controls: Category tabs + Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col gap-4 mb-10"
        >
          <CategoryTabs
            active={activeCategory}
            onSelect={setActiveCategory}
            counts={categoryCounts}
          />
          <FilterBar
            search={search}
            setSearch={setSearch}
            sort={sort}
            setSort={setSort}
            resultCount={filteredItems.length}
          />
        </motion.div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${search}-${sort}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <MerchandiseCard
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={setSelectedItem}
                />
              ))
            ) : (
              <EmptyState search={search} onReset={handleReset} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-20 relative rounded-3xl overflow-hidden border border-red-900/40 bg-gradient-to-br from-red-950/40 via-slate-900/80 to-slate-950/80 backdrop-blur-xl p-8 sm:p-12 text-center"
        >
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-64 h-32 bg-red-600/10 blur-[60px]" />
          </div>

          <div className="relative space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
              Mau jadi{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">
                reseller JAHIM
              </span>
              ? 🚀
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base">
              Dapatkan harga spesial reseller, komisi menarik, dan materi promosi eksklusif.
              Hubungi tim Medpar HIMASI UG sekarang!
            </p>
            <motion.a
              href="https://wa.me/6281234567890?text=Halo%20HIMASI%20UG!%20Saya%20tertarik%20menjadi%20reseller%20JAHIM.%20Mohon%20info%20lebih%20lanjut%20ya!"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, boxShadow: "0 0 32px rgba(220,38,38,0.5)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-900/30 transition-colors duration-200"
              id="reseller-cta"
              aria-label="Daftar sebagai reseller JAHIM via WhatsApp"
            >
              <ShoppingBag size={17} />
              Hubungi Tim JAHIM
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <MerchandiseModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
