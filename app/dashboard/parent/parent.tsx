"use client"
import React, { useState } from 'react';
import { 
    Heart, 
    Brain, 
    Target, 
    TrendingUp, 
    Calendar, 
    Clock, 
    Star, 
    Award, 
    Users, 
    MessageCircle, 
    ChevronRight, 
    CheckCircle, 
    AlertCircle, 
    BookOpen, 
    Zap,
    Eye,
    Cpu,
    Copy,
    X,
    Link,
    Smile,
    Frown,
    Activity,
    Shield,
    Sun,
    Moon,
    Bell,
    AlertTriangle,
    BarChart3,
    LineChart,
    PieChart,
    Activity as ActivityIcon,
    Timer,
    MapPin,
    Wifi,
    Battery,
    Signal,
    Thermometer,
    Gauge,
    TrendingDown,
    RefreshCw,
    Download,
    Filter,
    Search,
    Settings,
    BellRing,
    Phone,
    Mail,
    Video,
    Headphones,
    Play,
    Pause,
    Square,
    Volume2,
    Mic,
    Camera,
    Monitor,
    Smartphone,
    Tablet,
    Laptop
} from 'lucide-react';

const MentalHealthDashboard = () => {
    const [selectedChild, setSelectedChild] = useState('Satva');
    const [showTherapistLink, setShowTherapistLink] = useState(false);
    const [therapistLink, setTherapistLink] = useState('');
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Comprehensive data for mental health tracking
    const childData = {
        name: selectedChild,
        overallWellness: 78, // Overall mental wellness score
        weeklyImprovement: 8, // Improvement this week
        streak: 5, // Days of consistent mood tracking
        sessionsCompleted: 18,
        totalSessions: 25,
        lastSession: '3 hours ago',
        stressLevel: 3, // 1-5 scale (1 = very low, 5 = very high)
        anxietyLevel: 2, // 1-5 scale
        depressionLevel: 2, // 1-5 scale
        lastLogin: '2 hours ago',
        totalTimeSpent: '24h 35m',
        deviceType: 'Mobile',
        location: 'Home',
        batteryLevel: 85,
        networkStrength: 4
    };

    // EEG Data with detailed metrics
    const eegData = {
        currentSession: {
            alpha: 12.5, // Hz
            beta: 18.3,  // Hz
            theta: 6.8,  // Hz
            delta: 2.1,  // Hz
            gamma: 35.2, // Hz
            timestamp: '2024-01-15 14:30:25'
        },
        averageToday: {
            alpha: 11.8,
            beta: 17.9,
            theta: 7.2,
            delta: 2.3,
            gamma: 34.1
        },
        stressIndicators: {
            highBeta: 22.1, // High beta indicates stress
            thetaBetaRatio: 0.38, // Lower ratio = higher stress
            alphaThetaRatio: 1.74, // Lower ratio = higher stress
            coherence: 0.65 // Brain coherence (0-1)
        },
        alerts: [
            { type: 'high_stress', time: '14:25', level: 'critical', message: 'Stress level exceeded threshold' },
            { type: 'anxiety_spike', time: '13:45', level: 'warning', message: 'Anxiety levels rising' },
            { type: 'attention_low', time: '12:30', level: 'info', message: 'Attention levels below normal' }
        ]
    };

    // Site visit tracking
    const visitData = {
        today: {
            visits: 8,
            totalTime: '2h 15m',
            avgSessionTime: '16m 52s',
            peakHours: ['09:00-10:00', '14:00-15:00', '19:00-20:00']
        },
        thisWeek: {
            visits: 42,
            totalTime: '12h 35m',
            avgSessionTime: '18m 2s',
            mostActiveDay: 'Tuesday'
        },
        deviceBreakdown: [
            { device: 'Mobile', visits: 28, time: '8h 20m', percentage: 66.7 },
            { device: 'Desktop', visits: 12, time: '3h 45m', percentage: 28.6 },
            { device: 'Tablet', visits: 2, time: '30m', percentage: 4.7 }
        ],
        pageViews: [
            { page: 'Dashboard', views: 15, time: '45m' },
            { page: 'Mood Check-in', views: 8, time: '32m' },
            { page: 'Relaxation Exercises', views: 6, time: '28m' },
            { page: 'Progress Report', views: 4, time: '15m' }
        ]
    };

    // Trigger actions for high stress levels
    const triggerActions = [
        { 
            id: 1, 
            trigger: 'Stress Level > 4', 
            action: 'Send notification to parent', 
            status: 'active',
            lastTriggered: '2 hours ago',
            count: 3
        },
        { 
            id: 2, 
            trigger: 'Anxiety Spike Detected', 
            action: 'Start breathing exercise', 
            status: 'active',
            lastTriggered: '1 hour ago',
            count: 1
        },
        { 
            id: 3, 
            trigger: 'EEG Coherence < 0.5', 
            action: 'Alert therapist', 
            status: 'active',
            lastTriggered: 'Never',
            count: 0
        },
        { 
            id: 4, 
            trigger: 'No activity for 2 hours', 
            action: 'Send check-in reminder', 
            status: 'active',
            lastTriggered: '30 minutes ago',
            count: 2
        }
    ];

    const mentalHealthAreas = [
        { name: 'Stress Management', score: 82, level: childData.stressLevel, icon: Shield, color: 'from-orange-400 to-red-500', bgColor: 'bg-orange-50', textColor: 'text-orange-600' },
        { name: 'Anxiety Control', score: 75, level: childData.anxietyLevel, icon: Heart, color: 'from-blue-400 to-indigo-500', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
        { name: 'Mood Stability', score: 88, level: childData.depressionLevel, icon: Smile, color: 'from-green-400 to-emerald-500', bgColor: 'bg-green-50', textColor: 'text-green-600' },
        { name: 'Coping Skills', score: 71, level: 3, icon: Brain, color: 'from-purple-400 to-violet-500', bgColor: 'bg-purple-50', textColor: 'text-purple-600' }
    ];

    const recentAchievements = [
        { title: 'Stress Buster', description: 'Used breathing techniques during high stress', icon: Shield, date: 'Today' },
        { title: 'Mood Booster', description: 'Completed 3 positive activities today', icon: Sun, date: 'Yesterday' },
        { title: 'Anxiety Warrior', description: 'Managed anxiety episode successfully', icon: Heart, date: '2 days ago' }
    ];

    const weeklyGoals = [
        { title: 'Daily mood check-ins', completed: 5, total: 7, color: 'bg-emerald-500' },
        { title: 'Practice relaxation techniques', completed: 4, total: 5, color: 'bg-blue-500' },
        { title: 'Complete stress management exercises', completed: 3, total: 4, color: 'bg-purple-500' }
    ];

    // Generate unique UUID for therapist link
    const generateTherapistLink = () => {
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return `https://synapse.com/therapist/${uuid}`;
    };

    // Handle therapist link creation
    const handleCreateTherapistLink = () => {
        const link = generateTherapistLink();
        setTherapistLink(link);
        setShowTherapistLink(true);
        setCopied(false);
    };

    // Handle copying link to clipboard
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(therapistLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">Parent Dashboard</h1>
                                <p className="text-slate-600">Monitor your child's mental health and wellness journey</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={selectedChild}
                                onChange={(e) => setSelectedChild(e.target.value)}
                                className="px-4 py-2 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white shadow-sm"
                            >
                                <option value="Satva">Satva</option>
                                <option value="Kush">Kush</option>
                            </select>
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Navigation Tabs */}
                    <div className="mt-6">
                        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
                            {[
                                { id: 'overview', label: 'Overview', icon: BarChart3 },
                                { id: 'eeg', label: 'EEG Data', icon: Brain },
                                { id: 'alerts', label: 'Alerts & Triggers', icon: Bell },
                                { id: 'analytics', label: 'Analytics', icon: LineChart },
                                { id: 'visits', label: 'Visit Tracking', icon: ActivityIcon }
                            ].map((tab) => {
                                const IconComponent = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            activeTab === tab.id
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-slate-600 hover:text-slate-800'
                                        }`}
                                    >
                                        <IconComponent className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Key Metrics */}
                        <div className="lg:col-span-2 space-y-6">
                        
                        {/* Overall Wellness Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">How is {childData.name} feeling?</h2>
                                    <p className="text-slate-600">Overall mental wellness this week</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-bold text-slate-800">{childData.overallWellness}%</div>
                                    <div className="flex items-center text-emerald-600 text-sm font-medium">
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                        +{childData.weeklyImprovement}% this week
                                    </div>
                                </div>
                            </div>
                            
                            {/* Progress Circle */}
                            <div className="flex justify-center mb-6">
                                <div className="relative w-32 h-32">
                                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="text-slate-200"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="text-emerald-500"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            fill="none"
                                            strokeDasharray={`${childData.overallWellness}, 100`}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-slate-800">{childData.overallWellness}%</div>
                                            <div className="text-xs text-slate-500">Wellness</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mental Health Levels */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="text-center p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                    <div className="text-2xl font-bold text-orange-600">{childData.stressLevel}/5</div>
                                    <div className="text-sm text-orange-600">Stress Level</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <div className="text-2xl font-bold text-blue-600">{childData.anxietyLevel}/5</div>
                                    <div className="text-sm text-blue-600">Anxiety Level</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-100">
                                    <div className="text-2xl font-bold text-green-600">{childData.depressionLevel}/5</div>
                                    <div className="text-sm text-green-600">Mood Level</div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <div className="text-2xl font-bold text-slate-800">{childData.streak}</div>
                                    <div className="text-sm text-slate-600">Day Streak</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <div className="text-2xl font-bold text-slate-800">{childData.sessionsCompleted}</div>
                                    <div className="text-sm text-slate-600">Sessions Done</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <div className="text-2xl font-bold text-slate-800">{Math.round((childData.sessionsCompleted / childData.totalSessions) * 100)}%</div>
                                    <div className="text-sm text-slate-600">Completion</div>
                                </div>
                            </div>
                        </div>

                        {/* Mental Health Areas Overview */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Mental Health Areas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {mentalHealthAreas.map((area, index) => {
                                    const IconComponent = area.icon;
                                    const getLevelText = (level: number) => {
                                        if (level <= 2) return 'Low';
                                        if (level <= 3) return 'Moderate';
                                        return 'High';
                                    };
                                    const getLevelColor = (level: number) => {
                                        if (level <= 2) return 'text-green-600';
                                        if (level <= 3) return 'text-yellow-600';
                                        return 'text-red-600';
                                    };
                                    
                                    return (
                                        <div key={index} className={`p-6 rounded-2xl ${area.bgColor} border border-slate-100`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-10 h-10 bg-gradient-to-r ${area.color} rounded-xl flex items-center justify-center`}>
                                                        <IconComponent className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-800">{area.name}</h4>
                                                        <p className="text-sm text-slate-600">Current level: <span className={`font-medium ${getLevelColor(area.level)}`}>{getLevelText(area.level)}</span></p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-slate-800">{area.score}%</div>
                                                </div>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-3">
                                                <div 
                                                    className={`bg-gradient-to-r ${area.color} h-3 rounded-full transition-all duration-500`}
                                                    style={{ width: `${area.score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Weekly Mental Health Goals */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">This Week's Wellness Goals</h3>
                            <div className="space-y-4">
                                {weeklyGoals.map((goal, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-3 h-3 rounded-full ${goal.color}`}></div>
                                            <span className="font-medium text-slate-800">{goal.title}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-slate-600">{goal.completed}/{goal.total}</span>
                                            <div className="w-16 bg-slate-200 rounded-full h-2">
                                                <div 
                                                    className={`${goal.color} h-2 rounded-full transition-all duration-500`}
                                                    style={{ width: `${(goal.completed / goal.total) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Insights & Actions */}
                    <div className="space-y-6">
                        
                        {/* Recent Mental Health Achievements */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Wellness Achievements</h3>
                            <div className="space-y-4">
                                {recentAchievements.map((achievement, index) => {
                                    const IconComponent = achievement.icon;
                                    return (
                                        <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl">
                                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <IconComponent className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-slate-800 text-sm">{achievement.title}</h4>
                                                <p className="text-xs text-slate-600">{achievement.description}</p>
                                                <p className="text-xs text-slate-500 mt-1">{achievement.date}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-slate-100 hover:shadow-md transition-all">
                                    <div className="flex items-center space-x-3">
                                        <Heart className="w-5 h-5 text-blue-600" />
                                        <span className="font-medium text-slate-800">Mood Check-in</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </button>
                                
                                <button 
                                    onClick={handleCreateTherapistLink}
                                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-slate-100 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center space-x-3">
                                        <MessageCircle className="w-5 h-5 text-emerald-600" />
                                        <span className="font-medium text-slate-800">Connect with Therapist</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </button>
                                
                                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-slate-100 hover:shadow-md transition-all">
                                    <div className="flex items-center space-x-3">
                                        <Activity className="w-5 h-5 text-purple-600" />
                                        <span className="font-medium text-slate-800">Relaxation Exercises</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </button>
                                
                                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-slate-100 hover:shadow-md transition-all">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="w-5 h-5 text-orange-600" />
                                        <span className="font-medium text-slate-800">View Wellness Report</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Daily Wellness Tip */}
                        <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl p-6 text-white shadow-xl">
                            <div className="flex items-center space-x-3 mb-3">
                                <Heart className="w-6 h-6" />
                                <h3 className="text-lg font-bold">Daily Wellness Tip</h3>
                            </div>
                            <p className="text-sm leading-relaxed">
                                "Deep breathing exercises for just 5 minutes can help reduce stress and anxiety levels significantly."
                            </p>
                        </div>

                        {/* Last Session Info */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Last Session</h3>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">Stress Management</p>
                                    <p className="text-sm text-slate-600">Completed {childData.lastSession}</p>
                                    <p className="text-sm text-emerald-600 font-medium">Mood: Improved</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {/* EEG Data Tab */}
                {activeTab === 'eeg' && (
                    <div className="space-y-6">
                        {/* EEG Real-time Data */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">EEG Real-time Data</h2>
                                <div className="flex items-center space-x-2 text-sm text-slate-600">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span>Live</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-blue-600">Alpha</span>
                                        <Brain className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-blue-800">{eegData.currentSession.alpha} Hz</div>
                                    <div className="text-xs text-blue-600">Relaxed state</div>
                                </div>
                                
                                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-red-600">Beta</span>
                                        <Activity className="w-4 h-4 text-red-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-red-800">{eegData.currentSession.beta} Hz</div>
                                    <div className="text-xs text-red-600">Active thinking</div>
                                </div>
                                
                                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-purple-600">Theta</span>
                                        <Moon className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-purple-800">{eegData.currentSession.theta} Hz</div>
                                    <div className="text-xs text-purple-600">Deep relaxation</div>
                                </div>
                                
                                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-green-600">Delta</span>
                                        <Sun className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-green-800">{eegData.currentSession.delta} Hz</div>
                                    <div className="text-xs text-green-600">Deep sleep</div>
                                </div>
                                
                                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-orange-600">Gamma</span>
                                        <Zap className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-orange-800">{eegData.currentSession.gamma} Hz</div>
                                    <div className="text-xs text-orange-600">High focus</div>
                                </div>
                            </div>

                            {/* Stress Indicators */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Stress Indicators</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">High Beta</span>
                                            <span className="text-lg font-bold text-red-600">{eegData.stressIndicators.highBeta} Hz</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Theta/Beta Ratio</span>
                                            <span className="text-lg font-bold text-orange-600">{eegData.stressIndicators.thetaBetaRatio}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Alpha/Theta Ratio</span>
                                            <span className="text-lg font-bold text-blue-600">{eegData.stressIndicators.alphaThetaRatio}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Brain Coherence</span>
                                            <span className="text-lg font-bold text-green-600">{eegData.stressIndicators.coherence}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Today's Averages</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Alpha</span>
                                            <span className="text-lg font-bold text-blue-600">{eegData.averageToday.alpha} Hz</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Beta</span>
                                            <span className="text-lg font-bold text-red-600">{eegData.averageToday.beta} Hz</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Theta</span>
                                            <span className="text-lg font-bold text-purple-600">{eegData.averageToday.theta} Hz</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Delta</span>
                                            <span className="text-lg font-bold text-green-600">{eegData.averageToday.delta} Hz</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Alerts & Triggers Tab */}
                {activeTab === 'alerts' && (
                    <div className="space-y-6">
                        {/* Current Alerts */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Alerts</h2>
                            <div className="space-y-4">
                                {eegData.alerts.map((alert, index) => (
                                    <div key={index} className={`p-4 rounded-2xl border-l-4 ${
                                        alert.level === 'critical' ? 'bg-red-50 border-red-500' :
                                        alert.level === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                                        'bg-blue-50 border-blue-500'
                                    }`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <AlertTriangle className={`w-5 h-5 ${
                                                    alert.level === 'critical' ? 'text-red-600' :
                                                    alert.level === 'warning' ? 'text-yellow-600' :
                                                    'text-blue-600'
                                                }`} />
                                                <div>
                                                    <p className="font-semibold text-slate-800">{alert.message}</p>
                                                    <p className="text-sm text-slate-600">Time: {alert.time}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                alert.level === 'critical' ? 'bg-red-100 text-red-700' :
                                                alert.level === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {alert.level.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trigger Actions */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Trigger Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {triggerActions.map((trigger) => (
                                    <div key={trigger.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-slate-800">{trigger.trigger}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                trigger.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {trigger.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4">{trigger.action}</p>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">Last triggered: {trigger.lastTriggered}</span>
                                            <span className="text-slate-500">Count: {trigger.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        {/* Detailed Analytics */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Detailed Analytics</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-blue-600">Total Time Spent</span>
                                        <Timer className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-blue-800">{childData.totalTimeSpent}</div>
                                    <div className="text-xs text-blue-600">All time</div>
                                </div>
                                
                                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-green-600">Last Login</span>
                                        <Clock className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-green-800">{childData.lastLogin}</div>
                                    <div className="text-xs text-green-600">Active now</div>
                                </div>
                                
                                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-purple-600">Device Type</span>
                                        <Smartphone className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-purple-800">{childData.deviceType}</div>
                                    <div className="text-xs text-purple-600">Current session</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Device Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Location</span>
                                            <span className="text-sm font-medium text-slate-800">{childData.location}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Battery Level</span>
                                            <div className="flex items-center space-x-2">
                                                <Battery className="w-4 h-4 text-slate-600" />
                                                <span className="text-sm font-medium text-slate-800">{childData.batteryLevel}%</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Network Strength</span>
                                            <div className="flex items-center space-x-2">
                                                <Signal className="w-4 h-4 text-slate-600" />
                                                <span className="text-sm font-medium text-slate-800">{childData.networkStrength}/5</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Session Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Sessions Completed</span>
                                            <span className="text-sm font-medium text-slate-800">{childData.sessionsCompleted}/{childData.totalSessions}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Completion Rate</span>
                                            <span className="text-sm font-medium text-slate-800">{Math.round((childData.sessionsCompleted / childData.totalSessions) * 100)}%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Current Streak</span>
                                            <span className="text-sm font-medium text-slate-800">{childData.streak} days</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Visit Tracking Tab */}
                {activeTab === 'visits' && (
                    <div className="space-y-6">
                        {/* Visit Statistics */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Visit Tracking</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Today's Activity</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                                            <div className="flex items-center space-x-3">
                                                <Calendar className="w-5 h-5 text-blue-600" />
                                                <span className="text-sm font-medium text-slate-800">Total Visits</span>
                                            </div>
                                            <span className="text-xl font-bold text-blue-600">{visitData.today.visits}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
                                            <div className="flex items-center space-x-3">
                                                <Timer className="w-5 h-5 text-green-600" />
                                                <span className="text-sm font-medium text-slate-800">Total Time</span>
                                            </div>
                                            <span className="text-xl font-bold text-green-600">{visitData.today.totalTime}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
                                            <div className="flex items-center space-x-3">
                                                <Clock className="w-5 h-5 text-purple-600" />
                                                <span className="text-sm font-medium text-slate-800">Avg Session</span>
                                            </div>
                                            <span className="text-xl font-bold text-purple-600">{visitData.today.avgSessionTime}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">This Week</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl">
                                            <div className="flex items-center space-x-3">
                                                <BarChart3 className="w-5 h-5 text-orange-600" />
                                                <span className="text-sm font-medium text-slate-800">Total Visits</span>
                                            </div>
                                            <span className="text-xl font-bold text-orange-600">{visitData.thisWeek.visits}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl">
                                            <div className="flex items-center space-x-3">
                                                <Activity className="w-5 h-5 text-indigo-600" />
                                                <span className="text-sm font-medium text-slate-800">Total Time</span>
                                            </div>
                                            <span className="text-xl font-bold text-indigo-600">{visitData.thisWeek.totalTime}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-pink-50 rounded-2xl">
                                            <div className="flex items-center space-x-3">
                                                <Star className="w-5 h-5 text-pink-600" />
                                                <span className="text-sm font-medium text-slate-800">Most Active Day</span>
                                            </div>
                                            <span className="text-xl font-bold text-pink-600">{visitData.thisWeek.mostActiveDay}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Page Views */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Page Views</h3>
                                <div className="space-y-3">
                                    {visitData.pageViews.map((page, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Eye className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">{page.page}</p>
                                                    <p className="text-sm text-slate-600">{page.views} views</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-slate-800">{page.time}</p>
                                                <p className="text-sm text-slate-600">Total time</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Therapist Link Popup Modal */}
            {showTherapistLink && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Therapist Link Generated</h3>
                            <button 
                                onClick={() => setShowTherapistLink(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-xl"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-slate-600 mb-4">
                                Share this secure link with your therapist to give them access to {childData.name}'s progress data:
                            </p>
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-700 font-mono break-all">
                                        {therapistLink}
                                    </span>
                                    <button 
                                        onClick={handleCopyLink}
                                        className={`ml-3 p-2 rounded-xl transition-colors ${
                                            copied 
                                                ? 'bg-emerald-100 text-emerald-600' 
                                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                        }`}
                                        title={copied ? 'Copied!' : 'Copy link'}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button 
                                onClick={() => setShowTherapistLink(false)}
                                className="px-6 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                            >
                                Close
                            </button>
                            <button 
                                onClick={handleCopyLink}
                                className={`px-6 py-2 text-sm rounded-xl transition-colors ${
                                    copied 
                                        ? 'bg-emerald-500 text-white' 
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                            >
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentalHealthDashboard;