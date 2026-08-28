export default function MatchScore({
  score = 0,
  matchingRequired = 0,
  totalRequired = 0,
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12">
        <svg
          className="h-12 w-12 -rotate-90"
          viewBox="0 0 48 48"
        >
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-slate-200"
          />

          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${(score / 100) * 125.6} 125.6`}
            strokeLinecap="round"
            className="text-indigo-500"
          />
        </svg>

        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
          {score}%
        </span>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-800">
          Match Score
        </p>

        <p className="text-xs text-slate-500">
          {matchingRequired} of {totalRequired} required skills
        </p>
      </div>
    </div>
  );
}