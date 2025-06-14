import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { Globe, Sparkles, User, LogOut, Bell, History } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut, isAuthenticated } = useAuth();
  const { clearSession, notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);

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

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const handleViewHistory = () => {
    navigate('/routine-history');
  };

  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="bg-white shadow-sm border-b border-soft-gray sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Clickable Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary-blush focus:ring-offset-2 rounded-lg p-1"
          aria-label="Go to home page"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary-blush to-primary-lavender rounded-full flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-blush to-primary-lavender bg-clip-text text-transparent">
            Yukima
          </h1>
        </button>
        
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

          {/* Notifications Bell - Only for authenticated users */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 rounded-full hover:bg-soft-gray transition-colors duration-200"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-deep-charcoal" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-blush text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs text-primary-blush hover:text-primary-blush/80"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <p className="text-sm text-gray-800 mb-1">{notification.message}</p>
                          <p className="text-xs text-gray-500">
                            {formatNotificationTime(notification.created_at)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No notifications yet
                      </div>
                    )}
                  </div>
                  
                  {notifications.length > 5 && (
                    <div className="p-3 border-t border-gray-100 text-center">
                      <button className="text-xs text-primary-blush hover:text-primary-blush/80">
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Routine History - Only for authenticated users */}
          {isAuthenticated && (
            <button
              onClick={handleViewHistory}
              className="p-1.5 rounded-full hover:bg-soft-gray transition-colors duration-200"
              aria-label="Routine history"
            >
              <History className="w-4 h-4 text-deep-charcoal" />
            </button>
          )}

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

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
};

export default Header;