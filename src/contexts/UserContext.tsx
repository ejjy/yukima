import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserProfile, Routine, RoutineStep, ScanResult } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabaseClient';

interface UserContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  routine: Routine | null;
  setRoutine: (routine: Routine) => void;
  scanResult: ScanResult | null;
  setScanResult: (result: ScanResult) => void;
  updateRoutineStep: (period: 'morning' | 'evening', stepIndex: number, completed: boolean) => void;
  clearSession: () => void;
  saveToDatabase: () => Promise<void>;
  loadFromDatabase: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [routine, setRoutineState] = useState<Routine | null>(null);
  const [scanResult, setScanResultState] = useState<ScanResult | null>(null);

  // Load data when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFromDatabase();
    } else {
      // Load from session storage for unauthenticated users
      loadFromSessionStorage();
    }
  }, [isAuthenticated, user]);

  const loadFromSessionStorage = () => {
    const savedProfile = sessionStorage.getItem('yukima_profile');
    const savedRoutine = sessionStorage.getItem('yukima_routine');
    const savedScanResult = sessionStorage.getItem('yukima_scan_result');
    
    if (savedProfile) {
      try {
        setProfileState(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error parsing saved profile:', error);
      }
    }
    
    if (savedRoutine) {
      try {
        setRoutineState(JSON.parse(savedRoutine));
      } catch (error) {
        console.error('Error parsing saved routine:', error);
      }
    }

    if (savedScanResult) {
      try {
        setScanResultState(JSON.parse(savedScanResult));
      } catch (error) {
        console.error('Error parsing saved scan result:', error);
      }
    }
  };

  const saveToSessionStorage = (newProfile?: UserProfile, newRoutine?: Routine, newScanResult?: ScanResult) => {
    if (newProfile) {
      sessionStorage.setItem('yukima_profile', JSON.stringify(newProfile));
    }
    if (newRoutine) {
      sessionStorage.setItem('yukima_routine', JSON.stringify(newRoutine));
    }
    if (newScanResult) {
      sessionStorage.setItem('yukima_scan_result', JSON.stringify(newScanResult));
    }
  };

  const loadFromDatabase = async () => {
    if (!user) return;

    try {
      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile:', profileError);
      } else if (profileData) {
        const profile: UserProfile = {
          ageRange: profileData.age_range as UserProfile['ageRange'],
          skinType: profileData.skin_type as UserProfile['skinType'],
          concerns: profileData.concerns,
          budget: profileData.budget as UserProfile['budget'],
          productPreference: profileData.product_preference as UserProfile['productPreference'],
          language: profileData.language as UserProfile['language'],
          consent: true
        };
        setProfileState(profile);
      }

      // Load user routine
      const { data: routineData, error: routineError } = await supabase
        .from('user_routines')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (routineError && routineError.code !== 'PGRST116') {
        console.error('Error loading routine:', routineError);
      } else if (routineData) {
        const routine: Routine = {
          morning: routineData.morning_routine,
          evening: routineData.evening_routine,
          totalCost: routineData.total_cost
        };
        setRoutineState(routine);
      }

      // Load scan result
      const { data: scanData, error: scanError } = await supabase
        .from('scan_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (scanError && scanError.code !== 'PGRST116') {
        console.error('Error loading scan result:', scanError);
      } else if (scanData) {
        const scanResult: ScanResult = {
          skinType: scanData.skin_type,
          concerns: scanData.concerns,
          confidence: scanData.confidence,
          recommendations: scanData.recommendations,
          timestamp: new Date(scanData.created_at)
        };
        setScanResultState(scanResult);
      }
    } catch (error) {
      console.error('Error loading data from database:', error);
    }
  };

  const saveToDatabase = async () => {
    if (!user || !isAuthenticated) return;

    try {
      // Save profile
      if (profile) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            age_range: profile.ageRange,
            skin_type: profile.skinType,
            concerns: profile.concerns,
            budget: profile.budget,
            product_preference: profile.productPreference,
            language: profile.language,
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Error saving profile:', profileError);
        }
      }

      // Save routine
      if (routine) {
        const { error: routineError } = await supabase
          .from('user_routines')
          .upsert({
            user_id: user.id,
            morning_routine: routine.morning,
            evening_routine: routine.evening,
            total_cost: routine.totalCost,
            updated_at: new Date().toISOString()
          });

        if (routineError) {
          console.error('Error saving routine:', routineError);
        }
      }

      // Save scan result
      if (scanResult) {
        const { error: scanError } = await supabase
          .from('scan_results')
          .insert({
            user_id: user.id,
            skin_type: scanResult.skinType,
            concerns: scanResult.concerns,
            confidence: scanResult.confidence,
            recommendations: scanResult.recommendations
          });

        if (scanError) {
          console.error('Error saving scan result:', scanError);
        }
      }
    } catch (error) {
      console.error('Error saving to database:', error);
    }
  };

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
    if (isAuthenticated) {
      // Auto-save to database for authenticated users
      setTimeout(saveToDatabase, 100);
    } else {
      saveToSessionStorage(newProfile);
    }
  };

  const setRoutine = (newRoutine: Routine) => {
    setRoutineState(newRoutine);
    if (isAuthenticated) {
      // Auto-save to database for authenticated users
      setTimeout(saveToDatabase, 100);
    } else {
      saveToSessionStorage(undefined, newRoutine);
    }
  };

  const setScanResult = (result: ScanResult) => {
    setScanResultState(result);
    if (isAuthenticated) {
      // Auto-save to database for authenticated users
      setTimeout(saveToDatabase, 100);
    } else {
      saveToSessionStorage(undefined, undefined, result);
    }
  };

  const updateRoutineStep = (period: 'morning' | 'evening', stepIndex: number, completed: boolean) => {
    if (!routine) return;

    const updatedRoutine = { ...routine };
    updatedRoutine[period][stepIndex].completed = completed;
    
    setRoutine(updatedRoutine);
  };

  const clearSession = () => {
    setProfileState(null);
    setRoutineState(null);
    setScanResultState(null);
    sessionStorage.removeItem('yukima_profile');
    sessionStorage.removeItem('yukima_routine');
    sessionStorage.removeItem('yukima_scan_result');
  };

  return (
    <UserContext.Provider value={{
      profile,
      setProfile,
      routine,
      setRoutine,
      scanResult,
      setScanResult,
      updateRoutineStep,
      clearSession,
      saveToDatabase,
      loadFromDatabase
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};