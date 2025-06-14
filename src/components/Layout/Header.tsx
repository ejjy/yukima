import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { Globe, Sparkles, User, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut, isAuthenticated } = useAuth();
  const { clearSession } = useUser();

  const toggleLanguage = () => {
    setLanguage(language === 'English' ? 'Hindi' : 'English');
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      clearSession();
      navigate('/');
    }
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  return (
    <header className="bg-white shadow-sm border-b border-soft-gray sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-blush to-primary-lavender rounded-full flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-blush to-primary-lavender bg-clip-text text-transparent">
            Yukima
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-soft-gray hover:bg-primary-blush/10 hover:border-primary-blush/20 transition-colors duration-200 border border-transparent"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4 text-deep-charcoal" />
            <span className="text-sm font-medium text-deep-charcoal">
              {language === 'English' ? 'हिं' : 'EN'}
            </span>
          </button>

          {/* Auth Button */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
                <User className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-full hover:bg-soft-gray transition-colors duration-200"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4 text-deep-charcoal" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAuthClick}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-primary-blush hover:bg-primary-blush/90 text-white transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;