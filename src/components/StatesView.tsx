import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INDIAN_STATES_AND_UTS } from '../data/states';
import { IndianState } from '../types';
import { RecipeCard } from './RecipeCard';
import { InteractiveIndiaMap } from './InteractiveIndiaMap';
import { 
  MapPin, 
  Sparkles, 
  ArrowLeft, 
  Utensils, 
  Award, 
  ChefHat, 
  Filter, 
  ChevronRight, 
  X, 
  Compass,
  ArrowRight
} from 'lucide-react';

export const StatesView: React.FC = () => {
  const { selectedState, setSelectedState, recipes } = useApp();
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'street' | 'sweets'>('all');
  
  // Interactive Map State Filter
  const [activeMapFilteredState, setActiveMapFilteredState] = useState<IndianState | null>(null);
  const [mapFilteredMealTab, setMapFilteredMealTab] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'street' | 'sweets'>('all');

  const REGIONS = ['All', 'South', 'North', 'West', 'East', 'Central', 'Northeast'];

  const filteredStates = INDIAN_STATES_AND_UTS.filter(st => {
    if (activeRegion === 'All') return true;
    return st.region === activeRegion;
  });

  // If a state is selected, render the deep dive State Detail Spotlight!
  if (selectedState) {
    const stateRecipes = recipes.filter(
      r => r.state.toLowerCase() === selectedState.name.toLowerCase()
    );

    const breakfastDishes = stateRecipes.filter(r => r.category.toLowerCase().includes('breakfast') || r.category.toLowerCase().includes('dosa') || r.category.toLowerCase().includes('idli'));
    const lunchDishes = stateRecipes.filter(r => r.category.toLowerCase().includes('lunch') || r.category.toLowerCase().includes('rice') || r.category.toLowerCase().includes('dal'));
    const dinnerDishes = stateRecipes.filter(r => r.category.toLowerCase().includes('dinner') || r.category.toLowerCase().includes('curry') || r.category.toLowerCase().includes('mutton') || r.category.toLowerCase().includes('chicken'));
    const streetFoods = stateRecipes.filter(r => r.category.toLowerCase().includes('street') || r.category.toLowerCase().includes('snack'));
    const sweetDishes = stateRecipes.filter(r => r.category.toLowerCase().includes('sweet') || r.category.toLowerCase().includes('dessert'));

    const displayedRecipes = 
      activeTab === 'breakfast' ? breakfastDishes :
      activeTab === 'lunch' ? lunchDishes :
      activeTab === 'dinner' ? dinnerDishes :
      activeTab === 'street' ? streetFoods :
      activeTab === 'sweets' ? sweetDishes :
      stateRecipes;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Back Button and State Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={() => {
              setSelectedState(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-[#E8590C] transition-colors cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#E8590C]" />
            <span>Back to Interactive Map &amp; All 36 States</span>
          </button>

          {/* Quick State Switcher Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium hidden sm:inline">Switch Region:</span>
            <select
              value={selectedState.id}
              onChange={(e) => {
                const found = INDIAN_STATES_AND_UTS.find(s => s.id === e.target.value);
                if (found) {
                  setSelectedState(found);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="p-1.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#E8590C]/30 focus:border-[#E8590C] cursor-pointer shadow-2xs"
            >
              {INDIAN_STATES_AND_UTS.map(st => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.region} India)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* State Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-[#2B1B17] text-white shadow-xl">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <img
              src={selectedState.heroImage}
              alt={selectedState.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative p-6 sm:p-10 md:p-12 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8590C] text-white text-xs font-bold shadow-xs">
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedState.type === 'state' ? 'Indian State' : 'Union Territory'} · {selectedState.region} India</span>
            </div>
            
            <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-black">
              {selectedState.name}
            </h1>

            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-2xl">
              {selectedState.description}
            </p>

            <div className="pt-2 text-xs text-amber-300 font-medium">
              Capital: <span className="text-white font-bold">{selectedState.capital}</span>
            </div>
          </div>
        </div>

        {/* Famous Traditional Foods Strip */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#E8590C]">
            <Award className="w-4 h-4" />
            <h3 className="font-serif-title font-bold text-sm uppercase tracking-wider">
              Iconic Traditional Specialties of {selectedState.name}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedState.famousDishes.map((dish, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800"
              >
                {dish}
              </span>
            ))}
          </div>
        </div>

        {/* Meal Type Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: `All Recipes (${stateRecipes.length})` },
            { id: 'breakfast', label: `Breakfast (${breakfastDishes.length})` },
            { id: 'lunch', label: `Lunch (${lunchDishes.length})` },
            { id: 'dinner', label: `Dinner (${dinnerDishes.length})` },
            { id: 'street', label: `Street Food (${streetFoods.length})` },
            { id: 'sweets', label: `Sweets & Desserts (${sweetDishes.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#E8590C] text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Recipes Grid */}
        <div className="space-y-4">
          {displayedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-500 text-sm">
              No recipes logged under this specific meal category yet for {selectedState.name}. Have an authentic family recipe? Use "Share Your Recipe" above!
            </div>
          )}
        </div>
      </div>
    );
  }

  // Recipes for currently filtered state from interactive map
  const mapFilteredStateRecipes = activeMapFilteredState
    ? recipes.filter(r => r.state.toLowerCase() === activeMapFilteredState.name.toLowerCase())
    : [];

  const displayedMapRecipes = activeMapFilteredState
    ? (mapFilteredMealTab === 'all'
        ? mapFilteredStateRecipes
        : mapFilteredStateRecipes.filter(r => {
            const cat = r.category.toLowerCase();
            if (mapFilteredMealTab === 'breakfast') return cat.includes('breakfast') || cat.includes('dosa') || cat.includes('idli');
            if (mapFilteredMealTab === 'lunch') return cat.includes('lunch') || cat.includes('rice') || cat.includes('dal');
            if (mapFilteredMealTab === 'dinner') return cat.includes('dinner') || cat.includes('curry') || cat.includes('biryani') || cat.includes('mutton') || cat.includes('chicken');
            if (mapFilteredMealTab === 'street') return cat.includes('street') || cat.includes('snack') || cat.includes('chaat');
            if (mapFilteredMealTab === 'sweets') return cat.includes('sweet') || cat.includes('dessert') || cat.includes('mithai');
            return true;
          }))
    : [];

  const handleSelectStateFromMap = (state: IndianState) => {
    setActiveMapFilteredState(state);
    setMapFilteredMealTab('all');
    // Smooth scroll down to the filtered recipes section
    setTimeout(() => {
      const showcaseEl = document.getElementById('state-recipe-showcase');
      if (showcaseEl) {
        showcaseEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Master State & UT Browser
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#2B1B17] via-[#3B2219] to-[#2B1B17] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-amber-900/40">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8590C]/25 text-amber-300 text-xs font-bold border border-[#E8590C]/40">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Pan-India Culinary Atlas &amp; Interactive Map</span>
          </div>
          <h1 className="font-serif-title text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Explore India’s Cuisines by State &amp; Territory
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-2xl">
            Every 100 kilometres in India, the water, language, and spice blend transform. Click on any state on the interactive map of India below to quickly filter and discover heritage recipes, secret spices, and culinary specialties.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-amber-200/90 font-medium">
            <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white/10 border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-[#E8590C]" />
              <span>28 States &amp; 8 Union Territories</span>
            </div>
            <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white/10 border border-white/10">
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              <span>{recipes.length}+ Authentic Heritage Recipes</span>
            </div>
          </div>
        </div>

        {/* Decorative Compass watermark */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
          <Compass className="w-96 h-96 text-amber-200" />
        </div>
      </div>

      {/* INTERACTIVE MAP OF INDIA SECTION */}
      <section aria-label="Interactive Map of India">
        <InteractiveIndiaMap
          states={INDIAN_STATES_AND_UTS}
          recipes={recipes}
          selectedStateId={activeMapFilteredState?.id || null}
          onSelectState={handleSelectStateFromMap}
          onStateCardClick={(state) => {
            setSelectedState(state);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          activeRegion={activeRegion}
          onSelectRegion={(reg) => {
            setActiveRegion(reg);
            if (reg === 'All') {
              setActiveMapFilteredState(null);
            }
          }}
        />
      </section>

      {/* DYNAMIC RECIPE FILTER SHOWCASE (When user clicks on a state on the map) */}
      {activeMapFilteredState && (
        <section 
          id="state-recipe-showcase" 
          className="bg-white rounded-3xl border-2 border-[#E8590C] shadow-lg p-6 sm:p-8 space-y-6 animate-fadeIn scroll-mt-24"
        >
          {/* Showcase Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
            <div className="flex items-start gap-4">
              <img
                src={activeMapFilteredState.heroImage}
                alt={activeMapFilteredState.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#E8590C]/30 shrink-0 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8590C] text-white">
                    <MapPin className="w-3 h-3" />
                    Map Filtered: {activeMapFilteredState.region} India
                  </span>
                  <span className="text-[11px] font-bold text-stone-500">
                    Capital: {activeMapFilteredState.capital}
                  </span>
                </div>
                <h2 className="font-serif-title text-2xl sm:text-3xl font-black text-[#2B1B17]">
                  {activeMapFilteredState.name} Regional Recipes
                </h2>
                <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                  {activeMapFilteredState.description}
                </p>
              </div>
            </div>

            {/* Actions: View Deep Dive or Clear Filter */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => {
                  setSelectedState(activeMapFilteredState);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <ChefHat className="w-4 h-4" />
                <span>Explore Full {activeMapFilteredState.name} Heritage Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveMapFilteredState(null)}
                title="Clear filter and view all states"
                className="p-2.5 text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Famous Regional Dishes Tags */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-stone-700 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#E8590C]" />
              Iconic Dishes:
            </span>
            {activeMapFilteredState.famousDishes.map((dish, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-stone-800 font-medium text-xs"
              >
                {dish}
              </span>
            ))}
          </div>

          {/* Meal Category Filter Pills for this State */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: `All ${activeMapFilteredState.name} Dishes (${mapFilteredStateRecipes.length})` },
              { id: 'breakfast', label: 'Breakfast / Tiffin' },
              { id: 'lunch', label: 'Lunch Specialties' },
              { id: 'dinner', label: 'Dinner Curries' },
              { id: 'street', label: 'Street Food & Snacks' },
              { id: 'sweets', label: 'Mithai & Sweets' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setMapFilteredMealTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  mapFilteredMealTab === tab.id
                    ? 'bg-[#2B1B17] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filtered Recipes Grid */}
          <div>
            {displayedMapRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedMapRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="bg-stone-50 rounded-2xl p-8 text-center border border-stone-200 text-stone-600 text-xs sm:text-sm space-y-2">
                <Utensils className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="font-semibold text-stone-800">
                  No recipes found under this meal filter for {activeMapFilteredState.name}.
                </p>
                <p className="text-stone-500 max-w-md mx-auto text-xs">
                  Be the first culinary creator to share an authentic {activeMapFilteredState.name} family recipe with food lovers across India!
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ALL STATES & UNION TERRITORIES DIRECTORY */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#2B1B17]">
              All 28 States &amp; 8 Union Territories Directory
            </h2>
            <p className="text-xs text-stone-500">
              Browse detailed culinary profiles, traditional ingredients, and iconic regional recipes.
            </p>
          </div>

          {/* Regional Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-stone-200 overflow-x-auto no-scrollbar shadow-xs shrink-0">
            {REGIONS.map(reg => {
              const isActive = activeRegion === reg;
              return (
                <button
                  key={reg}
                  onClick={() => {
                    setActiveRegion(reg);
                    if (reg !== 'All') {
                      // If active filtered state does not belong to this region, reset it
                      if (activeMapFilteredState && activeMapFilteredState.region !== reg) {
                        setActiveMapFilteredState(null);
                      }
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#E8590C] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {reg === 'All' ? 'All (36)' : reg}
                </button>
              );
            })}
          </div>
        </div>

        {/* States Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStates.map(state => {
            const count = recipes.filter(r => r.state.toLowerCase() === state.name.toLowerCase()).length;
            const isMapSelected = activeMapFilteredState?.id === state.id;

            return (
              <div
                key={state.id}
                onClick={() => {
                  handleSelectStateFromMap(state);
                }}
                className={`group cursor-pointer bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  isMapSelected
                    ? 'border-[#E8590C] ring-2 ring-[#E8590C]/40 shadow-lg'
                    : 'border-stone-200 hover:border-[#E8590C]/50 hover:shadow-md'
                }`}
              >
                <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                  <img
                    src={state.heroImage}
                    alt={state.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    {state.type === 'state' ? 'State' : 'UT'}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-[#2B1B17] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    {count} Recipes
                  </div>
                  {isMapSelected && (
                    <div className="absolute top-2.5 right-2.5 bg-[#E8590C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      Active on Map
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col grow justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-[#E8590C] uppercase tracking-wider mb-0.5">
                      {state.region} India · {state.capital}
                    </div>
                    <h3 className="font-serif-title font-bold text-lg text-[#2B1B17] group-hover:text-[#E8590C] transition-colors">
                      {state.name}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                      {state.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                    <span className="line-clamp-1">Famous: <strong className="text-stone-700">{state.famousDishes.slice(0, 2).join(', ')}</strong></span>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#E8590C] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
