import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RecipeCard } from './RecipeCard';
import { Sparkles } from 'lucide-react';

const FESTIVALS = [
  { id: 'all', name: 'All Festivals', desc: 'Celebrate the culinary tapestry of India' },
  { id: 'diwali', name: 'Diwali', desc: 'Saffron mithai, rich ghee savory namkeens, and festive feasts' },
  { id: 'pongal', name: 'Pongal / Makar Sankranti', desc: 'Clay pot harvest ven pongal, sugarcane, and jaggery payasam' },
  { id: 'onam', name: 'Onam Sadya', desc: 'Grand plantain leaf feast with avial, olan, and palada payasam' },
  { id: 'eid', name: 'Eid-ul-Fitr', desc: 'Royal slow-dum biryani, sheer khurma, and melting galouti kebabs' },
  { id: 'navratri', name: 'Navratri & Durga Puja', desc: 'Sattvic fast treats, singhara puris, and bhog khichuri' },
  { id: 'christmas', name: 'Christmas Special', desc: 'Goan bebinca, spiced plum cake, and roast curries' }
];

export const FestivalCollection: React.FC = () => {
  const { recipes } = useApp();
  const [selectedFestival, setSelectedFestival] = useState('all');

  const filtered = recipes.filter(r => {
    if (selectedFestival === 'all') return true;
    const q = selectedFestival.toLowerCase();
    return (
      (r.festival && r.festival.toLowerCase().includes(q)) ||
      r.tags.some(t => t.toLowerCase().includes(q)) ||
      r.category.toLowerCase().includes('festival') ||
      r.category.toLowerCase().includes('sweet')
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-orange-950 to-amber-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sacred Culinary Traditions</span>
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-black">
            Festival Food Collection
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed">
            From clay-pot harvest Pongal in the South to royal Eid Dum Biryani and Diwali saffron sweets, discover the sacred recipes that unite families across Bharat.
          </p>
        </div>
      </div>

      {/* Festival Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {FESTIVALS.map(f => {
          const isActive = selectedFestival === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFestival(f.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#E8590C] text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {f.name}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-title text-xl font-bold text-[#2B1B17]">
            Festive Recipes ({filtered.length})
          </h2>
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
