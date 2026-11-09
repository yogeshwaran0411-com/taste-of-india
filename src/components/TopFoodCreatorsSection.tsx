import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INDIAN_STATES_AND_UTS } from '../data/states';
import { 
  Users, 
  Award, 
  MapPin, 
  ChefHat, 
  Check, 
  UserPlus, 
  ArrowRight, 
  BookOpen, 
  Video, 
  Sparkles, 
  Eye, 
  Filter 
} from 'lucide-react';

interface TopFoodCreatorsSectionProps {
  isFullView?: boolean;
}

export const TopFoodCreatorsSection: React.FC<TopFoodCreatorsSectionProps> = ({ isFullView = false }) => {
  const { 
    channels, 
    recipes, 
    cookingVideos, 
    currentUser, 
    followChannel, 
    unfollowChannel, 
    isFollowingChannel, 
    openChannel, 
    setCurrentView,
    setIsCreateChannelModalOpen 
  } = useApp();

  const [filterType, setFilterType] = useState<'most-followed' | 'most-popular' | 'most-recipes' | 'new-creators' | 'state'>('most-followed');
  const [selectedStateFilter, setSelectedStateFilter] = useState('all');

  // Compute recipes and videos per channel
  const enrichedChannels = channels.map(channel => {
    const creatorRecipesCount = recipes.filter(r => 
      r.creator.username === channel.username || 
      r.creator.id === channel.userId || 
      r.channelId === channel.id
    ).length;

    const creatorVideosCount = cookingVideos.filter(v => 
      v.creatorUsername === channel.username || 
      v.channelId === channel.id || 
      v.creatorId === channel.userId
    ).length;

    return {
      ...channel,
      calculatedRecipes: Math.max(creatorRecipesCount, 4),
      calculatedVideos: Math.max(creatorVideosCount, 1)
    };
  });

  // Apply sorting and filters
  let filtered = [...enrichedChannels];

  if (selectedStateFilter !== 'all') {
    filtered = filtered.filter(c => c.state === selectedStateFilter);
  }

  if (filterType === 'most-followed') {
    filtered.sort((a, b) => b.followersCount - a.followersCount);
  } else if (filterType === 'most-popular') {
    filtered.sort((a, b) => b.viewsCount - a.viewsCount);
  } else if (filterType === 'most-recipes') {
    filtered.sort((a, b) => b.calculatedRecipes - a.calculatedRecipes);
  } else if (filterType === 'new-creators') {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const displayedChannels = isFullView ? filtered : filtered.slice(0, 4);

  return (
    <section className="space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8590C]/10 text-[#E8590C] text-xs font-bold mb-1.5 border border-[#E8590C]/20">
            <Users className="w-3.5 h-3.5" />
            <span>Bharat Culinary Network</span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-black text-[#2B1B17]">
            Top Food Creators of India
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Follow master culinary scholars, heritage dhaba chefs, and home cooking innovators across all states
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isFullView && (
            <button
              onClick={() => setCurrentView('creators')}
              className="text-xs font-bold text-[#E8590C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Creators</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsCreateChannelModalOpen(true)}
            className="px-4 py-2 bg-[#2B1B17] hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ChefHat className="w-3.5 h-3.5 text-amber-400" />
            <span>Create Your Channel</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs (Most Followed, Most Popular, Most Recipes, New Creators, State-wise) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          {[
            { id: 'most-followed', label: 'Most Followed' },
            { id: 'most-popular', label: 'Most Popular' },
            { id: 'most-recipes', label: 'Most Recipes' },
            { id: 'new-creators', label: 'New Creators' },
            { id: 'state', label: 'State-wise' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[#E8590C] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* State Dropdown Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <select
            value={selectedStateFilter}
            onChange={e => setSelectedStateFilter(e.target.value)}
            className="w-full sm:w-48 px-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]"
          >
            <option value="all">All 28 States & 8 UTs</option>
            {INDIAN_STATES_AND_UTS.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Creator Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedChannels.map(channel => {
          const isFollowing = isFollowingChannel(channel.id);
          return (
            <div
              key={channel.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Cover peek */}
                <div 
                  onClick={() => openChannel(channel.username)}
                  className="relative h-24 bg-stone-900 cursor-pointer overflow-hidden"
                >
                  <img
                    src={channel.coverImage}
                    alt={channel.name}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E8590C]" />
                    <span>{channel.state}</span>
                  </div>
                </div>

                {/* Avatar & Channel Details */}
                <div className="px-5 pt-0 pb-4 relative">
                  <div 
                    onClick={() => openChannel(channel.username)}
                    className="relative -mt-9 mb-3 inline-block cursor-pointer"
                  >
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-18 h-18 rounded-full object-cover ring-4 ring-white shadow-md bg-white group-hover:scale-105 transition-transform"
                    />
                    {channel.isVerified && (
                      <div className="absolute bottom-0 right-0 bg-amber-500 text-white p-1 rounded-full ring-2 ring-white shadow-xs" title="Verified Food Creator">
                        <Award className="w-3.5 h-3.5 fill-white" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div 
                      onClick={() => openChannel(channel.username)}
                      className="flex items-center gap-1.5 cursor-pointer"
                    >
                      <h3 className="font-serif-title text-base font-bold text-[#2B1B17] group-hover:text-[#E8590C] transition-colors line-clamp-1">
                        {channel.name}
                      </h3>
                    </div>

                    <div className="text-xs font-mono font-bold text-[#E8590C]">
                      @{channel.username}
                    </div>

                    <div className="text-[11px] text-stone-500 line-clamp-1 font-medium">
                      {channel.speciality}
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed pt-1">
                      {channel.description}
                    </p>
                  </div>

                  {/* Channel Metrics */}
                  <div className="grid grid-cols-3 gap-2 py-3 mt-3 border-y border-stone-100 text-center text-xs">
                    <div>
                      <div className="font-bold text-[#2B1B17]">{channel.followersCount.toLocaleString()}</div>
                      <div className="text-[10px] text-stone-400">Followers</div>
                    </div>
                    <div>
                      <div className="font-bold text-[#E8590C]">{channel.calculatedRecipes}</div>
                      <div className="text-[10px] text-stone-400">Recipes</div>
                    </div>
                    <div>
                      <div className="font-bold text-amber-600">{channel.calculatedVideos}</div>
                      <div className="text-[10px] text-stone-400">Videos</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-stone-50/80 border-t border-stone-200 flex items-center gap-2">
                <button
                  onClick={() => isFollowing ? unfollowChannel(channel.id) : followChannel(channel.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isFollowing
                      ? 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                      : 'bg-[#E8590C] hover:bg-[#D9480F] text-white shadow-xs'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => openChannel(channel.username)}
                  className="px-3 py-2 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold rounded-xl border border-stone-300 transition-colors cursor-pointer"
                >
                  Channel
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
