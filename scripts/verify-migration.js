import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyMigration() {
  console.log('🔍 Verifying database migration for age expansion...\n');
  
  try {
    // Check if new columns exist
    console.log('1. Checking database schema...');
    
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'products')
      .in('column_name', ['age_group', 'premium_tier']);

    if (columnsError) {
      console.error('❌ Error checking columns:', columnsError);
      return false;
    }

    const columnNames = columns.map(col => col.column_name);
    const hasAgeGroup = columnNames.includes('age_group');
    const hasPremiumTier = columnNames.includes('premium_tier');

    console.log(`   age_group column: ${hasAgeGroup ? '✅' : '❌'}`);
    console.log(`   premium_tier column: ${hasPremiumTier ? '✅' : '❌'}`);

    if (!hasAgeGroup || !hasPremiumTier) {
      console.log('\n⚠️  Migration not applied. Please apply the migration first.');
      return false;
    }

    // Check products with new skin types
    console.log('\n2. Checking product data...');
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, skin_type, age_group, premium_tier, price')
      .limit(10);

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return false;
    }

    console.log(`   Total products checked: ${products.length}`);
    
    // Check for new skin types
    const hasNormal = products.some(p => p.skin_type?.includes('Normal'));
    const hasAcneProne = products.some(p => p.skin_type?.includes('Acne-prone'));
    const hasMature = products.some(p => p.skin_type?.includes('Mature'));
    
    console.log(`   Products with Normal skin type: ${hasNormal ? '✅' : '❌'}`);
    console.log(`   Products with Acne-prone skin type: ${hasAcneProne ? '✅' : '❌'}`);
    console.log(`   Products with Mature skin type: ${hasMature ? '✅' : '❌'}`);

    // Check age group data
    const hasAgeGroupData = products.some(p => p.age_group && p.age_group.length > 0);
    const hasPremiumProducts = products.some(p => p.premium_tier === true);
    
    console.log(`   Products with age group data: ${hasAgeGroupData ? '✅' : '❌'}`);
    console.log(`   Premium products available: ${hasPremiumProducts ? '✅' : '❌'}`);

    // Check dupes
    console.log('\n3. Checking dupes data...');
    
    const { count: dupesCount, error: dupesError } = await supabase
      .from('dupes')
      .select('*', { count: 'exact', head: true });

    if (dupesError) {
      console.error('❌ Error checking dupes:', dupesError);
      return false;
    }

    console.log(`   Total dupes available: ${dupesCount}`);

    // Check ingredient alerts
    console.log('\n4. Checking ingredient alerts...');
    
    const { count: alertsCount, error: alertsError } = await supabase
      .from('ingredient_analysis_cache')
      .select('*', { count: 'exact', head: true });

    if (alertsError) {
      console.error('❌ Error checking ingredient alerts:', alertsError);
      return false;
    }

    console.log(`   Total ingredient alerts: ${alertsCount}`);

    // Test age-appropriate function
    console.log('\n5. Testing age-appropriate products function...');
    
    try {
      const { data: ageProducts, error: ageError } = await supabase
        .rpc('get_age_appropriate_products', { user_age_range: '25-30' });

      if (ageError) {
        console.log(`   Function test: ❌ (${ageError.message})`);
      } else {
        console.log(`   Function test: ✅ (${ageProducts?.length || 0} products returned)`);
      }
    } catch (error) {
      console.log(`   Function test: ❌ (Function may not exist yet)`);
    }

    // Sample data verification
    console.log('\n6. Sample data verification...');
    
    const sampleProducts = products.slice(0, 3);
    sampleProducts.forEach((product, index) => {
      console.log(`   Product ${index + 1}: ${product.name}`);
      console.log(`     Skin Types: ${product.skin_type?.join(', ') || 'None'}`);
      console.log(`     Age Groups: ${product.age_group?.join(', ') || 'None'}`);
      console.log(`     Premium: ${product.premium_tier ? 'Yes' : 'No'}`);
      console.log(`     Price: ₹${product.price}`);
    });

    console.log('\n🎉 Migration verification completed!');
    
    if (hasAgeGroup && hasPremiumTier && hasAgeGroupData) {
      console.log('✅ Database migration appears to be working correctly.');
      return true;
    } else {
      console.log('⚠️  Some migration features may not be fully applied.');
      return false;
    }

  } catch (error) {
    console.error('❌ Verification failed:', error);
    return false;
  }
}

// Run verification
verifyMigration().then(success => {
  if (success) {
    console.log('\n🚀 Your database is ready for the expanded age range (18-45)!');
  } else {
    console.log('\n⚠️  Please check the migration status in your Supabase dashboard.');
  }
  process.exit(success ? 0 : 1);
});