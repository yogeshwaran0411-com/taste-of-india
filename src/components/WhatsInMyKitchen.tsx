import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RecipeCard } from './RecipeCard';
import { ChefHat, Plus, Check, RotateCcw, Sparkles } from 'lucide-react';

const COMMON_PANTRY_ITEMS = [
  'Paneer', 'Potatoes', 'Basmati Rice', 'Tomatoes', 'Onions', 'Garlic', 
  'Ginger', 'Curd (Dahi)', 'Mustard seeds', 'Urad Dal', 'Moong Dal', 
  'Chicken', 'Mutton', 'Fish', 'Coconut', 'Curry leaves', 'Ghee', 
  'Green Chillies', 'Coriander leaves', 'Besan (Gram Flour)', 'Poha'
];

export const WhatsInMyKitchen: React.FC = () => {
  const { recipes } = useApp();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(['Paneer', 'Tomatoes', 'Ginger']);
  const [customInput, setCustomInput] = useState('');

  const toggleIngredient = (item: string) => {
    setSelectedIngredients(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (trimmed && !selectedIngredients.some(i => i.toLowerCase() === trimmed.toLowerCase())) {
      setSelectedIngredients([...selectedIngredients, trimmed]);
      setCustomInput('');
    }
  };

  const handleReset = () => {
    setSelectedIngredients([]);
  };

  // Score recipes by overlapping ingredients
  const scoredRecipes = recipes
    .map(recipe => {
      if (selectedIngredients.length === 0) return { recipe, matchCount: 0, matchPercent: 0 };
      
      const recipeIngredientsText = recipe.ingredients
        .map(i => `${i.item} ${i.notes || ''}`.toLowerCase())
        .join(' ');

      let matches = 0;
      selectedIngredients.forEach(userIng => {
        if (recipeIngredientsText.includes(userIng.toLowerCase())) {
          matches++;
        }
      });

      const matchPercent = Math.min(100, Math.round((matches / Math.max(1, selectedIngredients.length)) * 100));
      return { recipe, matchCount: matches, matchPercent };
    })
    .filter(item => selectedIngredients.length === 0 || item.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount || b.matchPercent - a.matchPercent);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2B1B17] via-[#3B2219] to-[#2B1B17] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8590C]/20 text-[#E8590C] text-xs font-bold border border-[#E8590C]/30">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Pantry Smart Matcher</span>
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-black">
            What's in My Kitchen?
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Select the ingredients you already have at home. We'll suggest authentic regional recipes you can cook right now without an extra grocery run!
          </p>
        </div>
      </div>

      {/* Ingredient Selector Box */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Select or Add Ingredients
            </span>
            <span className="text-xs text-[#E8590C] font-semibold">
              ({selectedIngredients.length} selected)
            </span>
          </div>

          {selectedIngredients.length > 0 && (
            <button
              onClick={handleReset}
              className="text-xs text-stone-500 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Quick Click Badges */}
        <div className="flex flex-wrap gap-2">
          {COMMON_PANTRY_ITEMS.map(item => {
            const isSelected = selectedIngredients.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleIngredient(item)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#E8590C] text-white border-[#E8590C] shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                }`}
              >
                {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-stone-400" />}
                <span>{item}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Input */}
        <form onSubmit={handleAddCustom} className="flex gap-2 pt-2 border-t border-stone-100">
          <input
            type="text"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            placeholder="Type other pantry item (e.g., Fenugreek, Cashews, Jaggery)..."
            className="grow text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#E8590C]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#2B1B17] hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
          >
            Add Item
          </button>
        </form>
      </div>

      {/* Matched Recipes Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E8590C]" />
            <h2 className="font-serif-title text-xl font-bold text-[#2B1B17]">
              Matched Dishes You Can Cook ({scoredRecipes.length})
            </h2>
          </div>
          {selectedIngredients.length > 0 && (
            <span className="text-xs text-stone-500">
              Sorted by highest ingredient overlap
            </span>
          )}
        </div>

        {scoredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {scoredRecipes.slice(0, 12).map(({ recipe, matchPercent, matchCount }) => (
              <div key={recipe.id} className="relative flex flex-col">
                {matchCount > 0 && (
                  <div className="mb-1 text-[11px] font-semibold text-emerald-700 flex items-center justify-between px-1">
                    <span>{matchCount} ingredients match</span>
                    <span className="tabular-nums">{matchPercent}% ready</span>
                  </div>
                )}
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-500 text-sm">
            No recipes matched all selected ingredients. Try selecting common staples like Potatoes, Rice, or Onions!
          </div>
        )}
      </div>
    </div>
  );
};
