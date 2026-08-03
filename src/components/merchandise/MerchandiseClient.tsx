"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  PackageOpen,
  Eye,
  Flame,
} from "lucide-react";
import { Navbar, Footer } from "@/components/landing";
import { MerchandiseModal } from "@/components/merchandise/MerchandiseModal";
import { getValidImageUrl, formatWhatsAppUrl } from "@/lib/sharedStore";
import type { MerchandiseAdminItem } from "@/data/adminMockData";
import type { MerchandiseItem, MerchandiseCategory } from "@/data/merchandise";

const CATEGORIES = ["Semua", "Apparel", "Accessories"];

const LIVE_WORDS = [
  "Merchandise Drop",
  "Apparel 2026",
  "Campus Tech-Wear",
  "Exclusive Catalog",
  "HIMSI Collection",
];

function LiveText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LIVE_WORDS.length);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="inline-block relative overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={LIVE_WORDS[index]}
          initial={{ y: 36, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -36, opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-red-600 dark:from-red-500 dark:via-rose-400 dark:to-red-500 pb-1"
        >
          {LIVE_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function MerchandiseClient({ merchandise }: { merchandise: MerchandiseAdminItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedModalProduct, setSelectedModalProduct] = useState<MerchandiseAdminItem | null>(null);

  // Filter Products
  const filteredProducts = merchandise.filter((item) => {
    if (selectedCategory === "Semua") return true;
    return item.category === selectedCategory;
  });

  const modalItem: MerchandiseItem | null = selectedModalProduct
    ? {
      id: selectedModalProduct.id,
      name: selectedModalProduct.title || "Merchandise HIMSI",
      category: (selectedModalProduct.category.toLowerCase() === "apparel" ? "apparel" : "accessories") as MerchandiseCategory,
      price: parseInt((selectedModalProduct.price || "0").replace(/[^0-9]/g, ""), 10) || 50000,
      images: [getValidImageUrl(selectedModalProduct.image, selectedModalProduct.title)],
      status: selectedModalProduct.status === "READY" ? "available" : selectedModalProduct.status === "PRE-ORDER" ? "pre-order" : "sold-out",
      badge: selectedModalProduct.badge || "Eksklusif",
      description: selectedModalProduct.description || "Official Merchandise HIMSI UG.",
      sizes: [
        { label: "S", available: true },
        { label: "M", available: true },
        { label: "L", available: true },
        { label: "XL", available: true },
        { label: "XXL", available: true },
      ],
      colors: ["#0f172a", "#dc2626", "#ffffff"],
      whatsappNumber: selectedModalProduct.whatsappNumber || "6281234567890",
      tags: ["HIMSI", "SI", "Gunadarma"],
      tagline: "Official Merchandise HIMSI UG",
      details: ["Bahan High Quality", "Desain Eksklusif HIMSI UG", "Tahan Lama & Nyaman Dipakai"],
    }
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0e1f] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 relative overflow-hidden">
        {/* Ambient Subtle Grid & Background Mask */}
        <div className="pointer-events-none absolute inset-0 select-none">
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-600/10 dark:bg-red-900/12 blur-[140px] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 z-10">
          {/* Header & Title */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 text-xs font-bold font-mono tracking-wide backdrop-blur-md shadow-sm">
              <Sparkles size={13} className="animate-spin text-red-500" />
              Official Merchandise HIMSI UG
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15]">
              Official Catalog <br className="hidden sm:inline" />
              <LiveText />
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium max-w-2xl mx-auto">
              Tampil bangga dengan identitas Sistem Informasi Gunadarma. Temukan hoodie, kaos, totebag, lanyard, dan stiker berkualitas tinggi dengan desain eksklusif.
            </p>
          </motion.div>

          {/* Category Pill Filters */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold font-mono transition-all cursor-pointer border ${isSelected
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white border-transparent shadow-md shadow-red-900/20 scale-105"
                      : "bg-white/90 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-red-500/40 hover:text-red-600 dark:hover:text-red-400"
                    }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 px-6 text-center space-y-3 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 max-w-md mx-auto"
            >
              <PackageOpen size={48} className="mx-auto text-slate-400" />
              <h3 className="font-extrabold text-slate-800 dark:text-slate-200">
                Produk Tidak Ditemukan
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Belum ada merchandise yang sesuai dengan kategori ini saat ini.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((item, index) => {
                const title = item.title || "Merchandise";
                const price = item.price || "Rp 0";
                const image = item.image || "";
                const category = item.category || "Apparel";
                const description = item.description || "Official Merchandise HIMSI UG";
                const waContact = item.whatsappNumber || "6281234567890";

                const isReady = item.status === "READY" || item.status === "available";
                const isPreOrder = item.status === "PRE-ORDER" || item.status === "pre-order";

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    className="group relative flex flex-col justify-between rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                  >
                    {/* Card Image Container */}
                    <div className="relative w-full aspect-[4/3] bg-slate-950 overflow-hidden">
                      <img
                        src={getValidImageUrl(image, title)}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Dark overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                      {/* Status Badge */}
                      <div className="absolute top-3.5 left-3.5">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase border shadow-sm ${isReady
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 backdrop-blur-md"
                              : isPreOrder
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/40 backdrop-blur-md"
                                : "bg-red-500/20 text-red-400 border-red-500/40 backdrop-blur-md"
                            }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      {/* Price Tag Overlay */}
                      <div className="absolute bottom-3.5 right-3.5">
                        <span className="px-3.5 py-1.5 rounded-2xl bg-slate-900/90 text-white text-xs font-mono font-bold tracking-tight border border-slate-700/60 backdrop-blur-md shadow-lg">
                          {price}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-red-600 dark:text-red-400">
                          {category}
                        </span>
                        <h3 className="font-extrabold font-heading text-lg text-slate-900 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
                          {title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                          {description}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2.5 pt-2">
                        <button
                          onClick={() => setSelectedModalProduct(item)}
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold font-mono transition-colors cursor-pointer"
                        >
                          <Eye size={14} /> Detail
                        </button>

                        <a
                          href={formatWhatsAppUrl(
                            waContact,
                            `Halo Admin HIMSI, saya berminat memesan merchandise *${title}*. Apakah masih tersedia?`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold font-mono shadow-md shadow-red-900/20 transition-all cursor-pointer"
                        >
                          <ShoppingBag size={14} /> Pesan WA
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Bottom Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-red-950 border border-slate-800/80 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/30 text-red-400 text-[10px] font-bold font-mono uppercase tracking-wider border border-red-500/30">
                <Flame size={12} /> Custom Orders
              </span>
              <h3 className="text-xl font-black font-heading tracking-tight">
                Punya Pertanyaan Seputar Merchandise?
              </h3>
              <p className="text-xs text-slate-300 max-w-xl font-medium leading-relaxed">
                Hubungi tim Merchandise HIMSI UG untuk info ukuran, custom nama, atau status ketersediaan stok barang.
              </p>
            </div>

            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-white text-slate-950 font-bold font-mono text-xs sm:text-sm hover:bg-slate-100 transition-colors shrink-0 shadow-lg"
            >
              Hubungi Admin via WA →
            </a>
          </div>
        </div>
      </main>

      <Footer />

      {/* Detail Modal */}
      {modalItem && (
        <MerchandiseModal
          item={modalItem}
          onClose={() => setSelectedModalProduct(null)}
        />
      )}
    </div>
  );
}
