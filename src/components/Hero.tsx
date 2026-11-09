import React from 'react';
import { useApp } from '../context/AppContext';
import { GlobalFuzzySearchBar } from './GlobalFuzzySearchBar';
import { Search, Sparkles, ChefHat, MapPin, PlusCircle, ArrowRight, Compass } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setCurrentView, searchQuery, setSearchQuery, t, setSelectedState, setSelectedCategory } = useApp();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('explore');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF6F0] via-[#F5ECE0] to-[#FAF6F0] border-b border-[#E8DFC8]/60 py-12 sm:py-16 lg:py-20">
      
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E8590C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#2B8A3E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Subheading, Search & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#E8DFC8] shadow-xs text-xs font-semibold text-[#E8590C]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentic Recipes Across All 28 States & 8 UTs</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#2B1B17] tracking-tight leading-[1.1] text-balance">
              Discover the Flavours of India.
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base md:text-lg text-stone-700 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Explore thousands of traditional and modern Indian recipes. Cook, share and celebrate India's vibrant food culture with millions of passionate cooks.
            </p>

            {/* Interactive Fuzzy Search Bar with Web Speech API Voice Search */}
            <div className="max-w-xl mx-auto lg:mx-0">
              <GlobalFuzzySearchBar variant="hero" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => { setSelectedState(null); setSelectedCategory(null); setCurrentView('explore'); }}
                className="px-6 py-3 bg-[#2B1B17] hover:bg-stone-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Explore Recipes</span>
              </button>

              <button
                onClick={() => setCurrentView('share-recipe')}
                className="px-6 py-3 bg-white hover:bg-stone-50 text-[#2B1B17] border border-[#E8DFC8] font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-[#E8590C]" />
                <span>Share Your Recipe</span>
              </button>
            </div>

            {/* Quick Filter Prompts */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-stone-500">
              <span className="font-semibold text-stone-600">Quick explore:</span>
              {['Biryani', 'Masala Dosa', 'Butter Chicken', 'Dal Makhani', 'Undhiyu'].map(dish => (
                <button
                  key={dish}
                  onClick={() => { setSearchQuery(dish); setCurrentView('explore'); }}
                  className="hover:text-[#E8590C] hover:underline transition-colors"
                >
                  {dish} ·
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Grand Main Culinary Image */}
              <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&auto=format&fit=crop&q=80"
                  alt="Traditional Royal Indian Culinary Feast"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Heritage Spotlight
                  </div>
                  <div className="font-serif-title text-lg font-bold">
                    Royal Indian Thali & Regional Feast
                  </div>
                  <div className="text-xs text-stone-200 mt-0.5">
                    Authentic slow-simmered dishes from master regional home cooks
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: 36 States & UTs */}
              <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-xs p-3 rounded-2xl shadow-lg border border-stone-100 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#E8590C] flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-stone-900">36 Territories</div>
                  <div className="text-[10px] text-stone-500">All States & UTs covered</div>
                </div>
              </div>

              {/* Floating Badge 2: Verified recipes */}
              <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-xs p-3 rounded-2xl shadow-lg border border-stone-100 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#2B8A3E] flex items-center justify-center font-bold">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-stone-900">100+ Authentic Dishes</div>
                  <div className="text-[10px] text-stone-500">With PDF recipe downloads</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
