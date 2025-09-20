"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Brain, Heart, Activity, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ScoreData {
  phq9: number;
  phq12: number;
  gad7: number;
}

interface ScoreInterpretation {
  score: number;
  interpretation: string;
}

interface AnalysisResult {
  success: boolean;
  recommendation: string;
  scores: {
    phq9: ScoreInterpretation;
    gad7: ScoreInterpretation;
    phq12: ScoreInterpretation;
  };
  error?: string;
}

export default function MentalHealthPlanner() {
  const [scores, setScores] = useState<ScoreData>({ phq9: 0, phq12: 0, gad7: 0 });
  const [userPrompt, setUserPrompt] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scoresLoaded, setScoresLoaded] = useState(false);

  useEffect(() => {
    // Load scores from localStorage
    const loadScores = () => {
      try {
        const phq9 = parseInt(localStorage.getItem('synapse_phq9') || '0');
        const phq12 = parseInt(localStorage.getItem('synapse_phq12') || '0');
        const gad7 = parseInt(localStorage.getItem('synapse_gad7') || '0');
        
        setScores({ phq9, phq12, gad7 });
        setScoresLoaded(true);
      } catch (error) {
        console.error('Error loading scores from localStorage:', error);
        setScoresLoaded(true);
      }
    };

    loadScores();
  }, []);

  const getSeverityBadgeColor = (interpretation: string): string => {
    if (interpretation.includes('severe')) return 'destructive';
    if (interpretation.includes('moderate')) return 'default';
    if (interpretation.includes('mild')) return 'secondary';
    return 'outline';
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze-scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phq9: scores.phq9,
          phq12: scores.phq12,
          gad7: scores.gad7,
          userPrompt: userPrompt.trim() || null,
        }),
      });

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error analyzing scores:', error);
      setResult({
        success: false,
        error: 'Failed to analyze scores. Please try again.',
        recommendation: '',
        scores: {
          phq9: { score: 0, interpretation: '' },
          gad7: { score: 0, interpretation: '' },
          phq12: { score: 0, interpretation: '' }
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatRecommendation = (text: string) => {
    // Split by common section headers and format nicely
    const sections = text.split(/(\*\*[^*]+\*\*)/g);
    
    return sections.map((section, index) => {
      if (section.startsWith('**') && section.endsWith('**')) {
        // This is a header
        const headerText = section.replace(/\*\*/g, '');
        return (
          <h3 key={index} className="text-lg font-semibold mt-6 mb-3 text-primary">
            {headerText}
          </h3>
        );
      } else if (section.trim()) {
        // This is content
        return (
          <div key={index} className="mb-4">
            {section.split('\n').map((line, lineIndex) => {
              if (line.trim()) {
                return (
                  <p key={lineIndex} className="mb-2 leading-relaxed">
                    {line.trim()}
                  </p>
                );
              }
              return null;
            })}
          </div>
        );
      }
      return null;
    });
  };

  if (!scoresLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Mental Health Planner</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get personalized mental health recommendations based on your assessment scores
          </p>
        </div>

        {/* Current Scores Display */}
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-6 h-6 mr-2 text-blue-600" />
              Your Current Assessment Scores
            </CardTitle>
            <CardDescription>
              Loaded from your local storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Heart className="w-6 h-6 text-red-500 mr-2" />
                  <h3 className="font-semibold">PHQ-9 (Depression)</h3>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{scores.phq9}/27</div>
                {result && (
                  <Badge variant={getSeverityBadgeColor(result.scores.phq9.interpretation) as any}>
                    {result.scores.phq9.interpretation}
                  </Badge>
                )}
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
                  <h3 className="font-semibold">GAD-7 (Anxiety)</h3>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">{scores.gad7}/21</div>
                {result && (
                  <Badge variant={getSeverityBadgeColor(result.scores.gad7.interpretation) as any}>
                    {result.scores.gad7.interpretation}
                  </Badge>
                )}
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="w-6 h-6 text-purple-500 mr-2" />
                  <h3 className="font-semibold">PHQ-12 (Somatic)</h3>
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">{scores.phq12}/24</div>
                {result && (
                  <Badge variant={getSeverityBadgeColor(result.scores.phq12.interpretation) as any}>
                    {result.scores.phq12.interpretation}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Input Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Additional Information (Optional)</CardTitle>
            <CardDescription>
              Share any specific concerns, symptoms, or context that might help personalize your recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt">Your Message</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., I've been having trouble sleeping lately, or I need help with work-related stress, or I'm interested in meditation techniques..."
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  className="min-h-[100px] mt-2"
                />
              </div>
              
              <Button 
                onClick={handleAnalyze} 
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Your Scores...
                  </>
                ) : (
                  'Get My Personalized Plan'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Your Personalized Mental Health Plan</CardTitle>
              <CardDescription>
                Based on your assessment scores and additional information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.success ? (
                <div className="prose max-w-none">
                  {formatRecommendation(result.recommendation)}
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {result.error || 'An error occurred while generating recommendations.'}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important Disclaimer:</strong> This tool provides general guidance based on assessment scores and should not replace professional medical advice. If you're experiencing thoughts of self-harm or suicide, please seek immediate help by calling 988 (Suicide & Crisis Lifeline) or your local emergency services.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}