import React, { useState } from 'react';
import { 
  X, 
  Video, 
  Play, 
  Upload, 
  Check, 
  Sparkles, 
  UtensilsCrossed, 
  Store, 
  Building2, 
  Tv, 
  Clock, 
  Film,
  FolderOpen,
  CheckCircle2
} from 'lucide-react';

export interface GalleryVideoPreset {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  category: string;
  state: string;
  language: string;
  creatorType: 'normal' | 'catering' | 'homemade' | 'hotel_restaurant';
}

export const CULINARY_VIDEO_GALLERY: GalleryVideoPreset[] = [
  // 1. Normal Creator Channel Videos
  {
    id: 'vid-gal-1',
    title: 'Master the 2:1 Golden Ratio for Crispy Udupi Dosa',
    description: 'Learn the exact fermentation temperature, stone grinding technique, and pan heat control for paper-thin restaurant dosa.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    duration: '08:45',
    category: 'Breakfast',
    state: 'Karnataka',
    language: 'Kannada & English',
    creatorType: 'normal'
  },
  {
    id: 'vid-gal-2',
    title: 'Authentic Punjabi Sarson Ka Saag & Makki Ki Roti',
    description: 'Slow-simmered winter greens with hand-churned white butter and traditional flatbread techniques.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    duration: '11:20',
    category: 'Curry & Gravy',
    state: 'Punjab',
    language: 'Punjabi & Hindi',
    creatorType: 'normal'
  },
  {
    id: 'vid-gal-3',
    title: 'Traditional Bengali Shorshe Ilish Masterclass',
    description: 'Silky Hilsa fish steamed in stone-ground mustard paste and fiery green chillies.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80',
    duration: '09:15',
    category: 'Fish & Seafood',
    state: 'West Bengal',
    language: 'Bengali & English',
    creatorType: 'normal'
  },

  // 2. Catering Business Videos
  {
    id: 'vid-gal-4',
    title: 'Grand Royal Wedding 1000-Guest Dum Biryani Preparation',
    description: 'Behind the scenes at a royal Lucknowi wedding buffet setup: sealing 50kg degs with dough and layering saffron rice.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80',
    duration: '14:30',
    category: 'Rice & Biryani',
    state: 'Uttar Pradesh',
    language: 'Hindi & English',
    creatorType: 'catering'
  },
  {
    id: 'vid-gal-5',
    title: 'Live Dosa & Chaat Counter Setup for Banquets',
    description: 'High-speed live counter catering techniques for wedding receptions and corporate galas.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    duration: '07:50',
    category: 'Street Food & Snacks',
    state: 'Tamil Nadu',
    language: 'Tamil & English',
    creatorType: 'catering'
  },

  // 3. Homemade Tiffin Kitchen Videos
  {
    id: 'vid-gal-6',
    title: 'Daily Homestyle Tiffin Box Morning Cooking & Packing',
    description: 'Morning 5 AM routine preparing 45 fresh lunch tiffins with phulkas, seasonal sabzi, dal, and jeera rice.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    duration: '06:40',
    category: 'Dal & Lentils',
    state: 'Delhi',
    language: 'Hindi',
    creatorType: 'homemade'
  },
  {
    id: 'vid-gal-7',
    title: 'Soft Phulkas & Gujarati Kathiyawadi Tiffin Special',
    description: 'Batch rolling 100 puffed phulkas and pressure-cooking Sev Tameta Nu Shaak for home deliveries.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&auto=format&fit=crop&q=80',
    duration: '08:10',
    category: 'Bread & Roti',
    state: 'Gujarat',
    language: 'Gujarati & Hindi',
    creatorType: 'homemade'
  },

  // 4. Hotel & Restaurant Videos
  {
    id: 'vid-gal-8',
    title: 'Live Clay Oven Tandoor Masterclass — Naan & Kebabs',
    description: 'Commercial 450°C clay tandoor techniques from the head chef: slapping garlic butter naan and skewering paneer tikka.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    duration: '10:55',
    category: 'Tandoor & Starters',
    state: 'Punjab',
    language: 'Hindi & English',
    creatorType: 'hotel_restaurant'
  },
  {
    id: 'vid-gal-9',
    title: 'Signature Heritage Sizzler & Thali Assembly',
    description: 'Fine dine plating techniques: sizzling cast-iron platters, smoked gravies, and silver thali course service.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&auto=format&fit=crop&q=80',
    duration: '09:30',
    category: 'Thali & Platters',
    state: 'Rajasthan',
    language: 'Hindi & English',
    creatorType: 'hotel_restaurant'
  }
];

interface VideoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVideo: (video: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnail: string;
    duration: string;
    category: string;
    state: string;
    language: string;
    creatorType: 'normal' | 'catering' | 'homemade' | 'hotel_restaurant';
  }) => void;
  defaultFilter?: 'all' | 'normal' | 'catering' | 'homemade' | 'hotel_restaurant';
}

export const VideoGalleryModal: React.FC<VideoGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectVideo,
  defaultFilter = 'all'
}) => {
  const [selectedTab, setSelectedTab] = useState<'gallery' | 'upload'>('gallery');
  const [creatorFilter, setCreatorFilter] = useState<'all' | 'normal' | 'catering' | 'homemade' | 'hotel_restaurant'>(defaultFilter);
  const [previewingVideo, setPreviewingVideo] = useState<GalleryVideoPreset | null>(null);

  // File Upload State
  const [customFileTitle, setCustomFileTitle] = useState('');
  const [customFileUrl, setCustomFileUrl] = useState('');
  const [customFileDuration, setCustomFileDuration] = useState('05:30');
  const [customFileCategory, setCustomFileCategory] = useState('Curry & Gravy');
  const [customFileCreatorType, setCustomFileCreatorType] = useState<'normal' | 'catering' | 'homemade' | 'hotel_restaurant'>('normal');

  if (!isOpen) return null;

  const filteredVideos = CULINARY_VIDEO_GALLERY.filter(v => {
    if (creatorFilter === 'all') return true;
    return v.creatorType === creatorFilter;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setCustomFileUrl(blobUrl);
      if (!customFileTitle) {
        setCustomFileTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleConfirmCustomUpload = () => {
    if (!customFileUrl) return;
    onSelectVideo({
      title: customFileTitle || 'My Culinary Video Upload',
      description: 'Custom video tutorial uploaded by creator.',
      videoUrl: customFileUrl,
      thumbnail: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      duration: customFileDuration,
      category: customFileCategory,
      state: 'All India',
      language: 'Hindi & English',
      creatorType: customFileCreatorType
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1C1412] text-white w-full max-w-4xl max-h-[90vh] rounded-3xl border border-amber-900/50 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#2B1B17] via-[#3B2219] to-[#2B1B17] border-b border-amber-900/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Film className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-700/60">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Culinary Video Asset Hub</span>
              </div>
              <h2 className="font-serif-title text-lg sm:text-xl font-black text-white">
                Video Upload Gallery
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection: Curated Gallery vs Upload From Device */}
        <div className="px-6 pt-4 border-b border-amber-900/30 flex items-center gap-3 bg-[#241713]">
          <button
            onClick={() => setSelectedTab('gallery')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              selectedTab === 'gallery'
                ? 'border-[#E8590C] text-amber-400 font-black'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Curated Video Library ({CULINARY_VIDEO_GALLERY.length})</span>
          </button>

          <button
            onClick={() => setSelectedTab('upload')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              selectedTab === 'upload'
                ? 'border-[#E8590C] text-amber-400 font-black'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload From Computer / Device</span>
          </button>
        </div>

        {/* Tab 1: Curated Video Library */}
        {selectedTab === 'gallery' && (
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
            
            {/* Filter by Creator / Business Role */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {[
                { id: 'all', label: 'All Videos', icon: Film },
                { id: 'normal', label: 'Normal Creators (Channel)', icon: Tv },
                { id: 'catering', label: 'Catering Services', icon: UtensilsCrossed },
                { id: 'homemade', label: 'Homemade Tiffin Kitchens', icon: Store },
                { id: 'hotel_restaurant', label: 'Hotels & Restaurants', icon: Building2 },
              ].map(filter => {
                const Icon = filter.icon;
                const isSelected = creatorFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setCreatorFilter(filter.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-[#E8590C] text-white shadow-xs'
                        : 'bg-black/30 text-stone-400 hover:text-stone-200 border border-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVideos.map(video => (
                <div
                  key={video.id}
                  className="bg-black/40 rounded-2xl border border-amber-900/30 overflow-hidden hover:border-amber-500/60 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail Preview */}
                    <div className="relative aspect-video bg-stone-900 overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#E8590C] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 ml-0.5 fill-white" />
                        </div>
                      </div>

                      {/* Duration Tag */}
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-[10px] font-mono font-bold rounded-md backdrop-blur-xs flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{video.duration}</span>
                      </span>

                      {/* Creator Type Tag */}
                      <span className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md backdrop-blur-xs ${
                        video.creatorType === 'catering'
                          ? 'bg-indigo-600/90 text-white'
                          : video.creatorType === 'homemade'
                            ? 'bg-emerald-600/90 text-white'
                            : video.creatorType === 'hotel_restaurant'
                              ? 'bg-rose-600/90 text-white'
                              : 'bg-purple-600/90 text-white'
                      }`}>
                        {video.creatorType === 'catering' && 'Catering Video'}
                        {video.creatorType === 'homemade' && 'Homemade Video'}
                        {video.creatorType === 'hotel_restaurant' && 'Restaurant Video'}
                        {video.creatorType === 'normal' && 'Channel Video'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-3.5 space-y-2">
                      <h4 className="font-bold text-xs sm:text-sm text-stone-100 line-clamp-1 group-hover:text-amber-300 transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                      <div className="text-[10px] text-stone-400 font-mono flex items-center gap-2">
                        <span>{video.category}</span>
                        <span>·</span>
                        <span className="text-amber-400">{video.state}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-3.5 pt-0">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectVideo({
                          title: video.title,
                          description: video.description,
                          videoUrl: video.videoUrl,
                          thumbnail: video.thumbnail,
                          duration: video.duration,
                          category: video.category,
                          state: video.state,
                          language: video.language,
                          creatorType: video.creatorType
                        });
                        onClose();
                      }}
                      className="w-full py-2 bg-[#E8590C] hover:bg-[#D9480F] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Select This Video</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Custom File Upload */}
        {selectedTab === 'upload' && (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
            <div className="text-center space-y-2 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="font-serif-title text-base sm:text-lg font-bold text-white">
                Upload Cooking Video From Your Device
              </h3>
              <p className="text-xs text-stone-400">
                Supports MP4, WebM, and QuickTime files for Normal creators, Catering services, Homemade kitchens, and Restaurants.
              </p>
            </div>

            {/* Drag & Drop Area */}
            <div className="border-2 border-dashed border-amber-900/60 hover:border-amber-500/60 rounded-3xl p-6 text-center bg-black/30 space-y-3">
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleFileUpload}
                className="hidden"
                id="video-gallery-file-input"
              />
              <label
                htmlFor="video-gallery-file-input"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-md"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Choose Video File</span>
              </label>
              <div className="text-[11px] text-stone-500">
                {customFileUrl ? '✓ Video file loaded into memory preview' : 'Max recommended file size: 500MB'}
              </div>
            </div>

            {/* Video Metadata Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-300 mb-1">Video Title</label>
                <input
                  type="text"
                  value={customFileTitle}
                  onChange={e => setCustomFileTitle(e.target.value)}
                  placeholder="e.g. Traditional Hand-Made Rasam Recipe Tutorial"
                  className="w-full px-3.5 py-2 bg-black/40 border border-stone-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">Creator / Business Type</label>
                <select
                  value={customFileCreatorType}
                  onChange={e => setCustomFileCreatorType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-black/40 border border-stone-700 rounded-xl text-xs text-white"
                >
                  <option value="normal">Normal Creator (Food Channel)</option>
                  <option value="catering">Catering Service</option>
                  <option value="homemade">Homemade Tiffin Kitchen</option>
                  <option value="hotel_restaurant">Hotel &amp; Restaurant</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">Estimated Duration</label>
                <input
                  type="text"
                  value={customFileDuration}
                  onChange={e => setCustomFileDuration(e.target.value)}
                  placeholder="05:30"
                  className="w-full px-3.5 py-2 bg-black/40 border border-stone-700 rounded-xl text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Confirm Button */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-800 text-stone-300 text-xs font-bold rounded-xl hover:bg-stone-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!customFileUrl}
                onClick={handleConfirmCustomUpload}
                className="px-6 py-2 bg-[#E8590C] hover:bg-[#D9480F] disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Use Uploaded Video</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
