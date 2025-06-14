import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {t('welcome')}
            </h1>
            <p className="text-gray-600">
              Your AI-powered skincare companion
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => navigate('/quiz')}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {t('get-started')}
            </button>
            
            <button
              onClick={() => navigate('/face-scan')}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {t('skin-analysis')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};