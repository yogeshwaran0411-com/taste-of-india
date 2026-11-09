import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Recipe, CateringProfile, HomemadeFoodProfile, HotelRestaurantProfile } from '../types';
import { 
  ShieldCheck, 
  Users, 
  UtensilsCrossed, 
  Heart, 
  Building2, 
  CookingPot, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Sparkles, 
  TrendingUp, 
  FileText, 
  CreditCard, 
  Settings, 
  LogOut, 
  Eye, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Download, 
  ArrowRight,
  ChefHat,
  Star,
  MapPin,
  IndianRupee,
  ShieldAlert,
  RefreshCw,
  Sliders,
  DollarSign,
  Lock,
  Mail,
  MessageSquare,
  Send,
  Inbox,
  Megaphone,
  UserCheck,
  X,
  Ban
} from 'lucide-react';
import { AdminVerificationModal } from './AdminVerificationModal';

type AdminTab = 'overview' | 'recipes' | 'users' | 'messages' | 'catering' | 'homemade' | 'hotels' | 'creators' | 'payments' | 'settings';

export const AdminPanel: React.FC = () => {
  const { 
    recipes, 
    setRecipes, 
    moderateRecipe, 
    deleteRecipe, 
    usersRegistry,
    banUser,
    unbanUser,
    adminSentMessages,
    sendAdminMessage,
    caterers, 
    setCaterers, 
    updateCateringProfile,
    homemadeBusinesses, 
    setHomemadeBusinesses,
    updateHomemadeProfile,
    hotelsAndRestaurants, 
    setHotelsAndRestaurants,
    updateHotelRestaurantProfile,
    channels,
    verifyCreatorChannel,
    suspendCreatorChannel,
    currentUser, 
    setCurrentUser,
    setCurrentView, 
    setSelectedRecipe, 
    openInvoiceModal,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [recipeFilter, setRecipeFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectModalRecipe, setRejectModalRecipe] = useState<Recipe | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Missing required preparation step details or non-compliant imagery.');

  // User Management State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUserForRecipes, setSelectedUserForRecipes] = useState<string | null>(null);

  // Recipe Deletion Modal State
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [deleteReason, setDeleteReason] = useState('Violation of authentic regional culinary standards and guidelines');
  const [customDeleteReason, setCustomDeleteReason] = useState('');
  const [notifyAuthorOnDelete, setNotifyAuthorOnDelete] = useState(true);

  // Ban User Modal State
  const [userToBan, setUserToBan] = useState<any | null>(null);
  const [banReason, setBanReason] = useState('Violation of authentic regional culinary standards and recipe submission guidelines.');
  const [notifyUserOnBan, setNotifyUserOnBan] = useState(true);

  // Admin Message Modal & Form State
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageRecipientId, setMessageRecipientId] = useState<'all' | string>('all');
  const [messageRecipientName, setMessageRecipientName] = useState('All Community Members');
  const [messageRecipientEmail, setMessageRecipientEmail] = useState('');
  const [messageCategory, setMessageCategory] = useState('Editorial Notice');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');

  // 3-Step Admin Security Verification Gatekeeper
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    return localStorage.getItem('toi_admin_3step_verified') === 'true';
  });

  // Mock list of subscription transactions for the billing ledger
  const [transactions, setTransactions] = useState([
    {
      id: 'TXN-TOI-984210',
      orderId: 'ORD-TOI-2026-881',
      customerName: 'Priya Sharma',
      customerEmail: 'priya.sharma@example.com',
      planName: 'Quarterly Heritage Pass',
      durationText: '3 Months Access',
      amount: 129,
      method: 'UPI (Axis Bank / GPay)',
      utr: '439201948201',
      date: '2026-11-06 14:22',
      status: 'PAID'
    },
    {
      id: 'TXN-TOI-984209',
      orderId: 'ORD-TOI-2026-880',
      customerName: 'Rajesh Venkat',
      customerEmail: 'rajesh.v@outlook.com',
      planName: 'Yearly Royal Patron',
      durationText: '12 Months Access',
      amount: 399,
      method: 'UPI (PhonePe)',
      utr: '439184920482',
      date: '2026-11-06 11:05',
      status: 'PAID'
    },
    {
      id: 'TXN-TOI-984208',
      orderId: 'ORD-TOI-2026-879',
      customerName: 'Ananya Mukherjee',
      customerEmail: 'ananya.m@gmail.com',
      planName: 'Monthly Culinary Pass',
      durationText: '1 Month Access',
      amount: 49,
      method: 'UPI (Paytm)',
      utr: '439102948192',
      date: '2026-11-05 19:40',
      status: 'PAID'
    },
    {
      id: 'TXN-TOI-984207',
      orderId: 'ORD-TOI-2026-878',
      customerName: 'Karan Mehra',
      customerEmail: 'karan.m@gmail.com',
      planName: 'Half-Yearly Connoisseur',
      durationText: '6 Months Access',
      amount: 229,
      method: 'Cards (Visa Debit)',
      utr: 'CARD-AUTH-83921',
      date: '2026-11-05 16:15',
      status: 'PAID'
    },
    {
      id: 'TXN-TOI-984206',
      orderId: 'ORD-TOI-2026-877',
      customerName: 'Dr. Sunita Rao',
      customerEmail: 'sunita.rao@apollo.org',
      planName: 'Yearly Royal Patron',
      durationText: '12 Months Access',
      amount: 399,
      method: 'NetBanking (HDFC Bank)',
      utr: 'NET-HDFC-994012',
      date: '2026-11-04 10:30',
      status: 'PAID'
    }
  ]);

  // Derived Stats
  const totalRecipes = recipes.length;
  const pendingRecipes = recipes.filter(r => r.status === 'pending');
  const approvedRecipes = recipes.filter(r => r.status === 'approved' || !r.status);
  const totalCaterers = caterers.length;
  const verifiedCaterers = caterers.filter(c => c.verified).length;
  const totalHomemade = homemadeBusinesses.length;
  const verifiedHomemade = homemadeBusinesses.filter(h => h.verified).length;
  const totalHotels = hotelsAndRestaurants.length;
  const verifiedHotels = hotelsAndRestaurants.filter(h => h.verified).length;
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0) + 48250; // Total platform revenue (₹)

  // Toggle user role between user and admin for instant testing
  const toggleAdminRole = () => {
    if (currentUser?.role === 'admin') {
      setCurrentUser(prev => prev ? { ...prev, role: 'user' } : null);
      showToast('Switched to Member view. Admin features hidden.');
      setCurrentView('home');
    } else {
      setCurrentUser(prev => prev ? { ...prev, role: 'admin' } : {
        id: 'user-admin-master',
        name: 'Chief Culinary Curator (Admin)',
        username: 'admin_curator',
        email: 'admin@tasteofindia.org',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        bio: 'Platform Administrator & Chief Culinary Director at Taste of India.',
        location: 'New Delhi & Chennai',
        role: 'admin',
        isPremium: true,
        followers: 14200,
        following: 12,
        savedRecipeIds: [],
        uploadedRecipeIds: [],
        downloadedRecipeIds: [],
        followingCreatorIds: [],
        hasChannel: true,
        createdAt: '2026-01-01'
      });
      showToast('Switched to Super Administrator role! All management tools active.');
    }
  };

  const handleApproveRecipe = (recipeId: string) => {
    moderateRecipe(recipeId, 'approved');
    showToast('Recipe approved and published to Taste of India directory!');
  };

  const handleOpenReject = (recipe: Recipe) => {
    setRejectModalRecipe(recipe);
  };

  const handleConfirmReject = () => {
    if (!rejectModalRecipe) return;
    moderateRecipe(rejectModalRecipe.id, 'rejected', rejectionReason);
    setRejectModalRecipe(null);
    showToast('Recipe status updated to rejected.');
  };

  const handleToggleFeatured = (recipeId: string, currentFeatured?: boolean) => {
    setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, isFeatured: !currentFeatured } : r));
    showToast(!currentFeatured ? 'Recipe promoted to Homepage Featured!' : 'Recipe removed from Featured.');
  };

  const handleToggleCatererVerified = (caterer: CateringProfile) => {
    updateCateringProfile(caterer.id, { verified: !caterer.verified });
    showToast(`${caterer.businessName} verification status updated to ${!caterer.verified ? 'VERIFIED' : 'UNVERIFIED'}.`);
  };

  const handleToggleHomemadeVerified = (kitchen: HomemadeFoodProfile) => {
    updateHomemadeProfile(kitchen.id, { verified: !kitchen.verified });
    showToast(`${kitchen.businessName} verification status updated to ${!kitchen.verified ? 'VERIFIED' : 'UNVERIFIED'}.`);
  };

  const handleToggleHotelVerified = (restaurant: HotelRestaurantProfile) => {
    updateHotelRestaurantProfile(restaurant.id, { verified: !restaurant.verified });
    showToast(`${restaurant.businessName} verification status updated to ${!restaurant.verified ? 'VERIFIED' : 'UNVERIFIED'}.`);
  };

  const handleViewInvoice = (txn: typeof transactions[0]) => {
    openInvoiceModal({
      invoiceNumber: txn.orderId,
      customerName: txn.customerName,
      customerEmail: txn.customerEmail,
      planName: txn.planName,
      durationText: txn.durationText,
      amount: txn.amount,
      paymentMethod: txn.method,
      transactionId: txn.id,
      validUntil: 'Active (365 Days)',
      status: 'PAID'
    });
  };

  // Filter recipes
  const filteredRecipes = recipes.filter(r => {
    const matchesFilter = 
      recipeFilter === 'all' || 
      (recipeFilter === 'pending' && r.status === 'pending') ||
      (recipeFilter === 'approved' && (r.status === 'approved' || !r.status)) ||
      (recipeFilter === 'rejected' && r.status === 'rejected');
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // User Management computed list
  const allCommunityUsers = React.useMemo(() => {
    const list = [...usersRegistry];
    // Include distinct authors from recipes who might not be in usersRegistry
    recipes.forEach(r => {
      if (r.creator && r.creator.name) {
        const exists = list.some(u => 
          (r.creator.id && u.id === r.creator.id) || 
          u.username === r.creator.username || 
          u.name.toLowerCase() === r.creator.name.toLowerCase()
        );
        if (!exists) {
          list.push({
            id: r.creator.id || `user-${r.creator.username || Math.random().toString(36).substr(2, 6)}`,
            name: r.creator.name,
            username: r.creator.username || r.creator.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            email: `${r.creator.username || 'contributor'}@community.tasteofindia.in`,
            avatar: r.creator.avatar,
            bio: `Community culinary contributor sharing authentic ${r.state} regional recipes.`,
            location: r.state,
            role: 'user',
            isPremium: false,
            followers: 140,
            following: 8,
            savedRecipeIds: [],
            uploadedRecipeIds: [r.id],
            downloadedRecipeIds: [],
            followingCreatorIds: [],
            hasChannel: false,
            createdAt: '2026-03-01'
          });
        }
      }
    });
    return list;
  }, [usersRegistry, recipes]);

  const filteredUsers = allCommunityUsers.filter(u => {
    if (!userSearchQuery.trim()) return true;
    const q = userSearchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.location && u.location.toLowerCase().includes(q))
    );
  });

  const handleOpenMessageModal = (target?: { id: string; name: string; email?: string }) => {
    if (target) {
      setMessageRecipientId(target.id);
      setMessageRecipientName(target.name);
      setMessageRecipientEmail(target.email || '');
      setMessageSubject(`Editorial Guidance regarding your recipe contributions`);
    } else {
      setMessageRecipientId('all');
      setMessageRecipientName('All Community Members');
      setMessageRecipientEmail('');
      setMessageSubject('');
    }
    setMessageBody('');
    setIsMessageModalOpen(true);
  };

  const handleSendAdminMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageSubject.trim() || !messageBody.trim()) {
      showToast('Please provide both message subject and content.');
      return;
    }

    sendAdminMessage({
      recipientUserId: messageRecipientId,
      recipientName: messageRecipientName,
      recipientEmail: messageRecipientEmail,
      title: messageSubject,
      message: messageBody,
      category: messageCategory
    });

    setIsMessageModalOpen(false);
    setMessageSubject('');
    setMessageBody('');
  };

  const handleConfirmDeleteRecipe = () => {
    if (!recipeToDelete) return;
    const finalReason = customDeleteReason.trim() ? customDeleteReason.trim() : deleteReason;
    deleteRecipe(recipeToDelete.id, finalReason, notifyAuthorOnDelete);
    setRecipeToDelete(null);
    setCustomDeleteReason('');
  };

  if (!isVerified) {
    return (
      <AdminVerificationModal
        onSuccess={() => {
          setIsVerified(true);
        }}
        onCancel={() => {
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Admin Top Header Banner */}
      <div className="bg-gradient-to-r from-[#1E1410] via-[#2D1B15] to-[#1E1410] rounded-3xl p-6 sm:p-8 text-white border border-amber-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Taste of India · Master Administration Console</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span>System Live &amp; Operational</span>
            </span>
          </div>

          <h1 className="font-serif-title text-2xl sm:text-4xl font-black tracking-tight text-white">
            Editorial Management &amp; Verification Portal
          </h1>

          <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Manage recipe submissions, verify catering and home kitchen partners, moderate restaurant listings, audit UPI subscription transactions, and oversee creator accounts across all 36 Indian states &amp; territories.
          </p>

          {/* 3-Step Verified Master Admin Session Strip (Private) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-300 font-mono bg-black/40 px-3 py-1.5 rounded-xl border border-emerald-900/50 mt-1">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>3-Step Multi-Factor Authentication:</span>
            </span>
            <span className="text-stone-300">Master Administrator Session Active</span>
            <span>·</span>
            <span className="text-emerald-400">Encrypted Private Access ✓</span>
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('toi_admin_3step_verified');
              setIsVerified(false);
              showToast('Admin Console locked. 3-Step Verification required for access.');
            }}
            className="px-4 py-2.5 bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            title="Lock Admin Console & Re-enable 3-Step Verification"
          >
            <Lock className="w-4 h-4 text-red-400" />
            <span>Lock Console</span>
          </button>

          <button
            type="button"
            onClick={toggleAdminRole}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            title="Switch between Admin and Normal Member mode"
          >
            <Sliders className="w-4 h-4 text-amber-300" />
            <span>{currentUser?.role === 'admin' ? 'Role: Super Admin (Active)' : 'Switch to Admin Role'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Admin Panel</span>
          </button>
        </div>
      </div>

      {/* Stats KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
            <span>Recipes</span>
            <CookingPot className="w-4 h-4 text-[#E8590C]" />
          </div>
          <div className="font-black text-2xl text-stone-900">{totalRecipes}</div>
          <div className="text-[11px] font-semibold text-amber-700">{pendingRecipes.length} Pending Review</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
            <span>Caterers</span>
            <UtensilsCrossed className="w-4 h-4 text-[#E8590C]" />
          </div>
          <div className="font-black text-2xl text-stone-900">{totalCaterers}</div>
          <div className="text-[11px] font-semibold text-emerald-700">{verifiedCaterers} Verified</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
            <span>Home Cooks</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="font-black text-2xl text-stone-900">{totalHomemade}</div>
          <div className="text-[11px] font-semibold text-emerald-700">{verifiedHomemade} Verified</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
            <span>Venues</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-black text-2xl text-stone-900">{totalHotels}</div>
          <div className="text-[11px] font-semibold text-emerald-700">{verifiedHotels} Verified</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
            <span>Channels</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="font-black text-2xl text-stone-900">{channels.length}</div>
          <div className="text-[11px] font-semibold text-sky-700">All Active</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1 bg-gradient-to-br from-amber-50/50 to-orange-50/30">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
            <span>Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-black text-2xl text-emerald-700">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] font-semibold text-stone-500">Verified Subscriptions</div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'overview' ? 'bg-[#2B1B17] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('recipes')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'recipes' ? 'bg-[#2B1B17] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <CookingPot className="w-4 h-4 text-[#E8590C]" />
          <span>Recipe Moderation</span>
          {pendingRecipes.length > 0 && (
            <span className="bg-[#E8590C] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {pendingRecipes.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'users' ? 'bg-[#2B1B17] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Users className="w-4 h-4 text-purple-600" />
          <span>Users &amp; Recipes ({allCommunityUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'messages' ? 'bg-[#2B1B17] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Mail className="w-4 h-4 text-sky-600" />
          <span>Admin Messages ({adminSentMessages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('catering')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'catering' ? 'bg-[#2B1B17] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4 text-[#E8590C]" />
          <span>Caterers ({caterers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('homemade')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'homemade' ? 'bg-[#2B1B17] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Home Kitchens ({homemadeBusinesses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hotels')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'hotels' ? 'bg-[#2B1B17] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-500" />
          <span>Hotels &amp; Dhabas ({hotelsAndRestaurants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('creators')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'creators' ? 'bg-[#2B1B17] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ChefHat className="w-4 h-4 text-emerald-600" />
          <span>Creator Channels ({channels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'payments' ? 'bg-[#2B1B17] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <CreditCard className="w-4 h-4 text-emerald-600" />
          <span>Transactions &amp; Invoices</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'settings' ? 'bg-[#2B1B17] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Settings className="w-4 h-4 text-stone-500" />
          <span>System Settings</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: OVERVIEW & DASHBOARD SUMMARY                             */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Action Callout for Pending Tasks */}
          {pendingRecipes.length > 0 && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif-title font-bold text-base text-stone-900">
                    {pendingRecipes.length} Community Recipes Awaiting Editorial Review
                  </h4>
                  <p className="text-xs text-stone-600">
                    Review and approve submitted recipes to make them publicly visible in the People's Recipes catalog.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('recipes');
                  setRecipeFilter('pending');
                }}
                className="px-4 py-2 bg-[#E8590C] hover:bg-[#D9480F] text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
              >
                Review Pending Queue
              </button>
            </div>
          )}

          {/* Quick Operations Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
                <CookingPot className="w-4 h-4 text-[#E8590C]" />
                <span>Recipe Directory Health</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Total <strong>{totalRecipes}</strong> regional recipes indexed across 36 States &amp; Union Territories. Verified recipes are published to the global search engine.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-xs">
                <span className="text-emerald-700 font-bold">{approvedRecipes.length} Approved</span>
                <button
                  onClick={() => setActiveTab('recipes')}
                  className="text-[#E8590C] font-bold hover:underline"
                >
                  Manage Recipes →
                </button>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
                <UtensilsCrossed className="w-4 h-4 text-[#E8590C]" />
                <span>Business Verification</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Managing <strong>{totalCaterers + totalHomemade + totalHotels}</strong> verified food businesses including event caterers, certified home kitchens, and heritage hotel dining rooms.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-xs">
                <span className="text-emerald-700 font-bold">{verifiedCaterers + verifiedHomemade + verifiedHotels} Verified Badges</span>
                <button
                  onClick={() => setActiveTab('catering')}
                  className="text-[#E8590C] font-bold hover:underline"
                >
                  Audit Partners →
                </button>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Subscription Billing Ledger</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Audited direct UPI and Card transaction ledger with computerized official payment receipts and 1-click PDF download capabilities.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-xs">
                <span className="text-stone-800 font-bold">{transactions.length} Recent Records</span>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  View Transactions →
                </button>
              </div>
            </div>
          </div>

          {/* Recent Submissions Feed */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-title font-bold text-base text-[#2B1B17]">
                Latest Recipe Uploads Across Bharat
              </h3>
              <button
                onClick={() => setActiveTab('recipes')}
                className="text-xs font-bold text-[#E8590C] hover:underline"
              >
                View All {recipes.length} Recipes
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {recipes.slice(0, 5).map(r => (
                <div key={r.id} className="py-3 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <img src={r.image} alt={r.title} className="w-12 h-12 rounded-xl object-cover ring-1 ring-stone-200" />
                    <div>
                      <div className="font-bold text-sm text-stone-900">{r.title}</div>
                      <div className="text-xs text-stone-500">
                        By {r.creator.name} · {r.state} · <span className="font-semibold text-stone-700">{r.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      r.status === 'approved' || !r.status
                        ? 'bg-emerald-100 text-emerald-800'
                        : r.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {r.status === 'approved' || !r.status ? 'Approved' : r.status === 'pending' ? 'Pending Review' : 'Rejected'}
                    </span>
                    <button
                      onClick={() => setSelectedRecipe(r)}
                      className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg cursor-pointer"
                      title="Preview Recipe"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: RECIPE MODERATION                                        */}
      {/* ============================================================== */}
      {activeTab === 'recipes' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search recipe title, chef, state, or category..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#E8590C]/30"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setRecipeFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    recipeFilter === tab
                      ? 'bg-[#E8590C] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {tab} ({
                    tab === 'all' ? recipes.length :
                    tab === 'pending' ? pendingRecipes.length :
                    tab === 'approved' ? approvedRecipes.length :
                    recipes.filter(r => r.status === 'rejected').length
                  })
                </button>
              ))}
            </div>
          </div>

          {/* Recipes List Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6F0] border-b border-stone-200 text-stone-700 uppercase font-black tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5 pl-5">Recipe / Dish</th>
                    <th className="p-3.5">Creator</th>
                    <th className="p-3.5">Region / State</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Featured</th>
                    <th className="p-3.5 pr-5 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredRecipes.map(r => (
                    <tr key={r.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="p-3.5 pl-5">
                        <div className="flex items-center gap-3">
                          <img src={r.image} alt={r.title} className="w-10 h-10 rounded-lg object-cover ring-1 ring-stone-200 shrink-0" />
                          <div>
                            <div className="font-bold text-stone-900 line-clamp-1">{r.title}</div>
                            <div className="text-[11px] text-stone-500 font-mono">ID: {r.id.slice(0, 14)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-stone-800">{r.creator.name}</div>
                        <div className="text-[11px] text-stone-400">@{r.creator.username || 'creator'}</div>
                      </td>
                      <td className="p-3.5 text-stone-700 font-medium">
                        {r.state}
                      </td>
                      <td className="p-3.5">
                        <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                          {r.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          r.status === 'approved' || !r.status
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'pending'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {r.status === 'approved' || !r.status ? 'Approved' : r.status === 'pending' ? 'Pending' : 'Rejected'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(r.id, r.isFeatured)}
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] cursor-pointer transition-all ${
                            r.isFeatured
                              ? 'bg-amber-500 text-white shadow-2xs'
                              : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                          }`}
                        >
                          {r.isFeatured ? '★ Featured' : 'Standard'}
                        </button>
                      </td>
                      <td className="p-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedRecipe(r)}
                            className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg cursor-pointer"
                            title="Preview Recipe"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {r.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApproveRecipe(r.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer shadow-2xs flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenReject(r)}
                                className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-lg cursor-pointer flex items-center gap-1"
                              >
                                <XCircle className="w-3 h-3" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => handleOpenMessageModal({
                              id: r.creator.id || r.creator.username,
                              name: r.creator.name,
                              email: `${r.creator.username || 'creator'}@community.tasteofindia.in`
                            })}
                            className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg cursor-pointer transition-colors"
                            title="Send Admin Message to Author"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setRecipeToDelete(r)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 rounded-lg cursor-pointer transition-colors"
                            title="Delete Recipe (Opens Admin Deletion Options)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: USERS & RECIPES MANAGEMENT                                 */}
      {/* ============================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Header Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200 mb-1">
                <Users className="w-3 h-3 text-purple-600" />
                <span>User &amp; Contributor Directory</span>
              </div>
              <h3 className="font-serif-title font-bold text-lg text-stone-900">
                Community Users, Creators &amp; Uploaded Recipes ({allCommunityUsers.length})
              </h3>
              <p className="text-xs text-stone-500">
                Inspect registered users, manage user-submitted recipes, delete non-compliant dishes, and message authors directly.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenMessageModal()}
              className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Megaphone className="w-4 h-4" />
              <span>Broadcast Message to All Users</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-3">
            <Search className="w-4 h-4 text-stone-400 ml-1 shrink-0" />
            <input
              type="text"
              value={userSearchQuery}
              onChange={e => setUserSearchQuery(e.target.value)}
              placeholder="Search user by name, username, email, or state location..."
              className="w-full text-xs bg-transparent focus:outline-none text-stone-800 placeholder-stone-400"
            />
            {userSearchQuery && (
              <button
                type="button"
                onClick={() => setUserSearchQuery('')}
                className="text-xs text-stone-400 hover:text-stone-600 px-2"
              >
                Clear
              </button>
            )}
          </div>

          {/* Users List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.map(user => {
              const userRecipes = recipes.filter(r => 
                r.creator.id === user.id || 
                r.creator.username === user.username || 
                r.creator.name.toLowerCase() === user.name.toLowerCase() ||
                (user.uploadedRecipeIds && user.uploadedRecipeIds.includes(r.id))
              );
              const isExpanded = selectedUserForRecipes === user.id;

              return (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5 space-y-4">
                    {/* User Identity Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                          alt={user.name}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-stone-100 shrink-0 bg-stone-100"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-sm text-stone-900 truncate">{user.name}</h4>
                            {user.role === 'admin' ? (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                                Super Admin
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-stone-100 text-stone-700">
                                Community User
                              </span>
                            )}
                            {user.hasChannel && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                                Channel Creator
                              </span>
                            )}
                            {user.isBanned && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white animate-pulse flex items-center gap-1 shadow-2xs">
                                <Ban className="w-2.5 h-2.5" />
                                <span>Banned</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 font-mono truncate">@{user.username}</div>
                          <div className="text-[11px] text-stone-400 truncate">{user.email}</div>
                        </div>
                      </div>

                      {/* User Management Actions: Message & Ban */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenMessageModal(user)}
                          className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                          title={`Send Admin Message to ${user.name}`}
                        >
                          <Mail className="w-3.5 h-3.5 text-sky-600" />
                          <span>Message</span>
                        </button>

                        {user.role !== 'admin' && (
                          user.isBanned ? (
                            <button
                              type="button"
                              onClick={() => unbanUser(user.id)}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                              title={`Unban ${user.name} and restore recipe privileges`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Unban</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setUserToBan(user);
                                setBanReason('Violation of authentic regional culinary standards and recipe submission guidelines.');
                                setNotifyUserOnBan(true);
                              }}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                              title={`Ban ${user.name} - restricts user from creating or deleting recipes`}
                            >
                              <Ban className="w-3.5 h-3.5 text-rose-600" />
                              <span>Ban User</span>
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Banned User Warning Banner */}
                    {user.isBanned && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-900 flex items-start gap-2 animate-fadeIn">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold">Account Restricted by Admin:</strong> This user is banned from creating new recipes and deleting recipes.
                          {user.bannedReason && (
                            <div className="text-rose-700 mt-0.5">Reason: {user.bannedReason}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Stats & Meta Row */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase font-bold">Recipes</span>
                        <span className="font-black text-stone-800">{userRecipes.length}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase font-bold">Region</span>
                        <span className="font-semibold text-stone-700 truncate block">{user.location || 'India'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase font-bold">Membership</span>
                        <span className={`font-bold ${user.isPremium ? 'text-amber-700' : 'text-stone-600'}`}>
                          {user.isPremium ? 'Active Patron' : 'Free Member'}
                        </span>
                      </div>
                    </div>

                    {/* Expand Recipes Toggle */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedUserForRecipes(isExpanded ? null : user.id)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer border ${
                          isExpanded
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <CookingPot className="w-3.5 h-3.5 text-[#E8590C]" />
                          <span>User's Submitted Recipes ({userRecipes.length})</span>
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {isExpanded ? 'Hide Recipes ▲' : 'View & Delete Recipes ▼'}
                        </span>
                      </button>
                    </div>

                    {/* Expanded Recipes Sub-List with Explicit Delete Option */}
                    {isExpanded && (
                      <div className="space-y-2 pt-2 border-t border-stone-100 animate-fadeIn">
                        {userRecipes.length === 0 ? (
                          <div className="p-4 bg-stone-50 rounded-xl text-center text-xs text-stone-500 italic">
                            No recipes submitted by {user.name} yet.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            {userRecipes.map(r => (
                              <div
                                key={r.id}
                                className="p-3 bg-stone-50 hover:bg-amber-50/50 rounded-xl border border-stone-200 flex items-center justify-between gap-3 transition-colors"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img
                                    src={r.image}
                                    alt={r.title}
                                    className="w-10 h-10 rounded-lg object-cover ring-1 ring-stone-200 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <div className="font-bold text-xs text-stone-900 truncate">{r.title}</div>
                                    <div className="text-[10px] text-stone-500 flex items-center gap-2">
                                      <span>{r.category}</span>
                                      <span>·</span>
                                      <span className="text-amber-800 font-medium">{r.state}</span>
                                      <span>·</span>
                                      <span className={`font-bold uppercase ${
                                        r.status === 'approved' || !r.status ? 'text-emerald-700' :
                                        r.status === 'pending' ? 'text-amber-700' : 'text-red-700'
                                      }`}>
                                        {r.status || 'approved'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedRecipe(r)}
                                    className="p-1.5 bg-white hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold cursor-pointer border border-stone-200"
                                    title="Preview Recipe Details"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Explicit Admin Delete Recipe Option */}
                                  <button
                                    type="button"
                                    onClick={() => setRecipeToDelete(r)}
                                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                                    title="Delete this user recipe permanently"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete Recipe</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: ADMIN MESSAGES & COMMUNICATIONS CONSOLE                    */}
      {/* ============================================================== */}
      {activeTab === 'messages' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-900 border border-sky-200 mb-1">
                <Mail className="w-3 h-3 text-sky-600" />
                <span>Admin Communication Hub</span>
              </div>
              <h3 className="font-serif-title font-bold text-lg text-stone-900">
                Send Messages &amp; Editorial Notices to Users
              </h3>
              <p className="text-xs text-stone-500">
                Deliver direct inbox messages to specific recipe creators or broadcast announcements to the entire community.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                {adminSentMessages.length} Messages Dispatched
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Compose Message Form */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-5">
              <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
                  <Send className="w-4 h-4 text-sky-600" />
                  <span>Compose Admin Message</span>
                </div>
                <span className="text-[11px] text-stone-400">Delivered directly to user's dashboard &amp; studio</span>
              </div>

              <form onSubmit={handleSendAdminMessageSubmit} className="space-y-4">
                {/* Recipient Selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Select Target Recipient *
                  </label>
                  <select
                    value={messageRecipientId}
                    onChange={e => {
                      const val = e.target.value;
                      setMessageRecipientId(val);
                      if (val === 'all') {
                        setMessageRecipientName('All Community Members');
                        setMessageRecipientEmail('');
                      } else {
                        const targetUser = allCommunityUsers.find(u => u.id === val);
                        if (targetUser) {
                          setMessageRecipientName(targetUser.name);
                          setMessageRecipientEmail(targetUser.email || '');
                        }
                      }
                    }}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-sky-500 bg-stone-50 font-medium"
                  >
                    <option value="all">📢 Broadcast to All Community Members &amp; Creators ({allCommunityUsers.length} Users)</option>
                    <optgroup label="Registered Community Members">
                      {allCommunityUsers.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} (@{u.username}) — {u.email}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Quick Preset Templates */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Quick Preset Templates:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      {
                        label: '🍽 Recipe Modification Request',
                        category: 'Recipe Feedback',
                        subject: 'Action Required: Recipe Step Modification',
                        body: 'Hello! Our editorial team reviewed your recent recipe submission. Please update the step-by-step cooking temperatures and accurate ingredient ratios so we can approve it for public featuring.'
                      },
                      {
                        label: '⭐ Featured Recipe Congratulation',
                        category: 'Editorial Recognition',
                        subject: 'Congratulations! Your Recipe is Featured on Homepage',
                        body: 'Vanakkam! Your heirloom recipe has been selected by our master culinary committee as a Featured Regional Recipe of the Week. Thank you for preserving authentic Indian heritage flavours.'
                      },
                      {
                        label: '⚠️ Recipe Removal Notice',
                        category: 'Content Moderation',
                        subject: 'Important: Recipe Deletion & Compliance Notice',
                        body: 'Please note that your recent recipe submission was removed by our administrative team due to non-compliance with community culinary accuracy guidelines or image quality standards.'
                      },
                      {
                        label: '🏆 Verified Creator Seal',
                        category: 'Verification Status',
                        subject: 'Taste of India Verified Creator Status Awarded',
                        body: 'Congratulations! Your creator profile and culinary contributions have met our heritage standards. You have been granted the official Verified Creator Badge on your channel and recipes.'
                      },
                      {
                        label: '📢 Platform Announcement',
                        category: 'Community Announcement',
                        subject: 'New Festival Recipes Feature Live on Taste of India',
                        body: 'We are thrilled to launch the new festive seasonal collections! Home cooks and caterers can now upload high-definition cooking reels and seasonal thali menus across all 36 Indian regions.'
                      }
                    ].map(tpl => (
                      <button
                        key={tpl.label}
                        type="button"
                        onClick={() => {
                          setMessageCategory(tpl.category);
                          setMessageSubject(tpl.subject);
                          setMessageBody(tpl.body);
                          showToast(`Template applied: "${tpl.label}"`);
                        }}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border border-stone-200"
                      >
                        {tpl.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Notice Category</label>
                    <select
                      value={messageCategory}
                      onChange={e => setMessageCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-sky-500 bg-stone-50"
                    >
                      <option value="Editorial Notice">Editorial Notice</option>
                      <option value="Recipe Feedback">Recipe Feedback</option>
                      <option value="Content Moderation">Content Moderation</option>
                      <option value="Editorial Recognition">Editorial Recognition</option>
                      <option value="Verification Status">Verification Status</option>
                      <option value="Community Announcement">Community Announcement</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 mb-1">Message Subject / Title *</label>
                    <input
                      type="text"
                      required
                      value={messageSubject}
                      onChange={e => setMessageSubject(e.target.value)}
                      placeholder="e.g. Action Required: Recipe Update for Dosa Fermentation"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-sky-500 bg-stone-50"
                    />
                  </div>
                </div>

                {/* Body Textarea */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Message Content *</label>
                  <textarea
                    rows={4}
                    required
                    value={messageBody}
                    onChange={e => setMessageBody(e.target.value)}
                    placeholder="Type official administrative message or guidance..."
                    className="w-full p-3 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-sky-500 bg-stone-50 leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">
                    Recipient: <strong className="text-stone-800">{messageRecipientName}</strong>
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-[#E8590C] hover:from-sky-700 hover:to-[#D9480F] active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch Admin Message</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Sent Messages History Audit */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
                    <Inbox className="w-4 h-4 text-emerald-600" />
                    <span>Dispatched Messages History</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-stone-500">
                    {adminSentMessages.length} Total
                  </span>
                </div>

                <div className="divide-y divide-stone-100 max-h-[460px] overflow-y-auto pr-1 space-y-2 pt-2">
                  {adminSentMessages.length === 0 ? (
                    <div className="p-8 text-center text-xs text-stone-400">
                      No admin messages sent yet.
                    </div>
                  ) : (
                    adminSentMessages.map(msg => (
                      <div key={msg.id} className="pt-3 pb-2 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-900 truncate">{msg.recipientName}</span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200">
                            {msg.category}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Delivered</span>
                          </span>
                        </div>
                        <div className="font-semibold text-xs text-stone-800 line-clamp-1">
                          {msg.title}
                        </div>
                        <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                          {msg.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-400 text-center">
                All dispatched messages are securely written to user notifications.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: CATERING SERVICES MODERATION                             */}
      {/* ============================================================== */}
      {activeTab === 'catering' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200">
            <div>
              <h3 className="font-serif-title font-bold text-base text-stone-900">
                Verified Catering Partners Directory ({caterers.length})
              </h3>
              <p className="text-xs text-stone-500">
                Audit catering kitchen addresses, per-plate menus, direct phone numbers, and verify authenticity.
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentView('catering');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-[#E8590C] hover:bg-[#D9480F] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Open Catering Slot
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caterers.map(caterer => (
              <div key={caterer.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img src={caterer.logo || caterer.avatar} alt={caterer.businessName} className="w-14 h-14 rounded-xl object-cover ring-1 ring-stone-200 bg-amber-50" />
                    <div>
                      <h4 className="font-serif-title font-bold text-base text-stone-900">{caterer.businessName}</h4>
                      <div className="text-xs text-stone-500">Owner: {caterer.ownerName} · {caterer.experienceYears} Years Exp</div>
                      <div className="text-xs text-stone-600 font-semibold">{caterer.city}, {caterer.state}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleCatererVerified(caterer)}
                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                      caterer.verified
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {caterer.verified ? '✓ Verified Partner' : 'Unverified'}
                  </button>
                </div>

                <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 space-y-1">
                  <div><strong>Address:</strong> {caterer.address}</div>
                  <div className="flex justify-between">
                    <span><strong>Phone:</strong> {caterer.phone}</span>
                    <span className="text-[#E8590C] font-bold">{caterer.pricePerPlateRange}</span>
                  </div>
                  <div><strong>Curated Packages:</strong> {caterer.menuPackages.length} Packages Configured</div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-stone-400 font-mono">ID: {caterer.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleCatererVerified(caterer)}
                      className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      {caterer.verified ? 'Revoke Badge' : 'Grant Verified Badge'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: HOMEMADE KITCHENS MODERATION                             */}
      {/* ============================================================== */}
      {activeTab === 'homemade' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200">
            <div>
              <h3 className="font-serif-title font-bold text-base text-stone-900">
                Certified Home Kitchens &amp; Tiffins ({homemadeBusinesses.length})
              </h3>
              <p className="text-xs text-stone-500">
                Monitor local home chefs, tiffin subscriptions, delivery radiuses, and direct contact details.
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentView('homemade');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Open Homemade Slot
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homemadeBusinesses.map(kitchen => (
              <div key={kitchen.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img src={kitchen.logo || kitchen.avatar} alt={kitchen.businessName} className="w-14 h-14 rounded-xl object-cover ring-1 ring-emerald-200 bg-emerald-50" />
                    <div>
                      <h4 className="font-serif-title font-bold text-base text-stone-900">{kitchen.businessName}</h4>
                      <div className="text-xs text-stone-500">Home Chef: {kitchen.chefName} · {kitchen.dietaryType}</div>
                      <div className="text-xs text-stone-600 font-semibold">{kitchen.city}, {kitchen.state}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleHomemadeVerified(kitchen)}
                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                      kitchen.verified
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {kitchen.verified ? '✓ Certified Kitchen' : 'Unverified'}
                  </button>
                </div>

                <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 space-y-1">
                  <div><strong>Locality:</strong> {kitchen.address}</div>
                  <div><strong>Service Area:</strong> {kitchen.deliveryArea}</div>
                  <div className="flex justify-between">
                    <span><strong>Phone:</strong> {kitchen.phone}</span>
                    <span className="text-emerald-700 font-bold">{kitchen.serviceType}</span>
                  </div>
                  <div><strong>Active Menu Items:</strong> {kitchen.menuItems.length} Dishes Listed</div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-stone-400 font-mono">ID: {kitchen.id}</span>
                  <button
                    onClick={() => handleToggleHomemadeVerified(kitchen)}
                    className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    {kitchen.verified ? 'Revoke Certification' : 'Grant Verified Certification'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: HOTELS, RESTAURANTS & DHABAS MODERATION                  */}
      {activeTab === 'hotels' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200">
            <div>
              <h3 className="font-serif-title font-bold text-base text-stone-900">
                Hotels, Heritage Havelis &amp; Dhabas Directory ({hotelsAndRestaurants.length})
              </h3>
              <p className="text-xs text-stone-500">
                Manage commercial dining partners, menu card uploads, chef specialities, and table reservation slots.
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentView('hotel-restaurant');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-[#E8590C] hover:bg-[#D9480F] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Open Hotels &amp; Restaurants Slot
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotelsAndRestaurants.map(venue => (
              <div key={venue.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img src={venue.logo || venue.avatar} alt={venue.businessName} className="w-14 h-14 rounded-xl object-cover ring-1 ring-amber-200 bg-amber-50" />
                    <div>
                      <h4 className="font-serif-title font-bold text-base text-stone-900">{venue.businessName}</h4>
                      <div className="text-xs text-stone-500">{venue.restaurantType} · {venue.dietaryType}</div>
                      <div className="text-xs text-stone-600 font-semibold">{venue.city}, {venue.state}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleHotelVerified(venue)}
                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                      venue.verified
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {venue.verified ? '✓ Verified Venue' : 'Unverified'}
                  </button>
                </div>

                <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 space-y-1">
                  <div><strong>Address:</strong> {venue.address}</div>
                  <div><strong>Master / Chef:</strong> {venue.ownerOrChefName}</div>
                  <div className="flex justify-between">
                    <span><strong>Phone:</strong> {venue.phone}</span>
                    <span className="font-bold text-amber-900">{venue.averageCostForTwo}</span>
                  </div>
                  <div><strong>Specialities:</strong> {venue.specialities.join(', ')}</div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-stone-400 font-mono">ID: {venue.id}</span>
                  <button
                    onClick={() => handleToggleHotelVerified(venue)}
                    className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    {venue.verified ? 'Revoke Status' : 'Grant Verified Venue Status'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: CREATOR CHANNELS                                         */}
      {/* ============================================================== */}
      {activeTab === 'creators' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="font-serif-title font-bold text-base text-stone-900">
                Registered Food Creator Channels ({channels.length})
              </h3>
              <p className="text-xs text-stone-500">
                Manage verified creator handles, verified badges, and channel statuses.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {channels.map(channel => (
              <div key={channel.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-3">
                  <img src={channel.avatar} alt={channel.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400/40" />
                  <div>
                    <h4 className="font-serif-title font-bold text-base text-stone-900">{channel.name}</h4>
                    <div className="text-xs text-stone-500 font-mono">@{channel.username}</div>
                    <div className="text-xs text-stone-600 font-semibold">{channel.state} · {channel.speciality}</div>
                  </div>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 italic">
                  "{channel.description}"
                </p>

                <div className="flex items-center justify-between border-t border-stone-100 pt-2 text-xs">
                  <span className="text-stone-500 font-medium">Preferred: {channel.preferredLanguage}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        verifyCreatorChannel(channel.id, !channel.isVerified);
                        showToast(`Creator channel verification updated!`);
                      }}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-bold text-xs cursor-pointer"
                    >
                      {channel.isVerified ? 'Verified Creator' : 'Verify Channel'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 7: TRANSACTIONS & INVOICE LEDGER                            */}
      {/* ============================================================== */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif-title font-bold text-base text-stone-900">
                Subscription Transactions &amp; Invoices Ledger
              </h3>
              <p className="text-xs text-stone-500">
                Official UPI, Card, and NetBanking billing records with computerized PDF payment receipts.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                100% Verified Billing Records
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6F0] border-b border-stone-200 text-stone-700 uppercase font-black tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5 pl-5">Order ID &amp; Date</th>
                    <th className="p-3.5">Subscriber</th>
                    <th className="p-3.5">Plan Tier</th>
                    <th className="p-3.5">Amount Paid</th>
                    <th className="p-3.5">Channel / Gateway</th>
                    <th className="p-3.5">UTR / Payment Ref</th>
                    <th className="p-3.5 pr-5 text-right">Payment Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono">
                  {transactions.map(txn => (
                    <tr key={txn.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="p-3.5 pl-5">
                        <div className="font-bold text-stone-900 font-sans">{txn.orderId}</div>
                        <div className="text-[11px] text-stone-400 font-mono">{txn.date}</div>
                      </td>
                      <td className="p-3.5 font-sans">
                        <div className="font-bold text-stone-900">{txn.customerName}</div>
                        <div className="text-[11px] text-stone-500 font-mono">{txn.customerEmail}</div>
                      </td>
                      <td className="p-3.5 font-sans">
                        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold text-[11px]">
                          {txn.planName}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-black text-emerald-700 text-sm">₹{txn.amount}.00</div>
                        <div className="text-[10px] text-stone-400 font-sans">INR Net</div>
                      </td>
                      <td className="p-3.5 font-sans">
                        <span className="font-semibold text-stone-700">{txn.method}</span>
                      </td>
                      <td className="p-3.5 font-mono text-stone-600">
                        {txn.utr}
                      </td>
                      <td className="p-3.5 pr-5 text-right font-sans">
                        <button
                          type="button"
                          onClick={() => handleViewInvoice(txn)}
                          className="px-3 py-1.5 bg-[#E8590C] hover:bg-[#D9480F] text-white rounded-xl text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View PDF Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 8: SYSTEM SETTINGS                                          */}
      {/* ============================================================== */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6 max-w-3xl">
          <div className="space-y-1">
            <h3 className="font-serif-title font-bold text-lg text-stone-900">
              Taste of India System Configuration
            </h3>
            <p className="text-xs text-stone-500">
              Manage platform parameters, editorial credentials, and payment beneficiary routing.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <label className="block font-bold text-stone-800">Verified Support Email</label>
              <input
                type="text"
                disabled
                value="tasteofindia.support@gmail.com"
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium text-stone-700"
              />
              <span className="text-[11px] text-stone-500">
                Official editorial inquiries and user support email displayed globally in the footer and billing receipts.
              </span>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <label className="block font-bold text-stone-800">Primary Beneficiary UPI VPA</label>
              <input
                type="text"
                disabled
                value="yogeshwaran0411-1@okaxis"
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-mono text-stone-800 font-bold"
              />
              <span className="text-[11px] text-stone-500">
                Official merchant UPI handle verified for real-time QR generation across GPay, PhonePe, and Paytm.
              </span>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <label className="block font-bold text-stone-800">Editorial Headquarters Address</label>
              <textarea
                disabled
                rows={2}
                value="Eswaran Kovil Street Nedungundram Chennai - 600127, Tamil Nadu, Bharat"
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium text-stone-700"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-stone-200">
              <span className="text-xs text-stone-500">Database Status: In-Memory + Local Storage Sync Active</span>
              <button
                type="button"
                onClick={() => showToast('Platform configuration validated and active.')}
                className="px-4 py-2 bg-[#2B1B17] hover:bg-black text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalRecipe && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Reject Recipe Submission</span>
              </div>
              <button
                onClick={() => setRejectModalRecipe(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Please provide feedback for <strong>"{rejectModalRecipe.title}"</strong> by <strong>{rejectModalRecipe.creator.name}</strong>.
            </p>

            <textarea
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              rows={3}
              className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              placeholder="Explain why the recipe was not approved..."
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalRecipe(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Delete User Recipe Modal with Reason and Author Notification */}
      {recipeToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-red-200 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                <Trash2 className="w-4 h-4" />
                <span>Admin Delete Recipe: Confirmation &amp; Audit</span>
              </div>
              <button
                type="button"
                onClick={() => setRecipeToDelete(null)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Recipe Info Summary */}
            <div className="p-3 bg-red-50/60 rounded-2xl border border-red-100 flex items-center gap-3">
              <img
                src={recipeToDelete.image}
                alt={recipeToDelete.title}
                className="w-14 h-14 rounded-xl object-cover ring-1 ring-red-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-stone-900 truncate">{recipeToDelete.title}</h4>
                <div className="text-xs text-stone-600">
                  Author: <strong>{recipeToDelete.creator.name}</strong> (@{recipeToDelete.creator.username || 'creator'})
                </div>
                <div className="text-[11px] text-stone-500 font-mono">
                  {recipeToDelete.category} · {recipeToDelete.state} · ID: {recipeToDelete.id.slice(0, 14)}
                </div>
              </div>
            </div>

            {/* Deletion Reason */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Reason for Deletion *
                </label>
                <select
                  value={deleteReason}
                  onChange={e => setDeleteReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:border-red-500"
                >
                  <option value="Violation of authentic regional culinary standards and guidelines">
                    Violation of authentic regional culinary standards and guidelines
                  </option>
                  <option value="Inaccurate or incomplete cooking steps and ingredient measurements">
                    Inaccurate or incomplete cooking steps and ingredient measurements
                  </option>
                  <option value="Duplicate submission of an existing catalog recipe">
                    Duplicate submission of an existing catalog recipe
                  </option>
                  <option value="Copyright or inappropriate imagery violation">
                    Copyright or inappropriate imagery violation
                  </option>
                  <option value="Author requested deletion or administrative cleanup">
                    Author requested deletion or administrative cleanup
                  </option>
                  <option value="Other specific reason">Other specific reason (type below)</option>
                </select>
              </div>

              {deleteReason === 'Other specific reason' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Specify Custom Deletion Reason *
                  </label>
                  <input
                    type="text"
                    required
                    value={customDeleteReason}
                    onChange={e => setCustomDeleteReason(e.target.value)}
                    placeholder="e.g. Reported by community members for misleading proportions..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50"
                  />
                </div>
              )}

              {/* Notify Author Checkbox */}
              <label className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer text-xs font-medium text-stone-800">
                <input
                  type="checkbox"
                  checked={notifyAuthorOnDelete}
                  onChange={e => setNotifyAuthorOnDelete(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span>Send official Admin Deletion Notice with reason to author's inbox</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setRecipeToDelete(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteRecipe}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Permanently Delete Recipe</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Quick Message User Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-sky-200 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
                <Mail className="w-4 h-4 text-sky-600" />
                <span>Send Admin Message to User</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMessageModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendAdminMessageSubmit} className="space-y-4">
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs">
                <span className="text-stone-500">Recipient: </span>
                <strong className="text-sky-950 font-bold">{messageRecipientName}</strong>
                {messageRecipientEmail && (
                  <span className="text-stone-500 font-mono"> ({messageRecipientEmail})</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Notice Category</label>
                <select
                  value={messageCategory}
                  onChange={e => setMessageCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50"
                >
                  <option value="Editorial Notice">Editorial Notice</option>
                  <option value="Recipe Feedback">Recipe Feedback</option>
                  <option value="Content Moderation">Content Moderation</option>
                  <option value="Editorial Recognition">Editorial Recognition</option>
                  <option value="Verification Status">Verification Status</option>
                  <option value="Community Announcement">Community Announcement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Subject / Title *</label>
                <input
                  type="text"
                  required
                  value={messageSubject}
                  onChange={e => setMessageSubject(e.target.value)}
                  placeholder="Enter message subject..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Message Content *</label>
                <textarea
                  rows={4}
                  required
                  value={messageBody}
                  onChange={e => setMessageBody(e.target.value)}
                  placeholder="Enter your administrative message or guidance..."
                  className="w-full p-3 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-sky-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* BAN USER RESTRICTION CONFIRMATION MODAL                         */}
      {/* ============================================================== */}
      {userToBan && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <Ban className="w-4 h-4 text-rose-600" />
                <span>Ban User &amp; Restrict Recipe Privileges</span>
              </div>
              <button
                type="button"
                onClick={() => setUserToBan(null)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target User Info Card */}
            <div className="flex items-center gap-3 p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl">
              <img
                src={userToBan.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                alt={userToBan.name}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-rose-300 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-stone-900 truncate">{userToBan.name}</h4>
                <div className="text-xs text-rose-800 font-mono">@{userToBan.username} · {userToBan.email}</div>
              </div>
            </div>

            {/* Restriction Warning Banner */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Enforced Recipe Privileges Restriction:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                Banning this user will <strong>immediately block them from creating any new recipes</strong> and <strong>block them from deleting any existing recipes</strong> on the platform.
              </p>
            </div>

            {/* Reason Presets */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">Preset Moderation Reason:</label>
              <select
                onChange={e => setBanReason(e.target.value)}
                value={banReason}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50"
              >
                <option value="Violation of authentic regional culinary standards and recipe submission guidelines.">
                  Culinary Standards Violation
                </option>
                <option value="Repeated submission of inaccurate, spam, or copyrighted recipe steps.">
                  Spam / Copyright Violation
                </option>
                <option value="Malicious or unauthorized recipe deletion attempts.">
                  Unauthorized Deletion Attempts
                </option>
                <option value="Inappropriate language, defamatory comments, or misleading nutritional claims.">
                  Inappropriate Content / Conduct
                </option>
                <option value="Account suspended pending formal community review.">
                  Suspension Pending Review
                </option>
              </select>
            </div>

            {/* Custom Reason Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">Ban Rationale / Custom Note:</label>
              <textarea
                rows={3}
                value={banReason}
                onChange={e => setBanReason(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-rose-500 leading-relaxed"
                placeholder="Explain the reason for restricting this user..."
              />
            </div>

            {/* Send Notice Checkbox */}
            <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={notifyUserOnBan}
                onChange={e => setNotifyUserOnBan(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <span>Send official Administrative Restriction Notice to user's inbox</span>
            </label>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setUserToBan(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (userToBan) {
                    banUser(userToBan.id, banReason, notifyUserOnBan);
                    setUserToBan(null);
                  }
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Confirm Ban &amp; Restrict User</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
