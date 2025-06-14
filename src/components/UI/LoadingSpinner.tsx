import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-soft-gray rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary-blush rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-sm text-deep-charcoal/70 animate-pulse">
        {message || t('common.loading')}
      </p>
    </div>
  );
};

export default LoadingSpinner;