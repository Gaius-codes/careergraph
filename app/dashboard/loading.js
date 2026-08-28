export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="animate-pulse">
        <div className="h-8 w-56 rounded-lg bg-slate-200" />
        <div className="mt-3 h-4 w-80 rounded bg-slate-200" />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
}