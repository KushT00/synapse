"use client"
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Target, 
  Eye, 
  Circle, 
  Play, 
  Users, 
  TrendingUp, 
  XCircle, 
  CheckCircle,
  ArrowLeft,
  Star,
  Trophy,
  Clock,
  Zap,
  Brain,
  Award,
  Sparkles,
  Lightbulb,
  RotateCcw
} from "lucide-react";
import Link from "next/link";
import WhackATargetGame from "@/components/WhackATargetGame";

const attentionModule = {
  title: "Attention",
  description: "Improve focus and concentration through targeted neural training",
  why: "Attention games help you focus and concentrate, so you can do better in school and sports!",
  color: "bg-blue-300",
  icon: <Target size={28} className="text-blue-600" />,
  exercises: ["S", "S", "D"],
  stats: { sessions: 15, improvement: "+18%" }
};

const attentionGames = [
  {
    id: "whack-a-target",
    title: "Whack-A-Target",
    icon: <Target size={24} className="text-blue-600" />,
    gameplay: "Targets appear briefly at random spots. Tap only the correct targets while avoiding distractors!",
    reason: "Improves selective attention and response inhibition by requiring focus on correct stimuli and ignoring distractions.",
    difficulty: "Intermediate",
    bestScore: 85,
    color: "bg-gradient-to-br from-blue-500 to-indigo-600"
  },
  {
    id: "spot-the-difference",
    title: "Spot-The-Difference",
    icon: <Eye size={24} className="text-purple-600" />,
    gameplay: "Find all subtle differences between two nearly identical images before time runs out!",
    reason: "Develops sustained attention and scanning strategies by maintaining focus over prolonged visual search.",
    difficulty: "Advanced",
    bestScore: 78,
    color: "bg-gradient-to-br from-purple-500 to-pink-600"
  },
  {
    id: "balloon-pop-countdown",
    title: "Balloon Pop Countdown",
    icon: <Circle size={24} className="text-pink-500" />,
    gameplay: "Balloons with numbers float up. Pop them in ascending numerical order as fast as possible!",
    reason: "Trains sustained and divided attention along with processing speed under time pressure.",
    difficulty: "Beginner",
    bestScore: 92,
    color: "bg-gradient-to-br from-pink-500 to-red-500"
  }
];

// --- Enhanced Whack-A-Target Game Component ---
function WhackATargetGameWrapper({ onBack }: { onBack: () => void }) {
  const handleGameComplete = (result: any) => {
    console.log('Game completed:', result);
    // You can handle the game result here
    
    // Mark attention module as completed
    const saved = localStorage.getItem('completedModules') || '[]';
    const completedModules = JSON.parse(saved);
    if (!completedModules.includes('attention')) {
      completedModules.push('attention');
      localStorage.setItem('completedModules', JSON.stringify(completedModules));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <button 
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </button>
          </div>
        </motion.div>
        
        <WhackATargetGame onComplete={handleGameComplete} />
      </div>
    </div>
  );
}

// --- Enhanced Spot-The-Difference Game ---
function SpotTheDifferenceGame({ onBack }: { onBack: () => void }) {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timer, setTimer] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  const [foundDifferences, setFoundDifferences] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Game scenarios with differences
  const scenarios = [
    {
      id: 1,
      left: "🏠🌳🌺🐦☀️",
      right: "🏠🌳🌸🐦☀️",
      differences: [3], // flower emoji
      name: "Garden Scene"
    },
    {
      id: 2,
      left: "🌊🏖️🌴🐚⛱️",
      right: "🌊🏖️🌴🐚🏐",
      differences: [4], // umbrella vs volleyball
      name: "Beach Scene"
    },
    {
      id: 3,
      left: "🏫📚👨‍🎓🎒📝",
      right: "🏫📚👩‍🎓🎒📝",
      differences: [2], // student emoji
      name: "School Scene"
    }
  ];

  const currentScenario = scenarios[(level - 1) % scenarios.length];

  // Timer effect
  useEffect(() => {
    if (!gameOver) {
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
            setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    }
  }, [gameOver]);

  const handleDifferenceClick = (index: number) => {
    if (gameOver || foundDifferences.includes(index)) return;

    if (currentScenario.differences.includes(index)) {
      setFoundDifferences(prev => [...prev, index]);
      setScore(prev => prev + 20);
      setMessage("Great eye! +20 points");
      
      if (foundDifferences.length + 1 === currentScenario.differences.length) {
        // All differences found
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
          setLevel(prev => prev + 1);
          setFoundDifferences([]);
          setTimer(120 - (level * 10));
        }, 2000);
      }
    } else {
      setScore(prev => Math.max(0, prev - 5));
      setMessage("Wrong spot! -5 points");
    }
    
    setTimeout(() => setMessage(null), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 p-6">
      {/* Celebration Animation */}
      {showCelebration && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5 }}
              className="text-8xl mb-4"
            >
              🎊
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold text-purple-600 mb-2"
            >
              Perfect!
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600"
            >
              All differences found!
            </motion.p>
          </div>
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <button 
              className="text-purple-600 hover:text-purple-800 font-semibold flex items-center"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
      </button>
            <div className="text-right">
              <div className="text-sm text-gray-600">Level {level}</div>
              <div className="text-xs text-gray-500">{currentScenario.name}</div>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Eye className="w-8 h-8 text-purple-600 mr-3" />
            Spot-The-Difference
            <Eye className="w-8 h-8 text-purple-600 ml-3" />
          </h2>
          <p className="text-xl text-gray-600 text-center mb-4">
            Find all the differences between the two scenes!
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-3 shadow-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{score}</div>
              <div className="text-xs text-gray-600">Score</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-lg text-center">
              <div className="text-2xl font-bold text-orange-600">{timer}s</div>
              <div className="text-xs text-gray-600">Time</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-lg text-center">
              <div className="text-2xl font-bold text-green-600">{foundDifferences.length}/{currentScenario.differences.length}</div>
              <div className="text-xs text-gray-600">Found</div>
            </div>
          </div>
        </motion.div>

        {/* Game Images */}
        <motion.div 
          className="grid grid-cols-2 gap-8 max-w-2xl mx-auto mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Left Image */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-purple-200">
            <div className="text-center mb-4">
              <div className="text-sm font-bold text-purple-600">Image A</div>
            </div>
            <div className="text-6xl text-center leading-relaxed">
              {currentScenario.left.split('').map((char, index) => (
                <motion.span
                  key={index}
                  className={`inline-block cursor-pointer hover:bg-yellow-200 rounded p-1 transition-colors ${
                    foundDifferences.includes(index) ? 'bg-green-200 ring-2 ring-green-400' : ''
                  }`}
                  onClick={() => handleDifferenceClick(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-purple-200">
            <div className="text-center mb-4">
              <div className="text-sm font-bold text-purple-600">Image B</div>
      </div>
            <div className="text-6xl text-center leading-relaxed">
              {currentScenario.right.split('').map((char, index) => (
                <motion.span
                  key={index}
                  className={`inline-block cursor-pointer hover:bg-yellow-200 rounded p-1 transition-colors ${
                    foundDifferences.includes(index) ? 'bg-green-200 ring-2 ring-green-400' : ''
                  }`}
                  onClick={() => handleDifferenceClick(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {char}
                </motion.span>
        ))}
      </div>
          </div>
        </motion.div>

        {/* Game Status */}
        <motion.div 
          className="mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {gameOver ? (
            <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-4">
              <div className="text-red-700 font-bold text-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 mr-2" />
                Time's up! Final Score: {score}
              </div>
            </div>
          ) : (
            <div className="bg-purple-100 border-2 border-purple-300 rounded-2xl p-4">
              <div className="text-purple-700 font-bold text-xl flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="mr-2"
                >
                  🔍
                </motion.div>
                Find all {currentScenario.differences.length} differences!
              </div>
        </div>
      )}
        </motion.div>

        {/* Message Display */}
        {message && (
          <motion.div 
            className="mb-4 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <div className="bg-white rounded-xl p-3 shadow-lg border-2 border-purple-300">
              <div className="text-purple-700 font-bold text-lg">{message}</div>
    </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div 
          className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-300"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-orange-800 text-sm">
            <div className="font-bold mb-1">💡 How to play:</div>
            <div>• Click on the differences you find</div>
            <div>• Correct finds: +20 points</div>
            <div>• Wrong clicks: -5 points</div>
            <div>• Find all differences to advance!</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- Enhanced Balloon Pop Countdown Game ---
function BalloonPopCountdownGame({ onBack }: { onBack: () => void }) {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [next, setNext] = useState(1);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timer, setTimer] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  // Generate new level
  const generateLevel = useCallback(() => {
    const count = Math.min(5 + level, 12);
    const newNumbers = Array.from({ length: count }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5);
    setNumbers(newNumbers);
    setNext(1);
  }, [level]);

  // Initialize game
  useEffect(() => {
    generateLevel();
  }, [generateLevel]);

  // Timer effect
  useEffect(() => {
    if (!gameOver) {
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
            setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    }
  }, [gameOver]);

  const handlePop = (n: number) => {
    if (gameOver) return;

    if (n === next) {
      setScore(prev => prev + 10 + (combo * 2));
      setCombo(prev => prev + 1);
      setMaxCombo(prev => Math.max(prev, combo + 1));
      setMessage(`Perfect! +${10 + (combo * 2)} points (Combo: ${combo + 1})`);
      
      const newNumbers = numbers.filter(num => num !== n);
      setNumbers(newNumbers);
      setNext(next + 1);

      if (next === Math.max(...numbers)) {
        // Level completed
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
          setLevel(prev => prev + 1);
          setCombo(0);
          setTimer(60 - (level * 5));
        }, 2000);
      }
    } else {
      setScore(prev => Math.max(0, prev - 5));
      setCombo(0);
      setMessage("Wrong order! -5 points");
    }
    
    setTimeout(() => setMessage(null), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 p-6">
      {/* Celebration Animation */}
      {showCelebration && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5 }}
              className="text-8xl mb-4"
            >
              🎈
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold text-pink-600 mb-2"
            >
              Level Complete!
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600"
            >
              Great timing!
            </motion.p>
          </div>
        </motion.div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <button 
              className="text-pink-600 hover:text-pink-800 font-semibold flex items-center"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
      </button>
            <div className="text-right">
              <div className="text-sm text-gray-600">Level {level}</div>
              <div className="text-xs text-gray-500">Next: {next}</div>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Circle className="w-8 h-8 text-pink-600 mr-3" />
            Balloon Pop Countdown
            <Circle className="w-8 h-8 text-pink-600 ml-3" />
          </h2>
          <p className="text-xl text-gray-600 text-center mb-4">
            Pop the balloons in ascending order (1, 2, 3...)
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-3 shadow-lg text-center">
              <div className="text-2xl font-bold text-pink-600">{score}</div>
              <div className="text-xs text-gray-600">Score</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-lg text-center">
              <div className="text-2xl font-bold text-orange-600">{timer}s</div>
              <div className="text-xs text-gray-600">Time</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-lg text-center">
              <div className="text-2xl font-bold text-green-600">{combo}</div>
              <div className="text-xs text-gray-600">Combo</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{level}</div>
              <div className="text-xs text-gray-600">Level</div>
            </div>
      </div>
        </motion.div>

        {/* Balloons */}
        <motion.div 
          className="flex flex-wrap gap-4 justify-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
        {numbers.map((n) => (
            <motion.button
            key={n}
              className={`w-20 h-20 rounded-full bg-gradient-to-br from-pink-300 to-red-400 text-white font-bold text-2xl flex items-center justify-center border-4 border-white shadow-xl hover:shadow-2xl transition-all duration-200 ${
                gameOver ? 'opacity-50' : 'hover:scale-110'
              }`}
            onClick={() => handlePop(n)}
              disabled={gameOver}
              whileHover={!gameOver ? { scale: 1.1, y: -5 } : {}}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: n * 0.1 }}
            >
              <div className="flex flex-col items-center">
                <div className="text-2xl">🎈</div>
                <div className="text-sm font-bold">{n}</div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Game Status */}
        <motion.div 
          className="mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {gameOver ? (
            <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-4">
              <div className="text-red-700 font-bold text-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 mr-2" />
                Time's up! Final Score: {score}
              </div>
            </div>
          ) : (
            <div className="bg-pink-100 border-2 border-pink-300 rounded-2xl p-4">
              <div className="text-pink-700 font-bold text-xl flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="mr-2"
                >
                  🎯
                </motion.div>
                Pop balloon number {next}!
              </div>
            </div>
          )}
        </motion.div>

        {/* Message Display */}
        {message && (
          <motion.div 
            className="mb-4 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <div className="bg-white rounded-xl p-3 shadow-lg border-2 border-pink-300">
              <div className="text-pink-700 font-bold text-lg">{message}</div>
            </div>
          </motion.div>
        )}

        {/* Combo Display */}
        {combo > 0 && (
          <motion.div 
            className="mb-4 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-3 shadow-lg">
              <div className="text-white font-bold text-lg">🔥 Combo: {combo} 🔥</div>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div 
          className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-300"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-orange-800 text-sm">
            <div className="font-bold mb-1">💡 How to play:</div>
            <div>• Pop balloons in order: 1, 2, 3...</div>
            <div>• Correct pops: +10 points + combo bonus</div>
            <div>• Wrong order: -5 points, combo resets</div>
            <div>• Build combos for higher scores!</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- Main Attention Page ---
export default function AttentionPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  let gameComponent = null;
      if (selectedGame === "whack-a-target") gameComponent = <WhackATargetGameWrapper onBack={() => setSelectedGame(null)} />;
  if (selectedGame === "spot-the-difference") gameComponent = <SpotTheDifferenceGame onBack={() => setSelectedGame(null)} />;
  if (selectedGame === "balloon-pop-countdown") gameComponent = <BalloonPopCountdownGame onBack={() => setSelectedGame(null)} />;

  if (selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {gameComponent}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <motion.header 
        className="bg-white shadow-lg border-b border-gray-200"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-800">Attention Training</span>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.section 
          className="text-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <Target className="w-12 h-12 text-blue-600 mr-4" />
            Attention Training Games
            <Target className="w-12 h-12 text-blue-600 ml-4" />
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-6">
            🎯 Sharpen your focus and concentration with these engaging attention games!
            <br />
            <span className="text-lg">Improve your cognitive skills while having fun! 🚀</span>
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">{attentionModule.stats.sessions}</div>
              <div className="text-sm text-gray-600">Training Sessions</div>
            </motion.div>
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-3xl font-bold text-green-600 mb-2">{attentionModule.stats.improvement}</div>
              <div className="text-sm text-gray-600">Improvement</div>
            </motion.div>
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-sm text-gray-600">Games Available</div>
            </motion.div>
        <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-3xl font-bold text-orange-600 mb-2">∞</div>
              <div className="text-sm text-gray-600">Fun Factor</div>
            </motion.div>
          </div>
        </motion.section>

        {/* Games Grid */}
        <motion.section 
          className="mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🎮 Choose Your Training Game
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {attentionGames.map((game, index) => (
              <motion.div
                key={game.id}
                className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-4 border-transparent hover:border-yellow-300"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -12, scale: 1.03 }}
                onClick={() => setSelectedGame(game.id)}
              >
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
                <p className="text-gray-600 text-base mb-4 leading-relaxed">
                  {game.gameplay}
                </p>
                <div className="text-sm text-blue-700 font-semibold mb-4 bg-blue-50 rounded-xl px-3 py-2">
                  {game.reason}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 rounded-xl px-3 py-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold">Best: {game.bestScore}%</span>
                  </div>
                  <motion.button
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-lg flex items-center space-x-2 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Game</span>
                  </motion.button>
                </div>
              </motion.div>
              ))}
            </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">🎯 Attention Training Benefits</h3>
            <p className="text-gray-600 text-lg">Why these games help improve your cognitive skills</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-lg text-center"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Faster Processing</h4>
              <p className="text-gray-600 text-sm">Improve your reaction time and decision-making speed</p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-lg text-center"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Better Focus</h4>
              <p className="text-gray-600 text-sm">Train your brain to ignore distractions and stay focused</p>
        </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg text-center"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Memory</h4>
              <p className="text-gray-600 text-sm">Strengthen your working memory and recall abilities</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section 
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Train Your Brain? 🧠</h3>
            <p className="text-xl mb-6 opacity-90">
              Choose a game above and start improving your attention skills today!
            </p>
            <motion.button
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedGame("whack-a-target")}
            >
              <Sparkles className="w-5 h-5 inline mr-2" />
              Start Training Now!
            </motion.button>
        </div>
        </motion.section>
      </main>
    </div>
  );
}