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
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b-4 border-yellow-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={handleBackToHome}
              className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full font-bold shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </motion.button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800">⭐ Super Habits</h1>
              <p className="text-gray-600">Build amazing habits like a champion!</p>
            </div>

            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full font-bold">
              Score: {score}/{tasks.length}
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
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-yellow-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Question {currentTask + 1} of {tasks.length}</span>
                  <span>{Math.round(((currentTask + 1) / tasks.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full"
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
                <div className="text-6xl mb-4">⭐</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {currentTaskData.question}
                </h2>
              </motion.div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTaskData.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="bg-gradient-to-r from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 border-4 border-yellow-300 rounded-2xl p-6 text-lg font-bold text-gray-800 shadow-lg transition-all duration-200"
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
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-yellow-200 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-8xl mb-6">🏆</div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Habits Complete!
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                You scored {score} out of {tasks.length}!
              </p>
              
              {score >= 3 ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-6 rounded-2xl mb-6">
                    <div className="text-4xl mb-2">🌟</div>
                    <h3 className="text-2xl font-bold mb-2">Super Habits Built!</h3>
                    <p>You're becoming a champion!</p>
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
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 px-8 rounded-full text-xl shadow-2xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Complete Module! 🚀
                  </motion.button>
                </motion.div>
              ) : (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-6 rounded-2xl mb-6">
                  <div className="text-4xl mb-2">💪</div>
                  <h3 className="text-2xl font-bold mb-2">Good Start!</h3>
                  <p>Keep building those super habits!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}