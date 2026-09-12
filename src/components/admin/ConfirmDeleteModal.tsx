"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Trash2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  title,
  description,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 p-6 shadow-[6px_6px_0px_0px_rgba(200,16,46,1)] space-y-4"
        >
          <div className="flex items-start justify-between border-b-2 border-slate-950 dark:border-white/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#C8102E] text-white border border-slate-950">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="font-black font-heading text-base uppercase text-slate-950 dark:text-white">
                  {title}
                </h3>
                <p className="text-[10px] font-mono font-bold text-[#C8102E] dark:text-[#E31B3B] uppercase">
                  KONFIRMASI TINDAKAN HAPUS
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium bg-slate-50 dark:bg-slate-900 p-3 border border-slate-950 dark:border-white/20">
            {description}
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white text-xs font-black font-mono uppercase tracking-wider border-2 border-slate-950 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              BATAL
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#C8102E] hover:bg-slate-950 text-white text-xs font-black font-mono uppercase tracking-wider border-2 border-slate-950 transition-colors"
            >
              <Trash2 size={14} /> HAPUS PERMANEN
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
