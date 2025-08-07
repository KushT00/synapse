"use client"
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, CheckCircle, XCircle, Star, Lightbulb, Camera, Video, StopCircle } from "lucide-react";

interface GameResult {
  gameId: string;
  timestamp: string;
  duration: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  accuracy: number;
  memoryPower: number;
  cognitiveScore: number;
}

interface GameProps {
  onComplete: (result: GameResult) => void;
}

// Voice feedback phrases
const correctVoices = [
  "Awesome! You got it right!",
  "Super memory! Let’s go to the next level!",
  "Wow, you’re a memory master!",
  "Great job! You remembered everything!",
  "Yay! That was perfect!"
];
const wrongVoices = [
  "Oops! That wasn’t quite right. Try again!",
  "Oh no! That’s okay, you’ll get it next time!",
  "Almost! Don’t worry, you can do it!",
  "Hmm, not quite. Give it another shot!",
  "Keep trying! You’re getting better!"
];
const hintVoices = [
  (color: string) => `Here’s a hint: The first color is ${color}.`,
  (color: string) => `Let me help you! The sequence starts with ${color}.`,
  (color: string) => `Psst! The first color is ${color}. You can do it!`,
  (color: string) => `Remember, the first color is ${color}.`,
  (color: string) => `Your memory buddy says: Start with ${color}!`
];

function speak(text: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.rate = 1.15;
    utter.pitch = 1.4;
    // Try to use a child-friendly voice if available
    const voices = window.speechSynthesis.getVoices();
    const childVoice = voices.find(v => v.name.toLowerCase().includes('child') || v.name.toLowerCase().includes('kid'));
    if (childVoice) utter.voice = childVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }
}

export default function SequenceRecallGame({ onComplete }: GameProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [gameState, setGameState] = useState<'waiting' | 'showing' | 'input' | 'complete'>('waiting');
  const [currentShowingIndex, setCurrentShowingIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  // Camera recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showCameraPermission, setShowCameraPermission] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Soft, solid colors for kids
  const colors = [
    { bg: 'bg-red-300', name: 'Red' },
    { bg: 'bg-blue-300', name: 'Blue' },
    { bg: 'bg-green-300', name: 'Green' },
    { bg: 'bg-yellow-200', name: 'Yellow' },
    { bg: 'bg-purple-300', name: 'Purple' },
    { bg: 'bg-pink-200', name: 'Pink' }
  ];

  useEffect(() => {
    if (gameState === 'waiting') {
      setGameOver(false);
      generateSequence();
    }
  }, [level]);

  // Handle video element setup
  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      try {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch((error) => {
          console.log('Video play error:', error);
        });
      } catch (error) {
        console.log('Video setup error:', error);
      }
    }
  }, [streamRef.current]);

  // Face recording functions
  const startRecording = async () => {
    try {
      // Stop any existing recording first
      if (mediaRecorderRef.current && isRecording) {
        await stopRecording();
      }
      
      // Request camera for user's face
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
          facingMode: 'user' // Front camera for face
        }, 
        audio: true 
      });
      
      streamRef.current = stream;
      
      // Try MP4 codecs first, then fallbacks
      const codecs = [
        'video/mp4',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/ogg;codecs=theora'
      ];
      
      let mediaRecorder: MediaRecorder | null = null;
      let selectedMimeType = '';
      
      for (const codec of codecs) {
        try {
          if (MediaRecorder.isTypeSupported(codec)) {
            mediaRecorder = new MediaRecorder(stream, { mimeType: codec });
            selectedMimeType = codec;
            console.log('✅ Using codec:', codec);
            break;
          }
        } catch (e) {
          console.warn('⚠️ Codec not supported:', codec);
        }
      }
      
      // Fallback to default if no codec works
      if (!mediaRecorder) {
        mediaRecorder = new MediaRecorder(stream);
        selectedMimeType = 'video/webm';
        console.log('🔄 Using default codec');
      }
      
      mediaRecorderRef.current = mediaRecorder;
      recordingChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordingChunksRef.current, { type: selectedMimeType });
        saveRecordingToBackend(blob);
        stopCameraStream();
      };
      
      // Handle MediaRecorder state changes properly
      mediaRecorder.onstart = () => {
        console.log('✅ MediaRecorder started successfully');
        setIsRecording(true);
        setRecordingTime(0);
        
        // Start recording timer
        recordingTimerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
        setIsRecording(false);
        stopCameraStream();
      };
      
      // Start recording with proper error handling
      try {
        mediaRecorder.start(1000); // Record in 1-second chunks for better control
        console.log('📹 Face recording started with codec:', selectedMimeType);
      } catch (error) {
        console.error('❌ Failed to start MediaRecorder:', error);
        stopCameraStream();
        setShowCameraPermission(true);
      }
    } catch (error) {
      console.error('❌ Failed to start face recording:', error);
      setShowCameraPermission(true);
    }
  };

  const stopRecording = async () => {
    console.log('🛑 Attempting to stop recording...');
    
    // Clear the timer first
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
      console.log('✅ Recording timer cleared');
    }
    
    // Stop the media recorder with proper state checking
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        // Check if recorder is actually recording
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          console.log('✅ MediaRecorder stop requested');
        } else {
          console.log('⚠️ MediaRecorder not in recording state:', mediaRecorderRef.current.state);
        }
      } catch (error) {
        console.error('❌ Error stopping MediaRecorder:', error);
      }
    }
    
    setIsRecording(false);
    
    // Always stop the camera stream
    stopCameraStream();
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      console.log('🛑 Stopping camera stream...');
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('✅ Track stopped:', track.kind);
      });
      streamRef.current = null;
      console.log('✅ Camera stream stopped');
    }
  };

  const saveRecordingToBackend = async (blob: Blob) => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileExtension = blob.type.includes('mp4') ? 'mp4' : 
                           blob.type.includes('ogg') ? 'ogg' : 'webm';
      const filename = `user-face-${timestamp}.${fileExtension}`;
      
      // Create FormData to send to backend
      const formData = new FormData();
      formData.append('video', blob, filename);
      formData.append('user_id', 'user001');
      formData.append('game_id', 'sequence_recall');
      formData.append('level', level.toString());
      formData.append('score', score.toString());
      formData.append('timestamp', new Date().toISOString());
      
             // Try to send to backend (if endpoint exists)
       try {
         const response = await fetch(`http://localhost:8000//upload-and-send-whatsapp`, {
           method: 'POST',
           body: formData
         });
         
         if (response.ok) {
           console.log('✅ Video uploaded to backend:', filename);
           const result = await response.json();
           console.log('📹 Video saved in public folder:', result.filePath);
         } else {
           console.warn('⚠️ Backend upload failed:', response.status, response.statusText);
           // Always save locally as backup
           saveRecordingLocally(blob);
         }
       } catch (error) {
         console.warn('⚠️ Backend endpoint not available, saving locally:', error);
         // Always save locally as backup
         saveRecordingLocally(blob);
       }
      
    } catch (error) {
      console.error('❌ Failed to upload video to backend:', error);
      // Fallback to local storage
      saveRecordingLocally(blob);
    }
  };

  const saveRecordingLocally = (blob: Blob) => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileExtension = blob.type.includes('mp4') ? 'mp4' : 
                           blob.type.includes('ogg') ? 'ogg' : 'webm';
      const filename = `user-face-${timestamp}.${fileExtension}`;
      
      // Create download link for local save
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('📹 Video saved locally:', filename);
      console.log('📊 File size:', (blob.size / 1024 / 1024).toFixed(2), 'MB');
      
    } catch (error) {
      console.error('❌ Failed to save recording locally:', error);
    }
  };

  const generateSequence = () => {
    const length = Math.min(3 + level, 6);
    const newSequence = Array.from({ length }, () => Math.floor(Math.random() * colors.length));
    setSequence(newSequence);
    setGameState('showing');
    showSequence(newSequence);
    
    // Auto-start recording when game begins (shorter duration)
    if (!isRecording && !gameOver) {
      setTimeout(() => {
        startRecording();
      }, 500); // Start recording 0.5 seconds after sequence starts
    }
  };

  const showSequence = async (seq: number[]) => {
    setIsShowing(true);
    for (let i = 0; i < seq.length; i++) {
      setCurrentShowingIndex(i);
      await new Promise(resolve => setTimeout(resolve, 800)); // Faster sequence display
    }
    setIsShowing(false);
    setCurrentShowingIndex(-1);
    setGameState('input');
    speak('Now it’s your turn! Tap the colors in the same order.');
  };

  const handleTileClick = (index: number) => {
    if (gameState !== 'input') return;
    
    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    if (newUserSequence.length === sequence.length) {
      const isCorrect = newUserSequence.every((val, i) => val === sequence[i]);
      const duration = (Date.now() - startTime) / 1000;
      
      if (isCorrect) {
        setShowCelebration(true);
        speak(correctVoices[Math.floor(Math.random() * correctVoices.length)]);
        setTimeout(() => setShowCelebration(false), 2000);
        setScore(score + 10);
        setLevel(level + 1);
        setUserSequence([]);
        setGameState('waiting');
      } else {
        // Game over - stop recording and save to backend
        console.log('🎮 Game over - stopping recording...');
        stopRecording();
        setGameOver(true);
        speak(wrongVoices[Math.floor(Math.random() * wrongVoices.length)]);
        
        // Calculate points based on performance
        const pointsEarned = calculatePoints(score, level, duration);
        
        // Store points in localStorage
        storePoints(pointsEarned);
        
        const result: GameResult = {
          gameId: 'sequence-recall',
          timestamp: new Date().toISOString(),
          duration,
          correctAnswers: score / 10,
          wrongAnswers: 1,
          totalQuestions: Math.floor(score / 10) + 1,
          accuracy: (score / 10) / (Math.floor(score / 10) + 1) * 100,
          memoryPower: calculateMemoryPower((score / 10) / (Math.floor(score / 10) + 1) * 100, duration, level),
          cognitiveScore: calculateCognitiveScore(
            calculateMemoryPower((score / 10) / (Math.floor(score / 10) + 1) * 100, duration, level),
            (score / 10) / (Math.floor(score / 10) + 1) * 100,
            85
          )
        };
        setShowHint(false);
        
        // Send game score to API
        sendGameScore(result);
        
        // Update rocket progress
        const currentCount = parseInt(localStorage.getItem('sequenceRecallCount') || '0');
        localStorage.setItem('sequenceRecallCount', (currentCount + 1).toString());
        
        onComplete(result);
      }
    }
  };

  // Calculate points based on performance
  const calculatePoints = (score: number, level: number, duration: number): number => {
    // Base points for completing the game
    let basePoints = 50;
    
    // Bonus points for higher levels
    const levelBonus = level * 10;
    
    // Speed bonus (faster completion = more points)
    const speedBonus = Math.max(0, Math.floor((60 - duration) * 2));
    
    // Accuracy bonus
    const accuracyBonus = Math.floor((score / 10) * 5);
    
    // Total points
    const totalPoints = basePoints + levelBonus + speedBonus + accuracyBonus;
    
    return Math.max(10, totalPoints); // Minimum 10 points
  };

  // Store points in localStorage
  const storePoints = (pointsEarned: number) => {
    try {
      // Get current points for sequence recall
      const currentPoints = parseInt(localStorage.getItem('sequenceRecallPoints') || '0');
      const newTotalPoints = currentPoints + pointsEarned;
      localStorage.setItem('sequenceRecallPoints', newTotalPoints.toString());
      
      // Update total points across all games
      const totalPoints = parseInt(localStorage.getItem('totalPoints') || '0');
      const newTotal = totalPoints + pointsEarned;
      localStorage.setItem('totalPoints', newTotal.toString());
      
      console.log(`🎯 Points earned: ${pointsEarned} | Total sequence recall points: ${newTotalPoints} | Total points: ${newTotal}`);
    } catch (error) {
      console.error('❌ Failed to store points:', error);
    }
  };

  const handleHint = () => {
    if (gameOver) return;
    setShowHint(true);
    const colorName = colors[sequence[0]].name;
    const phrase = hintVoices[Math.floor(Math.random() * hintVoices.length)](colorName);
    speak(phrase);
    setTimeout(() => setShowHint(false), 3000);
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

  const sendGameScore = async (result: GameResult) => {
    try {
      // Calculate normalized score out of 10
      const normalizedScore = Math.min(10, Math.max(0, (result.accuracy / 100) * 10));
      
      const scoreData = {
        user_id: "user001",
        game_id: "matching_pairs_game",
        game_score: Math.floor(normalizedScore)
      };
      // Try direct ngrok call with enhanced CORS handling
      const response = await fetch(`http://localhost:8000/game-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify(scoreData)
      });
      if (response.ok) {
        console.log('✅ Game score sent successfully to ngrok:', scoreData);
        // Send WhatsApp notification
        await fetch(`http://localhost:8000/upload-and-send-whatsapp`, { method: 'GET' });
        await fetch(`http://localhost:8000/whatsapp-eeg-send`, { method: 'GET' });
        
      } else {
        console.warn('⚠️ Ngrok API error:', response.status, response.statusText);
        // Try no-cors mode as fallback
        await tryNoCorsMode(scoreData);
        // Send WhatsApp notification
        await fetch(`http://localhost:8000/upload-and-send-whatsapp`, { method: 'GET' });
        await fetch(`http://localhost:8000/whatsapp-eeg-send`, { method: 'GET' });

      }
    } catch (error) {
      console.warn('⚠️ CORS/Network error with ngrok:', error);
      // Try no-cors mode as fallback
      const normalizedScore = Math.min(10, Math.max(0, (result.accuracy / 100) * 10));
      const scoreData = {
        user_id: "user001",
        game_id: "matching_pairs_game",
        game_score: normalizedScore
      };
      await tryNoCorsMode(scoreData);
      // Send WhatsApp notification
      await fetch(`http://localhost:8000/upload-and-send-whatsapp`, { method: 'GET' });
      await fetch(`http://localhost:8000/whatsapp-eeg-send`, { method: 'GET' });

    }
};

  const tryNoCorsMode = async (scoreData: any) => {
    try {
      // Fallback: no-cors mode (can't read response but might work)
      const response = await fetch(`http://localhost:8000/game-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors', // This bypasses CORS but we can't read the response
        body: JSON.stringify(scoreData)
      });
      
      console.log('📤 Score sent via no-cors mode (response not readable)');
      
    } catch (error) {
      console.error('❌ All ngrok attempts failed:', error);
    }
    
    // Store locally as backup
    storeScoreLocally(scoreData);
  };

  const storeScoreLocally = (scoreData: any) => {
    try {
      // Store in localStorage as fallback
      const existingScores = JSON.parse(localStorage.getItem('gameScores') || '[]');
      existingScores.push({
        ...scoreData,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('gameScores', JSON.stringify(existingScores));
      console.log('📊 Score stored locally as backup:', scoreData);
    } catch (error) {
      console.error('❌ Failed to store score locally:', error);
    }
  };

  return (
    <div className="text-center bg-white min-h-screen p-6">
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
              🎉
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold text-green-600 mb-2"
            >
              Great job!
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600"
            >
              You remembered perfectly!
            </motion.p>
          </div>
        </motion.div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h3 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Star className="w-8 h-8 text-yellow-400 mr-2" />
            Color Memory Game
            <Star className="w-8 h-8 text-yellow-400 ml-2" />
          </h3>
          <p className="text-xl text-gray-600 mb-4">Remember the colors and repeat them!</p>
          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-4 mb-4 overflow-hidden shadow-inner">
            <motion.div
              className="bg-green-400 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(score / 100) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-center space-x-8 text-lg">
            <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border border-gray-200">
              <span className="text-blue-600 font-bold">Level: </span>
              <span className="text-2xl font-bold text-purple-600">{level}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border border-gray-200">
              <span className="text-green-600 font-bold">Score: </span>
              <span className="text-2xl font-bold text-green-600">{score}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border border-yellow-300">
              <span className="text-yellow-600 font-bold">Points: </span>
              <span className="text-2xl font-bold text-yellow-600">{parseInt(localStorage.getItem('sequenceRecallPoints') || '0')}</span>
            </div>
          </div>
        </motion.div>

        {/* Game Grid */}
        <motion.div 
          className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {colors.slice(0, 6).map((color, index) => (
            <motion.button
              key={index}
              className={`w-20 h-20 rounded-3xl ${color.bg} shadow-xl border-4 border-white ${
                isShowing && currentShowingIndex >= 0 && sequence[currentShowingIndex] === index 
                  ? 'ring-4 ring-yellow-400 scale-125 shadow-2xl' : ''
              } ${
                gameState === 'input' ? 'cursor-pointer transform hover:scale-110' : 'cursor-default'
              }`}
              onClick={() => handleTileClick(index)}
              whileHover={gameState === 'input' ? { scale: 1.1, y: -5 } : {}}
              whileTap={{ scale: 0.95 }}
              disabled={gameState !== 'input'}
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {isShowing && currentShowingIndex >= 0 && sequence[currentShowingIndex] === index && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-3xl"
                >
                  ✨
                </motion.div>
              )}
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
          {gameState === 'showing' && (
            <div className="bg-blue-100 border-2 border-blue-200 rounded-2xl p-4">
              <div className="text-blue-700 font-bold text-xl flex items-center justify-center">
                👀 Watch the colors carefully!
              </div>
            </div>
          )}
          {gameState === 'input' && (
            <div className="bg-green-100 border-2 border-green-200 rounded-2xl p-4">
              <div className="text-green-700 font-bold text-xl flex items-center justify-center">
                🎯 Now repeat the sequence!
              </div>
            </div>
          )}
          {gameOver && (
            <div className="bg-red-100 border-2 border-red-200 rounded-2xl p-4 mt-4">
              <div className="text-red-700 font-bold text-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 mr-2" />
                Game over! You can try again!
              </div>
            </div>
          )}
        </motion.div>

        {/* User Input Display */}
        {userSequence.length > 0 && (
          <motion.div 
            className="mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-purple-200">
              <div className="text-purple-700 font-bold text-lg mb-2">Your sequence:</div>
              <div className="flex justify-center space-x-2">
                {userSequence.map((colorIndex, index) => (
                  <motion.div
                    key={index}
                    className={`w-8 h-8 rounded-full ${colors[colorIndex].bg} border-2 border-white shadow-md`}
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Hint Section */}
        {showHint && !gameOver && (
          <motion.div 
            className="mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <div className="bg-yellow-100 border-2 border-yellow-300 rounded-2xl p-4 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-yellow-500 mr-2" />
              <span className="text-yellow-800 font-bold">Hint: The first color is <span className="underline">{colors[sequence[0]].name}</span></span>
            </div>
          </motion.div>
        )}

        {/* Hint Button */}
        {!gameOver && (
          <motion.button
            className="bg-yellow-300 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl mt-4 flex items-center space-x-2 mx-auto"
            onClick={handleHint}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Lightbulb className="w-5 h-5" />
            <span>Hint</span>
          </motion.button>
        )}

                 {/* Camera Recording Controls */}
         <motion.div 
           className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mt-6"
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.6 }}
         >
           <div className="text-blue-800 text-sm mb-3">
             <div className="font-bold mb-2 flex items-center">
               <Camera className="w-4 h-4 mr-2" />
               Record Your Face:
             </div>
           </div>
           
           {/* Camera Preview */}
           {streamRef.current && (
             <motion.div 
               className="mb-4 flex justify-center"
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
             >
               <video
                 ref={videoRef}
                 className="w-48 h-36 rounded-lg border-2 border-blue-300 shadow-lg"
                 autoPlay
                 muted
                 playsInline
               />
             </motion.div>
           )}
           
           {!isRecording ? (
             <motion.button
               className="bg-green-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl flex items-center mx-auto"
               onClick={startRecording}
               whileHover={{ scale: 1.05, y: -2 }}
               whileTap={{ scale: 0.95 }}
               disabled={gameState === 'showing' || gameOver}
             >
               <Video className="w-4 h-4 mr-2" />
               Start Recording
             </motion.button>
           ) : (
             <div className="flex items-center justify-center space-x-4">
               <motion.div
                 className="flex items-center bg-red-500 text-white px-3 py-1 rounded-lg"
                 animate={{ scale: [1, 1.1, 1] }}
                 transition={{ duration: 1, repeat: Infinity }}
               >
                 <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                 Recording: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
               </motion.div>
               <motion.button
                 className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold flex items-center"
                 onClick={stopRecording}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
               >
                 <StopCircle className="w-4 h-4 mr-1" />
                 Stop
               </motion.button>
             </div>
           )}
           
           {showCameraPermission && (
             <motion.div 
               className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg"
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
             >
               <div className="text-yellow-800 text-xs">
                 <div className="font-bold">⚠️ Camera Permission Required</div>
                 <div>Please allow camera access to record your face during gameplay</div>
               </div>
             </motion.div>
           )}
         </motion.div>

        {/* Instructions */}
        <motion.div 
          className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 mt-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-yellow-800 text-sm">
            <div className="font-bold mb-1">💡 How to play:</div>
            <div>1. Watch the colors light up</div>
            <div>2. Remember the order</div>
            <div>3. Click the colors in the same order</div>
                         <div>4. Record your face to review later!</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 