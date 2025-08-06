"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  Trophy, 
  Medal, 
  Award, 
  Download, 
  Sparkles, 
  Zap, 
  Heart, 
  Target, 
  BookOpen,
  Brain,
  Lightbulb,
  Users,
  Clock,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Gift,
  PartyPopper,
  Rocket,
  Crown,
  Gem,
  Rainbow
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  emoji: string;
}

interface Avatar {
  id: string;
  name: string;
  image: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requiredLevel: number;
  emoji: string;
}

interface Comic {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  downloadUrl: string;
  requiredStars: number;
  unlocked: boolean;
  emoji: string;
}

export default function RewardPage() {
  const [totalStars, setTotalStars] = useState(1250);
  const [currentLevel, setCurrentLevel] = useState(8);
  const [experience, setExperience] = useState(1250);
  const [maxExperience, setMaxExperience] = useState(2000);
  const [selectedAvatar, setSelectedAvatar] = useState('avatar-1');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const badges: Badge[] = [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Complete your first learning session',
      icon: <BookOpen className="h-4 w-4" />,
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      rarity: 'common',
      unlockedAt: new Date('2024-01-15'),
      emoji: '👶'
    },
    {
      id: 'brain-booster',
      name: 'Brain Booster',
      description: 'Complete 10 memory games',
      icon: <Brain className="h-4 w-4" />,
      unlocked: true,
      progress: 10,
      maxProgress: 10,
      rarity: 'common',
      unlockedAt: new Date('2024-01-20'),
      emoji: '🧠'
    },
    {
      id: 'problem-solver',
      name: 'Problem Solver',
      description: 'Solve 25 puzzles',
      icon: <Lightbulb className="h-4 w-4" />,
      unlocked: false,
      progress: 18,
      maxProgress: 25,
      rarity: 'rare',
      emoji: '🧩'
    },
    {
      id: 'social-butterfly',
      name: 'Social Butterfly',
      description: 'Participate in 5 group activities',
      icon: <Users className="h-4 w-4" />,
      unlocked: false,
      progress: 3,
      maxProgress: 5,
      rarity: 'rare',
      emoji: '🦋'
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Complete 5 sessions under 10 minutes',
      icon: <Zap className="h-4 w-4" />,
      unlocked: false,
      progress: 2,
      maxProgress: 5,
      rarity: 'epic',
      emoji: '⚡'
    },
    {
      id: 'dedication',
      name: 'Dedication',
      description: 'Log in for 30 consecutive days',
      icon: <Clock className="h-4 w-4" />,
      unlocked: false,
      progress: 15,
      maxProgress: 30,
      rarity: 'epic',
      emoji: '⏰'
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Achieve 100% accuracy in 10 sessions',
      icon: <CheckCircle className="h-4 w-4" />,
      unlocked: false,
      progress: 7,
      maxProgress: 10,
      rarity: 'legendary',
      emoji: '👑'
    }
  ];

  const avatars: Avatar[] = [
    {
      id: 'avatar-1',
      name: 'Explorer',
      image: '/api/placeholder/64/64',
      unlocked: true,
      rarity: 'common',
      requiredLevel: 1,
      emoji: '🧭'
    },
    {
      id: 'avatar-2',
      name: 'Scholar',
      image: '/api/placeholder/64/64',
      unlocked: true,
      rarity: 'common',
      requiredLevel: 3,
      emoji: '🎓'
    },
    {
      id: 'avatar-3',
      name: 'Wizard',
      image: '/api/placeholder/64/64',
      unlocked: true,
      rarity: 'rare',
      requiredLevel: 5,
      emoji: '🧙‍♂️'
    },
    {
      id: 'avatar-4',
      name: 'Knight',
      image: '/api/placeholder/64/64',
      unlocked: false,
      rarity: 'rare',
      requiredLevel: 7,
      emoji: '⚔️'
    },
    {
      id: 'avatar-5',
      name: 'Dragon',
      image: '/api/placeholder/64/64',
      unlocked: false,
      rarity: 'epic',
      requiredLevel: 10,
      emoji: '🐉'
    },
    {
      id: 'avatar-6',
      name: 'Phoenix',
      image: '/api/placeholder/64/64',
      unlocked: false,
      rarity: 'legendary',
      requiredLevel: 15,
      emoji: '🔥'
    }
  ];

  const comics: Comic[] = [
    {
      id: 'comic-1',
      title: 'The Learning Adventure',
      description: 'Join our hero on an epic journey through knowledge!',
      coverImage: '/api/placeholder/200/300',
      downloadUrl: '/comics/learning-adventure.pdf',
      requiredStars: 100,
      unlocked: true,
      emoji: '📚'
    },
    {
      id: 'comic-2',
      title: 'Memory Masters',
      description: 'Discover the secrets of powerful memory techniques',
      coverImage: '/api/placeholder/200/300',
      downloadUrl: '/comics/memory-masters.pdf',
      requiredStars: 500,
      unlocked: true,
      emoji: '🧠'
    },
    {
      id: 'comic-3',
      title: 'Problem Solving Heroes',
      description: 'Learn to tackle challenges like a true hero',
      coverImage: '/api/placeholder/200/300',
      downloadUrl: '/comics/problem-solving-heroes.pdf',
      requiredStars: 1000,
      unlocked: false,
      emoji: '🦸‍♂️'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-green-50 text-green-700 border-green-200';
      case 'rare': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'epic': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'legendary': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="h-3 w-3" />;
      case 'rare': return <Medal className="h-3 w-3" />;
      case 'epic': return <Trophy className="h-3 w-3" />;
      case 'legendary': return <Crown className="h-3 w-3" />;
      default: return <Star className="h-3 w-3" />;
    }
  };

  const handleDownloadComic = async (comic: Comic) => {
    setIsDownloading(true);
    setDownloadProgress(0);

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setDownloadProgress(0);
          return 0;
        }
        return prev + 10;
      });
    }, 200);

    // Download the specific PDF file
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '/TSEC-SigmaBois-Story.pdf';
      link.download = 'TSEC-SigmaBois-Story.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 2000);
  };

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);
  const unlockedAvatars = avatars.filter(avatar => avatar.unlocked);
  const unlockedComics = comics.filter(comic => comic.unlocked);

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🏆 Rewards Center
          </h1>
          <p className="text-lg text-slate-600">
            Track your progress and unlock amazing rewards!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-slate-800 mb-1">{totalStars}</div>
              <p className="text-sm text-slate-600">Total Stars</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-slate-800 mb-1">{currentLevel}</div>
              <p className="text-sm text-slate-600">Level</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🎖️</div>
              <div className="text-2xl font-bold text-slate-800 mb-1">{unlockedBadges.length}</div>
              <p className="text-sm text-slate-600">Badges</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">👤</div>
              <div className="text-2xl font-bold text-slate-800 mb-1">{unlockedAvatars.length}</div>
              <p className="text-sm text-slate-600">Avatars</p>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <span>Level Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Level {currentLevel}</span>
                <span>{experience} / {maxExperience} XP</span>
              </div>
              <Progress value={(experience / maxExperience) * 100} className="h-3" />
              <p className="text-xs text-slate-500">
                {maxExperience - experience} XP needed for next level
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Medal className="h-6 w-6 text-yellow-500" />
            <span>Badges</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <Card key={badge.id} className={`transition-all duration-200 hover:shadow-md ${
                badge.unlocked ? 'ring-1 ring-green-200' : 'opacity-75'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{badge.emoji}</div>
                      <div>
                        <CardTitle className="text-lg">{badge.name}</CardTitle>
                        <Badge className={`text-xs ${getRarityColor(badge.rarity)}`}>
                          {getRarityIcon(badge.rarity)}
                          <span className="ml-1 capitalize">{badge.rarity}</span>
                        </Badge>
                      </div>
                    </div>
                    {badge.unlocked && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-3">{badge.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{badge.progress} / {badge.maxProgress}</span>
                    </div>
                    <Progress value={(badge.progress / badge.maxProgress) * 100} className="h-2" />
                    {badge.unlocked && badge.unlockedAt && (
                      <p className="text-xs text-green-600">
                        Unlocked on {badge.unlockedAt.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Avatars Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-500" />
            <span>Avatars</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {avatars.map((avatar) => (
              <Card 
                key={avatar.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedAvatar === avatar.id ? 'ring-2 ring-blue-500' : ''
                } ${!avatar.unlocked ? 'opacity-50' : ''}`}
                onClick={() => avatar.unlocked && setSelectedAvatar(avatar.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">
                    {avatar.emoji}
                  </div>
                  <p className="text-sm font-medium text-slate-800">{avatar.name}</p>
                  <Badge className={`text-xs mt-1 ${getRarityColor(avatar.rarity)}`}>
                    {getRarityIcon(avatar.rarity)}
                    <span className="ml-1 capitalize">{avatar.rarity}</span>
                  </Badge>
                  {!avatar.unlocked && (
                    <p className="text-xs text-slate-500 mt-1">
                      Level {avatar.requiredLevel} required
                    </p>
                  )}
                  {selectedAvatar === avatar.id && (
                    <div className="mt-2">
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Comics Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-purple-500" />
            <span>Comic Downloads</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comics.map((comic) => (
              <Card key={comic.id} className={`transition-all duration-200 hover:shadow-md ${
                !comic.unlocked ? 'opacity-75' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="aspect-[2/3] bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-6xl">{comic.emoji}</span>
                  </div>
                  <CardTitle className="text-lg">{comic.title}</CardTitle>
                  <CardDescription>{comic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">
                        {comic.unlocked ? 'Unlocked' : `${comic.requiredStars} stars required`}
                      </span>
                    </div>
                    
                    {comic.unlocked ? (
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        onClick={() => handleDownloadComic(comic)}
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Downloading... {downloadProgress}%</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Download className="h-4 w-4" />
                            <span>Download Comic</span>
                          </div>
                        )}
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        disabled
                      >
                        <Target className="h-4 w-4 mr-2" />
                        Locked
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Download Progress Bar */}
        {isDownloading && (
          <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Downloading Comic...</p>
                <Progress value={downloadProgress} className="w-32 h-2" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
