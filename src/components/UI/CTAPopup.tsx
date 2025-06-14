import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from './Button';
import { X, Crown, Star, Shield, Zap } from 'lucide-react';

interface CTAPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CTAPopup: React.FC<CTAPopupProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    // Track CTA click
    if (window.trackCTAClick) {
      window.trackCTAClick('Premium Upgrade');
    }
    
    // For MVP, just show coming soon message
    alert('Coming Soon! We\'ll notify you when premium features are available.');
    onClose();
  };

  const handleNotInterested = () => {
    setShowFeedback(true);
  };

  const handleFeedbackSubmit = () => {
    // Track feedback
    if (window.trackCTAClick) {
      window.trackCTAClick(`Feedback: ${selectedReason}`);
    }
    
    alert('Thank you for your feedback! It helps us improve Yukima.');
    onClose();
  };

  const feedbackOptions = [
    'Too expensive',
    'Not interested in premium features',
    'Happy with current features',
    'Want to try free version longer',
    'Missing features I need',
    'Other'
  ];

  const premiumFeatures = [
    {
      icon: Crown,
      title: 'Advanced Routines',
      description: 'Personalized 7-day cycles with seasonal adjustments'
    },
    {
      icon: Star,
      title: 'Premium Dupes',
      description: 'Access to 500+ product alternatives and comparisons'
    },
    {
      icon: Shield,
      title: 'Ingredient Scanner',
      description: 'Real-time ingredient analysis and safety alerts'
    },
    {
      icon: Zap,
      title: 'Priority Support',
      description: 'Direct access to skincare experts and faster responses'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {!showFeedback ? (
          <>
            {/* Header */}
            <div className="relative p-6 pb-4">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-soft-gray transition-colors"
              >
                <X className="w-5 h-5 text-deep-charcoal/60" />
              </button>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-blush to-primary-lavender rounded-full flex items-center justify-center mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-deep-charcoal mb-2">
                  Unlock Premium Glow
                </h2>
                <p className="text-deep-charcoal/70">
                  Get advanced features tailored for your skin journey
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="px-6 pb-4">
              <div className="space-y-4">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary-blush/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-primary-blush" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-deep-charcoal mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-deep-charcoal/70">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="px-6 pb-4">
              <div className="bg-gradient-to-r from-primary-blush/20 to-primary-lavender/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-deep-charcoal mb-1">
                  ₹49<span className="text-lg font-normal text-deep-charcoal/70">/month</span>
                </div>
                <p className="text-sm text-deep-charcoal/70">
                  Cancel anytime • 7-day free trial
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-2 space-y-3">
              <Button
                onClick={handleUpgradeClick}
                className="w-full bg-golden-amber hover:bg-golden-amber/90 text-white"
                size="lg"
              >
                Start Free Trial
              </Button>
              
              <button
                onClick={handleNotInterested}
                className="w-full text-center text-sm text-deep-charcoal/60 hover:text-deep-charcoal transition-colors py-2"
              >
                Not interested right now
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Feedback Form */}
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-deep-charcoal mb-2">
                  Help Us Improve
                </h2>
                <p className="text-deep-charcoal/70">
                  Why didn't you choose to upgrade? Your feedback helps us serve you better.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {feedbackOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedReason(option)}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedReason === option
                        ? 'border-primary-blush bg-soft-gray text-deep-charcoal'
                        : 'border-soft-gray hover:border-primary-blush/50 hover:bg-primary-blush/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-deep-charcoal">{option}</span>
                      {selectedReason === option && (
                        <div className="w-5 h-5 bg-primary-blush rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleFeedbackSubmit}
                  disabled={!selectedReason}
                  className="w-full"
                >
                  Submit Feedback
                </Button>
                
                <button
                  onClick={onClose}
                  className="w-full text-center text-sm text-deep-charcoal/60 hover:text-deep-charcoal transition-colors py-2"
                >
                  Skip
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CTAPopup;