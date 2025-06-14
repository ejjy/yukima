import { supabase } from '../lib/supabase';
import { testAIIntegration } from './testAI';

export class BackendTestSuite {
  private results: Array<{ test: string; status: 'pass' | 'fail'; message: string; duration?: number }> = [];

  private log(test: string, status: 'pass' | 'fail', message: string, duration?: number) {
    this.results.push({ test, status, message, duration });
    console.log(`[${status.toUpperCase()}] ${test}: ${message}${duration ? ` (${duration}ms)` : ''}`);
  }

  async testDatabaseConnection() {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
      if (error) throw error;
      this.log('Database Connection', 'pass', 'Successfully connected to Supabase', Date.now() - startTime);
      return true;
    } catch (error) {
      this.log('Database Connection', 'fail', `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`, Date.now() - startTime);
      return false;
    }
  }

  async testAuthentication() {
    const startTime = Date.now();
    try {
      // Test anonymous session
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (session) {
        this.log('Authentication', 'pass', `Active session found: ${session.user.email || 'Anonymous'}`, Date.now() - startTime);
      } else {
        this.log('Authentication', 'pass', 'No active session (expected for guest users)', Date.now() - startTime);
      }
      return true;
    } catch (error) {
      this.log('Authentication', 'fail', `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`, Date.now() - startTime);
      return false;
    }
  }

  async testUserProfileOperations() {
    const startTime = Date.now();
    try {
      // Test creating a profile (should work for authenticated users)
      const testProfile = {
        user_id: null, // Will be set by RLS if authenticated
        age_range: '25-30',
        skin_type: 'combination',
        concerns: ['acne', 'dullness'],
        budget: 499,
        product_preference: 'natural',
        language: 'english'
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(testProfile)
        .select()
        .single();

      if (error) {
        // Expected for unauthenticated users
        if (error.code === '42501' || error.message.includes('permission denied')) {
          this.log('User Profile Operations', 'pass', 'RLS working correctly - unauthenticated users cannot insert', Date.now() - startTime);
          return true;
        }
        throw error;
      }

      // If we get here, user is authenticated
      this.log('User Profile Operations', 'pass', `Profile created successfully: ${data.id}`, Date.now() - startTime);
      
      // Clean up
      await supabase.from('user_profiles').delete().eq('id', data.id);
      return true;
    } catch (error) {
      this.log('User Profile Operations', 'fail', `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`, Date.now() - startTime);
      return false;
    }
  }

  async testEdgeFunctions() {
    const startTime = Date.now();
    try {
      // Test analyze-face-scan function
      const testImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
      
      const { data, error } = await supabase.functions.invoke('analyze-face-scan', {
        body: { 
          image: testImage,
          userProfile: {
            skin_type: 'combination',
            concerns: ['acne'],
            age_range: '25-30'
          }
        }
      });

      if (error) throw error;

      if (data && data.success) {
        this.log('Edge Functions', 'pass', `Face scan function working: confidence ${data.confidence}%`, Date.now() - startTime);
        return true;
      } else {
        throw new Error(data?.error || 'Unknown edge function error');
      }
    } catch (error) {
      this.log('Edge Functions', 'fail', `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`, Date.now() - startTime);
      return false;
    }
  }

  async testIngredientAnalysis() {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase.functions.invoke('analyze-ingredients', {
        body: { 
          ingredients: ['niacinamide', 'salicylic acid'],
          userProfile: {
            skin_type: 'oily',
            concerns: ['acne']
          }
        }
      });

      if (error) throw error;

      if (data && data.success) {
        this.log('Ingredient Analysis', 'pass', `Analyzed ${data.results.length} ingredients`, Date.now() - startTime);
        return true;
      } else {
        throw new Error(data?.error || 'Unknown ingredient analysis error');
      }
    } catch (error) {
      this.log('Ingredient Analysis', 'fail', `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`, Date.now() - startTime);
      return false;
    }
  }

  async testRoutineGeneration() {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase.functions.invoke('generate-routine', {
        body: { 
          userProfile: {
            age_range: '25-30',
            skin_type: 'combination',
            concerns: ['acne', 'dullness'],
            budget: 499,
            product_preference: 'natural'
          },
          scanResults: {
            skin_type: 'combination',
            concerns: ['acne'],
            confidence: 85
          }
        }
      });

      if (error) throw error;

      if (data && data.success) {
        this.log('Routine Generation', 'pass', `Generated routine with ${data.morning_routine.length + data.evening_routine.length} products`, Date.now() - startTime);
        return true;
      } else {
        throw new Error(data?.error || 'Unknown routine generation error');
      }
    } catch (error) {
      this.log('Routine Generation', 'fail', `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`, Date.now() - startTime);
      return false;
    }
  }

  async testDataIntegrity() {
    const startTime = Date.now();
    try {
      // Test that all required tables exist
      const tables = [
        'user_profiles',
        'user_routines', 
        'scan_results',
        'ai_analysis_logs',
        'product_recommendations',
        'ingredient_analysis_cache'
      ];

      for (const table of tables) {
        const { error } = await supabase.from(table).select('count').limit(1);
        if (error) throw new Error(`Table ${table} not accessible: ${error.message}`);
      }

      this.log('Data Integrity', 'pass', `All ${tables.length} tables accessible`, Date.now() - startTime);
      return true;
    } catch (error) {
      this.log('Data Integrity', 'fail', `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`, Date.now() - startTime);
      return false;
    }
  }

  async runFullBackendTest() {
    console.log('🧪 Starting Backend Integration Test Suite...\n');
    
    const tests = [
      () => this.testDatabaseConnection(),
      () => this.testAuthentication(),
      () => this.testDataIntegrity(),
      () => this.testUserProfileOperations(),
      () => this.testEdgeFunctions(),
      () => this.testIngredientAnalysis(),
      () => this.testRoutineGeneration()
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
      const result = await test();
      if (result) passed++;
      else failed++;
    }

    console.log('\n📊 Backend Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

    return { passed, failed, results: this.results };
  }

  getResults() {
    return this.results;
  }
}

export async function testBackendIntegration() {
  const backendSuite = new BackendTestSuite();
  const backendResults = await backendSuite.runFullBackendTest();
  
  console.log('\n🤖 Running AI Integration Tests...\n');
  const aiResults = await testAIIntegration();
  
  return {
    backend: backendResults,
    ai: aiResults
  };
}