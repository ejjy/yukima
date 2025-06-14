import { useState, useEffect } from 'react';
import { Routine } from '../types';

interface RoutineStats {
  totalSteps: number;
  completedSteps: number;
  progressPercentage: number;
  morningProgress: number;
  eveningProgress: number;
  streak: number;
  completedToday: boolean;
}

export const useRoutineStats = (routine: Routine | null): RoutineStats => {
  const [stats, setStats] = useState<RoutineStats>({
    totalSteps: 0,
    completedSteps: 0,
    progressPercentage: 0,
    morningProgress: 0,
    eveningProgress: 0,
    streak: 0,
    completedToday: false
  });

  useEffect(() => {
    if (!routine) {
      setStats({
        totalSteps: 0,
        completedSteps: 0,
        progressPercentage: 0,
        morningProgress: 0,
        eveningProgress: 0,
        streak: 0,
        completedToday: false
      });
      return;
    }

    const totalSteps = routine.morning.length + routine.evening.length;
    const completedSteps = [...routine.morning, ...routine.evening].filter(step => step.completed).length;
    const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
    
    const morningCompleted = routine.morning.filter(step => step.completed).length;
    const eveningCompleted = routine.evening.filter(step => step.completed).length;
    
    const morningProgress = routine.morning.length > 0 ? (morningCompleted / routine.morning.length) * 100 : 0;
    const eveningProgress = routine.evening.length > 0 ? (eveningCompleted / routine.evening.length) * 100 : 0;
    
    // Mock streak calculation (in real app, this would come from database)
    const streak = Math.floor(Math.random() * 10) + 1;
    const completedToday = progressPercentage === 100;

    setStats({
      totalSteps,
      completedSteps,
      progressPercentage,
      morningProgress,
      eveningProgress,
      streak,
      completedToday
    });
  }, [routine]);

  return stats;
};