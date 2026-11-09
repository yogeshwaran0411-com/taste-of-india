import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RecipeCard } from './RecipeCard';
import { INDIAN_STATES_AND_UTS } from '../data/states';
import { FOOD_CATEGORIES } from '../data/categories';
import { 
  getRecipeSpiceLevel, 
  isRecipeGlutenFree, 
  matchesDietaryHealthPreference, 
  HealthDietaryPreference 
} from '../utils/recipeFilterHelper';
import { 
  Search, 
  RotateCcw, 
  Users, 
  Flame, 
  Clock, 
  Leaf, 
  WheatOff, 
  Sparkles,
  SlidersHorizontal,
  HeartPulse
} from 'lucide-react';

export const ExploreRecipesView: React.FC = () => {
  const { 
    recipes, 
    searchQuery, 
    setSearchQuery, 
    selectedState, 
    setSelectedState, 
    selectedCategory, 
    setSelectedCategory,
    setCurrentView
  } = useApp();

  const [peoplesOnly, setPeoplesOnly] = useState<boolean>(false);
  const [healthDietaryFilter, setHealthDietaryFilter] = useState<HealthDietaryPreference>('all'); // 'all' | 'vegan' | 'gluten-free' | 'keto' | 'diabetic-friendly'
  const [dietaryFilter, setDietaryFilter] = useState<string>('all'); // 'all' | 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Gluten-Free'
  const [timeFilter, setTimeFilter] = useState<string>('all'); // 'all' | 'quick20' | 'under30' | '30to60' | 'over60'
  const [spiceFilter, setSpiceFilter] = useState<string>('all'); // 'all' | 'Mild' | 'Medium' | 'Spicy' | 'Extra Hot'
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'latest' | 'quick'>('popular');

  // Filter & Search Logic
  const filteredRecipes = recipes.filter(r => {
    // Search query check (name, ingredients, state, category, creator)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = r.title.toLowerCase().includes(q);
      const descMatch = r.description.toLowerCase().includes(q);
      const stateMatch = r.state.toLowerCase().includes(q);
      const catMatch = r.category.toLowerCase().includes(q);
      const creatorMatch = r.creator.name.toLowerCase().includes(q);
      const ingMatch = r.ingredients.some(i => i.item.toLowerCase().includes(q));

      if (!nameMatch && !descMatch && !stateMatch && !catMatch && !creatorMatch && !ingMatch) {
        return false;
      }
    }

    // State check
    if (selectedState && r.state.toLowerCase() !== selectedState.name.toLowerCase()) {
      return false;
    }

    // Category check
    if (selectedCategory && r.category.toLowerCase().replace(/[^a-z0-9]/g, '') !== selectedCategory.toLowerCase().replace(/[^a-z0-9]/g, '')) {
      return false;
    }

    // Filter by Health Dietary Preference (Vegan, Gluten-free, Keto, Diabetic-friendly)
    if (healthDietaryFilter !== 'all') {
      if (!matchesDietaryHealthPreference(r, healthDietaryFilter)) {
        return false;
      }
    }

    // Granular Dietary check (Vegan, Gluten-Free, Vegetarian, Non-Vegetarian)
    if (dietaryFilter !== 'all') {
      if (dietaryFilter === 'Gluten-Free') {
        if (!isRecipeGlutenFree(r)) return false;
      } else if (dietaryFilter === 'Vegan') {
        if (r.dietary.toLowerCase() !== 'vegan') return false;
      } else if (dietaryFilter === 'Vegetarian') {
        if (r.dietary.toLowerCase() !== 'vegetarian') return false;
      } else if (dietaryFilter === 'Non-Vegetarian') {
        if (r.dietary.toLowerCase() !== 'non-vegetarian') return false;
      }
    }

    // Granular Cooking Time filter
    if (timeFilter !== 'all') {
      const time = r.totalTime || ((r.prepTime || 0) + (r.cookTime || 0));
      if (timeFilter === 'quick20' && time > 20) return false;
      if (timeFilter === 'under30' && time > 30) return false;
      if (timeFilter === '30to60' && (time < 30 || time > 60)) return false;
      if (timeFilter === 'over60' && time <= 60) return false;
    }

    // Granular Spice Level filter
    if (spiceFilter !== 'all') {
      const level = getRecipeSpiceLevel(r);
      if (level !== spiceFilter) return false;
    }

    // Difficulty check
    if (difficultyFilter !== 'all' && r.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) {
      return false;
    }

    // People's Uploaded Recipes Filter
    if (peoplesOnly) {
      const isCustom = r.id.startsWith('recipe-custom-') || r.isUserUploaded;
      const hasCommunityTag = r.tags?.some(t => 
        t.toLowerCase().includes('community') || 
        t.toLowerCase().includes('people') || 
        t.toLowerCase().includes('family') ||
        t.toLowerCase().includes('home')
      );
      const isCreatedByHomeCook = r.creator?.id?.includes('user') || r.creator?.id?.includes('community') || r.creator?.recipesCount === undefined || r.creator?.recipesCount < 20;
      if (!isCustom && !hasCommunityTag && !isCreatedByHomeCook) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'quick') return a.totalTime - b.totalTime;
    if (sortBy === 'latest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return b.likes - a.likes; // popular
  });

  const activeFiltersCount = 
    (searchQuery ? 1 : 0) +
    (selectedState ? 1 : 0) +
    (selectedCategory ? 1 : 0) +
    (healthDietaryFilter !== 'all' ? 1 : 0) +
    (dietaryFilter !== 'all' ? 1 : 0) +
    (timeFilter !== 'all' ? 1 : 0) +
    (spiceFilter !== 'all' ? 1 : 0) +
    (difficultyFilter !== 'all' ? 1 : 0) +
    (peoplesOnly ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedState(null);
    setSelectedCategory(null);
    setHealthDietaryFilter('all');
    setDietaryFilter('all');
    setTimeFilter('all');
    setSpiceFilter('all');
    setDifficultyFilter('all');
    setPeoplesOnly(false);
    setSortBy('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-title text-3xl font-black text-[#2B1B17]">
            Explore Indian Recipes
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Browse authentic regional culinary treasures with granular filters for dietary preference, cooking time, and spice level.
          </p>
        </div>

        <div className="text-xs text-stone-600 font-semibold bg-stone-100 px-3.5 py-1.5 rounded-full self-start md:self-auto">
          Showing <span className="text-[#E8590C] font-bold tabular-nums">{sortedRecipes.length}</span> authentic recipes
        </div>
      </div>

      {/* Search & Filter Container */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        {/* Quick Filter Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
          <button
            onClick={() => setPeoplesOnly(false)}
            className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              !peoplesOnly
                ? 'bg-[#E8590C] text-white shadow-xs font-bold'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <span>All Recipes</span>
          </button>

          <button
            onClick={() => setPeoplesOnly(true)}
            className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              peoplesOnly
                ? 'bg-amber-600 text-white shadow-xs font-bold'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>People's Uploaded Recipes</span>
            <span className="bg-amber-200 text-stone-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">Community</span>
          </button>

          {/* Quick Dietary shortcut buttons */}
          <button
            onClick={() => setDietaryFilter(dietaryFilter === 'Vegan' ? 'all' : 'Vegan')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              dietaryFilter === 'Vegan'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Vegan Only</span>
          </button>

          <button
            onClick={() => setDietaryFilter(dietaryFilter === 'Gluten-Free' ? 'all' : 'Gluten-Free')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              dietaryFilter === 'Gluten-Free'
                ? 'bg-amber-700 text-white font-bold'
                : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            <WheatOff className="w-3.5 h-3.5" />
            <span>Gluten-Free</span>
          </button>

          <button
            onClick={() => setTimeFilter(timeFilter === 'under30' ? 'all' : 'under30')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              timeFilter === 'under30'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>&lt; 30 Mins</span>
          </button>

          <button
            onClick={() => setCurrentView('peoples-recipes')}
            className="ml-auto text-xs text-[#E8590C] hover:underline font-bold whitespace-nowrap flex items-center gap-1 cursor-pointer"
          >
            <span>Dedicated People's Recipes Hub →</span>
          </button>
        </div>

        {peoplesOnly && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-medium">
              <Users className="w-4 h-4 text-[#E8590C] shrink-0" />
              <span>Filtering for recipes uploaded by verified home chefs & culinary enthusiasts across India!</span>
            </div>
            <button
              onClick={() => setCurrentView('share-recipe')}
              className="text-xs font-bold text-[#E8590C] hover:underline whitespace-nowrap cursor-pointer"
            >
              + Upload your recipe
            </button>
          </div>
        )}

        {/* Dedicated Health & Dietary Preference Filter */}
        <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-amber-50/60 p-4 rounded-2xl border border-emerald-200/80 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <HeartPulse className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-2">
                  <span>Filter by Dietary Preference</span>
                  {healthDietaryFilter !== 'all' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white">
                      Active: {healthDietaryFilter}
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-stone-500">
                  Targeted wellness curation: Vegan, Gluten-Free, Keto, and Diabetic-Friendly regional recipes
                </p>
              </div>
            </div>

            {healthDietaryFilter !== 'all' && (
              <button
                onClick={() => setHealthDietaryFilter('all')}
                className="text-[11px] font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Dietary Need</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {/* 1. Vegan */}
            <button
              type="button"
              onClick={() => setHealthDietaryFilter(healthDietaryFilter === 'vegan' ? 'all' : 'vegan')}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                healthDietaryFilter === 'vegan'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
                  : 'bg-white hover:bg-emerald-50 text-stone-800 border-stone-200'
              }`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                healthDietaryFilter === 'vegan' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                <Leaf className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold leading-tight">Vegan</div>
                <div className={`text-[10px] truncate ${healthDietaryFilter === 'vegan' ? 'text-emerald-100' : 'text-stone-500'}`}>
                  100% Plant-Based
                </div>
              </div>
            </button>

            {/* 2. Gluten-Free */}
            <button
              type="button"
              onClick={() => setHealthDietaryFilter(healthDietaryFilter === 'gluten-free' ? 'all' : 'gluten-free')}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                healthDietaryFilter === 'gluten-free'
                  ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-300'
                  : 'bg-white hover:bg-amber-50 text-stone-800 border-stone-200'
              }`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                healthDietaryFilter === 'gluten-free' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                <WheatOff className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold leading-tight">Gluten-Free</div>
                <div className={`text-[10px] truncate ${healthDietaryFilter === 'gluten-free' ? 'text-amber-100' : 'text-stone-500'}`}>
                  Millet &amp; Wheat-Safe
                </div>
              </div>
            </button>

            {/* 3. Keto */}
            <button
              type="button"
              onClick={() => setHealthDietaryFilter(healthDietaryFilter === 'keto' ? 'all' : 'keto')}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                healthDietaryFilter === 'keto'
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300'
                  : 'bg-white hover:bg-indigo-50 text-stone-800 border-stone-200'
              }`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                healthDietaryFilter === 'keto' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'
              }`}>
                <Sparkles className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold leading-tight">Keto</div>
                <div className={`text-[10px] truncate ${healthDietaryFilter === 'keto' ? 'text-indigo-100' : 'text-stone-500'}`}>
                  Low-Carb &amp; Good Fats
                </div>
              </div>
            </button>

            {/* 4. Diabetic-Friendly */}
            <button
              type="button"
              onClick={() => setHealthDietaryFilter(healthDietaryFilter === 'diabetic-friendly' ? 'all' : 'diabetic-friendly')}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                healthDietaryFilter === 'diabetic-friendly'
                  ? 'bg-teal-600 text-white border-teal-700 shadow-md ring-2 ring-teal-300'
                  : 'bg-white hover:bg-teal-50 text-stone-800 border-stone-200'
              }`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                healthDietaryFilter === 'diabetic-friendly' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-800'
              }`}>
                <HeartPulse className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold leading-tight">Diabetic-Friendly</div>
                <div className={`text-[10px] truncate ${healthDietaryFilter === 'diabetic-friendly' ? 'text-teal-100' : 'text-stone-500'}`}>
                  Low GI &amp; Zero Sugar
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by recipe name, ingredient (paneer, ghee, mustard, coconut), region, or creator..."
            className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#E8590C]"
          />
        </div>

        {/* Granular Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs pt-1">
          
          {/* State Filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">State / UT</label>
            <select
              value={selectedState?.name || 'all'}
              onChange={e => {
                if (e.target.value === 'all') setSelectedState(null);
                else {
                  const match = INDIAN_STATES_AND_UTS.find(s => s.name === e.target.value);
                  setSelectedState(match || null);
                }
              }}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
            >
              <option value="all">All States & UTs</option>
              {INDIAN_STATES_AND_UTS.map(st => (
                <option key={st.id} value={st.name}>{st.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">Category</label>
            <select
              value={selectedCategory || 'all'}
              onChange={e => setSelectedCategory(e.target.value === 'all' ? null : e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
            >
              <option value="all">All Categories</option>
              {FOOD_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Health Dietary Preference Filter Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <HeartPulse className="w-3 h-3 text-emerald-600" />
              <span>Dietary Need</span>
            </label>
            <select
              value={healthDietaryFilter}
              onChange={e => setHealthDietaryFilter(e.target.value as any)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium"
            >
              <option value="all">All Dietary Needs</option>
              <option value="vegan">Vegan (Plant-Based)</option>
              <option value="gluten-free">Gluten-Free (Wheat-Safe)</option>
              <option value="keto">Keto (Low-Carb)</option>
              <option value="diabetic-friendly">Diabetic-Friendly (Low GI)</option>
            </select>
          </div>

          {/* Granular Cooking Time Filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-indigo-600" />
              <span>Cooking Time</span>
            </label>
            <select
              value={timeFilter}
              onChange={e => setTimeFilter(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium"
            >
              <option value="all">Any Duration</option>
              <option value="quick20">Quick (≤ 20 mins)</option>
              <option value="under30">Under 30 mins</option>
              <option value="30to60">30 to 60 mins</option>
              <option value="over60">Slow Cook (&gt; 60 mins)</option>
            </select>
          </div>

          {/* Granular Spice Level Filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Flame className="w-3 h-3 text-[#E8590C]" />
              <span>Spice Level</span>
            </label>
            <select
              value={spiceFilter}
              onChange={e => setSpiceFilter(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium"
            >
              <option value="all">All Spice Levels</option>
              <option value="Mild">Mild 🟢</option>
              <option value="Medium">Medium 🟡</option>
              <option value="Spicy">Spicy 🌶️</option>
              <option value="Extra Hot">Extra Hot 🔥</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="quick">Quickest to Cook</option>
              <option value="latest">Recently Added</option>
            </select>
          </div>

        </div>

        {/* Clear Filters CTA */}
        {activeFiltersCount > 0 && (
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium">
              {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'} applied
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-[#E8590C] hover:text-[#D9480F] flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset all filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Recipe Cards Grid */}
      {sortedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-500 space-y-3">
          <p className="text-sm">No recipes match your specific filter criteria.</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#E8590C] text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
