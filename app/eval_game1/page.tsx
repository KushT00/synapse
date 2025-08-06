"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLORS = ["red", "blue", "green", "yellow"];
const SHAPES = ["circle", "square", "polygon", "star"];
const GAME_DURATION = 60; // seconds
const SWITCH_TIME = 30; // seconds
const OBJECTS_PER_ROUND = 6; // Reduced for kids

function speak(text: string) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.rate = 0.9; // Slower for kids
    utter.pitch = 1.2; // Higher pitch for kids
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
  yellow: "bg-gradient-to-br from-yellow-300 to-yellow-500",
};

const colorToGlow: Record<string, string> = {
  red: "shadow-red-400/50",
  blue: "shadow-blue-400/50",
  green: "shadow-green-400/50",
  yellow: "shadow-yellow-400/50",
};

const shapeToSVG: Record<string, React.ReactNode> = {
  circle: <div className="w-14 h-14 rounded-full bg-current shadow-lg"></div>,
  square: <div className="w-14 h-14 bg-current rounded-md shadow-lg"></div>,
  polygon: <div className="w-0 h-0 border-l-[28px] border-r-[28px] border-b-[40px] border-l-transparent border-r-transparent border-b-current drop-shadow-lg"></div>,
  star: <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-lg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
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
  "🔥 Mind = Blown! You're awesome!",
  "✨ Pure genius in action!",
];

const encouragementMessages = [
  "Keep going! You've got this! 💪",
  "Great job switching rules! 🔄",
  "Your brain is working hard! 🧠",
  "Nice focus! Stay strong! ⭐",
  "You're doing awesome! 🌟",
  "Brain power activated! ⚡",
  "Switching like a pro! 🎯",
];

const FloatingParticle = ({ delay }: { delay: number }) => (
  <div 
    className="absolute w-2 h-2 bg-white/30 rounded-full animate-bounce"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${2 + Math.random() * 2}s`
    }}
  />
);

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
  const [maxStreak, setMaxStreak] = useState(0);
  const [encouragementMessage, setEncouragementMessage] = useState("");
  const [celebrationMode, setCelebrationMode] = useState(false);
  const switchTimestamp = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Set sorting target
  useEffect(() => {
    if (phase === "color") {
      setSortingTarget(COLORS[Math.floor(Math.random() * COLORS.length)]);
    } else {
      setSortingTarget(SHAPES[Math.floor(Math.random() * SHAPES.length)]);
    }
  }, [phase, gameStarted]);

  // Timer logic
  useEffect(() => {
    if (!gameStarted) return;
    if (timeLeft === 0) {
      setGameStarted(false);
      setShowSummary(true);
      setCelebrationMode(true);
      speak("Time's up! You did an amazing job!");
      setTimeout(() => setCelebrationMode(false), 3000);
      return;
    }
    if (timeLeft === SWITCH_TIME) {
      setPhase("shape");
      setSwitchSignal(true);
      switchTimestamp.current = Date.now();
      setFirstCorrectAfterSwitch(false);
      speak(`Switch time! Now find all the ${sortingTarget}s by shape!`);
      setTimeout(() => setSwitchSignal(false), 3000);
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, gameStarted]);

  // Voice instructions
  useEffect(() => {
    if (!gameStarted) return;
    if (phase === "color" && timeLeft === GAME_DURATION) {
      speak(`Welcome! Find all the ${sortingTarget} colored objects!`);
    }
  }, [phase, sortingTarget, gameStarted, timeLeft]);

  // Show encouragement every 15 seconds
  useEffect(() => {
    if (!gameStarted) return;
    if (timeLeft % 15 === 0 && timeLeft !== GAME_DURATION && timeLeft !== 0) {
      const message = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
      setEncouragementMessage(message);
      setTimeout(() => setEncouragementMessage(""), 2000);
    }
  }, [timeLeft, gameStarted]);

  // Handle object selection
  function handleSelect(obj: typeof objects[0]) {
    if (!gameStarted || obj.sorted) return;
    
    let correct = false;
    if (phase === "color") {
      correct = obj.color === sortingTarget;
    } else {
      correct = obj.shape === sortingTarget;
      if (correct && !firstCorrectAfterSwitch && switchTimestamp.current) {
        setSwitchCost(Date.now() - switchTimestamp.current);
        setFirstCorrectAfterSwitch(true);
      }
    }
    
    setSelected(obj.id);
    setTimeout(() => setSelected(null), 600);
    
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const newStreak = s + 1;
        if (newStreak > maxStreak) {
          setMaxStreak(newStreak);
        }
        if (newStreak % 5 === 0) {
          setCelebrationMode(true);
          setTimeout(() => setCelebrationMode(false), 1000);
        }
        return newStreak;
      });
      setObjects((objs) =>
        objs.map((o) =>
          o.id === obj.id ? { ...o, sorted: true } : o
        )
      );
      
      // Check if we need new objects
      setTimeout(() => {
        setObjects((currentObjects) => {
          const remaining = currentObjects.filter(
            (o) =>
              !o.sorted &&
              ((phase === "color" && o.color === sortingTarget) ||
                (phase === "shape" && o.shape === sortingTarget))
          );
          
          if (remaining.length === 0) {
            return getRandomObjects(OBJECTS_PER_ROUND);
          }
          return currentObjects;
        });
      }, 700);
    } else {
      setErrors((e) => e + 1);
      setStreak(0);
    }
  }

  function startGame() {
    setScore(0);
    setErrors(0);
    setStreak(0);
    setMaxStreak(0);
    setSwitchCost(null);
    setPhase("color");
    setTimeLeft(GAME_DURATION);
    setObjects(getRandomObjects(OBJECTS_PER_ROUND));
    setGameStarted(true);
    setSwitchSignal(false);
    setShowSummary(false);
    setShowInstructions(false);
    setFirstCorrectAfterSwitch(false);
    setEncouragementMessage("");
    setCelebrationMode(false);
    switchTimestamp.current = null;
  }

  // Progress bar
  const progress = ((GAME_DURATION - timeLeft) / GAME_DURATION) * 100;
  const motivational = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  if (showInstructions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 relative overflow-hidden">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.2} />
        ))}
        
        <Card className="w-full max-w-3xl p-10 rounded-3xl shadow-2xl bg-white/95 backdrop-blur-sm border-4 border-white/50 relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-pink-100/50 opacity-50"></div>
          
          <div className="relative z-10">
            <h1 className="text-6xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight drop-shadow-lg animate-pulse">
              🧠 Brain Switch Challenge! 🚀
            </h1>
            
            <div className="text-center mb-10">
              <div className="text-3xl font-bold text-gray-700 mb-6 animate-bounce">How to Play:</div>
              <div className="space-y-6 text-xl text-gray-700 leading-relaxed">
                <div className="flex items-center justify-center gap-4 p-4 bg-blue-100/80 rounded-2xl border-2 border-blue-300 transform hover:scale-105 transition-transform">
                  <span className="text-3xl">🎯</span>
                  <span>Click on objects that match the rule shown at the top!</span>
                </div>
                <div className="flex items-center justify-center gap-4 p-4 bg-red-100/80 rounded-2xl border-2 border-red-300 transform hover:scale-105 transition-transform">
                  <span className="text-3xl">🎨</span>
                  <span>First 30 seconds: Sort by <strong className="text-red-600">COLOR</strong></span>
                </div>
                <div className="flex items-center justify-center gap-4 p-4 bg-purple-100/80 rounded-2xl border-2 border-purple-300 transform hover:scale-105 transition-transform">
                  <span className="text-3xl">🔷</span>
                  <span>Last 30 seconds: Sort by <strong className="text-purple-600">SHAPE</strong></span>
                </div>
                <div className="flex items-center justify-center gap-4 p-4 bg-yellow-100/80 rounded-2xl border-2 border-yellow-300 transform hover:scale-105 transition-transform">
                  <span className="text-3xl">⚡</span>
                  <span>When you see "SWITCH!" - change your strategy fast!</span>
                </div>
                <div className="flex items-center justify-center gap-4 p-4 bg-green-100/80 rounded-2xl border-2 border-green-300 transform hover:scale-105 transition-transform">
                  <span className="text-3xl">🏆</span>
                  <span>Try to get as many correct as possible!</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => setShowInstructions(false)} 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-2xl px-16 py-6 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse"
              >
                🎮 Let's Play!
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden transition-all duration-500",
      celebrationMode 
        ? "bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600" 
        : "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
    )}>
      {/* Dynamic floating particles */}
      {[...Array(celebrationMode ? 30 : 15)].map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.1} />
      ))}

      <Card className="w-full max-w-4xl p-8 rounded-3xl shadow-2xl bg-white/95 backdrop-blur-sm border-4 border-white/50 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-50"></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
            🧠 Brain Switch Challenge
          </h1>
          
          {/* Enhanced progress bar */}
          <div className="relative w-full h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-8 overflow-hidden border-3 border-gray-400 shadow-inner">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-300 relative overflow-hidden",
                timeLeft > 30 
                  ? "bg-gradient-to-r from-green-400 via-blue-400 to-purple-500" 
                  : "bg-gradient-to-r from-orange-400 via-red-400 to-pink-500"
              )}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-700 drop-shadow-sm">
                {timeLeft}s remaining
              </span>
            </div>
          </div>

          {showSummary ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="text-5xl font-bold text-center mb-8 animate-bounce">
                {motivational}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 w-full max-w-4xl">
                <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-3xl border-4 border-green-300 shadow-xl text-white transform hover:scale-105 transition-transform">
                  <div className="text-4xl font-bold">{score}</div>
                  <div className="text-lg">Correct! 🎯</div>
                </div>
                <div className="bg-gradient-to-br from-red-400 to-red-600 p-6 rounded-3xl border-4 border-red-300 shadow-xl text-white transform hover:scale-105 transition-transform">
                  <div className="text-4xl font-bold">{errors}</div>
                  <div className="text-lg">Mistakes 🤔</div>
                </div>
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-6 rounded-3xl border-4 border-orange-300 shadow-xl text-white transform hover:scale-105 transition-transform">
                  <div className="text-4xl font-bold">{maxStreak}</div>
                  <div className="text-lg">Best Streak 🔥</div>
                </div>
                {switchCost !== null && (
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-6 rounded-3xl border-4 border-blue-300 shadow-xl text-white transform hover:scale-105 transition-transform">
                    <div className="text-4xl font-bold">{(switchCost / 1000).toFixed(1)}s</div>
                    <div className="text-lg">Switch Speed ⚡</div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={startGame} 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-2xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300"
                >
                  🎮 Play Again!
                </Button>
                <Button 
                  onClick={() => setShowInstructions(true)} 
                  className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white text-xl px-10 py-4 rounded-full shadow-lg"
                >
                  📋 How to Play
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Enhanced rule display */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <span className="text-2xl font-bold text-gray-700">Find all the:</span>
                <span className={cn(
                  "px-8 py-4 rounded-full text-white font-bold text-2xl flex items-center gap-4 shadow-2xl transform transition-all duration-500 border-4",
                  phase === "color" 
                    ? "bg-gradient-to-r from-red-500 to-pink-500 border-red-300" 
                    : "bg-gradient-to-r from-blue-500 to-purple-500 border-blue-300",
                  switchSignal && "animate-pulse scale-110 shadow-pink-400/50"
                )}>
                  {phase === "color" ? (
                    <span className="inline-flex items-center gap-3">
                      <span className={cn("w-8 h-8 rounded-full shadow-lg", colorToClass[sortingTarget].replace('bg-gradient-to-br', 'bg-gradient-to-r'))} />
                      {sortingTarget.toUpperCase()} ONES! 🎨
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-3">
                      <span className="text-white scale-75">{shapeToSVG[sortingTarget]}</span>
                      {sortingTarget.toUpperCase()}S! 🔷
                    </span>
                  )}
                </span>
                {switchSignal && (
                  <span className="ml-6 animate-bounce text-4xl font-bold text-pink-600 drop-shadow-2xl">
                    🔄 SWITCH! 🔄
                  </span>
                )}
              </div>

              {/* Enhanced stats display */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-2xl border-3 border-blue-300 shadow-xl text-white transform hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold">⏰ {timeLeft}s</div>
                  <div className="text-sm">Time Left</div>
                </div>
                <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-2xl border-3 border-green-300 shadow-xl text-white transform hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold">🎯 {score}</div>
                  <div className="text-sm">Score</div>
                </div>
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-4 rounded-2xl border-3 border-orange-300 shadow-xl text-white transform hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold">🔥 {streak}</div>
                  <div className="text-sm">Streak</div>
                </div>
                <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-4 rounded-2xl border-3 border-purple-300 shadow-xl text-white transform hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold">👑 {maxStreak}</div>
                  <div className="text-sm">Best</div>
                </div>
              </div>

              {/* Enhanced encouragement message */}
              {encouragementMessage && (
                <div className="text-center mb-6">
                  <span className="inline-block bg-gradient-to-r from-yellow-300 to-orange-400 text-orange-900 px-6 py-3 rounded-full font-bold text-lg animate-bounce shadow-lg border-2 border-yellow-400">
                    {encouragementMessage}
                  </span>
                </div>
              )}

              {/* Enhanced game objects */}
              <div className="grid grid-cols-3 gap-6 my-8">
                {objects.map((obj) => (
                  <Button
                    key={obj.id}
                    className={cn(
                      "flex flex-col items-center justify-center h-40 w-full text-2xl border-4 border-white transition-all duration-300 relative overflow-hidden transform hover:scale-105 shadow-2xl",
                      colorToClass[obj.color],
                      colorToGlow[obj.color],
                      selected === obj.id && (
                        ((phase === "color" && obj.color === sortingTarget) || 
                         (phase === "shape" && obj.shape === sortingTarget)) && !obj.sorted
                          ? "ring-8 ring-green-400 scale-110 shadow-green-400/50 animate-pulse" 
                          : "ring-8 ring-red-400 scale-110 shadow-red-400/50 animate-pulse"
                      ),
                      obj.sorted && "opacity-50 pointer-events-none grayscale scale-95",
                      "rounded-3xl"
                    )}
                    onClick={() => handleSelect(obj)}
                    disabled={obj.sorted}
                  >
                    <div className="text-white drop-shadow-2xl mb-3 transform hover:scale-110 transition-transform">
                      {shapeToSVG[obj.shape]}
                    </div>
                    {obj.sorted && (
                      <div className="absolute inset-0 flex items-center justify-center bg-green-500/90 rounded-3xl backdrop-blur-sm">
                        <span className="text-white text-6xl animate-bounce">✅</span>
                      </div>
                    )}
                    {/* Sparkle effect for correct selections */}
                    {selected === obj.id && ((phase === "color" && obj.color === sortingTarget) || (phase === "shape" && obj.shape === sortingTarget)) && !obj.sorted && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                        <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-ping animation-delay-200"></div>
                        <div className="absolute bottom-3 left-4 w-2 h-2 bg-yellow-200 rounded-full animate-ping animation-delay-400"></div>
                        <div className="absolute bottom-2 right-2 w-3 h-3 bg-white rounded-full animate-ping animation-delay-600"></div>
                      </div>
                    )}
                  </Button>
                ))}
              </div>

              {/* Enhanced control buttons */}
              <div className="flex flex-col items-center mt-8 gap-6">
                {!gameStarted ? (
                  <Button 
                    onClick={startGame} 
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-2xl px-16 py-6 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse"
                  >
                    🚀 Start Game!
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setGameStarted(false)} 
                    className="bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white text-xl px-10 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    ⏹️ Stop Game
                  </Button>
                )}
                
                <div className="flex gap-4">
                  <Button 
                    onClick={() => setShowInstructions(true)} 
                    className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white text-sm px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    📋 How to Play
                  </Button>
                  
                  {gameStarted && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-sm font-medium text-gray-700">
                        {phase === "color" ? "🎨 Color Mode" : "🔷 Shape Mode"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Celebration overlay */}
        {celebrationMode && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-pink-400/20 animate-pulse"></div>
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-yellow-400 rounded-full animate-bounce opacity-80"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        )}
      </Card>
      
      {/* Enhanced instructions footer */}
      <div className="mt-8 text-center text-white/90 text-lg max-w-2xl bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
        <p className="leading-relaxed">
          <b className="text-yellow-300">🎯 Quick Tip:</b> Stay focused and be ready to switch your thinking when the signal appears! 
          Your brain is training to be more flexible and powerful! 💪🧠
        </p>
      </div>
    </div>
  );
}