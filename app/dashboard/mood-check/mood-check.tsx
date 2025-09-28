"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Smile,
  Frown,
  Meh,
  Brain,
  Activity,
  TrendingUp,
  Calendar,
  CheckCircle,
  Star,
  Target,
  Zap
} from "lucide-react";

interface MoodData {
  overall: number;
  energy: number;
  happiness: number;
  stress: number;
  anxiety: number;
  confidence: number;
  timestamp: string;
}

interface AssessmentResult {
  type: string;
  score: number;
  insights: string[];
  recommendations: string[];
}

export default function MoodCheck() {
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [moodData, setMoodData] = useState<MoodData | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [testProgress, setTestProgress] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Visual Mood Assessment
  const [visualMood, setVisualMood] = useState<number>(0);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");

  // Questionnaire Data
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<number[]>([]);
  const [questionnaireQuestions] = useState([
    "How energetic do you feel today?",
    "How happy do you feel right now?",
    "How stressed do you feel?",
    "How confident do you feel?",
    "How well did you sleep last night?",
    "How social do you feel like being?",
    "How focused do you feel?",
    "How optimistic do you feel about today?"
  ]);

  // Interactive Activities
  const [breathingExercise, setBreathingExercise] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);

  const moodTests = [
    {
      id: "visual",
      title: "😊 Visual Mood Check",
      description: "Choose how you're feeling with emojis",
      icon: "😊",
      color: "bg-gradient-to-br from-yellow-400 to-orange-500"
    },
    {
      id: "questionnaire",
      title: "📝 Quick Questions",
      description: "Answer a few questions about your mood",
      icon: "📝",
      color: "bg-gradient-to-br from-blue-400 to-purple-500"
    },
    {
      id: "breathing",
      title: "🫁 Breathing Exercise",
      description: "Calm your mind with guided breathing",
      icon: "🫁",
      color: "bg-gradient-to-br from-green-400 to-teal-500"
    },
    {
      id: "gratitude",
      title: "🙏 Gratitude Practice",
      description: "Write down things you're grateful for",
      icon: "🙏",
      color: "bg-gradient-to-br from-pink-400 to-red-500"
    }
  ];

  const emojis = [
    { emoji: "😢", value: 1, label: "Very Sad" },
    { emoji: "😔", value: 2, label: "Sad" },
    { emoji: "😐", value: 3, label: "Neutral" },
    { emoji: "🙂", value: 4, label: "Good" },
    { emoji: "😊", value: 5, label: "Happy" },
    { emoji: "😄", value: 6, label: "Very Happy" },
    { emoji: "🤩", value: 7, label: "Excited" },
    { emoji: "😍", value: 8, label: "Amazing" }
  ];

  const handleTestStart = (testId: string) => {
    setCurrentTest(testId);
    setTestProgress(0);
    setCurrentQuestion(0);
    
    if (testId === "questionnaire") {
      setQuestionnaireAnswers(new Array(questionnaireQuestions.length).fill(0));
    }
  };

  const handleVisualMoodSelect = (value: number, emoji: string) => {
    setVisualMood(value);
    setSelectedEmoji(emoji);
    setTestProgress(100);
  };

  const handleQuestionnaireAnswer = (questionIndex: number, value: number) => {
    const newAnswers = [...questionnaireAnswers];
    newAnswers[questionIndex] = value;
    setQuestionnaireAnswers(newAnswers);
    
    if (questionIndex < questionnaireQuestions.length - 1) {
      setCurrentQuestion(questionIndex + 1);
      setTestProgress(((questionIndex + 1) / questionnaireQuestions.length) * 100);
    } else {
      setTestProgress(100);
    }
  };

  const startBreathingExercise = () => {
    setBreathingExercise(true);
    setBreathingCount(0);
    setBreathingPhase('inhale');
    
    const breathingCycle = () => {
      setTimeout(() => setBreathingPhase('hold'), 4000);
      setTimeout(() => setBreathingPhase('exhale'), 6000);
      setTimeout(() => {
        setBreathingCount(prev => prev + 1);
        if (breathingCount < 4) {
          setBreathingPhase('inhale');
          breathingCycle();
        } else {
          setBreathingExercise(false);
          setTestProgress(100);
        }
      }, 10000);
    };
    
    breathingCycle();
  };

  const calculateMoodScore = () => {
    if (currentTest === "visual") {
      return visualMood;
    } else if (currentTest === "questionnaire") {
      const average = questionnaireAnswers.reduce((sum, answer) => sum + answer, 0) / questionnaireAnswers.length;
      return Math.round(average);
    } else if (currentTest === "breathing") {
      return 6; // Breathing exercises generally improve mood
    }
    return 5;
  };

  const completeTest = () => {
    const score = calculateMoodScore();
    const result: AssessmentResult = {
      type: currentTest!,
      score: score,
      insights: generateInsights(score),
      recommendations: generateRecommendations(score)
    };
    
    setAssessmentResults(prev => [...prev, result]);
    setCurrentTest(null);
    setTestProgress(0);
  };

  const generateInsights = (score: number): string[] => {
    if (score >= 6) {
      return ["You're feeling great!", "Your mood is positive", "Keep up the good energy!"];
    } else if (score >= 4) {
      return ["You're doing okay", "Room for improvement", "Try some mood boosters"];
    } else {
      return ["You might be feeling down", "Consider talking to someone", "Take care of yourself"];
    }
  };

  const generateRecommendations = (score: number): string[] => {
    if (score >= 6) {
      return ["Continue your current activities", "Share your positive energy", "Help others feel good"];
    } else if (score >= 4) {
      return ["Try some light exercise", "Listen to uplifting music", "Spend time with friends"];
    } else {
      return ["Take a break and rest", "Try deep breathing exercises", "Consider talking to a trusted person"];
    }
  };

  const getMoodColor = (score: number) => {
    if (score >= 6) return "text-green-600";
    if (score >= 4) return "text-yellow-600";
    return "text-red-600";
  };

  const getMoodLabel = (score: number) => {
    if (score >= 6) return "Great";
    if (score >= 4) return "Okay";
    return "Needs Support";
  };

  if (currentTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-600">{Math.round(testProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${testProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Visual Mood Test */}
            {currentTest === "visual" && (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">How are you feeling right now?</h2>
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {emojis.map((emoji) => (
                    <motion.button
                      key={emoji.value}
                      className={`p-4 rounded-2xl border-4 transition-all ${
                        visualMood === emoji.value
                          ? 'border-blue-500 bg-blue-50 scale-110'
                          : 'border-gray-200 hover:border-blue-300 hover:scale-105'
                      }`}
                      onClick={() => handleVisualMoodSelect(emoji.value, emoji.emoji)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-4xl mb-2">{emoji.emoji}</div>
                      <div className="text-sm font-medium">{emoji.label}</div>
                    </motion.button>
                  ))}
                </div>
                {visualMood > 0 && (
                  <motion.button
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-bold text-lg"
                    onClick={completeTest}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Complete Test ✓
                  </motion.button>
                )}
              </div>
            )}

            {/* Questionnaire Test */}
            {currentTest === "questionnaire" && (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">
                  Question {currentQuestion + 1} of {questionnaireQuestions.length}
                </h2>
                <p className="text-xl mb-8">{questionnaireQuestions[currentQuestion]}</p>
                <div className="grid grid-cols-5 gap-4 mb-8">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <motion.button
                      key={value}
                      className={`p-4 rounded-2xl border-4 transition-all ${
                        questionnaireAnswers[currentQuestion] === value
                          ? 'border-blue-500 bg-blue-50 scale-110'
                          : 'border-gray-200 hover:border-blue-300 hover:scale-105'
                      }`}
                      onClick={() => handleQuestionnaireAnswer(currentQuestion, value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-2xl font-bold">{value}</div>
                      <div className="text-xs">
                        {value === 1 ? 'Not at all' : value === 5 ? 'Very much' : ''}
                      </div>
                    </motion.button>
                  ))}
                </div>
                {testProgress === 100 && (
                  <motion.button
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-bold text-lg"
                    onClick={completeTest}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Complete Test ✓
                  </motion.button>
                )}
              </div>
            )}

            {/* Breathing Exercise */}
            {currentTest === "breathing" && (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">Breathing Exercise</h2>
                {!breathingExercise ? (
                  <div>
                    <p className="text-xl mb-8">Let's do a calming breathing exercise together!</p>
                    <motion.button
                      className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-full font-bold text-lg"
                      onClick={startBreathingExercise}
                      whileHover={{ scale: 1.05 }}
                    >
                      Start Breathing Exercise 🫁
                    </motion.button>
                  </div>
                ) : (
                  <div>
                    <motion.div
                      className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center"
                      animate={{
                        scale: breathingPhase === 'inhale' ? 1.5 : breathingPhase === 'hold' ? 1.5 : 1,
                        opacity: breathingPhase === 'exhale' ? 0.7 : 1
                      }}
                      transition={{ duration: 4 }}
                    >
                      <span className="text-white text-2xl font-bold">
                        {breathingPhase === 'inhale' ? 'Breathe In' : 
                         breathingPhase === 'hold' ? 'Hold' : 'Breathe Out'}
                      </span>
                    </motion.div>
                    <p className="text-xl mb-4">Round {breathingCount + 1} of 5</p>
                    <p className="text-lg text-gray-600">
                      {breathingPhase === 'inhale' ? 'Slowly breathe in for 4 seconds...' :
                       breathingPhase === 'hold' ? 'Hold your breath for 2 seconds...' :
                       'Slowly breathe out for 4 seconds...'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Back Button */}
            <div className="mt-8 text-center">
              <motion.button
                className="bg-gray-500 text-white px-6 py-2 rounded-full font-medium"
                onClick={() => setCurrentTest(null)}
                whileHover={{ scale: 1.05 }}
              >
                ← Back to Tests
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.section
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border-4 border-blue-200"
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
              😊
            </motion.div>
            <motion.h1
              className="text-6xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Mood Check Station
            </motion.h1>
            <motion.p
              className="text-gray-600 text-xl mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Take a moment to check in with yourself and discover how you're feeling!
            </motion.p>
          </div>
        </motion.section>

        {/* Assessment Results */}
        {assessmentResults.length > 0 && (
          <motion.section
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border-4 border-green-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-center mb-6">Your Mood Assessment Results</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessmentResults.map((result, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">
                      {result.type === 'visual' ? '😊' : 
                       result.type === 'questionnaire' ? '📝' : 
                       result.type === 'breathing' ? '🫁' : '🙏'}
                    </div>
                    <h3 className="text-xl font-bold capitalize">{result.type} Test</h3>
                    <div className={`text-2xl font-bold ${getMoodColor(result.score)}`}>
                      {result.score}/8 - {getMoodLabel(result.score)}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Insights:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {result.insights.map((insight, i) => (
                        <li key={i}>• {insight}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Recommendations:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {result.recommendations.map((rec, i) => (
                        <li key={i}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Mood Tests */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h2
            className="text-5xl font-bold text-gray-900 mb-8 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Choose Your Mood Test! 🎯
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, staggerChildren: 0.1 }}
          >
            {moodTests.map((test, index) => (
              <motion.div
                key={test.id}
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 cursor-pointer border-4 border-transparent hover:border-blue-300 hover:shadow-3xl transition-all duration-300"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{
                  y: -15,
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTestStart(test.id)}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{test.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{test.title}</h3>
                  <p className="text-sm text-gray-600 mb-6">{test.description}</p>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-full font-bold text-lg shadow-lg">
                    Start Test! 🚀
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Tips Section */}
        <motion.section
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-yellow-200"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">💡 Mood Boosting Tips</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🏃‍♂️</div>
              <h4 className="font-bold text-lg mb-2">Stay Active</h4>
              <p className="text-gray-600">Even a short walk can boost your mood!</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🎵</div>
              <h4 className="font-bold text-lg mb-2">Listen to Music</h4>
              <p className="text-gray-600">Your favorite songs can lift your spirits!</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🌞</div>
              <h4 className="font-bold text-lg mb-2">Get Sunlight</h4>
              <p className="text-gray-600">Natural light helps regulate your mood!</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">😴</div>
              <h4 className="font-bold text-lg mb-2">Get Enough Sleep</h4>
              <p className="text-gray-600">Good rest is essential for mental health!</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">👥</div>
              <h4 className="font-bold text-lg mb-2">Connect with Others</h4>
              <p className="text-gray-600">Social connections boost happiness!</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🧘‍♀️</div>
              <h4 className="font-bold text-lg mb-2">Practice Mindfulness</h4>
              <p className="text-gray-600">Take time to be present and calm!</p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

