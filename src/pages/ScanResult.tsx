import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { ScanResult as ScanResultType } from '../types';
import { Sparkles, CheckCircle, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';

const ScanResult: React.FC = () => {
  const navigate = useNavigate();
  const { profile, scanResult, setScanResult } = useUser();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) {
      navigate('/quiz');
      return;
    }

    if (!scanResult) {
      generateMockScanResult();
    } else {
      setLoading(false);
    }
  }, [profile, scanResult]);

  const generateMockScanResult = () => {
    if (!profile) return;

    // Generate plausible results based on quiz inputs
    const mockResult = createMockAnalysis(profile.skinType, profile.concerns);
    
    setTimeout(() => {
      setScanResult(mockResult);
      setLoading(false);
    }, 2000);
  };

  const createMockAnalysis = (skinType: string, concerns: string[]): ScanResultType => {
    const analysisMap: { [key: string]: any } = {
      'Oily': {
        detectedType: 'Oily',
        detectedConcerns: ['Excess Oil Production', 'Enlarged Pores'],
        confidence: 87,
        recommendations: [
          'Use oil-controlling cleansers with salicylic acid',
          'Apply lightweight, non-comedogenic moisturizers',
          'Consider niacinamide serums for pore refinement',
          'Never skip sunscreen - choose gel-based formulas'
        ]
      },
      'Dry': {
        detectedType: 'Dry',
        detectedConcerns: ['Dehydration', 'Rough Texture'],
        confidence: 82,
        recommendations: [
          'Use gentle, cream-based cleansers',
          'Apply hyaluronic acid serums for hydration',
          'Use rich moisturizers with ceramides',
          'Consider overnight hydrating masks'
        ]
      },
      'Combo': {
        detectedType: 'Combination',
        detectedConcerns: ['Mixed Skin Zones', 'Uneven Texture'],
        confidence: 79,
        recommendations: [
          'Use different products for T-zone and cheeks',
          'Apply lightweight moisturizer on oily areas',
          'Use hydrating products on dry areas',
          'Consider multi-masking approach'
        ]
      },
      'Sensitive': {
        detectedType: 'Sensitive',
        detectedConcerns: ['Reactivity', 'Redness'],
        confidence: 85,
        recommendations: [
          'Choose fragrance-free, hypoallergenic products',
          'Patch test new products before full use',
          'Use gentle, pH-balanced cleansers',
          'Apply mineral sunscreens for protection'
        ]
      }
    };

    const baseAnalysis = analysisMap[skinType] || analysisMap['Combo'];
    
    // Add concern-specific recommendations
    const concernRecommendations: { [key: string]: string } = {
      'Acne': 'Incorporate salicylic acid or benzoyl peroxide treatments',
      'Dullness': 'Use vitamin C serums and gentle exfoliating acids',
      'Pigmentation': 'Apply niacinamide and vitamin C for brightening',
      'Fine Lines': 'Consider retinol products and peptide serums',
      'Dark Circles': 'Use caffeine-based eye creams and get adequate sleep'
    };

    const additionalRecs = concerns
      .filter(concern => concernRecommendations[concern])
      .map(concern => concernRecommendations[concern]);

    return {
      skinType: baseAnalysis.detectedType,
      concerns: [...baseAnalysis.detectedConcerns, ...concerns.slice(0, 2)],
      confidence: baseAnalysis.confidence,
      recommendations: [...baseAnalysis.recommendations, ...additionalRecs].slice(0, 6),
      timestamp: new Date()
    };
  };

  const handleContinueToRoutine = () => {
    navigate('/routine');
  };

  const handleRetakeScan = () => {
    setScanResult(null);
    navigate('/scan');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blush-50 via-white to-lavender-50 flex items-center justify-center">
        <LoadingSpinner message="Analyzing your skin..." />
      </div>
    );
  }

  if (!scanResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blush-50 via-white to-lavender-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load scan results</p>
          <Button onClick={() => navigate('/scan')}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return CheckCircle;
    return AlertCircle;
  };

  const ConfidenceIcon = getConfidenceIcon(scanResult.confidence);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 via-white to-lavender-50">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blush-400 to-lavender-400 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Skin Analysis
          </h1>
          <p className="text-gray-600">
            AI-powered insights for your skincare journey
          </p>
        </div>

        {/* Confidence Score */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blush-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Analysis Confidence</h2>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getConfidenceColor(scanResult.confidence)}`}>
              <ConfidenceIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{scanResult.confidence}%</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blush-500 to-lavender-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${scanResult.confidence}%` }}
            />
          </div>
        </div>

        {/* Detected Skin Type */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blush-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Detected Skin Type</h2>
          <div className="bg-blush-50 rounded-lg p-4">
            <p className="text-xl font-bold text-blush-700 mb-2">{scanResult.skinType}</p>
            <p className="text-sm text-gray-600">
              Based on your facial analysis and quiz responses
            </p>
          </div>
        </div>

        {/* Detected Concerns */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blush-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Areas to Address</h2>
          <div className="space-y-2">
            {scanResult.concerns.map((concern, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blush-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 font-medium">{concern}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blush-100 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personalized Recommendations</h2>
          <div className="space-y-3">
            {scanResult.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blush-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blush-600">{index + 1}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleContinueToRoutine}
            className="w-full"
            size="lg"
          >
            Get My Personalized Routine
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            variant="outline"
            onClick={handleRetakeScan}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Scan
          </Button>
        </div>

        {/* Timestamp */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Analysis completed on {scanResult.timestamp.toLocaleDateString()} at{' '}
            {scanResult.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScanResult;