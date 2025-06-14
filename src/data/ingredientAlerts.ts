import { IngredientAlert } from '../types';

export const ingredientAlerts: IngredientAlert[] = [
  {
    id: '1',
    ingredient: 'Fragrance/Parfum',
    risk: 'Skin Irritation & Allergic Reactions',
    avoidFor: ['Sensitive', 'Eczema-prone'],
    description: 'Synthetic fragrances can cause contact dermatitis, redness, and irritation, especially in sensitive skin types.',
    alternatives: ['Fragrance-free products', 'Essential oil-based natural scents', 'Unscented formulations']
  },
  {
    id: '2',
    ingredient: 'Sodium Lauryl Sulfate (SLS)',
    risk: 'Dryness & Barrier Disruption',
    avoidFor: ['Dry', 'Sensitive', 'Eczema-prone'],
    description: 'Harsh surfactant that strips natural oils, leading to dryness, irritation, and compromised skin barrier.',
    alternatives: ['Sodium Laureth Sulfate (SLES)', 'Cocamidopropyl Betaine', 'Decyl Glucoside']
  },
  {
    id: '3',
    ingredient: 'Alcohol (Denatured)',
    risk: 'Excessive Drying & Irritation',
    avoidFor: ['Dry', 'Sensitive', 'Mature'],
    description: 'High concentrations of drying alcohols can strip moisture, cause irritation, and accelerate aging.',
    alternatives: ['Fatty alcohols (Cetyl, Stearyl)', 'Glycerin-based formulas', 'Alcohol-free toners']
  },
  {
    id: '4',
    ingredient: 'Parabens',
    risk: 'Hormonal Disruption Concerns',
    avoidFor: ['Pregnancy', 'Hormone-sensitive conditions'],
    description: 'Preservatives that may mimic estrogen and potentially disrupt hormonal balance, though research is ongoing.',
    alternatives: ['Phenoxyethanol', 'Benzyl Alcohol', 'Natural preservatives like Rosemary Extract']
  },
  {
    id: '5',
    ingredient: 'Retinol/Retinoids',
    risk: 'Sun Sensitivity & Irritation',
    avoidFor: ['Pregnancy', 'Breastfeeding', 'Very sensitive skin'],
    description: 'Increases photosensitivity and can cause initial irritation. Contraindicated during pregnancy.',
    alternatives: ['Bakuchiol', 'Vitamin C', 'Peptides', 'Niacinamide']
  },
  {
    id: '6',
    ingredient: 'Hydroquinone',
    risk: 'Skin Lightening & Potential Toxicity',
    avoidFor: ['Long-term use', 'Pregnancy', 'Dark skin tones'],
    description: 'Banned in many countries due to potential carcinogenic effects and risk of ochronosis in darker skin.',
    alternatives: ['Kojic Acid', 'Arbutin', 'Vitamin C', 'Licorice Extract', 'Niacinamide']
  },
  {
    id: '7',
    ingredient: 'Essential Oils (High Concentration)',
    risk: 'Photosensitivity & Allergic Reactions',
    avoidFor: ['Sensitive', 'Pregnancy', 'Sun exposure'],
    description: 'Citrus oils and some botanicals can cause burns when exposed to sunlight and trigger allergies.',
    alternatives: ['Low concentration essential oils', 'Synthetic fragrance alternatives', 'Fragrance-free options']
  },
  {
    id: '8',
    ingredient: 'Formaldehyde Releasers',
    risk: 'Carcinogenic Potential & Allergies',
    avoidFor: ['Sensitive', 'Allergy-prone', 'General health concerns'],
    description: 'Preservatives that release formaldehyde over time, potentially causing allergic reactions and health concerns.',
    alternatives: ['Phenoxyethanol', 'Ethylhexylglycerin', 'Natural preservative systems']
  },
  {
    id: '9',
    ingredient: 'Mineral Oil',
    risk: 'Pore Clogging & Barrier Issues',
    avoidFor: ['Acne-prone', 'Oily', 'Comedogenic sensitivity'],
    description: 'Heavy occlusive that may clog pores in acne-prone individuals and prevent natural skin functions.',
    alternatives: ['Jojoba Oil', 'Squalane', 'Hyaluronic Acid', 'Lightweight plant oils']
  },
  {
    id: '10',
    ingredient: 'Salicylic Acid (High %)',
    risk: 'Over-exfoliation & Sensitivity',
    avoidFor: ['Very sensitive skin', 'Compromised barrier', 'First-time users'],
    description: 'High concentrations can cause excessive peeling, redness, and increased sensitivity if overused.',
    alternatives: ['Lower concentration Salicylic Acid', 'Lactic Acid', 'Mandelic Acid', 'Enzyme exfoliants']
  }
];

export const getAlertsForSkinType = (skinType: string): IngredientAlert[] => {
  return ingredientAlerts.filter(alert => 
    alert.avoidFor.some(condition => 
      condition.toLowerCase().includes(skinType.toLowerCase()) ||
      (skinType === 'Combo' && (condition.includes('Oily') || condition.includes('Dry')))
    )
  );
};

export const getAlertsForConcerns = (concerns: string[]): IngredientAlert[] => {
  const concernMap: { [key: string]: string[] } = {
    'Acne': ['Acne-prone', 'Oily'],
    'Dryness': ['Dry'],
    'Sensitivity': ['Sensitive'],
    'Fine Lines': ['Mature'],
    'Pigmentation': ['Dark skin tones']
  };

  const relevantConditions = concerns.flatMap(concern => concernMap[concern] || []);
  
  return ingredientAlerts.filter(alert =>
    alert.avoidFor.some(condition =>
      relevantConditions.some(relevant =>
        condition.toLowerCase().includes(relevant.toLowerCase())
      )
    )
  );
};

export const searchIngredients = (searchTerm: string): IngredientAlert[] => {
  const term = searchTerm.toLowerCase();
  return ingredientAlerts.filter(alert =>
    alert.ingredient.toLowerCase().includes(term) ||
    alert.risk.toLowerCase().includes(term) ||
    alert.description.toLowerCase().includes(term)
  );
};