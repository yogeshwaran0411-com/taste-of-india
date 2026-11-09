import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RecipeCard } from './RecipeCard';
import { INDIAN_STATES_AND_UTS } from '../data/states';
import { 
  Users, 
  PlusCircle, 
  Search, 
  Filter, 
  Sparkles, 
  RotateCcw, 
  ChefHat, 
  Heart, 
  Cake, 
  Flame, 
  GlassWater, 
  Salad, 
  ArrowRight,
  CheckCircle2,
  CookingPot,
  Store,
  Home,
  Phone
} from 'lucide-react';

export const PeoplesRecipesView: React.FC = () => {
  const { recipes, setCurrentView, currentUser, setSelectedRecipe, searchQuery, setSearchQuery } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'rating' | 'quick'>('latest');
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  // All user/people-uploaded recipes (custom uploads + seeded community uploads)
  const peoplesRecipes = recipes.filter(r => {
    const isCustom = r.id.startsWith('recipe-custom-') || r.isUserUploaded;
    const hasCommunityTag = r.tags?.some(t => 
      t.toLowerCase().includes('community') || 
      t.toLowerCase().includes('people') || 
      t.toLowerCase().includes('family') ||
      t.toLowerCase().includes('home')
    );
    const isCreatedByHomeCook = r.creator?.id?.includes('user') || r.creator?.id?.includes('community') || r.creator?.recipesCount === undefined || r.creator?.recipesCount < 20;
    return isCustom || hasCommunityTag || isCreatedByHomeCook;
  });

  // Filtered by user criteria
  const filteredRecipes = peoplesRecipes.filter(r => {
    // Show only mine toggle
    if (showOnlyMine && currentUser) {
      const isMine = r.creator.id === currentUser.id || currentUser.uploadedRecipeIds?.includes(r.id);
      if (!isMine) return false;
    }

    // Search query
    const q = (localSearch || searchQuery).toLowerCase().trim();
    if (q) {
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchState = r.state.toLowerCase().includes(q);
      const matchCategory = r.category.toLowerCase().includes(q);
      const matchCreator = r.creator.name.toLowerCase().includes(q);
      const matchIngredients = r.ingredients.some(i => i.item.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchState && !matchCategory && !matchCreator && !matchIngredients) {
        return false;
      }
    }

    // Category / Tag
    if (selectedTag !== 'all') {
      if (selectedTag === 'sweet') {
        const isSweet = r.category.toLowerCase().includes('sweet') || r.category.toLowerCase().includes('dessert') || r.tags?.some(t => t.toLowerCase().includes('sweet') || t.toLowerCase().includes('mithai'));
        if (!isSweet) return false;
      } else if (selectedTag === 'street-food') {
        const isStreet = r.category.toLowerCase().includes('street') || r.tags?.some(t => t.toLowerCase().includes('street') || t.toLowerCase().includes('chaat'));
        if (!isStreet) return false;
      } else if (selectedTag === 'juice') {
        const isJuice = r.category.toLowerCase().includes('drink') || r.category.toLowerCase().includes('juice') || r.tags?.some(t => t.toLowerCase().includes('juice') || t.toLowerCase().includes('drink') || t.toLowerCase().includes('cooler'));
        if (!isJuice) return false;
      } else if (selectedTag === 'diet-food') {
        const isDiet = r.category.toLowerCase().includes('diet') || r.category.toLowerCase().includes('healthy') || r.nutrition.calories < 250 || r.tags?.some(t => t.toLowerCase().includes('diet') || t.toLowerCase().includes('weight loss') || t.toLowerCase().includes('protein'));
        if (!isDiet) return false;
      } else if (selectedTag === 'curry') {
        const isCurry = r.category.toLowerCase().includes('curry') || r.category.toLowerCase().includes('gravy') || r.category.toLowerCase().includes('dal');
        if (!isCurry) return false;
      } else if (selectedTag === 'biryani') {
        const isBiryani = r.category.toLowerCase().includes('biryani') || r.category.toLowerCase().includes('rice');
        if (!isBiryani) return false;
      } else if (selectedTag === 'catering') {
        const isCatering = r.businessType === 'catering' || !!r.cateringDetails || r.tags?.some(t => t.toLowerCase().includes('catering'));
        if (!isCatering) return false;
      } else if (selectedTag === 'homemade') {
        const isHomemade = r.businessType === 'homemade' || !!r.homemadeDetails || r.tags?.some(t => t.toLowerCase().includes('homemade') || t.toLowerCase().includes('tiffin'));
        if (!isHomemade) return false;
      }
    }

    // Dietary
    if (dietaryFilter !== 'all' && r.dietary.toLowerCase() !== dietaryFilter.toLowerCase()) {
      return false;
    }

    // State
    if (selectedState !== 'all' && r.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }

    return true;
  });

  // Sort
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'quick') return a.totalTime - b.totalTime;
    // default: latest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const resetFilters = () => {
    setLocalSearch('');
    setSearchQuery('');
    setSelectedTag('all');
    setDietaryFilter('all');
    setSelectedState('all');
    setShowOnlyMine(false);
    setSortBy('latest');
  };

  const myUploadsCount = currentUser 
    ? peoplesRecipes.filter(r => r.creator.id === currentUser.id || currentUser.uploadedRecipeIds?.includes(r.id)).length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner for People's Uploaded Recipes */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2B1B17] via-[#4A261A] to-[#2B1B17] text-white p-6 sm:p-10 shadow-lg border border-amber-900/30">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8590C]/20 border border-[#E8590C]/40 text-amber-300 text-xs font-bold">
            <Users className="w-3.5 h-3.5 text-[#E8590C]" />
            <span>COMMUNITY KITCHEN OF BHARAT</span>
          </div>

          <h1 className="font-serif-title text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            People's Uploaded Recipes
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            Real household recipes, heirloom grandmother preparations, quick street delicacies, and health food creations uploaded by everyday people across India. Explore dishes uploaded by the community, or share your own!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('share-recipe')}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Share & Upload Your Recipe</span>
            </button>

            {currentUser && myUploadsCount > 0 && (
              <button
                onClick={() => setShowOnlyMine(!showOnlyMine)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  showOnlyMine 
                    ? 'bg-amber-500 text-stone-900 border-amber-400 font-bold' 
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                <ChefHat className="w-4 h-4" />
                <span>My Uploads ({myUploadsCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative corner pot */}
        <div className="absolute right-4 -bottom-6 opacity-15 pointer-events-none hidden md:block">
          <CookingPot className="w-64 h-64 text-amber-300" />
        </div>
      </div>

      {/* Community Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#E8590C] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-stone-900 tabular-nums">
              {peoplesRecipes.length}+
            </div>
            <div className="text-[11px] text-stone-500 font-medium">People's Recipes</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-stone-900 tabular-nums">100%</div>
            <div className="text-[11px] text-stone-500 font-medium">Live & Verified</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-700 flex items-center justify-center shrink-0">
            <Cake className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-stone-900 tabular-nums">Sweet & Street</div>
            <div className="text-[11px] text-stone-500 font-medium">Juice & Diet options</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-stone-900 tabular-nums">All 28 States</div>
            <div className="text-[11px] text-stone-500 font-medium">Home Cook Secrets</div>
          </div>
        </div>
      </div>

      {/* Quick Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
        <button
          onClick={() => setSelectedTag('all')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedTag === 'all'
              ? 'bg-[#E8590C] text-white shadow-xs font-bold'
              : 'bg-white border border-stone-200 text-stone-700 hover:border-[#E8590C]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>All People's Uploads ({peoplesRecipes.length})</span>
        </button>

        <button
          onClick={() => setSelectedTag('sweet')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedTag === 'sweet'
              ? 'bg-pink-600 text-white shadow-xs font-bold'
              : 'bg-white border border-stone-200 text-stone-700 hover:border-pink-500'
          }`}
        >
          <Cake className="w-3.5 h-3.5 text-pink-500" />
          <span>🍬 Sweets & Mithai</span>
        </button>

        <button
          onClick={() => setSelectedTag('street-food')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedTag === 'street-food'
              ? 'bg-amber-600 text-white shadow-xs font-bold'
              : 'bg-white border border-stone-200 text-stone-700 hover:border-amber-500'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>🔥 Street Food</span>
        </button>

        <button
          onClick={() => setSelectedTag('juice')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedTag === 'juice'
              ? 'bg-emerald-600 text-white shadow-xs font-bold'
              : 'bg-white border border-stone-200 text-stone-700 hover:border-emerald-500'
          }`}
        >
          <GlassWater className="w-3.5 h-3.5 text-emerald-500" />
          <span>🥤 Juice & Drinks</span>
        </button>

        <button
          onClick={() => setSelectedTag('diet-food')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedTag === 'diet-food'
              ? 'bg-lime-700 text-white shadow-xs font-bold'
              : 'bg-white border border-stone-200 text-stone-700 hover:border-lime-600'
          }`}
        >
          <Salad className="w-3.5 h-3.5 text-lime-600" />
          <span>🥗 Diet & Healthy Food</span>
        </button>

        <button
          onClick={() => setSelectedTag('curry')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedTag === 'curry'
              ? 'bg-orange-700 text-white shadow-xs font-bold'
              : 'bg-white border border-stone-200 text-stone-700 hover:border-orange-600'
          }`}
        >
          <CookingPot className="w-3.5 h-3.5 text-orange-500" />
          <span>🍛 Curries & Gravies</span>
        </button>

        <button
          onClick={() => setSelectedTag('catering')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedTag === 'catering'
              ? 'bg-purple-800 text-white shadow-xs font-bold'
              : 'bg-white border border-purple-200 text-purple-900 hover:border-purple-600'
          }`}
        >
          <Store className="w-3.5 h-3.5 text-purple-600" />
          <span>🍲 Catering Menus</span>
        </button>

        <button
          onClick={() => setSelectedTag('homemade')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedTag === 'homemade'
              ? 'bg-emerald-800 text-white shadow-xs font-bold'
              : 'bg-white border border-emerald-200 text-emerald-900 hover:border-emerald-600'
          }`}
        >
          <Home className="w-3.5 h-3.5 text-emerald-600" />
          <span>🏡 Ghar Ka Khana &amp; Tiffins</span>
        </button>
      </div>

      {/* Quick Navigation to Dedicated Catering & Homemade Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div 
          onClick={() => {
            setCurrentView('catering');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cursor-pointer bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-4 rounded-2xl shadow-xs border border-purple-700/60 flex items-center justify-between gap-3 hover:opacity-95 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-700/80 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-purple-200 uppercase tracking-wider">Dedicated Slot</div>
              <div className="text-sm font-black">Catering Services &amp; Event Menus</div>
              <div className="text-[11px] text-purple-300">With Catering Addresses &amp; Contact Numbers</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-purple-300 shrink-0" />
        </div>

        <div 
          onClick={() => {
            setCurrentView('homemade');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cursor-pointer bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-4 rounded-2xl shadow-xs border border-emerald-700/60 flex items-center justify-between gap-3 hover:opacity-95 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 flex items-center justify-center shrink-0">
              <Home className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-emerald-200 uppercase tracking-wider">Dedicated Slot</div>
              <div className="text-sm font-black">Ghar Ka Khana &amp; Homemade Food</div>
              <div className="text-[11px] text-emerald-300">With Kitchen Addresses &amp; WhatsApp Ordering</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-300 shrink-0" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="Search by recipe title, creator name, secret ingredient (ghee, paneer, cardamom), or state..."
            className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#E8590C]"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Dietary Filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">Diet Preference</label>
            <select
              value={dietaryFilter}
              onChange={e => setDietaryFilter(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
            >
              <option value="all">All Diets</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>

          {/* State Filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">State of Origin</label>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
            >
              <option value="all">All States & UTs</option>
              {INDIAN_STATES_AND_UTS.map(st => (
                <option key={st.id} value={st.name}>{st.name}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">Sort Uploads</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-medium"
            >
              <option value="latest">Recently Uploaded (Newest)</option>
              <option value="popular">Most Loved (Likes)</option>
              <option value="rating">Highest Rated</option>
              <option value="quick">Quickest to Cook</option>
            </select>
          </div>

          {/* Reset Action */}
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full py-2 px-3 border border-stone-200 rounded-lg text-stone-600 hover:text-[#E8590C] hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5 font-semibold text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Header Results Info */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <div>
          Showing <span className="text-[#E8590C] font-bold tabular-nums text-sm">{sortedRecipes.length}</span> recipes uploaded by community members
        </div>
        <button
          onClick={() => setCurrentView('share-recipe')}
          className="text-[#E8590C] hover:underline font-bold flex items-center gap-1"
        >
          <span>Upload your recipe</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Recipe Cards Grid */}
      {sortedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 text-stone-500 space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-[#E8590C] flex items-center justify-center mx-auto">
            <ChefHat className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif-title text-xl font-bold text-stone-800">
              No community recipes found matching this filter
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Be the very first person to upload a delicious dish in this category and share your cooking tradition with all of Bharat!
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setCurrentView('share-recipe')}
              className="px-5 py-2 bg-[#E8590C] hover:bg-[#D9480F] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              + Upload Recipe Now
            </button>
          </div>
        </div>
      )}

      {/* Community Invite Footer Strip */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-6 sm:p-8 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif-title text-lg font-bold text-[#2B1B17]">
            Got a cherished family recipe?
          </h3>
          <p className="text-xs text-stone-600 max-w-xl">
            Pass down the tradition. Submit your recipe with step-by-step instructions, ingredients, cooking secrets, and photos. It will appear right here for food lovers across India!
          </p>
        </div>

        <button
          onClick={() => setCurrentView('share-recipe')}
          className="shrink-0 px-6 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] text-white font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Recipe Now</span>
        </button>
      </div>
    </div>
  );
};
