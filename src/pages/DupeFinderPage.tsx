import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DupeFinderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dupes, setDupes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock dupe results
    const mockDupes = [
      {
        id: '1',
        original: { name: 'The Ordinary Niacinamide', price: 590, brand: 'The Ordinary' },
        dupe: { name: 'Minimalist Niacinamide', price: 399, brand: 'Minimalist' },
        savings: 191,
        similarity: 95
      },
      {
        id: '2',
        original: { name: 'The Ordinary Niacinamide', price: 590, brand: 'The Ordinary' },
        dupe: { name: 'Good Vibes Niacinamide', price: 299, brand: 'Good Vibes' },
        savings: 291,
        similarity: 88
      }
    ];
    
    setDupes(mockDupes);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Dupe Finder
            </h1>
            <p className="text-gray-600">
              Find affordable alternatives to expensive skincare products
            </p>
          </div>

          <div className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter product name (e.g., The Ordinary Niacinamide)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                onClick={handleSearch}
                disabled={loading || !searchQuery.trim()}
                className="bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {loading ? 'Searching...' : 'Find Dupes'}
              </button>
            </div>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Finding the best dupes for you...</p>
            </div>
          )}

          {dupes.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Found {dupes.length} alternatives
              </h2>
              
              {dupes.map((dupe) => (
                <div key={dupe.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Original</h3>
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium text-gray-800">{dupe.original.name}</h4>
                        <p className="text-sm text-gray-600">{dupe.original.brand}</p>
                        <p className="text-lg font-semibold text-gray-800 mt-2">₹{dupe.original.price}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Alternative</h3>
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium text-gray-800">{dupe.dupe.name}</h4>
                        <p className="text-sm text-gray-600">{dupe.dupe.brand}</p>
                        <p className="text-lg font-semibold text-green-600 mt-2">₹{dupe.dupe.price}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-4">
                      <span className="text-sm text-gray-600">
                        Similarity: <span className="font-semibold text-green-600">{dupe.similarity}%</span>
                      </span>
                      <span className="text-sm text-gray-600">
                        You save: <span className="font-semibold text-green-600">₹{dupe.savings}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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