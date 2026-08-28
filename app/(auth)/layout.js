"use client";

import { motion } from "framer-motion";

export default function AuthLayout({ children }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {/* Brand panel */}
        <div className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:w-1/2 select-none">
          {/* Animated Ambient Glow Orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{
                x: [0, 30, -20, 0],
                y: [0, -40, 20, 0],
                scale: [1, 1.15, 0.95, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              className="absolute -left-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-indigo-600/25 blur-[120px]"
            />

            <motion.div
              animate={{
                x: [0, -40, 20, 0],
                y: [0, 30, -30, 0],
                scale: [1, 0.9, 1.1, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              className="absolute -bottom-32 -right-32 h-[30rem] w-[30rem] rounded-full bg-violet-600/25 blur-[120px]"
            />

            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
          </div>

          {/* Main Content Layout */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16"
          >
            {/* Brand Header */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-base font-extrabold text-white shadow-lg shadow-indigo-500/20"
              >
                C
              </motion.div>

              <span className="text-xl font-bold tracking-tight text-white">
                CareerGraph
              </span>
            </motion.div>

            {/* Center Feature Section with Interactive Graph Preview */}
            <div className="my-auto max-w-lg py-8">
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  Your Career, Connected
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="mt-6 text-4xl font-extrabold leading-[1.15] text-white xl:text-5xl"
              >
                Discover opportunities through connections that matter.
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-6 text-base leading-relaxed text-slate-400 xl:text-lg"
              >
                Connect your skills, projects, technologies, and experience to
                discover relevant opportunities and uncover what to learn next.
              </motion.p>

              {/* Graphic Element: Interactive Node Preview Badge */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -3 }}
                className="mt-8 flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md"
              >
                <div className="flex -space-x-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-slate-900 bg-indigo-600 text-xs font-bold text-white shadow-xs">
                    React
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-slate-900 bg-violet-600 text-xs font-bold text-white shadow-xs">
                    Node
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-slate-900 bg-emerald-600 text-xs font-bold text-white shadow-xs">
                    SQL
                  </div>
                </div>

                <div className="text-xs">
                  <p className="font-semibold text-slate-200">
                    12+ Skill Connections Map
                  </p>
                  <p className="text-slate-400">
                    Real-time graph matching active
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between border-t border-slate-800/60 pt-6 text-xs text-slate-500"
            >
              <span>Explore your career graph.</span>
              <span className="font-semibold text-slate-400">v1.0.0</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Auth content */}
        <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </main>
  );
}
