import React, { useState } from 'react';
import { testOpenAIIntegration } from '../../utils/testOpenAI';

interface TestResult {
  test: string;
  status: 'pass' | 'fail';
  message: string;
  duration?: number;
  data?: any;
}

export const TestOpenAIButton: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    passed: number;
    failed: number;
    results: TestResult[];
  } | null>(null);

  const handleTest = async () => {
    setIsRunning(true);
    setResults(null);
    
    try {
      const testResults = await testOpenAIIntegration();
      setResults(testResults);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: 'pass' | 'fail') => {
    return status === 'pass' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (status: 'pass' | 'fail') => {
    return status === 'pass' ? '✅' : '❌';
  };

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={handleTest}
        disabled={isRunning}
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 text-sm font-medium"
      >
        {isRunning ? '🤖 Testing OpenAI...' : '🤖 Test OpenAI'}
      </button>

      {results && (
        <div className="absolute bottom-full left-0 mb-2 w-96 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              🤖 OpenAI Integration Test Results ({results.passed + results.failed})
            </h3>
            <div className="text-sm mb-2">
              <span className="text-green-600">✅ {results.passed}</span>
              {' | '}
              <span className="text-red-600">❌ {results.failed}</span>
              {' | '}
              <span className="text-blue-600">
                {Math.round((results.passed / (results.passed + results.failed)) * 100)}% Success
              </span>
            </div>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.results.map((result, index) => (
              <div key={index} className="text-xs">
                <span className={getStatusColor(result.status)}>
                  {getStatusIcon(result.status)} {result.test}
                </span>
                <div className="text-gray-600 ml-4 truncate" title={result.message}>
                  {result.message}
                  {result.duration && ` (${result.duration}ms)`}
                </div>
                {result.data && result.status === 'pass' && (
                  <div className="text-blue-600 ml-4 text-xs">
                    {result.test === 'Face Scan Analysis' && `Detected: ${result.data.skinType}, Confidence: ${result.data.confidence}%`}
                    {result.test === 'Ingredient Analysis' && `Safety: ${result.data.overall_safety}%, Ingredients: ${result.data.results?.length}`}
                    {result.test === 'Routine Generation' && `Products: ${(result.data.morning_routine?.length || 0) + (result.data.evening_routine?.length || 0)}, Cost: ₹${result.data.total_cost}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};