import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/UI/Button';
import { Sparkles, Heart, Shield, Star, Crown, Gem } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleStartJourney = () => {
    navigate('/quiz');
  };

  const features = [
    {
      icon: Heart,
      title: t('welcome.features.personalized'),
      description: 'Tailored routines based on your unique skin needs and age'
    },
    {
      icon: Shield,
      title: t('welcome.features.budget'),
      description: 'From essentials to luxury - options for every budget'
    },
    {
      icon: Star,
      title: t('welcome.features.indian'),
      description: 'Curated selection of trusted Indian and international brands'
    }
  ];

  const ageGroups = [
    {
      range: '18-24',
      icon: '🌱',
      title: 'Prevention & Habits',
      description: 'Build healthy skincare foundations'
    },
    {
      range: '25-30',
      icon: '🌸',
      title: 'Early Anti-Aging',
      description: 'Targeted treatments for first signs'
    },
    {
      range: '31-35',
      icon: '🌺',
      title: 'Advanced Care',
      description: 'Proven ingredients for visible results'
    },
    {
      range: '36-40',
      icon: '👑',
      title: 'Intensive Treatment',
      description: 'Professional-grade solutions'
    },
    {
      range: '41-45',
      icon: '💎',
      title: 'Premium Experience',
      description: 'Luxury formulations for mature skin'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blush/10 via-white to-primary-lavender/10">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-blush to-primary-lavender rounded-full flex items-center justify-center mb-4 animate-pulse-soft shadow-lg">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-deep-charcoal mb-3 animate-fade-in">
              {t('welcome.title')}
            </h1>
            <p className="text-lg text-deep-charcoal/80 leading-relaxed animate-slide-up">
              {t('welcome.subtitle')}
            </p>
          </div>
          
          <Button
            onClick={handleStartJourney}
            size="lg"
            className="w-full max-w-xs animate-slide-up shadow-xl hover:shadow-2xl transform hover:scale-105 bg-golden-amber hover:bg-golden-amber/90 text-white font-semibold"
          >
            {t('welcome.cta')}
          </Button>
        </div>

        {/* Age Groups Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-deep-charcoal text-center mb-6">
            Skincare for Every Life Stage
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {ageGroups.map((group, index) => (
              <div
                key={group.range}
                className="bg-white rounded-lg p-4 shadow-sm border border-soft-gray hover:shadow-md hover:border-primary-blush/30 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{group.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-deep-charcoal">{group.range}</span>
                      <span className="text-xs bg-primary-blush/20 text-primary-blush px-2 py-1 rounded-full">
                        {group.title}
                      </span>
                    </div>
                    <p className="text-sm text-deep-charcoal/70">
                      {group.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-soft-gray hover:shadow-md hover:border-primary-blush/30 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-blush/20 to-primary-lavender/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary-blush" />
                </div>
                <div>
                  <h3 className="font-semibold text-deep-charcoal mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-deep-charcoal/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Features Highlight */}
        <div className="bg-gradient-to-r from-golden-amber/20 to-primary-lavender/20 rounded-xl p-6 mb-8">
          <div className="text-center">
            <Crown className="w-8 h-8 text-golden-amber mx-auto mb-3" />
            <h3 className="font-bold text-deep-charcoal mb-2">
              Premium Experience for 35+ Women
            </h3>
            <p className="text-sm text-deep-charcoal/80 mb-4">
              Advanced anti-aging formulations, luxury brands, and personalized consultations
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-deep-charcoal/70">
              <span>• SK-II & La Mer</span>
              <span>• Custom Formulations</span>
              <span>• Expert Consultations</span>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-deep-charcoal/60">
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>Made for India</span>
            </div>
            <div className="flex items-center space-x-1">
              <Gem className="w-4 h-4" />
              <span>All Ages Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;