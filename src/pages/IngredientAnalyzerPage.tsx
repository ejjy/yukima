import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const IngredientAnalyzerPage: React.FC = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!ingredients.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis results
    const mockAnalysis = {
      overall_safety: 85,
      results: [
        {
          name: 'Niacinamide',
          safety_score: 95,
          compatibility: 'excellent',
          benefits: ['Reduces pore appearance', 'Controls oil production', 'Brightens skin'],
          warnings: ['May cause flushing in high concentrations']
        },
        {
          name: 'Salicylic Acid',
          safety_score: 85,
          compatibility: 'good',
          benefits: ['Unclogs pores', 'Reduces acne', 'Gentle exfoliation'],
          warnings: ['Can cause dryness', 'Increase sun sensitivity']
        }
      ],
      recommendations: [
        'Great ingredients for your skin: Niacinamide',
        'This ingredient combination looks safe for your skin type'
      ]
    };
    
    setAnalysis(mockAnalysis);
    setLoading(false);
  };

  const getCompatibilityColor = (compatibility: string) => {
    switch (compatibility) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'caution': return 'text-yellow-600 bg-yellow-50';
      case 'avoid': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Ingredient Analyzer
            </h1>
            <p className="text-gray-600">
              Analyze skincare ingredients for safety and compatibility
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter ingredients (comma-separated)
            </label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g., niacinamide, salicylic acid, hyaluronic acid"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !ingredients.trim()}
              className="mt-4 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {loading ? 'Analyzing...' : 'Analyze Ingredients'}
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing ingredients...</p>
            </div>
          )}

          {analysis && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Overall Safety Score: {analysis.overall_safety}/100
                </h2>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${analysis.overall_safety}%` }}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Ingredient Analysis
                </h3>
                <div className="space-y-4">
                  {analysis.results.map((result: any, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800">{result.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Safety: {result.safety_score}/100
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCompatibilityColor(result.compatibility)}`}>
                            {result.compatibility}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-green-700 mb-1">Benefits:</h5>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {result.benefits.map((benefit: string, i: number) => (
                              <li key={i}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-orange-700 mb-1">Warnings:</h5>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {result.warnings.map((warning: string, i: number) => (
                              <li key={i}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Recommendations:</h3>
                <ul className="text-sm text-blue-700 list-disc list-inside">
                  {analysis.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};