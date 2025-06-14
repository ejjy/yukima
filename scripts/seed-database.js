import { createClient } from '@supabase/supabase-js';
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

// Enhanced product data with new skin types
const enhancedProducts = [
  // Cleansers
  {
    id: 'himalaya-neem-cleanser',
    name: 'Purifying Neem Face Wash',
    step: 'Cleanser',
    skin_type: ['Oily', 'Combo', 'Acne-prone'],
    concern_tags: ['Acne', 'Oiliness'],
    price: 140,
    budget_tier: 299,
    regional_relevance: 'High',
    brand: 'Himalaya',
    category: 'Cleanser',
    description: 'Antibacterial neem cleanser for acne-prone skin'
  },
  {
    id: 'cetaphil-gentle-cleanser',
    name: 'Gentle Skin Cleanser',
    step: 'Cleanser',
    skin_type: ['Dry', 'Sensitive', 'Normal'],
    concern_tags: ['Dryness', 'Sensitivity'],
    price: 299,
    budget_tier: 499,
    regional_relevance: 'Medium',
    brand: 'Cetaphil',
    category: 'Cleanser',
    description: 'Gentle cleanser for sensitive and dry skin'
  },
  {
    id: 'simple-refreshing-wash',
    name: 'Kind to Skin Refreshing Facial Wash',
    step: 'Cleanser',
    skin_type: ['Normal', 'Sensitive'],
    concern_tags: ['Sensitivity'],
    price: 299,
    budget_tier: 299,
    regional_relevance: 'Medium',
    brand: 'Simple',
    category: 'Cleanser',
    description: 'Gentle cleanser for normal to sensitive skin'
  },
  {
    id: 'neutrogena-acne-wash',
    name: 'Oil-Free Acne Wash',
    step: 'Cleanser',
    skin_type: ['Acne-prone', 'Oily'],
    concern_tags: ['Acne', 'Oiliness'],
    price: 399,
    budget_tier: 499,
    regional_relevance: 'Medium',
    brand: 'Neutrogena',
    category: 'Cleanser',
    description: 'Salicylic acid cleanser for acne-prone skin'
  },

  // Serums
  {
    id: 'minimalist-niacinamide',
    name: '10% Niacinamide Face Serum',
    step: 'Serum',
    skin_type: ['Oily', 'Combo', 'Acne-prone'],
    concern_tags: ['Large Pores', 'Acne', 'Oiliness'],
    price: 399,
    budget_tier: 499,
    regional_relevance: 'High',
    brand: 'Minimalist',
    category: 'Serum',
    description: 'High-strength niacinamide for oil control'
  },
  {
    id: 'ordinary-hyaluronic',
    name: 'Hyaluronic Acid 2% + B5',
    step: 'Serum',
    skin_type: ['All', 'Dry', 'Normal', 'Mature'],
    concern_tags: ['Dryness', 'Fine Lines', 'Hydration'],
    price: 590,
    budget_tier: 999,
    regional_relevance: 'Medium',
    brand: 'The Ordinary',
    category: 'Serum',
    description: 'Intense hydration with hyaluronic acid'
  },
  {
    id: 'dot-key-vitamin-c',
    name: 'Vitamin C+E Super Bright Serum',
    step: 'Serum',
    skin_type: ['All', 'Normal', 'Mature'],
    concern_tags: ['Dullness', 'Pigmentation', 'Dark Spots'],
    price: 845,
    budget_tier: 999,
    regional_relevance: 'High',
    brand: 'Dot & Key',
    category: 'Serum',
    description: 'Brightening vitamin C serum'
  },
  {
    id: 'olay-regenerist-serum',
    name: 'Regenerist Micro-Sculpting Serum',
    step: 'Serum',
    skin_type: ['Mature', 'Normal', 'Dry'],
    concern_tags: ['Fine Lines', 'Aging', 'Firmness'],
    price: 899,
    budget_tier: 999,
    regional_relevance: 'Medium',
    brand: 'Olay',
    category: 'Serum',
    description: 'Anti-aging serum with amino-peptides'
  },

  // Moisturizers
  {
    id: 'neutrogena-oil-free',
    name: 'Oil-Free Moisture Gel',
    step: 'Moisturizer',
    skin_type: ['Oily', 'Combo', 'Normal'],
    concern_tags: ['Oiliness'],
    price: 299,
    budget_tier: 299,
    regional_relevance: 'Medium',
    brand: 'Neutrogena',
    category: 'Moisturizer',
    description: 'Lightweight moisturizer for oily skin'
  },
  {
    id: 'cetaphil-daily-moisturizer',
    name: 'Daily Facial Moisturizer',
    step: 'Moisturizer',
    skin_type: ['Dry', 'Sensitive', 'Normal'],
    concern_tags: ['Dryness', 'Sensitivity'],
    price: 450,
    budget_tier: 499,
    regional_relevance: 'Medium',
    brand: 'Cetaphil',
    category: 'Moisturizer',
    description: '24-hour hydration for dry and sensitive skin'
  },
  {
    id: 'olay-regenerist-night',
    name: 'Regenerist Night Recovery Cream',
    step: 'Moisturizer',
    skin_type: ['Mature', 'Dry', 'Normal'],
    concern_tags: ['Fine Lines', 'Aging', 'Dryness'],
    price: 899,
    budget_tier: 999,
    regional_relevance: 'Medium',
    brand: 'Olay',
    category: 'Moisturizer',
    description: 'Anti-aging night cream for mature skin'
  },

  // Sunscreens
  {
    id: 'neutrogena-ultra-sheer',
    name: 'Ultra Sheer Dry Touch Sunscreen SPF 50+',
    step: 'Sunscreen',
    skin_type: ['All', 'Normal', 'Oily'],
    concern_tags: ['Sun Protection'],
    price: 499,
    budget_tier: 499,
    regional_relevance: 'Medium',
    brand: 'Neutrogena',
    category: 'Sunscreen',
    description: 'Broad spectrum protection, non-greasy'
  },
  {
    id: 'lotus-safe-sun',
    name: 'Safe Sun UV Screen Matte Gel SPF 40',
    step: 'Sunscreen',
    skin_type: ['Oily', 'Combo', 'Acne-prone'],
    concern_tags: ['Sun Protection', 'Oiliness'],
    price: 220,
    budget_tier: 299,
    regional_relevance: 'High',
    brand: 'Lotus',
    category: 'Sunscreen',
    description: 'Matte finish sunscreen for oily skin'
  },

  // Toners
  {
    id: 'thayers-rose-toner',
    name: 'Rose Petal Witch Hazel Toner',
    step: 'Toner',
    skin_type: ['Normal', 'All', 'Sensitive'],
    concern_tags: ['Balance', 'Sensitivity'],
    price: 650,
    budget_tier: 999,
    regional_relevance: 'Low',
    brand: 'Thayers',
    category: 'Toner',
    description: 'Alcohol-free toner for normal skin'
  },
  {
    id: 'pixi-glow-tonic',
    name: 'Glow Tonic',
    step: 'Toner',
    skin_type: ['Normal', 'Oily', 'Mature'],
    concern_tags: ['Dullness', 'Uneven Texture'],
    price: 1800,
    budget_tier: 999,
    regional_relevance: 'Low',
    brand: 'Pixi',
    category: 'Toner',
    description: 'Gentle exfoliating toner with glycolic acid'
  }
];

// Enhanced dupes data
const enhancedDupes = [
  {
    id: 'vitamin-c-dupe-1',
    original_product: 'Dot & Key Vitamin C+E Face Serum',
    dupe_name: 'The Derma Co 2% Vitamin C Serum',
    original_price: 595,
    dupe_price: 349,
    savings: 246,
    reason: 'Similar vitamin C concentration, gentler for sensitive skin',
    brand: 'The Derma Co',
    category: 'Serum'
  },
  {
    id: 'niacinamide-dupe-1',
    original_product: 'Olay Regenerist Micro-Sculpting Serum',
    dupe_name: 'Minimalist 10% Niacinamide Serum',
    original_price: 899,
    dupe_price: 349,
    savings: 550,
    reason: 'Better for oily skin, targets same concerns at lower cost',
    brand: 'Minimalist',
    category: 'Serum'
  },
  {
    id: 'cleanser-dupe-1',
    original_product: 'The Body Shop Tea Tree Face Wash',
    dupe_name: 'Himalaya Neem Face Wash',
    original_price: 695,
    dupe_price: 89,
    savings: 606,
    reason: 'Traditional neem provides similar antibacterial benefits',
    brand: 'Himalaya',
    category: 'Cleanser'
  },
  {
    id: 'gentle-cleanser-dupe',
    original_product: 'Neutrogena Ultra Gentle Daily Cleanser',
    dupe_name: 'Cetaphil Gentle Skin Cleanser',
    original_price: 399,
    dupe_price: 299,
    savings: 100,
    reason: 'Both dermatologist recommended for sensitive skin',
    brand: 'Cetaphil',
    category: 'Cleanser'
  },
  {
    id: 'anti-aging-dupe',
    original_product: 'L\'Oreal Paris Revitalift Crystal Micro-Essence',
    dupe_name: 'Olay Regenerist Night Recovery Cream',
    original_price: 799,
    dupe_price: 899,
    savings: -100,
    reason: 'Better anti-aging ingredients for mature skin',
    brand: 'Olay',
    category: 'Moisturizer'
  }
];

// Enhanced ingredient alerts
const enhancedIngredientAlerts = [
  {
    ingredient_name: 'fragrance',
    risk: 'Skin Irritation & Allergic Reactions',
    avoid_for: ['Sensitive', 'Acne-prone'],
    description: 'Synthetic fragrances can cause contact dermatitis, redness, and irritation, especially in sensitive skin types.',
    alternatives: ['Fragrance-free products', 'Essential oil-based natural scents'],
    safety_data: {
      risk: 'High',
      description: 'Common allergen and irritant'
    },
    skin_type_compatibility: {
      'Sensitive': 'avoid',
      'Acne-prone': 'caution'
    },
    concern_compatibility: {},
    ai_analysis_data: {
      risk_level: 'high',
      recommendations: ['Choose fragrance-free alternatives']
    }
  },
  {
    ingredient_name: 'sodium lauryl sulfate',
    risk: 'Dryness & Barrier Disruption',
    avoid_for: ['Dry', 'Sensitive', 'Mature'],
    description: 'Harsh surfactant that strips natural oils, leading to dryness, irritation, and compromised skin barrier.',
    alternatives: ['Sodium Laureth Sulfate (SLES)', 'Cocamidopropyl Betaine'],
    safety_data: {
      risk: 'Medium',
      description: 'Can be drying and irritating'
    },
    skin_type_compatibility: {
      'Dry': 'avoid',
      'Sensitive': 'avoid',
      'Mature': 'caution'
    },
    concern_compatibility: {},
    ai_analysis_data: {
      risk_level: 'medium',
      recommendations: ['Use gentler surfactants']
    }
  },
  {
    ingredient_name: 'retinol',
    risk: 'Sun Sensitivity & Initial Irritation',
    avoid_for: ['Sensitive', 'Acne-prone'],
    description: 'Increases photosensitivity and can cause initial irritation. Start slowly and use sunscreen.',
    alternatives: ['Bakuchiol', 'Peptides', 'Vitamin C'],
    safety_data: {
      risk: 'Medium',
      description: 'Powerful anti-aging ingredient requiring careful use'
    },
    skin_type_compatibility: {
      'Mature': 'excellent',
      'Normal': 'good',
      'Sensitive': 'caution'
    },
    concern_compatibility: {
      'Fine Lines': 'excellent',
      'Aging': 'excellent'
    },
    ai_analysis_data: {
      risk_level: 'medium',
      recommendations: ['Start with low concentration', 'Use sunscreen daily']
    }
  }
];

async function seedProducts() {
  console.log('🌱 Seeding enhanced products...');
  
  try {
    // Clear existing products
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '');
    
    if (deleteError) {
      console.warn('Warning clearing products:', deleteError.message);
    }

    // Insert enhanced products
    const { data, error } = await supabase
      .from('products')
      .insert(enhancedProducts);

    if (error) {
      console.error('Error inserting products:', error);
      throw error;
    }

    console.log(`🎉 Successfully seeded ${enhancedProducts.length} enhanced products`);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}

async function seedDupes() {
  console.log('🌱 Seeding enhanced dupes...');
  
  try {
    // Clear existing dupes
    const { error: deleteError } = await supabase
      .from('dupes')
      .delete()
      .neq('id', '');
    
    if (deleteError) {
      console.warn('Warning clearing dupes:', deleteError.message);
    }

    // Insert enhanced dupes
    const { data, error } = await supabase
      .from('dupes')
      .insert(enhancedDupes);

    if (error) {
      console.error('Error inserting dupes:', error);
      throw error;
    }

    console.log(`🎉 Successfully seeded ${enhancedDupes.length} enhanced dupes`);
  } catch (error) {
    console.error('❌ Error seeding dupes:', error);
    throw error;
  }
}

async function seedIngredientAlerts() {
  console.log('🌱 Seeding enhanced ingredient alerts...');
  
  try {
    // Clear existing ingredient alerts
    const { error: deleteError } = await supabase
      .from('ingredient_analysis_cache')
      .delete()
      .neq('id', '');
    
    if (deleteError) {
      console.warn('Warning clearing ingredient alerts:', deleteError.message);
    }

    // Insert enhanced ingredient alerts
    const { data, error } = await supabase
      .from('ingredient_analysis_cache')
      .insert(enhancedIngredientAlerts);

    if (error) {
      console.error('Error inserting ingredient alerts:', error);
      throw error;
    }

    console.log(`🎉 Successfully seeded ${enhancedIngredientAlerts.length} enhanced ingredient alerts`);
  } catch (error) {
    console.error('❌ Error seeding ingredient alerts:', error);
    throw error;
  }
}

async function verifyData() {
  console.log('🔍 Verifying enhanced seeded data...');
  
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

    console.log('📊 Enhanced data verification results:');
    console.log(`   Products: ${productsCount}`);
    console.log(`   Dupes: ${dupesCount}`);
    console.log(`   Ingredient Alerts: ${alertsCount}`);

    // Sample some data to verify new skin types
    const { data: sampleProducts } = await supabase
      .from('products')
      .select('name, brand, skin_type, concern_tags')
      .limit(5);

    console.log('\n📋 Sample enhanced products:');
    sampleProducts?.forEach(product => {
      console.log(`   ${product.name} - Skin Types: ${product.skin_type.join(', ')}`);
    });

  } catch (error) {
    console.error('❌ Error verifying data:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting enhanced database seeding with new skin types...\n');
  
  try {
    await seedProducts();
    await seedDupes();
    await seedIngredientAlerts();
    await verifyData();
    
    console.log('\n🎉 Enhanced database seeding completed successfully!');
    console.log('✨ Your Supabase database now includes support for:');
    console.log('   • Normal skin type');
    console.log('   • Acne-prone skin type');
    console.log('   • Mature skin type');
    console.log('   • Enhanced product recommendations');
    console.log('   • Better skin type compatibility matching');
  } catch (error) {
    console.error('\n💥 Enhanced database seeding failed:', error);
    process.exit(1);
  }
}

// Run the enhanced seeding script
main();