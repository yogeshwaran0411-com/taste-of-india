import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  IndianRupee, 
  Trash2, 
  Star, 
  Check, 
  TrendingUp,
  AlertTriangle,
  Award,
  Video,
  Play,
  Search,
  ExternalLink,
  Ban,
  RotateCcw,
  ChefHat
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    recipes, 
    setRecipes, 
    moderateRecipe, 
    cookingVideos,
    moderateVideo,
    deleteVideo,
    channels,
    verifyCreatorChannel,
    suspendCreatorChannel,
    openChannel,
    setSelectedVideo,
    showToast, 
    setSelectedRecipe 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'moderation' | 'video-moderation' | 'creators' | 'all-recipes' | 'revenue' | 'users'>('moderation');
  const [creatorSearch, setCreatorSearch] = useState('');

  // Computed metrics
  const totalRecipes = recipes.length;
  const publishedRecipes = recipes.filter(r => r.status === 'approved').length;
  const pendingRecipes = recipes.filter(r => r.status === 'pending');
  const pendingVideos = cookingVideos.filter(v => v.status === 'pending');
  const totalSubscribers = 428;
  const totalRevenue = 154200;

  // Recipe Approve handler
  const handleApprove = (id: string) => {
    moderateRecipe(id, 'approved');
  };

  // Recipe Reject handler
  const handleReject = (id: string) => {
    const reason = prompt('Provide revision reason for the creator:', 'Inaccurate measurements or missing instructions') || 'Content quality guidelines';
    moderateRecipe(id, 'rejected', reason);
  };

  // Video Approve handler
  const handleApproveVideo = (id: string) => {
    moderateVideo(id, 'approved');
  };

  // Video Reject handler
  const handleRejectVideo = (id: string) => {
    const reason = prompt('Provide rejection reason for the creator:', 'Video quality / guidelines compliance') || 'Guidelines non-compliance';
    moderateVideo(id, 'rejected', reason);
  };

  // Feature toggle
  const toggleFeature = (id: string) => {
    setRecipes(prev =>
      prev.map(r => (r.id === id ? { ...r, isFeatured: !r.isFeatured } : r))
    );
    showToast('Recipe featured status toggled.');
  };

  // Delete recipe
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this recipe?')) {
      setRecipes(prev => prev.filter(r => r.id !== id));
      showToast('Recipe removed.');
    }
  };

  // Filtered creators
  const filteredChannels = channels.filter(c => 
    c.name.toLowerCase().includes(creatorSearch.toLowerCase()) ||
    c.username.toLowerCase().includes(creatorSearch.toLowerCase()) ||
    c.state.toLowerCase().includes(creatorSearch.toLowerCase()) ||
    c.speciality.toLowerCase().includes(creatorSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Top Banner */}
      <div className="bg-[#2B1B17] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-black">
            Taste of Bharat Operations & Moderation
          </h1>
          <p className="text-xs text-stone-300 mt-1">
            Review community recipe submissions, approve cooking videos, manage creator channels, and verify culinary scholars.
          </p>
        </div>

        <div className="text-right text-xs">
          <span className="text-stone-400">Security Clearance:</span>
          <span className="font-bold text-amber-400 block text-sm">Super Admin Curator</span>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase">
            <span>Pending Recipes</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2 tabular-nums">
            {pendingRecipes.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Requires moderation</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase">
            <span>Pending Videos</span>
            <Video className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-sky-600 mt-2 tabular-nums">
            {pendingVideos.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Video queue</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase">
            <span>Creator Channels</span>
            <ChefHat className="w-4 h-4 text-[#E8590C]" />
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2 tabular-nums">
            {channels.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {channels.filter(c => c.isVerified).length} verified masters
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase">
            <span>Monthly Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2 tabular-nums">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">428 active subscribers</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto scrollbar-none pb-px">
        {[
          { id: 'moderation', label: `Pending Recipes (${pendingRecipes.length})`, icon: Clock },
          { id: 'video-moderation', label: `Pending Videos (${pendingVideos.length})`, icon: Video },
          { id: 'creators', label: `Creator Channels (${channels.length})`, icon: ChefHat },
          { id: 'all-recipes', label: `All Recipes (${totalRecipes})`, icon: BookOpen },
          { id: 'revenue', label: 'Subscription Revenue', icon: IndianRupee },
          { id: 'users', label: 'Member Directory', icon: Users },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'border-[#E8590C] text-[#E8590C] bg-amber-50/50 rounded-t-xl'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: RECIPE MODERATION ================= */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-title text-xl font-bold text-[#2B1B17]">
              Recipe Moderation Queue
            </h2>
            <span className="text-xs text-stone-500">
              Check measurements, allergen data, and traditional authenticity before approval
            </span>
          </div>

          {pendingRecipes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-serif-title text-lg font-bold text-stone-800">
                Moderation Queue is Clear!
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                All submitted creator recipes have been reviewed and published live.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRecipes.map(recipe => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 ring-1 ring-stone-200"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8590C] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          {recipe.state} · {recipe.category}
                        </span>
                        <span className="text-xs text-stone-400">Submitted {recipe.createdAt}</span>
                      </div>
                      <h3 className="font-serif-title text-base font-bold text-[#2B1B17]">
                        {recipe.title}
                      </h3>
                      <p className="text-xs text-stone-600 line-clamp-1 max-w-xl">
                        {recipe.description}
                      </p>
                      <div className="text-[11px] text-stone-500 flex items-center gap-2 pt-0.5">
                        <span className="font-semibold text-stone-700">By: {recipe.creator.name} (@{recipe.creator.username})</span>
                        <span>·</span>
                        <span>{recipe.ingredients.length} ingredients</span>
                        <span>·</span>
                        <span>{recipe.prepTime + recipe.cookTime} mins total</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => setSelectedRecipe(recipe)}
                      className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Audit Details
                    </button>
                    <button
                      onClick={() => handleReject(recipe.id)}
                      className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(recipe.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: VIDEO MODERATION ================= */}
      {activeTab === 'video-moderation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-title text-xl font-bold text-[#2B1B17]">
              Cooking Video Moderation Queue
            </h2>
            <span className="text-xs text-stone-500">
              Verify video quality, duration, and safety standards before public streaming
            </span>
          </div>

          {pendingVideos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-serif-title text-lg font-bold text-stone-800">
                All Cooking Videos Reviewed!
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No videos currently pending moderation.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingVideos.map(vid => (
                <div
                  key={vid.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      onClick={() => setSelectedVideo(vid)}
                      className="relative w-28 aspect-video rounded-xl overflow-hidden bg-black cursor-pointer shrink-0"
                    >
                      <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono px-1 rounded">
                        {vid.duration}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          {vid.state} · {vid.category}
                        </span>
                        <span className="text-xs text-stone-400">Duration: {vid.duration}</span>
                      </div>
                      <h3 className="font-serif-title text-base font-bold text-[#2B1B17]">
                        {vid.title}
                      </h3>
                      <p className="text-xs text-stone-600 line-clamp-1 max-w-xl">
                        {vid.description}
                      </p>
                      <div className="text-[11px] text-stone-500 pt-0.5">
                        Creator: <span className="font-bold text-stone-700">{vid.creatorName}</span> (@{vid.creatorUsername})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => setSelectedVideo(vid)}
                      className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Watch Video
                    </button>
                    <button
                      onClick={() => handleRejectVideo(vid.id)}
                      className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApproveVideo(vid.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve Video</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: CREATOR MANAGEMENT ================= */}
      {activeTab === 'creators' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif-title text-xl font-bold text-[#2B1B17]">
                Creator Channels Management ({channels.length})
              </h2>
              <p className="text-xs text-stone-500">
                Verify genuine regional food creators, suspend violating accounts, and inspect metrics.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={creatorSearch}
                onChange={e => setCreatorSearch(e.target.value)}
                placeholder="Search creator name, @handle, state..."
                className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-white"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-stone-200">
              {filteredChannels.map(channel => (
                <div key={channel.id} className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-14 h-14 rounded-full object-cover shrink-0 ring-2 ring-stone-200"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-serif-title text-base font-bold text-[#2B1B17]">
                          {channel.name}
                        </h4>
                        <span className="text-xs font-mono font-bold text-[#E8590C]">
                          @{channel.username}
                        </span>
                        {channel.isVerified && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                            <Award className="w-3 h-3 text-amber-600 fill-amber-500" />
                            <span>Verified</span>
                          </span>
                        )}
                        {channel.isSuspended && (
                          <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-full border border-red-300">
                            Suspended
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                        <span>{channel.district}, {channel.state}</span>
                        <span>·</span>
                        <span className="text-stone-700 font-medium">{channel.speciality}</span>
                        <span>·</span>
                        <span>{channel.followersCount.toLocaleString()} followers</span>
                        <span>·</span>
                        <span>{channel.viewsCount.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => openChannel(channel.username)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3 text-stone-500" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => verifyCreatorChannel(channel.id, !channel.isVerified)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                        channel.isVerified
                          ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      <Award className="w-3 h-3 text-amber-600" />
                      <span>{channel.isVerified ? 'Remove Badge' : 'Verify Creator'}</span>
                    </button>

                    <button
                      onClick={() => suspendCreatorChannel(channel.id, !channel.isSuspended)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                        channel.isSuspended
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                      }`}
                    >
                      {channel.isSuspended ? (
                        <>
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore</span>
                        </>
                      ) : (
                        <>
                          <Ban className="w-3 h-3" />
                          <span>Suspend</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: ALL RECIPES ================= */}
      {activeTab === 'all-recipes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-title text-xl font-bold text-[#2B1B17]">
              Master Recipe Repository ({recipes.length})
            </h2>
            <span className="text-xs text-stone-500">Live platform recipes across all 36 Indian territories</span>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-stone-200">
              {recipes.slice(0, 20).map(recipe => (
                <div key={recipe.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={recipe.image} alt={recipe.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 
                        onClick={() => setSelectedRecipe(recipe)}
                        className="font-serif-title text-sm font-bold text-[#2B1B17] hover:text-[#E8590C] cursor-pointer"
                      >
                        {recipe.title}
                      </h4>
                      <div className="text-xs text-stone-500 flex items-center gap-2">
                        <span>{recipe.state}</span>
                        <span>·</span>
                        <span>{recipe.category}</span>
                        <span>·</span>
                        <span>By {recipe.creator.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFeature(recipe.id)}
                      className={`p-1.5 rounded-lg border text-xs font-semibold ${
                        recipe.isFeatured ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                      title="Toggle Featured on Homepage"
                    >
                      <Star className={`w-3.5 h-3.5 ${recipe.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg"
                      title="Delete recipe"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: REVENUE ================= */}
      {activeTab === 'revenue' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <h2 className="font-serif-title text-xl font-bold text-[#2B1B17]">
            Subscription Revenue Analytics
          </h2>
          <p className="text-xs text-stone-500">Live breakdown of active paid members downloading PDF archives</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-amber-800">Monthly Pass (₹49)</span>
              <div className="text-xl font-black text-amber-950 mt-1">182 Active Members</div>
              <div className="text-xs text-stone-500 mt-0.5">₹8,918 / month</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-amber-800">Quarterly Pass (₹129)</span>
              <div className="text-xl font-black text-amber-950 mt-1">164 Active Members</div>
              <div className="text-xs text-stone-500 mt-0.5">₹21,156 / quarter</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-amber-800">Annual Pass (₹399)</span>
              <div className="text-xl font-black text-amber-950 mt-1">82 Active Members</div>
              <div className="text-xs text-stone-500 mt-0.5">₹32,718 / year</div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: USERS ================= */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <h2 className="font-serif-title text-xl font-bold text-[#2B1B17]">
            Registered Member Directory
          </h2>
          <div className="divide-y divide-stone-200 text-xs">
            {[
              { name: 'Priya Sharma', email: 'priya.sharma@example.com', role: 'Creator / Premium', state: 'Karnataka' },
              { name: 'Chef Amritpal Singh', email: 'amrit@punjabidhaba.in', role: 'Verified Creator', state: 'Punjab' },
              { name: 'Meenakshi Sundaram', email: 'meenakshi@chettinad.org', role: 'Verified Creator', state: 'Tamil Nadu' },
              { name: 'Ananya Mukherjee', email: 'ananya@bengalrasoi.com', role: 'Verified Creator', state: 'West Bengal' },
              { name: 'Vikramaditya (Admin)', email: 'admin@tasteofbharat.com', role: 'Super Admin', state: 'Delhi' }
            ].map((u, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900">{u.name}</div>
                  <div className="text-stone-400">{u.email} · {u.state}</div>
                </div>
                <span className="font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
