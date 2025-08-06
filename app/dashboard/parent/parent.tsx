"use client"
import React, { useState, useEffect } from 'react';
import { Bell, Search, User, Calendar, BarChart3, TrendingUp, Brain, Circle, Trophy, Target, Clock, BookOpen, Zap, Star, ArrowUp, ArrowDown, Activity, Users, Award, PlayCircle, Eye, Cpu, Timer, MessageSquare, Copy, X, Link } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import AnalyticsPage from '../data/data';

const CognitiveDashboard = () => {
    const [selectedChild, setSelectedChild] = useState('Satva');
    const [showTherapistLink, setShowTherapistLink] = useState(false);
    const [therapistLink, setTherapistLink] = useState('');
    const [copied, setCopied] = useState(false);

    // Sample data
    const weeklyData = [
        { day: 'Mon', score: 75 },
        { day: 'Tue', score: 78 },
        { day: 'Wed', score: 82 },
        { day: 'Thu', score: 79 },
        { day: 'Fri', score: 85 },
        { day: 'Sat', score: 88 },
        { day: 'Sun', score: 91 }
    ];

    // Fake EEG data
    const eegData = Array.from({ length: 50 }, (_, i) => ({
        time: i,
        alpha: Math.sin(i * 0.1) * 20 + 50 + Math.random() * 10,
        beta: Math.sin(i * 0.15) * 15 + 40 + Math.random() * 8,
        theta: Math.sin(i * 0.08) * 25 + 60 + Math.random() * 12,
        delta: Math.sin(i * 0.05) * 30 + 70 + Math.random() * 15
    }));

    const heatmapData = Array.from({ length: 35 }, (_, i) => ({
        value: Math.random() * 100,
        day: i
    }));

    const getHeatmapColor = (value: number) => {
        if (value > 80) return 'bg-cyan-500';
        if (value > 60) return 'bg-cyan-400';
        if (value > 40) return 'bg-cyan-300';
        if (value > 20) return 'bg-cyan-200';
        return 'bg-cyan-100';
    };

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
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                            <Brain className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800">Dashboard Overview</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <select
                            value={selectedChild}
                            onChange={(e) => setSelectedChild(e.target.value)}
                            className="px-3 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="Emma">Satva</option>
                            <option value="Alex">Kush</option>
                        </select>
                        <Bell className="w-4 h-4 text-gray-500 cursor-pointer" />
                        <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-white" />
                        </div>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-6 gap-4">
                    {/* Left Column - Metrics */}
                    <div className="col-span-2 space-y-4">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                                <div className="text-2xl font-bold text-gray-900">3h 45m</div>
                                <div className="text-xs text-gray-500">Active Time</div>
                                <div className="text-xs text-green-500 mt-1">+12%</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                                <div className="text-2xl font-bold text-gray-900">8/10</div>
                                <div className="text-xs text-gray-500">Sessions</div>
                                <div className="text-xs text-green-500 mt-1">+8%</div>
                            </div>
                        </div>

                        {/* Performance Score */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border">
                            <div className="text-sm text-gray-500 mb-2">Performance</div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">82%</div>
                            <div className="text-xs text-green-500">+15% improvement</div>
                        </div>

                        {/* New Online Users */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-l-4 border-l-cyan-500">
                            <div className="text-sm text-gray-500 mb-1">New Activities</div>
                            <div className="text-xl font-bold text-gray-900">+25</div>
                            <div className="text-xs text-gray-400">This week</div>
                        </div>

                        {/* Skills Breakdown */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border">
                            <div className="text-sm font-medium text-gray-700 mb-3">Cognitive Skills</div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Eye className="w-3 h-3 text-blue-500" />
                                        <span className="text-xs text-gray-600">Attention</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                            <div className="bg-blue-500 h-1.5 rounded-full w-4/5"></div>
                                        </div>
                                        <span className="text-xs font-medium text-gray-700">88%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Brain className="w-3 h-3 text-green-500" />
                                        <span className="text-xs text-gray-600">Memory</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                            <div className="bg-green-500 h-1.5 rounded-full w-3/4"></div>
                                        </div>
                                        <span className="text-xs font-medium text-gray-700">85%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Cpu className="w-3 h-3 text-purple-500" />
                                        <span className="text-xs text-gray-600">Processing</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                            <div className="bg-purple-500 h-1.5 rounded-full w-5/6"></div>
                                        </div>
                                        <span className="text-xs font-medium text-gray-700">93%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Target className="w-3 h-3 text-orange-500" />
                                        <span className="text-xs text-gray-600">Executive</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                            <div className="bg-orange-500 h-1.5 rounded-full w-4/5"></div>
                                        </div>
                                        <span className="text-xs font-medium text-gray-700">86%</span>
                                    </div>
                                </div>

                            </div>

                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
                            <div className="text-sm font-medium text-gray-700 mb-1">Practice Streak</div>
                            <div className="text-2xl font-bold text-orange-500">🔥 4 Days</div>
                            <div className="text-xs text-gray-500">Keep going!</div>
                        </div>

                    </div>

                    {/* Middle Column - Charts */}
                    <div className="col-span-3 space-y-4">
                        {/* Progress Chart */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Progress & Energy Trend</h3>
                            <ResponsiveContainer width="100%" height={180}>
                                <AreaChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="day" stroke="#666" fontSize={10} />
                                    <YAxis stroke="#666" fontSize={10} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Bottom Row */}


                        {/* EEG Data Chart */}
                        {/* Module-wise Score Comparison */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Cognitive Skill Comparison</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <RadarChart data={[
                                    { skill: 'Memory', score: 85 },
                                    { skill: 'Focus', score: 78 },
                                    { skill: 'Logic', score: 90 },
                                    { skill: 'Processing', score: 82 },
                                    { skill: 'Attention', score: 88 },
                                ]}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="skill" stroke="#666" fontSize={10} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#999", fontSize: 10 }} />
                                    <Radar
                                        name="Score"
                                        dataKey="score"
                                        stroke="#06B6D4"
                                        fill="#06B6D4"
                                        fillOpacity={0.4}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            fontSize: '12px'
                                        }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                            <div className="text-xs text-gray-500 mt-2 text-center">Skill strengths and development areas</div>
                        </div>


                        {/* Therapist Link Section */}
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-4 shadow-sm text-white text-center">
                            <div className="text-sm font-medium mb-2">Connect with Therapist</div>
                            <div className="text-xs mb-3">Create a secure link to share with your therapist</div>
                            <button 
                                onClick={handleCreateTherapistLink}
                                className="bg-white text-emerald-600 text-sm px-3 py-1 rounded-md font-medium hover:bg-gray-50 transition-colors"
                            >
                                <Link className="w-3 h-3 inline mr-1" />
                                Create Link
                            </button>
                        </div>


                    </div>

                    {/* Right Column */}
                    <div className="col-span-1 space-y-4">
                        {/* Heatmap */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Heat Map Data</h3>
                            <div className="grid grid-cols-7 gap-1 mb-3">
                                {heatmapData.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`w-3 h-3 rounded-sm ${getHeatmapColor(item.value)}`}
                                    />
                                ))}
                            </div>
                            <div className="text-xs text-gray-500">Most Active Days</div>
                        </div>

                        {/* Recent Achievements */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Achievements</h3>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                                        <Trophy className="w-3 h-3 text-yellow-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-gray-700">Memory Master</div>
                                        <div className="text-xs text-gray-500">2 days ago</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Star className="w-3 h-3 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-gray-700">Focus Expert</div>
                                        <div className="text-xs text-gray-500">5 days ago</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                        <Zap className="w-3 h-3 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-gray-700">Speed Boost</div>
                                        <div className="text-xs text-gray-500">1 week ago</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image at the bottom */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border flex justify-center">
                            <img
                                src="https://t4.ftcdn.net/jpg/10/28/75/81/360_F_1028758195_KpSH5dBhP8g5uRBy5vKeCZOVAb2Txr1K.png"
                                alt="Illustration"
                                className="rounded-lg w-full max-w-[220px] object-contain"
                            />
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
                            <div className="text-sm italic text-gray-600">"Focus is a muscle — the more you use it, the stronger it gets."</div>
                            <div className="text-xs text-gray-400 mt-1">— Tip of the Day</div>
                        </div>

                    </div>


                </div>

                {/* Brain Image Placeholder Section */}
           
            </div>

            {/* Therapist Link Popup Modal */}
            {showTherapistLink && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Therapist Link Generated</h3>
                            <button 
                                onClick={() => setShowTherapistLink(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-3">
                                Share this secure link with your therapist to give them access to your child's progress data:
                            </p>
                            <div className="bg-gray-50 rounded-lg p-3 border">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 font-mono break-all">
                                        {therapistLink}
                                    </span>
                                    <button 
                                        onClick={handleCopyLink}
                                        className={`ml-2 p-2 rounded-md transition-colors ${
                                            copied 
                                                ? 'bg-green-100 text-green-600' 
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
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Close
                            </button>
                            <button 
                                onClick={handleCopyLink}
                                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                    copied 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                            >
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AnalyticsPage/>
        </div>
    );
};

export default CognitiveDashboard;