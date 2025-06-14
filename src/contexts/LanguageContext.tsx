import React, { createContext, useContext, useState } from 'react';

type Language = 'english' | 'hindi' | 'tamil' | 'telugu' | 'bengali' | 'marathi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Basic translations - can be expanded
const translations: Record<Language, Record<string, string>> = {
  english: {
    welcome: 'Welcome to Yukima',
    'get-started': 'Get Started',
    'skin-analysis': 'Skin Analysis',
    'personalized-routine': 'Personalized Routine',
  },
  hindi: {
    welcome: 'युकिमा में आपका स्वागत है',
    'get-started': 'शुरू करें',
    'skin-analysis': 'त्वचा विश्लेषण',
    'personalized-routine': 'व्यक्तिगत दिनचर्या',
  },
  tamil: {
    welcome: 'யுகிமாவிற்கு வரவேற்கிறோம்',
    'get-started': 'தொடங்குங்கள்',
    'skin-analysis': 'தோல் பகுப்பாய்வு',
    'personalized-routine': 'தனிப்பட்ட வழக்கம்',
  },
  telugu: {
    welcome: 'యుకిమాకు స్వాగతం',
    'get-started': 'ప్రారంభించండి',
    'skin-analysis': 'చర్మ విశ్లేషణ',
    'personalized-routine': 'వ్యక్తిగత దినచర్య',
  },
  bengali: {
    welcome: 'যুকিমায় স্বাগতম',
    'get-started': 'শুরু করুন',
    'skin-analysis': 'ত্বক বিশ্লেষণ',
    'personalized-routine': 'ব্যক্তিগত রুটিন',
  },
  marathi: {
    welcome: 'युकिमामध्ये आपले स्वागत आहे',
    'get-started': 'सुरुवात करा',
    'skin-analysis': 'त्वचा विश्लेषण',
    'personalized-routine': 'वैयक्तिक दिनचर्या',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('english');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};