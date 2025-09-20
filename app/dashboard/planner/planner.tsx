"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, ArrowRight } from 'lucide-react';

type Assessment = {
    score: number;
    severity: string;
    at: number;
};

export default function Planner() {
    const [gad7, setGad7] = useState<Assessment | null>(null);
    const [phq9, setPhq9] = useState<Assessment | null>(null);
    const [phq12, setPhq12] = useState<Assessment | null>(null);

    useEffect(() => {
        const gad7Data = localStorage.getItem('synapse_gad7');
        const phq9Data = localStorage.getItem('synapse_phq9');
        const phq12Data = localStorage.getItem('synapse_phq12');
        if (gad7Data) setGad7(JSON.parse(gad7Data));
        if (phq9Data) setPhq9(JSON.parse(phq9Data));
        if (phq12Data) setPhq12(JSON.parse(phq12Data));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full shadow-xl">
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Brain className="w-16 h-16 text-blue-600" />
                    </div>
                    <CardTitle className="text-4xl font-bold text-gray-900 mb-2">
                        Mental Health Planner
                    </CardTitle>
                    <CardDescription className="text-xl text-gray-600">
                        Get personalized mental health recommendations based on your assessment scores
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center">
                        <p className="text-gray-700 mb-6">
                            This application reads your mental health assessment scores from local storage and provides 
                            AI-powered personalized recommendations for therapy, self-care activities, and wellness planning.
                        </p>
                        
                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <h3 className="font-semibold text-blue-800 mb-2">Your Assessment Scores:</h3>
                            <ul className="text-blue-700 text-sm space-y-1">
                                <li>
                                    <strong>PHQ-9:</strong>{' '}
                                    {phq9 ? `Score: ${phq9.score}, Severity: ${phq9.severity}` : 'Not found'}
                                </li>
                                <li>
                                    <strong>GAD-7:</strong>{' '}
                                    {gad7 ? `Score: ${gad7.score}, Severity: ${gad7.severity}` : 'Not found'}
                                </li>
                                <li>
                                    <strong>PHQ-12:</strong>{' '}
                                    {phq12 ? `Score: ${phq12.score}, Severity: ${phq12.severity}` : 'Not found'}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <Link href="mental-health-planner">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
                            Start Your Mental Health Planning
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>

                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Make sure your assessment scores are stored in local storage before proceeding.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}