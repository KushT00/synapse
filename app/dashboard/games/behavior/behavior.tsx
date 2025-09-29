"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Star } from "lucide-react";

export default function BehaviorGame() {
  const router = useRouter();
  const [currentTask, setCurrentTask] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const tasks = [
    {
      question: "What's a good habit to start your day?",
      options: ["Brush your teeth", "Eat breakfast", "Make your bed", "All of the above"],
      correct: "All of the above",
      explanation: "All of these are great morning habits!"
    },
    {
      question: "What should you do when you make a mistake?",
      options: ["Give up", "Learn from it", "Blame others", "Ignore it"],
      correct: "Learn from it",
      explanation: "Mistakes help us learn and grow!"
    },
    {
      question: "What's the best way to help others?",
      options: ["Be kind", "Share your toys", "Listen when they talk", "All of the above"],
      correct: "All of the above",
      explanation: "Being kind, sharing, and listening are all great ways to help!"
    },
    {
      question: "What should you do when you're feeling sad?",
      options: ["Talk to someone", "Do something fun", "Take deep breaths", "All of the above"],
      correct: "All of the above",
      explanation: "All of these can help you feel better!"
    },
    {
      question: "What's a super habit for learning?",
      options: ["Asking questions", "Reading books", "Trying new things", "All of the above"],
      correct: "All of the above",
      explanation: "All of these help you learn and grow!"
    }
  ];

  const handleAnswer = (selectedAnswer: string) => {
    const currentTaskData = tasks[currentTask];
    if (selectedAnswer === currentTaskData.correct) {
      setScore(score + 1);
    }

    if (currentTask < tasks.length - 1) {
      setCurrentTask(currentTask + 1);
    } else {
      setGameCompleted(true);
      if (score + (selectedAnswer === currentTaskData.correct ? 1 : 0) >= 3) {
        setShowSuccess(true);
      }
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const currentTaskData = tasks[currentTask];

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
              <h1 className="text-2xl font-semibold text-white">Habits</h1>
              <p className="text-slate-300 text-sm">Consistency and routine tracking</p>
            </div>

            <div className="text-white/90 px-4 py-2 rounded-md font-medium bg-[#2d3748]">
              Score {score}/{tasks.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!gameCompleted ? (
            <motion.div
              key="task"
              className="rounded-xl p-8 border border-[#2d3748] bg-[#1f2046]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-xs text-slate-300 mb-2">
                  <span>Question {currentTask + 1} of {tasks.length}</span>
                  <span>{Math.round(((currentTask + 1) / tasks.length) * 100)}%</span>
                </div>
                <div className="w-full bg-[#2d3748] rounded-full h-2">
                  <motion.div
                    className="bg-[#10b981] h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentTask + 1) / tasks.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Question */}
              <motion.div
                className="text-center mb-8"
                key={currentTask}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-white mb-6">
                  {currentTaskData.question}
                </h2>
              </motion.div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTaskData.options.map((option, index) => (
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
                Score {score} / {tasks.length}
              </p>
              
              {score >= 3 ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-white p-6 rounded-md mb-6 border border-[#2d3748] bg-[#1a1b3e]">
                    <h3 className="text-lg font-medium mb-1">Well done</h3>
                    <p className="text-sm text-slate-300">Keep the consistency going.</p>
                  </div>
                  
                  <motion.button
                    onClick={() => {
                      // Mark module as completed and go back to home
                      const saved = localStorage.getItem('completedModules') || '[]';
                      const completedModules = JSON.parse(saved);
                      if (!completedModules.includes('behavior')) {
                        completedModules.push('behavior');
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
                  <h3 className="text-lg font-medium mb-1">Good start</h3>
                  <p className="text-sm text-slate-300">Keep building the routine.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}