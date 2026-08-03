"use client";

import React from "react";

// B1 FIX: Keyframes diimplementasikan via inline style object agar kompatibel penuh
// dengan Next.js App Router (tidak menggunakan <style jsx> milik Pages Router).
const matrixKeyframes = `
@keyframes matrix-scroll-down {
  0% { transform: translateY(-50%); }
  100% { transform: translateY(0%); }
}
@keyframes matrix-scroll-up {
  0% { transform: translateY(0%); }
  100% { transform: translateY(-50%); }
}
.matrix-col-down {
  display: flex;
  flex-direction: column;
  animation: matrix-scroll-down linear infinite;
}
.matrix-col-up {
  display: flex;
  flex-direction: column;
  animation: matrix-scroll-up linear infinite;
}
`;

export function HackerMatrixBackground({ className = "" }: { className?: string }) {
  const codeColumns = [
    ["01001000", "01001001", "01001101", "01010011", "_SYS_INIT", "2.6_SECURE", "ACCESS_OK", "01010011", "ROOT_2026"],
    ["const himsi", "= {", "status: 'ONLINE'", "dept: 'SI'", "encrypted: true", "};", "RUN_CORE", "10101101"],
    ["SELECT *", "FROM mahasiswa", "WHERE role='DEV'", "AND status='ACTIVE'", "ORDER BY priority", "DESC;", "OK_200"],
    ["MATRIX_RUNNING", "LOG_SUCCESS", "HTTP/2.0", "0x960000", "DEV_MODE", "ACTIVE_SYS", "01000111", "GUNADARMA"],
    ["import React", "from 'next'", "CODE_VIBE", "ACTIVE_TRUE", "SYS_ONLINE", "SECURE_KEY", "01000010", "OK"],
    ["FIREWALL: ACTIVE", "SUPABASE_SYNC", "CONNECT_200", "ACCESS_LEVEL_MAX", "01110011", "ROOT_ACCESS", "AUTH_GRANTED"]
  ];

  return (
    <>
      {/* B1 FIX: Inject keyframes menggunakan tag <style> standar HTML5, bukan <style jsx> */}
      <style dangerouslySetInnerHTML={{ __html: matrixKeyframes }} />

      <div
        className={`absolute inset-0 pointer-events-none select-none overflow-hidden font-mono text-[11px] sm:text-xs leading-relaxed tracking-widest text-slate-800/25 dark:text-red-400/35 transition-colors duration-300 ${className}`}
        aria-hidden="true"
      >
        {/* Grid Kolom Vertikal */}
        <div className="absolute inset-0 flex justify-around px-2">
          {Array.from({ length: 10 }).map((_, colIndex) => {
            const isEven = colIndex % 2 === 0;
            const speed = 18 + (colIndex % 4) * 6;
            const data = codeColumns[colIndex % codeColumns.length];

            return (
              <div key={colIndex} className="overflow-hidden h-full py-4 flex flex-col items-center">
                <div
                  className={isEven ? "matrix-col-down" : "matrix-col-up"}
                  style={{ animationDuration: `${speed}s` }}
                >
                  {[...Array(3)].map((_, loopIdx) => (
                    <div key={loopIdx} className="flex flex-col gap-6 py-2 text-center font-bold">
                      {data.map((item, itemIdx) => (
                        <span key={itemIdx} className="block whitespace-nowrap">
                          {item}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}