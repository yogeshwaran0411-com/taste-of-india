import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_CREATORS } from '../data/recipes';
import { RecipeCard } from './RecipeCard';
import { Creator } from '../types';
import { Users, Award, MapPin, ChefHat, Check, UserPlus, PlusCircle, ArrowRight } from 'lucide-react';

export const CommunityView: React.FC = () => {
  const { recipes, currentUser, setCurrentUser, showToast, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'creators' | 'peoples-uploads'>('creators');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  const peoplesRecipes = recipes.filter(r => 
    r.id.startsWith('recipe-custom-') || 
    r.isUserUploaded || 
    r.tags?.some(t => t.toLowerCase().includes('community') || t.toLowerCase().includes('people')) ||
    r.creator?.recipesCount === undefined || r.creator?.recipesCount < 20
  );

  const toggleFollow = (creatorId: string) => {
    if (!currentUser) return;
    const isFollowing = currentUser.followingCreatorIds.includes(creatorId);
    const updated = isFollowing
      ? currentUser.followingCreatorIds.filter(id => id !== creatorId)
      : [...currentUser.followingCreatorIds, creatorId];

    setCurrentUser({
      ...currentUser,
      followingCreatorIds: updated,
      following: currentUser.following + (isFollowing ? -1 : 1)
    });
    showToast(isFollowing ? 'Unfollowed creator' : 'Now following creator!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#2B1B17] via-[#3B2219] to-[#2B1B17] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8590C]/20 text-[#E8590C] text-xs font-bold border border-[#E8590C]/30">
            <Users className="w-3.5 h-3.5" />
            <span>Bharat Culinary Network</span>
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-black">
            Food Creator & Home Cook Community
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Connect with traditional culinary masters, passionate home cooks, and regional recipe preservationists from every state across the nation.
          </p>
        </div>
      </div>

      {/* Community Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200">
        <div className="flex items-center gap-6">
          <button
            onClick={() => { setActiveTab('creators'); setSelectedCreator(null); }}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'creators'
                ? 'border-[#E8590C] text-[#E8590C]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Top Master Chefs ({INITIAL_CREATORS.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('peoples-uploads'); setSelectedCreator(null); }}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'peoples-uploads'
                ? 'border-[#E8590C] text-[#E8590C]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>People's Uploaded Recipes ({peoplesRecipes.length})</span>
            <span className="bg-amber-100 text-[#E8590C] text-[10px] font-bold px-1.5 py-0.2 rounded-full">New</span>
          </button>
        </div>

        <button
          onClick={() => setCurrentView('share-recipe')}
          className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#E8590C] hover:text-[#D9480F] pb-3"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Upload Recipe</span>
        </button>
      </div>

      {/* Tab 2: People's Uploaded Recipes Content */}
      {activeTab === 'peoples-uploads' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50/80 border border-amber-200/80 p-5 rounded-2xl">
            <div>
              <h2 className="font-serif-title text-xl font-bold text-[#2B1B17]">
                Community Kitchen: Recipes Uploaded by People
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Authentic household treasures and modern twists contributed directly by food lovers across India.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('share-recipe')}
                className="px-4 py-2 bg-[#E8590C] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#D9480F] transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Upload Your Recipe</span>
              </button>
              <button
                onClick={() => setCurrentView('peoples-recipes')}
                className="px-4 py-2 bg-white border border-stone-200 text-stone-700 hover:text-[#E8590C] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
              >
                <span>Full Page View</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {peoplesRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Top Creators Grid */}
      {activeTab === 'creators' && (
        <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#E8590C]" />
            <h2 className="font-serif-title text-xl font-bold text-[#2B1B17]">
              Top Food Creators & Chefs
            </h2>
          </div>
          <span className="text-xs text-stone-500">
            Verified regional master contributors
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_CREATORS.map(creator => {
            const isFollowing = currentUser?.followingCreatorIds.includes(creator.id);
            const creatorRecipes = recipes.filter(r => r.creator.id === creator.id);

            return (
              <div
                key={creator.id}
                className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-300 shrink-0"
                  />
                  <div className="grow">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif-title font-bold text-base text-[#2B1B17]">
                        {creator.name}
                      </h3>
                      {creator.isVerified && (
                        <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-stone-400">@{creator.username}</div>
                    <div className="text-xs text-[#E8590C] font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{creator.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {creator.bio}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-center">
                  <div className="bg-stone-50 p-2 rounded-lg">
                    <div className="text-[10px] uppercase text-stone-400 font-bold">Recipes</div>
                    <div className="text-sm font-bold text-stone-900 tabular-nums">
                      {creatorRecipes.length || creator.recipesCount}
                    </div>
                  </div>
                  <div className="bg-stone-50 p-2 rounded-lg">
                    <div className="text-[10px] uppercase text-stone-400 font-bold">Followers</div>
                    <div className="text-sm font-bold text-stone-900 tabular-nums">
                      {(creator.followersCount || 2400) + (isFollowing ? 1 : 0)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => toggleFollow(creator.id)}
                    className={`grow py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isFollowing
                        ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        : 'bg-[#E8590C] text-white hover:bg-[#D9480F]'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Follow Creator</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedCreator(creator)}
                    className="py-2 px-3 rounded-lg text-xs font-semibold border border-stone-200 text-stone-700 hover:bg-stone-50"
                  >
                    View Recipes
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Selected Creator Recipe Drawer / Section */}
      {selectedCreator && (
        <div className="space-y-4 pt-6 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif-title text-xl font-bold text-[#2B1B17]">
                Recipes by {selectedCreator.name}
              </h2>
              <span className="text-xs text-stone-500">From {selectedCreator.location}</span>
            </div>
            <button
              onClick={() => setSelectedCreator(null)}
              className="text-xs text-stone-500 hover:text-stone-800"
            >
              Close collection ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes
              .filter(r => r.creator.id === selectedCreator.id || r.creator.name === selectedCreator.name)
              .map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
