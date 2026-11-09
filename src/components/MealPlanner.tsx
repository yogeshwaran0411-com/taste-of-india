import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { THIRTY_DAY_MEAL_PLAN } from '../data/mealPlanner';
import { CalendarDays, Utensils, SunMedium, Moon, ArrowRight, Sparkles } from 'lucide-react';

export const MealPlanner: React.FC = () => {
  const { recipes, setSelectedRecipe } = useApp();
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const planDay = THIRTY_DAY_MEAL_PLAN.find(p => p.day === selectedDay) || THIRTY_DAY_MEAL_PLAN[0];

  const breakfast = recipes.find(r => r.id === planDay.breakfastId) || recipes[1];
  const lunch = recipes.find(r => r.id === planDay.lunchId) || recipes[0];
  const dinner = recipes.find(r => r.id === planDay.dinnerId) || recipes[2];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/30">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Structured Nutrition</span>
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-black">
            30-Day Indian Meal Planner
          </h1>
          <p className="text-xs sm:text-sm text-sky-100/80 leading-relaxed">
            Eliminate everyday cooking fatigue with balanced breakfast, lunch, and dinner menus celebrating the rich diversity of India's regional pantries.
          </p>
        </div>
      </div>

      {/* Days Scroller */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 px-1">
          Select Day:
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl shrink-0 transition-all ${
                selectedDay === day
                  ? 'bg-[#E8590C] text-white shadow-xs scale-105'
                  : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              Day {day}
            </button>
          ))}
        </div>
      </div>

      {/* Day Menu Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-title text-2xl font-bold text-[#2B1B17]">
            Menu for Day {selectedDay}
          </h2>
          <span className="text-xs text-stone-500">
            Total Day Calories: ~{breakfast.nutrition.calories + lunch.nutrition.calories + dinner.nutrition.calories} kcal
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Breakfast Card */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#E8590C]/50 transition-all">
            <div className="p-4 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#E8590C]">
                <SunMedium className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Breakfast</span>
              </div>
              <span className="text-xs text-stone-500 font-mono">{breakfast.prepTime + breakfast.cookTime}m</span>
            </div>

            <div className="p-4 grow flex flex-col justify-between space-y-3">
              <div>
                <img
                  src={breakfast.image}
                  alt={breakfast.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <div className="text-xs text-[#E8590C] font-semibold">{breakfast.state} · {breakfast.category}</div>
                <h3 className="font-serif-title font-bold text-base text-[#2B1B17] mt-0.5">
                  {breakfast.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                  {breakfast.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedRecipe(breakfast)}
                className="w-full py-2 bg-stone-100 hover:bg-[#E8590C] hover:text-white rounded-lg text-xs font-bold text-stone-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Recipe & Steps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Lunch Card */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#E8590C]/50 transition-all">
            <div className="p-4 bg-orange-50/50 border-b border-orange-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-600">
                <Utensils className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Lunch</span>
              </div>
              <span className="text-xs text-stone-500 font-mono">{lunch.prepTime + lunch.cookTime}m</span>
            </div>

            <div className="p-4 grow flex flex-col justify-between space-y-3">
              <div>
                <img
                  src={lunch.image}
                  alt={lunch.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <div className="text-xs text-[#E8590C] font-semibold">{lunch.state} · {lunch.category}</div>
                <h3 className="font-serif-title font-bold text-base text-[#2B1B17] mt-0.5">
                  {lunch.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                  {lunch.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedRecipe(lunch)}
                className="w-full py-2 bg-stone-100 hover:bg-[#E8590C] hover:text-white rounded-lg text-xs font-bold text-stone-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Recipe & Steps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dinner Card */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#E8590C]/50 transition-all">
            <div className="p-4 bg-purple-50/50 border-b border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-600">
                <Moon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Dinner</span>
              </div>
              <span className="text-xs text-stone-500 font-mono">{dinner.prepTime + dinner.cookTime}m</span>
            </div>

            <div className="p-4 grow flex flex-col justify-between space-y-3">
              <div>
                <img
                  src={dinner.image}
                  alt={dinner.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <div className="text-xs text-[#E8590C] font-semibold">{dinner.state} · {dinner.category}</div>
                <h3 className="font-serif-title font-bold text-base text-[#2B1B17] mt-0.5">
                  {dinner.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                  {dinner.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedRecipe(dinner)}
                className="w-full py-2 bg-stone-100 hover:bg-[#E8590C] hover:text-white rounded-lg text-xs font-bold text-stone-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Recipe & Steps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
