"use client"
import { motion } from "framer-motion"
import { Heart, Brain, Activity, AlertTriangle, Smile, BookOpen, Sparkles } from "lucide-react"
import { useMemo } from "react"

type Traffic = "green" | "yellow" | "red"

function TrafficLight({ level }: { level: Traffic }) {
  const color = level === "green" ? "bg-emerald-500" : level === "yellow" ? "bg-amber-500" : "bg-rose-500"
  return (
    <div className="flex items-center gap-1">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-xs text-slate-600 capitalize">{level}</span>
    </div>
  )
}

function Ring({ value, label, color }: { value: number; label: string; color: string }) {
  const dash = useMemo(() => `${value}, 100`, [value])
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
          <path className="text-slate-200" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" />
          <path className={color} stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray={dash} d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{value}%</div>
            <div className="text-xs text-slate-500">{label}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Bar({ left, right, leftLabel, rightLabel }: { left: number; right: number; leftLabel: string; rightLabel: string }) {
  const total = Math.max(left + right, 1)
  const leftPct = Math.round((left / total) * 100)
  const rightPct = 100 - leftPct
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-600 mb-1">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full bg-emerald-500" style={{ width: `${leftPct}%` }} />
        <div className="h-full bg-amber-400 -mt-3" style={{ width: `${rightPct}%` }} />
      </div>
    </div>
  )
}

export default function CognitiveHealth() {
  const cognitive = { memory: 82, attention: 74, focus: 69, reasoning: 77 }
  const activity = { social: 5, physical: 4, learning: 3, creative: 2 }
  const mood: Traffic = "green"
  const risk: Traffic = "yellow"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-emerald-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Cognitive Health Overview</h1>
              <p className="text-slate-600 text-sm">Simple, reassuring insights designed for families and caregivers</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-slate-600 text-sm">
              <Activity className="w-4 h-4" /> Updated 2h ago
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cognitive Scores */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 grid place-items-center"><Brain className="w-5 h-5 text-emerald-600"/></div>
                  <h2 className="text-xl font-semibold text-slate-900">Cognitive Scores</h2>
                </div>
                <TrafficLight level={mood} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Ring value={cognitive.memory} label="Memory" color="text-emerald-500"/>
                <Ring value={cognitive.attention} label="Attention" color="text-sky-500"/>
                <Ring value={cognitive.focus} label="Focus" color="text-blue-500"/>
                <Ring value={cognitive.reasoning} label="Reasoning" color="text-teal-500"/>
              </div>
            </div>

            {/* Daily Activities & Engagement */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 grid place-items-center"><Activity className="w-5 h-5 text-sky-600"/></div>
                  <h2 className="text-xl font-semibold text-slate-900">Daily Activities & Engagement</h2>
                </div>
                <TrafficLight level={"green"} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Bar left={activity.social} right={2} leftLabel="Social" rightLabel="Quiet"/>
                  <Bar left={activity.physical} right={3} leftLabel="Active" rightLabel="Rest"/>
                </div>
                <div className="space-y-4">
                  <Bar left={activity.learning} right={2} leftLabel="Learning" rightLabel="Breaks"/>
                  <Bar left={activity.creative} right={3} leftLabel="Creative" rightLabel="Screen"/>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Emotional Well-being */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 grid place-items-center"><Smile className="w-5 h-5 text-rose-600"/></div>
                  <h3 className="font-semibold text-slate-900">Emotional Well‑being</h3>
                </div>
                <TrafficLight level={mood} />
              </div>
              <p className="text-sm text-slate-600">Overall mood stable. Encouraged by regular engagement and routines.</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-emerald-50"><div className="text-xl font-bold text-emerald-700">7.8</div><div className="text-xs text-emerald-700">Mood</div></div>
                <div className="p-3 rounded-xl bg-sky-50"><div className="text-xl font-bold text-sky-700">7.1</div><div className="text-xs text-sky-700">Calm</div></div>
                <div className="p-3 rounded-xl bg-teal-50"><div className="text-xl font-bold text-teal-700">6.9</div><div className="text-xs text-teal-700">Energy</div></div>
              </div>
            </div>

            {/* Risk Alerts */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 grid place-items-center"><AlertTriangle className="w-5 h-5 text-amber-600"/></div>
                  <h3 className="font-semibold text-slate-900">Risk Alerts</h3>
                </div>
                <TrafficLight level={risk} />
              </div>
              <ul className="space-y-3 text-sm">
                <li className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-800">Slight decline in focus after 6pm — consider earlier activities</li>
                <li className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-800">Memory recall slower on multi-step tasks — use step-by-step cues</li>
              </ul>
            </div>

            {/* Caregiver Tips & Recommendations */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 grid place-items-center"><BookOpen className="w-5 h-5 text-emerald-600"/></div>
                  <h3 className="font-semibold text-slate-900">Caregiver Tips & Recommendations</h3>
                </div>
                <Sparkles className="w-4 h-4 text-emerald-600"/>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="p-3 rounded-xl bg-slate-50 border border-slate-100">Create a simple morning checklist (wash, dress, breakfast, short walk)</li>
                <li className="p-3 rounded-xl bg-slate-50 border border-slate-100">Use large labels on drawers and rooms to support recall</li>
                <li className="p-3 rounded-xl bg-slate-50 border border-slate-100">Schedule mentally engaging activities earlier in the day</li>
                <li className="p-3 rounded-xl bg-slate-50 border border-slate-100">Celebrate small wins with positive feedback and routine</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


