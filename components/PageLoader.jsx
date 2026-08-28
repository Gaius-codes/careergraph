export default function PageLoader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-slate-200" />

          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-500" />
        </div>

        <p className="mt-4 text-xs font-semibold tracking-wide text-slate-400">
          {label}
        </p>
      </div>
    </div>
  );
}