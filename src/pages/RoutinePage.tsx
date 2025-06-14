import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  benefits: string[];
}

export const RoutinePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState<{
    morning: Product[];
    evening: Product[];
    totalCost: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate routine generation
    const generateRoutine = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock routine data
      const mockRoutine = {
        morning: [
          {
            id: '1',
            name: 'Gentle Cleanser',
            brand: 'Cetaphil',
            category: 'cleanser',
            price: 299,
            benefits: ['Gentle cleansing', 'Maintains skin barrier']
          },
          {
            id: '2',
            name: 'Vitamin C Serum',
            brand: 'Dot & Key',
            category: 'serum',
            price: 845,
            benefits: ['Brightening', 'Antioxidant protection']
          },
          {
            id: '3',
            name: 'Moisturizer',
            brand: 'Neutrogena',
            category: 'moisturizer',
            price: 299,
            benefits: ['Lightweight hydration', 'Non-comedogenic']
          },
          {
            id: '4',
            name: 'Sunscreen SPF 50',
            brand: 'Neutrogena',
            category: 'sunscreen',
            price: 499,
            benefits: ['Broad spectrum protection', 'Non-greasy']
          }
        ],
        evening: [
          {
            id: '5',
            name: 'Gentle Cleanser',
            brand: 'Cetaphil',
            category: 'cleanser',
            price: 299,
            benefits: ['Gentle cleansing', 'Maintains skin barrier']
          },
          {
            id: '6',
            name: 'Niacinamide Serum',
            brand: 'Minimalist',
            category: 'serum',
            price: 399,
            benefits: ['Pore minimizing', 'Oil control']
          },
          {
            id: '7',
            name: 'Night Moisturizer',
            brand: 'Olay',
            category: 'moisturizer',
            price: 899,
            benefits: ['Anti-aging', 'Skin renewal']
          }
        ],
        totalCost: 1942
      };
      
      setRoutine(mockRoutine);
      setLoading(false);
    };

    generateRoutine();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Creating your personalized routine...
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Your Personalized Routine
            </h1>
            <p className="text-gray-600">
              Total Cost: ₹{routine?.totalCost}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Morning Routine */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                🌅 Morning Routine
              </h2>
              <div className="space-y-4">
                {routine?.morning.map((product, index) => (
                  <div key={product.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {index + 1}. {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                      </div>
                      <span className="text-rose-600 font-semibold">
                        ₹{product.price}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.benefits.join(' • ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evening Routine */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                🌙 Evening Routine
              </h2>
              <div className="space-y-4">
                {routine?.evening.map((product, index) => (
                  <div key={product.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {index + 1}. {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                      </div>
                      <span className="text-rose-600 font-semibold">
                        ₹{product.price}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.benefits.join(' • ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4 justify-center">
            <button
              onClick={() => navigate('/dupe-finder')}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Find Dupes
            </button>
            <button
              onClick={() => navigate('/ingredient-analyzer')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Analyze Ingredients
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};