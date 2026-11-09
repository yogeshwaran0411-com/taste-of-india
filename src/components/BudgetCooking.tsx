import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RecipeCard } from './RecipeCard';
import { IndianRupee, WalletCards, Sparkles } from 'lucide-react';

const BUDGET_TIERS = [
  { id: 'all', label: 'All Budgets', maxCost: 999 },
  { id: 'under50', label: 'Under ₹50 / serving', maxCost: 50 },
  { id: 'under100', label: 'Under ₹100 / serving', maxCost: 100 },
  { id: 'under150', label: 'Under ₹150 / serving', maxCost: 150 },
  { id: 'under200', label: 'Under ₹200 / serving', maxCost: 200 }
];

export const BudgetCooking: React.FC = () => {
  const { recipes } = useApp();
  const [selectedTier, setSelectedTier] = useState<string>('under50');

  const filtered = recipes.filter(r => {
    if (selectedTier === 'all') return true;
    const tier = BUDGET_TIERS.find(t => t.id === selectedTier);
    if (!tier) return true;
    return (r.costPerServing || 60) <= tier.maxCost;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Smart Indian Kitchen Economics</span>
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-black">
            Budget Cooking Without Compromise
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Wholesome, nutritious, and authentic Indian recipes calculated by actual cost per serving. Feed your family royal flavours at everyday affordable prices.
          </p>
        </div>
      </div>

      {/* Segmented Budget Selector */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-xl border border-stone-200 overflow-x-auto no-scrollbar shadow-xs">
        {BUDGET_TIERS.map(tier => {
          const isActive = selectedTier === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {tier.label}
            </button>
          );
        })}
      </div>

      {/* Recipes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h2 className="font-serif-title text-xl font-bold text-[#2B1B17]">
              Affordable Delicacies ({filtered.length})
            </h2>
          </div>
          <span className="text-xs text-stone-500">
            Estimated per-plate cost based on current grain & vegetable mandis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
};
