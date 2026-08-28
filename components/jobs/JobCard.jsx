"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import MatchScore from "./MatchScore";
import SkillBadge from "./SkillBadge";

export default function JobCard({ job }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {job.industry && (
              <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {job.industry}
              </span>
            )}

            {job.workType && (
              <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                {job.workType}
              </span>
            )}
          </div>

          <h3 className="mt-3 text-base font-bold text-slate-900 sm:text-lg">
            {job.title}
          </h3>

          <p className="mt-1 text-sm font-medium text-slate-500">
            {job.company}
          </p>

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
            <span>{job.location}</span>
            <span>•</span>
            <span>{job.employmentType}</span>

            {job.salaryRange && (
              <>
                <span>•</span>
                <span>{job.salaryRange}</span>
              </>
            )}
          </div>
        </div>

        <MatchScore
          score={job.matchScore}
          matchingRequired={job.matchingRequired}
          totalRequired={job.totalRequired}
          compact
        />
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
        {job.description}
      </p>

      {job.skills?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.slice(0, 5).map((skill) => (
            <SkillBadge
              key={skill.id}
              skill={skill}
              matched={skill.matched}
              importance={skill.importance}
            />
          ))}
        </div>
      )}

      <div className="mt-5 border-t border-slate-100 pt-4">
        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 transition group-hover:gap-3 hover:text-indigo-700"
        >
          View opportunity
          <span>→</span>
        </Link>
      </div>
    </motion.div>
  );
}
