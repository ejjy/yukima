import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/UI/Button';
import { Sparkles, Heart, Shield, Star } from 'lucide-react';

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
      description: 'Tailored routines based on your unique skin needs'
    },
    {
      icon: Shield,
      title: t('welcome.features.budget'),
      description: 'Affordable options that fit your monthly budget'
    },
    {
      icon: Star,
      title: t('welcome.features.indian'),
      description: 'Curated selection of trusted Indian brands'
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

        {/* Features Section */}
        <div className="space-y-6">
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

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-deep-charcoal/60">
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>Made for India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;