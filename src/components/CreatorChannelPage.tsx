import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RecipeCard } from './RecipeCard';
import { 
  Award, 
  MapPin, 
  Users, 
  BookOpen, 
  Video, 
  Share2, 
  UserPlus, 
  Check, 
  Globe, 
  Youtube, 
  Instagram, 
  Facebook, 
  Languages, 
  ChefHat, 
  Eye, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Heart, 
  PlusCircle, 
  Settings, 
  CheckCircle2, 
  AlertTriangle,
  ArrowLeft,
  LogOut
} from 'lucide-react';

export const CreatorChannelPage: React.FC = () => {
  const { 
    channels, 
    selectedChannelUsername, 
    recipes, 
    cookingVideos, 
    currentUser, 
    followChannel, 
    unfollowChannel, 
    isFollowingChannel, 
    setCurrentView, 
    setSelectedVideo, 
    setSelectedRecipe,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'recipes' | 'videos' | 'popular' | 'about'>('home');
  const [recipeSearch, setRecipeSearch] = useState('');
  const [recipeCategoryFilter, setRecipeCategoryFilter] = useState('all');
  const [copied, setCopied] = useState(false);

  // Find channel by username or fallback to first channel
  const channel = channels.find(c => 
    c.username.toLowerCase() === (selectedChannelUsername || '').toLowerCase()
  ) || channels[0];

  if (!channel) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <ChefHat className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="font-serif-title text-2xl font-bold">Creator Channel Not Found</h2>
        <button
          onClick={() => setCurrentView('creators')}
          className="px-5 py-2.5 bg-[#E8590C] text-white text-xs font-bold rounded-xl"
        >
          Browse All Food Creators
        </button>
      </div>
    );
  }

  const isOwner = currentUser?.id === channel.userId || currentUser?.channelUsername === channel.username;
  const isFollowing = isFollowingChannel(channel.id);

  // Filter creator's recipes (matches channel username or creator id)
  const creatorRecipes = recipes.filter(r => 
    (r.creator.username === channel.username || 
     r.creator.id === channel.userId || 
     r.channelId === channel.id || 
     r.creator.name.toLowerCase().includes(channel.name.toLowerCase().slice(0, 5))) &&
    (isOwner ? true : r.status === 'approved')
  );

  // Filter creator's cooking videos
  const creatorVideos = cookingVideos.filter(v => 
    (v.creatorUsername === channel.username || 
     v.channelId === channel.id || 
     v.creatorId === channel.userId) &&
    (isOwner ? true : v.status === 'approved')
  );

  // Popular recipes sorted by likes and rating
  const popularRecipes = [...creatorRecipes].sort((a, b) => (b.likes + b.rating * 100) - (a.likes + a.rating * 100));

  // Filtered recipes for "Recipes" tab
  const filteredRecipes = creatorRecipes.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(recipeSearch.toLowerCase()) || 
                        r.description.toLowerCase().includes(recipeSearch.toLowerCase());
    const matchCat = recipeCategoryFilter === 'all' || r.category === recipeCategoryFilter;
    return matchSearch && matchCat;
  });

  const handleShareChannel = () => {
    const url = `${window.location.origin}/channel/${channel.username}`;
    const text = `Discover authentic Indian recipes & cooking videos on ${channel.name}'s food channel (@${channel.username}) on TASTEOF BHARAT!`;
    if (navigator.share) {
      navigator.share({ title: channel.name, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      showToast('Channel link copied to clipboard!');
    }
  };

  const categories = Array.from(new Set(creatorRecipes.map(r => r.category)));

  return (
    <div className="min-h-screen bg-[#FAF6F0] pb-16">
      
      {/* 1. HERO COVER BANNER */}
      <div className="relative w-full h-52 sm:h-72 md:h-80 bg-stone-900 overflow-hidden">
        <img
          src={channel.coverImage}
          alt={channel.name}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        
        {/* Exit Channel Back Navigation Button */}
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 bg-black/60 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Channel (Home)</span>
        </button>

        {/* State/District Tag on Banner */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-black/60 backdrop-blur-md text-amber-200 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md">
          <MapPin className="w-3.5 h-3.5 text-[#E8590C]" />
          <span>{channel.district}, {channel.state}</span>
        </div>

        {/* Suspended Notice if any */}
        {channel.isSuspended && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Channel Under Administrative Suspension</span>
          </div>
        )}
      </div>

      {/* 2. CHANNEL PROFILE BAR & METRICS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 sm:-mt-20">
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          
          {/* Avatar & Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            <div className="relative -mt-12 sm:-mt-16 shrink-0">
              <img
                src={channel.avatar}
                alt={channel.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover ring-4 ring-white shadow-xl bg-white"
              />
              {channel.isVerified && (
                <div 
                  className="absolute bottom-1 right-1 bg-amber-500 text-white p-1.5 rounded-full ring-2 ring-white shadow-md cursor-help"
                  title={channel.verifiedReason || 'Verified Food Creator'}
                >
                  <Award className="w-4 h-4 fill-white" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-serif-title text-2xl sm:text-3xl font-black text-[#2B1B17]">
                  {channel.name}
                </h1>
                {channel.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    <Award className="w-3 h-3 text-amber-600 fill-amber-500" />
                    <span>Verified Creator</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                <span className="font-mono font-bold text-[#E8590C]">@{channel.username}</span>
                <span className="text-stone-300">·</span>
                <span className="text-stone-600 font-medium">{channel.speciality}</span>
                <span className="text-stone-300">·</span>
                <span className="text-stone-500 flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5 text-stone-400" />
                  {channel.preferredLanguage}
                </span>
              </div>

              {/* Bio snippet */}
              <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed pt-1">
                {channel.description}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0 w-full md:w-auto">
            {isOwner ? (
              <button
                onClick={() => setCurrentView('creator-studio')}
                className="px-5 py-2.5 bg-[#2B1B17] hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
              >
                <Settings className="w-4 h-4 text-amber-400" />
                <span>Creator Studio</span>
              </button>
            ) : (
              <button
                onClick={() => isFollowing ? unfollowChannel(channel.id) : followChannel(channel.id)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm w-full sm:w-auto ${
                  isFollowing
                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
                    : 'bg-[#E8590C] hover:bg-[#D9480F] active:scale-95 text-white'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Follow Channel</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleShareChannel}
              className="px-4 py-2.5 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xl border border-stone-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Share2 className="w-4 h-4 text-stone-500" />
              <span>{copied ? 'Link Copied!' : 'Share Channel'}</span>
            </button>
          </div>

        </div>

        {/* Channel Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Followers</div>
            <div className="font-serif-title text-xl sm:text-2xl font-black text-[#2B1B17]">
              {channel.followersCount.toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Recipes</div>
            <div className="font-serif-title text-xl sm:text-2xl font-black text-[#E8590C]">
              {creatorRecipes.length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Cooking Videos</div>
            <div className="font-serif-title text-xl sm:text-2xl font-black text-amber-600">
              {creatorVideos.length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Channel Views</div>
            <div className="font-serif-title text-xl sm:text-2xl font-black text-emerald-700">
              {channel.viewsCount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 3. CHANNEL TABS NAVIGATION (5 Required Sections) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto scrollbar-none pb-px">
          {[
            { id: 'home', label: 'Home', icon: Sparkles },
            { id: 'recipes', label: `Recipes (${creatorRecipes.length})`, icon: BookOpen },
            { id: 'videos', label: `Cooking Videos (${creatorVideos.length})`, icon: Video },
            { id: 'popular', label: 'Popular Recipes', icon: Award },
            { id: 'about', label: 'About & Story', icon: ChefHat },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-[#E8590C] text-[#E8590C] bg-amber-50/50 rounded-t-xl'
                    : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. TAB CONTENTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            
            {/* Featured Video / Highlight Banner */}
            {creatorVideos[0] && (
              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs overflow-hidden">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#E8590C] mb-2 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-[#E8590C]" />
                  <span>Channel Spotlight Video</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div 
                    onClick={() => setSelectedVideo(creatorVideos[0])}
                    className="lg:col-span-6 relative aspect-video rounded-2xl overflow-hidden shadow-md cursor-pointer group bg-stone-900"
                  >
                    <img 
                      src={creatorVideos[0].thumbnail} 
                      alt={creatorVideos[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#E8590C] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-mono px-2 py-0.5 rounded">
                      {creatorVideos[0].duration}
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-3">
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                      {creatorVideos[0].category}
                    </span>
                    <h3 
                      onClick={() => setSelectedVideo(creatorVideos[0])}
                      className="font-serif-title text-xl sm:text-2xl font-black text-[#2B1B17] hover:text-[#E8590C] cursor-pointer transition-colors"
                    >
                      {creatorVideos[0].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                      {creatorVideos[0].description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-stone-500 pt-2">
                      <span>{creatorVideos[0].views.toLocaleString()} views</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-red-500 font-semibold">
                        <Heart className="w-3.5 h-3.5 fill-red-500" />
                        {creatorVideos[0].likes.toLocaleString()} likes
                      </span>
                    </div>
                    <div>
                      <button
                        onClick={() => setSelectedVideo(creatorVideos[0])}
                        className="px-5 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Watch Full Cooking Tutorial</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Latest Recipes Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif-title text-xl sm:text-2xl font-black text-[#2B1B17]">
                    Latest Recipes by {channel.name}
                  </h2>
                  <p className="text-xs text-stone-500">Authentic regional kitchen creations</p>
                </div>
                <button
                  onClick={() => setActiveTab('recipes')}
                  className="text-xs font-bold text-[#E8590C] hover:underline flex items-center gap-1"
                >
                  <span>View All {creatorRecipes.length} Recipes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {creatorRecipes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3">
                  <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
                  <p className="text-xs text-stone-500">No recipes uploaded yet on this channel.</p>
                  {isOwner && (
                    <button
                      onClick={() => setCurrentView('share-recipe')}
                      className="px-4 py-2 bg-[#E8590C] text-white text-xs font-bold rounded-xl"
                    >
                      Upload First Recipe
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {creatorRecipes.slice(0, 4).map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              )}
            </div>

            {/* Cooking Videos Grid Showcase */}
            {creatorVideos.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif-title text-xl sm:text-2xl font-black text-[#2B1B17]">
                      Cooking Videos & Tutorials
                    </h2>
                    <p className="text-xs text-stone-500">Watch hands-on kitchen techniques</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('videos')}
                    className="text-xs font-bold text-[#E8590C] hover:underline flex items-center gap-1"
                  >
                    <span>View All {creatorVideos.length} Videos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {creatorVideos.slice(0, 3).map(vid => (
                    <div
                      key={vid.id}
                      onClick={() => setSelectedVideo(vid)}
                      className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer flex flex-col"
                    >
                      <div className="relative aspect-video w-full bg-stone-900 overflow-hidden">
                        <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            {vid.category}
                          </span>
                          <h3 className="font-serif-title text-sm font-bold text-[#2B1B17] mt-1 line-clamp-2 group-hover:text-[#E8590C]">
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

          </div>
        )}

        {/* TAB 2: RECIPES */}
        {activeTab === 'recipes' && (
          <div className="space-y-6">
            
            {/* Search and Category Filters */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <input
                type="text"
                value={recipeSearch}
                onChange={e => setRecipeSearch(e.target.value)}
                placeholder="Search within this creator's recipes..."
                className="w-full sm:w-80 px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
                <button
                  onClick={() => setRecipeCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                    recipeCategoryFilter === 'all'
                      ? 'bg-[#E8590C] text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  All ({creatorRecipes.length})
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setRecipeCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                      recipeCategoryFilter === cat
                        ? 'bg-[#E8590C] text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipes Grid */}
            {filteredRecipes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <BookOpen className="w-12 h-12 text-stone-400 mx-auto" />
                <h3 className="font-serif-title text-base font-bold text-stone-700">No matching recipes found</h3>
                <p className="text-xs text-stone-500">Try adjusting your search query or category filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: COOKING VIDEOS */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif-title text-xl font-black text-[#2B1B17]">
                  All Cooking Videos by {channel.name}
                </h2>
                <p className="text-xs text-stone-500">Short tips, reels, and complete video guides</p>
              </div>
              {isOwner && (
                <button
                  onClick={() => setCurrentView('creator-studio')}
                  className="px-4 py-2 bg-[#E8590C] hover:bg-[#D9480F] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Upload Cooking Video</span>
                </button>
              )}
            </div>

            {creatorVideos.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <Video className="w-12 h-12 text-stone-400 mx-auto" />
                <h3 className="font-serif-title text-base font-bold text-stone-700">No cooking videos published yet</h3>
                <p className="text-xs text-stone-500">This creator hasn't published video tutorials yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {creatorVideos.map(vid => (
                  <div
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-video w-full bg-stone-900 overflow-hidden">
                      <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            {vid.category}
                          </span>
                          <span className="text-[10px] text-stone-400">{vid.language}</span>
                        </div>
                        <h3 className="font-serif-title text-sm font-bold text-[#2B1B17] mt-1 line-clamp-2 group-hover:text-[#E8590C]">
                          {vid.title}
                        </h3>
                        <p className="text-xs text-stone-500 line-clamp-2 mt-1">{vid.description}</p>
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
            )}
          </div>
        )}

        {/* TAB 4: POPULAR RECIPES */}
        {activeTab === 'popular' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif-title text-xl font-black text-[#2B1B17]">
                Top Rated & Most Appreciated Recipes
              </h2>
              <p className="text-xs text-stone-500">Sorted by highest community ratings and saves</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ABOUT */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Main Bio & Culinary Philosophy */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-4 shadow-xs">
                <h3 className="font-serif-title text-lg font-black text-[#2B1B17] flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-[#E8590C]" />
                  <span>Culinary Philosophy & Heritage</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                  {channel.description}
                </p>
                
                {channel.isVerified && (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                      <Award className="w-4 h-4 text-amber-600 fill-amber-500" />
                      <span>Taste of India Verification Notice</span>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      {channel.verifiedReason || 'This creator has been reviewed and verified for authentic recipe formulation, accurate ingredient measurement standards, and culinary cultural integrity.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Speciality Highlights */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-3 shadow-xs">
                <h3 className="font-serif-title text-base font-bold text-[#2B1B17]">
                  Cooking Speciality & Regional Heritage
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-500 uppercase tracking-wider text-[10px]">Speciality Focus</span>
                    <div className="font-semibold text-stone-800 mt-0.5">{channel.speciality}</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-500 uppercase tracking-wider text-[10px]">Primary Languages</span>
                    <div className="font-semibold text-stone-800 mt-0.5">{channel.preferredLanguage}</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-500 uppercase tracking-wider text-[10px]">District & State</span>
                    <div className="font-semibold text-stone-800 mt-0.5">{channel.district}, {channel.state}</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-500 uppercase tracking-wider text-[10px]">Channel Active Since</span>
                    <div className="font-semibold text-stone-800 mt-0.5">{channel.createdAt}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: Social Links & Channel Stats */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Social Channels */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4 shadow-xs">
                <h3 className="font-serif-title text-base font-bold text-[#2B1B17] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#E8590C]" />
                  <span>Connect with Creator</span>
                </h3>

                <div className="space-y-2">
                  {channel.socialLinks?.youtube && (
                    <a
                      href={channel.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 hover:border-red-300 hover:bg-red-50 text-xs font-semibold text-stone-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Youtube className="w-4 h-4 text-red-600" />
                        <span>YouTube Channel</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                    </a>
                  )}

                  {channel.socialLinks?.instagram && (
                    <a
                      href={channel.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 hover:border-pink-300 hover:bg-pink-50 text-xs font-semibold text-stone-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-pink-600" />
                        <span>Instagram Profile</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                    </a>
                  )}

                  {channel.socialLinks?.facebook && (
                    <a
                      href={channel.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 hover:border-blue-300 hover:bg-blue-50 text-xs font-semibold text-stone-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-blue-600" />
                        <span>Facebook Page</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                    </a>
                  )}

                  {channel.socialLinks?.website && (
                    <a
                      href={channel.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 text-xs font-semibold text-stone-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-600" />
                        <span>Personal Website</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                    </a>
                  )}

                  {!channel.socialLinks?.youtube && !channel.socialLinks?.instagram && !channel.socialLinks?.website && (
                    <p className="text-xs text-stone-400">No external social links added.</p>
                  )}
                </div>
              </div>

              {/* Creator Support Card */}
              <div className="bg-gradient-to-br from-[#2B1B17] to-[#3B2219] p-6 rounded-3xl text-white space-y-3 shadow-md">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Community Cook Network</span>
                <h4 className="font-serif-title text-base font-bold leading-snug">Love {channel.name}'s recipes?</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Follow this channel to get notified whenever fresh heirloom recipes and cooking tutorials are published.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => isFollowing ? unfollowChannel(channel.id) : followChannel(channel.id)}
                    className="w-full py-2.5 bg-[#E8590C] hover:bg-[#D9480F] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    {isFollowing ? 'Following This Channel' : 'Follow Creator'}
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
