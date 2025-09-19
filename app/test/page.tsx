"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Brain,
  Clock,
  ChevronRight,
  Target,
  Zap,
  TrendingUp,
} from "lucide-react";

const AssessmentCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const FloatingOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
      <div
        className="absolute top-40 right-20 w-24 h-24 bg-cyan-300/20 rounded-full blur-lg animate-bounce"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-40 left-1/4 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
    </div>
  );

  const AssessmentIcon = () => (
    <div className="relative group">
      <div className="w-28 h-28 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl flex items-center justify-center shadow-inner group-hover:shadow-lg transition-all duration-300">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-sm"></div>
          <div className="absolute top-3 left-3 w-4 h-4 bg-emerald-500 rounded-full shadow-sm animate-pulse"></div>
          <div
            className="absolute top-3 right-3 w-4 h-4 bg-rose-500 rounded-full shadow-sm animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-3 left-3 w-4 h-4 bg-blue-500 rounded-full shadow-sm animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-3 right-3 w-4 h-4 bg-amber-500 rounded-full shadow-sm animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-slate-600 rounded-full shadow-sm"></div>
        </div>
        <Brain className="absolute -top-2 -right-2 w-6 h-6 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50 via-sky-50 to-white">
      <FloatingOrbs />

      <div
        className={`relative z-10 bg-white rounded-3xl border border-emerald-100 shadow-xl p-10 transition-all duration-700 hover:shadow-2xl hover:scale-[1.02] w-full max-w-3xl mx-auto ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ transitionDelay: "200ms" }}
        onMouseEnter={() => setHoveredCard("assessment")}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-shrink-0">
            <AssessmentIcon />
          </div>

          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
                Initial Assessment
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
                A comprehensive evaluation designed to understand your unique
                cognitive profile and create a personalized training
                experience.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 justify-center lg:justify-start">
              <div className="flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-full border border-indigo-200">
                <Target className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">
                  Personalized
                </span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full border border-emerald-200">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  Adaptive
                </span>
              </div>
              <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full border border-amber-200">
                <Zap className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">
                  Efficient
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button className="group bg-sky-600 hover:bg-sky-700 text-white font-semibold px-10 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3"
               onClick={() => window.location.href = '/eval_game1'}>
                <Play className="w-5 h-5" />
                Continue Assessment
                <ChevronRight
                  className={`w-5 h-5 transition-transform duration-300 ${
                    hoveredCard === "assessment" ? "translate-x-1" : ""
                  }`}
                />
              </button>

              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">~20 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentCard;
