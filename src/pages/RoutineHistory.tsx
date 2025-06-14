import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { ArrowLeft, Calendar, TrendingUp, Sparkles, Sun, Moon, DollarSign } from 'lucide-react';

interface RoutineHistoryItem {
  id: string;
  morning_routine: any[];
  evening_routine: any[];
  total_cost: number;
  ai_generated: boolean;
  confidence_score: number;
  created_at: string;
  updated_at: string;
  total_steps: number;
  detected_skin_type: string;
}

const RoutineHistory: React.FC = () => {
  const navigate = useNavigate();
  const { routineHistory, loadRoutineHistory, setRoutine } = useUser();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineHistoryItem | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      await loadRoutineHistory();
      setLoading(false);
    };

    loadData();
  }, [isAuthenticated, loadRoutineHistory, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleUseRoutine = (historyItem: RoutineHistoryItem) => {
    // Convert history item back to current routine format
    const routine = {
      morning: historyItem.morning_routine,
      evening: historyItem.evening_routine,
      totalCost: historyItem.total_cost
    };

    setRoutine(routine);
    navigate('/routine');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const RoutineCard: React.FC<{ routine: RoutineHistoryItem }> = ({ routine }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-blush-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">
              {formatDate(routine.created_at)}
            </span>
            <span className="text-xs text-gray-500">
              at {formatTime(routine.created_at)}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">Skin Type:</span>
              <span className="text-sm font-medium text-gray-700 capitalize">
                {routine.detected_skin_type.toLowerCase()}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">Steps:</span>
              <span className="text-sm font-medium text-gray-700">
                {routine.total_steps}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          {routine.ai_generated && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(routine.confidence_score)}`}>
              AI {routine.confidence_score}%
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-lg font-bold text-gray-900">₹{routine.total_cost}</span>
          </div>
        </div>
      </div>

      {/* Routine Preview */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Sun className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">Morning</span>
          </div>
          <div className="space-y-1">
            {routine.morning_routine.slice(0, 3).map((step: any, index: number) => (
              <div key={index} className="text-xs text-gray-600 truncate">
                {step.step} - {step.product?.name}
              </div>
            ))}
            {routine.morning_routine.length > 3 && (
              <div className="text-xs text-gray-500">
                +{routine.morning_routine.length - 3} more
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Moon className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Evening</span>
          </div>
          <div className="space-y-1">
            {routine.evening_routine.slice(0, 3).map((step: any, index: number) => (
              <div key={index} className="text-xs text-gray-600 truncate">
                {step.step} - {step.product?.name}
              </div>
            ))}
            {routine.evening_routine.length > 3 && (
              <div className="text-xs text-gray-500">
                +{routine.evening_routine.length - 3} more
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <Button
          onClick={() => setSelectedRoutine(routine)}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          View Details
        </Button>
        
        <Button
          onClick={() => handleUseRoutine(routine)}
          size="sm"
          className="flex-1"
        >
          Use This Routine
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blush-50 via-white to-lavender-50 flex items-center justify-center">
        <LoadingSpinner message="Loading your routine history..." />
      </div>
    );
  }

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
          
          <h1 className="text-xl font-bold text-gray-900">Routine History</h1>
          
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>

        {/* Stats Overview */}
        {routineHistory.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blush-100 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-5 h-5 text-blush-600" />
              <h2 className="text-lg font-semibold text-gray-900">Your Journey</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blush-600 mb-1">
                  {routineHistory.length}
                </div>
                <div className="text-xs text-gray-600">Routines</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  ₹{Math.round(routineHistory.reduce((sum, r) => sum + r.total_cost, 0) / routineHistory.length)}
                </div>
                <div className="text-xs text-gray-600">Avg Cost</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-1">
                  {Math.round(routineHistory.reduce((sum, r) => sum + r.confidence_score, 0) / routineHistory.length)}%
                </div>
                <div className="text-xs text-gray-600">Avg AI Score</div>
              </div>
            </div>
          </div>
        )}

        {/* Routine History List */}
        <div className="space-y-4">
          {routineHistory.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Past Routines
                </h3>
                <span className="text-sm text-gray-500">
                  {routineHistory.length} total
                </span>
              </div>
              
              {routineHistory.map((routine) => (
                <RoutineCard key={routine.id} routine={routine} />
              ))}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Routine History Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Complete the quiz and generate your first routine to start tracking your skincare journey.
              </p>
              <Button onClick={() => navigate('/quiz')}>
                Create Your First Routine
              </Button>
            </div>
          )}
        </div>

        {/* Detailed Routine Modal */}
        {selectedRoutine && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Routine Details
                  </h3>
                  <button
                    onClick={() => setSelectedRoutine(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <div className="font-medium">{formatDate(selectedRoutine.created_at)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Total Cost:</span>
                        <div className="font-medium">₹{selectedRoutine.total_cost}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">AI Confidence:</span>
                        <div className="font-medium">{selectedRoutine.confidence_score}%</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Total Steps:</span>
                        <div className="font-medium">{selectedRoutine.total_steps}</div>
                      </div>
                    </div>
                  </div>

                  {/* Morning Routine */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Sun className="w-4 h-4 text-yellow-600 mr-2" />
                      Morning Routine
                    </h4>
                    <div className="space-y-2">
                      {selectedRoutine.morning_routine.map((step: any, index: number) => (
                        <div key={index} className="bg-yellow-50 rounded-lg p-3">
                          <div className="font-medium text-sm">{step.step}</div>
                          <div className="text-xs text-gray-600">{step.product?.name} - ₹{step.product?.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Evening Routine */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Moon className="w-4 h-4 text-indigo-600 mr-2" />
                      Evening Routine
                    </h4>
                    <div className="space-y-2">
                      {selectedRoutine.evening_routine.map((step: any, index: number) => (
                        <div key={index} className="bg-indigo-50 rounded-lg p-3">
                          <div className="font-medium text-sm">{step.step}</div>
                          <div className="text-xs text-gray-600">{step.product?.name} - ₹{step.product?.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={() => handleUseRoutine(selectedRoutine)}
                      className="flex-1"
                    >
                      Use This Routine
                    </Button>
                    <Button
                      onClick={() => setSelectedRoutine(null)}
                      variant="outline"
                      className="flex-1"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineHistory;