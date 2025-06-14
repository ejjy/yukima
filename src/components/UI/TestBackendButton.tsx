import React, { useState } from 'react';
import { testBackendIntegration } from '../../utils/testBackend';

interface TestResult {
  test: string;
  status: 'pass' | 'fail';
  message: string;
  duration?: number;
}

export const TestBackendButton: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    backend: { passed: number; failed: number; results: TestResult[] };
    ai: { passed: number; failed: number; results: TestResult[] };
  } | null>(null);

  const handleTest = async () => {
    setIsRunning(true);
    setResults(null);
    
    try {
      const testResults = await testBackendIntegration();
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
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleTest}
        disabled={isRunning}
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 text-sm font-medium"
      >
        {isRunning ? '🧪 Testing...' : '🧪 Test Backend & AI'}
      </button>

      {results && (
        <div className="absolute bottom-full right-0 mb-2 w-96 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          <div className="space-y-4">
            {/* Backend Results */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                🗄️ Backend Tests ({results.backend.passed + results.backend.failed})
              </h3>
              <div className="text-sm mb-2">
                <span className="text-green-600">✅ {results.backend.passed}</span>
                {' | '}
                <span className="text-red-600">❌ {results.backend.failed}</span>
                {' | '}
                <span className="text-blue-600">
                  {Math.round((results.backend.passed / (results.backend.passed + results.backend.failed)) * 100)}% Success
                </span>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {results.backend.results.map((result, index) => (
                  <div key={index} className="text-xs">
                    <span className={getStatusColor(result.status)}>
                      {getStatusIcon(result.status)} {result.test}
                    </span>
                    <div className="text-gray-600 ml-4 truncate" title={result.message}>
                      {result.message}
                      {result.duration && ` (${result.duration}ms)`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Results */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                🤖 AI Tests ({results.ai.passed + results.ai.failed})
              </h3>
              <div className="text-sm mb-2">
                <span className="text-green-600">✅ {results.ai.passed}</span>
                {' | '}
                <span className="text-red-600">❌ {results.ai.failed}</span>
                {' | '}
                <span className="text-blue-600">
                  {Math.round((results.ai.passed / (results.ai.passed + results.ai.failed)) * 100)}% Success
                </span>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {results.ai.results.map((result, index) => (
                  <div key={index} className="text-xs">
                    <span className={getStatusColor(result.status)}>
                      {getStatusIcon(result.status)} {result.test}
                    </span>
                    <div className="text-gray-600 ml-4 truncate" title={result.message}>
                      {result.message}
                      {result.duration && ` (${result.duration}ms)`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};