import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INDIAN_STATES_AND_UTS } from '../data/states';
import { 
  X, 
  Tv, 
  Sparkles, 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Globe, 
  Youtube, 
  Instagram, 
  Facebook, 
  MapPin, 
  Languages, 
  ChefHat, 
  CheckCircle2 
} from 'lucide-react';

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1600&auto=format&fit=crop&q=80'
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
];

export const CreateChannelModal: React.FC = () => {
  const { 
    isCreateChannelModalOpen, 
    setIsCreateChannelModalOpen, 
    currentUser, 
    setIsAuthModalOpen, 
    createChannel, 
    openChannel,
    showToast 
  } = useApp();

  const [name, setName] = useState(currentUser ? `${currentUser.name}’s Rasoi` : '');
  const [username, setUsername] = useState(currentUser ? currentUser.username.replace(/[^a-z0-9_]/gi, '_') : '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || AVATAR_PRESETS[0]);
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0]);
  const [description, setDescription] = useState('Welcome to my authentic Indian cooking channel! Sharing family kitchen traditions, secret spice blends, and easy home-cooked recipes.');
  const [state, setState] = useState(currentUser?.location?.split(',')[1]?.trim() || 'Tamil Nadu');
  const [district, setDistrict] = useState(currentUser?.location?.split(',')[0]?.trim() || 'Chennai');
  const [speciality, setSpeciality] = useState('Traditional Home Cooking & Regional Gravies');
  const [preferredLanguage, setPreferredLanguage] = useState('Hindi & English');
  
  // Social links
  const [youtube, setYoutube] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [website, setWebsite] = useState('');

  if (!isCreateChannelModalOpen) return null;

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center space-y-4">
          <ChefHat className="w-12 h-12 text-[#E8590C] mx-auto" />
          <h2 className="font-serif-title text-xl font-bold text-[#2B1B17]">Sign In to Launch Your Food Channel</h2>
          <p className="text-xs text-stone-600">You must be a registered member to create a channel, upload cooking videos, and build your food follower community.</p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => { setIsCreateChannelModalOpen(false); setIsAuthModalOpen(true); }}
              className="px-5 py-2.5 bg-[#E8590C] text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Sign In / Register
            </button>
            <button
              onClick={() => setIsCreateChannelModalOpen(false)}
              className="px-4 py-2.5 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) {
      showToast('Please provide both Channel Name and unique Username');
      return;
    }

    try {
      const created = createChannel({
        name,
        username,
        avatar,
        coverImage,
        description,
        state,
        district,
        speciality,
        preferredLanguage,
        socialLinks: {
          youtube: youtube.trim() || undefined,
          instagram: instagram.trim() || undefined,
          facebook: facebook.trim() || undefined,
          website: website.trim() || undefined
        }
      });
      setIsCreateChannelModalOpen(false);
      openChannel(created.username);
    } catch (err: any) {
      showToast(err.message || 'Error creating channel');
    }
  };

  const previewSlug = username.toLowerCase().replace(/[^a-z0-9_]/g, '_');

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-[#FAF6F0] w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-[#2B1B17] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8590C] to-[#C05621] flex items-center justify-center text-white shadow-sm">
              <Tv className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                <Sparkles className="w-3 h-3" />
                <span>Taste of India Creator Studio</span>
              </div>
              <h2 className="font-serif-title text-xl sm:text-2xl font-black">
                Create Your Food Creator Channel
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsCreateChannelModalOpen(false)}
            className="text-stone-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Live URL Preview Pill */}
          <div className="bg-amber-100/70 border border-amber-300/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Your Permanent Channel Address</div>
              <div className="text-xs sm:text-sm font-mono font-bold text-[#2B1B17] break-all">
                tasteofindia.com/channel/<span className="text-[#E8590C]">@{previewSlug || 'your-handle'}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-white text-[#2B8A3E] px-2.5 py-1 rounded-full border border-emerald-300">
              Free Creator Tier
            </span>
          </div>

          {/* Section 1: Core Identity */}
          <div className="space-y-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="font-serif-title text-base font-bold text-[#2B1B17] flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-[#E8590C]" />
              <span>Channel Identity & Handle</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Channel Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Arun's Chettinad Spice Rasoi"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Unique Channel Username (@handle) *</label>
                <div className="flex items-center rounded-xl border border-stone-300 focus-within:border-[#E8590C] bg-[#FAF6F0]/50 overflow-hidden">
                  <span className="px-3 text-stone-500 font-bold text-xs bg-stone-100 py-2 border-r border-stone-300">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                    placeholder="chef_arun"
                    className="w-full px-3 py-2 text-xs sm:text-sm focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Channel Bio / Description *</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Share your culinary story, cooking philosophy, traditional family heirloom secrets..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
            </div>
          </div>

          {/* Section 2: Visual Branding (Cover & Avatar) */}
          <div className="space-y-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="font-serif-title text-base font-bold text-[#2B1B17] flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#E8590C]" />
              <span>Channel Visual Branding</span>
            </h3>

            {/* Live Banner & Avatar Preview */}
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 h-36 bg-stone-100">
              <img
                src={coverImage}
                alt="Channel Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 flex items-center gap-3 text-white">
                <img
                  src={avatar}
                  alt="Avatar Preview"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md"
                />
                <div>
                  <div className="font-bold text-sm leading-tight text-white">{name || 'Your Channel Name'}</div>
                  <div className="text-[11px] text-amber-300 font-mono">@{previewSlug || 'handle'}</div>
                </div>
              </div>
            </div>

            {/* Choose Cover Banner */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Choose Cover Banner</label>
              <div className="grid grid-cols-4 gap-2">
                {COVER_PRESETS.map((imgUrl, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setCoverImage(imgUrl)}
                    className={`relative rounded-xl overflow-hidden h-14 border-2 transition-all ${
                      coverImage === imgUrl ? 'border-[#E8590C] ring-2 ring-[#E8590C]/30 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Cover preset ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="mt-2">
                <input
                  type="url"
                  value={coverImage}
                  onChange={e => setCoverImage(e.target.value)}
                  placeholder="Or enter custom image URL for cover banner..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
                />
              </div>
            </div>

            {/* Choose Profile Avatar */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Choose Creator Avatar</label>
              <div className="flex items-center gap-2 flex-wrap">
                {AVATAR_PRESETS.map((imgUrl, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setAvatar(imgUrl)}
                    className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all ${
                      avatar === imgUrl ? 'border-[#E8590C] ring-2 ring-[#E8590C]/30 scale-105' : 'border-stone-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Avatar preset ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="mt-2">
                <input
                  type="url"
                  value={avatar}
                  onChange={e => setAvatar(e.target.value)}
                  placeholder="Or enter custom profile image URL..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Regional Origin & Cooking Speciality */}
          <div className="space-y-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="font-serif-title text-base font-bold text-[#2B1B17] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#E8590C]" />
              <span>Regional Origin & Culinary Speciality</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">State / Union Territory *</label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
                >
                  {INDIAN_STATES_AND_UTS.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.type.toUpperCase()})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">District / City *</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  placeholder="e.g. Karaikudi / Amritsar / Indore"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Cooking Speciality *</label>
                <input
                  type="text"
                  required
                  value={speciality}
                  onChange={e => setSpeciality(e.target.value)}
                  placeholder="e.g. Clay-pot curries, Tandoori breads, Vegan South Indian"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Preferred Language(s) *</label>
                <input
                  type="text"
                  required
                  value={preferredLanguage}
                  onChange={e => setPreferredLanguage(e.target.value)}
                  placeholder="e.g. Tamil & English / Hindi / Bengali"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Social Media Links */}
          <div className="space-y-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="font-serif-title text-base font-bold text-[#2B1B17] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#E8590C]" />
              <span>Connect Your Social Channels (Optional)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center rounded-xl border border-stone-300 px-3 py-1.5 bg-[#FAF6F0]/50">
                <Youtube className="w-4 h-4 text-red-600 mr-2 shrink-0" />
                <input
                  type="url"
                  value={youtube}
                  onChange={e => setYoutube(e.target.value)}
                  placeholder="YouTube channel link"
                  className="w-full text-xs bg-transparent focus:outline-none"
                />
              </div>

              <div className="flex items-center rounded-xl border border-stone-300 px-3 py-1.5 bg-[#FAF6F0]/50">
                <Instagram className="w-4 h-4 text-pink-600 mr-2 shrink-0" />
                <input
                  type="url"
                  value={instagram}
                  onChange={e => setInstagram(e.target.value)}
                  placeholder="Instagram profile link"
                  className="w-full text-xs bg-transparent focus:outline-none"
                />
              </div>

              <div className="flex items-center rounded-xl border border-stone-300 px-3 py-1.5 bg-[#FAF6F0]/50">
                <Facebook className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
                <input
                  type="url"
                  value={facebook}
                  onChange={e => setFacebook(e.target.value)}
                  placeholder="Facebook page link"
                  className="w-full text-xs bg-transparent focus:outline-none"
                />
              </div>

              <div className="flex items-center rounded-xl border border-stone-300 px-3 py-1.5 bg-[#FAF6F0]/50">
                <Globe className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                <input
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="Personal website / food blog"
                  className="w-full text-xs bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-300">
            <button
              type="button"
              onClick={() => setIsCreateChannelModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl bg-[#E8590C] hover:bg-[#D9480F] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Launch Channel Now</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
