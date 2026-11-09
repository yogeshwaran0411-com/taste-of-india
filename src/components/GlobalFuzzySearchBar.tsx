import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { fuzzySearchRecipes, FuzzySearchResult } from '../utils/fuzzySearch';
import { Recipe } from '../types';
import { 
  Search, 
  X, 
  MapPin, 
  Clock, 
  Star, 
  Sparkles, 
  ArrowRight, 
  CornerDownLeft, 
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Mic,
  MicOff,
  Volume2,
  Radio
} from 'lucide-react';

interface GlobalFuzzySearchBarProps {
  variant?: 'navbar' | 'hero' | 'standalone';
  placeholder?: string;
  autoFocus?: boolean;
  onSelectRecipe?: (recipe: Recipe) => void;
  className?: string;
}

export const GlobalFuzzySearchBar: React.FC<GlobalFuzzySearchBarProps> = ({
  variant = 'navbar',
  placeholder,
  autoFocus = false,
  onSelectRecipe,
  className = ''
}) => {
  const { 
    recipes, 
    searchQuery, 
    setSearchQuery, 
    setSelectedRecipe, 
    setCurrentView,
    setSelectedState,
    setSelectedCategory,
    showToast
  } = useApp();

  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecClass) {
      try {
        const recognition = new SpeechRecClass();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // Optimized for Indian English and regional dish pronunciations

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
          setIsOpen(true);
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          if (transcript) {
            setLocalQuery(transcript);
            setSearchQuery(transcript);
            setIsOpen(true);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            showToast('Microphone access blocked. Please allow microphone permissions in your browser.');
          } else if (event.error !== 'no-speech') {
            setSpeechError('Could not catch your voice. Please try speaking again.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition init error:', err);
      }
    }
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, [showToast, setSearchQuery]);

  const toggleVoiceSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const SpeechRecClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecClass) {
      showToast('Voice Search is not supported by this browser. Chrome, Edge, and Safari are supported.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        setSpeechError(null);
        recognitionRef.current?.start();
      } catch (e) {
        try {
          recognitionRef.current?.abort();
          setTimeout(() => recognitionRef.current?.start(), 120);
        } catch (err) {
          console.warn(err);
        }
      }
    }
  };

  // Sync with global searchQuery when changed externally
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K or "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time fuzzy search results computation (memoized and instantaneous)
  const searchResults: FuzzySearchResult[] = useMemo(() => {
    if (!localQuery.trim()) return [];
    return fuzzySearchRecipes(recipes, localQuery, { maxResults: 8, threshold: 30 });
  }, [recipes, localQuery]);

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQuery(val);
    setSearchQuery(val);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  // Select a Recipe
  const handleSelect = (recipe: Recipe) => {
    setIsOpen(false);
    if (onSelectRecipe) {
      onSelectRecipe(recipe);
    } else {
      setSelectedRecipe(recipe);
    }
  };

  // Submit search: navigate to Explore view
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (selectedIndex >= 0 && searchResults[selectedIndex]) {
      handleSelect(searchResults[selectedIndex].recipe);
      return;
    }
    setIsOpen(false);
    setSearchQuery(localQuery);
    setSelectedState(null);
    setSelectedCategory(null);
    setCurrentView('explore');
  };

  // Keyboard navigation within results
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || searchResults.length === 0) {
      if (e.key === 'Enter') {
        handleSubmit();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        handleSelect(searchResults[selectedIndex].recipe);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Quick Chips to append or toggle in query
  const quickChips = [
    { label: '🟢 Pure Veg', token: 'veg' },
    { label: '🔴 Non-Veg', token: 'non-veg' },
    { label: '🌱 Vegan', token: 'vegan' },
    { label: '📍 Punjab', token: 'punjab' },
    { label: '📍 Tamil Nadu', token: 'tamil nadu' },
    { label: '📍 Kerala', token: 'kerala' },
    { label: '📍 Bengal', token: 'bengal' },
    { label: 'Paneer', token: 'paneer' },
    { label: 'Mustard', token: 'mustard' },
    { label: 'Biryani', token: 'biryani' }
  ];

  const handleChipClick = (chipToken: string) => {
    const trimmed = localQuery.trim();
    let newQuery = '';
    if (!trimmed) {
      newQuery = chipToken;
    } else if (trimmed.toLowerCase().includes(chipToken.toLowerCase())) {
      // Toggle off
      newQuery = trimmed.replace(new RegExp(`\\b${chipToken}\\b`, 'gi'), '').trim().replace(/\s+/g, ' ');
    } else {
      newQuery = `${trimmed} ${chipToken}`;
    }
    setLocalQuery(newQuery);
    setSearchQuery(newQuery);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  // Dynamic styling based on variant
  const isNavbar = variant === 'navbar';
  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className={`flex items-center transition-all ${
          isHero
            ? 'bg-white rounded-2xl p-2 border-2 border-[#E8DFC8] shadow-lg focus-within:border-[#E8590C] focus-within:ring-4 focus-within:ring-[#E8590C]/10'
            : isNavbar
            ? 'bg-white/95 border border-[#E8DFC8] rounded-full px-3 py-1.5 shadow-xs w-48 sm:w-72 md:w-80 focus-within:w-64 sm:focus-within:w-84 md:focus-within:w-96 focus-within:border-[#E8590C] focus-within:ring-2 focus-within:ring-[#E8590C]/15 focus-within:bg-white'
            : 'bg-white border border-[#E8DFC8] rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-[#E8590C]'
        }`}>
          <Search className={`${isHero ? 'w-5 h-5 ml-2 mr-3 text-stone-400' : 'w-4 h-4 mr-2 text-stone-400 shrink-0'}`} />

          <input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            autoFocus={autoFocus}
            placeholder={
              placeholder || 
              (isHero 
                ? 'Search by dish, ingredient, state, or dietary (e.g. Punjab veg paneer, Kerala fish, Dosa)...' 
                : 'Search dish, ingredient, state, or diet...')
            }
            className={`w-full bg-transparent text-[#2B1B17] focus:outline-none placeholder:text-stone-400 ${
              isHero ? 'text-xs sm:text-sm py-1' : 'text-xs'
            }`}
          />

          {/* Voice Search & Quick Clear or Keyboard Shortcut Badge */}
          <div className="flex items-center gap-1.5 shrink-0 ml-1">
            {/* Voice Search Web Speech API Button */}
            <button
              type="button"
              onClick={toggleVoiceSearch}
              className={`p-1.5 rounded-full transition-all flex items-center justify-center cursor-pointer relative ${
                isListening
                  ? 'bg-red-500 text-white shadow-md ring-4 ring-red-400/30 scale-105 animate-pulse'
                  : 'text-stone-400 hover:text-[#E8590C] hover:bg-amber-50'
              }`}
              title={isListening ? 'Listening... Click to stop voice search' : 'Voice Search (Speak dish, state, or ingredients)'}
            >
              {isListening ? (
                <>
                  <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" />
                  <Radio className="w-3.5 h-3.5 relative z-10" />
                </>
              ) : (
                <Mic className="w-3.5 h-3.5" />
              )}
            </button>

            {localQuery ? (
              <button
                type="button"
                onClick={() => {
                  setLocalQuery('');
                  setSearchQuery('');
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : isNavbar ? (
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono font-bold text-stone-400 bg-stone-100 border border-stone-200 rounded">
                ⌘K
              </kbd>
            ) : null}

            {isHero && (
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
              >
                Explore
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Real-time Fuzzy Results Floating Dropdown Palette */}
      {isOpen && (
        <div className={`absolute left-0 z-50 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200/90 overflow-hidden animate-fadeIn ${
          isHero 
            ? 'w-full max-w-xl' 
            : isNavbar 
            ? 'w-[92vw] sm:w-[480px] md:w-[540px] -left-20 sm:-left-32 md:-left-20' 
            : 'w-full'
        }`}>
          
          {/* Active Voice Listening Banner */}
          {isListening && (
            <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white px-4 py-2.5 flex items-center justify-between shadow-xs animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" />
                <Volume2 className="w-4 h-4 shrink-0" />
                <span>Listening... Speak dish, ingredient, or state</span>
              </div>
              <button
                type="button"
                onClick={toggleVoiceSearch}
                className="text-[11px] font-bold bg-white/25 hover:bg-white/40 px-2.5 py-0.5 rounded-full cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {speechError && (
            <div className="bg-amber-50 text-amber-900 border-b border-amber-200 px-4 py-1.5 text-xs flex items-center justify-between">
              <span>{speechError}</span>
              <button onClick={() => setSpeechError(null)} className="text-amber-700 hover:text-amber-900 font-bold ml-2">×</button>
            </div>
          )}

          {/* Top Multi-Criteria Explanation & Quick Filter Chips */}
          <div className="bg-[#FAF6F0] p-3 border-b border-[#E8DFC8]/60 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-stone-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#E8590C]" />
                <span>Simultaneous Multi-Field Search:</span>
              </span>
              <span className="text-stone-400 text-[10px]">Title · Ingredient · Dietary · State</span>
            </div>

            {/* Quick Multi-Criteria Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
              {quickChips.map((chip, idx) => {
                const isActive = localQuery.toLowerCase().includes(chip.token.toLowerCase());
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChipClick(chip.token)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#E8590C] text-white shadow-2xs'
                        : 'bg-white hover:bg-amber-100/60 text-stone-700 border border-stone-200'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results List or Empty State */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-100">
            {localQuery.trim() ? (
              searchResults.length > 0 ? (
                <>
                  <div className="px-4 py-2 bg-stone-50/70 text-[11px] font-bold text-stone-500 flex items-center justify-between">
                    <span>Top Real-Time Fuzzy Matches ({searchResults.length})</span>
                    <span className="text-[10px] text-[#E8590C] font-semibold">Press Enter to view all</span>
                  </div>

                  {searchResults.map((item, idx) => {
                    const { recipe, matchedFields, score } = item;
                    const isSelected = selectedIndex === idx;

                    return (
                      <div
                        key={recipe.id}
                        onClick={() => handleSelect(recipe)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`p-3 sm:p-3.5 flex items-center gap-3.5 cursor-pointer transition-colors ${
                          isSelected ? 'bg-amber-50/80' : 'hover:bg-stone-50/80'
                        }`}
                      >
                        {/* Recipe Image Thumbnail */}
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-stone-200 shadow-2xs"
                        />

                        {/* Recipe Info & Matched Criteria */}
                        <div className="flex-1 min-w-0 space-y-1">
                          
                          {/* Title & Dietary Indicator */}
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-serif-title font-bold text-xs sm:text-sm text-stone-900 truncate">
                              {recipe.title}
                            </h4>
                            
                            {/* Dietary badge */}
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                              recipe.dietary === 'Vegetarian'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : recipe.dietary === 'Vegan'
                                ? 'bg-teal-100 text-teal-800 border border-teal-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                recipe.dietary === 'Vegetarian' ? 'bg-emerald-600' : recipe.dietary === 'Vegan' ? 'bg-teal-600' : 'bg-red-600'
                              }`} />
                              <span>{recipe.dietary}</span>
                            </span>
                          </div>

                          {/* State & Metrics row */}
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
                            {/* Origin State with highlight if matched */}
                            <span className={`inline-flex items-center gap-0.5 font-bold px-1.5 py-0.2 rounded ${
                              matchedFields.state
                                ? 'bg-amber-200/80 text-amber-950 font-black'
                                : 'text-stone-700'
                            }`}>
                              <MapPin className="w-3 h-3 text-[#E8590C]" />
                              <span>{recipe.state}</span>
                            </span>

                            <span>·</span>

                            {/* Cooking Time */}
                            <span className="flex items-center gap-1 text-stone-500">
                              <Clock className="w-3 h-3" />
                              <span>{recipe.totalTime || (recipe.prepTime + recipe.cookTime)}m</span>
                            </span>

                            <span>·</span>

                            {/* Rating */}
                            <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                              <span>{recipe.rating}</span>
                            </span>
                          </div>

                          {/* Matched Ingredients Chips Preview */}
                          {matchedFields.ingredients.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap pt-0.5">
                              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                                Matched Ingredients:
                              </span>
                              {matchedFields.ingredients.slice(0, 3).map((ing, iIdx) => (
                                <span
                                  key={iIdx}
                                  className="text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.2 rounded"
                                >
                                  {ing}
                                </span>
                              ))}
                              {matchedFields.ingredients.length > 3 && (
                                <span className="text-[10px] text-stone-400">
                                  +{matchedFields.ingredients.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                        </div>

                        {/* Arrow Right Indicator */}
                        <div className="shrink-0 text-stone-300 group-hover:text-[#E8590C]">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="p-8 text-center space-y-2 text-stone-500">
                  <Flame className="w-8 h-8 text-stone-300 mx-auto" />
                  <div className="font-bold text-xs text-stone-800">
                    No matching recipes found for "{localQuery}"
                  </div>
                  <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
                    Try searching with another Indian state (e.g. Punjab, Kerala, Tamil Nadu), dietary type (Veg, Non-Veg), or key ingredient (Paneer, Mustard, Coconut).
                  </p>
                </div>
              )
            ) : (
              <div className="p-6 text-center text-xs text-stone-500 space-y-2">
                <div className="font-bold text-stone-700">Type anything to search in real time</div>
                <p className="text-[11px] text-stone-400 max-w-sm mx-auto">
                  Combines title, ingredients, state, and dietary type simultaneously with fuzzy typo tolerance!
                </p>
              </div>
            )}
          </div>

          {/* Bottom Footer Actions */}
          {localQuery.trim() && (
            <div className="bg-[#FAF6F0] px-4 py-2.5 border-t border-[#E8DFC8]/70 flex items-center justify-between text-xs">
              <span className="text-[11px] text-stone-500 font-medium">
                Tip: Press <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-stone-300 rounded shadow-2xs font-bold">↵ Enter</kbd> to see all in Explore
              </span>

              <button
                type="button"
                onClick={() => handleSubmit()}
                className="text-[#E8590C] hover:text-[#D9480F] font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Results</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
