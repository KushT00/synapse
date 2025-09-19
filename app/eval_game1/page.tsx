"use client";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Choice = 0 | 1 | 2 | 3;

const phq9Questions: string[] = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself in some way",
];

const choices = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
] as const;

function severityFromScore(total: number): string {
  if (total <= 4) return "Minimal";
  if (total <= 9) return "Mild";
  if (total <= 14) return "Moderate";
  if (total <= 19) return "Moderately severe";
  return "Severe";
}

export default function PHQ9Onboarding() {
  const [answers, setAnswers] = useState<Record<number, Choice>>({});
  const [submitted, setSubmitted] = useState(false);

  const total = useMemo(
    () => Object.values(answers).reduce<number>((sum, v) => sum + (v ?? 0), 0),
    [answers]
  );

  const item9Positive = (answers[8] ?? 0) > 0;
  const allAnswered = phq9Questions.every((_, idx) => answers[idx] !== undefined);

  function selectAnswer(qIndex: number, value: Choice) {
    setAnswers((prev) => ({ ...prev, [qIndex]: value }));
  }

  function handleSubmit() {
    if (!allAnswered) return;
    try {
      const severity = severityFromScore(total);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "synapse_phq9",
          JSON.stringify({ score: total, severity, at: Date.now() })
        );
      }
    } catch {}
    setSubmitted(true);
  }

  if (submitted) {
    const severity = severityFromScore(total);
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-sky-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl p-8 bg-white border border-emerald-100 text-slate-800 rounded-2xl shadow-md">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div>
              <h1 className="text-3xl font-bold mb-4">PHQ‑9 Summary</h1>
              <div className="space-y-2 mb-6">
                <div className="text-slate-600">Total score</div>
                <div className="text-5xl font-extrabold text-slate-900">{total}</div>
                <div className="text-slate-700">Severity: <span className="font-semibold">{severity}</span></div>
                {item9Positive && (
                  <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-700">
                    You indicated some suicidal thoughts. If you are in danger or thinking of harming yourself, please seek immediate help.
                </div>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="text-sm text-slate-600 mb-6">
                This screening helps us tailor your onboarding. It is not a diagnosis.
              </div>
              <div className="flex gap-3">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setSubmitted(false)}>Edit answers</Button>
                <a href="/eval_game2" className="inline-flex">
                  <Button className="bg-sky-600 hover:bg-sky-700 text-white">Continue</Button>
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-sky-50 to-white text-slate-900 p-4">
      <div className="max-w-6xl mx-auto py-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-slate-900">PHQ‑9 Onboarding</h1>
        <p className="text-slate-600 mb-6">Over the last 2 weeks, how often have you been bothered by the following problems?</p>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Left: Questions 1-5 */}
          <Card className="bg-white border border-emerald-100 rounded-2xl p-4 sm:p-6 shadow-sm">
            <ol className="space-y-6">
              {phq9Questions.slice(0, 5).map((q, idx) => (
                <li key={idx} className="space-y-3">
                  <div className="font-medium text-slate-800">{idx + 1}. {q}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {choices.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => selectAnswer(idx, c.value)}
                        className={`text-left rounded-xl border-2 px-3 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                          answers[idx] === c.value
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-white text-slate-800 border-emerald-200 hover:bg-emerald-50"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          {/* Right: Questions 6-9 */}
          <Card className="bg-white border border-emerald-100 rounded-2xl p-4 sm:p-6 shadow-sm">
            <ol className="space-y-6">
              {phq9Questions.slice(5).map((q, relIdx) => {
                const idx = relIdx + 5;
                return (
                  <li key={idx} className="space-y-3">
                    <div className="font-medium text-slate-800">{idx + 1}. {q}</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {choices.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => selectAnswer(idx, c.value)}
                          className={`text-left rounded-xl border-2 px-3 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                            answers[idx] === c.value
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                              : "bg-white text-slate-800 border-emerald-200 hover:bg-emerald-50"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>
              </div>

        {/* Footer: total score and submit */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-slate-700">Score: <span className="font-semibold">{total}</span> · Severity: <span className="font-semibold">{severityFromScore(total)}</span></div>
                  <Button 
            disabled={!allAnswered}
            onClick={handleSubmit}
            className="bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-50"
          >
            Submit
                  </Button>
        </div>
      </div>
    </div>
  );
}