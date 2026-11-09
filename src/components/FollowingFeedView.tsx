import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RecipeCard } from './RecipeCard';
import { 
  Users, 
  BookOpen, 
  Video, 
  Play, 
  Heart, 
  Clock, 
  MapPin, 
  ChefHat, 
  ArrowRight, 
  UserPlus, 
  Sparkles 
} from 'lucide-react';

export const FollowingFeedView: React.FC = () => {
  const { 
    currentUser, 
    channels, 
    recipes, 
    cookingVideos, 
    setSelectedVideo, 
    openChannel, 
    followChannel, 
    setCurrentView 
  } = useApp();

  const [feedFilter, setFeedFilter] = useState<'all' | 'recipes' | 'videos'>('all');

  const followingChannelIds = currentUser?.followingCreatorIds || [];
  const followedChannels = channels.filter(c => followingChannelIds.includes(c.id));
  const followedUsernames = followedChannels.map(c => c.username);

  // Recipes from followed creators
  const followedRecipes = recipes.filter(r => 
    followedUsernames.includes(r.creator.username) || 
    followingChannelIds.includes(r.creator.id) ||
    followingChannelIds.includes(r.channelId || '')
  );

  // Videos from followed creators
  const followedVideos = cookingVideos.filter(v => 
    followedUsernames.includes(v.creatorUsername) || 
    followingChannelIds.includes(v.creatorId) ||
    followingChannelIds.includes(v.channelId)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2B1B17] via-[#3B2219] to-[#2B1B17] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md border border-[#3B2219]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800">
            <Users className="w-3 h-3 text-[#E8590C]" />
            <span>Personalised Community Feed</span>
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-black">
            Following Feed
          </h1>
          <p className="text-xs sm:text-sm text-stone-300">
            Latest heirloom recipes, cooking videos, and masterclasses from the {followedChannels.length} food creators you follow.
          </p>
        </div>

        {/* Followed Creators Avatars Ribbon */}
        {followedChannels.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {followedChannels.map(channel => (
              <button
                key={channel.id}
                onClick={() => openChannel(channel.username)}
                className="group flex flex-col items-center gap-1 shrink-0 cursor-pointer"
                title={channel.name}
              >
                <img
                  src={channel.avatar}
                  alt={channel.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E8590C] group-hover:scale-105 transition-transform"
                />
                <span className="text-[10px] text-stone-300 max-w-[60px] truncate">{channel.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        {[
          { id: 'all', label: `All Updates (${followedRecipes.length + followedVideos.length})` },
          { id: 'recipes', label: `Recipes (${followedRecipes.length})`, icon: BookOpen },
          { id: 'videos', label: `Videos (${followedVideos.length})`, icon: Video },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFeedFilter(tab.id as any)}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              feedFilter === tab.id
                ? 'border-[#E8590C] text-[#E8590C] bg-amber-50/50 rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed Content */}
      {followedChannels.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 shadow-xs">
          <ChefHat className="w-12 h-12 text-[#E8590C] mx-auto" />
          <h3 className="font-serif-title text-xl font-black text-[#2B1B17]">
            You're not following any food creators yet
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            Follow master home cooks, heritage dhaba chefs, and regional culinary scholars to see their newly uploaded recipes and video masterclasses directly in your feed.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setCurrentView('creators')}
              className="px-6 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              Browse Top Creators of India
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Cooking Videos Row (if all or videos) */}
          {(feedFilter === 'all' || feedFilter === 'videos') && followedVideos.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif-title text-lg sm:text-xl font-bold text-[#2B1B17] flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#E8590C]" />
                  <span>Recent Cooking Videos</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {followedVideos.map(vid => (
                  <div
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-video w-full bg-stone-900 overflow-hidden">
                      <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-[#E8590C] transition-all">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-mono px-2 py-0.5 rounded">
                        {vid.duration}
                      </div>
                    </div>
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                          <img src={vid.creatorAvatar} alt={vid.creatorName} className="w-5 h-5 rounded-full object-cover" />
                          <span className="font-semibold text-stone-700">{vid.creatorName}</span>
                        </div>
                        <h3 className="font-serif-title text-sm font-bold text-[#2B1B17] line-clamp-2 group-hover:text-[#E8590C]">
                          {vid.title}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                        <span>{vid.views.toLocaleString()} views</span>
                        <span className="flex items-center gap-1 text-red-500 font-semibold">
                          <Heart className="w-3 h-3 fill-red-500" />
                          {vid.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recipes Grid */}
          {(feedFilter === 'all' || feedFilter === 'recipes') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif-title text-lg sm:text-xl font-bold text-[#2B1B17] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#E8590C]" />
                  <span>Recipes by Followed Chefs ({followedRecipes.length})</span>
                </h2>
              </div>

              {followedRecipes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-xs text-stone-500">
                  No recipes published by your followed creators yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {followedRecipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
