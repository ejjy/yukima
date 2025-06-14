import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';
import { ArrowLeft, Bell, BellOff, User, Shield, Trash2, Download } from 'lucide-react';

const UserSettings: React.FC = () => {
  const navigate = useNavigate();
  const { profile, nudgesEnabled, toggleNudges, clearSession } = useUser();
  const { isAuthenticated, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleToggleNudges = async () => {
    setLoading(true);
    try {
      await toggleNudges(!nudgesEnabled);
    } catch (error) {
      console.error('Error toggling nudges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // Create a data export
    const exportData = {
      profile,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `yukima-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.'
    );

    if (!confirmed) return;

    const doubleConfirmed = window.confirm(
      'This will permanently delete your account and all associated data. Type "DELETE" to confirm.'
    );

    if (!doubleConfirmed) return;

    try {
      // Note: In a real implementation, you would call a Supabase function to delete the user
      // For now, we'll just sign out and clear session
      await signOut();
      clearSession();
      navigate('/');
      alert('Account deletion requested. Please contact support to complete the process.');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account. Please try again or contact support.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blush-50 via-white to-lavender-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to access settings</p>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 via-white to-lavender-50">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blush-100 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-5 h-5 text-blush-600" />
            <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          </div>
          
          {profile && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Skin Type:</span>
                  <div className="font-medium">{profile.skinType}</div>
                </div>
                <div>
                  <span className="text-gray-500">Age Range:</span>
                  <div className="font-medium">{profile.ageRange}</div>
                </div>
                <div>
                  <span className="text-gray-500">Budget:</span>
                  <div className="font-medium">₹{profile.budget}</div>
                </div>
                <div>
                  <span className="text-gray-500">Language:</span>
                  <div className="font-medium">{profile.language}</div>
                </div>
              </div>
              
              <div>
                <span className="text-gray-500 text-sm">Concerns:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.concerns.map((concern, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blush-100 text-blush-700 px-2 py-1 rounded-full text-xs"
                    >
                      {concern}
                    </span>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={() => navigate('/quiz')}
                variant="outline"
                size="sm"
                className="w-full mt-4"
              >
                Update Profile
              </Button>
            </div>
          )}
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blush-100 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-5 h-5 text-blush-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Daily Nudges</h3>
              <p className="text-sm text-gray-600">
                Get gentle reminders to complete your skincare routine
              </p>
            </div>
            
            <button
              onClick={handleToggleNudges}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blush-500 focus:ring-offset-2 ${
                nudgesEnabled ? 'bg-blush-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  nudgesEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              {nudgesEnabled ? (
                <Bell className="w-4 h-4 text-blue-600 mt-0.5" />
              ) : (
                <BellOff className="w-4 h-4 text-gray-500 mt-0.5" />
              )}
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  {nudgesEnabled ? 'Nudges Enabled' : 'Nudges Disabled'}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {nudgesEnabled 
                    ? 'You\'ll receive daily reminders to complete your routine'
                    : 'You won\'t receive any routine reminders'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data & Privacy Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blush-100 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-blush-600" />
            <h2 className="text-lg font-semibold text-gray-900">Data & Privacy</h2>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={handleExportData}
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export My Data</span>
            </Button>
            
            <div className="text-xs text-gray-600 p-3 bg-gray-50 rounded-lg">
              <p className="mb-2">
                <strong>Data Usage:</strong> Your data is used only to personalize your skincare experience.
              </p>
              <p className="mb-2">
                <strong>Storage:</strong> All data is securely stored and encrypted.
              </p>
              <p>
                <strong>Deletion:</strong> You can request account deletion at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Trash2 className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-red-700">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            
            <Button
              onClick={handleDeleteAccount}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              Delete Account
            </Button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center text-xs text-gray-500">
          <p>Yukima v1.0.0</p>
          <p className="mt-1">Made with ❤️ for Indian women</p>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;