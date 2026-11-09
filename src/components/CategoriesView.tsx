import React from 'react';
import { useApp } from '../context/AppContext';
import { FOOD_CATEGORIES } from '../data/categories';
import { RecipeCard } from './RecipeCard';
import { ArrowLeft, Sparkles, Layers } from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const { selectedCategory, setSelectedCategory, recipes } = useApp();

  if (selectedCategory) {
    const categoryInfo = FOOD_CATEGORIES.find(
      c => c.name.toLowerCase() === selectedCategory.toLowerCase() || c.id === selectedCategory
    );

    const filtered = recipes.filter(r =>
      r.category.toLowerCase().replace(/[^a-z0-9]/g, '') === selectedCategory.toLowerCase().replace(/[^a-z0-9]/g, '') ||
      r.tags.some(t => t.toLowerCase() === selectedCategory.toLowerCase())
    );

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#E8590C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Categories</span>
        </button>

        <div className="bg-gradient-to-r from-[#2B1B17] via-[#3B2219] to-[#2B1B17] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8590C]/20 text-[#E8590C] text-xs font-bold border border-[#E8590C]/30">
              <Layers className="w-3.5 h-3.5" />
              <span>Category Collection</span>
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-black">
              {categoryInfo?.name || selectedCategory}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {categoryInfo?.description || 'Authentic traditional Indian recipes in this culinary collection.'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-title text-xl font-bold text-[#2B1B17]">
              Recipes ({filtered.length})
            </h2>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-500 text-sm">
              No recipes found under this category yet. Click "Share Your Recipe" in the top bar to upload your family recipe!
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#2B1B17] via-[#3B2219] to-[#2B1B17] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8590C]/20 text-[#E8590C] text-xs font-bold border border-[#E8590C]/30">
            <Layers className="w-3.5 h-3.5" />
            <span>Recipe Categories</span>
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-black">
            Food Categories
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            From sunrise filter coffee and fermented dosas to midnight street food and royal festival biryanis, explore India's 25 signature food categories.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {FOOD_CATEGORIES.map(cat => {
          const count = recipes.filter(
            r => r.category.toLowerCase().replace(/[^a-z0-9]/g, '') === cat.name.toLowerCase().replace(/[^a-z0-9]/g, '')
          ).length;

          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className="group cursor-pointer bg-white rounded-2xl border border-stone-200 hover:border-[#E8590C]/50 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-[#2B1B17] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                  {count} Recipes
                </div>
              </div>

              <div className="p-4 flex flex-col grow justify-between">
                <div>
                  <h3 className="font-serif-title font-bold text-lg text-[#2B1B17] group-hover:text-[#E8590C] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
                  Popular: <span className="text-stone-700">{cat.popularDish}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
