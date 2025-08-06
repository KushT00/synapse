"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Brain,
    Target,
    Puzzle,
    Star,
    Play,
    TrendingUp,
    Gift,
    Award
} from "lucide-react";
import React from "react"; // Added missing import for React

// Improved Kid-Friendly Rocket SVG Component
const RocketIcon = ({ className = "", completed = false }: { className?: string; completed?: boolean }) => (
    <svg className={className} viewBox="0 0 120 140" fill="none">
        {/* Rocket Body - More colorful and rounded */}
        <motion.path
            d="M35 90 L35 45 Q35 30 50 25 L70 25 Q85 30 85 45 L85 90 Z"
            fill={completed ? "#ff6b6b" : "#e5e7eb"}
            stroke="#374151"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completed ? 1 : 0 }}
            transition={{ duration: 0.5 }}
        />

        {/* Rocket Nose - More pointed and colorful */}
        <motion.path
            d="M50 25 Q60 10 70 25"
            fill={completed ? "#ff8e53" : "#d1d5db"}
            stroke="#374151"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completed ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        />

        {/* Fins - More colorful */}
        <motion.path
            d="M35 80 L25 100 L35 90 Z"
            fill={completed ? "#4ecdc4" : "#e5e7eb"}
            stroke="#374151"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completed ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.path
            d="M85 80 L95 100 L85 90 Z"
            fill={completed ? "#4ecdc4" : "#e5e7eb"}
            stroke="#374151"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completed ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        />

        {/* Window - More prominent */}
        <motion.circle
            cx="60"
            cy="40"
            r="8"
            fill={completed ? "#74b9ff" : "#f3f4f6"}
            stroke="#374151"
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: completed ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
        />

        {/* Stars decoration */}
        {completed && (
            <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <motion.path
                    d="M20 30 L22 35 L27 35 L23 38 L25 43 L20 40 L15 43 L17 38 L13 35 L18 35 Z"
                    fill="#ffd93d"
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
                <motion.path
                    d="M100 50 L102 55 L107 55 L103 58 L105 63 L100 60 L95 63 L97 58 L93 55 L98 55 Z"
                    fill="#ffd93d"
                    animate={{
                        rotate: [0, -360],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 0.5
                    }}
                />
            </motion.g>
        )}

        {/* Flames - More colorful and animated */}
        {completed && (
            <motion.g
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <motion.path
                    d="M45 90 Q40 110 45 130 Q60 105 75 130 Q80 110 75 90"
                    fill="#ff9ff3"
                    animate={{
                        y: [0, -8, 0],
                        scaleY: [1, 1.3, 1]
                    }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
                <motion.path
                    d="M50 92 Q46 105 50 120 Q60 100 70 120 Q74 105 70 92"
                    fill="#ff6b6b"
                    animate={{
                        y: [0, -5, 0],
                        scaleY: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 0.1
                    }}
                />
                <motion.path
                    d="M55 94 Q52 100 55 110 Q60 95 65 110 Q68 100 65 94"
                    fill="#ffd93d"
                    animate={{
                        y: [0, -3, 0],
                        scaleY: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 0.4,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 0.2
                    }}
                />
            </motion.g>
        )}
    </svg>
);

// Gift Box Component
const GiftBox = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none">
        {/* Box */}
        <rect x="20" y="30" width="60" height="50" fill="#ff6b6b" stroke="#374151" strokeWidth="2" rx="5" />
        {/* Ribbon vertical */}
        <rect x="48" y="30" width="4" height="50" fill="#4ecdc4" stroke="#374151" strokeWidth="1" />
        {/* Ribbon horizontal */}
        <rect x="20" y="52" width="60" height="4" fill="#4ecdc4" stroke="#374151" strokeWidth="1" />
        {/* Bow */}
        <motion.path
            d="M45 30 Q50 20 55 30 Q60 25 65 30 Q60 35 55 30 Q50 35 45 30"
            fill="#ffd93d"
            stroke="#374151"
            strokeWidth="1"
        />
    </svg>
);

// Badge Component
const Badge = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none">
        {/* Badge circle */}
        <circle cx="50" cy="50" r="35" fill="#ffd93d" stroke="#374151" strokeWidth="3" />
        {/* Star in center */}
        <motion.path
            d="M50 25 L55 35 L65 35 L58 42 L62 52 L50 45 L38 52 L42 42 L35 35 L45 35 Z"
            fill="#ff6b6b"
            animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
            }}
        />
        {/* Shine effect */}
        <motion.circle
            cx="35"
            cy="35"
            r="3"
            fill="#ffffff"
            animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1]
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
            }}
        />
    </svg>
);

// Individual rocket parts
const RocketPart = ({ type, visible, className = "" }: { type: string; visible: boolean; className?: string }) => {
    const partPaths = {
        body: "M35 90 L35 45 Q35 30 50 25 L70 25 Q85 30 85 45 L85 90 Z",
        nose: "M50 25 Q60 10 70 25",
        leftFin: "M35 80 L25 100 L35 90 Z",
        rightFin: "M85 80 L95 100 L85 90 Z"
    };

    const colors = {
        body: "#ff6b6b",
        nose: "#ff8e53",
        leftFin: "#4ecdc4",
        rightFin: "#4ecdc4"
    };

    return (
        <motion.path
            d={partPaths[type as keyof typeof partPaths]}
            fill={visible ? colors[type as keyof typeof colors] : "#e5e7eb"}
            stroke="#374151"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: visible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className={className}
        />
    );
};

export default function Home() {
    const router = useRouter();
    const [completedModules, setCompletedModules] = useState<string[]>([]);
    const [isRocketFlying, setIsRocketFlying] = useState(false);

    // Load completed modules from localStorage on component mount
    useEffect(() => {
        const saved = localStorage.getItem('completedModules');
        if (saved) {
            setCompletedModules(JSON.parse(saved));
        }
    }, []);

    // Save completed modules to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('completedModules', JSON.stringify(completedModules));
    }, [completedModules]);

    const trainingModules = [
        {
            id: "memory",
            title: "Memory Adventure",
            description: "Train your brain to remember better!",
            icon: "🧠",
            color: "bg-gradient-to-br from-pink-400 to-red-500",
            rocketPart: "body",
            cartoonImage: "https://media.istockphoto.com/id/1208760136/vector/cartoon-brain-lifting-dumbbells-vector.jpg?s=612x612&w=0&k=20&c=YVtvWFP4F38m7s9KSYwrUsAzKoHdT3jNrC54VU6HqBc="
        },
        {
            id: "attention",
            title: "Focus Fun",
            description: "Learn to concentrate like a superhero!",
            icon: "🎯",
            color: "bg-gradient-to-br from-blue-400 to-purple-500",
            rocketPart: "nose",
            cartoonImage: "https://media.istockphoto.com/id/1026132954/vector/smiling-school-girl-kid-lying-on-floor-reading-book-about-three-pigs-child-development-and.jpg?s=612x612&w=0&k=20&c=VUNkfB3eQIoPZTvUX5doBm6DT04Z2r9sEyJQEicrPww="
        },
        {
            id: "problem-solving",
            title: "Puzzle Master",
            description: "Solve tricky puzzles and become smarter!",
            icon: "🧩",
            color: "bg-gradient-to-br from-green-400 to-teal-500",
            rocketPart: "leftFin",
            cartoonImage: "https://media.istockphoto.com/id/1319416916/vector/maze-game-for-children-parrot.jpg?s=612x612&w=0&k=20&c=fV8HoS48kx20EdPu1XpzLcWdm6c__Zo01natFQBmttM="
        },
        {
            id: "behavior",
            title: "Super Habits",
            description: "Build amazing habits like a champion!",
            icon: "⭐",
            color: "bg-gradient-to-br from-yellow-400 to-orange-500",
            rocketPart: "rightFin",
            cartoonImage: "https://media.istockphoto.com/id/884362232/vector/set-of-different-kids-with-various-postures.jpg?s=612x612&w=0&k=20&c=fTsdwy_U3xq0Ca_3s-5Oqrh7-ij7rBCgMCoNCRpcXrg="
        }
    ];

    const handleModuleClick = (moduleId: string) => {
        // Navigate to the game
        handleNavigation(moduleId);
    };

    const handleNavigation = (moduleId: string) => {
        if (moduleId === "memory") {
            router.push("games/memory");
        } else if (moduleId === "attention") {
            router.push("games/attention");
        } else if (moduleId === "problem-solving") {
            router.push("games/problem-solving");
        } else if (moduleId === "behavior") {
            router.push("games/behavior");
        }
    };

    // Function to mark a module as completed (called from game pages)
    const markModuleCompleted = (moduleId: string) => {
        if (!completedModules.includes(moduleId)) {
            const newCompletedModules = [...completedModules, moduleId];
            setCompletedModules(newCompletedModules);

            // If all modules completed, show success message
            if (newCompletedModules.length === 4) {
                // Don't auto-launch, let user click the launch button
            }
        }
    };

    // Function to manually mark a module as completed via checkbox
    const handleManualCompletion = (moduleId: string) => {
        if (completedModules.includes(moduleId)) {
            // Remove from completed modules
            const newCompletedModules = completedModules.filter(id => id !== moduleId);
            setCompletedModules(newCompletedModules);
        } else {
            // Add to completed modules
            const newCompletedModules = [...completedModules, moduleId];
            setCompletedModules(newCompletedModules);
        }
    };

    const isAllCompleted = completedModules.length === 4;

    // Handle rocket animation only
    React.useEffect(() => {
        if (isRocketFlying) {
            // Reset rocket flying after animation completes
            setTimeout(() => {
                setIsRocketFlying(false);
            }, 3000);
        }
    }, [isRocketFlying]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 relative overflow-hidden">
            {/* Flying Rocket */}
            <AnimatePresence>
                {isRocketFlying && (
                    <motion.div
                        className="fixed inset-0 z-50 pointer-events-none"
                        initial={{ x: "50vw", y: "50vh" }}
                        animate={{
                            x: "50vw",
                            y: "-100vh",
                            rotate: [0, 360, 720]
                        }}
                        transition={{
                            duration: 3,
                            ease: "easeIn"
                        }}
                    >
                        <RocketIcon className="w-32 h-40" completed={true} />
                    </motion.div>
                )}
            </AnimatePresence>



            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.section
                    className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border-4 border-purple-200"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center">
                        <motion.div
                            className="text-6xl mb-4"
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        >
                            🚀
                        </motion.div>
                        <motion.h1
                            className="text-6xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Brain Training Adventure!
                        </motion.h1>
                        <motion.p
                            className="text-gray-600 text-xl mb-6"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Complete all 4 fun activities to build your rocket and launch it to space!
                        </motion.p>

                        <motion.div
                            className="flex justify-center space-x-4"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="bg-gradient-to-r from-pink-400 to-purple-400 px-6 py-3 rounded-full shadow-lg">
                                <span className="text-white font-bold text-lg">
                                    Progress: {completedModules.length}/4
                                </span>
                            </div>
                            {isAllCompleted && (
                                <motion.div
                                    className="bg-gradient-to-r from-green-400 to-teal-400 px-6 py-3 rounded-full shadow-lg"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <span className="text-white font-bold text-lg">Mission Complete! 🎉</span>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </motion.section>

                {/* Training Modules */}
                <section className="mb-8">
                    <motion.h2
                        className="text-5xl font-bold text-gray-900 mb-8 text-center"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Fun Activities! 🎮
                    </motion.h2>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, staggerChildren: 0.1 }}
                    >
                        {trainingModules.map((module, index) => {
                            const isCompleted = completedModules.includes(module.id);

                            return (
                                <motion.div
                                    key={module.id}
                                    className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 cursor-pointer border-4 transition-all duration-300 ${isCompleted
                                            ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50'
                                            : 'border-transparent hover:border-purple-300 hover:shadow-3xl'
                                        }`}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                    whileHover={!isCompleted ? {
                                        y: -15,
                                        scale: 1.05,
                                        transition: { duration: 0.2 }
                                    } : {}}
                                    whileTap={!isCompleted ? { scale: 0.98 } : {}}
                                    onClick={() => handleModuleClick(module.id)}
                                >
                                    <div className="text-center">


                                        <img
                                            src={module.cartoonImage}
                                            alt="Cartoon Image"
                                            className="w-24 h-24 mb-4 object-contain mx-auto"
                                        />


                                        <h3 className="text-2xl font-bold text-gray-800 mb-3">{module.title}</h3>
                                        <p className="text-sm text-gray-600 mb-6">{module.description}</p>

                                        {isCompleted ? (
                                            <motion.div
                                                className="bg-gradient-to-r from-green-400 to-emerald-400 text-white py-3 px-6 rounded-full font-bold text-lg shadow-lg"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                ✓ Completed! 🎉
                                            </motion.div>
                                        ) : (
                                            <div className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 py-3 px-6 rounded-full font-bold text-lg shadow-lg">
                                                Click to Start! 🚀
                                            </div>
                                        )}
                                    </div>

                                    {/* Manual Completion Checkbox */}
                                    <div className="mt-6 flex justify-center">
                                        <motion.div
                                            className="flex items-center space-x-3 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleManualCompletion(module.id);
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center transition-all duration-200 ${isCompleted
                                                    ? 'border-green-500 bg-green-500'
                                                    : 'border-gray-400 hover:border-purple-400'
                                                }`}>
                                                {isCompleted && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <span className="text-white text-sm font-bold">✓</span>
                                                    </motion.div>
                                                )}
                                            </div>
                                            <span className={`text-sm font-semibold ${isCompleted ? 'text-green-600' : 'text-gray-600'
                                                }`}>
                                                {isCompleted ? 'Completed!' : 'Mark as Complete'}
                                            </span>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </section>

                {/* Rocket Building Area - Moved below cards */}
                <motion.section
                    className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-blue-200"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                >
                    <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">🚀 Build Your Rocket!</h3>
                    <div className="flex justify-center">
                        <div className="relative">
                            <svg className="w-48 h-56" viewBox="0 0 120 140">
                                <RocketPart type="body" visible={completedModules.includes("memory")} />
                                <RocketPart type="nose" visible={completedModules.includes("attention")} />
                                <RocketPart type="leftFin" visible={completedModules.includes("problem-solving")} />
                                <RocketPart type="rightFin" visible={completedModules.includes("behavior")} />

                                {/* Window */}
                                {completedModules.includes("memory") && (
                                    <motion.circle
                                        cx="60"
                                        cy="40"
                                        r="8"
                                        fill="#74b9ff"
                                        stroke="#374151"
                                        strokeWidth="3"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.3 }}
                                    />
                                )}

                                {/* Flames when complete */}
                                {isAllCompleted && (
                                    <motion.g
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <motion.path
                                            d="M45 90 Q40 110 45 130 Q60 105 75 130 Q80 110 75 90"
                                            fill="#ff9ff3"
                                            animate={{
                                                y: [0, -8, 0],
                                                scaleY: [1, 1.3, 1]
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                repeat: Infinity,
                                                repeatType: "reverse"
                                            }}
                                        />
                                    </motion.g>
                                )}
                            </svg>
                        </div>
                    </div>
                    <div className="text-center mt-6">
                        <p className="text-lg text-gray-600 font-semibold">
                            {completedModules.length}/4 activities completed
                        </p>
                        {isAllCompleted && !isRocketFlying && (
                            <motion.p
                                className="text-green-600 font-bold text-xl mt-3"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                🚀 Ready for takeoff! 🚀
                            </motion.p>
                        )}
                    </div>
                </motion.section>

                {/* Success Message */}
                <AnimatePresence>
                    {isAllCompleted && !isRocketFlying && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 text-center max-w-md mx-4 border-4 border-purple-200"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                            >
                                <motion.div
                                    className="text-8xl mb-6"
                                    animate={{
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                >
                                    🚀
                                </motion.div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                    Amazing Job! 🎉
                                </h2>
                                <p className="text-gray-600 mb-8 text-lg">
                                    You&apos;ve completed all activities! Your rocket is ready for launch!
                                </p>
                                <motion.button
                                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-2xl"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsRocketFlying(true)}
                                >
                                    Launch Rocket! 🚀
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}