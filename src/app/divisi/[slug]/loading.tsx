export default function LoadingDetailDivisi() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-black text-slate-950 dark:text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Header Loading Skeleton */}
      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12 animate-pulse">
        {/* Back Link Skeleton */}
        <div className="w-36 h-9 bg-slate-200 dark:bg-slate-800 border border-slate-950 dark:border-white/20" />

        {/* Division Header Skeleton */}
        <div className="text-center max-w-4xl mx-auto space-y-4 flex flex-col items-center border-b-2 border-slate-950/20 dark:border-white/10 pb-8">
          <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 border border-slate-950/20" />
          <div className="w-3/4 max-w-xl h-12 bg-slate-300 dark:bg-slate-700" />
          <div className="w-full max-w-2xl h-16 bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Leadership Section Skeleton */}
        <div className="space-y-6">
          <div className="w-48 h-8 bg-[#C8102E]/20 border border-[#C8102E] mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="h-80 bg-slate-100 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 p-6 flex flex-col items-center justify-between">
              <div className="w-24 h-4 bg-slate-300 dark:bg-slate-700" />
              <div className="w-40 h-48 bg-slate-200 dark:bg-slate-800" />
              <div className="w-32 h-6 bg-slate-300 dark:bg-slate-700" />
            </div>
            <div className="h-80 bg-slate-100 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 p-6 flex flex-col items-center justify-between">
              <div className="w-24 h-4 bg-slate-300 dark:bg-slate-700" />
              <div className="w-40 h-48 bg-slate-200 dark:bg-slate-800" />
              <div className="w-32 h-6 bg-slate-300 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
