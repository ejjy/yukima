import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import Button from '../UI/Button';

interface RoutineTimerProps {
  stepName: string;
  onComplete?: () => void;
}

const RoutineTimer: React.FC<RoutineTimerProps> = ({ stepName, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(0);

  // Default times for different steps (in seconds)
  const stepTimes: { [key: string]: number } = {
    'Cleanser': 60,      // 1 minute
    'Toner': 30,         // 30 seconds
    'Serum': 120,        // 2 minutes (absorption time)
    'Moisturizer': 60,   // 1 minute
    'Sunscreen': 90,     // 1.5 minutes
    'Mask': 900          // 15 minutes
  };

  useEffect(() => {
    const defaultTime = stepTimes[stepName] || 60;
    setTimeLeft(defaultTime);
    setInitialTime(defaultTime);
  }, [stepName]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            if (onComplete) onComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            {stepName} Timer
          </span>
        </div>
        <div className="text-lg font-bold text-blue-900">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-blue-200 rounded-full h-2 mb-3">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Timer Controls */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTimer}
          className="flex-1 text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          {isRunning ? (
            <>
              <Pause className="w-3 h-3 mr-1" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-3 h-3 mr-1" />
              Start
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={resetTimer}
          className="text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          <RotateCcw className="w-3 h-3" />
        </Button>
      </div>

      {timeLeft === 0 && (
        <div className="mt-2 text-center">
          <span className="text-sm font-medium text-green-600">
            ✨ Time's up! Ready for the next step?
          </span>
        </div>
      )}
    </div>
  );
};

export default RoutineTimer;