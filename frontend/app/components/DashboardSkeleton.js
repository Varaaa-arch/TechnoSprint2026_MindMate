function Bone({ className = "" }) {
  return <div className={`bg-slate-100 rounded-2xl animate-pulse ${className}`} />;
}

export default function DashboardSkeleton() {
  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-[32px] p-7 border border-slate-100 shadow-sm space-y-3">
            <Bone className="h-3 w-24" />
            <Bone className="h-8 w-16" />
            <Bone className="h-5 w-14 rounded-full" />
          </div>
        ))}
      </div>

      {/* Daily summary */}
      <div className="mb-8 bg-slate-100 rounded-[32px] p-8 animate-pulse">
        <div className="flex gap-5">
          <Bone className="w-12 h-12 shrink-0" />
          <div className="flex-1 space-y-3">
            <Bone className="h-3 w-32" />
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-4">
          <Bone className="h-5 w-48" />
          <Bone className="h-3 w-64" />
          <Bone className="h-72 w-full mt-4" />
        </div>
        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-4">
          <Bone className="h-5 w-36 mx-auto" />
          <Bone className="w-48 h-48 rounded-full mx-auto" />
          <Bone className="h-20 w-full rounded-[28px]" />
        </div>
      </div>

      {/* Insights + recs */}
      <div className="mt-8 grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Bone className="h-6 w-40" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-[32px] p-6 border border-slate-100 flex gap-4">
              <Bone className="w-12 h-12 shrink-0" />
              <div className="flex-1 space-y-2">
                <Bone className="h-4 w-32" />
                <Bone className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
        <Bone className="rounded-[40px] h-64" />
      </div>
    </>
  );
}
