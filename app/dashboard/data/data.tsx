"use client"
import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  EdgeTypes,
  NodeTypes,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Database, 
  Users, 
  Brain, 
  Heart, 
  Gamepad2, 
  Zap, 
  TrendingUp, 
  BarChart3, 
  Target,
  Globe,
  Server,
  Cpu,
  Shield,
  GitBranch,
  Monitor,
  Smartphone,
  Palette,
  Key,
  Link,
  FileText,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  Eye,
  Target as TargetIcon,
  Clock,
  Award
} from 'lucide-react';

interface AnalyticsNode extends Record<string, unknown> {
  id: string;
  type: 'metric' | 'chart' | 'insight' | 'trend';
  name: string;
  value: number | string;
  position: { x: number; y: number };
  color: string;
  icon: string;
  description: string;
  data?: any;
  connections: string[];
}

interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  avgAge: number;
  genderDistribution: { male: number; female: number; other: number };
  topCities: { city: string; count: number }[];
}

interface GameAnalytics {
  totalGames: number;
  avgScore: number;
  topScore: number;
  gameDistribution: { game: string; count: number }[];
  scoreTrends: { date: string; avgScore: number }[];
  levelDistribution: { level: number; count: number }[];
}

interface EmotionAnalytics {
  totalTests: number;
  dominantEmotion: string;
  emotionDistribution: { emotion: string; avgScore: number }[];
  emotionTrends: { date: string; emotion: string; score: number }[];
  correlationWithGames: { emotion: string; gameScore: number }[];
}

interface CognitiveAnalytics {
  avgAttentionLevel: number;
  avgMemoryLevel: number;
  avgBehaviorLevel: number;
  avgProblemSolvingLevel: number;
  levelProgress: { level: number; users: number }[];
  skillCorrelation: { skill: string; correlation: number }[];
}

// Mock analytics data based on your database structure - Updated for children's data
const userAnalytics: UserAnalytics = {
  totalUsers: 2,
  activeUsers: 1,
  newUsers: 2,
  avgAge: 8.5, // Updated for children
  genderDistribution: { male: 118, female: 100, other: 0 },
  topCities: [
    { city: 'Mumbai', count: 28 },
    { city: 'Delhi', count: 25 },
    { city: 'Bangalore', count: 22 },
    { city: 'Chennai', count: 18 },
    { city: 'Hyderabad', count: 15 }
  ]
};

const gameAnalytics: GameAnalytics = {
  totalGames: 221,
  avgScore: 78.5,
  topScore: 95,
  gameDistribution: [
    { game: 'Memory Game', count: 65 },
    { game: 'Attention Game', count: 58 },
    { game: 'Problem Solving', count: 52 },
    { game: 'Behavior Game', count: 46 }
  ],
  scoreTrends: [
    { date: '2024-01', avgScore: 72 },
    { date: '2024-02', avgScore: 75 },
    { date: '2024-03', avgScore: 78 },
    { date: '2024-04', avgScore: 81 },
    { date: '2024-05', avgScore: 78.5 }
  ],
  levelDistribution: [
    { level: 1, count: 45 },
    { level: 2, count: 38 },
    { level: 3, count: 32 },
    { level: 4, count: 28 },
    { level: 5, count: 25 }
  ]
};

const emotionAnalytics: EmotionAnalytics = {
  totalTests: 220,
  dominantEmotion: 'Happy',
  emotionDistribution: [
    { emotion: 'Happy', avgScore: 0.35 },
    { emotion: 'Neutral', avgScore: 0.28 },
    { emotion: 'Sad', avgScore: 0.15 },
    { emotion: 'Angry', avgScore: 0.12 },
    { emotion: 'Fear', avgScore: 0.08 },
    { emotion: 'Surprise', avgScore: 0.02 }
  ],
  emotionTrends: [
    { date: '2024-01', emotion: 'Happy', score: 0.32 },
    { date: '2024-02', emotion: 'Happy', score: 0.34 },
    { date: '2024-03', emotion: 'Happy', score: 0.36 },
    { date: '2024-04', emotion: 'Happy', score: 0.35 },
    { date: '2024-05', emotion: 'Happy', score: 0.35 }
  ],
  correlationWithGames: [
    { emotion: 'Happy', gameScore: 82 },
    { emotion: 'Neutral', gameScore: 75 },
    { emotion: 'Sad', gameScore: 68 },
    { emotion: 'Angry', gameScore: 65 },
    { emotion: 'Fear', gameScore: 62 },
    { emotion: 'Surprise', gameScore: 70 }
  ]
};

const cognitiveAnalytics: CognitiveAnalytics = {
  avgAttentionLevel: 3.2,
  avgMemoryLevel: 2.8,
  avgBehaviorLevel: 3.5,
  avgProblemSolvingLevel: 2.9,
  levelProgress: [
    { level: 1, users: 45 },
    { level: 2, users: 38 },
    { level: 3, users: 32 },
    { level: 4, users: 28 },
    { level: 5, users: 25 }
  ],
  skillCorrelation: [
    { skill: 'Memory', correlation: 0.85 },
    { skill: 'Attention', correlation: 0.78 },
    { skill: 'Problem Solving', correlation: 0.72 },
    { skill: 'Behavior', correlation: 0.68 }
  ]
};

const analyticsData: AnalyticsNode[] = [
  // User Analytics

  {
    id: 'active-users',
    type: 'metric',
    name: 'Active Children',
    value: userAnalytics.activeUsers,
    position: { x: 400, y: 100 },
    color: '#10b981',
    icon: '🟢',
    description: 'Children active in last 30 days',
    connections: ['total-users', 'engagement-rate', 'user-growth']
  },
  {
    id: 'user-growth',
    type: 'trend',
    name: 'Growth Rate',
    value: '+20.6%',
    position: { x: 400, y: 250 },
    color: '#f59e0b',
    icon: '📈',
    description: 'Monthly children growth rate',
    connections: ['total-users', 'new-users', 'performance-insights']
  },

  // Game Analytics
  {
    id: 'total-games',
    type: 'metric',
    name: 'Games Played',
    value: gameAnalytics.totalGames,
    position: { x: 600, y: 100 },
    color: '#8b5cf6',
    icon: '🎮',
    description: 'Total games completed by children',
    connections: ['avg-score', 'game-distribution', 'score-trends']
  },
  {
    id: 'avg-score',
    type: 'metric',
    name: 'Average Score',
    value: gameAnalytics.avgScore,
    position: { x: 800, y: 100 },
    color: '#ef4444',
    icon: '🎯',
    description: 'Average game score across all games',
    connections: ['total-games', 'score-trends', 'performance-insights']
  },
  {
    id: 'score-trends',
    type: 'trend',
    name: 'Score Improvement',
    value: '+8.9%',
    position: { x: 700, y: 250 },
    color: '#06b6d4',
    icon: '📊',
    description: 'Improvement in average scores',
    connections: ['avg-score', 'performance-insights', 'skill-progress']
  },

  // Emotion Analytics
  {
    id: 'dominant-emotion',
    type: 'insight',
    name: 'Dominant Emotion',
    value: emotionAnalytics.dominantEmotion,
    position: { x: 400, y: 400 },
    color: '#f97316',
    icon: '😊',
    description: 'Most common emotion detected',
    connections: ['emotion-tests', 'emotion-correlation', 'performance-insights']
  },
  {
    id: 'emotion-correlation',
    type: 'insight',
    name: 'Emotion-Game Correlation',
    value: '0.78',
    position: { x: 300, y: 550 },
    color: '#84cc16',
    icon: '🔗',
    description: 'Correlation between emotions and game performance',
    connections: ['dominant-emotion', 'performance-insights', 'skill-progress']
  },

  // Cognitive Analytics
  {
    id: 'cognitive-levels',
    type: 'metric',
    name: 'Avg Cognitive Level',
    value: 3.1,
    position: { x: 600, y: 400 },
    color: '#6366f1',
    icon: '🧠',
    description: 'Average cognitive skill level',
    connections: ['memory-level', 'attention-level', 'skill-progress']
  },
  {
    id: 'memory-level',
    type: 'metric',
    name: 'Memory Level',
    value: cognitiveAnalytics.avgMemoryLevel,
    position: { x: 800, y: 400 },
    color: '#14b8a6',
    icon: '💭',
    description: 'Average memory game level',
    connections: ['cognitive-levels', 'skill-progress', 'performance-insights']
  },
  {
    id: 'attention-level',
    type: 'metric',
    name: 'Attention Level',
    value: cognitiveAnalytics.avgAttentionLevel,
    position: { x: 600, y: 550 },
    color: '#fbbf24',
    icon: '👁️',
    description: 'Average attention game level',
    connections: ['cognitive-levels', 'skill-progress']
  },
  {
    id: 'skill-progress',
    type: 'trend',
    name: 'Skill Progress',
    value: '+15.2%',
    position: { x: 700, y: 550 },
    color: '#fbbf24',
    icon: '🚀',
    description: 'Overall skill improvement rate',
    connections: ['cognitive-levels', 'memory-level', 'attention-level', 'performance-insights']
  },

  // Performance Insights
  {
    id: 'performance-insights',
    type: 'insight',
    name: 'Overall Performance',
    value: 'Excellent',
    position: { x: 500, y: 700 },
    color: '#059669',
    icon: '⭐',
    description: 'Overall children performance rating',
    connections: ['score-trends', 'emotion-correlation', 'skill-progress', 'user-growth']
  }
];

interface ConnectionLogic {
  source: string;
  target: string;
  type: 'direct' | 'influence' | 'correlation' | 'dependency' | 'feedback';
  strength: 'strong' | 'medium' | 'weak';
  description: string;
}

// Define logical connections between analytics nodes - Added more random connections
const connectionLogic: ConnectionLogic[] = [
  // User Growth Flow
  { source: 'total-users', target: 'active-users', type: 'direct', strength: 'strong', description: 'Total users directly affects active users' },
  { source: 'new-users', target: 'total-users', type: 'direct', strength: 'strong', description: 'New users increase total users' },
  { source: 'active-users', target: 'user-growth', type: 'influence', strength: 'medium', description: 'Active users influence growth rate' },
  { source: 'new-users', target: 'user-growth', type: 'direct', strength: 'strong', description: 'New users directly affect growth rate' },

  // Game Performance Flow
  { source: 'total-games', target: 'avg-score', type: 'influence', strength: 'medium', description: 'More games provide better score data' },
  { source: 'avg-score', target: 'score-trends', type: 'direct', strength: 'strong', description: 'Average score determines trends' },
  { source: 'score-trends', target: 'performance-insights', type: 'influence', strength: 'strong', description: 'Score trends influence overall performance' },

  // Emotion Analysis Flow
  { source: 'emotion-tests', target: 'dominant-emotion', type: 'direct', strength: 'strong', description: 'More tests provide better emotion data' },
  { source: 'dominant-emotion', target: 'emotion-correlation', type: 'influence', strength: 'medium', description: 'Dominant emotion affects correlation' },
  { source: 'emotion-correlation', target: 'performance-insights', type: 'correlation', strength: 'strong', description: 'Emotion correlation impacts performance' },

  // Cognitive Development Flow
  { source: 'cognitive-levels', target: 'memory-level', type: 'dependency', strength: 'medium', description: 'Cognitive levels depend on memory' },
  { source: 'cognitive-levels', target: 'attention-level', type: 'dependency', strength: 'medium', description: 'Cognitive levels depend on attention' },
  { source: 'memory-level', target: 'skill-progress', type: 'influence', strength: 'strong', description: 'Memory level influences skill progress' },
  { source: 'attention-level', target: 'skill-progress', type: 'influence', strength: 'strong', description: 'Attention level influences skill progress' },
  { source: 'skill-progress', target: 'performance-insights', type: 'direct', strength: 'strong', description: 'Skill progress directly affects performance' },

  // Cross-Domain Connections
  { source: 'active-users', target: 'total-games', type: 'correlation', strength: 'medium', description: 'Active users correlate with games played' },
  { source: 'avg-score', target: 'emotion-correlation', type: 'feedback', strength: 'weak', description: 'Game scores provide feedback for emotions' },
  { source: 'user-growth', target: 'performance-insights', type: 'influence', strength: 'medium', description: 'User growth influences overall performance' },
  { source: 'dominant-emotion', target: 'avg-score', type: 'correlation', strength: 'weak', description: 'Emotions correlate with game scores' },
  { source: 'cognitive-levels', target: 'avg-score', type: 'influence', strength: 'medium', description: 'Cognitive levels influence game scores' },
  { source: 'emotion-tests', target: 'cognitive-levels', type: 'feedback', strength: 'weak', description: 'Emotion tests provide feedback for cognitive assessment' },
  { source: 'total-games', target: 'skill-progress', type: 'influence', strength: 'medium', description: 'More games lead to skill improvement' },
  { source: 'score-trends', target: 'skill-progress', type: 'correlation', strength: 'strong', description: 'Score trends correlate with skill progress' },
  { source: 'emotion-correlation', target: 'skill-progress', type: 'feedback', strength: 'weak', description: 'Emotion correlation provides feedback for skills' },
  { source: 'user-growth', target: 'emotion-tests', type: 'influence', strength: 'weak', description: 'User growth influences emotion testing' },
  { source: 'new-users', target: 'cognitive-levels', type: 'influence', strength: 'weak', description: 'New users affect cognitive level averages' },
  { source: 'active-users', target: 'dominant-emotion', type: 'correlation', strength: 'weak', description: 'Active users correlate with dominant emotions' },
  { source: 'total-users', target: 'emotion-tests', type: 'influence', strength: 'medium', description: 'Total users influence emotion test volume' },
  { source: 'total-games', target: 'dominant-emotion', type: 'feedback', strength: 'weak', description: 'Games provide feedback for emotion analysis' },
  { source: 'avg-score', target: 'cognitive-levels', type: 'correlation', strength: 'medium', description: 'Game scores correlate with cognitive levels' },
  { source: 'emotion-tests', target: 'avg-score', type: 'feedback', strength: 'weak', description: 'Emotion tests provide feedback for game performance' },
  { source: 'memory-level', target: 'avg-score', type: 'influence', strength: 'medium', description: 'Memory level influences game scores' },
  { source: 'attention-level', target: 'avg-score', type: 'influence', strength: 'medium', description: 'Attention level influences game scores' },
  { source: 'user-growth', target: 'total-games', type: 'influence', strength: 'medium', description: 'User growth influences game volume' },
  { source: 'new-users', target: 'emotion-tests', type: 'influence', strength: 'weak', description: 'New users influence emotion test volume' },
  { source: 'active-users', target: 'cognitive-levels', type: 'correlation', strength: 'weak', description: 'Active users correlate with cognitive levels' },
  { source: 'dominant-emotion', target: 'skill-progress', type: 'feedback', strength: 'weak', description: 'Dominant emotions provide feedback for skill development' },
  { source: 'total-users', target: 'cognitive-levels', type: 'influence', strength: 'weak', description: 'Total users influence cognitive level averages' },
  { source: 'emotion-correlation', target: 'score-trends', type: 'correlation', strength: 'medium', description: 'Emotion correlation affects score trends' },
  { source: 'skill-progress', target: 'emotion-correlation', type: 'feedback', strength: 'weak', description: 'Skill progress provides feedback for emotion correlation' },
  { source: 'user-growth', target: 'skill-progress', type: 'influence', strength: 'weak', description: 'User growth influences skill progress' },
  { source: 'new-users', target: 'total-games', type: 'influence', strength: 'weak', description: 'New users influence game volume' },
  { source: 'active-users', target: 'emotion-correlation', type: 'correlation', strength: 'weak', description: 'Active users correlate with emotion-game correlation' },
  { source: 'total-games', target: 'cognitive-levels', type: 'feedback', strength: 'weak', description: 'Games provide feedback for cognitive assessment' },
  { source: 'avg-score', target: 'dominant-emotion', type: 'correlation', strength: 'weak', description: 'Game scores correlate with dominant emotions' },
  { source: 'score-trends', target: 'emotion-correlation', type: 'correlation', strength: 'medium', description: 'Score trends correlate with emotion correlation' },
  { source: 'memory-level', target: 'emotion-correlation', type: 'feedback', strength: 'weak', description: 'Memory level provides feedback for emotion correlation' },
  { source: 'attention-level', target: 'emotion-correlation', type: 'feedback', strength: 'weak', description: 'Attention level provides feedback for emotion correlation' },
  { source: 'user-growth', target: 'dominant-emotion', type: 'influence', strength: 'weak', description: 'User growth influences dominant emotions' },
  { source: 'new-users', target: 'skill-progress', type: 'influence', strength: 'weak', description: 'New users influence skill progress' },
  { source: 'active-users', target: 'skill-progress', type: 'correlation', strength: 'weak', description: 'Active users correlate with skill progress' },
  { source: 'total-users', target: 'score-trends', type: 'influence', strength: 'weak', description: 'Total users influence score trends' },
  { source: 'emotion-tests', target: 'skill-progress', type: 'feedback', strength: 'weak', description: 'Emotion tests provide feedback for skill development' },
  { source: 'dominant-emotion', target: 'cognitive-levels', type: 'correlation', strength: 'weak', description: 'Dominant emotions correlate with cognitive levels' },
  { source: 'emotion-correlation', target: 'user-growth', type: 'feedback', strength: 'weak', description: 'Emotion correlation provides feedback for user growth' },
  { source: 'skill-progress', target: 'user-growth', type: 'feedback', strength: 'weak', description: 'Skill progress provides feedback for user growth' },
  { source: 'performance-insights', target: 'user-growth', type: 'feedback', strength: 'medium', description: 'Performance insights provide feedback for user growth' },
  { source: 'performance-insights', target: 'total-games', type: 'feedback', strength: 'weak', description: 'Performance insights provide feedback for game volume' },
  { source: 'performance-insights', target: 'emotion-tests', type: 'feedback', strength: 'weak', description: 'Performance insights provide feedback for emotion testing' },
  { source: 'performance-insights', target: 'cognitive-levels', type: 'feedback', strength: 'weak', description: 'Performance insights provide feedback for cognitive assessment' },

  // Additional random connections to ensure all blocks are connected
  { source: 'total-users', target: 'total-games', type: 'correlation', strength: 'medium', description: 'Total users correlate with total games' },
  { source: 'total-users', target: 'emotion-tests', type: 'influence', strength: 'medium', description: 'Total users influence emotion test volume' },
  { source: 'total-users', target: 'cognitive-levels', type: 'influence', strength: 'weak', description: 'Total users influence cognitive level averages' },
  { source: 'total-users', target: 'score-trends', type: 'influence', strength: 'weak', description: 'Total users influence score trends' },
  { source: 'total-users', target: 'dominant-emotion', type: 'correlation', strength: 'weak', description: 'Total users correlate with dominant emotions' },
  { source: 'total-users', target: 'skill-progress', type: 'influence', strength: 'weak', description: 'Total users influence skill progress' },
  { source: 'total-users', target: 'emotion-correlation', type: 'feedback', strength: 'weak', description: 'Total users provide feedback for emotion correlation' },
  { source: 'total-users', target: 'performance-insights', type: 'influence', strength: 'medium', description: 'Total users influence overall performance' },
  
  { source: 'active-users', target: 'emotion-tests', type: 'correlation', strength: 'medium', description: 'Active users correlate with emotion tests' },
  { source: 'active-users', target: 'memory-level', type: 'influence', strength: 'weak', description: 'Active users influence memory levels' },
  { source: 'active-users', target: 'attention-level', type: 'influence', strength: 'weak', description: 'Active users influence attention levels' },
  { source: 'active-users', target: 'score-trends', type: 'correlation', strength: 'medium', description: 'Active users correlate with score trends' },
  { source: 'active-users', target: 'performance-insights', type: 'influence', strength: 'medium', description: 'Active users influence performance insights' },
  
  { source: 'new-users', target: 'emotion-tests', type: 'influence', strength: 'weak', description: 'New users influence emotion test volume' },
  { source: 'new-users', target: 'memory-level', type: 'feedback', strength: 'weak', description: 'New users provide feedback for memory levels' },
  { source: 'new-users', target: 'attention-level', type: 'feedback', strength: 'weak', description: 'New users provide feedback for attention levels' },
  { source: 'new-users', target: 'dominant-emotion', type: 'influence', strength: 'weak', description: 'New users influence dominant emotions' },
  { source: 'new-users', target: 'emotion-correlation', type: 'feedback', strength: 'weak', description: 'New users provide feedback for emotion correlation' },
  { source: 'new-users', target: 'performance-insights', type: 'influence', strength: 'weak', description: 'New users influence performance insights' },
  
  { source: 'total-games', target: 'emotion-tests', type: 'correlation', strength: 'medium', description: 'Total games correlate with emotion tests' },
  { source: 'total-games', target: 'memory-level', type: 'influence', strength: 'medium', description: 'Total games influence memory levels' },
  { source: 'total-games', target: 'attention-level', type: 'influence', strength: 'medium', description: 'Total games influence attention levels' },
  { source: 'total-games', target: 'dominant-emotion', type: 'feedback', strength: 'weak', description: 'Total games provide feedback for dominant emotions' },
  { source: 'total-games', target: 'performance-insights', type: 'influence', strength: 'medium', description: 'Total games influence performance insights' },
  
  { source: 'avg-score', target: 'memory-level', type: 'correlation', strength: 'medium', description: 'Average score correlates with memory levels' },
  { source: 'avg-score', target: 'attention-level', type: 'correlation', strength: 'medium', description: 'Average score correlates with attention levels' },
  { source: 'avg-score', target: 'user-growth', type: 'feedback', strength: 'weak', description: 'Average score provides feedback for user growth' },
  { source: 'avg-score', target: 'performance-insights', type: 'influence', strength: 'strong', description: 'Average score influences performance insights' },
  
  { source: 'score-trends', target: 'memory-level', type: 'correlation', strength: 'medium', description: 'Score trends correlate with memory levels' },
  { source: 'score-trends', target: 'attention-level', type: 'correlation', strength: 'medium', description: 'Score trends correlate with attention levels' },
  { source: 'score-trends', target: 'dominant-emotion', type: 'feedback', strength: 'weak', description: 'Score trends provide feedback for dominant emotions' },
  { source: 'score-trends', target: 'user-growth', type: 'feedback', strength: 'weak', description: 'Score trends provide feedback for user growth' },
  
  { source: 'emotion-tests', target: 'memory-level', type: 'correlation', strength: 'weak', description: 'Emotion tests correlate with memory levels' },
  { source: 'emotion-tests', target: 'attention-level', type: 'correlation', strength: 'weak', description: 'Emotion tests correlate with attention levels' },
  { source: 'emotion-tests', target: 'user-growth', type: 'influence', strength: 'weak', description: 'Emotion tests influence user growth' },
  { source: 'emotion-tests', target: 'performance-insights', type: 'influence', strength: 'medium', description: 'Emotion tests influence performance insights' },
  
  { source: 'dominant-emotion', target: 'memory-level', type: 'correlation', strength: 'weak', description: 'Dominant emotion correlates with memory levels' },
  { source: 'dominant-emotion', target: 'attention-level', type: 'correlation', strength: 'weak', description: 'Dominant emotion correlates with attention levels' },
  { source: 'dominant-emotion', target: 'user-growth', type: 'influence', strength: 'weak', description: 'Dominant emotion influences user growth' },
  { source: 'dominant-emotion', target: 'performance-insights', type: 'influence', strength: 'medium', description: 'Dominant emotion influences performance insights' },
  
  { source: 'emotion-correlation', target: 'memory-level', type: 'feedback', strength: 'weak', description: 'Emotion correlation provides feedback for memory levels' },
  { source: 'emotion-correlation', target: 'attention-level', type: 'feedback', strength: 'weak', description: 'Emotion correlation provides feedback for attention levels' },
  { source: 'emotion-correlation', target: 'user-growth', type: 'feedback', strength: 'weak', description: 'Emotion correlation provides feedback for user growth' },
  { source: 'emotion-correlation', target: 'performance-insights', type: 'influence', strength: 'medium', description: 'Emotion correlation influences performance insights' },
  
  { source: 'cognitive-levels', target: 'emotion-tests', type: 'feedback', strength: 'weak', description: 'Cognitive levels provide feedback for emotion tests' },
  { source: 'cognitive-levels', target: 'dominant-emotion', type: 'correlation', strength: 'weak', description: 'Cognitive levels correlate with dominant emotions' },
  { source: 'cognitive-levels', target: 'emotion-correlation', type: 'feedback', strength: 'weak', description: 'Cognitive levels provide feedback for emotion correlation' },
  { source: 'cognitive-levels', target: 'user-growth', type: 'influence', strength: 'weak', description: 'Cognitive levels influence user growth' },
  { source: 'cognitive-levels', target: 'performance-insights', type: 'influence', strength: 'medium', description: 'Cognitive levels influence performance insights' },
  
  { source: 'memory-level', target: 'dominant-emotion', type: 'correlation', strength: 'weak', description: 'Memory level correlates with dominant emotions' },
  { source: 'memory-level', target: 'user-growth', type: 'feedback', strength: 'weak', description: 'Memory level provides feedback for user growth' },
  { source: 'memory-level', target: 'performance-insights', type: 'influence', strength: 'medium', description: 'Memory level influences performance insights' },
  
  { source: 'attention-level', target: 'dominant-emotion', type: 'correlation', strength: 'weak', description: 'Attention level correlates with dominant emotions' },
  { source: 'attention-level', target: 'user-growth', type: 'feedback', strength: 'weak', description: 'Attention level provides feedback for user growth' },
  { source: 'attention-level', target: 'performance-insights', type: 'influence', strength: 'medium', description: 'Attention level influences performance insights' },
  
  { source: 'skill-progress', target: 'dominant-emotion', type: 'feedback', strength: 'weak', description: 'Skill progress provides feedback for dominant emotions' },
  { source: 'skill-progress', target: 'user-growth', type: 'feedback', strength: 'weak', description: 'Skill progress provides feedback for user growth' },
  { source: 'skill-progress', target: 'performance-insights', type: 'influence', strength: 'strong', description: 'Skill progress influences performance insights' },
  
  { source: 'user-growth', target: 'dominant-emotion', type: 'influence', strength: 'weak', description: 'User growth influences dominant emotions' },
  { source: 'user-growth', target: 'performance-insights', type: 'influence', strength: 'medium', description: 'User growth influences performance insights' },
  
  { source: 'performance-insights', target: 'dominant-emotion', type: 'feedback', strength: 'weak', description: 'Performance insights provide feedback for dominant emotions' }
];

const getConnectionStyle = (type: string, strength: string) => {
  const baseStyle = {
    strokeWidth: strength === 'strong' ? 6 : strength === 'medium' ? 5 : 4, // Made thicker
    animated: true,
  };

  switch (type) {
    case 'direct':
      return {
        ...baseStyle,
        stroke: '#000000',
        strokeDasharray: '0',
        strokeDashoffset: '0',
      };
    case 'influence':
      return {
        ...baseStyle,
        stroke: '#000000',
        strokeDasharray: '10,5',
        strokeDashoffset: '0',
      };
    case 'correlation':
      return {
        ...baseStyle,
        stroke: '#000000',
        strokeDasharray: '5,5',
        strokeDashoffset: '0',
      };
    case 'dependency':
      return {
        ...baseStyle,
        stroke: '#000000',
        strokeDasharray: '15,5,5,5',
        strokeDashoffset: '0',
      };
    case 'feedback':
      return {
        ...baseStyle,
        stroke: '#000000',
        strokeDasharray: '3,3',
        strokeDashoffset: '0',
      };
    default:
      return {
        ...baseStyle,
        stroke: '#000000',
        strokeDasharray: '5,5',
        strokeDashoffset: '0',
      };
  }
};

const getConnectionLabel = (type: string) => {
  switch (type) {
    case 'direct': return 'Direct';
    case 'influence': return 'Influences';
    case 'correlation': return 'Correlates';
    case 'dependency': return 'Depends on';
    case 'feedback': return 'Feedback';
    default: return 'Connects';
  }
};

const CustomMetricNode: React.FC<{ data: any }> = ({ data }) => {
  const { name, value, description, icon, color } = data;

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all duration-300 min-w-[200px] p-4 relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
        <div className="text-sm font-medium text-gray-600 mb-2">{name}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
      {/* Connection handles */}
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
    </div>
  );
};

const CustomTrendNode: React.FC<{ data: any }> = ({ data }) => {
  const { name, value, description, icon, color } = data;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg border-2 border-blue-200 hover:shadow-xl transition-all duration-300 min-w-[180px] p-4 relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xl">{icon}</span>
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold text-blue-600 mb-1">{value}</div>
        <div className="text-sm font-medium text-gray-700 mb-2">{name}</div>
        <div className="text-xs text-gray-600">{description}</div>
      </div>
      {/* Connection handles */}
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
    </div>
  );
};

const CustomInsightNode: React.FC<{ data: any }> = ({ data }) => {
  const { name, value, description, icon, color } = data;

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-lg border-2 border-green-200 hover:shadow-xl transition-all duration-300 min-w-[200px] p-4 relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xl">{icon}</span>
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold text-green-600 mb-1">{value}</div>
        <div className="text-sm font-medium text-gray-700 mb-2">{name}</div>
        <div className="text-xs text-gray-600">{description}</div>
      </div>
      {/* Connection handles */}
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  metricNode: CustomMetricNode,
  trendNode: CustomTrendNode,
  insightNode: CustomInsightNode,
};

const AnalyticsVisualization: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showConnectionLabels, setShowConnectionLabels] = useState(false);
  const { fitView } = useReactFlow();

  useEffect(() => {
    createNodesAndEdges();
  }, [selectedCategory, showConnectionLabels]);

  const createNodesAndEdges = useCallback(() => {
    let filteredData = analyticsData;
    
    // Filter by category if selected
    if (selectedCategory) {
      const categoryMap: { [key: string]: string[] } = {
        'users': ['total-users', 'active-users', 'new-users', 'user-growth'],
        'games': ['total-games', 'avg-score', 'score-trends'],
        'emotions': ['emotion-tests', 'dominant-emotion', 'emotion-correlation'],
        'cognitive': ['cognitive-levels', 'memory-level', 'attention-level', 'skill-progress']
      };
      
      const allowedIds = categoryMap[selectedCategory] || [];
      filteredData = analyticsData.filter(item => allowedIds.includes(item.id));
    }

    // Create analytics nodes
    const analyticsNodes: Node[] = filteredData.map((item) => ({
      id: item.id,
      type: `${item.type}Node`,
      position: item.position,
      data: item,
      style: { width: 200 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));

    // Create logical connection edges
    const connectionEdges: Edge[] = [];
    const visibleNodeIds = filteredData.map(node => node.id);

    connectionLogic.forEach((connection) => {
      // Only create edge if both nodes are in filtered data
      if (visibleNodeIds.includes(connection.source) && visibleNodeIds.includes(connection.target)) {
        const existingEdge = connectionEdges.find(
          (edge) => 
            (edge.source === connection.source && edge.target === connection.target) ||
            (edge.source === connection.target && edge.target === connection.source)
        );
        
        if (!existingEdge) {
          const sourceNode = filteredData.find(n => n.id === connection.source);
          const targetNode = filteredData.find(n => n.id === connection.target);
          
          connectionEdges.push({
            id: `${connection.source}-${connection.target}`,
            source: connection.source,
            target: connection.target,
            sourceHandle: 'right',
            targetHandle: 'left',
            type: 'smoothstep',
            ...getConnectionStyle(connection.type, connection.strength),
            label: showConnectionLabels ? `${getConnectionLabel(connection.type)}` : '',
            labelStyle: { 
              fill: '#000000', 
              fontWeight: 600, 
              fontSize: '10px',
              backgroundColor: '#ffffff',
              padding: '2px 4px',
              borderRadius: '4px',
            },
            labelBgStyle: { fill: '#ffffff', fillOpacity: 0.9 },
            data: {
              type: connection.type,
              strength: connection.strength,
              description: connection.description
            }
          });
        }
      }
    });

    setNodes(analyticsNodes);
    setEdges(connectionEdges);
  }, [selectedCategory, showConnectionLabels, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2 });
  }, [fitView]);

  const filterByCategory = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  const toggleConnectionLabels = useCallback(() => {
    setShowConnectionLabels(!showConnectionLabels);
  }, [showConnectionLabels]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-gradient-to-br from-slate-50 to-blue-50"
      >
        <Background color="#94a3b8" gap={20} size={1} />
        <Controls />
        <MiniMap
          nodeColor="#3b82f6"
          nodeStrokeWidth={3}
          zoomable
          pannable
          style={{ backgroundColor: '#ffffff', border: '2px solid #e5e7eb' }}
        />
        
       

        {/* Category Filter Panel */}
        {/* <Panel position="bottom-left" className="bg-white mt-15 p-6 rounded-xl shadow-lg max-w-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <TargetIcon className="w-5 h-5 mr-2  text-blue-600" />
            Analytics Categories
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => filterByCategory('users')}
              className={`w-full px-3 py-2 rounded transition-all text-sm ${
                selectedCategory === 'users' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Children Analytics
            </button>
            <button
              onClick={() => filterByCategory('games')}
              className={`w-full px-3 py-2 rounded transition-all text-sm ${
                selectedCategory === 'games' 
                  ? 'bg-purple-700 text-white' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              <Gamepad2 className="w-4 h-4 inline mr-2" />
              Game Analytics
            </button>
            <button
              onClick={() => filterByCategory('emotions')}
              className={`w-full px-3 py-2 rounded transition-all text-sm ${
                selectedCategory === 'emotions' 
                  ? 'bg-pink-700 text-white' 
                  : 'bg-pink-600 text-white hover:bg-pink-700'
              }`}
            >
              <Heart className="w-4 h-4 inline mr-2" />
              Emotion Analytics
            </button>
            <button
              onClick={() => filterByCategory('cognitive')}
              className={`w-full px-3 py-2 rounded transition-all text-sm ${
                selectedCategory === 'cognitive' 
                  ? 'bg-indigo-700 text-white' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <Brain className="w-4 h-4 inline mr-2" />
              Cognitive Analytics
            </button>
            <button
              onClick={() => filterByCategory(null)}
              className={`w-full px-3 py-2 rounded transition-all text-sm ${
                selectedCategory === null 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <Monitor className="w-4 h-4 inline mr-2" />
              Show All
            </button>
          </div>
        </Panel> */}

      

        {/* Data Summary Panel */}
        
      </ReactFlow>
    </div>
  );
};

const AnalyticsPage: React.FC = () => {
  return (
    <ReactFlowProvider>
      <AnalyticsVisualization />
    </ReactFlowProvider>
  );
};

export default AnalyticsPage;