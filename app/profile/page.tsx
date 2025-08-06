"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, User, Heart, Brain, Puzzle, MessageCircle, Smile, Users, BookOpen, Palette, Activity, HelpCircle, Target, Globe, Clock, Bell, Star, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation'; // Add this at the top of the file


interface OnboardingStep {
  id: number;
  title: string;
  subtitle?: string;
  component: React.ReactNode;
}

interface ChildInfo {
  name: string;
  dateOfBirth: string;
  gender: string;
}

interface UserPreferences {
  challenges: string[];
  goals: string[];
  interests: string[];
  avatar: string;
  accessibility: string[];
  language: string;
  schedule: string[];
  notifications: boolean;
}

const ProgressIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      <div className="flex items-center gap-2 relative">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full relative z-10",
              i < currentStep ? "bg-emerald-500" : "bg-gray-300"
            )}
          />
        ))}
        <motion.div
          initial={{ width: '8px' }}
          animate={{
            width: `${Math.max(8, (currentStep - 1) * 16 + 8)}px`,
          }}
          className="absolute left-0 top-0 h-2 bg-emerald-500 rounded-full"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        />
      </div>
      <span className="ml-4 text-sm text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </span>
    </div>
  );
};

const FamilyIllustration = () => (
  <div className="flex justify-center mb-8">
    <div className="w-48 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
      <div className="text-6xl">👨‍👩‍👧‍👦</div>
    </div>
  </div>
);

const ChildrenPlayingIllustration = () => (
  <div className="flex justify-center mb-8">
    <div className="w-48 h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center">
      <div className="text-6xl">🧒👧🧑</div>
    </div>
  </div>
);

const Screen3ChildInfo = ({ childInfo, setChildInfo }: { childInfo: ChildInfo; setChildInfo: (info: ChildInfo) => void }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const genderOptions = [
    { id: 'boy', label: 'Boy', icon: '👦' },
    { id: 'girl', label: 'Girl', icon: '👧' },
    { id: 'non-binary', label: 'Non-binary', icon: '🌟' },
    { id: 'prefer-not-to-say', label: 'Prefer not to say', icon: '🤷' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto space-y-6"
    >
      <FamilyIllustration />
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Tell Us About Your Amazing Child</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="childName" className="text-sm font-medium">Child's Name/Nickname</Label>
          <Input
            id="childName"
            placeholder="What does your child like to be called?"
            value={childInfo.name}
            onChange={(e) => setChildInfo({ ...childInfo, name: e.target.value })}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">This name will appear throughout the app</p>
        </div>

        <div>
          <Label className="text-sm font-medium">Date of Birth</Label>
          <Button
            variant="outline"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-full mt-1 justify-start"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {childInfo.dateOfBirth || "Select date of birth"}
          </Button>
          {showDatePicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 p-4 border rounded-lg bg-card"
            >
              <Input
                type="date"
                value={childInfo.dateOfBirth}
                onChange={(e) => setChildInfo({ ...childInfo, dateOfBirth: e.target.value })}
              />
            </motion.div>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">Gender (Optional)</Label>
          <div className="grid grid-cols-2 gap-2">
            {genderOptions.map((option) => (
              <Button
                key={option.id}
                variant={childInfo.gender === option.id ? "default" : "outline"}
                onClick={() => setChildInfo({ ...childInfo, gender: option.id })}
                className="h-auto p-3 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">{option.icon}</span>
                <span className="text-xs">{option.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Screen4Challenges = ({ preferences, setPreferences }: { preferences: UserPreferences; setPreferences: (prefs: UserPreferences) => void }) => {
  const challenges = [
    { id: 'attention', label: 'Attention & Focus', icon: '🎯' },
    { id: 'memory', label: 'Memory', icon: '🧠' },
    { id: 'problem-solving', label: 'Problem Solving', icon: '🧩' },
    { id: 'communication', label: 'Communication', icon: '💬' },
    { id: 'emotional', label: 'Emotional Regulation', icon: '😊' },
    { id: 'social', label: 'Social Skills', icon: '👥' },
    { id: 'academic', label: 'Academic Skills', icon: '📚' },
    { id: 'fine-motor', label: 'Fine Motor Skills', icon: '🎨' },
    { id: 'gross-motor', label: 'Gross Motor Skills', icon: '🤸' },
    { id: 'not-sure', label: 'Not Sure', icon: '❓' },
  ];

  const toggleChallenge = (challengeId: string) => {
    const updated = preferences.challenges.includes(challengeId)
      ? preferences.challenges.filter(id => id !== challengeId)
      : [...preferences.challenges, challengeId];
    setPreferences({ ...preferences, challenges: updated });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <ChildrenPlayingIllustration />
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Help Us Understand Your Child's Unique Journey</h2>
        <p className="text-muted-foreground">This information is confidential and helps us personalize the experience</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all",
                preferences.challenges.includes(challenge.id)
                  ? "ring-2 ring-emerald-500 bg-emerald-50"
                  : "hover:bg-muted/50"
              )}
              onClick={() => toggleChallenge(challenge.id)}
            >
              <CardContent className="p-4 flex items-center space-x-3">
                <span className="text-2xl">{challenge.icon}</span>
                <span className="text-sm font-medium">{challenge.label}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Screen5Goals = ({ preferences, setPreferences }: { preferences: UserPreferences; setPreferences: (prefs: UserPreferences) => void }) => {
  const goals = [
    { id: 'academic-improvement', label: 'Academic Improvement', icon: '📈' },
    { id: 'confidence-building', label: 'Confidence Building', icon: '💪' },
    { id: 'social-skills', label: 'Social Skills', icon: '🤝' },
    { id: 'emotional-regulation', label: 'Emotional Regulation', icon: '🧘' },
    { id: 'focus-attention', label: 'Focus & Attention', icon: '🎯' },
    { id: 'creativity', label: 'Creativity', icon: '🎨' },
    { id: 'problem-solving', label: 'Problem Solving', icon: '🧩' },
    { id: 'independence', label: 'Independence', icon: '🌟' },
  ];

  const toggleGoal = (goalId: string) => {
    const updated = preferences.goals.includes(goalId)
      ? preferences.goals.filter(id => id !== goalId)
      : [...preferences.goals, goalId];
    setPreferences({ ...preferences, goals: updated });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">What Are Your Learning Goals?</h2>
        <p className="text-muted-foreground">Select the areas you'd like to focus on</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {goals.map((goal) => (
          <motion.div
            key={goal.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all",
                preferences.goals.includes(goal.id)
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : "hover:bg-muted/50"
              )}
              onClick={() => toggleGoal(goal.id)}
            >
              <CardContent className="p-4 flex items-center space-x-3">
                <span className="text-2xl">{goal.icon}</span>
                <span className="text-sm font-medium">{goal.label}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Screen6Interests = ({ preferences, setPreferences }: { preferences: UserPreferences; setPreferences: (prefs: UserPreferences) => void }) => {
  const interests = [
    { id: 'animals', label: 'Animals', icon: '🐾' },
    { id: 'space', label: 'Space', icon: '🚀' },
    { id: 'art', label: 'Art & Drawing', icon: '🎨' },
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'nature', label: 'Nature', icon: '🌿' },
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'books', label: 'Books & Stories', icon: '📚' },
    { id: 'cooking', label: 'Cooking', icon: '👨‍🍳' },
    { id: 'games', label: 'Games', icon: '🎮' },
  ];

  const toggleInterest = (interestId: string) => {
    const updated = preferences.interests.includes(interestId)
      ? preferences.interests.filter(id => id !== interestId)
      : [...preferences.interests, interestId];
    setPreferences({ ...preferences, interests: updated });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">What Does Your Child Love?</h2>
        <p className="text-muted-foreground">We'll use these interests to make learning more engaging</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {interests.map((interest) => (
          <motion.div
            key={interest.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all",
                preferences.interests.includes(interest.id)
                  ? "ring-2 ring-purple-500 bg-purple-50"
                  : "hover:bg-muted/50"
              )}
              onClick={() => toggleInterest(interest.id)}
            >
              <CardContent className="p-4 flex items-center space-x-3">
                <span className="text-2xl">{interest.icon}</span>
                <span className="text-sm font-medium">{interest.label}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Screen7Avatar = ({ preferences, setPreferences }: { preferences: UserPreferences; setPreferences: (prefs: UserPreferences) => void }) => {
  const avatars = [
    '🦊', '🐱', '🐶', '🐻', '🐼', '🦁', '🐯', '🐸', '🐙', '🦄', '🐲', '🦋'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Choose Your Avatar</h2>
        <p className="text-muted-foreground">Pick a fun character to represent you in the app</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {avatars.map((avatar) => (
          <motion.div
            key={avatar}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={preferences.avatar === avatar ? "default" : "outline"}
              onClick={() => setPreferences({ ...preferences, avatar })}
              className="w-full h-16 text-3xl"
            >
              {avatar}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Screen8Accessibility = ({ preferences, setPreferences }: { preferences: UserPreferences; setPreferences: (prefs: UserPreferences) => void }) => {
  const accessibilityOptions = [
    { id: 'large-text', label: 'Large Text', icon: '🔍' },
    { id: 'high-contrast', label: 'High Contrast', icon: '⚫' },
    { id: 'audio-cues', label: 'Audio Cues', icon: '🔊' },
    { id: 'reduced-motion', label: 'Reduced Motion', icon: '🐌' },
    { id: 'voice-control', label: 'Voice Control', icon: '🎤' },
    { id: 'none', label: 'No Special Needs', icon: '✅' },
  ];

  const toggleAccessibility = (optionId: string) => {
    const updated = preferences.accessibility.includes(optionId)
      ? preferences.accessibility.filter(id => id !== optionId)
      : [...preferences.accessibility, optionId];
    setPreferences({ ...preferences, accessibility: updated });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Accessibility Preferences</h2>
        <p className="text-muted-foreground">Help us make the app comfortable for your child</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {accessibilityOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all",
                preferences.accessibility.includes(option.id)
                  ? "ring-2 ring-orange-500 bg-orange-50"
                  : "hover:bg-muted/50"
              )}
              onClick={() => toggleAccessibility(option.id)}
            >
              <CardContent className="p-4 flex items-center space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Screen9Language = ({ preferences, setPreferences }: { preferences: UserPreferences; setPreferences: (prefs: UserPreferences) => void }) => {
  const languages = [
    { id: 'en', label: 'English', flag: '🇺🇸' },
    { id: 'es', label: 'Spanish', flag: '🇪🇸' },
    { id: 'fr', label: 'French', flag: '🇫🇷' },
    { id: 'de', label: 'German', flag: '🇩🇪' },
    { id: 'it', label: 'Italian', flag: '🇮🇹' },
    { id: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Choose Your Language</h2>
        <p className="text-muted-foreground">Select your preferred language for the app</p>
      </div>

      <div className="space-y-2">
        {languages.map((language) => (
          <motion.div
            key={language.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={preferences.language === language.id ? "default" : "outline"}
              onClick={() => setPreferences({ ...preferences, language: language.id })}
              className="w-full justify-start h-12"
            >
              <span className="text-2xl mr-3">{language.flag}</span>
              {language.label}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Screen10Schedule = ({ preferences, setPreferences }: { preferences: UserPreferences; setPreferences: (prefs: UserPreferences) => void }) => {
  const scheduleOptions = [
    { id: 'morning', label: 'Morning (8-12 PM)', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon (12-5 PM)', icon: '☀️' },
    { id: 'evening', label: 'Evening (5-8 PM)', icon: '🌆' },
    { id: 'weekend', label: 'Weekends', icon: '🎉' },
    { id: 'flexible', label: 'Flexible', icon: '🔄' },
  ];

  const toggleSchedule = (scheduleId: string) => {
    const updated = preferences.schedule.includes(scheduleId)
      ? preferences.schedule.filter(id => id !== scheduleId)
      : [...preferences.schedule, scheduleId];
    setPreferences({ ...preferences, schedule: updated });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">When Do You Learn Best?</h2>
        <p className="text-muted-foreground">Help us suggest the best times for activities</p>
      </div>

      <div className="space-y-3">
        {scheduleOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all",
                preferences.schedule.includes(option.id)
                  ? "ring-2 ring-green-500 bg-green-50"
                  : "hover:bg-muted/50"
              )}
              onClick={() => toggleSchedule(option.id)}
            >
              <CardContent className="p-4 flex items-center space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Screen11Expectations = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Goals & Expectations</h2>
        <p className="text-muted-foreground">Here's what you can expect from our program</p>
      </div>

      <div className="grid gap-4">
        {[
          { icon: '🎯', title: 'Personalized Learning', desc: 'Activities tailored to your child\'s needs and interests' },
          { icon: '📈', title: 'Progress Tracking', desc: 'Monitor development with detailed insights and reports' },
          { icon: '🎮', title: 'Fun & Engaging', desc: 'Game-based learning that keeps children motivated' },
          { icon: '👨‍👩‍👧‍👦', title: 'Family Involvement', desc: 'Tools and tips for parents to support learning at home' },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4 flex items-start space-x-4">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Screen12Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Your Dashboard Preview</h2>
        <p className="text-muted-foreground">Here's a sneak peek of what you'll see</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Today's Activities</h3>
            <span className="text-sm text-muted-foreground">3 of 5 complete</span>
          </div>
          
          <div className="space-y-2">
            {[
              { name: 'Memory Game', status: 'complete', icon: '🧠' },
              { name: 'Story Time', status: 'complete', icon: '📚' },
              { name: 'Math Puzzle', status: 'complete', icon: '🔢' },
              { name: 'Art Activity', status: 'pending', icon: '🎨' },
              { name: 'Music Time', status: 'pending', icon: '🎵' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                <span className="text-xl">{activity.icon}</span>
                <span className="flex-1 text-sm">{activity.name}</span>
                {activity.status === 'complete' && <Check className="w-4 h-4 text-green-500" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Screen13Notifications = ({ preferences, setPreferences }: { preferences: UserPreferences; setPreferences: (prefs: UserPreferences) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Stay Connected</h2>
        <p className="text-muted-foreground">Get updates on your child's progress</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-muted-foreground">Daily progress updates and reminders</p>
              </div>
            </div>
            <Button
              variant={preferences.notifications ? "default" : "outline"}
              size="sm"
              onClick={() => setPreferences({ ...preferences, notifications: !preferences.notifications })}
            >
              {preferences.notifications ? "On" : "Off"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        You can change these settings anytime in the app
      </div>
    </motion.div>
  );
};

const Screen14Complete = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto space-y-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto"
      >
        <Check className="w-12 h-12 text-green-600" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">All Set!</h2>
        <p className="text-muted-foreground">
          Your personalized learning journey is ready to begin
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
        <h3 className="font-semibold mb-2">What's Next?</h3>
        <ul className="text-sm text-muted-foreground space-y-1 text-left">
          <li>• Explore your personalized dashboard</li>
          <li>• Start with recommended activities</li>
          <li>• Track progress and celebrate achievements</li>
          <li>• Connect with our support team anytime</li>
        </ul>
      </div>
    </motion.div>
  );
};

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [childInfo, setChildInfo] = useState<ChildInfo>({
    name: '',
    dateOfBirth: '',
    gender: ''
  });
  const [preferences, setPreferences] = useState<UserPreferences>({
    challenges: [],
    goals: [],
    interests: [],
    avatar: '',
    accessibility: [],
    language: 'en',
    schedule: [],
    notifications: true
  });

  const totalSteps = 12;

  const steps: OnboardingStep[] = [
    {
      id: 3,
      title: "Child's Basic Information",
      component: <Screen3ChildInfo childInfo={childInfo} setChildInfo={setChildInfo} />
    },
    {
      id: 4,
      title: "Understanding Your Child's Needs",
      component: <Screen4Challenges preferences={preferences} setPreferences={setPreferences} />
    },
    {
      id: 5,
      title: "Learning Goals",
      component: <Screen5Goals preferences={preferences} setPreferences={setPreferences} />
    },
    {
      id: 6,
      title: "Interests & Hobbies",
      component: <Screen6Interests preferences={preferences} setPreferences={setPreferences} />
    },
    {
      id: 7,
      title: "Avatar Selection",
      component: <Screen7Avatar preferences={preferences} setPreferences={setPreferences} />
    },
    {
      id: 8,
      title: "Accessibility Preferences",
      component: <Screen8Accessibility preferences={preferences} setPreferences={setPreferences} />
    },
    {
      id: 9,
      title: "Language Selection",
      component: <Screen9Language preferences={preferences} setPreferences={setPreferences} />
    },
    {
      id: 10,
      title: "Learning Schedule",
      component: <Screen10Schedule preferences={preferences} setPreferences={setPreferences} />
    },
    {
      id: 11,
      title: "Goals & Expectations",
      component: <Screen11Expectations />
    },
    {
      id: 12,
      title: "Dashboard Overview",
      component: <Screen12Dashboard />
    },
    {
      id: 13,
      title: "Notification Preferences",
      component: <Screen13Notifications preferences={preferences} setPreferences={setPreferences} />
    },
    {
      id: 14,
      title: "Welcome to Your Journey!",
      component: <Screen14Complete />
    }
  ];


const router = useRouter(); // Add this inside the component OnboardingFlow

const handleNext = () => {
  if (currentStep < totalSteps) {
    setCurrentStep(currentStep + 1);
  } else {
    router.push('/test'); // 👈 Navigate to /test when done
  }
};


  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            {currentStepData.component}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center max-w-md mx-auto">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={false}
            className="flex items-center gap-2"
          >
            {currentStep === totalSteps ? 'Complete' : 'Continue'}
            {currentStep !== totalSteps && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
