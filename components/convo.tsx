/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useConversation } from '@11labs/react';
import { Mic, MicOff, Volume2, VolumeX, ChevronUp, ChevronDown, Radio } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import Orb from '@/app/blocks/Backgrounds/Orb/Orb';

export function Conversation() {
  const [volume, setVolume] = useState(0.8);
  const [showVolumeControls, setShowVolumeControls] = useState(false);
  const [messages, setMessages] = useState<{ text: string, type: 'agent' | 'user' }[]>([]);

  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message: any) => {
      console.log('Message:', message);
      if (message.type === 'agent_response' || message.type === 'transcript') {
        const messageType = message.type === 'agent_response' ? 'agent' : 'user';
        const messageText = message.text || message.transcript || '';

        if (messageText.trim()) {
          setMessages(prev => [...prev, { text: messageText, type: messageType }]);
        }
      }
    },
    onError: (error: any) => console.error('Error:', error),
  });

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: 'agent_8601k6b10vhee8rswtne1vp62mb7',
      });
      // Clear previous messages when starting a new conversation
      setMessages([]);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const handleVolumeChange = useCallback(
    async (value: number[]) => {
      const newVolume = value[0];
      setVolume(newVolume);
      if (conversation.status === 'connected') {
        await conversation.setVolume({ volume: newVolume });
      }
    },
    [conversation]
  );

  useEffect(() => {
    // Set initial volume when connected
    if (conversation.status === 'connected') {
      conversation.setVolume({ volume });
    }
  }, [conversation.status, conversation, volume]);

  const getStatusColor = () => {
    switch (conversation.status) {
      case 'connected':
        return 'bg-green-400';
      case 'connecting':
        return 'bg-amber-400';
      case 'disconnected':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusGlow = () => {
    switch (conversation.status) {
      case 'connected':
        return 'rgb(34, 197, 94)';
      case 'connecting':
        return 'rgb(245, 158, 11)';
      case 'disconnected':
        return 'rgb(239, 68, 68)';
      default:
        return 'rgb(156, 163, 175)';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        damping: 25,
        stiffness: 500
      }
    }
  };

return (
  <div style={{ width: '100%', height: '600px', position: 'relative' }}>
    {/* Enhanced Orb as background with pulse animation */}
    <div style={{ position: 'absolute', top: -50, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <Orb
        hoverIntensity={conversation.status === 'connected' ? 0.8 : 0.5}
        rotateOnHover={true}
        hue={conversation.status === 'connected' ? 120 : 0}
        forceHoverState={conversation.status === 'connected'}
      />
    </div>

    {/* Foreground circular UI */}
    <motion.div
      className="relative mx-auto rounded-full flex flex-col items-center justify-center"
      style={{
        width: 480,
        height: 480,
        zIndex: 1,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: `0 0 40px ${getStatusGlow()}88, inset 0 0 30px rgba(255,255,255,0.08)`,
        marginTop: '10px'
      }}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <Card className="bg-transparent border-none shadow-none w-full h-full">
        <CardHeader className="pb-4 pt-6">
          <CardTitle className="flex flex-col items-center text-lg md:text-xl text-center text-black">
            <motion.div
              className="mb-3"
              animate={{ rotate: conversation.status === 'connected' ? 360 : 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <Radio className="w-8 h-8 text-black" />
            </motion.div>

            <span className="font-bold text-foreground tracking-wide mb-3">Voice Assistant</span>

            <div className="flex items-center mt-2 space-x-3">
              <motion.div
                animate={{
                  scale: conversation.status === 'connecting' ? [1, 1.05, 1] : 1,
                  boxShadow: conversation.status === 'connected'
                    ? [`0 0 0px ${getStatusGlow()}`, `0 0 20px ${getStatusGlow()}`, `0 0 0px ${getStatusGlow()}`]
                    : 'none'
                }}
                transition={{
                  scale: { duration: 1, repeat: conversation.status === 'connecting' ? Infinity : 0 },
                  boxShadow: { duration: 2, repeat: Infinity }
                }}
              >
                <Badge variant="outline" className="text-xs font-medium capitalize bg-white/10 backdrop-blur-sm border border-white/30 text-foreground px-3 py-1.5">
                  {conversation.status}
                </Badge>
              </motion.div>

              <motion.div
                className={`w-4 h-4 rounded-full ${getStatusColor()} relative`}
                animate={{
                  boxShadow: [`0 0 0px ${getStatusGlow()}`, `0 0 20px ${getStatusGlow()}`, `0 0 0px ${getStatusGlow()}`]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-black/30"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-2 pb-4 px-6 flex-1">
          <div className="space-y-4 h-full">
            {conversation.status === 'connected' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Alert className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-none rounded-xl">
                  <AlertDescription className="flex items-center justify-between text-foreground text-sm font-medium">
                    {conversation.isSpeaking ? 'Assistant is speaking...' : 'Listening to you...'}
                    <AnimatePresence mode="wait">
                      {conversation.isSpeaking ? (
                        <motion.div
                          key="speaking"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Volume2 className="w-5 h-5 text-foreground" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="listening"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="relative"
                        >
                          <Mic className="w-5 h-5 text-foreground" />
                          <motion.div
                            className="absolute inset-0 rounded-full bg-black"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <div className="space-y-3 max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-black/20 scrollbar-track-transparent pr-2">
              <AnimatePresence initial={false}>
                {messages.length === 0 && conversation.status !== 'connected' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    className="text-center py-8 text-foreground italic text-sm"
                  >
                    Start a conversation to see messages here
                  </motion.div>
                )}

                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={`p-3 rounded-2xl max-w-[85%] text-foreground backdrop-blur-sm ${msg.type === 'agent'
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 ml-auto border border-blue-400/30'
                      : 'bg-white/15 border border-white/20'
                      }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2 pb-6 px-6 border-t border-white/10">
          <div className="flex justify-center gap-4 w-full">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant={conversation.status === 'connected' ? 'secondary' : 'default'}
                onClick={startConversation}
                disabled={conversation.status === 'connected'}
                className={`w-32 transition-all duration-300 ease-in-out font-medium ${
                  conversation.status === 'connected' 
                    ? 'bg-white/10 text-foreground hover:bg-white/10' 
                    : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-foreground shadow-lg hover:shadow-xl'
                }`}
              >
                <Mic className="w-4 h-4 mr-2 text-foreground" />
                <span>Start</span>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="destructive"
                onClick={stopConversation}
                disabled={conversation.status !== 'connected'}
                className={`w-32 transition-all duration-300 ease-in-out font-medium ${
                  conversation.status !== 'connected'
                    ? 'bg-white/10 text-foreground hover:bg-white/10'
                    : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                }`}
              >
                <MicOff className="w-4 h-4 mr-2 text-foreground" />
                <span>Stop</span>
              </Button>
            </motion.div>
          </div>

          <div className="w-full">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVolumeControls(!showVolumeControls)}
                className="w-full flex items-center justify-center text-foreground text-xs hover:text-foreground hover:bg-white/10 transition-all"
              >
                <span>Volume Controls</span>
                <motion.div
                  animate={{ rotate: showVolumeControls ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-2"
                >
                                          <ChevronDown className="w-3 h-3 text-foreground" />
                </motion.div>
              </Button>
            </motion.div>

            <AnimatePresence>
              {showVolumeControls && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-white/10 border-white/20 hover:bg-white/20 text-foreground hover:text-foreground"
                        onClick={() => handleVolumeChange([0])}
                      >
                        <VolumeX className="h-4 w-4 text-foreground" />
                      </Button>
                    </motion.div>
                    
                    <div className="flex-1">
                      <Slider
                        value={[volume]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        className="flex-1 slider-enhanced"
                      />
                    </div>
                    
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-white/10 border-white/20 hover:bg-white/20 text-foreground hover:text-foreground"
                        onClick={() => handleVolumeChange([1])}
                      >
                        <Volume2 className="h-4 w-4 text-foreground" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardFooter>
      </Card>
    </motion.div>

    <style jsx>{`
      .scrollbar-thin {
        scrollbar-width: thin;
      }
      .scrollbar-thin::-webkit-scrollbar {
        width: 4px;
      }
      .scrollbar-thin::-webkit-scrollbar-track {
        background: transparent;
      }
      .scrollbar-thin::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 2px;
      }
      .scrollbar-thin::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0, 0, 0, 0.3);
      }
    `}</style>
  </div>
);

}

export default Conversation;