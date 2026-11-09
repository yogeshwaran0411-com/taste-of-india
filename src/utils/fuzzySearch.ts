import { Recipe } from '../types';

/**
 * Standard Levenshtein distance calculation for typo-tolerance
 */
export const levenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

/**
 * Common state synonyms, regional nicknames, and abbreviations
 */
const STATE_ALIASES: Record<string, string[]> = {
  'tamil nadu': ['tamil nadu', 'tamilnadu', 'tn', 'chennai', 'madras', 'chettinad', 'tamizh', 'kongu', 'madurai'],
  'kerala': ['kerala', 'kl', 'malabar', 'cochin', 'kochi', 'travancore', 'keralite', 'malayali', 'alleppey'],
  'karnataka': ['karnataka', 'ka', 'bengaluru', 'bangalore', 'mysore', 'mysuru', 'mangalorean', 'udupi', 'kundapura'],
  'andhra pradesh': ['andhra pradesh', 'andhra', 'ap', 'telugu', 'guntur', 'rayalaseema', 'amaravati', 'vizag'],
  'telangana': ['telangana', 'ts', 'hyderabad', 'hyderabadi', 'nizami', 'deccan', 'warangal'],
  'punjab': ['punjab', 'pb', 'punjabi', 'amritsar', 'amritsari', 'patiala', 'dhaba'],
  'west bengal': ['west bengal', 'bengal', 'wb', 'bengali', 'kolkata', 'calcutta', 'bangla'],
  'gujarat': ['gujarat', 'gj', 'gujarati', 'kathiyawadi', 'surat', 'ahmedabad'],
  'rajasthan': ['rajasthan', 'rj', 'rajasthani', 'marwari', 'jaipur', 'mewar', 'jodhpur', 'shekhawati'],
  'maharashtra': ['maharashtra', 'mh', 'marathi', 'mumbai', 'bombay', 'pune', 'kolhapuri', 'malvani', 'konkan', 'vidarbha'],
  'uttar pradesh': ['uttar pradesh', 'up', 'awadh', 'awadhi', 'lucknow', 'lucknowi', 'banaras', 'varanasi', 'mughlai'],
  'madhya pradesh': ['madhya pradesh', 'mp', 'indore', 'bhopal', 'malwa'],
  'odisha': ['odisha', 'orissa', 'oriya', 'odia', 'puri', 'cuttack'],
  'bihar': ['bihar', 'br', 'bihari', 'bhojpuri', 'magahi', 'mithila'],
  'goa': ['goa', 'ga', 'goan', 'konkani'],
  'jammu and kashmir': ['jammu and kashmir', 'jammu & kashmir', 'jk', 'kashmir', 'kashmiri', 'wazwan', 'ladakh'],
  'himachal pradesh': ['himachal pradesh', 'himachal', 'hp', 'pahadi', 'dham'],
  'uttarakhand': ['uttarakhand', 'uk', 'garhwal', 'kumaon'],
  'assam': ['assam', 'as', 'assamese'],
  'delhi': ['delhi', 'dl', 'new delhi', 'purani dilli', 'dilli']
};

/**
 * Dietary keywords and mapping
 */
const DIETARY_ALIASES: Record<string, string[]> = {
  'Vegetarian': ['veg', 'vegetarian', 'pure veg', 'pure-veg', 'veggie', 'shakahari', 'shakahar', 'lacto-vegetarian'],
  'Non-Vegetarian': ['non-veg', 'nonveg', 'non-vegetarian', 'non veg', 'meat', 'chicken', 'mutton', 'fish', 'prawn', 'egg', 'seafood', 'lamb'],
  'Vegan': ['vegan', 'plant-based', 'dairy-free']
};

export interface FuzzySearchResult {
  recipe: Recipe;
  score: number;
  matchedFields: {
    title: boolean;
    state?: string;
    dietary?: string;
    ingredients: string[];
    category?: string;
    tags: string[];
  };
}

/**
 * Normalizes input string for search
 */
const clean = (s: string): string => {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim();
};

/**
 * Tests if token matches target with exact, prefix, substring or Levenshtein tolerance
 */
const matchTokenAgainstString = (token: string, target: string): { matches: boolean; score: number } => {
  const normTarget = clean(target);
  const normToken = clean(token);

  if (!normTarget || !normToken) return { matches: false, score: 0 };

  // 1. Exact match
  if (normTarget === normToken) {
    return { matches: true, score: 100 };
  }

  // 2. Starts with query token
  if (normTarget.startsWith(normToken)) {
    return { matches: true, score: 85 };
  }

  // 3. Word-boundary starts with (e.g., "dosa" in "Masala Dosa")
  const words = normTarget.split(/\s+/);
  for (const word of words) {
    if (word === normToken) {
      return { matches: true, score: 90 };
    }
    if (word.startsWith(normToken)) {
      return { matches: true, score: 80 };
    }
  }

  // 4. Substring contains
  if (normTarget.includes(normToken)) {
    return { matches: true, score: 70 };
  }

  // 5. Typo tolerance via Levenshtein distance
  const len = normToken.length;
  if (len >= 3) {
    // Check against individual words in target
    for (const word of words) {
      if (Math.abs(word.length - len) <= 2) {
        const dist = levenshteinDistance(normToken, word);
        if (len <= 4 && dist <= 1) {
          return { matches: true, score: 55 };
        }
        if (len >= 5 && dist <= 1) {
          return { matches: true, score: 65 };
        }
        if (len >= 6 && dist <= 2) {
          return { matches: true, score: 48 };
        }
      }
    }
  }

  return { matches: false, score: 0 };
};

/**
 * Main Real-time Multi-Field Fuzzy Search Engine
 * Searches simultaneously across:
 * 1. Title
 * 2. Origin State (& State Aliases)
 * 3. Dietary Type (Veg, Non-Veg, Vegan)
 * 4. Ingredients List
 * 5. Category & Tags
 */
export const fuzzySearchRecipes = (
  recipes: Recipe[],
  query: string,
  options: { maxResults?: number; threshold?: number } = {}
): FuzzySearchResult[] => {
  const rawQuery = query.trim();
  if (!rawQuery) {
    return recipes.map(r => ({
      recipe: r,
      score: 1,
      matchedFields: { title: false, ingredients: [], tags: [] }
    }));
  }

  const { maxResults = 30, threshold = 25 } = options;
  const tokens = rawQuery.toLowerCase().split(/\s+/).filter(Boolean);

  const results: FuzzySearchResult[] = [];

  for (const recipe of recipes) {
    let totalScore = 0;
    let tokensMatchedCount = 0;

    const matchedFields: FuzzySearchResult['matchedFields'] = {
      title: false,
      ingredients: [],
      tags: []
    };

    // Keep track of which fields were matched for multi-field synergy
    const criteriaMatched = new Set<'title' | 'state' | 'dietary' | 'ingredient' | 'tag'>();

    for (const token of tokens) {
      let bestTokenScore = 0;

      // --- CRITERIA 1: TITLE MATCH ---
      const titleMatch = matchTokenAgainstString(token, recipe.title);
      if (titleMatch.matches) {
        const weighted = titleMatch.score * 3.0; // High weight for title
        if (weighted > bestTokenScore) bestTokenScore = weighted;
        matchedFields.title = true;
        criteriaMatched.add('title');
      }

      // --- CRITERIA 2: ORIGIN STATE MATCH ---
      // Check recipe state directly
      const stateMatch = matchTokenAgainstString(token, recipe.state);
      if (stateMatch.matches) {
        const weighted = stateMatch.score * 2.8;
        if (weighted > bestTokenScore) bestTokenScore = weighted;
        matchedFields.state = recipe.state;
        criteriaMatched.add('state');
      } else {
        // Check state aliases (e.g. 'tn' -> Tamil Nadu, 'bengal' -> West Bengal)
        const recipeStateLower = recipe.state.toLowerCase();
        for (const [canonicalState, aliases] of Object.entries(STATE_ALIASES)) {
          if (recipeStateLower.includes(canonicalState) || canonicalState.includes(recipeStateLower)) {
            const aliasMatch = aliases.some(alias => {
              const res = matchTokenAgainstString(token, alias);
              return res.matches && res.score >= 70;
            });
            if (aliasMatch) {
              const weighted = 240; // High bonus for recognized state alias
              if (weighted > bestTokenScore) bestTokenScore = weighted;
              matchedFields.state = recipe.state;
              criteriaMatched.add('state');
              break;
            }
          }
        }
      }

      // --- CRITERIA 3: DIETARY TYPE MATCH ---
      const recipeDietary = recipe.dietary;
      // Match direct dietary string
      const dietaryMatch = matchTokenAgainstString(token, recipeDietary);
      if (dietaryMatch.matches) {
        const weighted = dietaryMatch.score * 2.5;
        if (weighted > bestTokenScore) bestTokenScore = weighted;
        matchedFields.dietary = recipeDietary;
        criteriaMatched.add('dietary');
      } else {
        // Match aliases (e.g. 'veg', 'nonveg', 'non-veg')
        for (const [canonicalDiet, aliases] of Object.entries(DIETARY_ALIASES)) {
          if (canonicalDiet.toLowerCase() === recipeDietary.toLowerCase()) {
            const matchesAlias = aliases.some(alias => {
              const res = matchTokenAgainstString(token, alias);
              return res.matches && res.score >= 70;
            });
            if (matchesAlias) {
              const weighted = 220;
              if (weighted > bestTokenScore) bestTokenScore = weighted;
              matchedFields.dietary = recipeDietary;
              criteriaMatched.add('dietary');
              break;
            }
          }
        }
      }

      // --- CRITERIA 4: INGREDIENTS LIST MATCH ---
      if (Array.isArray(recipe.ingredients)) {
        for (const ing of recipe.ingredients) {
          const ingMatch = matchTokenAgainstString(token, ing.item);
          if (ingMatch.matches) {
            const weighted = ingMatch.score * 2.4;
            if (weighted > bestTokenScore) bestTokenScore = weighted;
            if (!matchedFields.ingredients.includes(ing.item)) {
              matchedFields.ingredients.push(ing.item);
            }
            criteriaMatched.add('ingredient');
          }
        }
      }

      // --- CRITERIA 5: CATEGORY & TAGS MATCH ---
      if (recipe.category) {
        const catMatch = matchTokenAgainstString(token, recipe.category);
        if (catMatch.matches) {
          const weighted = catMatch.score * 1.5;
          if (weighted > bestTokenScore) bestTokenScore = weighted;
          matchedFields.category = recipe.category;
          criteriaMatched.add('tag');
        }
      }

      if (Array.isArray(recipe.tags)) {
        for (const tag of recipe.tags) {
          const tagMatch = matchTokenAgainstString(token, tag);
          if (tagMatch.matches) {
            const weighted = tagMatch.score * 1.3;
            if (weighted > bestTokenScore) bestTokenScore = weighted;
            if (!matchedFields.tags.includes(tag)) {
              matchedFields.tags.push(tag);
            }
            criteriaMatched.add('tag');
          }
        }
      }

      if (bestTokenScore > 0) {
        totalScore += bestTokenScore;
        tokensMatchedCount++;
      }
    }

    // MULTI-CRITERIA SYNERGY BONUS:
    // If a recipe simultaneously matches multiple distinct criteria (e.g. origin state AND ingredient, or dietary AND state),
    // give a substantial bonus to ensure the most relevant multi-field recipes rank at the top!
    const distinctCriteriaCount = criteriaMatched.size;
    if (distinctCriteriaCount >= 2) {
      totalScore += distinctCriteriaCount * 75; // e.g., State + Ingredient = +150 bonus
    }
    if (distinctCriteriaCount >= 3) {
      totalScore += 150; // State + Dietary + Ingredient = massive +375 total bonus
    }

    // Check query completeness: did all tokens match something?
    if (tokensMatchedCount === tokens.length) {
      totalScore += 100; // Perfect multi-word query satisfaction
    }

    // Only include if at least one token matched with sufficient score
    if (tokensMatchedCount > 0 && totalScore >= threshold) {
      // Normalize score by token count
      const finalScore = Math.round(totalScore / tokens.length);
      results.push({
        recipe,
        score: finalScore,
        matchedFields
      });
    }
  }

  // Sort descending by score, tie-breaking by recipe rating & likes
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return (b.recipe.rating * 10 + b.recipe.likes) - (a.recipe.rating * 10 + a.recipe.likes);
  });

  return results.slice(0, maxResults);
};
