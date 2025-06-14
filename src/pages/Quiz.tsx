import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import Button from '../components/UI/Button';
import { UserProfile } from '../types';
import { ChevronLeft, ChevronRight, Shield, Sparkles } from 'lucide-react';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setProfile } = useUser();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    consent: false
  });

  const steps = [
    {
      key: 'ageRange',
      title: t('quiz.age'),
      subtitle: 'This helps us recommend age-appropriate products and routines',
      options: [
        { 
          value: '18-24', 
          label: '18-24 years',
          description: 'Focus on prevention and establishing good habits'
        },
        { 
          value: '25-30', 
          label: '25-30 years',
          description: 'Early anti-aging and targeted treatments'
        },
        { 
          value: '31-35', 
          label: '31-35 years',
          description: 'Advanced skincare with proven ingredients'
        },
        { 
          value: '36-40', 
          label: '36-40 years',
          description: 'Intensive anti-aging and skin renewal'
        },
        { 
          value: '41-45', 
          label: '41-45 years',
          description: 'Premium treatments for mature skin concerns'
        }
      ]
    },
    {
      key: 'skinType',
      title: t('quiz.skinType'),
      subtitle: 'Choose the option that best describes your skin',
      options: [
        { 
          value: 'Oily', 
          label: 'Oily', 
          description: 'Shiny appearance, large pores, frequent breakouts'
        },
        { 
          value: 'Dry', 
          label: 'Dry', 
          description: 'Tight feeling, flaky patches, rough texture'
        },
        { 
          value: 'Combo', 
          label: 'Combination', 
          description: 'Oily T-zone (forehead, nose, chin), dry cheeks'
        },
        { 
          value: 'Sensitive', 
          label: 'Sensitive', 
          description: 'Easily irritated, redness, stinging with products'
        },
        { 
          value: 'Normal', 
          label: 'Normal', 
          description: 'Balanced, not too oily or dry, minimal issues'
        },
        { 
          value: 'Acne-prone', 
          label: 'Acne-prone', 
          description: 'Frequent breakouts, blackheads, inflamed pimples'
        },
        { 
          value: 'Mature', 
          label: 'Mature', 
          description: 'Fine lines, loss of elasticity, age spots'
        }
      ]
    },
    {
      key: 'concerns',
      title: t('quiz.concerns'),
      subtitle: 'Select all that apply to your skin (multiple selections allowed)',
      multiple: true,
      options: [
        { value: 'Acne', label: 'Acne & Breakouts' },
        { value: 'Dullness', label: 'Dull Skin' },
        { value: 'Pigmentation', label: 'Dark Spots & Pigmentation' },
        { value: 'Dryness', label: 'Dryness & Dehydration' },
        { value: 'Fine Lines', label: 'Fine Lines & Wrinkles' },
        { value: 'Large Pores', label: 'Large Pores' },
        { value: 'Dark Circles', label: 'Dark Circles' },
        { value: 'Tan', label: 'Tan & Sun Damage' },
        { value: 'Sensitivity', label: 'Skin Sensitivity' },
        { value: 'Uneven Texture', label: 'Uneven Skin Texture' },
        { value: 'Sagging', label: 'Loss of Firmness' },
        { value: 'Age Spots', label: 'Age Spots & Melasma' }
      ]
    },
    {
      key: 'budget',
      title: t('quiz.budget'),
      subtitle: 'Your monthly skincare budget helps us find the right products',
      options: [
        { 
          value: 299, 
          label: '₹299 - Essential basics',
          description: 'Cleanser, moisturizer, sunscreen'
        },
        { 
          value: 499, 
          label: '₹499 - Complete routine',
          description: 'Basic routine + targeted treatments'
        },
        { 
          value: 999, 
          label: '₹999 - Premium care',
          description: 'Advanced products + serums'
        },
        { 
          value: 1499, 
          label: '₹1499 - Luxury experience',
          description: 'High-end brands + specialized treatments'
        }
      ]
    },
    {
      key: 'productPreference',
      title: t('quiz.preference'),
      subtitle: 'Your preference helps us curate the right brands for you',
      options: [
        { 
          value: 'Ayurvedic', 
          label: 'Ayurvedic & Traditional',
          description: 'Himalaya, Biotique, Forest Essentials'
        },
        { 
          value: 'Natural', 
          label: 'Natural & Organic',
          description: 'Mamaearth, Plum, WOW Skin Science'
        },
        { 
          value: 'Premium', 
          label: 'Premium & International',
          description: 'Olay, L\'Oreal, The Ordinary, SK-II'
        },
        { 
          value: 'Doesn\'t Matter', 
          label: 'No preference',
          description: 'Best products regardless of brand type'
        }
      ]
    },
    {
      key: 'language',
      title: t('quiz.language'),
      subtitle: 'Choose your preferred language for the app',
      options: [
        { value: 'English', label: 'English' },
        { value: 'Hindi', label: 'हिंदी (Hindi)' }
      ]
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = currentStepData.multiple 
    ? (formData[currentStepData.key as keyof UserProfile] as string[])?.length > 0
    : formData[currentStepData.key as keyof UserProfile] !== undefined;

  const handleOptionSelect = (value: any) => {
    if (currentStepData.multiple) {
      const currentValues = (formData[currentStepData.key as keyof UserProfile] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      setFormData(prev => ({
        ...prev,
        [currentStepData.key]: newValues
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [currentStepData.key]: value
      }));
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (!formData.consent) {
      alert('Please accept the privacy notice to continue.');
      return;
    }

    const profile: UserProfile = {
      ageRange: formData.ageRange as UserProfile['ageRange'],
      skinType: formData.skinType as UserProfile['skinType'],
      concerns: formData.concerns as string[],
      budget: formData.budget as UserProfile['budget'],
      productPreference: formData.productPreference as UserProfile['productPreference'],
      language: formData.language as UserProfile['language'],
      consent: formData.consent
    };

    setProfile(profile);
    navigate('/routine');
  };

  const isOptionSelected = (value: any) => {
    if (currentStepData.multiple) {
      return ((formData[currentStepData.key as keyof UserProfile] as string[]) || []).includes(value);
    }
    return formData[currentStepData.key as keyof UserProfile] === value;
  };

  const getAgeGroupIcon = (ageRange: string) => {
    const icons = {
      '18-24': '🌱',
      '25-30': '🌸',
      '31-35': '🌺',
      '36-40': '👑',
      '41-45': '💎'
    };
    return icons[ageRange as keyof typeof icons] || '✨';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blush/10 via-white to-primary-lavender/10">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-deep-charcoal">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-deep-charcoal/60">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-soft-gray rounded-full h-3 shadow-inner">
            <div
              className="bg-gradient-to-r from-primary-lavender to-primary-blush h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Quiz Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-blush to-primary-lavender rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-deep-charcoal mb-2">
            {t('quiz.title')}
          </h1>
          <p className="text-deep-charcoal/70">
            {t('quiz.subtitle')}
          </p>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-soft-gray mb-6">
          <h2 className="text-lg font-semibold text-deep-charcoal mb-2">
            {currentStepData.title}
          </h2>
          {currentStepData.subtitle && (
            <p className="text-sm text-deep-charcoal/70 mb-4">
              {currentStepData.subtitle}
            </p>
          )}
          
          <div className="space-y-3">
            {currentStepData.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  isOptionSelected(option.value)
                    ? 'border-primary-blush bg-primary-blush/10 text-deep-charcoal shadow-md'
                    : 'border-soft-gray hover:border-primary-blush/50 hover:bg-primary-blush/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {currentStepData.key === 'ageRange' && (
                        <span className="text-lg">
                          {getAgeGroupIcon(option.value)}
                        </span>
                      )}
                      <span className="font-medium text-deep-charcoal block">
                        {option.label}
                      </span>
                    </div>
                    {option.description && (
                      <span className="text-sm text-deep-charcoal/60 mt-1 block">
                        {option.description}
                      </span>
                    )}
                  </div>
                  {isOptionSelected(option.value) && (
                    <div className="w-5 h-5 bg-primary-blush rounded-full flex items-center justify-center shadow-sm ml-3">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Age-specific insights */}
        {currentStepData.key === 'ageRange' && formData.ageRange && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">
                {getAgeGroupIcon(formData.ageRange)}
              </span>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Perfect! Here's what we'll focus on:
                </h3>
                <div className="text-sm text-blue-800">
                  {formData.ageRange === '18-24' && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Building healthy skincare habits</li>
                      <li>Prevention-focused products</li>
                      <li>Budget-friendly essentials</li>
                    </ul>
                  )}
                  {formData.ageRange === '25-30' && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Early anti-aging prevention</li>
                      <li>Targeted treatments for specific concerns</li>
                      <li>Professional-grade ingredients</li>
                    </ul>
                  )}
                  {formData.ageRange === '31-35' && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Advanced anti-aging formulations</li>
                      <li>Proven ingredients like retinol & peptides</li>
                      <li>Comprehensive skincare routines</li>
                    </ul>
                  )}
                  {formData.ageRange === '36-40' && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Intensive anti-aging treatments</li>
                      <li>Skin renewal and repair focus</li>
                      <li>Premium ingredient combinations</li>
                    </ul>
                  )}
                  {formData.ageRange === '41-45' && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Luxury anti-aging solutions</li>
                      <li>Mature skin specialized treatments</li>
                      <li>High-performance active ingredients</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        {isLastStep && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 mb-3">
                  {t('quiz.privacy')}
                </p>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                    className="w-4 h-4 text-primary-blush border-gray-300 rounded focus:ring-primary-blush"
                  />
                  <span className="text-sm text-blue-800">
                    I agree to the privacy notice
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t('quiz.back')}</span>
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed || (isLastStep && !formData.consent)}
            className={`flex items-center space-x-1 ${
              isLastStep ? 'bg-golden-amber hover:bg-golden-amber/90 text-white font-semibold' : ''
            }`}
          >
            <span>{isLastStep ? t('quiz.submit') : t('quiz.next')}</span>
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>

        {/* Age Range Benefits */}
        {currentStep === 0 && (
          <div className="mt-8 bg-gradient-to-r from-primary-blush/10 to-primary-lavender/10 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2 text-center">
              ✨ Why Age Matters in Skincare
            </h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>• <strong>18-24:</strong> Focus on prevention and habit building</p>
              <p>• <strong>25-30:</strong> Early intervention with targeted treatments</p>
              <p>• <strong>31-35:</strong> Advanced formulations for visible results</p>
              <p>• <strong>36-40:</strong> Intensive care for mature skin needs</p>
              <p>• <strong>41-45:</strong> Premium solutions for sophisticated concerns</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;