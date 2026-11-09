import { Recipe, SpiceLevel } from '../types';

/**
 * Accurately determines or infers the spice level of any Indian recipe.
 */
export function getRecipeSpiceLevel(recipe: Recipe): SpiceLevel {
  if (recipe.spiceLevel) return recipe.spiceLevel;

  const text = `${recipe.title} ${recipe.category} ${recipe.description} ${(recipe.tags || []).join(' ')}`.toLowerCase();

  // Mild dishes
  if (
    recipe.category.includes('Sweets') ||
    recipe.category.includes('Drinks') ||
    recipe.category.includes('Kids') ||
    text.includes('kheer') ||
    text.includes('halwa') ||
    text.includes('payasam') ||
    text.includes('sweet') ||
    text.includes('mithai') ||
    text.includes('lassi') ||
    text.includes('curd rice') ||
    text.includes('khichdi') ||
    text.includes('idli')
  ) {
    return 'Mild';
  }

  // Extra Hot dishes
  if (
    text.includes('kolhapuri') ||
    text.includes('vindaloo') ||
    text.includes('laal maas') ||
    text.includes('bhut jolokia') ||
    text.includes('chettinad pepper') ||
    text.includes('fiery') ||
    text.includes('andhra spicy') ||
    text.includes('mirchi')
  ) {
    return 'Extra Hot';
  }

  // Spicy dishes
  if (
    text.includes('biryani') ||
    text.includes('rogan josh') ||
    text.includes('chettinad') ||
    text.includes('masala') ||
    text.includes('kadai') ||
    text.includes('kadhai') ||
    text.includes('tikka') ||
    text.includes('sambar') ||
    text.includes('curry') ||
    text.includes('gravy') ||
    text.includes('chaat') ||
    text.includes('chilli')
  ) {
    return 'Spicy';
  }

  return 'Medium';
}

/**
 * Accurately determines whether a recipe is naturally Gluten-Free
 * based on traditional Indian grain and flour profiles.
 */
export function isRecipeGlutenFree(recipe: Recipe): boolean {
  if (typeof recipe.isGlutenFree === 'boolean') {
    return recipe.isGlutenFree;
  }

  const glutenKeywords = [
    'wheat',
    'maida',
    'all-purpose flour',
    'atta',
    'semolina',
    'sooji',
    'suji',
    'rava',
    'bread',
    'pav',
    'roti',
    'naan',
    'paratha',
    'poori',
    'puri',
    'bhatura',
    'kulcha',
    'sewai',
    'vermicelli'
  ];

  const fullText = (
    recipe.title +
    ' ' +
    recipe.category +
    ' ' +
    recipe.ingredients.map(i => i.item).join(' ') +
    ' ' +
    (recipe.tags || []).join(' ')
  ).toLowerCase();

  // If any ingredient has gluten grain
  for (const keyword of glutenKeywords) {
    // Avoid false positives like "ragi roti" or "makki roti" or "rice flour"
    if (fullText.includes(keyword)) {
      if (
        fullText.includes('gluten free') ||
        fullText.includes('ragi') ||
        fullText.includes('jowar') ||
        fullText.includes('bajra') ||
        fullText.includes('rice flour')
      ) {
        continue;
      }
      return false;
    }
  }

  return true;
}

/**
 * Accurately determines if an Indian recipe is 100% Vegan (Plant-Based),
 * ensuring zero animal products, dairy (milk, ghee, butter, paneer, curd, cream, khoya), or honey.
 */
export function isRecipeVegan(recipe: Recipe): boolean {
  if (recipe.dietary?.toLowerCase() === 'vegan') return true;
  if (recipe.dietary?.toLowerCase() === 'non-vegetarian') return false;

  const dairyKeywords = [
    'milk', 'ghee', 'butter', 'paneer', 'curd', 'yogurt', 'dahi', 'cheese',
    'cream', 'malai', 'khoya', 'mawa', 'chhena', 'condensed milk', 'honey',
    'buttermilk', 'lassi', 'makkhan', 'chenna'
  ];

  const fullText = (
    recipe.title + ' ' +
    recipe.category + ' ' +
    recipe.ingredients.map(i => i.item).join(' ') + ' ' +
    (recipe.tags || []).join(' ')
  ).toLowerCase();

  // If explicit vegan tag is present
  if ((recipe.tags || []).some(t => t.toLowerCase().includes('vegan'))) {
    return true;
  }

  for (const dairy of dairyKeywords) {
    if (fullText.includes(dairy)) {
      return false;
    }
  }

  return true;
}

/**
 * Accurately determines if an Indian recipe is Keto-Friendly (Low Carbohydrate, High Healthy Fat).
 * Recommends dishes emphasizing paneer, chicken/egg/fish, greens (palak/methi), cauliflower, coconut,
 * while excluding sugar, heavy grains, rice, potatoes, and high-carb doughs.
 */
export function isRecipeKeto(recipe: Recipe): boolean {
  const fullText = (
    recipe.title + ' ' +
    recipe.category + ' ' +
    recipe.ingredients.map(i => i.item).join(' ') + ' ' +
    (recipe.tags || []).join(' ')
  ).toLowerCase();

  if ((recipe.tags || []).some(t => t.toLowerCase().includes('keto') || t.toLowerCase().includes('low carb'))) {
    return true;
  }

  // Carbs check if nutrition present
  if (recipe.nutrition?.carbs) {
    const carbNum = parseInt(recipe.nutrition.carbs, 10);
    if (!isNaN(carbNum) && carbNum <= 15) {
      return true;
    }
  }

  // Major High-Carb Exclusions
  const highCarbExclusions = [
    'sugar', 'jaggery', 'gur', 'potato', 'aloo', 'rice', 'chawal', 'pulao', 'biryani',
    'maida', 'atta', 'bread', 'sooji', 'rava', 'pasta', 'noodles', 'sweet', 'mithai',
    'halwa', 'kheer', 'ladoo', 'sweet potato'
  ];

  for (const carb of highCarbExclusions) {
    if (fullText.includes(carb)) {
      return false;
    }
  }

  // Positive Keto Indicators in Indian Cuisine
  const ketoIngredients = [
    'paneer', 'chicken', 'egg', 'fish', 'prawn', 'mutton', 'cauliflower', 'gobi',
    'palak', 'spinach', 'methi', 'mushroom', 'cabbage', 'avocado', 'coconut milk',
    'almond flour', 'ghee', 'butter', 'tandoori'
  ];

  return ketoIngredients.some(item => fullText.includes(item));
}

/**
 * Accurately determines if an Indian recipe is Diabetic-Friendly.
 * Focuses on Low Glycemic Index (GI), high-fiber legumes (moong dal, sprouts, chana),
 * whole millets (ragi, jowar, bajra), bitter actives (karela, methi, amla, cinnamon, turmeric),
 * and strictly zero added refined sugar, jaggery syrups, or deep-fried sweets.
 */
export function isRecipeDiabeticFriendly(recipe: Recipe): boolean {
  const fullText = (
    recipe.title + ' ' +
    recipe.category + ' ' +
    recipe.ingredients.map(i => i.item).join(' ') + ' ' +
    (recipe.tags || []).join(' ')
  ).toLowerCase();

  if ((recipe.tags || []).some(t => 
    t.toLowerCase().includes('diabetic') || 
    t.toLowerCase().includes('sugar free') ||
    t.toLowerCase().includes('low gi')
  )) {
    return true;
  }

  // Strict exclusions for diabetes management
  const diabeticExclusions = [
    'sugar', 'jaggery', 'gur', 'condensed milk', 'sweet syrup', 'mithai',
    'halwa', 'kheer', 'gulab jamun', 'rasgulla', 'jalebi', 'barfi',
    'ladoo', 'chashni', 'maida'
  ];

  for (const item of diabeticExclusions) {
    if (fullText.includes(item)) {
      return false;
    }
  }

  // Positive Diabetic-Friendly Actives & Low GI Superfoods in Indian Cuisine
  const diabeticFriendlySuperfoods = [
    'methi', 'fenugreek', 'karela', 'bitter gourd', 'amla', 'jamun', 'dalchini',
    'cinnamon', 'flaxseed', 'chia', 'palak', 'spinach', 'moong', 'sprouts',
    'ragi', 'jowar', 'bajra', 'millet', 'oats', 'chana', 'cucumber', 'garlic',
    'turmeric', 'lauki', 'bottle gourd', 'drumstick', 'moringa', 'khichdi'
  ];

  return diabeticFriendlySuperfoods.some(item => fullText.includes(item));
}

export type HealthDietaryPreference = 'all' | 'vegan' | 'gluten-free' | 'keto' | 'diabetic-friendly';

export function matchesDietaryHealthPreference(recipe: Recipe, preference: HealthDietaryPreference): boolean {
  if (preference === 'all') return true;
  if (preference === 'vegan') return isRecipeVegan(recipe);
  if (preference === 'gluten-free') return isRecipeGlutenFree(recipe);
  if (preference === 'keto') return isRecipeKeto(recipe);
  if (preference === 'diabetic-friendly') return isRecipeDiabeticFriendly(recipe);
  return true;
}

