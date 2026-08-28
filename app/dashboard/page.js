"use client";

import { motion } from "framer-motion";

export default function DashboardPage() {
  // Stagger Container Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 border border-indigo-100">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
            Career Overview
          </span>
        </div>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Your Career Graph
        </h1>

        <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-500">
          Explore how your skills, projects, technologies, and experience
          connect to real career opportunities.
        </p>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={itemVariants}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          label="Skills"
          value="—"
          subtext="Nodes connected"
          icon={
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          }
        />
        <StatCard
          label="Projects"
          value="—"
          subtext="Active repositories"
          icon={
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          }
        />
        <StatCard
          label="Job Matches"
          value="—"
          subtext="Graph recommendations"
          icon={
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          }
        />
        <StatCard
          label="Skill Gaps"
          value="—"
          subtext="Targeted growth"
          icon={
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          }
        />
      </motion.section>

      {/* Main Grid Content */}
      <motion.section
        variants={itemVariants}
        className="grid gap-6 lg:grid-cols-3"
      >
        {/* Recommended Opportunities */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Recommended Opportunities
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Jobs connected to your skills and experience.
                </p>
              </div>

              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer">
                View all
              </button>
            </div>

            {/* Empty State visual */}
            <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.25 11.75h-4.5m4.5 3h-4.5m9-9l-5.25 5.25"
                  />
                </svg>
              </div>

              <p className="text-sm font-semibold text-slate-800">
                Job recommendations will appear here.
              </p>

              <p className="mt-1 max-w-sm text-xs text-slate-500">
                {`We're currently connecting your career graph to available live market opportunities.`}
              </p>
            </div>
          </div>
        </div>

        {/* Skill Development */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Skill Development
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Skills that could unlock more opportunities.
            </p>

            {/* Empty State visual */}
            <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-3">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
              </div>

              <p className="text-sm font-semibold text-slate-800">
                No skill gaps detected
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Add projects to your graph to reveal potential tech stack gaps.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Graph Visual Banner */}
      <motion.section
        variants={itemVariants}
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.2 }}
        className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 shadow-xl shadow-slate-900/10"
      >
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 right-1/3 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-400">
            Explore The Graph
          </span>

          <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
            See how everything connects.
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {`Discover relationships between skills, technologies, projects, companies, and opportunities using CareerGraph's underlying graph database.`}
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-white/10 transition hover:bg-slate-100 cursor-pointer"
          >
            <span>Explore Career Graph</span>
            <svg
              className="h-4 w-4 text-slate-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </motion.button>
        </div>
      </motion.section>
    </motion.div>
  );
}

// Sub-component for clean reusable Stat Cards
function StatCard({ label, value, subtext, icon }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {icon}
          </svg>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-3xl font-extrabold tracking-tight text-slate-900">
          {value}
        </p>

        {subtext && (
          <p className="mt-1 text-xs text-slate-400 font-medium">{subtext}</p>
        )}
      </div>
    </motion.div>
  );
}