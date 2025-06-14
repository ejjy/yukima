import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'English' | 'Hindi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  English: {
    // Navigation
    'nav.home': 'Home',
    'nav.quiz': 'Quiz',
    'nav.routine': 'Routine',
    'nav.scan': 'Face Scan',
    'nav.dupes': 'Dupes',
    'nav.ingredients': 'Ingredients',
    
    // Welcome Page
    'welcome.title': 'Your Glow Journey Starts Here',
    'welcome.subtitle': 'AI-powered skincare routines tailored for Indian women',
    'welcome.cta': 'Start Glow Journey',
    'welcome.features.personalized': 'Personalized for your skin',
    'welcome.features.budget': 'Budget-friendly options',
    'welcome.features.indian': 'Indian brands focus',
    
    // Quiz
    'quiz.title': 'Tell Us About Your Skin',
    'quiz.subtitle': 'Help us create your perfect routine',
    'quiz.age': 'Age Range',
    'quiz.skinType': 'Skin Type',
    'quiz.concerns': 'Skin Concerns',
    'quiz.budget': 'Monthly Budget',
    'quiz.preference': 'Product Preference',
    'quiz.language': 'Preferred Language',
    'quiz.next': 'Next',
    'quiz.back': 'Back',
    'quiz.submit': 'Get My Routine',
    'quiz.privacy': 'Your data is stored securely for personalization and deleted after session.',
    
    // Face Scan
    'scan.title': 'AI Skin Analysis',
    'scan.subtitle': 'Get personalized insights about your skin',
    'scan.upload': 'Upload Your Selfie',
    'scan.analyze': 'Analyze My Skin',
    'scan.skip': 'Skip & Use Quiz Results',
    'scan.consent': 'I allow Yukima to analyze my selfie for skin assessment',
    'scan.disclaimer': 'This is a basic analysis. Consult a dermatologist for medical advice.',
    
    // Routine
    'routine.title': 'Your Personalized Routine',
    'routine.morning': 'Morning Routine',
    'routine.evening': 'Evening Routine',
    'routine.total': 'Total Cost',
    'routine.step': 'Step',
    'routine.completed': 'Mark as completed',
    
    // Dupes
    'dupes.title': 'Product Alternatives',
    'dupes.search': 'Find cheaper alternatives',
    'dupes.savings': 'Best Savings',
    
    // Ingredients
    'ingredients.title': 'Ingredient Safety',
    'ingredients.check': 'Check ingredients for your skin type',
    'ingredients.alerts': 'Safety Alerts',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Try Again',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.skip': 'Skip',
    'common.start': 'Start',
  },
  Hindi: {
    // Navigation
    'nav.home': 'होम',
    'nav.quiz': 'प्रश्नावली',
    'nav.routine': 'दिनचर्या',
    'nav.scan': 'फेस स्कैन',
    'nav.dupes': 'विकल्प',
    'nav.ingredients': 'सामग्री',
    
    // Welcome Page
    'welcome.title': 'आपकी चमक की यात्रा यहाँ शुरू होती है',
    'welcome.subtitle': 'भारतीय महिलाओं के लिए AI-संचालित स्किनकेयर रूटीन',
    'welcome.cta': 'शुरू करें',
    'welcome.features.personalized': 'आपकी त्वचा के लिए व्यक्तिगत',
    'welcome.features.budget': 'बजट-अनुकूल विकल्प',
    'welcome.features.indian': 'भारतीय ब्रांड्स पर फोकस',
    
    // Quiz
    'quiz.title': 'अपनी त्वचा के बारे में बताएं',
    'quiz.subtitle': 'हमें आपका परफेक्ट रूटीन बनाने में मदद करें',
    'quiz.age': 'आयु सीमा',
    'quiz.skinType': 'त्वचा का प्रकार',
    'quiz.concerns': 'त्वचा की समस्याएं',
    'quiz.budget': 'मासिक बजट',
    'quiz.preference': 'उत्पाद प्राथमिकता',
    'quiz.language': 'पसंदीदा भाषा',
    'quiz.next': 'आगे',
    'quiz.back': 'पीछे',
    'quiz.submit': 'मेरा रूटीन पाएं',
    'quiz.privacy': 'आपका डेटा व्यक्तिगतकरण के लिए सुरक्षित रूप से संग्रहीत है और सत्र के बाद हटा दिया जाता है।',
    
    // Face Scan
    'scan.title': 'AI त्वचा विश्लेषण',
    'scan.subtitle': 'अपनी त्वचा के बारे में व्यक्तिगत जानकारी प्राप्त करें',
    'scan.upload': 'अपनी सेल्फी अपलोड करें',
    'scan.analyze': 'मेरी त्वचा का विश्लेषण करें',
    'scan.skip': 'छोड़ें और प्रश्नावली परिणाम का उपयोग करें',
    'scan.consent': 'मैं युकिमा को त्वचा मूल्यांकन के लिए मेरी सेल्फी का विश्लेषण करने की अनुमति देता हूं',
    'scan.disclaimer': 'यह एक बुनियादी विश्लेषण है। चिकित्सा सलाह के लिए त्वचा विशेषज्ञ से सलाह लें।',
    
    // Routine
    'routine.title': 'आपका व्यक्तिगत रूटीन',
    'routine.morning': 'सुबह का रूटीन',
    'routine.evening': 'शाम का रूटीन',
    'routine.total': 'कुल लागत',
    'routine.step': 'चरण',
    'routine.completed': 'पूर्ण के रूप में चिह्नित करें',
    
    // Dupes
    'dupes.title': 'उत्पाद विकल्प',
    'dupes.search': 'सस्ते विकल्प खोजें',
    'dupes.savings': 'सबसे अच्छी बचत',
    
    // Ingredients
    'ingredients.title': 'सामग्री सुरक्षा',
    'ingredients.check': 'अपनी त्वचा के प्रकार के लिए सामग्री की जांच करें',
    'ingredients.alerts': 'सुरक्षा चेतावनी',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'कुछ गलत हुआ',
    'common.retry': 'फिर कोशिश करें',
    'common.close': 'बंद करें',
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.back': 'पीछे',
    'common.next': 'आगे',
    'common.skip': 'छोड़ें',
    'common.start': 'शुरू करें',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('English');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['English']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};