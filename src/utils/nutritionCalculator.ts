import { Ingredient, NutritionInfo } from '../types';

export interface IngredientNutrientProfile {
  name: string;
  keywords: string[];
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  typicalGramPerUnit?: number; // e.g. 1 onion ~ 110g, 1 clove garlic ~ 4g
}

// Comprehensive database of common Indian culinary ingredients (per 100g)
export const INGREDIENT_DATABASE: IngredientNutrientProfile[] = [
  // Meats & Poultry & Seafood
  { name: 'Chicken', keywords: ['chicken', 'murgh', 'poultry'], caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6, fiberPer100g: 0, typicalGramPerUnit: 150 },
  { name: 'Mutton / Lamb', keywords: ['mutton', 'lamb', 'gosht', 'goat'], caloriesPer100g: 250, proteinPer100g: 25, carbsPer100g: 0, fatPer100g: 17, fiberPer100g: 0, typicalGramPerUnit: 180 },
  { name: 'Fish', keywords: ['fish', 'meen', 'machli', 'pomfret', 'rohu', 'hilsa', 'salmon'], caloriesPer100g: 130, proteinPer100g: 22, carbsPer100g: 0, fatPer100g: 4.5, fiberPer100g: 0, typicalGramPerUnit: 150 },
  { name: 'Prawns / Shrimp', keywords: ['prawn', 'shrimp', 'jhinga'], caloriesPer100g: 99, proteinPer100g: 24, carbsPer100g: 0.2, fatPer100g: 0.3, fiberPer100g: 0 },
  { name: 'Egg', keywords: ['egg', 'anda', 'eggs'], caloriesPer100g: 143, proteinPer100g: 13, carbsPer100g: 0.7, fatPer100g: 9.5, fiberPer100g: 0, typicalGramPerUnit: 50 },

  // Dairy & Fats
  { name: 'Paneer', keywords: ['paneer', 'cottage cheese', 'chenna'], caloriesPer100g: 290, proteinPer100g: 18, carbsPer100g: 3.5, fatPer100g: 22, fiberPer100g: 0 },
  { name: 'Ghee', keywords: ['ghee', 'clarified butter', 'desi ghee'], caloriesPer100g: 900, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100, fiberPer100g: 0 },
  { name: 'Butter', keywords: ['butter', 'makhan'], caloriesPer100g: 717, proteinPer100g: 0.9, carbsPer100g: 0.1, fatPer100g: 81, fiberPer100g: 0 },
  { name: 'Cooking Oil', keywords: ['oil', 'sesame oil', 'gingelly', 'mustard oil', 'coconut oil', 'sunflower oil'], caloriesPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100, fiberPer100g: 0 },
  { name: 'Curd / Yogurt', keywords: ['curd', 'yogurt', 'dahi'], caloriesPer100g: 61, proteinPer100g: 3.5, carbsPer100g: 4.7, fatPer100g: 3.3, fiberPer100g: 0 },
  { name: 'Milk', keywords: ['milk', 'doodh'], caloriesPer100g: 64, proteinPer100g: 3.3, carbsPer100g: 4.8, fatPer100g: 3.6, fiberPer100g: 0 },
  { name: 'Cream / Malai', keywords: ['cream', 'malai', 'fresh cream'], caloriesPer100g: 345, proteinPer100g: 2.5, carbsPer100g: 3.5, fatPer100g: 37, fiberPer100g: 0 },

  // Rice & Grains & Flours
  { name: 'Rice', keywords: ['rice', 'basmati', 'chawal', 'pulao rice', 'biryani rice'], caloriesPer100g: 360, proteinPer100g: 7, carbsPer100g: 79, fatPer100g: 0.6, fiberPer100g: 1.3 },
  { name: 'Wheat Flour / Atta', keywords: ['atta', 'wheat flour', 'gehu'], caloriesPer100g: 340, proteinPer100g: 12, carbsPer100g: 72, fatPer100g: 1.7, fiberPer100g: 10.7 },
  { name: 'Maida / All Purpose', keywords: ['maida', 'refined flour', 'all purpose flour'], caloriesPer100g: 364, proteinPer100g: 10, carbsPer100g: 76, fatPer100g: 1, fiberPer100g: 2.7 },
  { name: 'Semolina / Sooji', keywords: ['sooji', 'suji', 'semolina', 'rava'], caloriesPer100g: 360, proteinPer100g: 12, carbsPer100g: 73, fatPer100g: 1, fiberPer100g: 3.9 },
  { name: 'Besan / Gram Flour', keywords: ['besan', 'gram flour', 'chickpea flour'], caloriesPer100g: 387, proteinPer100g: 22, carbsPer100g: 58, fatPer100g: 6.7, fiberPer100g: 10.8 },
  { name: 'Poha / Flattened Rice', keywords: ['poha', 'flattened rice', 'aval'], caloriesPer100g: 350, proteinPer100g: 6.6, carbsPer100g: 77, fatPer100g: 1.2, fiberPer100g: 2.8 },
  { name: 'Millet / Ragi', keywords: ['ragi', 'millet', 'bajra', 'jowar'], caloriesPer100g: 328, proteinPer100g: 7.3, carbsPer100g: 72, fatPer100g: 1.3, fiberPer100g: 11.5 },

  // Lentils & Pulses (Dals)
  { name: 'Toor Dal', keywords: ['toor dal', 'arhar dal', 'pigeon pea'], caloriesPer100g: 343, proteinPer100g: 22, carbsPer100g: 63, fatPer100g: 1.5, fiberPer100g: 15 },
  { name: 'Moong Dal', keywords: ['moong dal', 'mung dal', 'green gram'], caloriesPer100g: 347, proteinPer100g: 24, carbsPer100g: 63, fatPer100g: 1.2, fiberPer100g: 16 },
  { name: 'Urad Dal', keywords: ['urad dal', 'black gram', 'black lentil'], caloriesPer100g: 341, proteinPer100g: 25, carbsPer100g: 59, fatPer100g: 1.6, fiberPer100g: 18 },
  { name: 'Chana Dal / Chickpeas', keywords: ['chana dal', 'chana', 'chickpeas', 'chole', 'kabuli chana'], caloriesPer100g: 364, proteinPer100g: 19, carbsPer100g: 61, fatPer100g: 6, fiberPer100g: 17 },
  { name: 'Rajma / Kidney Beans', keywords: ['rajma', 'kidney bean', 'kidney beans'], caloriesPer100g: 333, proteinPer100g: 24, carbsPer100g: 60, fatPer100g: 0.8, fiberPer100g: 15 },
  { name: 'Masoor Dal', keywords: ['masoor', 'red lentil'], caloriesPer100g: 352, proteinPer100g: 24, carbsPer100g: 60, fatPer100g: 1.1, fiberPer100g: 11 },

  // Vegetables & Aromatics
  { name: 'Onion', keywords: ['onion', 'shallot', 'sambar onion', 'pyaz'], caloriesPer100g: 40, proteinPer100g: 1.1, carbsPer100g: 9.3, fatPer100g: 0.1, fiberPer100g: 1.7, typicalGramPerUnit: 100 },
  { name: 'Tomato', keywords: ['tomato', 'tamatar'], caloriesPer100g: 18, proteinPer100g: 0.9, carbsPer100g: 3.9, fatPer100g: 0.2, fiberPer100g: 1.2, typicalGramPerUnit: 90 },
  { name: 'Potato', keywords: ['potato', 'aloo', 'potatoes'], caloriesPer100g: 77, proteinPer100g: 2, carbsPer100g: 17.5, fatPer100g: 0.1, fiberPer100g: 2.2, typicalGramPerUnit: 120 },
  { name: 'Ginger', keywords: ['ginger', 'adrak'], caloriesPer100g: 80, proteinPer100g: 1.8, carbsPer100g: 18, fatPer100g: 0.8, fiberPer100g: 2, typicalGramPerUnit: 15 },
  { name: 'Garlic', keywords: ['garlic', 'lahsun'], caloriesPer100g: 149, proteinPer100g: 6.4, carbsPer100g: 33, fatPer100g: 0.5, fiberPer100g: 2.1, typicalGramPerUnit: 4 },
  { name: 'Green Chilli', keywords: ['green chilli', 'chilli', 'mirchi', 'chillies'], caloriesPer100g: 40, proteinPer100g: 1.9, carbsPer100g: 8.8, fatPer100g: 0.4, fiberPer100g: 1.5, typicalGramPerUnit: 5 },
  { name: 'Spinach / Palak', keywords: ['spinach', 'palak', 'keerai'], caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4, fiberPer100g: 2.2, typicalGramPerUnit: 200 },
  { name: 'Cauliflower / Gobi', keywords: ['cauliflower', 'gobi'], caloriesPer100g: 25, proteinPer100g: 1.9, carbsPer100g: 5, fatPer100g: 0.3, fiberPer100g: 2, typicalGramPerUnit: 400 },
  { name: 'Green Peas / Matar', keywords: ['peas', 'matar', 'green peas'], caloriesPer100g: 81, proteinPer100g: 5.4, carbsPer100g: 14.5, fatPer100g: 0.4, fiberPer100g: 5.7 },
  { name: 'Carrot', keywords: ['carrot', 'gajar'], caloriesPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 9.6, fatPer100g: 0.2, fiberPer100g: 2.8, typicalGramPerUnit: 70 },
  { name: 'Capsicum / Bell Pepper', keywords: ['capsicum', 'bell pepper', 'shimla mirch'], caloriesPer100g: 31, proteinPer100g: 1, carbsPer100g: 6, fatPer100g: 0.3, fiberPer100g: 2.1, typicalGramPerUnit: 120 },
  { name: 'Brinjal / Eggplant', keywords: ['brinjal', 'eggplant', 'baingan'], caloriesPer100g: 25, proteinPer100g: 1, carbsPer100g: 5.9, fatPer100g: 0.2, fiberPer100g: 3, typicalGramPerUnit: 150 },
  { name: 'Okra / Bhindi', keywords: ['okra', 'bhindi', 'ladyfinger'], caloriesPer100g: 33, proteinPer100g: 1.9, carbsPer100g: 7.5, fatPer100g: 0.2, fiberPer100g: 3.2, typicalGramPerUnit: 15 },
  { name: 'Curry Leaves / Coriander', keywords: ['curry leaves', 'coriander leaves', 'cilantro', 'mint', 'pudina'], caloriesPer100g: 45, proteinPer100g: 3, carbsPer100g: 7, fatPer100g: 0.8, fiberPer100g: 4, typicalGramPerUnit: 5 },

  // Nuts, Seeds & Coconut
  { name: 'Cashews', keywords: ['cashew', 'kaju'], caloriesPer100g: 553, proteinPer100g: 18, carbsPer100g: 30, fatPer100g: 44, fiberPer100g: 3.3, typicalGramPerUnit: 2 },
  { name: 'Almonds', keywords: ['almond', 'badam'], caloriesPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatPer100g: 50, fiberPer100g: 12.5, typicalGramPerUnit: 1.2 },
  { name: 'Peanuts', keywords: ['peanut', 'groundnut', 'moongphali'], caloriesPer100g: 567, proteinPer100g: 26, carbsPer100g: 16, fatPer100g: 49, fiberPer100g: 8.5 },
  { name: 'Fresh Coconut', keywords: ['coconut', 'nariyal', 'grated coconut', 'coconut milk'], caloriesPer100g: 354, proteinPer100g: 3.3, carbsPer100g: 15, fatPer100g: 33, fiberPer100g: 9 },
  { name: 'Raisins', keywords: ['raisin', 'kishmish'], caloriesPer100g: 299, proteinPer100g: 3.1, carbsPer100g: 79, fatPer100g: 0.5, fiberPer100g: 3.7 },
  { name: 'Sesame Seeds / Til', keywords: ['sesame', 'til'], caloriesPer100g: 573, proteinPer100g: 18, carbsPer100g: 23, fatPer100g: 50, fiberPer100g: 12 },

  // Sweeteners & Miscellaneous
  { name: 'Sugar', keywords: ['sugar', 'chini'], caloriesPer100g: 387, proteinPer100g: 0, carbsPer100g: 100, fatPer100g: 0, fiberPer100g: 0 },
  { name: 'Jaggery / Gur', keywords: ['jaggery', 'gur', 'gud'], caloriesPer100g: 383, proteinPer100g: 0.4, carbsPer100g: 98, fatPer100g: 0.1, fiberPer100g: 0 },
  { name: 'Honey', keywords: ['honey', 'shehed'], caloriesPer100g: 304, proteinPer100g: 0.3, carbsPer100g: 82, fatPer100g: 0, fiberPer100g: 0 },

  // Spices & Condiments (dense micronutrients, used in small quantities)
  { name: 'Spices & Masalas', keywords: ['turmeric', 'cumin', 'coriander powder', 'garam masala', 'cardamom', 'cinnamon', 'clove', 'mustard seed', 'fennel', 'pepper', 'black pepper', 'chilli powder'], caloriesPer100g: 310, proteinPer100g: 10, carbsPer100g: 55, fatPer100g: 12, fiberPer100g: 22 },
  { name: 'Salt', keywords: ['salt', 'rock salt', 'namak'], caloriesPer100g: 0, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0, fiberPer100g: 0 }
];

export interface CalculatedIngredientItem {
  originalItem: string;
  originalQuantity: string;
  matchedName: string;
  weightGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface DynamicNutritionResult {
  perServing: {
    calories: number;
    protein: number; // in g
    carbs: number;   // in g
    fat: number;     // in g
    fiber: number;   // in g
  };
  totalRecipe: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    weightGrams: number;
  };
  macroSplitPercentages: {
    proteinPct: number;
    carbsPct: number;
    fatPct: number;
  };
  dailyValuePercentages: {
    caloriesPct: number;
    proteinPct: number;
    carbsPct: number;
    fatPct: number;
    fiberPct: number;
  };
  servings: number;
  items: CalculatedIngredientItem[];
}

// Convert arbitrary quantity strings to estimated weight in grams
export const parseQuantityToGrams = (qtyStr: string, itemStr: string, profile?: IngredientNutrientProfile): number => {
  if (!qtyStr) return 20;
  const clean = qtyStr.toLowerCase().trim();

  if (clean.includes('taste') || clean.includes('pinch')) {
    return 3;
  }

  // Extract numeric portion (handles fractions like '1/2', '1 1/2', '0.5')
  let num = 1;
  const fracMatch = clean.match(/(\d+)\s*\/\s*(\d+)/);
  const wholeFracMatch = clean.match(/(\d+)\s+(\d+)\s*\/\s*(\d+)/);
  const decMatch = clean.match(/([\d.]+)/);

  if (wholeFracMatch) {
    const whole = parseFloat(wholeFracMatch[1]);
    const numPart = parseFloat(wholeFracMatch[2]);
    const denPart = parseFloat(wholeFracMatch[3]);
    num = whole + (numPart / denPart);
  } else if (fracMatch) {
    num = parseFloat(fracMatch[1]) / parseFloat(fracMatch[2]);
  } else if (decMatch) {
    num = parseFloat(decMatch[1]);
  }

  // Detect Unit
  if (clean.includes('kg') || clean.includes('kilogram')) {
    return num * 1000;
  }
  if (clean.includes('mg')) {
    return num * 0.001;
  }
  if (clean.includes('g') || clean.includes('gram') || clean.includes('gm')) {
    return num;
  }
  if (clean.includes('l') || clean.includes('litre') || clean.includes('liter')) {
    return num * 1000;
  }
  if (clean.includes('ml')) {
    return num * 1; // approx 1ml ~ 1g water/milk density
  }
  if (clean.includes('tbsp') || clean.includes('tablespoon')) {
    // 1 tbsp ~ 15g (oil/ghee ~ 14g, flour ~ 10g, liquids ~ 15g)
    return num * 15;
  }
  if (clean.includes('tsp') || clean.includes('teaspoon')) {
    // 1 tsp ~ 5g
    return num * 5;
  }
  if (clean.includes('cup')) {
    // 1 cup ~ 200g - 240g
    if (itemStr.includes('rice') || itemStr.includes('flour') || itemStr.includes('dal')) {
      return num * 180;
    }
    return num * 220;
  }
  if (clean.includes('clove') || clean.includes('pod')) {
    return num * 4;
  }
  if (clean.includes('sprig') || clean.includes('leaf') || clean.includes('leaves')) {
    return num * 3;
  }
  if (clean.includes('inch') || clean.includes('piece') || clean.includes('slice')) {
    return num * (profile?.typicalGramPerUnit || 15);
  }

  // Default unit-less count (e.g. "2 Onions", "3 Potatoes")
  if (profile?.typicalGramPerUnit) {
    return num * profile.typicalGramPerUnit;
  }

  return num * 50;
};

// Match an ingredient item name with the best profile in our nutrient database
export const findBestNutrientProfile = (itemText: string): IngredientNutrientProfile => {
  const lower = itemText.toLowerCase();

  // 1. Direct or keyword match
  for (const prof of INGREDIENT_DATABASE) {
    for (const kw of prof.keywords) {
      if (lower.includes(kw)) {
        return prof;
      }
    }
  }

  // 2. Default generic fallback
  return {
    name: 'General Culinary Ingredient',
    keywords: [],
    caloriesPer100g: 120,
    proteinPer100g: 3,
    carbsPer100g: 15,
    fatPer100g: 3,
    fiberPer100g: 2,
    typicalGramPerUnit: 50
  };
};

/**
 * Dynamically estimates calories and macros per serving based on the ingredient list
 * and selected serving scale.
 */
export const calculateDynamicNutrition = (
  ingredients: Ingredient[],
  servings: number = 4,
  baseNutrition?: NutritionInfo
): DynamicNutritionResult => {
  const safeServings = Math.max(1, servings || 4);

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalWeight = 0;

  const items: CalculatedIngredientItem[] = [];

  for (const ing of ingredients) {
    const profile = findBestNutrientProfile(ing.item);
    const weightGrams = Math.max(1, parseQuantityToGrams(ing.quantity, ing.item, profile));

    const factor = weightGrams / 100;
    const cal = Math.round(profile.caloriesPer100g * factor);
    const prot = Number((profile.proteinPer100g * factor).toFixed(1));
    const carb = Number((profile.carbsPer100g * factor).toFixed(1));
    const fat = Number((profile.fatPer100g * factor).toFixed(1));
    const fib = Number((profile.fiberPer100g * factor).toFixed(1));

    totalCalories += cal;
    totalProtein += prot;
    totalCarbs += carb;
    totalFat += fat;
    totalFiber += fib;
    totalWeight += weightGrams;

    items.push({
      originalItem: ing.item,
      originalQuantity: ing.quantity,
      matchedName: profile.name,
      weightGrams: Math.round(weightGrams),
      calories: cal,
      protein: prot,
      carbs: carb,
      fat: fat,
      fiber: fib
    });
  }

  // If ingredients yielded very small numbers due to minimal mock data,
  // harmonize intelligently with the recipe's preset base nutrition
  if (baseNutrition && totalCalories < 100 && baseNutrition.calories > 0) {
    const baseTotalCals = baseNutrition.calories * 4;
    const protNum = parseFloat(baseNutrition.protein) || 12;
    const carbNum = parseFloat(baseNutrition.carbs) || 30;
    const fatNum = parseFloat(baseNutrition.fat) || 10;
    const fibNum = parseFloat(baseNutrition.fiber || '3') || 3;

    totalCalories = baseTotalCals;
    totalProtein = protNum * 4;
    totalCarbs = carbNum * 4;
    totalFat = fatNum * 4;
    totalFiber = fibNum * 4;
  }

  // Per serving calculation
  const perServingCals = Math.round(totalCalories / safeServings);
  const perServingProtein = Number((totalProtein / safeServings).toFixed(1));
  const perServingCarbs = Number((totalCarbs / safeServings).toFixed(1));
  const perServingFat = Number((totalFat / safeServings).toFixed(1));
  const perServingFiber = Number((totalFiber / safeServings).toFixed(1));

  // Compute Macro Calorie Split Percentages
  // Protein = 4 kcal/g, Carbs = 4 kcal/g, Fat = 9 kcal/g
  const proteinKcal = perServingProtein * 4;
  const carbsKcal = perServingCarbs * 4;
  const fatKcal = perServingFat * 9;
  const totalMacroKcal = proteinKcal + carbsKcal + fatKcal || 1;

  const proteinPct = Math.round((proteinKcal / totalMacroKcal) * 100);
  const carbsPct = Math.round((carbsKcal / totalMacroKcal) * 100);
  const fatPct = Math.max(0, 100 - proteinPct - carbsPct);

  // Daily Value (% DV) based on 2,000 kcal standard Indian/Global dietary benchmark
  // Benchmark reference: Calories 2,000 kcal, Protein 50g, Carbs 275g, Fat 78g, Fiber 28g
  const dailyValuePercentages = {
    caloriesPct: Math.round((perServingCals / 2000) * 100),
    proteinPct: Math.round((perServingProtein / 50) * 100),
    carbsPct: Math.round((perServingCarbs / 275) * 100),
    fatPct: Math.round((perServingFat / 78) * 100),
    fiberPct: Math.round((perServingFiber / 28) * 100)
  };

  return {
    perServing: {
      calories: perServingCals,
      protein: perServingProtein,
      carbs: perServingCarbs,
      fat: perServingFat,
      fiber: perServingFiber
    },
    totalRecipe: {
      calories: Math.round(totalCalories),
      protein: Number(totalProtein.toFixed(1)),
      carbs: Number(totalCarbs.toFixed(1)),
      fat: Number(totalFat.toFixed(1)),
      fiber: Number(totalFiber.toFixed(1)),
      weightGrams: Math.round(totalWeight)
    },
    macroSplitPercentages: {
      proteinPct,
      carbsPct,
      fatPct
    },
    dailyValuePercentages,
    servings: safeServings,
    items
  };
};
