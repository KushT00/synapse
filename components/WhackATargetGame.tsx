import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Star, Target, Trophy } from "lucide-react";

interface GameResult {
  gameId: string;
  timestamp: string;
  duration: number;
  correctHits: number;
  missedTargets: number;
  wrongHits: number;
  totalTargets: number;
  accuracy: number;
  attentionPower: number;
  cognitiveScore: number;
}

interface GameProps {
  onComplete: (result: GameResult) => void;
}

interface Target {
  id: number;
  x: number;
  y: number;
  isCorrect: boolean;
  isVisible: boolean;
  type: 'target' | 'distractor';
}

// Remove playful speech feedback for professional tone

export default function WhackATargetGame({ onComplete }: GameProps) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'complete'>('waiting');
  const [correctHits, setCorrectHits] = useState(0);
  const [wrongHits, setWrongHits] = useState(0);
  const [missedTargets, setMissedTargets] = useState(0);
  const [totalTargets, setTotalTargets] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const gridSize = 4;
  const targetDuration = Math.max(1000 - level * 100, 400); // Faster as level increases

  useEffect(() => {
    if (gameState === 'waiting') {
      setGameOver(false);
      setScore(0);
      setCorrectHits(0);
      setWrongHits(0);
      setMissedTargets(0);
      setCombo(0);
      setTimeLeft(30);
    }
  }, [level]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const generateTargets = useCallback(() => {
    const numTargets = Math.min(3 + level, 8);
    const numDistractors = Math.min(2 + Math.floor(level / 2), 6);
    const newTargets: Target[] = [];

    // Generate correct targets
    for (let i = 0; i < numTargets; i++) {
      newTargets.push({
        id: i,
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
        isCorrect: true,
        isVisible: false,
        type: 'target'
      });
    }

    // Generate distractors
    for (let i = 0; i < numDistractors; i++) {
      newTargets.push({
        id: numTargets + i,
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
        isCorrect: false,
        isVisible: false,
        type: 'distractor'
      });
    }

    setTargets(newTargets);
    setTotalTargets(numTargets);
  }, [level]);

  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    generateTargets();
    spawnTargets();
  };

  const spawnTargets = () => {
    if (gameState !== 'playing') return;

    const visibleTargets = targets.filter(t => t.isVisible);
    if (visibleTargets.length < 2) {
      const availableTargets = targets.filter(t => !t.isVisible);
      if (availableTargets.length > 0) {
        const randomTarget = availableTargets[Math.floor(Math.random() * availableTargets.length)];
        setTargets(prev => prev.map(t => 
          t.id === randomTarget.id ? { ...t, isVisible: true } : t
        ));

        // Hide target after duration
        setTimeout(() => {
          setTargets(prev => prev.map(t => 
            t.id === randomTarget.id ? { ...t, isVisible: false } : t
          ));
          if (randomTarget.isCorrect) {
            setMissedTargets(prev => prev + 1);
          }
        }, targetDuration);
      }
    }

    // Schedule next spawn
    setTimeout(() => {
      if (gameState === 'playing') {
        spawnTargets();
      }
    }, Math.max(800 - level * 50, 300));
  };

  const handleTargetClick = (target: Target) => {
    if (!target.isVisible || gameState !== 'playing') return;

    setTargets(prev => prev.map(t => 
      t.id === target.id ? { ...t, isVisible: false } : t
    ));

    if (target.isCorrect) {
      const points = 10 + combo * 2;
      setScore(prev => prev + points);
      setCorrectHits(prev => prev + 1);
      setCombo(prev => prev + 1);
    } else {
      setWrongHits(prev => prev + 1);
      setCombo(0);
    }
  };

  const calculateAttentionPower = (accuracy: number, speed: number, focus: number): number => {
    return Math.round((accuracy * 0.4 + speed * 0.3 + focus * 0.3) * 100);
  };

  const calculateCognitiveScore = (attentionPower: number, accuracy: number, consistency: number): number => {
    return Math.round((attentionPower * 0.5 + accuracy * 0.3 + consistency * 0.2));
  };

  const endGame = () => {
    const duration = Date.now() - startTime;
    const accuracy = totalTargets > 0 ? (correctHits / totalTargets) * 100 : 0;
    const speed = duration > 0 ? (correctHits / (duration / 1000)) * 10 : 0;
    const focus = totalTargets > 0 ? ((totalTargets - wrongHits) / totalTargets) * 100 : 0;
    
    const attentionPower = calculateAttentionPower(accuracy, speed, focus);
    const cognitiveScore = calculateCognitiveScore(attentionPower, accuracy, focus);

    const result: GameResult = {
      gameId: 'whack-a-target',
      timestamp: new Date().toISOString(),
      duration,
      correctHits,
      missedTargets,
      wrongHits,
      totalTargets,
      accuracy,
      attentionPower,
      cognitiveScore
    };

    setGameState('complete');
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      onComplete(result);
    }, 2000);
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setGameState('waiting');
    setShowCelebration(false);
    setGameOver(false);
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    setGameState('waiting');
    setShowCelebration(false);
  };

  if (gameState === 'complete') {
    return (
      <motion.div 
        className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Complete!</h2>
            <p className="text-gray-600 mb-6">Level {level} - Whack-A-Target</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-blue-500">Total Score</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{correctHits}/{totalTargets}</div>
              <div className="text-sm text-green-500">Targets Hit</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{Math.round((correctHits / totalTargets) * 100)}%</div>
              <div className="text-sm text-purple-500">Accuracy</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">{level}</div>
              <div className="text-sm text-orange-500">Level</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <motion.button
              onClick={nextLevel}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star className="w-4 h-4 mr-2" />
              Next Level
            </motion.button>
            <motion.button
              onClick={resetGame}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <Target className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Whack-A-Target</h2>
        </div>
        <p className="text-gray-600 mb-4">Tap the correct targets while avoiding distractors!</p>
        
        {gameState === 'waiting' && (
          <motion.button
            onClick={startGame}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl flex items-center mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Game
          </motion.button>
        )}

        {gameState === 'playing' && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{score}</div>
                <div className="text-xs text-blue-500">Score</div>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <div className="text-lg font-bold text-green-600">{correctHits}/{totalTargets}</div>
                <div className="text-xs text-green-500">Hits</div>
              </div>
              <div className="bg-purple-50 px-4 py-2 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{timeLeft}s</div>
                <div className="text-xs text-purple-500">Time</div>
              </div>
              <div className="bg-orange-50 px-4 py-2 rounded-lg">
                <div className="text-lg font-bold text-orange-600">L{level}</div>
                <div className="text-xs text-orange-500">Level</div>
              </div>
            </div>
            {combo > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-yellow-50 px-4 py-2 rounded-lg"
              >
                <div className="text-lg font-bold text-yellow-600">{combo}x</div>
                <div className="text-xs text-yellow-500">Combo</div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {gameState === 'playing' && (
        <div className="relative">
          <div className="grid grid-cols-4 gap-2 bg-gray-100 p-4 rounded-xl">
            {Array.from({ length: gridSize * gridSize }, (_, index) => {
              const x = index % gridSize;
              const y = Math.floor(index / gridSize);
              const target = targets.find(t => t.x === x && t.y === y && t.isVisible);
              
              return (
                <motion.div
                  key={index}
                  className={`aspect-square rounded-lg cursor-pointer flex items-center justify-center ${
                    target ? (target.isCorrect ? 'bg-green-400' : 'bg-red-400') : 'bg-gray-200'
                  }`}
                  whileHover={{ scale: target ? 1.1 : 1 }}
                  whileTap={{ scale: target ? 0.9 : 1 }}
                  onClick={() => target && handleTargetClick(target)}
                >
                  {target && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-8 h-8 rounded-full ${
                        target.isCorrect ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {showCelebration && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white p-8 rounded-2xl text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: 2 }}
            >
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Great Job!</h3>
            <p className="text-gray-600">You completed the level!</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 