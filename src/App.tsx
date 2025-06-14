import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import TestAIButton from './components/UI/TestAIButton';
import Welcome from './pages/Welcome';
import Quiz from './pages/Quiz';
import Auth from './pages/Auth';
import FaceScan from './pages/FaceScan';
import ScanResult from './pages/ScanResult';
import Routine from './pages/Routine';
import DupeFinder from './pages/DupeFinder';
import IngredientAlerts from './pages/IngredientAlerts';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <UserProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Welcome />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/scan" element={<FaceScan />} />
                  <Route path="/scan-result" element={<ScanResult />} />
                  <Route path="/routine" element={<Routine />} />
                  <Route path="/dupes" element={<DupeFinder />} />
                  <Route path="/ingredients" element={<IngredientAlerts />} />
                </Routes>
              </main>
              <Footer />
              
              {/* AI Test Button - Only in development */}
              {import.meta.env.DEV && <TestAIButton />}
            </div>
          </Router>
        </UserProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;