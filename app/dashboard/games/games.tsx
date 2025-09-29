"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Brain, Target, Puzzle, TrendingUp } from "lucide-react";
import React from "react";

// Minimal, abstract launch glyph (replaces cartoon rocket)
const LaunchGlyph = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none">
    <path d="M32 6c10 6 16 18 16 30v6l-4-2-4 6-4-4-4 6-4-4-4 6-4-4-4 6v-10c0-12 6-24 16-30Z" fill="#3b82f6" opacity="0.9" />
    <circle cx="32" cy="22" r="5" fill="#10b981" />
  </svg>
);

export default function Home() {
  const router = useRouter();
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('completedModules');
    if (saved) {
      setCompletedModules(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('completedModules', JSON.stringify(completedModules));
  }, [completedModules]);

  const trainingModules = [
    {
      id: "memory",
      title: "Memory",
      description: "Working, visual, and episodic recall exercises.",
      icon: Brain,
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1400&auto=format&fit=crop"
    },
    {
      id: "attention",
      title: "Focus",
      description: "Sustained, selective and divided attention drills.",
      icon: Target,
      image: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=1400&auto=format&fit=crop"
    },
    {
      id: "problem-solving",
      title: "Problem Solving",
      description: "Reasoning, planning and pattern synthesis.",
      icon: Puzzle,
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1400&auto=format&fit=crop"
    },
    {
      id: "behavior",
      title: "Habits",
      description: "Consistency, routines and performance tracking.",
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1400&auto=format&fit=crop"
    }
  ];

  const handleNavigation = (moduleId: string) => {
    if (moduleId === "memory") {
      router.push("games/memory");
    } else if (moduleId === "attention") {
      router.push("games/attention");
    } else if (moduleId === "problem-solving") {
      router.push("games/problem-solving");
    } else if (moduleId === "behavior") {
      router.push("games/behavior");
    }
  };

  const handleManualCompletion = (moduleId: string) => {
    if (completedModules.includes(moduleId)) {
      const newCompletedModules = completedModules.filter(id => id !== moduleId);
      setCompletedModules(newCompletedModules);
    } else {
      const newCompletedModules = [...completedModules, moduleId];
      setCompletedModules(newCompletedModules);
    }
  };

  const isAllCompleted = completedModules.length === 4;

  return (
    <div className="min-h-screen bg-[#1a1b3e]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="rounded-xl border border-[#2d3748] bg-[#2d2f55]/40 backdrop-blur-sm p-8 mb-8">
          <div className="flex items-center justify-center gap-3">
            <LaunchGlyph />
            <div className="text-center">
              <h1 className="text-2xl md:text-4xl font-semibold text-white">Cognitive Enhancement Suite</h1>
              <p className="text-slate-300 text-base md:text-lg mt-2">Evidence-based modules for mental performance training.</p>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <div className="px-4 py-2 rounded-md bg-[#2d3748] text-slate-200 text-sm">Progress: {completedModules.length}/4{isAllCompleted ? " (All complete)" : ""}</div>
          </div>
        </section>

        <section className="mb-8">
          <motion.h2
            className="text-white/90 text-xl font-medium mb-4"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Training Modules
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
          >
            {trainingModules.map((module, idx) => {
              const Icon = module.icon as any;
              const isCompleted = completedModules.includes(module.id);
              return (
                <motion.button
                  key={module.id}
                  onClick={() => handleNavigation(module.id)}
                  className={`text-left w-full rounded-lg border overflow-hidden transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 ${isCompleted ? 'border-[#10b981] bg-[#1f2046]' : 'border-[#2d3748] bg-[#1f2046] hover:border-[#3b82f6]'}`}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                >
                  {module.image && (
                    <div className="relative h-36">
                      <motion.img
                        src={module.image}
                        alt={module.title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.03 }}
                        whileHover={{ scale: 1.07 }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1f2046] via-[#1f2046]/30 to-transparent" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-md flex items-center justify-center bg-[#2d3748]">
                        <Icon className={`w-5 h-5 ${isCompleted ? 'text-[#10b981]' : 'text-[#3b82f6]'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                          {isCompleted && (
                            <span className="text-[#10b981] text-xs font-medium">Completed</span>
                          )}
                        </div>
                        <p className="text-slate-300 mt-1 text-sm leading-relaxed">{module.description}</p>
                        <div
                          className="mt-4 inline-flex items-center gap-2 text-xs text-slate-300"
                          onClick={(e) => { e.stopPropagation(); handleManualCompletion(module.id); }}
                          role="checkbox"
                          aria-checked={isCompleted}
                        >
                          <span className={`inline-flex w-4 h-4 items-center justify-center rounded border ${isCompleted ? 'bg-[#10b981] border-[#10b981] text-white' : 'bg-transparent border-slate-500'}`}>{isCompleted ? '✓' : ''}</span>
                          <span>{isCompleted ? 'Mark as incomplete' : 'Mark as complete'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </section>
      </main>
    </div>
  );
}