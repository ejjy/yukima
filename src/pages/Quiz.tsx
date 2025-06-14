import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import Button from '../components/UI/Button';
import { UserProfile } from '../types';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';

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
      options: [
        { value: '18-24', label: '18-24 years' },
        { value: '25-30', label: '25-30 years' },
        { value: '31-35', label: '31-35 years' }
      ]
    },
    {
      key: 'skinType',
      title: t('quiz.skinType'),
      options: [
        { value: 'Oily', label: 'Oily - Shiny, large pores' },
        { value: 'Dry', label: 'Dry - Tight, flaky' },
        { value: 'Combo', label: 'Combination - Oily T-zone, dry cheeks' },
        { value: 'Sensitive', label: 'Sensitive - Easily irritated' }
      ]
    },
    {
      key: 'concerns',
      title: t('quiz.concerns'),
      multiple: true,
      options: [
        { value: 'Acne', label: 'Acne & Breakouts' },
        { value: 'Dullness', label: 'Dull Skin' },
        { value: 'Pigmentation', label: 'Dark Spots & Pigmentation' },
        { value: 'Dryness', label: 'Dryness & Dehydration' },
        { value: 'Fine Lines', label: 'Fine Lines & Aging' },
        { value: 'Large Pores', label: 'Large Pores' },
        { value: 'Dark Circles', label: 'Dark Circles' },
        { value: 'Tan', label: 'Tan & Sun Damage' }
      ]
    },
    {
      key: 'budget',
      title: t('quiz.budget'),
      options: [
        { value: 299, label: '₹299 - Basic essentials' },
        { value: 499, label: '₹499 - Complete routine' },
        { value: 999, label: '₹999 - Premium products' }
      ]
    },
    {
      key: 'productPreference',
      title: t('quiz.preference'),
      options: [
        { value: 'Ayurvedic', label: 'Ayurvedic - Traditional herbs' },
        { value: 'Natural', label: 'Natural - Organic ingredients' },
        { value: 'Doesn\'t Matter', label: 'No preference' }
      ]
    },
    {
      key: 'language',
      title: t('quiz.language'),
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
          <h1 className="text-2xl font-bold text-deep-charcoal mb-2">
            {t('quiz.title')}
          </h1>
          <p className="text-deep-charcoal/70">
            {t('quiz.subtitle')}
          </p>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-soft-gray mb-6">
          <h2 className="text-lg font-semibold text-deep-charcoal mb-4">
            {currentStepData.title}
          </h2>
          
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
                  <span className="font-medium text-deep-charcoal">{option.label}</span>
                  {isOptionSelected(option.value) && (
                    <div className="w-5 h-5 bg-primary-blush rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default Quiz;