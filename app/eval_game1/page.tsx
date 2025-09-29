"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Brain, Target, Eye, Calendar } from "lucide-react";

type TestSection = "orientation" | "memory-register" | "attention" | "memory-recall" | "language" | "visuospatial" | "results";

interface Answers {
  orientation: Record<number, string>;
  memoryWords: string[];
  attention: string[];
  memoryRecall: string[];
  language: Record<number, any>;
  clockDrawing: string;
  patternMatch: number | null;
}
const MEMORY_WORDS = ["ABSTRACT", "BALLOT", "MODULE", "VECTOR"];


const orientationQuestions = [
  { q: "What year is it?", options: ["2022", "2023", "2024", "2025"], correct: "2025" },
  { q: "What season is it currently?", options: ["Spring", "Summer", "Autumn", "Winter"], correct: getCorrectSeason() },
  { q: "What month is it?", options: ["July", "August", "September", "October"], correct: "September" },
  { q: "What day of the week is today?", options: ["Sunday", "Monday", "Tuesday", "Wednesday"], correct: "Monday" },
  { q: "What is the approximate date today?", options: ["15th", "22nd", "29th", "5th"], correct: "29th" },
];

const languageQuestions = [
  { q: "What object is this?", image: "🔑", options: ["Key", "Lock", "Door", "Chain"], correct: "Key" },
  { q: "What object is this?", image: "⌚", options: ["Clock", "Watch", "Timer", "Alarm"], correct: "Watch" },
  { q: "Complete: 'A rolling stone gathers no ___'", options: ["moss", "dust", "speed", "friends"], correct: "moss" },
];

function getCorrectSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Autumn";
  return "Winter";
}

function calculateScore(answers: Answers): number {
  let score = 0;
  
  // Orientation (5 points)
  orientationQuestions.forEach((q, i) => {
    if (answers.orientation[i] === q.correct) score += 1;
  });
  
  // Memory recall (3 points)
  MEMORY_WORDS.forEach((word, i) => {
    if (answers.memoryRecall[i]?.toUpperCase() === word) score += 1;
  });
  
  // Attention - Serial 7s (5 points)
  const correctSerial = ["93", "86", "79", "72", "65"];
  correctSerial.forEach((val, i) => {
    if (answers.attention[i] === val) score += 1;
  });
  
  // Language (3 points)
  languageQuestions.forEach((q, i) => {
    if (answers.language[i] === q.correct) score += 1;
  });
  
  // Clock drawing (5 points - simplified scoring)
  if (answers.clockDrawing && answers.clockDrawing.length > 50) score += 5;
  
  // Pattern matching (4 points)
  if (answers.patternMatch === 2) score += 4;
  
  return score;
}

function severityFromScore(total: number): { level: string; color: string; description: string } {
  if (total >= 24) return { 
    level: "Normal", 
    color: "text-emerald-600", 
    description: "Cognitive function appears normal" 
  };
  if (total >= 20) return { 
    level: "Mild Impairment", 
    color: "text-yellow-600", 
    description: "Possible mild cognitive concerns" 
  };
  if (total >= 15) return { 
    level: "Moderate Impairment", 
    color: "text-orange-600", 
    description: "Notable cognitive difficulties detected" 
  };
  return { 
    level: "Severe Impairment", 
    color: "text-red-600", 
    description: "Significant cognitive concerns - clinical evaluation recommended" 
  };
}

export default function CognitiveAssessment() {
  const [section, setSection] = useState<TestSection>("orientation");
  const [answers, setAnswers] = useState<Answers>({
    orientation: {},
    memoryWords: [],
    attention: ["", "", "", "", ""],
    memoryRecall: ["", "", ""],
    language: {},
    clockDrawing: "",
    patternMatch: null,
  });
  const [memoryTimer, setMemoryTimer] = useState(10);
  const [showMemoryWords, setShowMemoryWords] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (section === "memory-register" && memoryTimer > 0) {
      const timer = setTimeout(() => setMemoryTimer(memoryTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (section === "memory-register" && memoryTimer === 0) {
      setShowMemoryWords(false);
    }
  }, [section, memoryTimer]);

  const totalScore = useMemo(() => calculateScore(answers), [answers]);
  const severity = useMemo(() => severityFromScore(totalScore), [totalScore]);

  const progress = useMemo(() => {
    const sections = ["orientation", "memory-register", "attention", "memory-recall", "language", "visuospatial"];
    const currentIndex = sections.indexOf(section);
    return ((currentIndex + 1) / sections.length) * 100;
  }, [section]);

  function handleOrientationAnswer(qIndex: number, value: string) {
    setAnswers(prev => ({
      ...prev,
      orientation: { ...prev.orientation, [qIndex]: value }
    }));
  }

  function handleAttentionChange(index: number, value: string) {
    const newAttention = [...answers.attention];
    newAttention[index] = value;
    setAnswers(prev => ({ ...prev, attention: newAttention }));
  }

  function handleMemoryRecallChange(index: number, value: string) {
    const newRecall = [...answers.memoryRecall];
    newRecall[index] = value;
    setAnswers(prev => ({ ...prev, memoryRecall: newRecall }));
  }

  function handleLanguageAnswer(qIndex: number, value: string) {
    setAnswers(prev => ({
      ...prev,
      language: { ...prev.language, [qIndex]: value }
    }));
  }

  function nextSection() {
    const flow: TestSection[] = ["orientation", "memory-register", "attention", "memory-recall", "language", "visuospatial", "results"];
    const currentIndex = flow.indexOf(section);
    if (currentIndex < flow.length - 1) {
      setSection(flow[currentIndex + 1]);
    }
  }

  function prevSection() {
    const flow: TestSection[] = ["orientation", "memory-register", "attention", "memory-recall", "language", "visuospatial", "results"];
    const currentIndex = flow.indexOf(section);
    if (currentIndex > 0) {
      setSection(flow[currentIndex - 1]);
    }
  }

  function startDrawing(e: React.MouseEvent<HTMLCanvasElement>) {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = "#059669";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  function stopDrawing() {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setAnswers(prev => ({ ...prev, clockDrawing: canvas.toDataURL() }));
    }
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setAnswers(prev => ({ ...prev, clockDrawing: "" }));
  }

  function submitAssessment() {
    try {
      const breakdown = {
        orientation: Object.keys(answers.orientation).length,
        memory: answers.memoryRecall.filter((w, i) => w.toUpperCase() === MEMORY_WORDS[i]).length,
        attention: answers.attention.filter((v, i) => v === ["93", "86", "79", "72", "65"][i]).length,
        language: Object.keys(answers.language).length,
        visuospatial: (answers.clockDrawing.length > 50 ? 5 : 0) + (answers.patternMatch === 2 ? 4 : 0),
      };
      
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "synapse_cognitive_baseline",
          JSON.stringify({
            score: totalScore,
            maxScore: 25,
            severity: severity.level,
            breakdown,
            timestamp: Date.now(),
          })
        );
      }
    } catch {}
    setSection("results");
  }

  // Results View
  if (section === "results") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-sky-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl p-8 bg-white border-2 border-indigo-100 rounded-3xl shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-4">
              <Brain className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Assessment Complete</h1>
            <p className="text-slate-600">Cognitive Baseline Screening Results</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl">
              <div className="text-slate-600 text-sm mb-2">Total Score</div>
              <div className="text-6xl font-extrabold text-indigo-600 mb-1">{totalScore}</div>
              <div className="text-slate-500 text-sm">out of 25 points</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl">
              <div className="text-slate-600 text-sm mb-2">Assessment</div>
              <div className={`text-3xl font-bold mb-2 ${severity.color}`}>{severity.level}</div>
              <div className="text-slate-600 text-sm">{severity.description}</div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-slate-900 mb-4">Score Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: "Orientation", score: Object.keys(answers.orientation).filter((k) => answers.orientation[Number(k)] === orientationQuestions[Number(k)].correct).length, max: 5, icon: Calendar },
                { label: "Memory Recall", score: answers.memoryRecall.filter((w, i) => w.toUpperCase() === MEMORY_WORDS[i]).length, max: 3, icon: Brain },
                { label: "Attention (Serial 7s)", score: answers.attention.filter((v, i) => v === ["93", "86", "79", "72", "65"][i]).length, max: 5, icon: Target },
                { label: "Language", score: Object.keys(answers.language).filter((k) => answers.language[Number(k)] === languageQuestions[Number(k)].correct).length, max: 3, icon: Eye },
                { label: "Visuospatial", score: (answers.clockDrawing.length > 50 ? 5 : 0) + (answers.patternMatch === 2 ? 4 : 0), max: 9, icon: Clock },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-indigo-600" />
                    <span className="text-slate-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all"
                        style={{ width: `${(item.score / item.max) * 100}%` }}
                      />
                    </div>
                    <span className="font-semibold text-slate-900 w-12 text-right">{item.score}/{item.max}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalScore < 24 && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
              <div className="flex gap-3">
                <div className="text-amber-600 text-2xl">⚠️</div>
                <div>
                  <div className="font-semibold text-amber-900 mb-1">Clinical Follow-up Recommended</div>
                  <div className="text-amber-800 text-sm">These results suggest possible cognitive concerns. Please consult with a healthcare professional for a comprehensive evaluation.</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button 
              onClick={() => setSection("orientation")}
              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-6 text-lg rounded-xl"
            >
              Review Answers
            </Button>
            <Button 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg rounded-xl"
              onClick={() => window.location.href = "/dashboard/voice "}
            >
              Continue to Voice Assessment →
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-sky-50 text-slate-900 p-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Cognitive Baseline Assessment</h1>
              <p className="text-slate-600">MMSE-Inspired Screening Tool</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-slate-600 mt-2 text-right">{Math.round(progress)}% Complete</div>
        </div>

        {/* Orientation Section */}
        {section === "orientation" && (
          <Card className="bg-white border-2 border-indigo-100 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">Section 1: Orientation to Time</h2>
            </div>
            <p className="text-slate-600 mb-6">Please answer the following questions to assess your awareness of time and date.</p>
            
            <div className="space-y-6">
              {orientationQuestions.map((item, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="font-medium text-slate-800 text-lg">{idx + 1}. {item.q}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {item.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOrientationAnswer(idx, option)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          answers.orientation[idx] === option
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                            : "bg-white text-slate-700 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={nextSection}
                disabled={Object.keys(answers.orientation).length < 5}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-xl disabled:opacity-50"
              >
                Next: Memory Registration →
              </Button>
            </div>
          </Card>
        )}

        {/* Memory Registration */}
        {section === "memory-register" && (
          <Card className="bg-white border-2 border-indigo-100 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-8 h-8 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">Section 2: Memory Registration</h2>
            </div>
            
            {showMemoryWords ? (
              <div className="text-center py-12">
                <div className="text-slate-600 mb-6 text-lg">Please memorize these three words. You will be asked to recall them later.</div>
                <div className="flex justify-center gap-8 mb-8">
                  {MEMORY_WORDS.map((word, i) => (
                    <div key={i} className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white px-10 py-8 rounded-2xl shadow-xl">
                      <div className="text-4xl font-bold">{word}</div>
                    </div>
                  ))}
                </div>
                <div className="text-6xl font-bold text-indigo-600 mb-2">{memoryTimer}</div>
                <div className="text-slate-500">seconds remaining</div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">✓</div>
                <div className="text-2xl font-semibold text-slate-900 mb-2">Words Registered</div>
                <div className="text-slate-600 mb-8">You will be asked to recall these words after the next section.</div>
                <Button
                  onClick={nextSection}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-xl"
                >
                  Continue to Attention Test →
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Attention - Serial 7s */}
        {section === "attention" && (
          <Card className="bg-white border-2 border-indigo-100 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">Section 3: Attention & Calculation</h2>
            </div>
            <p className="text-slate-600 mb-6">Starting from 100, subtract 7 and continue subtracting 7 from each result.</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-slate-700 w-32">100 - 7 =</span>
                <input
                  type="number"
                  onChange={(e) => handleAttentionChange(0, e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 text-lg"
                  placeholder="93"
                />
              </div>
              {answers.attention[0] && (
               <div className="flex items-center gap-4">
               <span className="text-lg font-semibold text-slate-700 w-32">{answers.attention[0]} - 7 =</span>
               <input
                 type="number"
                 onChange={(e) => handleAttentionChange(1, e.target.value)}
                 className="flex-1 px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 text-lg"
                 placeholder="Your answer"
               />
             </div>
              )}
              {answers.attention[1] && (
                <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-slate-700 w-32">{answers.attention[1]} - 7 =</span>
                <input
                  type="number"
                  onChange={(e) => handleAttentionChange(2, e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 text-lg"
                  placeholder="Your answer"
                />
              </div>
              )}
              {answers.attention[2] && (
                <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-slate-700 w-32">{answers.attention[2]} - 7 =</span>
                <input
                  type="number"
                  onChange={(e) => handleAttentionChange(3, e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 text-lg"
                  placeholder="Your answer"
                />
              </div>
              )}
              {answers.attention[3] && (
               <div className="flex items-center gap-4">
               <span className="text-lg font-semibold text-slate-700 w-32">{answers.attention[3]} - 7 =</span>
               <input
                 type="number"
                 onChange={(e) => handleAttentionChange(4, e.target.value)}
                 className="flex-1 px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 text-lg"
                 placeholder="Your answer"
               />
             </div>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                onClick={prevSection}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-6 text-lg rounded-xl"
              >
                ← Back
              </Button>
              <Button
                onClick={nextSection}
                disabled={!answers.attention[4]}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-xl disabled:opacity-50"
              >
                Next: Memory Recall →
              </Button>
            </div>
          </Card>
        )}

        {/* Memory Recall */}
        {section === "memory-recall" && (
          <Card className="bg-white border-2 border-indigo-100 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-8 h-8 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">Section 4: Memory Recall</h2>
            </div>
            <p className="text-slate-600 mb-6">Please type the three words you were asked to remember earlier.</p>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="block text-slate-700 font-medium mb-2">First word:</label>
                <input
                  type="text"
                  value={answers.memoryRecall[0]}
                  onChange={(e) => handleMemoryRecallChange(0, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 text-lg"
                  placeholder="Enter first word..."
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2">Second word:</label>
                <input
                  type="text"
                  value={answers.memoryRecall[1]}
                  onChange={(e) => handleMemoryRecallChange(1, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 text-lg"
                  placeholder="Enter second word..."
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2">Third word:</label>
                <input
                  type="text"
                  value={answers.memoryRecall[2]}
                  onChange={(e) => handleMemoryRecallChange(2, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 text-lg"
                  placeholder="Enter third word..."
                />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                onClick={prevSection}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-6 text-lg rounded-xl"
              >
                ← Back
              </Button>
              <Button
                onClick={nextSection}
                disabled={answers.memoryRecall.some(w => !w.trim())}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-xl disabled:opacity-50"
              >
                Next: Language Test →
              </Button>
            </div>
          </Card>
        )}

        {/* Language Section */}
        {section === "language" && (
          <Card className="bg-white border-2 border-indigo-100 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-8 h-8 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">Section 5: Language & Comprehension</h2>
            </div>
            
            <div className="space-y-8">
              {languageQuestions.map((item, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="font-medium text-slate-800 text-lg">{idx + 1}. {item.q}</div>
                  {item.image && (
                    <div className="text-8xl text-center py-6 bg-slate-50 rounded-2xl">{item.image}</div>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {item.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleLanguageAnswer(idx, option)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          answers.language[idx] === option
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                            : "bg-white text-slate-700 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                onClick={prevSection}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-6 text-lg rounded-xl"
              >
                ← Back
              </Button>
              <Button
                onClick={nextSection}
                disabled={Object.keys(answers.language).length < 3}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-xl disabled:opacity-50"
              >
                Next: Visuospatial Test →
              </Button>
            </div>
          </Card>
        )}

        {/* Visuospatial Section */}
        {section === "visuospatial" && (
          <Card className="bg-white border-2 border-indigo-100 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">Section 6: Visuospatial Skills</h2>
            </div>
            
            {/* Clock Drawing Task */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Task 1: Clock Drawing</h3>
              <p className="text-slate-600 mb-4">Draw a clock face showing the time <strong>10 minutes past 11</strong> (11:10)</p>
              
              <div className="flex flex-col items-center gap-4">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="border-2 border-indigo-300 rounded-2xl cursor-crosshair bg-white shadow-inner"
                  style={{ touchAction: 'none' }}
                />
                <Button
                  onClick={clearCanvas}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2 rounded-xl"
                >
                  Clear Canvas
                </Button>
              </div>
            </div>

            {/* Pattern Matching */}
            <div className="mt-8 border-t-2 border-slate-200 pt-8">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Task 2: Pattern Recognition</h3>
              <p className="text-slate-600 mb-4">Which pattern completes the sequence?</p>
              
              <div className="bg-slate-50 rounded-2xl p-6 mb-4">
                <div className="flex items-center gap-4 justify-center mb-6">
                  <div className="w-24 h-24 bg-indigo-500 rounded-lg"></div>
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg"></div>
                  <div className="w-24 h-24 bg-violet-500 rounded-lg"></div>
                  <div className="text-4xl font-bold text-slate-400">?</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 0, color: "bg-indigo-500" },
                  { id: 1, color: "bg-gradient-to-br from-violet-500 to-pink-500" },
                  { id: 2, color: "bg-pink-500" },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setAnswers(prev => ({ ...prev, patternMatch: option.id }))}
                    className={`h-32 rounded-2xl border-4 transition-all ${option.color} ${
                      answers.patternMatch === option.id
                        ? "border-indigo-600 ring-4 ring-indigo-200 scale-105"
                        : "border-transparent hover:border-indigo-300"
                    }`}
                  >
                    <div className="text-white font-bold text-2xl">
                      {String.fromCharCode(65 + option.id)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                onClick={prevSection}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-6 text-lg rounded-xl"
              >
                ← Back
              </Button>
              <Button
                onClick={submitAssessment}
                disabled={!answers.clockDrawing || answers.patternMatch === null}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-8 py-6 text-lg rounded-xl disabled:opacity-50 font-semibold"
              >
                Complete Assessment ✓
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}