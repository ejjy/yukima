import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../utils/supabaseClient';
import Button from '../components/UI/Button';
import { Camera, Upload, AlertTriangle, Shield, ArrowLeft, Sparkles } from 'lucide-react';

const FaceScan: React.FC = () => {
  const navigate = useNavigate();
  const { profile, setScanResult } = useUser();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consent, setConsent] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB.');
        return;
      }

      setSelectedImage(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!consent) {
      setError('Please accept the consent terms to proceed.');
      return;
    }

    if (!selectedImage) {
      setError('Please select an image to analyze.');
      return;
    }

    if (!profile) {
      setError('Please complete the quiz first.');
      return;
    }

    if (!isAuthenticated) {
      setError('Please sign in to use face scan analysis.');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // Convert image to base64
      const base64Image = await convertToBase64(selectedImage);
      
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Authentication required for face scan');
      }

      // Call the face scan analysis edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-face-scan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64Image,
          userProfile: {
            skinType: profile.skinType,
            concerns: profile.concerns,
            ageRange: profile.ageRange
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      // Create scan result object
      const scanResult = {
        skinType: result.result.skinType,
        concerns: result.result.concerns,
        confidence: result.result.confidence,
        recommendations: result.result.recommendations,
        timestamp: new Date()
      };

      setScanResult(scanResult);

      // Clear image data for privacy
      setSelectedImage(null);
      setImagePreview(null);
      
      // Navigate to results
      navigate('/scan-result');

    } catch (error) {
      console.error('Face scan error:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get just the base64 data
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSkip = () => {
    navigate('/routine');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAuthRequired = () => {
    navigate('/auth', { state: { from: { pathname: '/scan' } } });
  };

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
          
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip for now
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blush-400 to-lavender-400 rounded-full flex items-center justify-center mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            AI Skin Analysis
          </h1>
          <p className="text-gray-600">
            Get personalized insights about your skin
          </p>
        </div>

        {/* Auth Required Notice */}
        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">Account Required</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Face scan analysis requires an account to securely process and store your results.
                </p>
                <Button
                  onClick={handleAuthRequired}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-800 font-medium mb-1">
                Important Disclaimer
              </p>
              <p className="text-sm text-amber-700">
                This is an AI-powered analysis for skincare guidance only. For medical skin concerns, 
                please consult a qualified dermatologist.
              </p>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blush-100 mb-6">
          {!imagePreview ? (
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Upload Your Selfie
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Take a clear, well-lit photo of your face for best results
              </p>
              
              <Button
                onClick={handleCameraClick}
                variant="outline"
                className="w-full"
                disabled={!isAuthenticated}
              >
                <Camera className="w-4 h-4 mr-2" />
                Select Photo
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={imagePreview}
                  alt="Selected selfie"
                  className="w-32 h-32 object-cover rounded-full border-4 border-blush-200"
                />
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Great! Your photo is ready for analysis
              </p>
              
              <Button
                onClick={handleCameraClick}
                variant="outline"
                size="sm"
              >
                Change Photo
              </Button>
            </div>
          )}
        </div>

        {/* Consent Section */}
        {isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-blue-800 mb-3">
                  <strong>Privacy & Consent:</strong> I allow Yukima to analyze my selfie for skin assessment. 
                  The image will be processed securely and deleted immediately after analysis. 
                  No images are stored permanently.
                </p>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="w-4 h-4 text-blush-600 border-gray-300 rounded focus:ring-blush-500"
                  />
                  <span className="text-sm text-blue-800 font-medium">
                    I agree to the privacy terms above
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleAnalyze}
            disabled={!consent || !selectedImage || isAnalyzing || !isAuthenticated}
            loading={isAnalyzing}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? 'Analyzing Your Skin...' : 'Analyze My Skin'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSkip}
            className="w-full"
          >
            Skip & Use Quiz Results
          </Button>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Tips for Best Results:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use natural lighting or bright indoor light</li>
            <li>• Face the camera directly with a neutral expression</li>
            <li>• Remove makeup if possible for accurate analysis</li>
            <li>• Ensure your face fills most of the frame</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FaceScan;