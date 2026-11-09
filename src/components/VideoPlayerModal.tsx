import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CookingVideo } from '../types';
import { 
  X, 
  Heart, 
  Share2, 
  MessageSquare, 
  Eye, 
  Clock, 
  MapPin, 
  Globe, 
  Award, 
  UserPlus, 
  Check, 
  Crown, 
  Send, 
  Play, 
  Pause, 
  Tv, 
  CheckCircle2 
} from 'lucide-react';

export const VideoPlayerModal: React.FC = () => {
  const { 
    selectedVideo, 
    setSelectedVideo, 
    channels, 
    openChannel, 
    followChannel, 
    unfollowChannel, 
    isFollowingChannel, 
    likeVideo, 
    addVideoComment, 
    cookingVideos,
    currentUser,
    setIsPremiumModalOpen,
    showToast 
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!selectedVideo) return null;

  const channel = channels.find(c => c.id === selectedVideo.channelId || c.username === selectedVideo.creatorUsername);
  const isFollowing = channel ? isFollowingChannel(channel.id) : false;

  const handleLike = () => {
    likeVideo(selectedVideo.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addVideoComment(selectedVideo.id, commentText.trim());
    setCommentText('');
  };

  const handleShare = () => {
    const url = window.location.href;
    const shareText = `Watch "${selectedVideo.title}" by ${selectedVideo.creatorName} on TASTEOF BHARAT!`;
    if (navigator.share) {
      navigator.share({ title: selectedVideo.title, text: shareText, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      showToast('Video link copied to clipboard!');
    }
  };

  const otherCreatorVideos = cookingVideos.filter(v => 
    v.id !== selectedVideo.id && 
    (v.channelId === selectedVideo.channelId || v.creatorUsername === selectedVideo.creatorUsername)
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-[#FAF6F0] w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-800 overflow-hidden my-auto flex flex-col max-h-[94vh]">
        
        {/* Modal Top Control Bar */}
        <div className="px-4 py-3 bg-[#1A110E] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800">
              {selectedVideo.isShort ? 'Short Cooking Reel' : 'Masterclass Tutorial'}
            </span>
            <span className="text-xs text-stone-300 font-medium hidden sm:inline">· {selectedVideo.category}</span>
          </div>

          <button
            onClick={() => setSelectedVideo(null)}
            className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container (16:9 Aspect Ratio on Mobile & Desktop) */}
        <div className="relative aspect-video bg-black w-full flex items-center justify-center shrink-0 overflow-hidden group">
          {selectedVideo.isPremium && !currentUser?.isPremium ? (
            <div className="absolute inset-0 bg-stone-900/90 flex flex-col items-center justify-center text-center p-6 text-white space-y-3 z-10">
              <Crown className="w-12 h-12 text-amber-400 animate-pulse" />
              <h3 className="font-serif-title text-xl font-bold">Exclusive Premium Cooking Tutorial</h3>
              <p className="text-xs text-stone-300 max-w-md">This masterclass video was published exclusively for Taste of India Premium members.</p>
              <button
                onClick={() => setIsPremiumModalOpen(true)}
                className="px-6 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Unlock with Premium (₹49/mo)
              </button>
            </div>
          ) : (
            <video
              src={selectedVideo.videoUrl}
              poster={selectedVideo.thumbnail}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          )}

          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] font-mono px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 pointer-events-none">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{selectedVideo.duration}</span>
          </div>
        </div>

        {/* Scrollable Information & Discussion Section */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Title & Quick Stats */}
          <div className="space-y-2 pb-4 border-b border-stone-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="font-serif-title text-lg sm:text-2xl font-black text-[#2B1B17] leading-tight">
                {selectedVideo.title}
              </h1>

              {/* Action Buttons: Like, Share */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold border border-red-200 transition-all cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  <span>{selectedVideo.likes.toLocaleString()}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold border border-stone-300 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-stone-600" />
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 pt-1">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-stone-400" />
                <span>{selectedVideo.views.toLocaleString()} views</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E8590C]" />
                <span>{selectedVideo.state}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>{selectedVideo.language}</span>
              </span>
              <span>·</span>
              <span>Added {selectedVideo.createdAt}</span>
            </div>
          </div>

          {/* Creator Profile Channel Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <button
              onClick={() => { setSelectedVideo(null); openChannel(selectedVideo.creatorUsername); }}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <img
                src={selectedVideo.creatorAvatar}
                alt={selectedVideo.creatorName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E8590C]/30 group-hover:scale-105 transition-transform shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-[#2B1B17] group-hover:text-[#E8590C] transition-colors">
                    {selectedVideo.creatorName}
                  </span>
                  {selectedVideo.isVerified && (
                    <Award className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                  )}
                </div>
                <div className="text-xs text-stone-500 font-mono">
                  @{selectedVideo.creatorUsername}
                </div>
                {channel && (
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    {channel.followersCount.toLocaleString()} followers · {channel.district}, {channel.state}
                  </div>
                )}
              </div>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {channel && (
                <button
                  onClick={() => isFollowing ? unfollowChannel(channel.id) : followChannel(channel.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto ${
                    isFollowing
                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
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
                      <span>Follow Channel</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => { setSelectedVideo(null); openChannel(selectedVideo.creatorUsername); }}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold border border-stone-300 transition-colors shrink-0 cursor-pointer"
              >
                Visit Channel
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Video Overview & Techniques</h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {selectedVideo.description}
            </p>
          </div>

          {/* Other Videos From This Creator */}
          {otherCreatorVideos.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif-title text-sm font-bold text-[#2B1B17]">
                More Cooking Videos by {selectedVideo.creatorName}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {otherCreatorVideos.map(vid => (
                  <button
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className="flex flex-col text-left bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-[#E8590C] transition-all group cursor-pointer shadow-xs"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
                      <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                        {vid.duration}
                      </div>
                    </div>
                    <div className="p-2.5 space-y-1">
                      <div className="font-bold text-xs text-stone-900 line-clamp-1 group-hover:text-[#E8590C]">{vid.title}</div>
                      <div className="text-[10px] text-stone-500">{vid.views.toLocaleString()} views</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comments & Community Discussion */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-2 text-stone-800">
              <MessageSquare className="w-4 h-4 text-[#E8590C]" />
              <h3 className="font-serif-title text-sm font-bold">
                Discussion & Cooking Tips ({selectedVideo.comments.length})
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Ask the creator a question or share how your dish turned out..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-[#E8590C] hover:bg-[#D9480F] disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3 pt-2">
              {selectedVideo.comments.length === 0 ? (
                <div className="text-center py-6 text-stone-400 text-xs">
                  No comments yet. Be the first food lover to leave a question or feedback!
                </div>
              ) : (
                selectedVideo.comments.map(c => (
                  <div key={c.id} className="p-3 bg-[#FAF6F0]/60 rounded-xl border border-stone-100 flex items-start gap-3">
                    <img src={c.userAvatar} alt={c.userName} className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-stone-300" />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">{c.userName}</span>
                        <span className="text-[10px] text-stone-400">{c.createdAt}</span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
