"use client"
import { Heart, Brain, ShieldCheck, Mic, LineChart, Smartphone, Users, CheckCircle2, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function DementiaLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 text-slate-900">
      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-900">
              Detect Cognitive Decline Early. <span className="text-emerald-600">Act with Care.</span>
            </h1>
            <p className="text-lg md:text-xl mt-4 text-slate-700 max-w-xl">
              An AI‑powered tool for accessible, low‑cost, early‑stage dementia screening designed with families and seniors in mind.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="#cta" className="px-6 py-3 rounded-full bg-emerald-600 text-white text-lg font-semibold shadow hover:bg-emerald-700 transition">
                Try Screening
              </a>
              <a href="#solution" className="px-6 py-3 rounded-full bg-white text-emerald-700 text-lg font-semibold border border-emerald-200 hover:bg-emerald-50 transition">
                Learn More
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-tr from-sky-100 to-emerald-100 rounded-3xl blur-xl opacity-70"/>
            <div className="relative bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-center">
                  <Brain className="w-7 h-7 text-sky-700 mx-auto" />
                  <div className="mt-2 font-semibold">Cognitive Score</div>
                  <div className="text-3xl font-bold text-sky-700">78%</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                  <Mic className="w-7 h-7 text-emerald-700 mx-auto" />
                  <div className="mt-2 font-semibold">Speech Check</div>
                  <div className="text-3xl font-bold text-emerald-700">Stable</div>
                </div>
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 text-center">
                  <LineChart className="w-7 h-7 text-teal-700 mx-auto" />
                  <div className="mt-2 font-semibold">Trend</div>
                  <div className="text-3xl font-bold text-teal-700">Improving</div>
                </div>
                <div className="p-4 rounded-2xl bg-lime-50 border border-lime-100 text-center">
                  <ShieldCheck className="w-7 h-7 text-lime-700 mx-auto" />
                  <div className="mt-2 font-semibold">Privacy</div>
                  <div className="text-3xl font-bold text-lime-700">Secure</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-3xl font-bold">Why Early Detection Matters</h2>
          <p className="text-slate-700 mt-3 max-w-3xl">
            Dementia is often diagnosed late, when symptoms have already affected daily life. Early screening helps families act sooner,
            consider treatment options, and plan supportive routines.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
              <div className="text-sm text-sky-800 font-semibold">Year 1</div>
              <div className="h-2 rounded bg-sky-200 mt-2">
                <div className="h-2 bg-sky-600 rounded" style={{width: "30%"}} />
              </div>
              <div className="text-xs text-sky-800 mt-2">Subtle changes, often missed</div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <div className="text-sm text-amber-800 font-semibold">Year 2</div>
              <div className="h-2 rounded bg-amber-200 mt-2">
                <div className="h-2 bg-amber-500 rounded" style={{width: "65%"}} />
              </div>
              <div className="text-xs text-amber-800 mt-2">Noticeable decline; opportunities lost</div>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
              <div className="text-sm text-rose-800 font-semibold">Year 3</div>
              <div className="h-2 rounded bg-rose-200 mt-2">
                <div className="h-2 bg-rose-500 rounded" style={{width: "90%"}} />
              </div>
              <div className="text-xs text-rose-800 mt-2">Late diagnosis; harder interventions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="solution" className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h2 className="text-3xl font-bold">Our AI‑Powered Screening App</h2>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1"/>
                <div>
                  <div className="font-semibold">Short cognitive games & memory tasks</div>
                  <div className="text-sm text-slate-600">Engaging mini‑tests designed for accessibility</div>
                </div>
              </li>
              <li className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-3 items-start">
                <Mic className="w-5 h-5 text-emerald-600 mt-1"/>
                <div>
                  <div className="font-semibold">Speech and language analysis</div>
                  <div className="text-sm text-slate-600">Sensitive to early linguistic changes</div>
                </div>
              </li>
              <li className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-3 items-start">
                <LineChart className="w-5 h-5 text-emerald-600 mt-1"/>
                <div>
                  <div className="font-semibold">Risk score with trends</div>
                  <div className="text-sm text-slate-600">Simple result with progress over time</div>
                </div>
              </li>
              <li className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-3 items-start">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mt-1"/>
                <div>
                  <div className="font-semibold">Secure & private</div>
                  <div className="text-sm text-slate-600">Privacy‑first, healthcare‑friendly data</div>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="w-6 h-6 text-slate-700"/>
              <h3 className="font-semibold">App Mockup</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
                <div className="text-sm font-semibold text-sky-800">Dashboard</div>
                <div className="mt-2 text-3xl font-bold text-sky-700">Low Risk</div>
                <div className="text-xs text-sky-800 mt-1">Cognitive score 78% • Trending up</div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <div className="text-sm font-semibold text-emerald-800">Test Screen</div>
                <div className="mt-2 text-3xl font-bold text-emerald-700">Memory Game</div>
                <div className="text-xs text-emerald-800 mt-1">3 minutes • Large buttons • Voice assist</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="text-sm font-semibold text-slate-700">Step 1</div>
            <div className="mt-2 text-xl font-bold">5–10 min tests</div>
            <div className="text-slate-600 mt-1 text-sm">Simple games and tasks designed for seniors</div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="text-sm font-semibold text-slate-700">Step 2</div>
            <div className="mt-2 text-xl font-bold">AI analysis</div>
            <div className="text-slate-600 mt-1 text-sm">Speech, behavior, and performance combined</div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="text-sm font-semibold text-slate-700">Step 3</div>
            <div className="mt-2 text-xl font-bold">Risk score & report</div>
            <div className="text-slate-600 mt-1 text-sm">Plain‑language result with next steps</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold">Features</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="text-xl font-bold">Gamified memory tests</div>
            <div className="text-slate-600 mt-1 text-sm">Large buttons • Voice prompts</div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="text-xl font-bold">Speech analysis</div>
            <div className="text-slate-600 mt-1 text-sm">Early language‑change signals</div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="text-xl font-bold">Visual clock drawing test</div>
            <div className="text-slate-600 mt-1 text-sm">Simple, low‑friction input</div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="text-xl font-bold">Caregiver dashboard</div>
            <div className="text-slate-600 mt-1 text-sm">Clear insights for families</div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="text-xl font-bold">Privacy‑first data</div>
            <div className="text-slate-600 mt-1 text-sm">Secure, consent‑based access</div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div>
              <div className="text-3xl font-extrabold text-emerald-700">40%</div>
              <div className="text-slate-700">Early detection can improve outcomes</div>
            </div>
            <div className="md:col-span-2">
              <div className="italic text-slate-700">“This tool helped us act earlier for my father.”</div>
              <div className="text-slate-500 text-sm mt-1">— Caregiver, pilot participant</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="container mx-auto px-4 py-16">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-sky-600 p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">Join our pilot program for early dementia detection</h3>
              <p className="text-white/90 mt-1">Designed for clinics, communities, and families</p>
            </div>
            <div className="flex gap-3">
              <a href="/auth" className="px-6 py-3 rounded-full bg-white text-emerald-700 font-semibold hover:bg-white/90 transition">Get Started</a>
              <a href="/dashboard" className="px-6 py-3 rounded-full bg-white/10 border border-white/30 text-white hover:bg-white/20 transition">Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 pb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-600 text-sm">
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-900">About</a>
            <a href="#solution" className="hover:text-slate-900">Features</a>
            <a href="#" className="hover:text-slate-900">Privacy Policy</a>
            <a href="#cta" className="hover:text-slate-900">Contact</a>
          </div>
          <div className="text-slate-500">This tool is for screening purposes only and does not provide a medical diagnosis.</div>
        </div>
      </footer>
    </div>
  )
}


