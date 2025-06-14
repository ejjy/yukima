import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const FaceScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    
    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      
      try {
        // Simulate API call to face scan service
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Mock scan result
        const mockResult = {
          success: true,
          skin_type: 'combination',
          concerns: ['acne', 'large_pores'],
          confidence: 87,
          recommendations: [
            'Use a gel-based cleanser twice daily',
            'Apply sunscreen with SPF 30+ every morning',
            'Consider salicylic acid treatment',
            'Use a lightweight moisturizer'
          ]
        };
        
        setScanResult(mockResult);
      } catch (error) {
        console.error('Scan failed:', error);
      } finally {
        setIsScanning(false);
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handleContinue = () => {
    navigate('/routine', { state: { scanResults: scanResult } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!scanResult ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  AI Face Scan
                </h1>
                <p className="text-gray-600">
                  Upload a clear photo of your face for personalized analysis
                </p>
              </div>

              {!isScanning ? (
                <div className="space-y-6">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-rose-400 transition-colors duration-200"
                  >
                    <div className="text-4xl mb-4">📸</div>
                    <p className="text-gray-600">Click to upload photo</p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Back to Home
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-500 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Analyzing your skin...
                  </h3>
                  <p className="text-gray-600">
                    This may take a few moments
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <div className="text-4xl mb-4">✨</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Analysis Complete!
                </h2>
                <p className="text-gray-600">
                  Confidence: {scanResult.confidence}%
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-800 mb-2">Results:</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Skin Type:</strong> {scanResult.skin_type}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Concerns:</strong> {scanResult.concerns.join(', ')}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleContinue}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Get My Routine
                </button>
                
                <button
                  onClick={() => {
                    setScanResult(null);
                    setIsScanning(false);
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Scan Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};