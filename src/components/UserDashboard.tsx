import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_PLANS } from '../data/subscriptions';
import { RecipeCard } from './RecipeCard';
import { generateRecipePDF } from '../utils/pdfGenerator';
import { Recipe, CulinaryBadge } from '../types';
import { calculateCulinaryBadges } from '../data/culinaryBadges';
import { 
  User, 
  Crown, 
  Download, 
  Bookmark, 
  FileCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  Sparkles,
  ArrowRight,
  LogOut,
  ChefHat,
  Edit3,
  Trash2,
  Loader2,
  Award,
  Medal,
  Pencil,
  Camera,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  X,
  Upload,
  Flame,
  Globe2,
  Filter,
  Mail,
  Inbox,
  Megaphone,
  Bell
} from 'lucide-react';

const PRESET_AVATARS = [
  {
    label: 'Executive Chef',
    url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80',
    tag: 'Master Chef'
  },
  {
    label: 'South Indian Cook',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    tag: 'Chettinad'
  },
  {
    label: 'Home Foodie Priya',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    tag: 'Bengaluru'
  },
  {
    label: 'Royal Chef Vikram',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    tag: 'Heritage'
  },
  {
    label: 'Chai & Tiffin Specialist',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    tag: 'Tiffin'
  },
  {
    label: 'Satvik Culinary Artist',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    tag: 'Pure Veg'
  },
  {
    label: 'Modern Regional Baker',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80',
    tag: 'Sweets'
  },
  {
    label: 'Spice Explorer',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    tag: 'Explorer'
  }
];

export const UserDashboard: React.FC = () => {
  const { 
    currentUser, 
    recipes, 
    logout, 
    updateUserProfile,
    setIsPremiumModalOpen, 
    setSelectedRecipe, 
    setCurrentView, 
    openEditRecipe, 
    deleteRecipe, 
    showToast,
    openInvoiceModal,
    notifications,
    markNotificationRead
  } = useApp();

  const [activeTab, setActiveTab] = useState<'membership' | 'badges' | 'saved' | 'my-recipes' | 'downloads' | 'messages'>('membership');
  const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null);

  // Messages & Admin Notices for current user
  const userMessages = useMemo(() => {
    if (!currentUser) return [];
    return notifications
      .filter(n => n.userId === currentUser.id || n.userId === 'all' || n.type === 'announcement' || n.type === 'admin_message')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, currentUser]);

  const unreadMessagesCount = useMemo(() => {
    return userMessages.filter(m => !m.read).length;
  }, [userMessages]);

  // Edit Profile Modal State
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editUsername, setEditUsername] = useState(currentUser?.username || '');
  const [editCustomUserId, setEditCustomUserId] = useState(currentUser?.customUserId || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editLocation, setEditLocation] = useState(currentUser?.location || '');

  // Badges Filtering
  const [badgeTierFilter, setBadgeTierFilter] = useState<'all' | 'unlocked' | 'Gold' | 'Platinum' | 'Silver'>('all');
  const [copiedId, setCopiedId] = useState(false);

  // Open Edit Profile modal synced with current data
  const handleOpenEditProfile = () => {
    if (!currentUser) return;
    setEditName(currentUser.name || '');
    setEditUsername(currentUser.username || '');
    setEditCustomUserId(currentUser.customUserId || currentUser.id.slice(-6).toUpperCase());
    setEditAvatar(currentUser.avatar || '');
    setEditBio(currentUser.bio || '');
    setEditLocation(currentUser.location || '');
    setIsEditProfileModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Name cannot be empty.');
      return;
    }
    updateUserProfile({
      name: editName.trim(),
      username: editUsername.trim(),
      customUserId: editCustomUserId.trim(),
      avatar: editAvatar.trim(),
      bio: editBio.trim(),
      location: editLocation.trim()
    });
    setIsEditProfileModalOpen(false);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size should be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditAvatar(event.target.result as string);
          showToast('Custom logo image loaded!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyUserId = (idString: string) => {
    navigator.clipboard?.writeText(idString);
    setCopiedId(true);
    showToast(`User ID copied to clipboard: ${idString}`);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Badges Calculation
  const badges: CulinaryBadge[] = useMemo(() => {
    return calculateCulinaryBadges(currentUser, recipes);
  }, [currentUser, recipes]);

  const unlockedBadges = badges.filter(b => b.isUnlocked);

  const filteredBadges = useMemo(() => {
    if (badgeTierFilter === 'all') return badges;
    if (badgeTierFilter === 'unlocked') return badges.filter(b => b.isUnlocked);
    return badges.filter(b => b.tier === badgeTierFilter);
  }, [badges, badgeTierFilter]);

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <User className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="font-serif-title text-2xl font-bold text-stone-800">Please Sign In</h2>
        <p className="text-xs text-stone-600">You must be logged in to access your personal recipe dashboard.</p>
      </div>
    );
  }

  // Saved recipes
  const savedRecipes = recipes.filter(r => currentUser.savedRecipeIds.includes(r.id));
  
  // Uploaded recipes by current user
  const myUploadedRecipes = recipes.filter(r => r.creator.id === currentUser.id || currentUser.uploadedRecipeIds.includes(r.id));

  // Current plan details
  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === currentUser.plan) || SUBSCRIPTION_PLANS[1];

  // Downloadable recipes
  const downloadableRecipes = recipes.filter(r => 
    (currentUser.downloadedRecipeIds && currentUser.downloadedRecipeIds.includes(r.id)) || 
    currentUser.savedRecipeIds.includes(r.id) ||
    ['recipe-1', 'recipe-2', 'recipe-3'].includes(r.id)
  );

  const handleDownloadPDF = async (recipe: Recipe) => {
    if (!currentUser.isPremium) {
      setIsPremiumModalOpen(true);
      return;
    }
    try {
      setDownloadingPdfId(recipe.id);
      showToast(`Generating ${recipe.title} PDF with high-res photo & logo...`);
      await generateRecipePDF(recipe, currentUser.name);
      showToast(`Downloaded ${recipe.title} PDF archive!`);
    } catch (e) {
      console.error(e);
      showToast('Error preparing download.');
    } finally {
      setDownloadingPdfId(null);
    }
  };

  const displayUserId = currentUser.customUserId 
    ? currentUser.customUserId 
    : `TOI-${currentUser.id.replace(/^user-/, '').slice(-6).toUpperCase()}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative overflow-hidden">
        
        {/* Subtle decorative heritage background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left relative z-10">
          
          {/* User Logo / Avatar with Edit Overlay */}
          <div className="relative group shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-22 h-22 rounded-2xl object-cover ring-4 ring-[#E8590C]/25 shadow-sm border-2 border-white"
            />
            <button
              onClick={handleOpenEditProfile}
              className="absolute -bottom-1 -right-1 p-2 bg-[#E8590C] hover:bg-[#D9480F] text-white rounded-xl shadow-md transition-all cursor-pointer scale-90 group-hover:scale-100"
              title="Edit Profile & User Logo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="font-serif-title text-2xl font-black text-[#2B1B17]">
                {currentUser.name}
              </h1>

              {currentUser.isPremium && (
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                  <Crown className="w-3.5 h-3.5 text-amber-700" />
                  <span>Heritage Pass Member</span>
                </span>
              )}

              {/* Medals Won Badge Pill */}
              <button
                onClick={() => setActiveTab('badges')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-emerald-700" />
                <span>{unlockedBadges.length} Culinary Medals Won</span>
              </button>
            </div>

            {/* User ID & Handle Row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              
              {/* User ID Tag with Copy */}
              <button
                onClick={() => handleCopyUserId(displayUserId)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-mono text-[11px] font-bold transition-colors cursor-pointer border border-stone-200"
                title="Click to copy User ID"
              >
                <span className="text-stone-500 font-sans font-semibold">User ID:</span>
                <span>#{displayUserId}</span>
                {copiedId ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 text-stone-400" />
                )}
              </button>

              <span className="text-stone-300">·</span>
              <span className="font-mono text-stone-600 font-bold">@{currentUser.username}</span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-500">{currentUser.email}</span>
            </div>

            <p className="text-xs text-stone-600 max-w-lg pt-0.5 leading-relaxed">
              {currentUser.bio || 'Indian culinary enthusiast discovering authentic regional dishes.'}
            </p>

            {currentUser.location && (
              <div className="text-[11px] text-stone-500 font-medium flex items-center justify-center sm:justify-start gap-1">
                <Globe2 className="w-3 h-3 text-[#E8590C]" />
                <span>{currentUser.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 relative z-10 shrink-0">
          
          {/* Edit Profile & Logo Button */}
          <button
            onClick={handleOpenEditProfile}
            className="px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs hover:border-[#E8590C] cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5 text-[#E8590C]" />
            <span>Edit Profile &amp; User ID</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('creator-studio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-[#E8590C] to-amber-600 hover:from-[#D9480F] hover:to-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <ChefHat className="w-3.5 h-3.5 text-amber-200" />
            <span>Creator Studio &amp; My Accounts</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 border border-stone-200 text-stone-600 hover:text-red-600 rounded-xl text-xs font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('membership')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'membership'
              ? 'border-[#E8590C] text-[#E8590C]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>Membership &amp; Receipts</span>
        </button>

        {/* Culinary Badges Tab */}
        <button
          onClick={() => setActiveTab('badges')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'badges'
              ? 'border-[#E8590C] text-[#E8590C]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>Culinary Badges</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900 font-black">
            {unlockedBadges.length}/{badges.length} Won
          </span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'saved'
              ? 'border-[#E8590C] text-[#E8590C]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Recipes ({savedRecipes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my-recipes')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'my-recipes'
              ? 'border-[#E8590C] text-[#E8590C]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>My Submissions ({myUploadedRecipes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('downloads')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'downloads'
              ? 'border-[#E8590C] text-[#E8590C]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Recipe PDF Downloads ({downloadableRecipes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'messages'
              ? 'border-[#E8590C] text-[#E8590C]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Mail className="w-4 h-4 text-sky-600" />
          <span>Messages &amp; Admin Notices</span>
          {unreadMessagesCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#E8590C] text-white font-black animate-pulse">
              {unreadMessagesCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Membership & Receipts */}
      {activeTab === 'membership' && (
        <div className="space-y-6">
          
          {/* Active Subscription Running Guarantee Banner */}
          {currentUser.isPremium && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-xs shrink-0">
                  ✓
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-emerald-800 tracking-wider">
                    <span>Subscription Plan Active &amp; Running</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <div className="text-sm font-black text-stone-900">
                    {currentPlan.name} Pass · Linked to {currentUser.email}
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    <strong>Zero-Issue Logout Protection:</strong> When you sign out and return/login, your subscription stays intact and keeps running automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <span className="px-3.5 py-1.5 bg-emerald-200 text-emerald-900 rounded-xl font-mono font-black text-xs border border-emerald-300">
                  ✓ {currentUser.premiumExpiry ? Math.max(0, Math.ceil((new Date(currentUser.premiumExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 365} Days Remaining
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Status Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Subscription Status
                  </div>
                  <h3 className="font-serif-title text-xl font-black text-[#2B1B17] mt-0.5">
                    {currentUser.isPremium ? `${currentPlan.name} · Active & Running` : 'Free Explorer Plan'}
                  </h3>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  currentUser.isPremium ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-stone-100 text-stone-700'
                }`}>
                  {currentUser.isPremium && <span className="font-black">✓</span>}
                  <span>{currentUser.isPremium ? 'Running Smoothly' : 'Free Tier'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-100 text-xs">
                <div>
                  <span className="text-stone-400 block">Renewal / Price</span>
                  <span className="font-bold text-stone-800 text-sm">
                    {currentUser.isPremium ? `₹${currentPlan.price}.00` : '₹0 (Free)'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Valid Until</span>
                  <span className="font-bold text-stone-800 text-sm">
                    {currentUser.premiumExpiry ? new Date(currentUser.premiumExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No expiry'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">PDF Downloads</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    {currentUser.isPremium ? 'Unlimited & Active' : 'Disabled (Requires Premium)'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-3">
                <button
                  onClick={() => setIsPremiumModalOpen(true)}
                  className="px-5 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  {currentUser.isPremium ? 'Extend / Upgrade Plan' : 'Subscribe to Premium (from ₹49)'}
                </button>

                {currentUser.isPremium && (
                  <button
                    onClick={() => openInvoiceModal({
                      customerName: currentUser.name,
                      customerEmail: currentUser.email,
                      planName: currentPlan.name,
                      durationText: currentPlan.durationText,
                      amount: currentPlan.price,
                      validUntil: currentUser.premiumExpiry ? new Date(currentUser.premiumExpiry).toLocaleDateString('en-IN') : undefined,
                      status: 'PAID'
                    })}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Download Payment Receipt (PDF)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Benefits Card */}
            <div className="bg-[#FAF6F0] rounded-2xl border border-stone-200 p-6 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-[#E8590C] text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Member Privileges</span>
                </div>
                <h4 className="font-serif-title font-bold text-base text-[#2B1B17]">
                  Taste of India Privilege Access
                </h4>
                <ul className="mt-3 space-y-2 text-xs text-stone-600">
                  <li className="flex items-center gap-2">✓ Unlimited professional recipe PDF downloads</li>
                  <li className="flex items-center gap-2">✓ 100% Ad-Free uninterrupted cooking</li>
                  <li className="flex items-center gap-2">✓ 28 State Master Heritage recipe e-books</li>
                </ul>
              </div>

              <div className="text-[11px] text-stone-400">
                Encrypted payment transactions via RBI authorized payment gateways.
              </div>
            </div>

          </div>

          {/* Payment History Log */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-serif-title text-base font-bold text-[#2B1B17]">
              Billing History &amp; Official Receipts
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Plan</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr className="hover:bg-stone-50/50">
                    <td className="p-3 text-stone-600">Recent</td>
                    <td className="p-3 font-mono font-medium text-stone-800">pay_bharat_7109281</td>
                    <td className="p-3 font-semibold text-stone-900">{currentPlan.name}</td>
                    <td className="p-3 font-bold text-emerald-700">₹{currentPlan.price}.00</td>
                    <td className="p-3 text-stone-600">UPI (Google Pay)</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Captured
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Culinary Badges & Virtual Medals */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          
          {/* Badges Overview Hero Card */}
          <div className="bg-gradient-to-r from-[#2B1B17] via-[#3D251E] to-[#2B1B17] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-amber-900/40 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  <Medal className="w-3.5 h-3.5" />
                  <span>Culinary Achievement System</span>
                </div>
                <h2 className="font-serif-title text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Your Culinary Medals &amp; Milestones
                </h2>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Earn virtual medals and honor badges as you share authentic recipes, explore diverse regional cuisines across India, and safeguard culinary heritage.
                </p>
              </div>

              {/* Progress Summary Counter */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex items-center gap-5 shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 flex items-center justify-center font-black text-2xl shadow-inner border border-amber-200">
                  🏅
                </div>
                <div>
                  <div className="text-3xl font-black font-serif-title text-white">
                    {unlockedBadges.length} <span className="text-sm font-normal text-amber-300">/ {badges.length}</span>
                  </div>
                  <div className="text-[11px] text-stone-300 font-medium">Medals Unlocked</div>
                  <div className="w-32 bg-white/20 h-2 rounded-full overflow-hidden mt-1.5">
                    <div 
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(unlockedBadges.length / badges.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-white/10 mt-6 text-xs">
              <span className="text-[11px] font-bold text-amber-200 flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3" />
                <span>Filter:</span>
              </span>
              {(['all', 'unlocked', 'Platinum', 'Gold', 'Silver'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setBadgeTierFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    badgeTierFilter === f
                      ? 'bg-amber-500 text-[#2B1B17] font-black shadow-xs'
                      : 'bg-white/10 text-stone-300 hover:bg-white/20'
                  }`}
                >
                  {f === 'all' ? 'All Badges' : f === 'unlocked' ? '🏆 Unlocked Medals' : `${f} Tier`}
                </button>
              ))}
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBadges.map(badge => {
              const pct = Math.round((badge.currentCount / badge.targetCount) * 100);

              const tierHeaderBg = 
                badge.tier === 'Platinum'
                  ? 'from-cyan-900/90 to-slate-900 border-cyan-500/40 text-cyan-200'
                  : badge.tier === 'Gold'
                  ? 'from-amber-900/90 to-stone-900 border-amber-500/40 text-amber-200'
                  : badge.tier === 'Silver'
                  ? 'from-slate-800 to-stone-900 border-slate-400/40 text-slate-200'
                  : 'from-orange-950 to-stone-900 border-orange-700/40 text-orange-200';

              const medalColor = 
                badge.tier === 'Platinum'
                  ? 'from-cyan-300 via-teal-200 to-blue-400 text-cyan-950 ring-cyan-300/40'
                  : badge.tier === 'Gold'
                  ? 'from-yellow-300 via-amber-400 to-yellow-500 text-amber-950 ring-amber-400/40'
                  : badge.tier === 'Silver'
                  ? 'from-slate-200 via-gray-300 to-slate-400 text-slate-900 ring-slate-300/40'
                  : 'from-amber-700 via-orange-600 to-amber-900 text-amber-100 ring-amber-700/40';

              return (
                <div
                  key={badge.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                    badge.isUnlocked
                      ? 'bg-white border-amber-300/80 shadow-md hover:shadow-lg hover:border-[#E8590C]/60'
                      : 'bg-stone-50/80 border-stone-200 opacity-85'
                  }`}
                >
                  {/* Badge Top Header */}
                  <div className={`p-4 bg-gradient-to-r ${tierHeaderBg} text-white flex items-center justify-between border-b`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/40 border border-white/20">
                        {badge.tier} Medal
                      </span>
                      <span className="text-[11px] font-bold text-stone-300 capitalize">
                        {badge.category}
                      </span>
                    </div>

                    {badge.isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-stone-400">
                        In Progress ({pct}%)
                      </span>
                    )}
                  </div>

                  {/* Body with Medal Insignia and Details */}
                  <div className="p-5 space-y-4 flex-1">
                    <div className="flex items-start gap-4">
                      
                      {/* Medal Visual */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${medalColor} flex items-center justify-center text-2xl font-bold shadow-md ring-4 shrink-0 transition-transform hover:scale-105 select-none relative`}>
                        <span>{badge.icon}</span>
                        {badge.isUnlocked && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shadow-xs border border-white">
                            ✓
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-serif-title font-black text-sm text-[#2B1B17]">
                          {badge.name}
                        </h4>
                        <div className="text-xs font-bold text-[#E8590C]">
                          {badge.title}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {badge.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-stone-600">Milestone Progress:</span>
                        <span className="font-mono font-bold text-stone-800">
                          {badge.currentCount} / {badge.targetCount}
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            badge.isUnlocked ? 'bg-emerald-500' : 'bg-[#E8590C]'
                          }`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>

                    {/* Reward unlocked text */}
                    <div className="bg-[#FAF6F0] p-2.5 rounded-xl border border-[#E8DFC8]/70 text-[11px] text-stone-700 space-y-0.5">
                      <div className="font-bold text-[#E8590C] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Medal Privilege:</span>
                      </div>
                      <div className="text-stone-600">{badge.rewardText}</div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span>
                      {badge.isUnlocked && badge.unlockedAt ? `Awarded on ${badge.unlockedAt}` : 'Milestone locked'}
                    </span>
                    {badge.isUnlocked && (
                      <span className="font-bold text-amber-700 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Saved Favorites */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <h2 className="font-serif-title text-xl font-bold text-[#2B1B17]">
            Your Saved Recipes ({savedRecipes.length})
          </h2>

          {savedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-500 text-sm">
              You haven't bookmarked any recipes yet. Browse Explore Recipes and click the bookmark icon to save your favorites!
            </div>
          )}
        </div>
      )}

      {/* Tab 4: My Uploaded Recipes & Moderation Tracking */}
      {activeTab === 'my-recipes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="font-serif-title text-xl font-bold text-[#2B1B17]">
              Your Submissions &amp; Live Status
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('peoples-recipes')}
                className="text-xs font-bold text-stone-600 hover:text-[#E8590C] hover:underline flex items-center gap-1"
              >
                <span>Browse All People's Uploads →</span>
              </button>
              <button
                onClick={() => {
                  if (currentUser?.isBanned) {
                    showToast('Action Blocked: Your account is restricted by Admin from submitting recipes.');
                    return;
                  }
                  setCurrentView('share-recipe');
                }}
                className="text-xs font-bold text-[#E8590C] hover:underline cursor-pointer"
              >
                + Submit Another Recipe
              </button>
            </div>
          </div>

          {/* Banned User Warning */}
          {currentUser?.isBanned && (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-xl text-xs text-rose-950 flex items-start gap-2.5 animate-fadeIn">
              <span className="text-lg">🚫</span>
              <div>
                <strong className="font-bold">Account Restricted by Editorial Admin:</strong>
                <p className="mt-0.5 text-[11px] text-rose-800 leading-relaxed">
                  You are restricted from submitting new recipes and deleting existing recipes.
                  {currentUser.bannedReason && (
                    <span className="block mt-0.5 font-semibold text-rose-900">Reason: {currentUser.bannedReason}</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {myUploadedRecipes.length > 0 ? (
            <div className="space-y-3">
              {myUploadedRecipes.map(recipe => (
                <div
                  key={recipe.id}
                  className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-serif-title font-bold text-sm text-[#2B1B17]">
                        {recipe.title}
                      </h4>
                      <div className="text-xs text-stone-500">
                        {recipe.state} · {recipe.category} · Submitted {recipe.createdAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Moderation Status Pill */}
                    <div className="flex items-center gap-1.5">
                      {recipe.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approved &amp; Published</span>
                        </span>
                      )}
                      {recipe.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Under Admin Review</span>
                        </span>
                      )}
                      {recipe.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Needs Revision</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => openEditRecipe(recipe)}
                      className="text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      title="Edit Recipe"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        if (currentUser?.isBanned) {
                          showToast('Action Blocked: Your account is restricted by Admin from deleting recipes.');
                          return;
                        }
                        if (window.confirm(`Are you sure you want to delete "${recipe.title}"? This cannot be undone.`)) {
                          deleteRecipe(recipe.id);
                        }
                      }}
                      className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      title="Delete Recipe"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setSelectedRecipe(recipe)}
                      className="text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-200 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-500 text-sm space-y-3">
              <p>You haven't submitted any traditional recipes yet.</p>
              <button
                onClick={() => setCurrentView('share-recipe')}
                className="px-4 py-2 bg-[#E8590C] text-white rounded-xl text-xs font-bold"
              >
                Share Your First Recipe Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Downloaded Recipe PDFs with High-Res Photo & Logo */}
      {activeTab === 'downloads' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif-title text-xl font-bold text-[#2B1B17]">
                Your Downloadable Recipe PDFs ({downloadableRecipes.length})
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                All generated PDFs include the official TASTE OF INDIA logo, high-resolution food image, ingredients, and traditional chef tips.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {downloadableRecipes.map(recipe => (
              <div 
                key={recipe.id}
                className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between gap-4 shadow-xs hover:border-[#E8590C]/40 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-100"
                  />
                  <div className="space-y-1">
                    <h4 className="font-serif-title font-bold text-sm text-[#2B1B17] line-clamp-1">
                      {recipe.title}
                    </h4>
                    <div className="text-[11px] text-stone-500">
                      {recipe.state} · {recipe.category}
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-[#E8590C] border border-amber-200">
                      PDF with Photo &amp; Logo
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownloadPDF(recipe)}
                    disabled={downloadingPdfId === recipe.id}
                    className="px-3.5 py-2 bg-[#E8590C] hover:bg-[#D9480F] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
                    title="Download PDF archive"
                  >
                    {downloadingPdfId === recipe.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Rendering...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Messages & Admin Notices */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
                  <Mail className="w-4 h-4" />
                </span>
                <h3 className="font-serif-title text-base font-black text-stone-900">
                  Messages &amp; Platform Editorial Notices
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Official notices, recipe moderation communications, and announcements sent by Taste of India Editorial Admins.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-stone-100 text-stone-700 text-xs font-bold rounded-lg border border-stone-200">
                Total: {userMessages.length} ({unreadMessagesCount} unread)
              </span>
            </div>
          </div>

          {userMessages.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
              <Inbox className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h4 className="font-serif-title text-base font-bold text-stone-700">No Messages Yet</h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                You have no direct messages or editorial notifications from the administrative team.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userMessages.map(msg => (
                <div 
                  key={msg.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    msg.read 
                      ? 'bg-white border-stone-200' 
                      : 'bg-amber-50/40 border-amber-300 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        msg.type === 'announcement' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'
                      }`}>
                        {msg.type === 'announcement' ? <Megaphone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-black text-stone-900">
                            {msg.senderName || 'Master Editorial Admin'}
                          </span>
                          {msg.category && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                              {msg.category}
                            </span>
                          )}
                          {!msg.read && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white animate-pulse">
                              NEW
                            </span>
                          )}
                          <span className="text-[11px] text-stone-400">
                            {new Date(msg.createdAt).toLocaleDateString(undefined, { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 mt-1">
                          {msg.title}
                        </h4>
                        <p className="text-xs text-stone-700 mt-1 whitespace-pre-line leading-relaxed">
                          {msg.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                      {!msg.read && (
                        <button
                          onClick={() => markNotificationRead(msg.id)}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg border border-stone-300 cursor-pointer flex items-center gap-1 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Read</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EDIT PROFILE & USER LOGO MODAL */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-[#2B1B17] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8590C] flex items-center justify-center text-white">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-title text-xl font-black">
                    Edit Profile &amp; User ID
                  </h3>
                  <p className="text-xs text-stone-300">
                    Customize your User ID, username handle, display avatar, and bio
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditProfileModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile} className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
              
              {/* Avatar / Logo Selection Preview & Custom Options */}
              <div className="space-y-3 bg-[#FAF6F0] p-4 rounded-2xl border border-[#E8DFC8]">
                <label className="block text-stone-800 font-bold text-xs">
                  User Logo &amp; Avatar
                </label>

                <div className="flex items-center gap-4">
                  <img
                    src={editAvatar || currentUser.avatar}
                    alt="Preview"
                    className="w-18 h-18 rounded-2xl object-cover ring-4 ring-[#E8590C]/30 shrink-0 bg-white shadow-xs"
                  />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-stone-600 block">
                      Custom Avatar URL or Direct Upload:
                    </span>
                    <input
                      type="url"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      placeholder="Paste image / logo URL..."
                      className="w-full p-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#E8590C] text-xs font-mono"
                    />

                    <div className="flex items-center gap-2 pt-1">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg text-[11px] font-bold text-stone-700 shadow-2xs">
                        <Upload className="w-3 h-3 text-[#E8590C]" />
                        <span>Upload Image File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-stone-400">PNG, JPG, WebP up to 2MB</span>
                    </div>
                  </div>
                </div>

                {/* Preset Avatar Gallery */}
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <span className="text-[11px] font-bold text-stone-600 block">
                    Or choose an authentic Indian Chef / Foodie Logo Preset:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditAvatar(preset.url)}
                        className={`group relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                          editAvatar === preset.url
                            ? 'border-[#E8590C] ring-2 ring-[#E8590C]/40 scale-105'
                            : 'border-stone-200 hover:border-amber-400'
                        }`}
                        title={preset.label}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {editAvatar === preset.url && (
                          <div className="absolute inset-0 bg-[#E8590C]/30 flex items-center justify-center text-white">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* User ID Edit Option */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Custom User ID (Alphanumeric Code)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-mono text-stone-400 font-bold">#</span>
                    <input
                      type="text"
                      value={editCustomUserId}
                      onChange={(e) => setEditCustomUserId(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
                      placeholder="e.g. TOI-CHEF-7890"
                      className="w-full pl-7 p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs font-bold text-stone-900 focus:outline-none focus:border-[#E8590C] uppercase"
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Your unique member identification code
                  </span>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Username Handle (@handle)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone-400 font-bold">@</span>
                    <input
                      type="text"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                      placeholder="e.g. priya_cooks"
                      className="w-full pl-7 p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs font-bold text-stone-900 focus:outline-none focus:border-[#E8590C]"
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Visible URL handle across community and comments
                  </span>
                </div>
              </div>

              {/* Display Name & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Full Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E8590C]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Location / City &amp; State
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E8590C]"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Culinary Bio &amp; Specialty
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell fellow Indian food lovers about your favorite spices, regional heritage, or culinary secrets..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-[#E8590C]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 hover:bg-stone-100 rounded-xl text-xs font-bold text-stone-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] active:scale-95 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Profile &amp; User ID</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
