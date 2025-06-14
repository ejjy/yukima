import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { WelcomePage } from './pages/WelcomePage';
import { QuizPage } from './pages/QuizPage';
import { FaceScanPage } from './pages/FaceScanPage';
import { RoutinePage } from './pages/RoutinePage';
import { DupeFinderPage } from './pages/DupeFinderPage';
import { IngredientAnalyzerPage } from './pages/IngredientAnalyzerPage';
import { TestBackendButton } from './components/UI/TestBackendButton';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/face-scan" element={<FaceScanPage />} />
              <Route path="/routine" element={<RoutinePage />} />
              <Route path="/dupe-finder" element={<DupeFinderPage />} />
              <Route path="/ingredient-analyzer" element={<IngredientAnalyzerPage />} />
            </Routes>
            <TestBackendButton />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;