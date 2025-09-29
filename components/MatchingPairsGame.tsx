"use client"
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Camera, Video, StopCircle } from "lucide-react";

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

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MatchingPairsGame({ onComplete }: GameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
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

  const symbols = ['◆','●','■','▲','★','✚'];

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
    const gameSymbols = symbols.slice(0, 6);
    const gameCards = [...gameSymbols, ...gameSymbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        value: symbol,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
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
      formData.append('game_id', 'matching_pairs_game');
      formData.append('level', '1');
      formData.append('score', matches.toString());
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

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || cards[cardId].isFlipped || cards[cardId].isMatched || gameCompleted) return;

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [first, second] = newFlippedCards;
      if (cards[first].value === cards[second].value) {
        // Match found
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setMatches(matches + 1);
        setFlippedCards([]);

        if (matches + 1 === symbols.slice(0, 6).length) {
          // Game completed - stop recording
          console.log('🎮 Game completed - stopping recording...');
          stopRecording();
          setGameCompleted(true);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
          
          const duration = (Date.now() - startTime) / 1000;
          const result: GameResult = {
            gameId: 'matching-pairs',
            timestamp: new Date().toISOString(),
            duration,
            correctAnswers: matches + 1,
            wrongAnswers: moves - (matches + 1),
            totalQuestions: moves,
            accuracy: ((matches + 1) / moves) * 100,
            memoryPower: calculateMemoryPower(((matches + 1) / moves) * 100, duration, 6),
            cognitiveScore: calculateCognitiveScore(
              calculateMemoryPower(((matches + 1) / moves) * 100, duration, 6),
              ((matches + 1) / moves) * 100,
              90
            )
          };
          
          // Send game score to API
          sendGameScore(result);
          
          onComplete(result);
        }
      } else {
        // No match
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
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
        game_id: "matching_pairs_game",
        game_score: normalizedScore
      };
      await tryNoCorsMode(scoreData);
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
    <div className="text-center min-h-screen p-6 bg-[#1a1b3e]">
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
              className="text-3xl font-bold text-green-600 mb-2"
            >
              Fantastic! 🏆
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600"
            >
              You found all the pairs!
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
          <h3 className="text-3xl font-semibold text-white mb-2 flex items-center justify-center">
            Matching Pairs
          </h3>
          <p className="text-base text-slate-300 mb-4">Flip two cards. Match all pairs.</p>
          
          {/* Progress Bar */}
          <div className="bg-[#2d3748] rounded-full h-2 mb-4 overflow-hidden">
            <motion.div
              className="bg-[#10b981] h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(matches / 6) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="flex justify-center space-x-4 text-sm">
            <div className="bg-[#1f2046] border border-[#2d3748] px-4 py-2 rounded-md">
              <span className="text-slate-300">Moves: </span>
              <span className="text-white font-semibold">{moves}</span>
            </div>
            <div className="bg-[#1f2046] border border-[#2d3748] px-4 py-2 rounded-md">
              <span className="text-slate-300">Matches: </span>
              <span className="text-white font-semibold">{matches}/6</span>
            </div>
          </div>
        </motion.div>

        {/* Game Grid */}
        <motion.div 
          className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {cards.map((card, index) => (
            <motion.button
              key={card.id}
              className={`w-20 h-20 rounded-lg flex items-center justify-center text-2xl border ${
                card.isFlipped || card.isMatched 
                  ? 'bg-[#1f2046] border-[#2d3748] text-white' 
                  : 'bg-[#2d3748] border-[#2d3748] text-slate-200 hover:border-[#3b82f6]'
              } ${card.isMatched ? 'ring-2 ring-[#10b981]' : 'cursor-pointer'}`}
              onClick={() => handleCardClick(card.id)}
              whileHover={!card.isMatched ? { scale: 1.03 } : {}}
              whileTap={{ scale: 0.95 }}
              disabled={card.isMatched || gameCompleted}
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {(card.isFlipped || card.isMatched) ? (
                <div className="text-2xl select-none">{card.value}</div>
              ) : (
                <div className="text-lg select-none">•</div>
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
          {gameCompleted ? (
            <div className="border border-[#10b981] bg-[#1f2046] rounded-md p-3 text-[#10b981] text-sm">
              Session complete. All pairs matched.
            </div>
          ) : (
            <div className="border border-[#2d3748] bg-[#1f2046] rounded-md p-3 text-slate-300 text-sm">
              Flip two cards and find all pairs.
            </div>
          )}
        </motion.div>

        {/* Camera Recording Controls */}
        <motion.div 
          className="rounded-md p-4 border border-[#2d3748] mt-6 bg-[#1f2046]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-slate-200 text-sm mb-3">
            <div className="font-medium mb-2 flex items-center">
              <Camera className="w-4 h-4 mr-2" />
              Optional recording
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
                className="w-56 h-40 rounded-md border border-[#2d3748]"
                autoPlay
                muted
                playsInline
              />
            </motion.div>
          )}
          
          {!isRecording ? (
            <motion.button
              className="bg-[#10b981] text-white px-4 py-2 rounded-md font-medium flex items-center mx-auto"
              onClick={startRecording}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              disabled={gameCompleted}
            >
              <Video className="w-4 h-4 mr-2" />
              Start
            </motion.button>
          ) : (
            <div className="flex items-center justify-center space-x-4">
              <motion.div
                className="flex items-center bg-red-600 text-white px-3 py-1 rounded-md"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                Recording: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
              </motion.div>
              <motion.button
                className="bg-red-600 text-white px-3 py-1 rounded-md font-medium flex items-center"
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
              className="mt-3 p-3 bg-[#332] border border-[#553] rounded-md"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <div className="text-amber-200 text-xs">
                <div className="font-medium">Camera permission required</div>
                <div>Allow camera access to enable recording.</div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Instructions */}
        <motion.div 
          className="rounded-md p-4 border border-[#2d3748] mt-6 bg-[#1f2046]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-slate-300 text-sm text-left">
            <div className="font-medium mb-1">How to play</div>
            <div>1. Click on any card to flip it</div>
            <div>2. Find the matching symbol</div>
            <div>3. Match all pairs to complete the session</div>
          </div>
        </motion.div>

        {/* Reset Button */}
        <motion.button
          className="bg-[#3b82f6] text-white px-6 py-3 rounded-md font-medium mt-6 flex items-center space-x-2 mx-auto"
          onClick={initializeGame}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <RotateCcw className="w-5 h-5" />
          <span>Restart</span>
        </motion.button>
      </div>
    </div>
  );
} 