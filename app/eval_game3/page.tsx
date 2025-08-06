'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, CheckCircle, XCircle, Eye, Clock, Target, Brain, TrendingUp, AlertTriangle, MoveRight } from 'lucide-react';

// Types
interface GameStimulus {
    id: string;
    type: 'target' | 'distractor';
    shape: 'circle' | 'square' | 'triangle';
    color: string;
    size: 'small' | 'medium' | 'large';
}

interface Response {
    stimulusId: string;
    isTarget: boolean;
    userClicked: boolean;
    reactionTime: number | null;
    timestamp: number;
}

interface GameResults {
    totalStimuli: number;
    totalTargets: number;
    hits: number;
    misses: number;
    falseAlarms: number;
    correctRejections: number;
    averageReactionTime: number;
    attentionScore: number;
    impulseControlScore: number;
    vigilanceScore: number;
    responses: Response[];
}

// Game configuration
const GAME_CONFIG = {
    stimulusDuration: 1500, // ms
    interStimulusInterval: 500, // ms
    totalStimuli: 30,
    targetProbability: 0.3,
    shapes: ['circle', 'square', 'triangle'] as const,
    colors: [
        { name: 'red', class: 'bg-red-400', hex: '#f87171' },
        { name: 'blue', class: 'bg-blue-400', hex: '#60a5fa' },
        { name: 'green', class: 'bg-green-400', hex: '#4ade80' },
        { name: 'yellow', class: 'bg-yellow-400', hex: '#facc15' },
        { name: 'purple', class: 'bg-purple-400', hex: '#c084fc' },
        { name: 'pink', class: 'bg-pink-400', hex: '#f472b6' },
    ]
};

const FocusDetectiveGame: React.FC = () => {
    // Game state
    const [gamePhase, setGamePhase] = useState<'instructions' | 'countdown' | 'playing' | 'interval' | 'results'>('instructions');
    const [currentStimulus, setCurrentStimulus] = useState<GameStimulus | null>(null);
    const [stimulusIndex, setStimulusIndex] = useState(0);
    const [targetType, setTargetType] = useState<{ shape: string; color: string } | null>(null);
    const [responses, setResponses] = useState<Response[]>([]);
    const [stimulusStartTime, setStimulusStartTime] = useState<number>(0);
    const [countdown, setCountdown] = useState(3);
    const [gameResults, setGameResults] = useState<GameResults | null>(null);

    const stimulusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const intervalTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Generate random stimulus
    const generateStimulus = useCallback((isTarget: boolean = false): GameStimulus => {
        const shapes = GAME_CONFIG.shapes;
        const colors = GAME_CONFIG.colors;
        const sizes = ['small', 'medium', 'large'] as const;

        if (isTarget && targetType) {
            return {
                id: `stimulus-${Date.now()}`,
                type: 'target',
                shape: targetType.shape as any,
                color: targetType.color,
                size: sizes[Math.floor(Math.random() * sizes.length)]
            };
        }

        let shape: string, color: string;

        if (targetType && !isTarget) {
            // Ensure distractor is different from target
            do {
                shape = shapes[Math.floor(Math.random() * shapes.length)];
                color = colors[Math.floor(Math.random() * colors.length)].name;
            } while (shape === targetType.shape && color === targetType.color);
        } else {
            shape = shapes[Math.floor(Math.random() * shapes.length)];
            color = colors[Math.floor(Math.random() * colors.length)].name;
        }

        return {
            id: `stimulus-${Date.now()}`,
            type: isTarget ? 'target' : 'distractor',
            shape: shape as any,
            color: color,
            size: sizes[Math.floor(Math.random() * sizes.length)]
        };
    }, [targetType]);

    // Initialize game
    const startGame = useCallback(() => {
        // Set target type (red circle for this game)
        setTargetType({ shape: 'circle', color: 'red' });
        setGamePhase('countdown');
        setCountdown(3);
        setResponses([]);
        setStimulusIndex(0);
        setGameResults(null);
    }, []);

    // Countdown effect
    useEffect(() => {
        if (gamePhase === 'countdown' && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (gamePhase === 'countdown' && countdown === 0) {
            setGamePhase('playing');
            showNextStimulus();
        }
    }, [gamePhase, countdown]);

    // Show next stimulus
    const showNextStimulus = useCallback(() => {
        if (stimulusIndex >= GAME_CONFIG.totalStimuli) {
            calculateResults();
            return;
        }

        const isTarget = Math.random() < GAME_CONFIG.targetProbability;
        const stimulus = generateStimulus(isTarget);

        setCurrentStimulus(stimulus);
        setStimulusStartTime(Date.now());

        // Auto-advance after stimulus duration
        stimulusTimeoutRef.current = setTimeout(() => {
            // Record miss if it was a target and user didn't click
            const response: Response = {
                stimulusId: stimulus.id,
                isTarget: stimulus.type === 'target',
                userClicked: false,
                reactionTime: null,
                timestamp: Date.now()
            };

            setResponses(prev => [...prev, response]);
            setCurrentStimulus(null);
            setStimulusIndex(prev => prev + 1);

            // Show interval
            setGamePhase('interval');
            intervalTimeoutRef.current = setTimeout(() => {
                setGamePhase('playing');
                showNextStimulus();
            }, GAME_CONFIG.interStimulusInterval);

        }, GAME_CONFIG.stimulusDuration);
    }, [stimulusIndex, generateStimulus]);

    // Handle stimulus click
    const handleStimulusClick = useCallback(() => {
        if (!currentStimulus || gamePhase !== 'playing') return;

        const reactionTime = Date.now() - stimulusStartTime;
        const response: Response = {
            stimulusId: currentStimulus.id,
            isTarget: currentStimulus.type === 'target',
            userClicked: true,
            reactionTime,
            timestamp: Date.now()
        };

        setResponses(prev => [...prev, response]);

        // Clear timeouts and advance
        if (stimulusTimeoutRef.current) {
            clearTimeout(stimulusTimeoutRef.current);
        }

        setCurrentStimulus(null);
        setStimulusIndex(prev => prev + 1);

        setGamePhase('interval');
        intervalTimeoutRef.current = setTimeout(() => {
            setGamePhase('playing');
            showNextStimulus();
        }, GAME_CONFIG.interStimulusInterval);

    }, [currentStimulus, gamePhase, stimulusStartTime]);

    // Calculate results
    const calculateResults = useCallback(() => {
        const hits = responses.filter(r => r.isTarget && r.userClicked).length;
        const misses = responses.filter(r => r.isTarget && !r.userClicked).length;
        const falseAlarms = responses.filter(r => !r.isTarget && r.userClicked).length;
        const correctRejections = responses.filter(r => !r.isTarget && !r.userClicked).length;

        const totalTargets = hits + misses;
        const totalStimuli = responses.length;

        const reactionTimes = responses
            .filter(r => r.userClicked && r.reactionTime !== null)
            .map(r => r.reactionTime!);

        const averageReactionTime = reactionTimes.length > 0
            ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
            : 0;

        // Calculate scores (0-100)
        const attentionScore = totalTargets > 0 ? Math.max(0, ((hits - falseAlarms) / totalTargets) * 100) : 0;
        const impulseControlScore = totalStimuli > 0 ? Math.max(0, ((totalStimuli - falseAlarms) / totalStimuli) * 100) : 0;

        // Vigilance score (comparing first half vs second half performance)
        const firstHalf = responses.slice(0, Math.floor(responses.length / 2));
        const secondHalf = responses.slice(Math.floor(responses.length / 2));

        const firstHalfAccuracy = firstHalf.length > 0 ?
            firstHalf.filter(r => (r.isTarget && r.userClicked) || (!r.isTarget && !r.userClicked)).length / firstHalf.length : 1;
        const secondHalfAccuracy = secondHalf.length > 0 ?
            secondHalf.filter(r => (r.isTarget && r.userClicked) || (!r.isTarget && !r.userClicked)).length / secondHalf.length : 1;

        const vigilanceScore = Math.max(0, (secondHalfAccuracy / firstHalfAccuracy) * 100);

        const results: GameResults = {
            totalStimuli,
            totalTargets,
            hits,
            misses,
            falseAlarms,
            correctRejections,
            averageReactionTime,
            attentionScore: Math.round(attentionScore),
            impulseControlScore: Math.round(impulseControlScore),
            vigilanceScore: Math.round(Math.min(100, vigilanceScore)),
            responses
        };

        setGameResults(results);
        setGamePhase('results');
    }, [responses]);

    // Reset game
    const resetGame = () => {
        setGamePhase('instructions');
        setCurrentStimulus(null);
        setStimulusIndex(0);
        setTargetType(null);
        setResponses([]);
        setGameResults(null);

        if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
        if (intervalTimeoutRef.current) clearTimeout(intervalTimeoutRef.current);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
            if (intervalTimeoutRef.current) clearTimeout(intervalTimeoutRef.current);
        };
    }, []);

    // Get shape component
    const getShapeComponent = (stimulus: GameStimulus) => {
        const colorClass = GAME_CONFIG.colors.find(c => c.name === stimulus.color)?.class || 'bg-gray-400';
        const sizeClass = {
            small: 'w-16 h-16',
            medium: 'w-24 h-24',
            large: 'w-32 h-32'
        }[stimulus.size];

        const baseClasses = `${colorClass} ${sizeClass} cursor-pointer transition-transform hover:scale-110`;

        switch (stimulus.shape) {
            case 'circle':
                return <div className={`${baseClasses} rounded-full`} onClick={handleStimulusClick} />;
            case 'square':
                return <div className={`${baseClasses} rounded-lg`} onClick={handleStimulusClick} />;
            case 'triangle':
                return (
                    <div
                        className={`${sizeClass} cursor-pointer transition-transform hover:scale-110`}
                        onClick={handleStimulusClick}
                        style={{
                            width: 0,
                            height: 0,
                            borderLeft: stimulus.size === 'small' ? '32px solid transparent' : stimulus.size === 'medium' ? '48px solid transparent' : '64px solid transparent',
                            borderRight: stimulus.size === 'small' ? '32px solid transparent' : stimulus.size === 'medium' ? '48px solid transparent' : '64px solid transparent',
                            borderBottom: `${stimulus.size === 'small' ? '64px' : stimulus.size === 'medium' ? '96px' : '128px'} solid ${GAME_CONFIG.colors.find(c => c.name === stimulus.color)?.hex || '#9ca3af'}`,
                            backgroundColor: 'transparent'
                        }}
                    />
                );
            default:
                return null;
        }
    };

    // Instructions phase
    if (gamePhase === 'instructions') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-lg p-8">
                        <div className="flex justify-center mb-6">
                            <Eye className="w-16 h-16 text-indigo-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Focus Detective</h1>
                        <p className="text-lg text-gray-600 mb-8 text-center">
                            Test your attention and focus by finding the target shapes
                        </p>

                        <div className="bg-indigo-50 rounded-2xl p-6 mb-8">
                            <h3 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                                <Target className="w-6 h-6" />
                                Your Target:
                            </h3>
                            <div className="flex justify-center">
                                <div className="bg-red-400 w-20 h-20 rounded-full"></div>
                            </div>
                            <p className="text-center mt-2 font-semibold text-indigo-700">Red Circles</p>
                        </div>

                        <div className="space-y-6 text-lg text-gray-700">
                            <div className="flex items-start gap-4">
                                <div className="bg-indigo-100 rounded-full p-2 mt-1">
                                    <span className="text-indigo-600 font-bold">1</span>
                                </div>
                                <p>Shapes will appear one at a time on the screen</p>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-indigo-100 rounded-full p-2 mt-1">
                                    <span className="text-indigo-600 font-bold">2</span>
                                </div>
                                <p><strong>Click ONLY on red circles</strong> - ignore everything else</p>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-indigo-100 rounded-full p-2 mt-1">
                                    <span className="text-indigo-600 font-bold">3</span>
                                </div>
                                <p>Click as quickly and accurately as possible</p>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-indigo-100 rounded-full p-2 mt-1">
                                    <span className="text-indigo-600 font-bold">4</span>
                                </div>
                                <p>Stay focused - the test will measure your attention over time</p>
                            </div>
                        </div>

                        <div className="text-center mt-8">
                            <button
                                onClick={startGame}
                                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl text-xl font-semibold flex items-center justify-center gap-3 mx-auto transition-colors"
                            >
                                <Play className="w-6 h-6" />
                                Start Test!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Countdown phase
    if (gamePhase === 'countdown') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-lg p-8 text-center min-h-96 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">Get Ready!</h2>
                        <div className="text-9xl font-bold text-indigo-500 mb-4">
                            {countdown}
                        </div>
                        <p className="text-xl text-gray-600">Remember: Click only on red circles</p>
                    </div>
                </div>
            </div>
        );
    }

    // Playing/Interval phases
    if (gamePhase === 'playing' || gamePhase === 'interval') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-6">
                        <div className="bg-white rounded-full px-6 py-2 inline-block">
                            <span className="text-lg font-semibold text-indigo-600">
                                Progress: {stimulusIndex} / {GAME_CONFIG.totalStimuli}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-8 min-h-96 flex items-center justify-center">
                        {currentStimulus && gamePhase === 'playing' ? (
                            <div className="flex flex-col items-center gap-4">
                                {getShapeComponent(currentStimulus)}
                                <p className="text-sm text-gray-500">Click only on red circles!</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="w-4 h-4 bg-gray-300 rounded-full mx-auto mb-4"></div>
                                <p className="text-gray-500">Get ready for the next shape...</p>
                            </div>
                        )}
                    </div>

                    {/* Skip Button - Bottom Right */}
                    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-20">
                        <button 
                            onClick={() => window.location.href = '/dashboard/voice'}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm sm:text-base lg:text-lg px-4 sm:px-6 py-3 sm:py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
                        >
                            ⏭️ Skip to Session
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Results phase
    if (gamePhase === 'results' && gameResults) {
        const getScoreColor = (score: number) => {
            if (score >= 80) return 'text-green-600 bg-green-100';
            if (score >= 60) return 'text-yellow-600 bg-yellow-100';
            return 'text-red-600 bg-red-100';
        };

        const getPerformanceLevel = (score: number) => {
            if (score >= 80) return 'Excellent';
            if (score >= 60) return 'Good';
            if (score >= 40) return 'Fair';
            return 'Needs Improvement';
        };

        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-lg p-8">
                        <div className="text-center mb-8">
                            <Brain className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                            <h2 className="text-4xl font-bold text-gray-800 mb-2">Assessment Complete!</h2>
                            <p className="text-xl text-gray-600">Your attention and focus results</p>
                        </div>

                        {/* Score Summary */}
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Attention Score</h3>
                                <div className={`text-3xl font-bold mb-2 px-4 py-2 rounded-xl ${getScoreColor(gameResults.attentionScore)}`}>
                                    {gameResults.attentionScore}%
                                </div>
                                <p className="text-sm text-gray-600">{getPerformanceLevel(gameResults.attentionScore)}</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
                                <AlertTriangle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Impulse Control</h3>
                                <div className={`text-3xl font-bold mb-2 px-4 py-2 rounded-xl ${getScoreColor(gameResults.impulseControlScore)}`}>
                                    {gameResults.impulseControlScore}%
                                </div>
                                <p className="text-sm text-gray-600">{getPerformanceLevel(gameResults.impulseControlScore)}</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
                                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Sustained Focus</h3>
                                <div className={`text-3xl font-bold mb-2 px-4 py-2 rounded-xl ${getScoreColor(gameResults.vigilanceScore)}`}>
                                    {gameResults.vigilanceScore}%
                                </div>
                                <p className="text-sm text-gray-600">{getPerformanceLevel(gameResults.vigilanceScore)}</p>
                            </div>
                        </div>

                        {/* Detailed Stats */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Details</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Correct Detections:</span>
                                        <span className="font-semibold text-green-600">{gameResults.hits}/{gameResults.totalTargets}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Missed Targets:</span>
                                        <span className="font-semibold text-red-600">{gameResults.misses}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">False Alarms:</span>
                                        <span className="font-semibold text-orange-600">{gameResults.falseAlarms}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Correct Rejections:</span>
                                        <span className="font-semibold text-blue-600">{gameResults.correctRejections}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Timing Analysis</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Average Reaction Time:</span>
                                        <span className="font-semibold text-indigo-600 flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {Math.round(gameResults.averageReactionTime)}ms
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Responses:</span>
                                        <span className="font-semibold">{gameResults.responses.filter(r => r.userClicked).length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interpretation */}
                        <div className="bg-indigo-50 rounded-2xl p-6 mb-8">
                            <h3 className="text-lg font-semibold text-indigo-800 mb-3">What This Means:</h3>
                            <div className="space-y-2 text-sm text-indigo-700">
                                <p><strong>Attention Score:</strong> Measures your ability to detect targets while avoiding distractors</p>
                                <p><strong>Impulse Control:</strong> Shows how well you resist clicking on non-target items</p>
                                <p><strong>Sustained Focus:</strong> Indicates whether your attention remained consistent throughout the test</p>
                            </div>
                        </div>

                        <div className="flex justify-center gap-6 mt-6">
                            <button
                                onClick={resetGame}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl text-xl font-semibold flex items-center justify-center gap-3 transition-colors"
                            >
                                <RotateCcw className="w-6 h-6" />
                                Take Test Again
                            </button>

                            <button
                                onClick={() => window.location.href = '/session'}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl text-xl font-semibold flex items-center justify-center gap-3 transition-colors"
                            >
                                Next
                                <MoveRight className="w-6 h-6" />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default FocusDetectiveGame;