"use client";

import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Star, Trophy, Medal, Award, Download, Target, 
  BookOpen, Brain, Users, Clock, CheckCircle, 
  TrendingUp, Activity, FileText, User 
} from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  unlockedAt?: Date;
}

interface ProfileAvatar {
  id: string;
  name: string;
  unlocked: boolean;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  requiredLevel: number;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  downloadUrl: string;
  requiredPoints: number;
  unlocked: boolean;
}

type TabType = "overview" | "achievements" | "profile" | "resources";

interface TabButtonProps {
  tab: TabType;
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: (tab: TabType) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ tab, title, icon, isActive, onClick }) => (
  <Button
    variant={isActive ? "default" : "ghost"}
    onClick={() => onClick(tab)}
    className={`flex items-center space-x-3 px-6 py-4 text-base font-medium rounded-lg ${
      isActive 
        ? "bg-blue-600 text-white shadow-sm" 
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    {icon}
    <span>{title}</span>
  </Button>
);

export default function ProfessionalRewardPage() {
  const [totalPoints] = useState(1250);
  const [currentLevel, setCurrentLevel] = useState(8);
  const [experience, setExperience] = useState(1250);
  const [maxExperience, setMaxExperience] = useState(2000);
  const [selectedAvatar, setSelectedAvatar] = useState("avatar-1");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const achievements: Achievement[] = [
    {
      id: "getting-started",
      name: "Getting Started",
      description: "Successfully completed your first learning session - a great beginning to your learning journey",
      category: "Learning",
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      level: "Bronze",
      unlockedAt: new Date("2024-01-15"),
    },
    {
      id: "memory-training",
      name: "Memory Training",
      description: "Completed 10 memory enhancement exercises - your cognitive skills are improving",
      category: "Cognitive",
      unlocked: true,
      progress: 10,
      maxProgress: 10,
      level: "Bronze",
      unlockedAt: new Date("2024-01-20"),
    },
    {
      id: "problem-solving",
      name: "Critical Thinking",
      description: "Successfully solved 25 problem-solving exercises - you're developing excellent analytical skills",
      category: "Cognitive",
      unlocked: false,
      progress: 18,
      maxProgress: 25,
      level: "Silver",
    },
    {
      id: "social-engagement",
      name: "Community Participant",
      description: "Actively participated in 5 group learning sessions - connecting and learning with others",
      category: "Social",
      unlocked: false,
      progress: 3,
      maxProgress: 5,
      level: "Silver",
    },
    {
      id: "consistency",
      name: "Dedicated Learner",
      description: "Maintained consistent learning for 30 consecutive days - dedication is the key to growth",
      category: "Dedication",
      unlocked: false,
      progress: 15,
      maxProgress: 30,
      level: "Gold",
    },
    {
      id: "excellence",
      name: "Excellence in Learning",
      description: "Achieved perfect scores in 10 different sessions - demonstrating mastery and attention to detail",
      category: "Performance",
      unlocked: false,
      progress: 7,
      maxProgress: 10,
      level: "Platinum",
    },
    {
      id: "speed-learner",
      name: "Efficient Learner",
      description: "Completed 5 sessions in under 10 minutes each - quick thinking and effective learning",
      category: "Performance",
      unlocked: false,
      progress: 2,
      maxProgress: 5,
      level: "Gold",
    },
    {
      id: "helping-others",
      name: "Mentor",
      description: "Helped 3 other learners with their studies - sharing knowledge benefits everyone",
      category: "Social",
      unlocked: false,
      progress: 1,
      maxProgress: 3,
      level: "Gold",
    },
  ];

  const avatars: ProfileAvatar[] = [
    { id: "avatar-1", name: "Classic Explorer", unlocked: true, level: "Bronze", requiredLevel: 1 },
    { id: "avatar-2", name: "Professional Scholar", unlocked: true, level: "Bronze", requiredLevel: 3 },
    { id: "avatar-3", name: "Distinguished Mentor", unlocked: true, level: "Silver", requiredLevel: 5 },
    { id: "avatar-4", name: "Executive Leader", unlocked: false, level: "Silver", requiredLevel: 7 },
    { id: "avatar-5", name: "Master Educator", unlocked: false, level: "Gold", requiredLevel: 10 },
    { id: "avatar-6", name: "Wisdom Keeper", unlocked: false, level: "Platinum", requiredLevel: 15 },
  ];

  const resources: Resource[] = [
    { id: "guide-1", title: "Memory Enhancement Guide", description: "Comprehensive techniques and exercises...", type: "PDF Guide", downloadUrl: "/guides/memory-enhancement.pdf", requiredPoints: 100, unlocked: true },
    { id: "guide-2", title: "Cognitive Fitness Manual", description: "Evidence-based exercises and strategies...", type: "PDF Manual", downloadUrl: "/guides/cognitive-fitness.pdf", requiredPoints: 500, unlocked: true },
    { id: "guide-3", title: "Advanced Learning Strategies", description: "Advanced techniques for lifelong learning...", type: "PDF Handbook", downloadUrl: "/guides/advanced-learning.pdf", requiredPoints: 1000, unlocked: false },
    { id: "guide-4", title: "Social Learning Companion", description: "Methods for engaging with others...", type: "PDF Guide", downloadUrl: "/guides/social-learning.pdf", requiredPoints: 750, unlocked: false },
    { id: "guide-5", title: "Problem-Solving Mastery", description: "Step-by-step approaches to tackle complex problems...", type: "PDF Manual", downloadUrl: "/guides/problem-solving.pdf", requiredPoints: 1250, unlocked: false },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Bronze": return "bg-orange-50 text-orange-800 border-orange-200";
      case "Silver": return "bg-gray-50 text-gray-800 border-gray-200";
      case "Gold": return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "Platinum": return "bg-purple-50 text-purple-800 border-purple-200";
      default: return "bg-orange-50 text-orange-800 border-orange-200";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Bronze": return <Medal className="h-4 w-4" />;
      case "Silver": return <Award className="h-4 w-4" />;
      case "Gold": return <Trophy className="h-4 w-4" />;
      case "Platinum": return <Star className="h-4 w-4" />;
      default: return <Medal className="h-4 w-4" />;
    }
  };

  const handleDownloadResource = async (resource: Resource) => {
    setIsDownloading(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setDownloadProgress(0);
          return 0;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      const link = document.createElement("a");
      link.href = resource.downloadUrl;
      link.download = resource.title + ".pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 2000);
  };

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const unlockedResources = resources.filter((r) => r.unlocked);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Progress & Achievements</h1>
          <p className="text-xl text-gray-600">Track your learning journey and unlock valuable resources</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <TabButton tab="overview" title="Overview" icon={<TrendingUp className="h-5 w-5" />} isActive={activeTab === "overview"} onClick={setActiveTab} />
          <TabButton tab="achievements" title="Achievements" icon={<Trophy className="h-5 w-5" />} isActive={activeTab === "achievements"} onClick={setActiveTab} />
          <TabButton tab="profile" title="Profile Settings" icon={<User className="h-5 w-5" />} isActive={activeTab === "profile"} onClick={setActiveTab} />
          <TabButton tab="resources" title="Resources" icon={<FileText className="h-5 w-5" />} isActive={activeTab === "resources"} onClick={setActiveTab} />
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Example content */}
            <Card><CardHeader><CardTitle>Overview Tab</CardTitle></CardHeader></Card>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="space-y-8">
            <Card><CardHeader><CardTitle>Achievements Tab</CardTitle></CardHeader></Card>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-8">
            <Card><CardHeader><CardTitle>Profile Tab</CardTitle></CardHeader></Card>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="space-y-8">
            <Card><CardHeader><CardTitle>Resources Tab</CardTitle></CardHeader></Card>
          </div>
        )}
      </div>
    </div>
  );
}
