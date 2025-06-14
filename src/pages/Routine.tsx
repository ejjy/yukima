import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { OpenAIService } from '../services/openaiService';
import { Routine as RoutineType, RoutineStep, Product } from '../types';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import CTAPopup from '../components/UI/CTAPopup';
import RoutineStepComponent from '../components/Routine/RoutineStep';
import RoutineProgress from '../components/Routine/RoutineProgress';
import RoutineTimer from '../components/Routine/RoutineTimer';
import { Sun, Moon, ArrowLeft, Sparkles, Search, AlertTriangle, User, Timer, Calendar } from 'lucide-react';

const Routine: React.FC = () => {
  const navigate = useNavigate();
  const { profile, routine, setRoutine, updateRoutineStep, scanResult } = useUser();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<'morning' | 'evening'>('morning');

  useEffect(() => {
    if (!profile) {
      navigate('/quiz');
      return;
    }

    if (!routine) {
      generateRoutine();
    }
  }, [profile, routine]);

  // Show CTA after user completes 5 routine steps (only for authenticated users)
  useEffect(() => {
    if (routine && isAuthenticated) {
      const completedSteps = [...routine.morning, ...routine.evening].filter(step => step.completed).length;
      if (completedSteps >= 5) {
        setTimeout(() => setShowCTA(true), 1000);
      }
    }
  }, [routine, isAuthenticated]);

  // Auto-switch to evening routine after 6 PM
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 18) {
      setCurrentPeriod('evening');
    }
  }, []);

  const generateRoutine = async () => {
    if (!profile) return;

    setLoading(true);
    
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Use scan result if available, otherwise use profile
      const skinType = scanResult?.skinType || profile.skinType;
      const concerns = scanResult?.concerns || profile.concerns;

      // Call OpenAI Service to generate routine
      const routineRecommendation = await OpenAIService.generateRoutine(
        {
          ageRange: profile.ageRange,
          skinType,
          concerns,
          budget: profile.budget,
          productPreference: profile.productPreference
        },
        scanResult ? {
          skinType: scanResult.skinType,
          concerns: scanResult.concerns,
          confidence: scanResult.confidence
        } : undefined
      );

      // Map OpenAI response to application format
      const newRoutine = mapOpenAIResponseToRoutine(routineRecommendation);

      setRoutine(newRoutine);

      // Show auth prompt for unauthenticated users after routine generation
      if (!isAuthenticated) {
        setTimeout(() => setShowAuthPrompt(true), 2000);
      }
    } catch (error) {
      console.error('Error generating routine:', error);
      
      // Fallback to hardcoded mock routine if OpenAI fails
      console.log('Falling back to mock routine...');
      const mockRoutine = createMockRoutine();
      setRoutine(mockRoutine);
    } finally {
      setLoading(false);
    }
  };

  const mapOpenAIResponseToRoutine = (routineRecommendation: any): RoutineType => {
    const mapRoutineSteps = (steps: any[], period: 'morning' | 'evening'): RoutineStep[] => {
      return steps.map((step, index) => {
        // Create Product object from OpenAI response
        const product: Product = {
          id: `${period}-${index}-${step.brand?.toLowerCase().replace(/\s+/g, '-')}-${step.product?.toLowerCase().replace(/\s+/g, '-')}`,
          name: step.product || 'Unknown Product',
          step: step.step?.split('. ')[1] || 'Unknown Step',
          skinType: [profile?.skinType || 'All'],
          concernTags: profile?.concerns || [],
          price: step.price || 0,
          budgetTier: profile?.budget || 999,
          regionalRelevance: getRegionalRelevance(step.brand),
          brand: step.brand || 'Unknown Brand',
          category: step.step?.split('. ')[1] || 'Unknown',
          description: step.reasoning || 'AI-recommended product for your skin type'
        };

        return {
          step: step.step || `${index + 1}. ${step.product}`,
          product,
          completed: false
        };
      });
    };

    const morningSteps = mapRoutineSteps(routineRecommendation.morning || [], 'morning');
    const eveningSteps = mapRoutineSteps(routineRecommendation.evening || [], 'evening');

    return {
      morning: morningSteps,
      evening: eveningSteps,
      totalCost: routineRecommendation.totalCost || 0
    };
  };

  const getRegionalRelevance = (brand: string): 'High' | 'Medium' | 'Low' => {
    const indianBrands = ['Himalaya', 'Biotique', 'Mamaearth', 'Plum', 'Minimalist', 'Dot & Key', 'Lotus', 'Lakme'];
    const internationalBrands = ['Cetaphil', 'Neutrogena', 'Olay', 'The Ordinary', 'L\'Oreal'];
    
    if (indianBrands.some(indianBrand => brand?.toLowerCase().includes(indianBrand.toLowerCase()))) {
      return 'High';
    } else if (internationalBrands.some(intlBrand => brand?.toLowerCase().includes(intlBrand.toLowerCase()))) {
      return 'Medium';
    }
    return 'Low';
  };

  const createMockRoutine = (): RoutineType => {
    const mockMorningSteps: RoutineStep[] = [
      {
        step: '1. Cleanser',
        product: {
          id: 'mock-cleanser',
          name: 'Gentle Face Wash',
          step: 'Cleanser',
          skinType: [profile?.skinType || 'Normal'],
          concernTags: profile?.concerns || [],
          price: 299,
          budgetTier: 299,
          regionalRelevance: 'Medium',
          brand: 'Cetaphil',
          category: 'Cleanser',
          description: 'Gentle cleanser suitable for daily use'
        },
        completed: false
      },
      {
        step: '2. Moisturizer',
        product: {
          id: 'mock-moisturizer',
          name: 'Daily Moisturizer',
          step: 'Moisturizer',
          skinType: [profile?.skinType || 'Normal'],
          concernTags: profile?.concerns || [],
          price: 299,
          budgetTier: 499,
          regionalRelevance: 'Medium',
          brand: 'Neutrogena',
          category: 'Moisturizer',
          description: 'Lightweight daily moisturizer'
        },
        completed: false
      },
      {
        step: '3. Sunscreen',
        product: {
          id: 'mock-sunscreen',
          name: 'Sunscreen SPF 30',
          step: 'Sunscreen',
          skinType: ['All'],
          concernTags: ['Sun Protection'],
          price: 220,
          budgetTier: 299,
          regionalRelevance: 'High',
          brand: 'Lotus',
          category: 'Sunscreen',
          description: 'Essential daily sun protection'
        },
        completed: false
      }
    ];

    const mockEveningSteps: RoutineStep[] = [
      {
        step: '1. Cleanser',
        product: {
          id: 'mock-cleanser-evening',
          name: 'Gentle Face Wash',
          step: 'Cleanser',
          skinType: [profile?.skinType || 'Normal'],
          concernTags: profile?.concerns || [],
          price: 299,
          budgetTier: 299,
          regionalRelevance: 'Medium',
          brand: 'Cetaphil',
          category: 'Cleanser',
          description: 'Remove daily impurities'
        },
        completed: false
      },
      {
        step: '2. Night Cream',
        product: {
          id: 'mock-night-cream',
          name: 'Night Recovery Cream',
          step: 'Moisturizer',
          skinType: [profile?.skinType || 'Normal'],
          concernTags: profile?.concerns || [],
          price: 450,
          budgetTier: 999,
          regionalRelevance: 'Medium',
          brand: 'Olay',
          category: 'Night Treatment',
          description: 'Overnight skin repair and hydration'
        },
        completed: false
      }
    ];

    return {
      morning: mockMorningSteps,
      evening: mockEveningSteps,
      totalCost: 1267
    };
  };

  const handleStepToggle = (period: 'morning' | 'evening', stepIndex: number) => {
    if (!routine) return;
    
    const currentStep = routine[period][stepIndex];
    updateRoutineStep(period, stepIndex, !currentStep.completed);

    // Track routine step completion
    if (window.trackRoutineStep) {
      window.trackRoutineStep(`${period}-${stepIndex}`);
    }
  };

  const handleProductSwap = async (period: 'morning' | 'evening', stepIndex: number, newProduct: Product) => {
    if (!routine) return;

    const updatedRoutine = { ...routine };
    const oldProduct = updatedRoutine[period][stepIndex].product;
    
    // Update the product
    updatedRoutine[period][stepIndex].product = newProduct;
    
    // Recalculate total cost
    const newTotalCost = [...updatedRoutine.morning, ...updatedRoutine.evening]
      .reduce((sum, step) => sum + step.product.price, 0);
    
    updatedRoutine.totalCost = newTotalCost;
    
    setRoutine(updatedRoutine);
  };

  const handleBackToQuiz = () => {
    navigate('/quiz');
  };

  const handleFaceScan = () => {
    navigate('/scan');
  };

  const handleFindDupes = () => {
    navigate('/dupes');
  };

  const handleCheckIngredients = () => {
    navigate('/ingredients');
  };

  const handleAuthPrompt = () => {
    navigate('/auth', { state: { from: { pathname: '/routine' } } });
  };

  const handleTimerComplete = () => {
    setActiveTimer(null);
    // Could trigger a notification or celebration animation here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blush-50 via-white to-lavender-50 flex items-center justify-center">
        <LoadingSpinner message="Creating your personalized routine..." />
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blush-50 via-white to-lavender-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to generate routine</p>
          <Button onClick={handleBackToQuiz}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quiz
          </Button>
        </div>
      </div>
    );
  }

  const currentRoutineSteps = currentPeriod === 'morning' ? routine.morning : routine.evening;
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 via-white to-lavender-50">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blush-400 to-lavender-400 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {greeting}! ✨
          </h1>
          <p className="text-gray-600">
            {profile?.skinType.toLowerCase()} skin • ₹{profile?.budget} budget
            {scanResult && (
              <span className="block text-sm text-blush-600 mt-1">
                Enhanced with AI skin analysis
              </span>
            )}
          </p>
        </div>

        {/* Progress Overview - Only show for authenticated users */}
        {isAuthenticated && <RoutineProgress routine={routine} />}

        {/* Period Toggle */}
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-blush-100 mb-6">
          <button
            onClick={() => setCurrentPeriod('morning')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
              currentPeriod === 'morning'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span className="font-medium">Morning</span>
          </button>
          <button
            onClick={() => setCurrentPeriod('evening')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
              currentPeriod === 'evening'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span className="font-medium">Evening</span>
          </button>
        </div>

        {/* Total Cost */}
        <div className={`rounded-xl p-6 text-white mb-6 ${
          routine.totalCost <= (profile?.budget || 0)
            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
            : 'bg-gradient-to-r from-blush-500 to-lavender-500'
        }`}>
          <div className="text-center">
            <p className="text-white/80 mb-1">{t('routine.total')}</p>
            <p className="text-3xl font-bold">₹{routine.totalCost}</p>
            <p className="text-sm text-white/80 mt-1">
              {routine.totalCost <= (profile?.budget || 0) 
                ? 'Within budget ✨' 
                : `₹${routine.totalCost - (profile?.budget || 0)} over budget`
              }
            </p>
          </div>
        </div>

        {/* Auth Prompt for Unauthenticated Users */}
        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">Save Your Routine</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Create an account to save your personalized routine and track your progress.
                </p>
                <Button
                  onClick={handleAuthPrompt}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions - Only show timer for authenticated users */}
        <div className={`grid ${isAuthenticated ? 'grid-cols-3' : 'grid-cols-2'} gap-2 mb-6`}>
          <Button
            variant="outline"
            onClick={handleFindDupes}
            className="flex flex-col items-center space-y-1 py-3 text-xs"
          >
            <Search className="w-4 h-4" />
            <span>Find Dupes</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={handleCheckIngredients}
            className="flex flex-col items-center space-y-1 py-3 text-xs"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Ingredients</span>
          </Button>

          {/* Timer only for authenticated users */}
          {isAuthenticated && (
            <Button
              variant="outline"
              onClick={() => setActiveTimer(activeTimer ? null : 'routine')}
              className="flex flex-col items-center space-y-1 py-3 text-xs"
            >
              <Timer className="w-4 h-4" />
              <span>Timer</span>
            </Button>
          )}
        </div>

        {/* Active Timer - Only for authenticated users */}
        {isAuthenticated && activeTimer && currentRoutineSteps.length > 0 && (
          <div className="mb-6">
            <RoutineTimer
              stepName={currentRoutineSteps[0].step.split('. ')[1]}
              onComplete={handleTimerComplete}
            />
          </div>
        )}

        {/* Current Routine Steps */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              {currentPeriod === 'morning' ? (
                <>
                  <Sun className="w-5 h-5 text-yellow-600" />
                  <span>Morning Routine</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 text-indigo-600" />
                  <span>Evening Routine</span>
                </>
              )}
            </h2>
            {/* Only show completion count for authenticated users */}
            {isAuthenticated && (
              <span className="text-sm text-gray-500">
                {currentRoutineSteps.filter(step => step.completed).length}/{currentRoutineSteps.length} done
              </span>
            )}
          </div>
          
          {currentRoutineSteps.map((step, index) => (
            <RoutineStepComponent
              key={index}
              step={step}
              stepIndex={index}
              period={currentPeriod}
              onToggleComplete={handleStepToggle}
              onSwapProduct={handleProductSwap}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {!scanResult && (
            <Button
              onClick={handleFaceScan}
              className="w-full"
              size="lg"
            >
              Try Face Scan for Better Results
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={handleBackToQuiz}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retake Quiz
          </Button>
        </div>

        {/* CTA Popup - Only for authenticated users */}
        {isAuthenticated && (
          <CTAPopup
            isOpen={showCTA}
            onClose={() => setShowCTA(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Routine;