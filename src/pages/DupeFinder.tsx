import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { dupes, findDupes, getDupesByCategory, getBestSavings } from '../data/dupes';
import { Dupe } from '../types';
import Button from '../components/UI/Button';
import CTAPopup from '../components/UI/CTAPopup';
import { Search, TrendingDown, ArrowLeft, Sparkles, IndianRupee } from 'lucide-react';

const DupeFinder: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResults, setSearchResults] = useState<Dupe[]>([]);
  const [showCTA, setShowCTA] = useState(false);
  const [viewMode, setViewMode] = useState<'search' | 'category' | 'savings'>('search');

  const categories = ['Cleanser', 'Serum', 'Moisturizer', 'Sunscreen', 'Mask', 'Toner', 'Eye Care'];

  useEffect(() => {
    // Show best savings by default
    if (viewMode === 'savings') {
      setSearchResults(getBestSavings());
    }
  }, [viewMode]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    const results = findDupes(searchTerm, selectedCategory);
    setSearchResults(results);
    setViewMode('search');
    
    // Show CTA popup after 3 searches
    const searchCount = parseInt(sessionStorage.getItem('dupe_searches') || '0') + 1;
    sessionStorage.setItem('dupe_searches', searchCount.toString());
    
    if (searchCount >= 3) {
      setTimeout(() => setShowCTA(true), 2000);
    }
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    const results = getDupesByCategory(category);
    setSearchResults(results);
    setViewMode('category');
  };

  const handleShowBestSavings = () => {
    setViewMode('savings');
    setSearchResults(getBestSavings());
  };

  const handleBack = () => {
    navigate(-1);
  };

  const DupeCard: React.FC<{ dupe: Dupe }> = ({ dupe }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-blush-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{dupe.originalProduct}</h3>
          <p className="text-sm text-gray-600">vs</p>
          <h4 className="font-semibold text-blush-600 mb-2">{dupe.dupeName}</h4>
        </div>
        <div className="text-right">
          <span className="text-xs bg-blush-100 text-blush-700 px-2 py-1 rounded-full">
            {dupe.category}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Original Price</p>
          <p className="text-lg font-bold text-gray-900">₹{dupe.originalPrice}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Dupe Price</p>
          <p className="text-lg font-bold text-blush-600">₹{dupe.dupePrice}</p>
        </div>
      </div>
      
      {dupe.savings > 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              Save ₹{dupe.savings}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Premium Alternative
            </span>
          </div>
        </div>
      )}
      
      <p className="text-sm text-gray-600 mb-3">{dupe.reason}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{dupe.brand}</span>
        <Button size="sm" variant="outline">
          Add to Routine
        </Button>
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
          
          <h1 className="text-xl font-bold text-gray-900">Dupe Finder</h1>
          
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blush-100 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="w-5 h-5 text-blush-600" />
            <h2 className="text-lg font-semibold text-gray-900">Find Product Alternatives</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Search for a product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blush-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blush-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <Button onClick={handleSearch} className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Find Dupes
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            variant="outline"
            onClick={handleShowBestSavings}
            className="flex items-center justify-center space-x-2"
          >
            <IndianRupee className="w-4 h-4" />
            <span>Best Savings</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleCategoryFilter('Serum')}
            className="flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Serums</span>
          </Button>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blush-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-blush-50 hover:text-blush-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {searchResults.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {viewMode === 'savings' && 'Best Money-Saving Dupes'}
                  {viewMode === 'category' && `${selectedCategory} Alternatives`}
                  {viewMode === 'search' && `Results for "${searchTerm}"`}
                </h3>
                <span className="text-sm text-gray-500">
                  {searchResults.length} found
                </span>
              </div>
              
              {searchResults.map(dupe => (
                <DupeCard key={dupe.id} dupe={dupe} />
              ))}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {viewMode === 'search' ? 'No dupes found' : 'Start Your Search'}
              </h3>
              <p className="text-gray-600 mb-4">
                {viewMode === 'search' 
                  ? 'Try searching for a different product or category'
                  : 'Search for products to find budget-friendly alternatives'
                }
              </p>
              {viewMode !== 'savings' && (
                <Button onClick={handleShowBestSavings} variant="outline">
                  View Best Savings
                </Button>
              )}
            </div>
          )}
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

export default DupeFinder;