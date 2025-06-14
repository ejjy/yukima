import React, { useState } from 'react';
import { RoutineStep as RoutineStepType, Product } from '../../types';
import { getRecommendedProducts } from '../../data/products';
import { useUser } from '../../contexts/UserContext';
import Button from '../UI/Button';
import { Check, RefreshCw, Info, Star, ShoppingCart, Clock } from 'lucide-react';

interface RoutineStepProps {
  step: RoutineStepType;
  stepIndex: number;
  period: 'morning' | 'evening';
  onToggleComplete: (period: 'morning' | 'evening', stepIndex: number) => void;
  onSwapProduct: (period: 'morning' | 'evening', stepIndex: number, newProduct: Product) => void;
}

const RoutineStep: React.FC<RoutineStepProps> = ({
  step,
  stepIndex,
  period,
  onToggleComplete,
  onSwapProduct
}) => {
  const { profile } = useUser();
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [alternatives, setAlternatives] = useState<Product[]>([]);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);

  const handleShowAlternatives = async () => {
    if (!profile) return;

    setLoadingAlternatives(true);
    setShowAlternatives(true);

    // Get alternative products for this step
    const allProducts = await getRecommendedProducts(
      profile.skinType,
      profile.concerns,
      profile.budget * 2, // Expand budget range for alternatives
      profile.productPreference
    );

    const stepType = step.step.split('. ')[1]; // Extract step type from "1. Cleanser"
    const alternativeProducts = allProducts
      .filter(p => p.step === stepType && p.id !== step.product.id)
      .slice(0, 3); // Show top 3 alternatives

    setAlternatives(alternativeProducts);
    setLoadingAlternatives(false);
  };

  const handleSwapProduct = (newProduct: Product) => {
    onSwapProduct(period, stepIndex, newProduct);
    setShowAlternatives(false);
  };

  const getStepIcon = (stepName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'Cleanser': '🧼',
      'Toner': '💧',
      'Serum': '✨',
      'Moisturizer': '🧴',
      'Sunscreen': '☀️',
      'Mask': '🎭'
    };
    return icons[stepName] || '💄';
  };

  const stepName = step.step.split('. ')[1];

  return (
    <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
      step.completed
        ? 'border-green-300 bg-green-50 shadow-sm'
        : 'border-gray-200 hover:border-blush-200 hover:shadow-md'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getStepIcon(stepName)}</div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {step.step}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-blush-100 text-blush-700 px-2 py-1 rounded-full">
                {step.product.brand}
              </span>
              {step.product.regionalRelevance === 'High' && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Indian Brand
                </span>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onToggleComplete(period, stepIndex)}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            step.completed
              ? 'border-green-500 bg-green-500 text-white shadow-md'
              : 'border-gray-300 hover:border-blush-400 hover:bg-blush-50'
          }`}
        >
          {step.completed && <Check className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="mb-3">
        <h4 className="font-medium text-blush-600 mb-1">{step.product.name}</h4>
        <p className="text-sm text-gray-600 mb-2">{step.product.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-bold text-gray-900">₹{step.product.price}</span>
            {step.product.concernTags.length > 0 && (
              <div className="flex items-center space-x-1">
                <Info className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">
                  For {step.product.concernTags.slice(0, 2).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShowAlternatives}
          className="flex-1 text-xs"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Swap Product
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
        >
          <ShoppingCart className="w-3 h-3 mr-1" />
          Buy Now
        </Button>
      </div>

      {/* Usage Instructions */}
      {step.completed && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Usage Tip</p>
              <p className="text-xs text-blue-800">
                {stepName === 'Cleanser' && 'Massage gently for 30 seconds, then rinse with lukewarm water.'}
                {stepName === 'Toner' && 'Apply with cotton pad or pat gently with hands. Wait 1-2 minutes before next step.'}
                {stepName === 'Serum' && 'Apply 2-3 drops and gently pat into skin. Allow to absorb for 2-3 minutes.'}
                {stepName === 'Moisturizer' && 'Apply in upward circular motions. Don\'t forget your neck!'}
                {stepName === 'Sunscreen' && 'Apply generously 15 minutes before sun exposure. Reapply every 2 hours.'}
                {stepName === 'Mask' && 'Use 2-3 times per week. Apply evenly and leave for 10-15 minutes.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alternatives Modal */}
      {showAlternatives && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Alternative {stepName}s
                </h3>
                <button
                  onClick={() => setShowAlternatives(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  ×
                </button>
              </div>

              {loadingAlternatives ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-blush-200 border-t-blush-500 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Finding alternatives...</p>
                </div>
              ) : alternatives.length > 0 ? (
                <div className="space-y-3">
                  {alternatives.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blush-200 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-blush-600">₹{product.price}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {product.brand}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          {product.price > step.product.price ? (
                            <span className="text-red-600">+₹{product.price - step.product.price}</span>
                          ) : product.price < step.product.price ? (
                            <span className="text-green-600">-₹{step.product.price - product.price}</span>
                          ) : (
                            <span>Same price</span>
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => handleSwapProduct(product)}
                          className="text-xs"
                        >
                          Use This
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No alternatives found for your preferences.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineStep;