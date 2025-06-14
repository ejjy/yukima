import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-soft-gray mt-auto">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-sm text-deep-charcoal flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-primary-blush fill-current" />
            <span>for Indian women</span>
          </p>
          <p className="text-xs text-deep-charcoal/70 mt-2">
            © 2024 Yukima. Your glow journey starts here.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;