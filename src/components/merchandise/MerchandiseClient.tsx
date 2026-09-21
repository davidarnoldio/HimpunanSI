"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  PackageOpen,
  Eye,
  Flame,
  ArrowRight,
} from "lucide-react";
import { Navbar, Footer } from "@/components/landing";
import { MerchandiseModal } from "@/components/merchandise/MerchandiseModal";
import { HackerMatrixBackground } from "@/components/ui/HackerMatrixBackground";
import { getValidImageUrl, formatWhatsAppUrl } from "@/lib/sharedStore";
import type { MerchandiseAdminItem } from "@/data/adminMockData";
import type { MerchandiseItem, MerchandiseCategory } from "@/data/merchandise";

const CATEGORIES = ["Semua", "Apparel", "Accessories"];

const LIVE_WORDS = [
  "MERCHANDISE DROP",
  "APPAREL 2026",
  "CAMPUS TECH-WEAR",
  "EXCLUSIVE CATALOG",
  "HIMASI COLLECTION",
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
          initial={{ y: 36, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -36, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="inline-block text-[#C8102E] dark:text-[#E31B3B]"
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
      name: selectedModalProduct.title || "Merchandise HIMASI",
      category: (selectedModalProduct.category.toLowerCase() === "apparel" ? "apparel" : "accessories") as MerchandiseCategory,
      price: parseInt((selectedModalProduct.price || "0").replace(/[^0-9]/g, ""), 10) || 50000,
      images: [getValidImageUrl(selectedModalProduct.image, selectedModalProduct.title)],
      status: selectedModalProduct.status === "READY" ? "available" : selectedModalProduct.status === "PRE-ORDER" ? "pre-order" : "sold-out",
      badge: selectedModalProduct.badge || "Eksklusif",
      description: selectedModalProduct.description || "Official Merchandise HIMASI UG.",
      sizes: [
        { label: "S", available: true },
        { label: "M", available: true },
        { label: "L", available: true },
        { label: "XL", available: true },
        { label: "XXL", available: true },
      ],
      colors: ["#0f172a", "#dc2626", "#ffffff"],
      whatsappNumber: selectedModalProduct.whatsappNumber || "6281234567890",
      tags: ["HIMASI", "SI", "Gunadarma"],
      tagline: "Official Merchandise HIMASI UG",
      details: ["Bahan High Quality", "Desain Eksklusif HIMASI UG", "Tahan Lama & Nyaman Dipakai"],
    }
    : null;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 select-none opacity-40">
          <HackerMatrixBackground />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 z-10">
          {/* Header & Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-left space-y-4 max-w-3xl border-b-2 border-slate-950 dark:border-white/20 pb-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles size={12} />
              OFFICIAL MERCHANDISE HIMASI UG
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tighter uppercase text-slate-950 dark:text-white">
              KATALOG <LiveText />
            </h1>

            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-medium max-w-2xl">
              Tampil bangga dengan identitas Sistem Informasi Gunadarma. Temukan hoodie, kaos, totebag, lanyard, dan stiker berkualitas tinggi dengan desain eksklusif.
            </p>
          </motion.div>

          {/* Category Pill Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 text-xs font-black font-mono tracking-widest uppercase border-2 border-slate-950 transition-colors cursor-pointer ${isSelected
                      ? "bg-[#C8102E] dark:bg-[#E31B3B] text-white"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-950 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 px-6 text-center space-y-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 max-w-md mx-auto"
            >
              <PackageOpen size={48} className="mx-auto text-slate-400" />
              <h3 className="font-black font-heading text-lg uppercase text-slate-950 dark:text-white">
                PRODUK TIDAK DITEMUKAN
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono font-bold">
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
                const description = item.description || "Official Merchandise HIMASI UG";
                const waContact = item.whatsappNumber || "6281234567890";

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    className="group flex flex-col justify-between bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-950 dark:border-white/20 hover:shadow-[6px_6px_0px_0px_rgba(200,16,46,1)] transition-all duration-200"
                  >
                    {/* Card Image Container */}
                    <div className="relative w-full aspect-[4/3] bg-slate-950 border-b-2 border-slate-950 dark:border-white/20 overflow-hidden">
                      <img
                        src={getValidImageUrl(image, title)}
                        alt={title}
                        className="w-full h-full object-cover transition-all duration-300"
                      />

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-[#C8102E] text-white text-[10px] font-black font-mono tracking-widest uppercase border border-slate-950">
                          {item.status}
                        </span>
                      </div>

                      {/* Price Tag Overlay */}
                      <div className="absolute bottom-3 right-3">
                        <span className="px-3.5 py-1.5 bg-slate-950 text-white text-xs font-mono font-black tracking-widest border border-slate-950 uppercase">
                          {price}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black font-mono uppercase tracking-widest text-[#C8102E] dark:text-[#E31B3B]">
                          {category}
                        </span>
                        <h3 className="font-black font-heading text-lg uppercase text-slate-950 dark:text-white group-hover:text-[#C8102E] dark:group-hover:text-[#E31B3B] transition-colors line-clamp-1">
                          {title}
                        </h3>
                        <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
                          {description}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => setSelectedModalProduct(item)}
                          className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-black font-mono uppercase border border-slate-950 hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors cursor-pointer"
                        >
                          <Eye size={14} /> DETAIL
                        </button>

                        <a
                          href={formatWhatsAppUrl(
                            waContact,
                            `Halo Admin HIMASI, saya berminat memesan merchandise *${title}*. Apakah masih tersedia?`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2.5 bg-[#C8102E] dark:bg-[#E31B3B] text-white text-xs font-black font-mono uppercase border border-slate-950 hover:bg-slate-950 transition-colors cursor-pointer"
                        >
                          <ShoppingBag size={14} /> PESAN WA
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Bottom Banner */}
          <div className="p-8 sm:p-12 bg-slate-950 text-white border-2 border-slate-950 dark:border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E31B3B] text-white text-[10px] font-black font-mono uppercase tracking-widest">
                <Flame size={12} /> CUSTOM ORDERS
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-heading uppercase tracking-tight text-white">
                PUNYA PERTANYAAN SEPUTAR MERCHANDISE?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
                Hubungi tim Merchandise HIMASI UG untuk info ukuran, custom nama, atau status ketersediaan stok barang.
              </p>
            </div>

            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-slate-950 font-black font-mono text-xs uppercase tracking-widest hover:bg-[#E31B3B] hover:text-white transition-colors shrink-0 border-2 border-white"
            >
              HUBUNGI ADMIN VIA WA <ArrowRight size={14} className="inline ml-1" />
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
