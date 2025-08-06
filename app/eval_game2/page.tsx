"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Target, Brain, Zap, Trophy, Clock, Star, Play, Pause } from "lucide-react";

const COLORS = ["red", "blue", "green", "yellow"];
const SHAPES = ["circle", "square", "polygon", "star"];
const GAME_DURATION = 60; // seconds
const SWITCH_TIME = 30; // seconds
const OBJECTS_PER_ROUND = 6;

function speak(text: string) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.2;
    window.speechSynthesis.speak(utter);
  }
}

function getRandomObjects(n: number) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push({
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      id: `${Date.now()}-${i}-${Math.random()}`,
      sorted: false,
    });
  }
  return arr;
}

const colorToClass: Record<string, string> = {
  red: "bg-gradient-to-br from-red-400 to-red-600",
  blue: "bg-gradient-to-br from-blue-400 to-blue-600",
  green: "bg-gradient-to-br from-green-400 to-green-600",
  yellow: "bg-gradient-to-br from-yellow-400 to-yellow-600",
};

const shapeToSVG: Record<string, React.ReactNode> = {
  circle: <div className="w-16 h-16 rounded-full bg-white shadow-lg"></div>,
  square: <div className="w-16 h-16 bg-white shadow-lg rounded-lg"></div>,
  polygon: (
    <svg width="64" height="64" viewBox="0 0 48 48" className="block">
      <polygon points="24,6 42,18 42,36 24,48 6,36 6,18" fill="white" />
    </svg>
  ),
  star: <svg width="64" height="64" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
};

const motivationalMessages = [
  "🌟 Amazing job, superstar!",
  "🎯 You're a brain training champion!",
  "🚀 Fantastic focus!",
  "⭐ Incredible flexibility!",
  "🏆 You're getting smarter!",
  "🎉 Outstanding effort!",
  "💪 Your brain is so powerful!",
  "🌈 You rock at this game!",
];

const encouragementMessages = [
  "Keep going! You've got this! 💪",
  "Great job switching rules! 🔄",
  "Your brain is working hard! 🧠",
  "Nice focus! Stay strong! ⭐",
  "You're doing awesome! 🌟",
];

export default function RuleSwitchingGame() {
  const [phase, setPhase] = useState<"color" | "shape">("color");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [objects, setObjects] = useState(() => getRandomObjects(OBJECTS_PER_ROUND));
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [switchCost, setSwitchCost] = useState<number | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [sortingTarget, setSortingTarget] = useState<string>("");
  const [gameStarted, setGameStarted] = useState(false);
  const [switchSignal, setSwitchSignal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [firstCorrectAfterSwitch, setFirstCorrectAfterSwitch] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [streak, setStreak] = useState(0);
  const [encouragementMessage, setEncouragementMessage] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const switchTimestamp = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize sorting target
  useEffect(() => {
    if (phase === "color") {
      setSortingTarget(COLORS[Math.floor(Math.random() * COLORS.length)]);
    } else {
      setSortingTarget(SHAPES[Math.floor(Math.random() * SHAPES.length)]);
    }
  }, [phase]);

  // Timer logic
  useEffect(() => {
    if (gameStarted && !isPaused && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameStarted) {
      setGameStarted(false);
      setShowSummary(true);
      speak("Great job! Game complete!");
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, gameStarted, isPaused]);

  // Phase switching logic
  useEffect(() => {
    if (timeLeft === SWITCH_TIME && gameStarted && !isPaused) {
      setPhase("shape");
      setSwitchSignal(true);
      switchTimestamp.current = Date.now();
      setFirstCorrectAfterSwitch(false);
      speak("Switch! Now sort by shape!");
      setTimeout(() => setSwitchSignal(false), 3000);
    }
  }, [timeLeft, gameStarted, isPaused]);

  // Voice instructions
  useEffect(() => {
    if (gameStarted && timeLeft === GAME_DURATION) {
      speak(`Find all the ${sortingTarget} colored objects!`);
    }
  }, [gameStarted, sortingTarget, timeLeft]);

  function handleSelect(obj: typeof objects[0]) {
    if (!gameStarted || obj.sorted || isPaused) return;

    const isCorrect = (phase === "color" && obj.color === sortingTarget) || 
                     (phase === "shape" && obj.shape === sortingTarget);

    setSelected(obj.id);
    setTimeout(() => setSelected(null), 500);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      setObjects(prev => prev.map(o => o.id === obj.id ? { ...o, sorted: true } : o));
      
      // Check switch cost
      if (switchTimestamp.current && !firstCorrectAfterSwitch && phase === "shape") {
        const cost = Date.now() - switchTimestamp.current;
        setSwitchCost(cost);
        setFirstCorrectAfterSwitch(true);
      }

      // Show encouragement
      const message = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
      setEncouragementMessage(message);
      setTimeout(() => setEncouragementMessage(""), 2000);

      speak("Correct!");
    } else {
      setErrors(prev => prev + 1);
      setStreak(0);
      speak("Try again!");
    }

    // Check if we need new objects
    setTimeout(() => {
      setObjects(prev => {
        const remaining = prev.filter(o => 
          !o.sorted && 
          ((phase === "color" && o.color === sortingTarget) || 
           (phase === "shape" && o.shape === sortingTarget))
        );
        
        if (remaining.length === 0) {
          return getRandomObjects(OBJECTS_PER_ROUND);
        }
        return prev;
      });
    }, 600);
  }

  function startGame() {
    setPhase("color");
    setScore(0);
    setErrors(0);
    setStreak(0);
    setSwitchCost(null);
    setTimeLeft(GAME_DURATION);
    setObjects(getRandomObjects(OBJECTS_PER_ROUND));
    setGameStarted(true);
    setIsPaused(false);
    setSwitchSignal(false);
    setShowSummary(false);
    setShowInstructions(false);
    setFirstCorrectAfterSwitch(false);
    setEncouragementMessage("");
    switchTimestamp.current = null;
  }

  function pauseGame() {
    setIsPaused(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }

  function resumeGame() {
    setIsPaused(false);
  }

  function stopGame() {
    setGameStarted(false);
    setIsPaused(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }

  // Progress calculation
  const progress = ((GAME_DURATION - timeLeft) / GAME_DURATION) * 100;
  const motivational = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-2 sm:p-4">
        <Card className="w-full max-w-4xl lg:max-w-5xl p-4 sm:p-6 lg:p-10 rounded-2xl lg:rounded-3xl shadow-2xl bg-white/90 backdrop-blur-sm border-0">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
              <Brain className="w-8 h-8 sm:w-12 h-12 lg:w-16 h-16 text-purple-600" />
              <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 tracking-tight">
                Brain Switch Challenge
              </h1>
              <Zap className="w-8 h-8 sm:w-12 h-12 lg:w-16 h-16 text-pink-600" />
            </div>
            <p className="text-sm sm:text-lg lg:text-2xl text-gray-600 mb-6 sm:mb-8 lg:mb-10">Train your brain to switch between different rules quickly!</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 mb-6 sm:mb-8 lg:mb-10">
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl border-l-4 border-red-400 shadow-lg">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-700 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl lg:text-3xl">🎨</span>
                  First 30 Seconds
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-red-600">Sort objects by <strong>COLOR</strong></p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl border-l-4 border-blue-400 shadow-lg">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl lg:text-3xl">⬡</span>
                  Last 30 Seconds
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-blue-600">Sort objects by <strong>SHAPE</strong></p>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl border-l-4 border-green-400 shadow-lg">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-700 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl lg:text-3xl">⚡</span>
                  Switch Challenge
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-green-600">When you see "SWITCH!" - change your strategy fast!</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl border-l-4 border-purple-400 shadow-lg">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-700 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl lg:text-3xl">🏆</span>
                  Goal
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-purple-600">Get as many correct as possible and build your streak!</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => setShowInstructions(false)} 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg sm:text-xl lg:text-2xl px-8 sm:px-12 lg:px-16 py-4 sm:py-5 lg:py-6 rounded-full shadow-xl transform hover:scale-105 transition-all duration-200 font-bold"
            >
              🎮 Let's Play!
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-4xl lg:max-w-6xl p-4 sm:p-6 lg:p-10 rounded-2xl lg:rounded-3xl shadow-2xl bg-white/90 backdrop-blur-sm border-0 relative">
        {showSummary ? (
          <div className="text-center py-6 sm:py-8 lg:py-12">
            <div className="mb-6 sm:mb-8 lg:mb-12">
              <Trophy className="w-12 h-12 sm:w-16 h-16 lg:w-20 h-20 text-yellow-500 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4 sm:mb-6">
                {motivational}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-12">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl border-2 border-green-200 shadow-xl">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-2 sm:mb-3">{score}</div>
                <div className="text-sm sm:text-base lg:text-xl text-green-700 font-semibold">Correct! 🎯</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl border-2 border-red-200 shadow-xl">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-red-600 mb-2 sm:mb-3">{errors}</div>
                <div className="text-sm sm:text-base lg:text-xl text-red-700 font-semibold">Mistakes 🤔</div>
              </div>
              {switchCost !== null && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl border-2 border-blue-200 shadow-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2 sm:mb-3">{(switchCost / 1000).toFixed(1)}s</div>
                  <div className="text-sm sm:text-base lg:text-xl text-blue-700 font-semibold">Switch Speed ⚡</div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Button 
                onClick={startGame} 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg sm:text-xl lg:text-2xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-full shadow-xl transform hover:scale-105 transition-all duration-200 font-bold"
              >
                🎮 Play Again!
              </Button>
              <Button
                onClick={() => window.location.href = '/eval_game3'}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-full text-lg sm:text-xl lg:text-2xl font-bold flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 transition-all duration-200 shadow-xl transform hover:scale-105"
              >
                <Target className="w-5 h-5 sm:w-6 h-6 lg:w-8 h-8" />
                Next Game
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
              <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-5 lg:mb-6">
                <Brain className="w-8 h-8 sm:w-10 h-10 lg:w-12 h-12 text-purple-600" />
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 tracking-tight">
                  Brain Switch Challenge
                </h1>
                <Zap className="w-8 h-8 sm:w-10 h-10 lg:w-12 h-12 text-pink-600" />
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-3 sm:h-4 bg-gray-200 rounded-full mb-6 sm:mb-7 lg:mb-8 overflow-hidden border-2 border-gray-300 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 transition-all duration-300 shadow-lg" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>

            {/* Game Rules Display */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-700">Find all the:</span>
              <div className={cn(
                "px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-6 rounded-2xl lg:rounded-3xl text-white font-bold text-lg sm:text-xl lg:text-2xl flex items-center gap-3 sm:gap-4 lg:gap-6 shadow-2xl transform transition-all duration-500 border-2",
                phase === "color" 
                  ? "bg-gradient-to-r from-red-500 to-pink-500 border-red-400" 
                  : "bg-gradient-to-r from-blue-500 to-purple-500 border-blue-400",
                switchSignal && "animate-pulse scale-110 border-yellow-400"
              )}>
                {phase === "color" ? (
                  <span className="inline-flex items-center gap-2 sm:gap-3 lg:gap-4">
                    <div className={cn("w-8 h-8 sm:w-10 h-10 lg:w-12 h-12 rounded-full shadow-lg", colorToClass[sortingTarget])} />
                    <span className="text-sm sm:text-base lg:text-lg">{sortingTarget.toUpperCase()} ONES! 🎨</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 sm:gap-3 lg:gap-4">
                    <div className={cn("w-8 h-8 sm:w-10 h-10 lg:w-12 h-12 flex items-center justify-center", colorToClass[sortingTarget])}>
                      {shapeToSVG[sortingTarget]}
                    </div>
                    <span className="text-sm sm:text-base lg:text-lg">{sortingTarget.toUpperCase()}S! ⬡</span>
                  </span>
                )}
              </div>
              {switchSignal && (
                <div className="animate-bounce bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full font-bold text-lg sm:text-xl lg:text-2xl shadow-xl">
                  🔄 SWITCH! 🔄
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 lg:p-6 rounded-2xl lg:rounded-3xl border-2 border-blue-200 shadow-xl">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Clock className="w-5 h-5 sm:w-6 h-6 lg:w-7 h-7 text-blue-600" />
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-700">{timeLeft}s</div>
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-blue-600 font-semibold text-center">Time Left</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 lg:p-6 rounded-2xl lg:rounded-3xl border-2 border-green-200 shadow-xl">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Target className="w-5 h-5 sm:w-6 h-6 lg:w-7 h-7 text-green-600" />
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700">{score}</div>
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-green-600 font-semibold text-center">Score</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 sm:p-4 lg:p-6 rounded-2xl lg:rounded-3xl border-2 border-orange-200 shadow-xl">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Star className="w-5 h-5 sm:w-6 h-6 lg:w-7 h-7 text-orange-600" />
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-700">{streak}</div>
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-orange-600 font-semibold text-center">Streak</div>
              </div>
            </div>

            {/* Pause Overlay */}
            {isPaused && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-2xl lg:rounded-3xl">
                <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-3xl text-center shadow-2xl mx-4">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Game Paused</h3>
                  <Button 
                    onClick={resumeGame}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg"
                  >
                    <Play className="w-4 h-4 sm:w-5 h-5 lg:w-6 h-6 mr-2 sm:mr-3" />
                    Resume
                  </Button>
                </div>
              </div>
            )}

            {/* Encouragement Message */}
            {encouragementMessage && (
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full font-bold text-base sm:text-lg lg:text-xl animate-bounce shadow-xl">
                  {encouragementMessage}
                </div>
              </div>
            )}

            {/* Game Objects Grid */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-10">
              {objects.map((obj) => (
                <Button
                  key={obj.id}
                  className={cn(
                    "flex flex-col items-center justify-center h-24 sm:h-32 lg:h-40 w-full text-lg sm:text-2xl lg:text-3xl border-4 border-gray-300 transition-all duration-300 relative overflow-hidden transform hover:scale-105 shadow-xl rounded-2xl lg:rounded-3xl",
                    colorToClass[obj.color],
                    selected === obj.id && (
                      ((phase === "color" && obj.color === sortingTarget) || 
                       (phase === "shape" && obj.shape === sortingTarget)) && !obj.sorted
                        ? "ring-4 sm:ring-6 lg:ring-8 ring-green-400 scale-110 shadow-2xl border-green-400" 
                        : "ring-4 sm:ring-6 lg:ring-8 ring-red-400 scale-110 shadow-2xl border-red-400"
                    ),
                    obj.sorted && "opacity-40 pointer-events-none grayscale"
                  )}
                  onClick={() => handleSelect(obj)}
                  disabled={obj.sorted || !gameStarted || isPaused}
                >
                  <div className="text-white drop-shadow-lg mb-1 sm:mb-2 lg:mb-3">
                    {shapeToSVG[obj.shape]}
                  </div>
                  {obj.sorted && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500/80 rounded-2xl lg:rounded-3xl">
                      <span className="text-white text-2xl sm:text-3xl lg:text-5xl">✅</span>
                    </div>
                  )}
                </Button>
              ))}
            </div>

            {/* Control Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              {!gameStarted ? (
                <Button 
                  onClick={startGame} 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg sm:text-xl lg:text-2xl px-8 sm:px-12 lg:px-16 py-4 sm:py-5 lg:py-6 rounded-full shadow-xl transform hover:scale-105 transition-all duration-200 font-bold"
                >
                  🚀 Start Game!
                </Button>
              ) : (
                <div className="flex gap-4 sm:gap-6">
                  {isPaused ? (
                    <Button 
                      onClick={resumeGame}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-full shadow-xl font-semibold"
                    >
                      <Play className="w-4 h-4 sm:w-5 h-5 lg:w-6 h-6 mr-2 sm:mr-3" />
                      Resume
                    </Button>
                  ) : (
                    <Button 
                      onClick={pauseGame}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-full shadow-xl font-semibold"
                    >
                      <Pause className="w-4 h-4 sm:w-5 h-5 lg:w-6 h-6 mr-2 sm:mr-3" />
                      Pause
                    </Button>
                  )}
                  <Button 
                    onClick={stopGame}
                    className="bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-full shadow-xl font-semibold"
                  >
                    ⏹️ Stop
                  </Button>
                </div>
              )}
              <Button 
                onClick={() => setShowInstructions(true)} 
                className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full font-semibold border border-gray-300 shadow-lg"
              >
                📋 How to Play
              </Button>
            </div>

            {/* Skip Button - Bottom Right */}
            <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-20">
              <Button 
                onClick={() => window.location.href = '/eval_game3'}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm sm:text-base lg:text-lg px-4 sm:px-6 py-3 sm:py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                ⏭️ Skip to Next Game
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}