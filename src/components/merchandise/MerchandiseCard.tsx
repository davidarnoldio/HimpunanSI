"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Tag, CheckCircle2, Clock, XCircle, Star, Flame } from "lucide-react";
import type { MerchandiseItem } from "@/data/merchandise";
import { STATUS_COLORS, STATUS_LABELS } from "@/data/merchandise";

interface MerchandiseCardProps {
  item: MerchandiseItem;
  index: number;
  onClick: (item: MerchandiseItem) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: "easeOut" as const },
  }),
};

export function MerchandiseCard({ item, index, onClick }: MerchandiseCardProps) {
  const statusCls = STATUS_COLORS[item.status];
  const isSoldOut = item.status === "sold-out";
  const isComingSoon = item.status === "coming-soon";

  const discount = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : null;

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      onClick={() => onClick(item)}
      className="group relative flex flex-col cursor-pointer rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-red-500/50 overflow-hidden transition-colors duration-300 shadow-lg hover:shadow-[0_8px_40px_rgba(220,38,38,0.15)]"
      role="button"
      tabIndex={0}
      aria-label={`Lihat detail ${item.name}`}
      onKeyDown={(e) => e.key === "Enter" && onClick(item)}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-slate-950">
        <Image
          src={item.images[0]}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
            (isSoldOut || isComingSoon) ? "opacity-50 grayscale" : ""
          }`}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {item.isNew && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-violet-600/90 text-white backdrop-blur-sm">
              <Star size={9} />
              NEW
            </span>
          )}
          {item.isBestSeller && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/90 text-white backdrop-blur-sm">
              <Flame size={9} />
              BEST
            </span>
          )}
        </div>

        {/* Discount badge */}
        {discount && !isSoldOut && !isComingSoon && (
          <div className="absolute top-3 right-3 w-11 h-11 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
            <span className="text-xs font-black text-white leading-none text-center">
              -{discount}%
            </span>
          </div>
        )}

        {/* Sold out / Coming soon overlay */}
        {(isSoldOut || isComingSoon) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-4 py-2 rounded-full text-sm font-bold bg-slate-900/90 backdrop-blur border border-slate-700 text-slate-400">
              {isComingSoon ? "🕐 Segera Hadir" : "❌ Stok Habis"}
            </span>
          </div>
        )}

        {/* Quick preview hint */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="py-2 rounded-xl bg-slate-900/90 backdrop-blur border border-red-500/30 text-center text-xs font-semibold text-red-400">
            Klik untuk detail →
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className="flex flex-col gap-3 p-4">
        {/* Status badge */}
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCls}`}>
            {item.status === "available" && <CheckCircle2 size={10} />}
            {item.status === "pre-order" && <Clock size={10} />}
            {item.status === "sold-out" && <XCircle size={10} />}
            {item.status === "coming-soon" && <Clock size={10} />}
            {STATUS_LABELS[item.status]}
          </span>
          {item.badge && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-600/20 text-red-400 border border-red-600/30">
              <Tag size={9} />
              {item.badge}
            </span>
          )}
        </div>

        {/* Product name */}
        <div>
          <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-red-400 transition-colors duration-200">
            {item.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 italic">&ldquo;{item.tagline}&rdquo;</p>
        </div>

        {/* Price row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xl font-black text-red-500">
            Rp {item.price.toLocaleString("id-ID")}
          </span>
          {item.originalPrice && (
            <span className="text-sm text-slate-600 line-through">
              Rp {item.originalPrice.toLocaleString("id-ID")}
            </span>
          )}
        </div>

        {/* Color dots */}
        {item.colors && item.colors.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-600">Warna:</span>
            {item.colors.map((c) => (
              <span
                key={c}
                className="w-4 h-4 rounded-full border border-slate-600 ring-1 ring-transparent"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        )}

        {/* Sizes preview */}
        {item.sizes && item.sizes.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {item.sizes
              .filter((s) => s.available)
              .slice(0, 5)
              .map((s) => (
                <span
                  key={s.label}
                  className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700/70"
                >
                  {s.label}
                </span>
              ))}
            {item.sizes.filter((s) => !s.available).length > 0 && (
              <span className="text-xs text-slate-600">+tersedia</span>
            )}
          </div>
        )}
      </div>

      {/* Bottom glow line on hover */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.article>
  );
}
