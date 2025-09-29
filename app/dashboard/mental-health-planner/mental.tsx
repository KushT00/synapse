"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Brain, 
  Heart, 
  Activity, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Phone,
  Stethoscope,
  Users,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ScoreData {
  phq9: number;
  phq12: number;
  gad7: number;
}

interface ScoreInterpretation {
  score: number;
  interpretation: string;
  severity_level: string;
  color: string;
}

interface RecommendationSection {
  title: string;
  content: string[];
  priority: string;
  icon: string;
}

interface AnalysisResult {
  success: boolean;
  recommendation_sections: RecommendationSection[];
  scores: {
    phq9: ScoreInterpretation;
    gad7: ScoreInterpretation;
    phq12: ScoreInterpretation;
  };
  overall_severity: string;
  requires_immediate_attention: boolean;
  crisis_resources?: string[];
  error?: string;
}

// Mock localStorage data for demonstration
const mockStorageData = {
  synapse_gad7: "1",
  synapse_phq12: "24", 
  synapse_phq9: "23"
};

export default function MentalHealthPlanner() {
  const [scores, setScores] = useState<ScoreData>({ phq9: 0, phq12: 0, gad7: 0 });
  const [userPrompt, setUserPrompt] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scoresLoaded, setScoresLoaded] = useState(false);

  // Icon mapping for recommendation sections
  const getIcon = (iconName: string) => {
    const iconMap = {
      assessment: CheckCircle,
      alert: AlertTriangle,
      medical: Stethoscope,
      heart: Heart,
      lifestyle: Activity,
      tracking: TrendingUp,
      resources: BookOpen
    };
    return iconMap[iconName as keyof typeof iconMap] || CheckCircle;
  };

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  // Overall severity styling
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'severe': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'moderate': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'mild': return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'minimal': return 'bg-green-100 border-green-500 text-green-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  useEffect(() => {
    const loadScores = () => {
      try {
        const phq9 = parseInt(mockStorageData.synapse_phq9);
        const phq12 = parseInt(mockStorageData.synapse_phq12);
        const gad7 = parseInt(mockStorageData.synapse_gad7);
        
        setScores({ phq9, phq12, gad7 });
        setScoresLoaded(true);
        
      } catch (error) {
        console.error('Error loading scores:', error);
        setScoresLoaded(true);
      }
    };

    loadScores();
  }, []);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/analyze-scores', {
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error analyzing scores:', error);
      setResult({
        success: false,
        error: 'Failed to connect to the analysis service. Please ensure the backend server is running on http://localhost:8000',
        recommendation_sections: [],
        scores: {
          phq9: { score: 0, interpretation: '', severity_level: 'unknown', color: 'outline' },
          gad7: { score: 0, interpretation: '', severity_level: 'unknown', color: 'outline' },
          phq12: { score: 0, interpretation: '', severity_level: 'unknown', color: 'outline' }
        },
        overall_severity: 'unknown',
        requires_immediate_attention: false
      });
    } finally {
      setIsLoading(false);
    }
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

        {/* Overall Status Banner */}
        {result && result.success && (
          <Card className={`shadow-lg border-2 ${getSeverityStyle(result.overall_severity)}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {result.requires_immediate_attention ? 
                    <AlertCircle className="w-6 h-6 mr-3" /> : 
                    <CheckCircle className="w-6 h-6 mr-3" />
                  }
                  <div>
                    <h3 className="text-xl font-semibold capitalize">
                      Overall Status: {result.overall_severity}
                    </h3>
                    {result.requires_immediate_attention && (
                      <p className="text-sm font-medium mt-1">
                        Immediate professional attention recommended
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Crisis Resources Alert */}
        {result && result.crisis_resources && (
          <Card className="border-2 border-red-500 bg-red-50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <Phone className="w-6 h-6 mr-2" />
                Crisis Resources - Available 24/7
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.crisis_resources.map((resource, index) => (
                  <div key={index} className="flex items-center p-3 bg-white rounded border border-red-200">
                    <AlertCircle className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                    <span className="font-medium text-red-800">{resource}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Scores Display */}
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-6 h-6 mr-2 text-blue-600" />
              Your Current Assessment Scores
            </CardTitle>
            <CardDescription>
              Loaded from stored assessment data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border-l-4 border-red-500">
                <div className="flex items-center justify-center mb-2">
                  <Heart className="w-6 h-6 text-red-500 mr-2" />
                  <h3 className="font-semibold">PHQ-9 (Depression)</h3>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{scores.phq9}/27</div>
                {result && result.success && (
                  <Badge variant={result.scores.phq9.color as any}>
                    {result.scores.phq9.interpretation}
                  </Badge>
                )}
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="flex items-center justify-center mb-2">
                  <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
                  <h3 className="font-semibold">GAD-7 (Cognitive)</h3>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">{scores.gad7}/21</div>
                {result && result.success && (
                  <Badge variant={result.scores.gad7.color as any}>
                    {result.scores.gad7.interpretation}
                  </Badge>
                )}
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="w-6 h-6 text-purple-500 mr-2" />
                  <h3 className="font-semibold">PHQ-12 (Somatic)</h3>
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">{scores.phq12}/24</div>
                {result && result.success && (
                  <Badge variant={result.scores.phq12.color as any}>
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
                  placeholder="e.g., I've been having trouble sleeping lately, or I need help with cognitive, or I'm interested in meditation techniques..."
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
                    Getting AI Analysis...
                  </>
                ) : (
                  'Get AI-Powered Personalized Plan'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Structured Results Section */}
        {result && (
          <div className="space-y-6">
            {result.success ? (
              <>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Your Personalized Mental Health Plan</CardTitle>
                    <CardDescription>
                      Based on your assessment scores and additional information
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Recommendation Sections */}
                <div className="grid gap-6">
                  {result.recommendation_sections.map((section, index) => {
                    const IconComponent = getIcon(section.icon);
                    return (
                      <Card 
                        key={index} 
                        className={`shadow-lg border-l-4 ${getPriorityColor(section.priority)}`}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center text-lg">
                            <IconComponent className="w-6 h-6 mr-3" />
                            {section.title}
                            <Badge 
                              variant={section.priority === 'high' ? 'destructive' : 
                                     section.priority === 'medium' ? 'default' : 'secondary'} 
                              className="ml-2"
                            >
                              {section.priority} priority
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {section.content.map((item, itemIndex) => (
                              <div 
                                key={itemIndex} 
                                className="flex items-start p-3 bg-white rounded border border-gray-200"
                              >
                                <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                                <p className="text-gray-700 leading-relaxed">{item}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Summary Card */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <Users className="w-6 h-6 mr-3 text-blue-600" />
                      <h3 className="text-xl font-semibold text-blue-800">
                        Remember: You're Not Alone
                      </h3>
                    </div>
                    <p className="text-blue-700 leading-relaxed">
                      Mental health is a journey, and seeking help is a sign of strength. 
                      These recommendations are personalized for your current situation. 
                      Consider sharing this plan with a trusted friend, family member, or healthcare provider.
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {result.error || 'An error occurred while generating recommendations.'}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </div>
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