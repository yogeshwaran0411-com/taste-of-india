import React, { useState } from 'react';
import { Recipe } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, Bookmark, Star, Clock, Flame, CookingPot, Users } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { setSelectedRecipe, likeRecipe, saveRecipe, currentUser, openChannel } = useApp();
  const [imageError, setImageError] = useState(false);

  const isSaved = currentUser?.savedRecipeIds.includes(recipe.id);
  const isCommunityUpload = recipe.isUserUploaded || recipe.id.startsWith('recipe-custom-') || recipe.tags?.includes('Community Upload');

  return (
    <article 
      onClick={() => setSelectedRecipe(recipe)}
      className="group cursor-pointer bg-white rounded-xl border border-[#EBE3D5] hover:border-[#E8590C]/40 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
    >
      {/* Media Container */}
      <div className="relative aspect-4/3 w-full bg-[#F4EFE6] overflow-hidden">
        {!imageError ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4 text-center">
            <CookingPot className="w-10 h-10 text-[#E8590C]/50 mb-2" />
            <span className="text-xs font-semibold text-[#8C6D62]">{recipe.title}</span>
          </div>
        )}

        {/* Dietary Symbol (Authentic Indian Veg / Non-Veg mark) */}
        <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs p-1 rounded-sm shadow-xs flex items-center justify-center">
          {recipe.dietary === 'Vegetarian' || recipe.dietary === 'Vegan' ? (
            <div className="w-3.5 h-3.5 border border-[#2B8A3E] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2B8A3E]" />
            </div>
          ) : (
            <div className="w-3.5 h-3.5 border border-[#C92A2A] flex items-center justify-center">
              <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-[#C92A2A]" />
            </div>
          )}
        </div>

        {/* Community Upload Badge */}
        {isCommunityUpload && !recipe.businessType && (
          <div className="absolute bottom-2 left-2 bg-[#2B1B17]/85 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
            <Users className="w-2.5 h-2.5 text-[#E8590C]" />
            <span>People's Recipe</span>
          </div>
        )}

        {/* Catering Service Provider Badge */}
        {(recipe.businessType === 'catering' || recipe.cateringDetails) && (
          <div className="absolute bottom-2 left-2 bg-purple-900/90 backdrop-blur-xs text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1 border border-purple-400/30">
            <span>🍲 Catering Menu</span>
            {recipe.cateringDetails?.pricePerPlate && (
              <span className="text-amber-300 font-extrabold">· ₹{recipe.cateringDetails.pricePerPlate}/pl</span>
            )}
          </div>
        )}

        {/* Homemade Food Business Badge */}
        {(recipe.businessType === 'homemade' || recipe.homemadeDetails) && (
          <div className="absolute bottom-2 left-2 bg-emerald-900/90 backdrop-blur-xs text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1 border border-emerald-400/30">
            <span>🏡 Homemade Food</span>
            {recipe.homemadeDetails?.dailyTiffinPrice && (
              <span className="text-amber-300 font-extrabold">· ₹{recipe.homemadeDetails.dailyTiffinPrice}/meal</span>
            )}
          </div>
        )}

        {/* Floating Quick Actions (Like & Save) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              likeRecipe(recipe.id);
            }}
            title="Like this recipe"
            className="p-1.5 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-red-500 shadow-xs transition-colors"
          >
            <Heart className="w-3.5 h-3.5 fill-red-500/10 hover:fill-red-500" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              saveRecipe(recipe.id);
            }}
            title="Save to favourites"
            className={`p-1.5 rounded-full bg-white/90 hover:bg-white shadow-xs transition-colors ${
              isSaved ? 'text-[#E8590C]' : 'text-stone-600 hover:text-[#E8590C]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#E8590C]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Content: Zero-Pill Discipline */}
      <div className="p-4 flex flex-col grow justify-between">
        <div>
          {/* Unboxed Metadata Line with typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5 font-medium">
            <span className="text-[#E8590C]">{recipe.state}</span>
            <span aria-hidden="true">·</span>
            <span>{recipe.category}</span>
            {recipe.budgetTier && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700">₹{recipe.costPerServing}/srv</span>
              </>
            )}
          </div>

          {/* Primary Recipe Name */}
          <h3 className="font-serif-title text-base font-bold text-[#2B1B17] line-clamp-1 group-hover:text-[#E8590C] transition-colors">
            {recipe.title}
          </h3>

          {/* Short description */}
          <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
            {recipe.description}
          </p>

          {/* Creator Attribution */}
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-stone-500">
            <span className="text-stone-400">By</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (recipe.creator?.username) openChannel(recipe.creator.username);
              }}
              className="font-semibold text-stone-700 hover:text-[#E8590C] hover:underline truncate cursor-pointer"
            >
              {recipe.creator?.name || 'Home Cook'}
            </button>
            {recipe.creator?.isVerified && (
              <span className="text-amber-500 text-[10px]" title="Verified Creator">★</span>
            )}
            {recipe.creator?.location && (
              <>
                <span className="text-stone-300">·</span>
                <span className="text-stone-400 truncate">{recipe.creator.location.split(',')[0]}</span>
              </>
            )}
          </div>
        </div>

        {/* Card Footer: Metrics & Rating */}
        <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span className="tabular-nums">{recipe.totalTime}m</span>
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-stone-400" />
              <span className="tabular-nums">{recipe.nutrition.calories} cal</span>
            </span>
          </div>

          <div className="flex items-center gap-1 font-semibold text-stone-800">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span className="tabular-nums">{recipe.rating.toFixed(1)}</span>
            <span className="text-[11px] font-normal text-stone-400 tabular-nums">({recipe.ratingCount})</span>
          </div>
        </div>
      </div>
    </article>
  );
};
