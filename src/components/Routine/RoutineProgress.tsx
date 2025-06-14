import React from 'react';
import { Routine } from '../../types';
import { CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';

interface RoutineProgressProps {
  routine: Routine;
}

const RoutineProgress: React.FC<RoutineProgressProps> = ({ routine }) => {
  const totalSteps = routine.morning.length + routine.evening.length;
  const completedSteps = [...routine.morning, ...routine.evening].filter(step => step.completed).length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  
  const morningCompleted = routine.morning.filter(step => step.completed).length;
  const eveningCompleted = routine.evening.filter(step => step.completed).length;
  
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    if (percentage >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-blush-500 to-lavender-500';
  };

  const getMotivationalMessage = (percentage: number) => {
    if (percentage === 100) return "Perfect! You've completed your routine! ✨";
    if (percentage >= 80) return "Almost there! Keep up the great work! 🌟";
    if (percentage >= 50) return "You're doing great! Halfway there! 💪";
    if (percentage >= 25) return "Good start! Keep building the habit! 🌱";
    return "Ready to glow? Let's start your routine! 🚀";
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-blush-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Today's Progress</h2>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-gray-700">
            {completedSteps}/{totalSteps} steps
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Overall Progress</span>
          <span className="text-sm font-medium text-gray-900">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(progressPercentage)} transition-all duration-500`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-blush-50 to-lavender-50 rounded-lg p-4 mb-4">
        <p className="text-sm font-medium text-gray-800 text-center">
          {getMotivationalMessage(progressPercentage)}
        </p>
      </div>

      {/* Routine Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">Morning</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {morningCompleted}/{routine.morning.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-300"
              style={{ width: `${routine.morning.length > 0 ? (morningCompleted / routine.morning.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Evening</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {eveningCompleted}/{routine.evening.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-300"
              style={{ width: `${routine.evening.length > 0 ? (eveningCompleted / routine.evening.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Streak Counter (Mock) */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-sm text-gray-600">
            Current streak: <span className="font-medium text-green-600">3 days</span> 🔥
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoutineProgress;