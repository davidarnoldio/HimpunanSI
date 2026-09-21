"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink, MessageCircle, Package, Tag, Ruler, Palette, CheckCircle2, XCircle, Clock, ShoppingBag } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import type { MerchandiseItem } from "@/data/merchandise";
import { STATUS_COLORS, STATUS_LABELS } from "@/data/merchandise";

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

const MotionImage = motion(Image);

function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const prev = () => setActiveIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIdx((i) => (i + 1) % images.length);

  return (
    <div className="relative flex flex-col gap-3">
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 group">
        <AnimatePresence mode="wait">
          <MotionImage
            key={activeIdx}
            src={images[activeIdx]}
            alt={`${name} - gambar ${activeIdx + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 backdrop-blur border border-slate-700 text-slate-300 hover:text-white hover:border-red-500/60 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Gambar sebelumnya"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 backdrop-blur border border-slate-700 text-slate-300 hover:text-white hover:border-red-500/60 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Gambar berikutnya"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`relative flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${i === activeIdx
                  ? "border-red-500 shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                  : "border-slate-700/60 hover:border-red-500/40"
                }`}
              aria-label={`Lihat gambar ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, 100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SizeSelector({
  sizes,
  selected,
  onSelect,
}: {
  sizes: MerchandiseItem["sizes"];
  selected: string | null;
  onSelect: (s: string) => void;
}) {
  if (!sizes || sizes.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Ruler size={12} />
        Pilih Ukuran
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map(({ label, available }) => (
          <button
            key={label}
            disabled={!available}
            onClick={() => available && onSelect(label)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${!available
                ? "opacity-40 cursor-not-allowed border-slate-700 text-slate-500 line-through"
                : selected === label
                  ? "border-red-500 bg-red-500/20 text-red-400 shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                  : "border-slate-700 text-slate-300 hover:border-red-500/50 hover:text-white"
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ColorSwatch({ colors }: { colors?: string[] }) {
  if (!colors || colors.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Palette size={12} />
        Pilihan Warna
      </p>
      <div className="flex gap-2.5">
        {colors.map((c) => (
          <span
            key={c}
            title={c}
            className="w-8 h-8 rounded-full border-2 border-slate-600 ring-2 ring-transparent hover:ring-red-500 cursor-pointer transition-all duration-200 shadow-md"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Modal Component
// ─────────────────────────────────────────────

interface MerchandiseModalProps {
  item: MerchandiseItem | null;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, damping: 26, stiffness: 300 } },
  exit: { opacity: 0, y: 40, scale: 0.97, transition: { duration: 0.22 } },
};

export function MerchandiseModal({ item, onClose }: MerchandiseModalProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Reset selected size when item changes
  if (!item) return null;

  const isSoldOut = item.status === "sold-out";
  const isComingSoon = item.status === "coming-soon";
  const canOrder = !isSoldOut && !isComingSoon;

  const discount = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : null;

  const waMessage = encodeURIComponent(
    `Halo HIMASI UG! Saya ingin memesan *${item.name}*${selectedSize ? ` ukuran *${selectedSize}*` : ""}.\nMohon info lebih lanjut mengenai ketersediaan dan cara pembayaran. Terima kasih! 🙏`
  );
  const waUrl = `https://wa.me/${item.whatsappNumber}?text=${waMessage}`;

  const statusCls = STATUS_COLORS[item.status];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

        {/* Panel */}
        <motion.div
          className="relative z-10 w-full sm:max-w-4xl max-h-[95dvh] sm:max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-slate-950/95 border border-slate-800/80 shadow-[0_0_80px_rgba(220,38,38,0.12)]"
          variants={panelVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle (mobile) */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-slate-700" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white hover:border-red-500/60 hover:bg-red-950/30 transition-all duration-200"
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>

          {/* Glow accent */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 sm:p-8 pt-4 sm:pt-8">
            {/* Left: Image gallery */}
            <ImageGallery images={item.images} name={item.name} />

            {/* Right: Product details */}
            <div className="flex flex-col gap-5">
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusCls}`}>
                  {item.status === "available" && <CheckCircle2 size={11} />}
                  {item.status === "pre-order" && <Clock size={11} />}
                  {item.status === "sold-out" && <XCircle size={11} />}
                  {item.status === "coming-soon" && <Clock size={11} />}
                  {STATUS_LABELS[item.status]}
                </span>
                {item.badge && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-600/20 text-red-400 border border-red-600/30">
                    <Tag size={10} />
                    {item.badge}
                  </span>
                )}
                {item.isNew && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30">
                    NEW
                  </span>
                )}
                {item.isBestSeller && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    🔥 BEST SELLER
                  </span>
                )}
              </div>

              {/* Name & tagline */}
              <div>
                <h2 className="text-2xl font-extrabold text-slate-100 leading-tight">{item.name}</h2>
                <p className="text-sm text-slate-500 mt-1 italic">&quot;{item.tagline}&quot;</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-red-500">
                  Rp {item.price.toLocaleString("id-ID")}
                </span>
                {item.originalPrice && (
                  <>
                    <span className="text-base text-slate-500 line-through">
                      Rp {item.originalPrice.toLocaleString("id-ID")}
                    </span>
                    {discount && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                        -{discount}%
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Separator */}
              <div className="h-px bg-gradient-to-r from-slate-800 via-red-900/30 to-slate-800" />

              {/* Description */}
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                &ldquo;{item.description}&rdquo;
              </p>

              {/* Size selector */}
              <SizeSelector sizes={item.sizes} selected={selectedSize} onSelect={setSelectedSize} />

              {/* Color swatches */}
              <ColorSwatch colors={item.colors} />

              {/* Details list */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Package size={12} />
                  Spesifikasi Produk
                </p>
                <ul className="space-y-1.5">
                  {item.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stock indicator */}
              {item.stock !== undefined && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShoppingBag size={12} />
                  <span>Stok tersedia: <span className="text-slate-300 font-semibold">{item.stock} pcs</span></span>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                {canOrder && (
                  <motion.a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03, boxShadow: "0 0 28px rgba(220,38,38,0.45)" }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 transition-colors duration-200 shadow-lg shadow-red-900/30 text-sm"
                    aria-label={`Pesan ${item.name} via WhatsApp`}
                  >
                    <MessageCircle size={17} />
                    Order via WhatsApp
                  </motion.a>
                )}
                {item.orderFormUrl && canOrder && (
                  <motion.a
                    href={item.orderFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-slate-300 bg-slate-800/80 border border-slate-700 hover:border-red-500/50 hover:text-white transition-all duration-200 text-sm"
                    aria-label={`Isi form order ${item.name}`}
                  >
                    <ExternalLink size={15} />
                    Isi Form Order
                  </motion.a>
                )}
                {(isSoldOut || isComingSoon) && (
                  <div className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-800/40 border border-slate-700/50 cursor-not-allowed text-sm">
                    {isSoldOut ? <XCircle size={17} /> : <Clock size={17} />}
                    {isSoldOut ? "Stok Habis" : "Segera Hadir"}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full text-xs text-slate-500 bg-slate-800/60 border border-slate-700/60">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
