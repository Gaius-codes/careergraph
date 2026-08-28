export default function SkillBadge({
  skill,
  matched = false,
  importance = "required",
}) {
  const isPreferred = importance === "preferred";

  const skillName =
    typeof skill === "string"
      ? skill
      : skill?.name || skill?.label || skill?.id || "Unknown skill";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
        matched
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : isPreferred
            ? "border-amber-200 bg-amber-50 text-amber-700"
            : "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {matched && (
        <svg
          className="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.416 0l-3.2-3.2a1 1 0 011.416-1.42L8.8 11.79l6.496-6.5a1 1 0 011.408 0z"
            clipRule="evenodd"
          />
        </svg>
      )}

      {skillName}
    </span>
  );
}