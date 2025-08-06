"use client"
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RotateCcw, CheckCircle, XCircle, BookOpen, Sparkles, Star, Camera, Video, StopCircle } from "lucide-react";

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

interface StoryPanel {
  id: number;
  image: string;
  correctOrder: number;
  title: string;
}

export default function StoryBuilderGame({ onComplete }: GameProps) {
  const [storyPanels, setStoryPanels] = useState<StoryPanel[]>([]);
  const [userOrder, setUserOrder] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Camera recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showCameraPermission, setShowCameraPermission] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const stories = [
    [
      { id: 1, image: '🌱', correctOrder: 1, title: 'Plant Growth' },
      { id: 2, image: '🌿', correctOrder: 2, title: 'Plant Growth' },
      { id: 3, image: '🌳', correctOrder: 3, title: 'Plant Growth' }
    ],
    [
      { id: 4, image: '🥚', correctOrder: 1, title: 'Chicken Life' },
      { id: 5, image: '🐣', correctOrder: 2, title: 'Chicken Life' },
      { id: 6, image: '🐤', correctOrder: 3, title: 'Chicken Life' },
      { id: 7, image: '🐔', correctOrder: 4, title: 'Chicken Life' },
      { id: 8, image: '🍳', correctOrder: 5, title: 'Chicken Life' }
    ],
    [
      { id: 9, image: '🌧️', correctOrder: 1, title: 'Weather Story' },
      { id: 10, image: '🌈', correctOrder: 2, title: 'Weather Story' },
      { id: 11, image: '☀️', correctOrder: 3, title: 'Weather Story' },
      { id: 12, image: '🌙', correctOrder: 4, title: 'Weather Story' }
    ]
  ];

  useEffect(() => {
    initializeGame();
  }, []);

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

  const initializeGame = () => {
    const storyIndex = Math.floor(Math.random() * stories.length);
    const shuffledStory = [...stories[storyIndex]].sort(() => Math.random() - 0.5);
    setStoryPanels(shuffledStory);
    setUserOrder([]);
    setIsComplete(false);
    setGameCompleted(false);
    setStartTime(Date.now());
    
    // Auto-start recording when game begins
    if (!isRecording) {
      setTimeout(() => {
        startRecording();
      }, 500); // Start recording 0.5 seconds after game starts
    }
  };

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
      formData.append('game_id', 'story_builder_game');
      formData.append('level', '1');
      formData.append('score', userOrder.length.toString());
      formData.append('timestamp', new Date().toISOString());
      
      // Try to send to backend (if endpoint exists)
      try {
        const response = await fetch(`${process.env.BASE_URL}/upload-video`, {
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

  const handlePanelClick = (panelId: number) => {
    if (isComplete || gameCompleted) return;
    
    const newOrder = [...userOrder, panelId];
    setUserOrder(newOrder);

    if (newOrder.length === storyPanels.length) {
      const isCorrect = newOrder.every((id, index) => {
        const panel = storyPanels.find(p => p.id === id);
        return panel?.correctOrder === index + 1;
      });

      // Game completed - stop recording
      console.log('🎮 Game completed - stopping recording...');
      stopRecording();
      setIsComplete(true);
      setGameCompleted(true);

      if (isCorrect) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
        
        const duration = (Date.now() - startTime) / 1000;
        const result: GameResult = {
          gameId: 'story-builder',
          timestamp: new Date().toISOString(),
          duration,
          correctAnswers: storyPanels.length,
          wrongAnswers: 0,
          totalQuestions: storyPanels.length,
          accuracy: 100,
          memoryPower: calculateMemoryPower(100, duration, storyPanels.length),
          cognitiveScore: calculateCognitiveScore(
            calculateMemoryPower(100, duration, storyPanels.length),
            100,
            95
          )
        };
        
        // Send game score to API
        sendGameScore(result);
        
        onComplete(result);
      } else {
        // Wrong order
        const duration = (Date.now() - startTime) / 1000;
        const correctCount = newOrder.filter((id, index) => {
          const panel = storyPanels.find(p => p.id === id);
          return panel?.correctOrder === index + 1;
        }).length;

        const result: GameResult = {
          gameId: 'story-builder',
          timestamp: new Date().toISOString(),
          duration,
          correctAnswers: correctCount,
          wrongAnswers: storyPanels.length - correctCount,
          totalQuestions: storyPanels.length,
          accuracy: (correctCount / storyPanels.length) * 100,
          memoryPower: calculateMemoryPower((correctCount / storyPanels.length) * 100, duration, storyPanels.length),
          cognitiveScore: calculateCognitiveScore(
            calculateMemoryPower((correctCount / storyPanels.length) * 100, duration, storyPanels.length),
            (correctCount / storyPanels.length) * 100,
            80
          )
        };
        
        // Send game score to API
        sendGameScore(result);
        
        onComplete(result);
      }
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

  const sendGameScore = async (result: GameResult) => {
    try {
      // Calculate normalized score out of 10
      const normalizedScore = Math.min(10, Math.max(0, (result.accuracy / 100) * 10));
      
      const scoreData = {
        user_id: "user001",
        game_id: "story_builder_game",
        game_score: normalizedScore
      };

      // Try direct ngrok call with enhanced CORS handling
      const response = await fetch(`${process.env.BASE_URL}/game-score`, {
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
      } else {
        console.warn('⚠️ Ngrok API error:', response.status, response.statusText);
        // Try no-cors mode as fallback
        await tryNoCorsMode(scoreData);
      }
    } catch (error) {
      console.warn('⚠️ CORS/Network error with ngrok:', error);
      // Try no-cors mode as fallback
      const normalizedScore = Math.min(10, Math.max(0, (result.accuracy / 100) * 10));
      const scoreData = {
        user_id: "user001",
        game_id: "story_builder_game",
        game_score: normalizedScore
      };
      await tryNoCorsMode(scoreData);
    }
  };

  const tryNoCorsMode = async (scoreData: any) => {
    try {
      // Fallback: no-cors mode (can't read response but might work)
      const response = await fetch(`${process.env.BASE_URL}/game-score`, {
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

  const getCorrectOrder = () => {
    return storyPanels
      .sort((a, b) => a.correctOrder - b.correctOrder)
      .map(panel => panel.image)
      .join(' → ');
  };

  const getUserOrder = () => {
    return userOrder
      .map(id => storyPanels.find(p => p.id === id)?.image)
      .join(' → ');
  };

  const getStoryTitle = () => {
    return storyPanels[0]?.title || 'Story';
  };

  return (
    <div className="text-center bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 min-h-screen p-6">
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
              📚
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold text-orange-600 mb-2"
            >
              Perfect Story! 🏆
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600"
            >
              You told the story perfectly!
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
          <h3 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-blue-500 mr-2" />
            Story Builder Game
            <BookOpen className="w-8 h-8 text-blue-500 ml-2" />
          </h3>
          <p className="text-xl text-gray-600 mb-4">Arrange the pictures to tell the story!</p>
          
          {/* Story Title */}
          <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
            <div className="text-2xl font-bold text-purple-600">{getStoryTitle()}</div>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-white rounded-full h-4 mb-4 overflow-hidden shadow-inner">
            <motion.div
              className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(userOrder.length / storyPanels.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Story Panels */}
        <motion.div 
          className="grid grid-cols-5 gap-4 max-w-2xl mx-auto mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {storyPanels.map((panel, index) => (
            <motion.button
              key={panel.id}
              className={`w-20 h-20 rounded-3xl shadow-xl flex items-center justify-center text-3xl bg-white border-4 ${
                userOrder.includes(panel.id) 
                  ? 'border-green-400 shadow-2xl scale-105' 
                  : 'border-orange-300 hover:border-orange-400 hover:scale-105 cursor-pointer'
              }`}
              onClick={() => handlePanelClick(panel.id)}
              whileHover={!userOrder.includes(panel.id) ? { scale: 1.05, y: -3 } : {}}
              whileTap={{ scale: 0.95 }}
              disabled={userOrder.includes(panel.id) || gameCompleted}
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-3xl"
              >
                {panel.image}
              </motion.div>
            </motion.button>
          ))}
        </motion.div>

        {/* User's Story */}
        {userOrder.length > 0 && (
          <motion.div 
            className="mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-purple-200">
              <div className="text-purple-700 font-bold text-lg mb-2 flex items-center justify-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Your Story:
              </div>
              <div className="flex justify-center space-x-2">
                {userOrder.map((panelId, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl mb-1">
                      {storyPanels.find(p => p.id === panelId)?.image}
                    </div>
                    <div className="text-xs font-bold text-gray-600">{index + 1}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Game Status */}
        <motion.div 
          className="mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {gameCompleted ? (
            <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-4">
              <div className="text-green-700 font-bold text-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 mr-2 text-yellow-500" />
                {userOrder.every((id, index) => {
                  const panel = storyPanels.find(p => p.id === id);
                  return panel?.correctOrder === index + 1;
                }) ? (
                  "Perfect! Story is correct!"
                ) : (
                  "Try again! Order is incorrect."
                )}
              </div>
              {isComplete && (
                <div className="mt-2 text-sm text-gray-600">
                  Correct order: {getCorrectOrder()}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-blue-100 border-2 border-blue-300 rounded-2xl p-4">
              <div className="text-blue-700 font-bold text-xl flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="mr-2"
                >
                  📖
                </motion.div>
                Click the pictures in the right order!
              </div>
            </div>
          )}
        </motion.div>

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
              disabled={gameCompleted}
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
          className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-300 mt-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-orange-800 text-sm">
            <div className="font-bold mb-1">💡 How to play:</div>
            <div>1. Look at the pictures carefully</div>
            <div>2. Click them in the right order</div>
            <div>3. Tell the story correctly!</div>
            <div>4. Record your face to review later!</div>
          </div>
        </motion.div>

        {/* Reset Button */}
        <motion.button
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl mt-6 flex items-center space-x-2 mx-auto"
          onClick={initializeGame}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <RotateCcw className="w-5 h-5" />
          <span>New Story</span>
        </motion.button>
      </div>
    </div>
  );
} 