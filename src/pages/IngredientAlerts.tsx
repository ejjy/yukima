import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { IngredientService } from '../services/ingredientService';
import { IngredientAlert } from '../types';
import Button from '../components/UI/Button';
import CTAPopup from '../components/UI/CTAPopup';
import { AlertTriangle, Search, ArrowLeft, Shield, Info, CheckCircle, Loader } from 'lucide-react';

const IngredientAlerts: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useUser();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [ingredientList, setIngredientList] = useState('');
  const [alerts, setAlerts] = useState<IngredientAlert[]>([]);
  const [showCTA, setShowCTA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'single' | 'multiple'>('single');

  const handleAnalyzeIngredients = async () => {
    const ingredients = analysisMode === 'single' 
      ? [searchTerm.trim()]
      : ingredientList.split(/[,\n]/).map(i => i.trim()).filter(i => i.length > 0);

    if (ingredients.length === 0) {
      alert('Please enter at least one ingredient to analyze.');
      return;
    }

    setLoading(true);
    
    try {
      // Try to get alerts from Supabase first
      const allAlerts = await IngredientService.getAllIngredientAlerts();
      const matchingAlerts = allAlerts.filter(alert => 
        ingredients.some(ingredient => 
          alert.ingredient.toLowerCase().includes(ingredient.toLowerCase()) ||
          ingredient.toLowerCase().includes(alert.ingredient.toLowerCase())
        )
      );

      setAlerts(matchingAlerts);

      // Show CTA popup after 2 searches for unauthenticated users
      if (!isAuthenticated) {
        const searchCount = parseInt(sessionStorage.getItem('ingredient_searches') || '0') + 1;
        sessionStorage.setItem('ingredient_searches', searchCount.toString());
        
        if (searchCount >= 2) {
          setTimeout(() => setShowCTA(true), 1500);
        }
      }

    } catch (error) {
      console.error('Ingredient analysis error:', error);
      
      // Fallback to mock data
      try {
        const { searchIngredients } = await import('../data/ingredientAlerts');
        const results = await searchIngredients(ingredients[0] || '');
        setAlerts(results);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        alert('Analysis failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const AlertCard: React.FC<{ alert: IngredientAlert }> = ({ alert }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-blush-100">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 capitalize">{alert.ingredient}</h3>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
              High Risk
            </span>
          </div>
          
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Risk:</h4>
            <p className="text-sm text-red-700">{alert.risk}</p>
          </div>

          <div className="mb-3">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Description:</h4>
            <p className="text-sm text-gray-700">{alert.description}</p>
          </div>

          {alert.avoidFor.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Avoid if you have:</h4>
              <div className="flex flex-wrap gap-1">
                {alert.avoidFor.map((condition, index) => (
                  <span
                    key={index}
                    className={`inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs ${
                      profile?.skinType === condition ? 'ring-2 ring-yellow-500' : ''
                    }`}
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {alert.alternatives.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Better Alternatives:
              </h4>
              <div className="flex flex-wrap gap-1">
                {alert.alternatives.map((alternative, index) => (
                  <span
                    key={index}
                    className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
                  >
                    {alternative}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
          
          <h1 className="text-xl font-bold text-gray-900">Ingredient Analysis</h1>
          
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>

        {/* Analysis Mode Toggle */}
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-blush-100 mb-6">
          <button
            onClick={() => setAnalysisMode('single')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              analysisMode === 'single'
                ? 'bg-blush-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Single Ingredient
          </button>
          <button
            onClick={() => setAnalysisMode('multiple')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              analysisMode === 'multiple'
                ? 'bg-blush-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Product Formula
          </button>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blush-100 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-blush-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {analysisMode === 'single' ? 'Analyze Ingredient' : 'Analyze Product Formula'}
            </h2>
          </div>
          
          <div className="space-y-4">
            {analysisMode === 'single' ? (
              <div>
                <input
                  type="text"
                  placeholder="Enter ingredient name (e.g., niacinamide, retinol)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyzeIngredients()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blush-500 focus:border-transparent"
                />
              </div>
            ) : (
              <div>
                <textarea
                  placeholder="Enter ingredients separated by commas or new lines&#10;Example:&#10;Water, Niacinamide, Hyaluronic Acid, Glycerin"
                  value={ingredientList}
                  onChange={(e) => setIngredientList(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blush-500 focus:border-transparent resize-none"
                />
              </div>
            )}
            
            <Button 
              onClick={handleAnalyzeIngredients} 
              className="w-full"
              disabled={loading}
              loading={loading}
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze {analysisMode === 'single' ? 'Ingredient' : 'Formula'}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {alerts.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Safety Alerts
                </h3>
                <span className="text-sm text-gray-500">
                  {alerts.length} alert{alerts.length !== 1 ? 's' : ''} found
                </span>
              </div>
              
              {profile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-800">
                        <strong>Personalized for {profile.skinType.toLowerCase()} skin</strong>
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Alerts are filtered based on your skin type and concerns.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {alerts.map((alert, index) => (
                <AlertCard key={index} alert={alert} />
              ))}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to Analyze
              </h3>
              <p className="text-gray-600 mb-4">
                Enter ingredient names above to get detailed safety analysis and personalized recommendations.
              </p>
            </div>
          )}
        </div>

        {/* Educational Note */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> This analysis is for educational purposes. Individual reactions may vary. 
                Always patch test new products and consult a dermatologist for specific concerns.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Popup */}
        <CTAPopup
          isOpen={showCTA}
          onClose={() => setShowCTA(false)}
        />
      </div>
    </div>
  );
};

export default IngredientAlerts;