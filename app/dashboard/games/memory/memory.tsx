"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Clock, 
  Target, 
  Award, 
  BarChart3, 
  ArrowLeft,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Star,
  Trophy
} from "lucide-react";
import Link from "next/link";
import SequenceRecallGame from "@/components/SequenceRecallGame";
import MatchingPairsGame from "@/components/MatchingPairsGame";
import StoryBuilderGame from "@/components/StoryBuilderGame";

// Memory Game Types
interface GameData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  difficulty: string;
  bestScore?: number;
  lastPlayed?: string;
}

interface GameResult {
  gameId: string;
  timestamp: string;
  duration: number; // in seconds
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  accuracy: number;
  memoryPower: number; // calculated score
  cognitiveScore: number; // overall cognitive evaluation
}

export default function MemoryPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const memoryGames: GameData[] = [
    {
      id: "sequence-recall",
      title: "Sequence Recall",
      description: "Remember and reproduce growing sequences of colored tiles",
      icon: <Brain size={24} />,
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
      difficulty: "Beginner",
      bestScore: 85
    },
    {
      id: "matching-pairs",
      title: "Matching Pairs",
      description: "Find matching pairs of cards in a grid layout",
      icon: <Target size={24} />,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      difficulty: "Intermediate",
      bestScore: 92
    },
    {
      id: "story-builder",
      title: "Story Builder",
      description: "Arrange story panels in the correct narrative order",
      icon: <Award size={24} />,
      color: "bg-gradient-to-br from-purple-500 to-pink-600",
      difficulty: "Advanced",
      bestScore: 78
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const handleGameSelect = async (gameId: string) => {
    setSelectedGame(gameId);
    setIsPlaying(true);
    
    // Send POST request when user starts playing
    try {
      const response = await fetch(`http://localhost:8000/video-sent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        body: JSON.stringify({
          user_id: "user001"
        })
      });
      
      if (response.ok) {
        console.log('✅ Game start notification sent successfully');
      } else {
        console.error('❌ Failed to send game start notification:', response.status);
      }
    } catch (error) {
      console.error('❌ Error sending game start notification:', error);
      // Continue with game even if notification fails
    }
  };

  const handleGameComplete = (result: GameResult) => {
    setGameResults(prev => [...prev, result]);
    setIsPlaying(false);
    setSelectedGame(null);
    
    // Mark memory module as completed
    const saved = localStorage.getItem('completedModules') || '[]';
    const completedModules = JSON.parse(saved);
    if (!completedModules.includes('memory')) {
      completedModules.push('memory');
      localStorage.setItem('completedModules', JSON.stringify(completedModules));
    }
  };

  const calculateMemoryPower = (accuracy: number, speed: number, complexity: number): number => {
    const baseScore = accuracy * 100;
    const speedBonus = Math.max(0, (60 - speed) * 2);
    const complexityBonus = complexity * 10;
    return Math.min(100, baseScore + speedBonus + complexityBonus);
  };

  const calculateCognitiveScore = (memoryPower: number, accuracy: number, consistency: number): number => {
    const parameters = {
      memoryPower,
      accuracy,
      consistency,
      speed: 85,
      attention: 90,
      focus: 88,
      pattern: 92,
      sequence: 87,
      visual: 89,
      spatial: 86,
      temporal: 91,
      working: 88,
      episodic: 90,
      semantic: 87
    };

    const totalScore = Object.values(parameters).reduce((sum, score) => sum + score, 0);
    return Math.round(totalScore / Object.keys(parameters).length);
  };

  const getGameComponent = (gameId: string) => {
    switch (gameId) {
      case "sequence-recall":
        return <SequenceRecallGame onComplete={handleGameComplete} />;
      case "matching-pairs":
        return <MatchingPairsGame onComplete={handleGameComplete} />;
      case "story-builder":
        return <StoryBuilderGame onComplete={handleGameComplete} />;
      default:
        return null;
    }
  };

  if (isPlaying && selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            {getGameComponent(selectedGame)}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header removed for a cleaner, more focused kid-friendly experience */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <Star className="w-10 h-10 text-yellow-500 mr-3" />
            Fun Memory Games!
            <Star className="w-10 h-10 text-yellow-500 ml-3" />
          </h2>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            🎮 Play these awesome games to make your brain super strong! 
            <br />
            <span className="text-lg">Learn while having fun! 🌟</span>
          </p>
        </motion.div>

        {/* Games Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {memoryGames.map((game) => (
            <motion.div
              key={game.id}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-4 border-transparent hover:border-yellow-300"
              variants={itemVariants}
              whileHover={{ y: -12, scale: 1.03 }}
              onClick={() => handleGameSelect(game.id)}>

              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-lg ${game.color}`}>
                  {game.icon}
                </div>
                <span className="text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full font-bold">
                  {game.difficulty}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {game.title}
              </h3>
              <p className="text-gray-600 text-base mb-6 leading-relaxed">
                {game.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 rounded-xl px-3 py-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold">Best: {game.bestScore}%</span>
                </div>
                <motion.button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-bold text-lg flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  <span>Let's Play!</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Statistics Section */}
        {gameResults.length > 0 && (
          <motion.section 
            className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-xl p-8 border-4 border-yellow-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center justify-center">
              <Trophy className="w-8 h-8 mr-3 text-yellow-500" />
              🏆 Your Amazing Progress! 🏆
            </h3>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center bg-white rounded-2xl p-4 shadow-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {gameResults.length}
                </div>
                <div className="text-sm text-gray-600 font-bold">Games Played</div>
              </div>
              <div className="text-center bg-white rounded-2xl p-4 shadow-lg">
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {Math.round(gameResults.reduce((sum, r) => sum + r.accuracy, 0) / gameResults.length)}%
                </div>
                <div className="text-sm text-gray-600 font-bold">Average Accuracy</div>
              </div>
              <div className="text-center bg-white rounded-2xl p-4 shadow-lg">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {Math.round(gameResults.reduce((sum, r) => sum + r.memoryPower, 0) / gameResults.length)}
                </div>
                <div className="text-sm text-gray-600 font-bold">Memory Power</div>
              </div>
              <div className="text-center bg-white rounded-2xl p-4 shadow-lg">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {Math.round(gameResults.reduce((sum, r) => sum + r.cognitiveScore, 0) / gameResults.length)}
                </div>
                <div className="text-sm text-gray-600 font-bold">Brain Score</div>
              </div>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}