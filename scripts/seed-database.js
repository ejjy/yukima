import { createClient } from '@supabase/supabase-js';
import { products } from '../src/data/products.js';
import { dupes } from '../src/data/dupes.js';
import { ingredientAlerts } from '../src/data/ingredientAlerts.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedProducts() {
  console.log('🌱 Seeding products...');
  
  try {
    // Clear existing products
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '');
    
    if (deleteError) {
      console.warn('Warning clearing products:', deleteError.message);
    }

    // Insert products in batches to avoid payload limits
    const batchSize = 50;
    let insertedCount = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('products')
        .insert(batch);

      if (error) {
        console.error(`Error inserting products batch ${i / batchSize + 1}:`, error);
        throw error;
      }

      insertedCount += batch.length;
      console.log(`✅ Inserted ${insertedCount}/${products.length} products`);
    }

    console.log(`🎉 Successfully seeded ${insertedCount} products`);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}

async function seedDupes() {
  console.log('🌱 Seeding dupes...');
  
  try {
    // Clear existing dupes
    const { error: deleteError } = await supabase
      .from('dupes')
      .delete()
      .neq('id', '');
    
    if (deleteError) {
      console.warn('Warning clearing dupes:', deleteError.message);
    }

    // Insert dupes
    const { data, error } = await supabase
      .from('dupes')
      .insert(dupes);

    if (error) {
      console.error('Error inserting dupes:', error);
      throw error;
    }

    console.log(`🎉 Successfully seeded ${dupes.length} dupes`);
  } catch (error) {
    console.error('❌ Error seeding dupes:', error);
    throw error;
  }
}

async function seedIngredientAlerts() {
  console.log('🌱 Seeding ingredient alerts...');
  
  try {
    // Clear existing ingredient alerts
    const { error: deleteError } = await supabase
      .from('ingredient_analysis_cache')
      .delete()
      .neq('id', '');
    
    if (deleteError) {
      console.warn('Warning clearing ingredient alerts:', deleteError.message);
    }

    // Map ingredient alerts to database schema
    const mappedAlerts = ingredientAlerts.map(alert => ({
      ingredient_name: alert.ingredient,
      risk: alert.risk,
      avoid_for: alert.avoidFor,
      description: alert.description,
      alternatives: alert.alternatives,
      safety_data: {
        risk: alert.risk,
        description: alert.description,
        alternatives: alert.alternatives
      },
      skin_type_compatibility: alert.avoidFor.reduce((acc, skinType) => {
        acc[skinType] = 'avoid';
        return acc;
      }, {}),
      concern_compatibility: {},
      ai_analysis_data: {
        risk_level: alert.risk.includes('High') ? 'high' : 
                   alert.risk.includes('Medium') ? 'medium' : 'low',
        recommendations: alert.alternatives
      }
    }));

    // Insert ingredient alerts
    const { data, error } = await supabase
      .from('ingredient_analysis_cache')
      .insert(mappedAlerts);

    if (error) {
      console.error('Error inserting ingredient alerts:', error);
      throw error;
    }

    console.log(`🎉 Successfully seeded ${mappedAlerts.length} ingredient alerts`);
  } catch (error) {
    console.error('❌ Error seeding ingredient alerts:', error);
    throw error;
  }
}

async function verifyData() {
  console.log('🔍 Verifying seeded data...');
  
  try {
    // Check products count
    const { count: productsCount, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (productsError) throw productsError;

    // Check dupes count
    const { count: dupesCount, error: dupesError } = await supabase
      .from('dupes')
      .select('*', { count: 'exact', head: true });

    if (dupesError) throw dupesError;

    // Check ingredient alerts count
    const { count: alertsCount, error: alertsError } = await supabase
      .from('ingredient_analysis_cache')
      .select('*', { count: 'exact', head: true });

    if (alertsError) throw alertsError;

    console.log('📊 Data verification results:');
    console.log(`   Products: ${productsCount}`);
    console.log(`   Dupes: ${dupesCount}`);
    console.log(`   Ingredient Alerts: ${alertsCount}`);

    // Sample some data
    const { data: sampleProducts } = await supabase
      .from('products')
      .select('name, brand, price')
      .limit(3);

    const { data: sampleDupes } = await supabase
      .from('dupes')
      .select('original_product, dupe_name, savings')
      .limit(2);

    console.log('\n📋 Sample data:');
    console.log('Products:', sampleProducts);
    console.log('Dupes:', sampleDupes);

  } catch (error) {
    console.error('❌ Error verifying data:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting database seeding...\n');
  
  try {
    await seedProducts();
    await seedDupes();
    await seedIngredientAlerts();
    await verifyData();
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('✨ Your Supabase database is now populated with mock data.');
  } catch (error) {
    console.error('\n💥 Database seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding script
main();