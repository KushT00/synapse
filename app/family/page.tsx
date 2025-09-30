"use client"
import React, { useState, useEffect } from 'react';
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
    Laptop,
    Navigation,
    Home,
    AlertOctagon,
    UserCheck,
    Pill,
    ClipboardList,
    History,
    Navigation2
} from 'lucide-react';

const FamilyDementiaDashboard = () => {
    const [selectedMember, setSelectedMember] = useState('Rajesh Kumar');
    const [showTherapistLink, setShowTherapistLink] = useState(false);
    const [therapistLink, setTherapistLink] = useState('');
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [userLocation, setUserLocation] = useState({ lat: 19.0760, lng: 72.8777 }); // Mumbai coordinates
    const [locationHistory, setLocationHistory] = useState<Array<{lat: number, lng: number, timestamp: string}>>([]);

    // Comprehensive data for dementia patient tracking
    const patientData = {
        name: selectedMember,
        age: 72,
        condition: 'Early-stage Alzheimer\'s',
        cognitiveScore: 68, // MMSE score out of 100
        weeklyChange: -3, // Cognitive decline this week
        medicationCompliance: 85, // Percentage
        lastMedicationTime: '2 hours ago',
        safetyScore: 82, // Overall safety score
        wanderingRisk: 'Moderate', // Low, Moderate, High
        confusionLevel: 2, // 1-5 scale
        memoryRetention: 65, // Percentage
        lastCheckIn: '45 minutes ago',
        deviceType: 'Smartphone',
        currentLocation: 'Home - Living Room',
        lastKnownLocation: { address: '123 MG Road, Mumbai', time: '10 minutes ago' },
        batteryLevel: 78,
        networkStrength: 4,
        heartRate: 72,
        stepCount: 1240,
        isInSafeZone: true,
        emergencyContacts: [
            { name: 'Priya Kumar (Daughter)', phone: '+91 98765 43210', relation: 'Primary Caregiver' },
            { name: 'Dr. Sharma', phone: '+91 98765 12345', relation: 'Physician' }
        ]
    };

    // Simulate real-time location updates
    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate slight location changes (in real app, this would come from GPS)
            setUserLocation(prev => ({
                lat: prev.lat + (Math.random() - 0.5) * 0.001,
                lng: prev.lng + (Math.random() - 0.5) * 0.001
            }));
        }, 10000); // Update every 10 seconds
        
        return () => clearInterval(interval);
    }, []);

    // Cognitive & Health Data with detailed metrics
    const cognitiveData = {
        currentAssessment: {
            orientation: 7, // Out of 10
            memory: 6,  // Out of 10
            attention: 5,  // Out of 10
            language: 8,  // Out of 10
            visuospatial: 6, // Out of 10
            timestamp: '2025-09-30 11:30:00'
        },
        weeklyAverage: {
            orientation: 7.2,
            memory: 6.5,
            attention: 5.8,
            language: 8.1,
            visuospatial: 6.2
        },
        behavioralIndicators: {
            agitation: 2, // 1-5 scale
            confusion: 3, // 1-5 scale
            sleepQuality: 6, // Out of 10
            socialEngagement: 7 // Out of 10
        },
        alerts: [
            { type: 'location_alert', time: '11:45', level: 'warning', message: 'Patient left safe zone boundary' },
            { type: 'medication_missed', time: '10:30', level: 'critical', message: 'Morning medication not taken' },
            { type: 'confusion_detected', time: '09:15', level: 'info', message: 'Increased confusion detected via app interaction' }
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

    const cognitiveAreas = [
        { name: 'Memory', score: 65, level: 3, icon: Brain, color: 'from-purple-400 to-violet-500', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
        { name: 'Orientation', score: 70, level: 2, icon: MapPin, color: 'from-blue-400 to-indigo-500', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
        { name: 'Communication', score: 80, level: 2, icon: MessageCircle, color: 'from-green-400 to-emerald-500', bgColor: 'bg-green-50', textColor: 'text-green-600' },
        { name: 'Daily Activities', score: 72, level: 3, icon: Activity, color: 'from-orange-400 to-red-500', bgColor: 'bg-orange-50', textColor: 'text-orange-600' }
    ];

    const recentActivities = [
        { title: 'Medication Taken', description: 'Morning medications completed on time', icon: Pill, date: 'Today, 8:00 AM' },
        { title: 'Memory Exercise', description: 'Completed photo recognition game', icon: Brain, date: 'Today, 9:30 AM' },
        { title: 'Safe Return Home', description: 'Returned from morning walk safely', icon: Home, date: 'Today, 10:15 AM' }
    ];

    const weeklyGoals = [
        { title: 'Medication adherence', completed: 6, total: 7, color: 'bg-emerald-500' },
        { title: 'Cognitive exercises', completed: 4, total: 5, color: 'bg-blue-500' },
        { title: 'Social interactions', completed: 3, total: 4, color: 'bg-purple-500' },
        { title: 'Physical activity (walks)', completed: 5, total: 7, color: 'bg-orange-500' }
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
                                <h1 className="text-3xl font-bold text-slate-800">Family Care Dashboard</h1>
                                <p className="text-slate-600">Monitor and support your loved one with dementia</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={selectedMember}
                                onChange={(e) => setSelectedMember(e.target.value)}
                                className="px-4 py-2 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white shadow-sm"
                            >
                                <option value="Rajesh Kumar">Rajesh Kumar (Father)</option>
                                <option value="Sunita Devi">Sunita Devi (Mother)</option>
                            </select>
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Navigation Tabs */}
                    <div className="mt-6">
                        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
                            {[
                                { id: 'overview', label: 'Overview', icon: BarChart3 },
                                { id: 'location', label: 'Live Location', icon: MapPin },
                                { id: 'cognitive', label: 'Cognitive Health', icon: Brain },
                                { id: 'alerts', label: 'Alerts & Safety', icon: Bell },
                                { id: 'analytics', label: 'Analytics', icon: LineChart }
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
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{patientData.name}'s Health Status</h2>
                                    <p className="text-slate-600">{patientData.condition} - Cognitive Score</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-bold text-slate-800">{patientData.cognitiveScore}%</div>
                                    <div className="flex items-center text-orange-600 text-sm font-medium">
                                        <TrendingDown className="w-4 h-4 mr-1" />
                                        {patientData.weeklyChange}% this week
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
                                            className="text-blue-500"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            fill="none"
                                            strokeDasharray={`${patientData.cognitiveScore}, 100`}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-slate-800">{patientData.cognitiveScore}%</div>
                                            <div className="text-xs text-slate-500">MMSE Score</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Health Indicators */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <div className="text-2xl font-bold text-emerald-600">{patientData.medicationCompliance}%</div>
                                    <div className="text-sm text-emerald-600">Medication</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <div className="text-2xl font-bold text-blue-600">{patientData.safetyScore}%</div>
                                    <div className="text-sm text-blue-600">Safety Score</div>
                                </div>
                                <div className="text-center p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                    <div className="text-2xl font-bold text-orange-600">{patientData.wanderingRisk}</div>
                                    <div className="text-sm text-orange-600">Wander Risk</div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <div className="text-2xl font-bold text-slate-800">{patientData.heartRate}</div>
                                    <div className="text-sm text-slate-600">Heart Rate</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <div className="text-2xl font-bold text-slate-800">{patientData.stepCount}</div>
                                    <div className="text-sm text-slate-600">Steps Today</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <div className="text-2xl font-bold text-slate-800">{patientData.memoryRetention}%</div>
                                    <div className="text-sm text-slate-600">Memory</div>
                                </div>
                            </div>
                        </div>

                        {/* Cognitive Areas Overview */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Cognitive Function Areas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {cognitiveAreas.map((area, index) => {
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

                        {/* Weekly Care Goals */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">This Week's Care Goals</h3>
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
                        
                        {/* Recent Activities */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activities</h3>
                            <div className="space-y-4">
                                {recentActivities.map((activity, index) => {
                                    const IconComponent = activity.icon;
                                    return (
                                        <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <IconComponent className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-slate-800 text-sm">{activity.title}</h4>
                                                <p className="text-xs text-slate-600">{activity.description}</p>
                                                <p className="text-xs text-slate-500 mt-1">{activity.date}</p>
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
                                        <Phone className="w-5 h-5 text-blue-600" />
                                        <span className="font-medium text-slate-800">Call {patientData.name}</span>
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
                                        <Pill className="w-5 h-5 text-purple-600" />
                                        <span className="font-medium text-slate-800">Medication Reminder</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </button>
                                
                                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-slate-100 hover:shadow-md transition-all">
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="w-5 h-5 text-orange-600" />
                                        <span className="font-medium text-slate-800">View Live Location</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Safety Status */}
                        <div className={`rounded-3xl p-6 text-white shadow-xl ${
                            patientData.isInSafeZone 
                                ? 'bg-gradient-to-r from-emerald-400 to-green-500' 
                                : 'bg-gradient-to-r from-red-400 to-orange-500'
                        }`}>
                            <div className="flex items-center space-x-3 mb-3">
                                <Shield className="w-6 h-6" />
                                <h3 className="text-lg font-bold">Safety Status</h3>
                            </div>
                            <p className="text-sm leading-relaxed">
                                {patientData.isInSafeZone 
                                    ? `${patientData.name} is currently in the safe zone. Last check-in: ${patientData.lastCheckIn}` 
                                    : `Alert: ${patientData.name} has left the designated safe zone!`
                                }
                            </p>
                        </div>

                        {/* Emergency Contacts */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Emergency Contacts</h3>
                            <div className="space-y-3">
                                {patientData.emergencyContacts.map((contact, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-slate-800 text-sm">{contact.name}</p>
                                            <p className="text-xs text-slate-600">{contact.relation}</p>
                                        </div>
                                        <button className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                                            <Phone className="w-4 h-4 text-blue-600" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {/* Live Location Tab */}
                {activeTab === 'location' && (
                    <div className="space-y-6">
                        {/* Location Map */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">Live Location Tracking</h2>
                                <div className="flex items-center space-x-2 text-sm text-slate-600">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span>Live</span>
                                    <span className="text-xs text-slate-500">• Updated 10s ago</span>
                                </div>
                            </div>
                            
                            {/* Map Container */}
                            <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 via-slate-50 to-green-50 rounded-2xl overflow-hidden mb-6 border-2 border-slate-200">
                                {/* Mock Map Grid Pattern */}
                                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(148, 163, 184)" strokeWidth="0.5" opacity="0.2"/>
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#grid)" />
                                </svg>
                                
                                {/* Mock Roads */}
                                <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-slate-300 opacity-40"></div>
                                <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-slate-300 opacity-40"></div>
                                <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-slate-300 opacity-40"></div>
                                <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-slate-300 opacity-40"></div>
                                
                                {/* Safe Zone Circle */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className={`w-64 h-64 rounded-full border-4 border-dashed ${
                                        patientData.isInSafeZone ? 'border-green-400' : 'border-red-400'
                                    } opacity-30`}></div>
                                </div>
                                
                                {/* Patient Location Marker */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="relative">
                                        {/* Pulsing Circle */}
                                        <div className={`absolute -inset-4 rounded-full ${
                                            patientData.isInSafeZone ? 'bg-green-400' : 'bg-red-400'
                                        } opacity-20 animate-ping`}></div>
                                        
                                        {/* Main Marker */}
                                        <div className={`relative w-12 h-12 ${
                                            patientData.isInSafeZone ? 'bg-green-500' : 'bg-red-500'
                                        } rounded-full border-4 border-white shadow-xl flex items-center justify-center`}>
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        
                                        {/* Patient Name Label */}
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                            <div className="bg-white px-3 py-1 rounded-lg shadow-md border border-slate-200">
                                                <p className="text-xs font-semibold text-slate-700">{patientData.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Mock Location Labels */}
                                <div className="absolute top-6 left-6 bg-white bg-opacity-80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
                                    <p className="text-xs font-medium text-slate-600">🏠 Home</p>
                                </div>
                                <div className="absolute bottom-6 right-6 bg-white bg-opacity-80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
                                    <p className="text-xs font-medium text-slate-600">🏞️ Park</p>
                                </div>
                                
                                {/* Safe Zone Indicator */}
                                <div className="absolute top-4 right-4 bg-white rounded-xl p-3 shadow-lg z-10">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-3 h-3 rounded-full animate-pulse ${
                                            patientData.isInSafeZone ? 'bg-green-500' : 'bg-red-500'
                                        }`}></div>
                                        <span className="text-sm font-medium text-slate-700">
                                            {patientData.isInSafeZone ? 'In Safe Zone' : 'Outside Safe Zone'}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Coordinates Display */}
                                <div className="absolute bottom-4 left-4 bg-white rounded-xl p-3 shadow-lg z-10">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs font-mono text-slate-600">
                                            {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Zoom Controls (Mock) */}
                                <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg overflow-hidden z-10">
                                    <button className="block px-3 py-2 hover:bg-slate-50 border-b border-slate-200 transition-colors">
                                        <span className="text-lg font-bold text-slate-600">+</span>
                                    </button>
                                    <button className="block px-3 py-2 hover:bg-slate-50 transition-colors">
                                        <span className="text-lg font-bold text-slate-600">−</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Location Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-blue-600">Current Location</span>
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="text-lg font-bold text-blue-800">{patientData.currentLocation}</div>
                                    <div className="text-xs text-blue-600 mt-1">{patientData.lastKnownLocation.address}</div>
                                </div>
                                
                                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-green-600">Battery Level</span>
                                        <Battery className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="text-lg font-bold text-green-800">{patientData.batteryLevel}%</div>
                                    <div className="text-xs text-green-600 mt-1">Phone battery status</div>
                                </div>
                                
                                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-purple-600">Last Update</span>
                                        <Clock className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="text-lg font-bold text-purple-800">{patientData.lastKnownLocation.time}</div>
                                    <div className="text-xs text-purple-600 mt-1">GPS signal: Strong</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Location History */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Location History (Today)</h3>
                            <div className="space-y-3">
                                {[
                                    { time: '11:45 AM', location: 'Left Home', status: 'warning' },
                                    { time: '11:30 AM', location: 'Home - Living Room', status: 'safe' },
                                    { time: '10:15 AM', location: 'Returned from Park', status: 'safe' },
                                    { time: '09:30 AM', location: 'Morning Walk - Local Park', status: 'safe' },
                                    { time: '08:00 AM', location: 'Home - Bedroom', status: 'safe' }
                                ].map((entry, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-2 h-2 rounded-full ${
                                                entry.status === 'warning' ? 'bg-orange-500' : 'bg-green-500'
                                            }`}></div>
                                            <div>
                                                <p className="font-medium text-slate-800 text-sm">{entry.location}</p>
                                                <p className="text-xs text-slate-500">{entry.time}</p>
                                            </div>
                                        </div>
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Cognitive Health Tab */}
                {activeTab === 'cognitive' && (
                    <div className="space-y-6">
                        {/* Cognitive Assessment Data */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">Cognitive Assessment</h2>
                                <div className="flex items-center space-x-2 text-sm text-slate-600">
                                    <Clock className="w-4 h-4" />
                                    <span>Last assessed: {cognitiveData.currentAssessment.timestamp}</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-blue-600">Orientation</span>
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-blue-800">{cognitiveData.currentAssessment.orientation}/10</div>
                                    <div className="text-xs text-blue-600">Time & place awareness</div>
                                </div>
                                
                                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-purple-600">Memory</span>
                                        <Brain className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-purple-800">{cognitiveData.currentAssessment.memory}/10</div>
                                    <div className="text-xs text-purple-600">Recall ability</div>
                                </div>
                                
                                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-orange-600">Attention</span>
                                        <Eye className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-orange-800">{cognitiveData.currentAssessment.attention}/10</div>
                                    <div className="text-xs text-orange-600">Focus & concentration</div>
                                </div>
                                
                                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-green-600">Language</span>
                                        <MessageCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-green-800">{cognitiveData.currentAssessment.language}/10</div>
                                    <div className="text-xs text-green-600">Communication skills</div>
                                </div>
                                
                                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-indigo-600">Visuospatial</span>
                                        <Eye className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-indigo-800">{cognitiveData.currentAssessment.visuospatial}/10</div>
                                    <div className="text-xs text-indigo-600">Spatial awareness</div>
                                </div>
                            </div>

                            {/* Behavioral Indicators */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Behavioral Indicators</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Agitation Level</span>
                                            <span className="text-lg font-bold text-orange-600">{cognitiveData.behavioralIndicators.agitation}/5</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Confusion Level</span>
                                            <span className="text-lg font-bold text-red-600">{cognitiveData.behavioralIndicators.confusion}/5</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Sleep Quality</span>
                                            <span className="text-lg font-bold text-blue-600">{cognitiveData.behavioralIndicators.sleepQuality}/10</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Social Engagement</span>
                                            <span className="text-lg font-bold text-green-600">{cognitiveData.behavioralIndicators.socialEngagement}/10</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Weekly Averages</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Orientation</span>
                                            <span className="text-lg font-bold text-blue-600">{cognitiveData.weeklyAverage.orientation}/10</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Memory</span>
                                            <span className="text-lg font-bold text-purple-600">{cognitiveData.weeklyAverage.memory}/10</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Attention</span>
                                            <span className="text-lg font-bold text-orange-600">{cognitiveData.weeklyAverage.attention}/10</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Language</span>
                                            <span className="text-lg font-bold text-green-600">{cognitiveData.weeklyAverage.language}/10</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Alerts & Safety Tab */}
                {activeTab === 'alerts' && (
                    <div className="space-y-6">
                        {/* Current Alerts */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Safety Alerts</h2>
                            <div className="space-y-4">
                                {cognitiveData.alerts.map((alert: any, index: number) => (
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

                        {/* Safety Trigger Actions */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Automated Safety Triggers</h2>
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
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Health & Activity Analytics</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-blue-600">Age</span>
                                        <UserCheck className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-blue-800">{patientData.age} years</div>
                                    <div className="text-xs text-blue-600">Patient age</div>
                                </div>
                                
                                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-green-600">Last Check-in</span>
                                        <Clock className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-green-800">{patientData.lastCheckIn}</div>
                                    <div className="text-xs text-green-600">Active monitoring</div>
                                </div>
                                
                                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-purple-600">Device Type</span>
                                        <Smartphone className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-purple-800">{patientData.deviceType}</div>
                                    <div className="text-xs text-purple-600">Tracking device</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Device Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Location</span>
                                            <span className="text-sm font-medium text-slate-800">{patientData.currentLocation}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Battery Level</span>
                                            <div className="flex items-center space-x-2">
                                                <Battery className="w-4 h-4 text-slate-600" />
                                                <span className="text-sm font-medium text-slate-800">{patientData.batteryLevel}%</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Network Strength</span>
                                            <div className="flex items-center space-x-2">
                                                <Signal className="w-4 h-4 text-slate-600" />
                                                <span className="text-sm font-medium text-slate-800">{patientData.networkStrength}/5</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Health Metrics</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Heart Rate</span>
                                            <span className="text-sm font-medium text-slate-800">{patientData.heartRate} bpm</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Steps Today</span>
                                            <span className="text-sm font-medium text-slate-800">{patientData.stepCount} steps</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Medication Compliance</span>
                                            <span className="text-sm font-medium text-slate-800">{patientData.medicationCompliance}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* App Usage Tracking - Hidden for now */}
                {activeTab === 'usage' && (
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
                                Share this secure link with the healthcare provider to give them access to {patientData.name}'s health data:
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

export default FamilyDementiaDashboard;