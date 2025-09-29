"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

export default function ProblemSolvingGame() {
  const router = useRouter();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const puzzles = [
    {
      question: "What comes next in the pattern? 2, 4, 8, 16, ?",
      options: ["24", "32", "30", "28"],
      correct: "32",
      explanation: "Each number is multiplied by 2!"
    },
    {
      question: "If you have 3 red balls and 2 blue balls, how many balls do you have in total?",
      options: ["4", "5", "6", "7"],
      correct: "5",
      explanation: "3 + 2 = 5 balls!"
    },
    {
      question: "What shape has 4 equal sides?",
      options: ["Triangle", "Square", "Circle", "Rectangle"],
      correct: "Square",
      explanation: "A square has 4 equal sides!"
    },
    {
      question: "If it's 3:00 now, what time will it be in 2 hours?",
      options: ["4:00", "5:00", "6:00", "7:00"],
      correct: "5:00",
      explanation: "3:00 + 2 hours = 5:00!"
    },
    {
      question: "Which number is the largest? 15, 8, 22, 13",
      options: ["15", "8", "22", "13"],
      correct: "22",
      explanation: "22 is the biggest number!"
    }
  ];

  const handleAnswer = (selectedAnswer: string) => {
    const currentPuzzleData = puzzles[currentPuzzle];
    if (selectedAnswer === currentPuzzleData.correct) {
      setScore(score + 1);
    }

    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1);
    } else {
      setGameCompleted(true);
      if (score + (selectedAnswer === currentPuzzleData.correct ? 1 : 0) >= 3) {
        setShowSuccess(true);
      }
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const currentPuzzleData = puzzles[currentPuzzle];

  return (
    <div className="min-h-screen bg-[#1a1b3e] text-white">
      {/* Header */}
      <div className="border-b border-[#2d3748] bg-[#1f2046]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={handleBackToHome}
              className="flex items-center space-x-2 bg-[#3b82f6] text-white px-4 py-2 rounded-md font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </motion.button>
            
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-white">Problem Solving</h1>
              <p className="text-slate-300 text-sm">Reasoning and planning drills</p>
            </div>

            <div className="text-white/90 px-4 py-2 rounded-md font-medium bg-[#2d3748]">
              Score {score}/{puzzles.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!gameCompleted ? (
            <motion.div
              key="puzzle"
              className="rounded-xl p-8 border border-[#2d3748] bg-[#1f2046]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-xs text-slate-300 mb-2">
                  <span>Question {currentPuzzle + 1} of {puzzles.length}</span>
                  <span>{Math.round(((currentPuzzle + 1) / puzzles.length) * 100)}%</span>
                </div>
                <div className="w-full bg-[#2d3748] rounded-full h-2">
                  <motion.div
                    className="bg-[#10b981] h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentPuzzle + 1) / puzzles.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Question */}
              <motion.div
                className="text-center mb-8"
                key={currentPuzzle}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-white mb-6">
                  {currentPuzzleData.question}
                </h2>
              </motion.div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPuzzleData.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="rounded-md p-5 text-sm font-medium text-white transition-all duration-200 border border-[#2d3748] bg-[#2d3748] hover:border-[#3b82f6]"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              className="rounded-xl p-8 border border-[#2d3748] bg-[#1f2046] text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-2">
                Session complete
              </h2>
              <p className="text-sm text-slate-300 mb-6">
                Score {score} / {puzzles.length}
              </p>
              
              {score >= 3 ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-white p-6 rounded-md mb-6 border border-[#2d3748] bg-[#1a1b3e]">
                    <h3 className="text-lg font-medium mb-1">Well done</h3>
                    <p className="text-sm text-slate-300">Solid performance.</p>
                  </div>
                  
                  <motion.button
                    onClick={() => {
                      // Mark module as completed and go back to home
                      const saved = localStorage.getItem('completedModules') || '[]';
                      const completedModules = JSON.parse(saved);
                      if (!completedModules.includes('problem-solving')) {
                        completedModules.push('problem-solving');
                        localStorage.setItem('completedModules', JSON.stringify(completedModules));
                      }
                      router.push("/");
                    }}
                    className="bg-[#10b981] text-white font-medium py-3 px-6 rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Complete module
                  </motion.button>
                </motion.div>
              ) : (
                <div className="text-white p-6 rounded-md mb-6 border border-[#2d3748] bg-[#1a1b3e]">
                  <h3 className="text-lg font-medium mb-1">Good effort</h3>
                  <p className="text-sm text-slate-300">Keep practicing to improve.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}