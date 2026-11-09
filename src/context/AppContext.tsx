import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Recipe, 
  User, 
  IndianState, 
  LanguageCode, 
  SubscriptionPlanId, 
  CreatorChannel, 
  CookingVideo, 
  CreatorNotification, 
  Comment,
  CateringProfile,
  HomemadeFoodProfile,
  HotelRestaurantProfile,
  InvoiceData,
  ActiveSubscriptionRecord,
  AdminSentMessage
} from '../types';
import { SUBSCRIPTION_PLANS } from '../data/subscriptions';
import { ALL_INITIAL_RECIPES } from '../data/recipes';
import { INDIAN_STATES_AND_UTS } from '../data/states';
import { TRANSLATIONS } from '../data/translations';
import { INITIAL_CHANNELS, INITIAL_VIDEOS, INITIAL_NOTIFICATIONS } from '../data/creatorChannels';
import { INITIAL_CATERING_PROFILES, INITIAL_HOMEMADE_PROFILES, INITIAL_HOTEL_RESTAURANT_PROFILES } from '../data/cateringAndHomemade';

export type AppView = 
  | 'home'
  | 'explore'
  | 'peoples-recipes'
  | 'catering'
  | 'homemade'
  | 'hotel-restaurant'
  | 'states'
  | 'state-detail'
  | 'categories'
  | 'category-detail'
  | 'community'
  | 'creators'
  | 'channel'
  | 'creator-studio'
  | 'following-feed'
  | 'videos'
  | 'premium'
  | 'share-recipe'
  | 'kitchen-finder'
  | 'budget'
  | 'meal-planner'
  | 'festivals'
  | 'dashboard'
  | 'admin'
  | 'static-page';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedState: IndianState | null;
  setSelectedState: (state: IndianState | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  staticPageId: string | null;
  setStaticPageId: (page: string | null) => void;
  
  // Recipes & Data
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  likeRecipe: (recipeId: string) => void;
  saveRecipe: (recipeId: string) => void;
  addComment: (recipeId: string, text: string, rating: number) => void;
  addNewRecipe: (recipeData: Partial<Recipe>) => Recipe;
  updateRecipe: (recipeId: string, updatedData: Partial<Recipe>) => Recipe | null;
  editingRecipe: Recipe | null;
  setEditingRecipe: (recipe: Recipe | null) => void;
  openEditRecipe: (recipe: Recipe) => void;
  moderateRecipe: (recipeId: string, status: 'approved' | 'rejected', reason?: string) => void;
  deleteRecipe: (recipeId: string, reason?: string, notifyAuthor?: boolean) => void;

  // Registered Users & Admin Communications
  usersRegistry: User[];
  setUsersRegistry: React.Dispatch<React.SetStateAction<User[]>>;
  banUser: (userId: string, reason?: string, notifyUser?: boolean) => void;
  unbanUser: (userId: string) => void;
  adminSentMessages: AdminSentMessage[];
  setAdminSentMessages: React.Dispatch<React.SetStateAction<AdminSentMessage[]>>;
  sendAdminMessage: (data: {
    recipientUserId: string;
    recipientName?: string;
    recipientEmail?: string;
    title: string;
    message: string;
    category?: string;
  }) => void;

  // Creator Channels System
  channels: CreatorChannel[];
  setChannels: React.Dispatch<React.SetStateAction<CreatorChannel[]>>;
  selectedChannelUsername: string | null;
  setSelectedChannelUsername: (username: string | null) => void;
  openChannel: (username: string) => void;
  createChannel: (channelData: Partial<CreatorChannel>) => CreatorChannel;
  updateChannel: (channelId: string, channelData: Partial<CreatorChannel>) => void;
  followChannel: (channelId: string) => void;
  unfollowChannel: (channelId: string) => void;
  isFollowingChannel: (channelId: string) => boolean;
  verifyCreatorChannel: (channelId: string, isVerified: boolean, reason?: string) => void;
  suspendCreatorChannel: (channelId: string, isSuspended: boolean) => void;

  // Cooking Videos System
  cookingVideos: CookingVideo[];
  setCookingVideos: React.Dispatch<React.SetStateAction<CookingVideo[]>>;
  selectedVideo: CookingVideo | null;
  setSelectedVideo: (video: CookingVideo | null) => void;
  addCookingVideo: (videoData: Partial<CookingVideo>) => CookingVideo;
  moderateVideo: (videoId: string, status: 'approved' | 'rejected', reason?: string) => void;
  likeVideo: (videoId: string) => void;
  addVideoComment: (videoId: string, text: string) => void;
  deleteVideo: (videoId: string) => void;

  // Notifications
  notifications: CreatorNotification[];
  markNotificationRead: (id: string) => void;
  addNotification: (notif: Omit<CreatorNotification, 'id' | 'createdAt'>) => void;

  // Catering Services & Homemade Food Business Slots
  caterers: CateringProfile[];
  setCaterers: React.Dispatch<React.SetStateAction<CateringProfile[]>>;
  selectedCaterer: CateringProfile | null;
  setSelectedCaterer: (caterer: CateringProfile | null) => void;
  addCateringProfile: (profile: Partial<CateringProfile>) => CateringProfile;
  updateCateringProfile: (catererId: string, updatedData: Partial<CateringProfile>) => void;
  homemadeBusinesses: HomemadeFoodProfile[];
  setHomemadeBusinesses: React.Dispatch<React.SetStateAction<HomemadeFoodProfile[]>>;
  selectedHomemade: HomemadeFoodProfile | null;
  setSelectedHomemade: (business: HomemadeFoodProfile | null) => void;
  addHomemadeProfile: (profile: Partial<HomemadeFoodProfile>) => HomemadeFoodProfile;
  updateHomemadeProfile: (businessId: string, updatedData: Partial<HomemadeFoodProfile>) => void;

  // Hotel & Restaurant Slot
  hotelsAndRestaurants: HotelRestaurantProfile[];
  setHotelsAndRestaurants: React.Dispatch<React.SetStateAction<HotelRestaurantProfile[]>>;
  selectedHotelRestaurant: HotelRestaurantProfile | null;
  setSelectedHotelRestaurant: (profile: HotelRestaurantProfile | null) => void;
  addHotelRestaurantProfile: (profile: Partial<HotelRestaurantProfile>) => HotelRestaurantProfile;
  updateHotelRestaurantProfile: (restaurantId: string, updatedData: Partial<HotelRestaurantProfile>) => void;

  activeUploadBusinessType: 'standard' | 'catering' | 'homemade' | 'hotel_restaurant';
  setActiveUploadBusinessType: (type: 'standard' | 'catering' | 'homemade' | 'hotel_restaurant') => void;
  isCreateBusinessModalOpen: boolean;
  setIsCreateBusinessModalOpen: (open: boolean) => void;
  businessModalType: 'catering' | 'homemade' | 'hotel_restaurant';
  setBusinessModalType: (type: 'catering' | 'homemade' | 'hotel_restaurant') => void;
  openCreateBusinessAccount: (type: 'catering' | 'homemade' | 'hotel_restaurant') => void;
  editingBusinessProfile: { type: 'catering' | 'homemade' | 'hotel_restaurant'; profile: any } | null;
  setEditingBusinessProfile: React.Dispatch<React.SetStateAction<{ type: 'catering' | 'homemade' | 'hotel_restaurant'; profile: any } | null>>;
  openEditBusinessProfile: (type: 'catering' | 'homemade' | 'hotel_restaurant', profile: any) => void;
  prefilledBusinessData: any;
  setPrefilledBusinessData: React.Dispatch<React.SetStateAction<any>>;

  // Invoice PDF Modal
  isInvoiceModalOpen: boolean;
  setIsInvoiceModalOpen: (open: boolean) => void;
  invoiceData: InvoiceData | null;
  setInvoiceData: (data: InvoiceData | null) => void;
  openInvoiceModal: (data?: Partial<InvoiceData>) => void;

  // Modals & UI Controls
  isCreateChannelModalOpen: boolean;
  setIsCreateChannelModalOpen: (open: boolean) => void;

  // User & Auth
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, role?: 'user' | 'admin') => boolean;
  register: (name: string, email: string) => boolean;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  activateSubscription: (planId: SubscriptionPlanId, durationMonths: number, paymentId: string) => void;
  activeSubscription: ActiveSubscriptionRecord | null;
  activeSubscriptions: ActiveSubscriptionRecord[];
  checkUserSubscription: (emailOrUserId: string) => ActiveSubscriptionRecord | null;

  // Language
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: typeof TRANSLATIONS['en'];

  // Modals & UI
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isPremiumModalOpen: boolean;
  setIsPremiumModalOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  selectedPaymentPlan: SubscriptionPlanId;
  setSelectedPaymentPlan: (plan: SubscriptionPlanId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_RECIPES_KEY = 'tob_recipes_v7';
const LOCAL_STORAGE_USER_KEY = 'tob_user_v3';
const LOCAL_STORAGE_CHANNELS_KEY = 'tob_channels_v2';
const LOCAL_STORAGE_VIDEOS_KEY = 'tob_videos_v2';
const LOCAL_STORAGE_NOTIFS_KEY = 'tob_notifs_v2';
const LOCAL_STORAGE_CATERERS_KEY = 'toi_caterers_v2';
const LOCAL_STORAGE_HOMEMADE_KEY = 'toi_homemade_v2';
const LOCAL_STORAGE_HOTEL_RESTAURANT_KEY = 'toi_hotels_restaurants_v2';
const LOCAL_STORAGE_USERS_REGISTRY_KEY = 'toi_registered_accounts_v3';
const LOCAL_STORAGE_SUBSCRIPTIONS_REGISTRY_KEY = 'toi_active_subscriptions_v3';

const INITIAL_ACTIVE_SUBSCRIPTIONS: ActiveSubscriptionRecord[] = [
  {
    subscriptionId: 'sub_seed_priya_2026',
    userEmail: 'priya.sharma@example.com',
    userId: 'user-demo-member',
    userName: 'Priya Sharma',
    planId: 'quarterly',
    planName: 'Quarterly Pass',
    durationMonths: 3,
    amount: 49,
    startDate: '2026-09-01T10:00:00.000Z',
    expiryDate: '2027-04-15T12:00:00.000Z',
    status: 'active',
    paymentRef: 'upi_pay_priya_pass',
    lastVerifiedAt: new Date().toISOString()
  },
  {
    subscriptionId: 'sub_seed_admin_2026',
    userEmail: 'admin@tasteofindia.com',
    userId: 'user-admin-master',
    userName: 'Chef Vikramaditya (Admin Curator)',
    planId: 'yearly',
    planName: 'Annual Pass',
    durationMonths: 12,
    amount: 149,
    startDate: '2026-01-01T10:00:00.000Z',
    expiryDate: '2028-12-31T23:59:59.000Z',
    status: 'active',
    paymentRef: 'upi_pay_admin_curator',
    lastVerifiedAt: new Date().toISOString()
  },
  {
    subscriptionId: 'sub_seed_meenakshi_2026',
    userEmail: 'chettinad_heritage@example.com',
    userId: 'user-creator-meenakshi',
    userName: 'Chef Meenakshi Sundaram',
    planId: 'yearly',
    planName: 'Annual Pass',
    durationMonths: 12,
    amount: 149,
    startDate: '2026-01-01T10:00:00.000Z',
    expiryDate: '2027-12-31T23:59:59.000Z',
    status: 'active',
    paymentRef: 'upi_pay_meenakshi_pass',
    lastVerifiedAt: new Date().toISOString()
  },
  {
    subscriptionId: 'sub_seed_owner_2026',
    userEmail: 'yogeshwaran0411@gmail.com',
    userId: 'user-owner-yogesh',
    userName: 'Yogeshwaran',
    planId: 'yearly',
    planName: 'Annual Heritage Pass',
    durationMonths: 12,
    amount: 149,
    startDate: '2026-01-01T10:00:00.000Z',
    expiryDate: '2028-12-31T23:59:59.000Z',
    status: 'active',
    paymentRef: 'upi_pay_yogesh_verified',
    lastVerifiedAt: new Date().toISOString()
  }
];

const INITIAL_USERS_REGISTRY: User[] = [
  {
    id: 'user-demo-member',
    name: 'Priya Sharma',
    username: 'priya_cooks',
    email: 'priya.sharma@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    bio: 'Home culinary explorer from Bengaluru. Passionate about authentic South Indian breakfasts and festive mithai.',
    location: 'Bengaluru, Karnataka',
    role: 'user',
    isPremium: true,
    premiumExpiry: '2027-04-15T12:00:00.000Z',
    plan: 'quarterly',
    followers: 840,
    following: 19,
    savedRecipeIds: ['recipe-1', 'recipe-2'],
    uploadedRecipeIds: [],
    downloadedRecipeIds: ['recipe-2'],
    followingCreatorIds: ['channel-meenakshi', 'channel-amrit'],
    channelId: 'channel-priya',
    channelUsername: 'priya_rasoi',
    hasChannel: true,
    createdAt: '2026-09-01'
  },
  {
    id: 'user-admin-master',
    name: 'Chef Vikramaditya (Admin Curator)',
    username: 'vikram_curator',
    email: 'admin@tasteofindia.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Chief Culinary Curator at TASTE OF INDIA. Preserving authentic regional recipes.',
    location: 'New Delhi & Chennai',
    role: 'admin',
    isPremium: true,
    premiumExpiry: '2028-12-31T23:59:59.000Z',
    plan: 'yearly',
    followers: 12400,
    following: 24,
    savedRecipeIds: ['recipe-1', 'recipe-3'],
    uploadedRecipeIds: [],
    downloadedRecipeIds: ['recipe-1'],
    followingCreatorIds: ['channel-meenakshi', 'channel-amrit'],
    channelId: 'channel-meenakshi',
    channelUsername: 'chettinad_heritage',
    hasChannel: true,
    createdAt: '2026-01-10'
  },
  {
    id: 'user-creator-meenakshi',
    name: 'Chef Meenakshi Sundaram',
    username: 'chettinad_heritage',
    email: 'chettinad_heritage@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    bio: 'Chettinad spice master, traditional clay pot cook, preserving heritage stone-ground recipes.',
    location: 'Karaikudi, Tamil Nadu',
    role: 'user',
    isPremium: true,
    premiumExpiry: '2027-12-31T23:59:59.000Z',
    plan: 'yearly',
    followers: 4820,
    following: 12,
    savedRecipeIds: ['recipe-1', 'recipe-2'],
    uploadedRecipeIds: [],
    downloadedRecipeIds: ['recipe-1'],
    followingCreatorIds: ['channel-amrit'],
    channelId: 'channel-meenakshi',
    channelUsername: 'chettinad_heritage',
    hasChannel: true,
    createdAt: '2026-02-14'
  },
  {
    id: 'user-owner-yogesh',
    name: 'Yogeshwaran',
    username: 'yogeshwaran0411',
    email: 'yogeshwaran0411@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Founder & Heritage Food Enthusiast at TASTE OF INDIA.',
    location: 'Chennai, Tamil Nadu',
    role: 'admin',
    isPremium: true,
    premiumExpiry: '2028-12-31T23:59:59.000Z',
    plan: 'yearly',
    followers: 1540,
    following: 32,
    savedRecipeIds: ['recipe-1', 'recipe-2', 'recipe-3'],
    uploadedRecipeIds: [],
    downloadedRecipeIds: ['recipe-1', 'recipe-2'],
    followingCreatorIds: ['channel-meenakshi', 'channel-priya'],
    hasChannel: false,
    createdAt: '2026-01-01'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedState, setSelectedState] = useState<IndianState | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [staticPageId, setStaticPageId] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Catering, Homemade & Hotel/Restaurant slots state
  const [selectedCaterer, setSelectedCaterer] = useState<CateringProfile | null>(null);
  const [selectedHomemade, setSelectedHomemade] = useState<HomemadeFoodProfile | null>(null);
  const [selectedHotelRestaurant, setSelectedHotelRestaurant] = useState<HotelRestaurantProfile | null>(null);
  const [activeUploadBusinessType, setActiveUploadBusinessType] = useState<'standard' | 'catering' | 'homemade' | 'hotel_restaurant'>('standard');
  const [isCreateBusinessModalOpen, setIsCreateBusinessModalOpen] = useState(false);
  const [businessModalType, setBusinessModalType] = useState<'catering' | 'homemade' | 'hotel_restaurant'>('catering');
  const [editingBusinessProfile, setEditingBusinessProfile] = useState<{ type: 'catering' | 'homemade' | 'hotel_restaurant'; profile: any } | null>(null);
  const [prefilledBusinessData, setPrefilledBusinessData] = useState<any>(null);

  const openCreateBusinessAccount = (type: 'catering' | 'homemade' | 'hotel_restaurant') => {
    setEditingBusinessProfile(null);
    setBusinessModalType(type);
    setIsCreateBusinessModalOpen(true);
  };

  const openEditBusinessProfile = (type: 'catering' | 'homemade' | 'hotel_restaurant', profile: any) => {
    if (!currentUser) {
      showToast('Creator Account Access Only: Please sign in to edit your business profile.');
      setIsAuthModalOpen(true);
      return;
    }

    const isCreatorUser = Boolean(currentUser.hasChannel || currentUser.isCreator || currentUser.role === 'admin');
    const isOwnerMatch = Boolean(
      (profile.ownerName && profile.ownerName.toLowerCase().includes(currentUser.name.toLowerCase())) ||
      (profile.chefName && profile.chefName.toLowerCase().includes(currentUser.name.toLowerCase())) ||
      (profile.ownerOrChefName && profile.ownerOrChefName.toLowerCase().includes(currentUser.name.toLowerCase()))
    );

    if (!isCreatorUser && !isOwnerMatch) {
      showToast('Creator Account Access Only: You must be a verified Creator or Business Owner to edit profiles.');
      return;
    }

    setEditingBusinessProfile({ type, profile });
    setBusinessModalType(type);
    setIsCreateBusinessModalOpen(true);
  };

  // Invoice Modal State
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const openInvoiceModal = (customData?: Partial<InvoiceData>) => {
    const defaultInvoice: InvoiceData = {
      invoiceNumber: customData?.invoiceNumber || `INV-TOI-${Date.now().toString().slice(-6)}`,
      date: customData?.date || new Date().toISOString().split('T')[0],
      customerName: customData?.customerName || currentUser?.name || 'Priya Sharma',
      customerEmail: customData?.customerEmail || currentUser?.email || 'priya.sharma@example.com',
      planName: customData?.planName || 'Taste of India Heritage Explorer Pass',
      durationText: customData?.durationText || 'Annual Pass (12 Months)',
      amount: customData?.amount !== undefined ? customData.amount : 449,
      paymentMethod: customData?.paymentMethod || 'UPI (Axis Bank / Google Pay)',
      transactionId: customData?.transactionId || `TXN-TOI-${Date.now().toString().slice(-8)}`,
      validUntil: customData?.validUntil || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'PAID',
      supportEmail: 'tasteofindia.support@gmail.com',
      editorialOffice: 'Eswaran Kovil Street Nedungundram Chennai - 600127'
    };
    setInvoiceData(defaultInvoice);
    setIsInvoiceModalOpen(true);
  };

  // Channel & Video state
  const [selectedChannelUsername, setSelectedChannelUsername] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<CookingVideo | null>(null);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<SubscriptionPlanId>('quarterly');
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const openEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
  };

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Recipes State
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_RECIPES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return ALL_INITIAL_RECIPES;
  });

  // Creator Channels State
  const [channels, setChannels] = useState<CreatorChannel[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CHANNELS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_CHANNELS;
  });

  // Cooking Videos State
  const [cookingVideos, setCookingVideos] = useState<CookingVideo[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_VIDEOS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_VIDEOS;
  });

  // Notifications State
  const [notifications, setNotifications] = useState<CreatorNotification[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_NOTIFS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Catering Profiles State (Dedicated Slot)
  const [caterers, setCaterers] = useState<CateringProfile[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CATERERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_CATERING_PROFILES;
  });

  // Homemade Food Profiles State (Dedicated Slot)
  const [homemadeBusinesses, setHomemadeBusinesses] = useState<HomemadeFoodProfile[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HOMEMADE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_HOMEMADE_PROFILES;
  });

  // Hotel & Restaurant Profiles State (Dedicated Slot)
  const [hotelsAndRestaurants, setHotelsAndRestaurants] = useState<HotelRestaurantProfile[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HOTEL_RESTAURANT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_HOTEL_RESTAURANT_PROFILES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CATERERS_KEY, JSON.stringify(caterers));
    } catch {}
  }, [caterers]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_HOMEMADE_KEY, JSON.stringify(homemadeBusinesses));
    } catch {}
  }, [homemadeBusinesses]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_HOTEL_RESTAURANT_KEY, JSON.stringify(hotelsAndRestaurants));
    } catch {}
  }, [hotelsAndRestaurants]);

  // Active Subscriptions Persistent Store
  const [activeSubscriptions, setActiveSubscriptions] = useState<ActiveSubscriptionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTIONS_REGISTRY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ACTIVE_SUBSCRIPTIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTIONS_REGISTRY_KEY, JSON.stringify(activeSubscriptions));
    } catch (e) {
      console.warn('Storage quota error for subscriptions registry', e);
    }
  }, [activeSubscriptions]);

  // Registered Users Persistent Registry
  const [usersRegistry, setUsersRegistry] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USERS_REGISTRY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_USERS_REGISTRY;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_USERS_REGISTRY_KEY, JSON.stringify(usersRegistry));
    } catch (e) {
      console.warn('Storage quota error for users registry', e);
    }
  }, [usersRegistry]);

  // Admin Sent Messages Communications Registry
  const LOCAL_STORAGE_ADMIN_MESSAGES_KEY = 'toi_admin_sent_messages_registry';

  const INITIAL_ADMIN_SENT_MESSAGES: AdminSentMessage[] = [
    {
      id: 'msg-admin-101',
      recipientUserId: 'user-demo-member',
      recipientName: 'Priya Sharma',
      recipientEmail: 'priya.sharma@example.com',
      title: 'Congratulations: Authentic Mysore Pak Featured on Homepage',
      message: 'Hello Priya, your festive Mysore Pak recipe has been selected by our editorial team for the featured regional carousel. Keep sharing authentic South Indian heirloom recipes!',
      category: 'Editorial Recognition',
      createdAt: '2026-11-08T10:30:00.000Z',
      delivered: true
    },
    {
      id: 'msg-admin-102',
      recipientUserId: 'user-creator-meenakshi',
      recipientName: 'Chef Meenakshi Sundaram',
      recipientEmail: 'chettinad_heritage@example.com',
      title: 'Chettinad Heritage Kitchen Certified Status Confirmed',
      message: 'Vanakkam Chef Meenakshi, your Chettinad Spice Master profile and catering slots have been fully verified with the Gold Verified Seal. Your video masterclasses are now live across India.',
      category: 'Verification Status',
      createdAt: '2026-11-07T16:15:00.000Z',
      delivered: true
    }
  ];

  const [adminSentMessages, setAdminSentMessages] = useState<AdminSentMessage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ADMIN_MESSAGES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ADMIN_SENT_MESSAGES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ADMIN_MESSAGES_KEY, JSON.stringify(adminSentMessages));
    } catch (e) {
      console.warn('Storage quota error for admin sent messages', e);
    }
  }, [adminSentMessages]);

  const sendAdminMessage = (data: {
    recipientUserId: string;
    recipientName?: string;
    recipientEmail?: string;
    title: string;
    message: string;
    category?: string;
  }) => {
    const isBroadcast = data.recipientUserId === 'all';
    const targetName = isBroadcast ? 'All Community Members' : (data.recipientName || 'Member');
    const categoryName = data.category || 'Editorial Notice';

    const newRecord: AdminSentMessage = {
      id: `msg-admin-${Date.now()}`,
      recipientUserId: data.recipientUserId,
      recipientName: targetName,
      recipientEmail: data.recipientEmail,
      title: data.title,
      message: data.message,
      category: categoryName,
      createdAt: new Date().toISOString(),
      delivered: true
    };

    setAdminSentMessages(prev => [newRecord, ...prev]);

    if (isBroadcast) {
      // Send notification to all users in registry
      usersRegistry.forEach(user => {
        addNotification({
          userId: user.id,
          type: 'announcement',
          title: `📢 Announcement: ${data.title}`,
          message: data.message,
          read: false,
          senderName: 'Master Editorial Admin',
          category: categoryName
        });
      });
    } else {
      // Send notification to the designated user
      addNotification({
        userId: data.recipientUserId,
        type: 'admin_message',
        title: `✉ Admin Message: ${data.title}`,
        message: data.message,
        read: false,
        senderName: 'Master Editorial Admin',
        category: categoryName
      });
    }

    showToast(`Admin message dispatched to ${targetName}!`);
  };

  // Ban User: Restricts user from creating or deleting recipes
  const banUser = (userId: string, reason?: string, notifyUser: boolean = true) => {
    const banReasonText = reason?.trim() || 'Account restricted by Editorial Administration for violating recipe guidelines.';
    const nowIso = new Date().toISOString();

    setUsersRegistry(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          isBanned: true,
          bannedReason: banReasonText,
          bannedAt: nowIso
        };
      }
      return u;
    }));

    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? {
        ...prev,
        isBanned: true,
        bannedReason: banReasonText,
        bannedAt: nowIso
      } : null);
    }

    if (notifyUser) {
      addNotification({
        userId,
        type: 'admin_message',
        title: 'Account Action: Recipe Privileges Restricted',
        message: `Your account has been restricted by Taste of India Editorial Administration. You are restricted from creating or deleting recipes.\n\nReason: ${banReasonText}`,
        read: false,
        senderName: 'Master Editorial Admin',
        category: 'Account Moderation'
      });
    }

    const targetUser = usersRegistry.find(u => u.id === userId);
    showToast(`User ${targetUser?.name || `@${targetUser?.username || userId}`} has been restricted from creating and deleting recipes.`);
  };

  const unbanUser = (userId: string) => {
    setUsersRegistry(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          isBanned: false,
          bannedReason: undefined,
          bannedAt: undefined
        };
      }
      return u;
    }));

    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? {
        ...prev,
        isBanned: false,
        bannedReason: undefined,
        bannedAt: undefined
      } : null);
    }

    addNotification({
      userId,
      type: 'admin_message',
      title: 'Account Action: Recipe Privileges Restored',
      message: 'Your account restrictions have been lifted by Editorial Administration. You are now free to create and manage recipes normally.',
      read: false,
      senderName: 'Master Editorial Admin',
      category: 'Account Moderation'
    });

    const targetUser = usersRegistry.find(u => u.id === userId);
    showToast(`Restrictions lifted for ${targetUser?.name || `@${targetUser?.username || userId}`}.`);
  };

  // Check if a user (by email or userId) has an active, running subscription plan
  const checkUserSubscription = (emailOrUserId: string): ActiveSubscriptionRecord | null => {
    if (!emailOrUserId) return null;
    const clean = emailOrUserId.trim().toLowerCase();
    const found = activeSubscriptions.find(s => 
      (s.userEmail.toLowerCase() === clean || s.userId.toLowerCase() === clean) &&
      s.status === 'active' &&
      new Date(s.expiryDate).getTime() > Date.now()
    );
    return found || null;
  };

  // Current User State (default logged in as Priya Sharma with verified running subscription)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          // Verify active subscription running status against registry
          const savedSubs = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTIONS_REGISTRY_KEY);
          const subs: ActiveSubscriptionRecord[] = savedSubs ? JSON.parse(savedSubs) : INITIAL_ACTIVE_SUBSCRIPTIONS;
          const cleanEmail = parsed.email.trim().toLowerCase();
          const matchSub = subs.find(s => 
            (s.userEmail.toLowerCase() === cleanEmail || s.userId === parsed.id) && 
            s.status === 'active' && 
            new Date(s.expiryDate).getTime() > Date.now()
          );
          if (matchSub) {
            return {
              ...parsed,
              isPremium: true,
              plan: matchSub.planId,
              premiumExpiry: matchSub.expiryDate
            };
          }
          return parsed;
        }
      }
    } catch {}
    return null; // Website first open: start at Step 1 (Login / Sign In) -> Step 2 (Subscription) -> Step 3 (All View)
  });

  const activeSubscription = currentUser ? checkUserSubscription(currentUser.email) : null;

  // Ensure Priya's channel exists in channels state
  useEffect(() => {
    setChannels(prev => {
      if (!prev.some(c => c.username === 'priya_rasoi')) {
        const priyaChannel: CreatorChannel = {
          id: 'channel-priya',
          userId: 'user-demo-member',
          name: 'Priya’s Rasoi & Bengaluru Tiffin',
          username: 'priya_rasoi',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
          coverImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1600&auto=format&fit=crop&q=80',
          description: 'Authentic South Indian home cooking, Bengaluru style filter coffee, and melt-in-mouth Mysore Pak.',
          state: 'Karnataka',
          district: 'Bengaluru Urban',
          speciality: 'Karnataka Tiffin & Traditional Sweets',
          preferredLanguage: 'Kannada & English',
          socialLinks: {
            instagram: 'https://instagram.com',
            youtube: 'https://youtube.com'
          },
          isVerified: true,
          verifiedReason: 'Popular Karnataka Home Cook verified by Taste of India',
          isSuspended: false,
          followersCount: 840,
          viewsCount: 15400,
          totalRecipeViews: 9800,
          totalVideoViews: 5600,
          createdAt: '2024-02-18'
        };
        return [priyaChannel, ...prev];
      }
      return prev;
    });
  }, []);

  // Persist storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_RECIPES_KEY, JSON.stringify(recipes));
    } catch (e) {
      console.warn('Storage quota exceeded for recipes cache', e);
    }
  }, [recipes]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CHANNELS_KEY, JSON.stringify(channels));
    } catch (e) {
      console.warn('Storage quota exceeded for channels cache', e);
    }
  }, [channels]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_VIDEOS_KEY, JSON.stringify(cookingVideos));
    } catch (e) {
      console.warn('Storage quota exceeded for videos cache', e);
    }
  }, [cookingVideos]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_NOTIFS_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage quota exceeded for notifs cache', e);
    }
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(currentUser));
      } catch (e) {
        console.warn('Storage error', e);
      }
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  }, [currentUser]);

  // Open Channel Helper
  const openChannel = (username: string) => {
    const cleanUsername = username.replace(/^@/, '');
    setSelectedChannelUsername(cleanUsername);
    setCurrentView('channel');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Notification
  const addNotification = (notif: Omit<CreatorNotification, 'id' | 'createdAt'>) => {
    const newNotif: CreatorNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Channel Creation
  const createChannel = (channelData: Partial<CreatorChannel>): CreatorChannel => {
    if (!currentUser) {
      throw new Error('You must be signed in to create a channel.');
    }
    const cleanUsername = (channelData.username || currentUser.username)
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_');
    
    // Check uniqueness
    const exists = channels.some(c => c.username.toLowerCase() === cleanUsername);
    const finalUsername = exists ? `${cleanUsername}_${Date.now().toString().slice(-4)}` : cleanUsername;

    const newChannel: CreatorChannel = {
      id: `channel-${Date.now()}`,
      userId: currentUser.id,
      name: channelData.name || `${currentUser.name}'s Kitchen`,
      username: finalUsername,
      avatar: channelData.avatar || currentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      coverImage: channelData.coverImage || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1600&auto=format&fit=crop&q=80',
      description: channelData.description || 'Welcome to my authentic Indian cooking channel! Join me as we discover traditional family flavours.',
      state: channelData.state || 'Tamil Nadu',
      district: channelData.district || 'Chennai',
      speciality: channelData.speciality || 'Traditional Regional Cuisine',
      preferredLanguage: channelData.preferredLanguage || 'English & Hindi',
      socialLinks: channelData.socialLinks || {},
      isVerified: false,
      isSuspended: false,
      followersCount: 1,
      viewsCount: 10,
      totalRecipeViews: 0,
      totalVideoViews: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setChannels(prev => [newChannel, ...prev]);

    // Update current user
    const updatedUser: User = {
      ...currentUser,
      hasChannel: true,
      channelId: newChannel.id,
      channelUsername: newChannel.username
    };
    setCurrentUser(updatedUser);

    addNotification({
      userId: currentUser.id,
      type: 'approval',
      title: 'Food Channel Created!',
      message: `Congratulations! Your channel @${newChannel.username} is live at tasteofindia.com/channel/${newChannel.username}. Start uploading your recipes and cooking videos!`,
      read: false,
      link: `/channel/${newChannel.username}`
    });

    showToast(`Channel @${newChannel.username} created successfully! Welcome to the Creator Network.`);
    return newChannel;
  };

  // Update Channel
  const updateChannel = (channelId: string, channelData: Partial<CreatorChannel>) => {
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, ...channelData } : c));
    showToast('Channel details updated successfully!');
  };

  // Follow / Unfollow Channel
  const followChannel = (channelId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (currentUser.followingCreatorIds.includes(channelId)) return;

    const targetChannel = channels.find(c => c.id === channelId);
    if (!targetChannel) return;

    setCurrentUser({
      ...currentUser,
      followingCreatorIds: [...currentUser.followingCreatorIds, channelId],
      following: (currentUser.following || 0) + 1
    });

    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, followersCount: c.followersCount + 1 } : c));

    // Notify channel owner
    addNotification({
      userId: targetChannel.userId,
      type: 'follow',
      title: 'New Channel Follower!',
      message: `${currentUser.name} started following your channel ${targetChannel.name}.`,
      read: false,
      link: `/channel/${targetChannel.username}`
    });

    showToast(`Now following ${targetChannel.name}!`);
  };

  const unfollowChannel = (channelId: string) => {
    if (!currentUser) return;
    const targetChannel = channels.find(c => c.id === channelId);
    setCurrentUser({
      ...currentUser,
      followingCreatorIds: currentUser.followingCreatorIds.filter(id => id !== channelId),
      following: Math.max(0, (currentUser.following || 1) - 1)
    });

    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, followersCount: Math.max(0, c.followersCount - 1) } : c));
    showToast(targetChannel ? `Unfollowed ${targetChannel.name}` : 'Unfollowed channel');
  };

  const isFollowingChannel = (channelId: string): boolean => {
    return !!currentUser?.followingCreatorIds.includes(channelId);
  };

  // Verify Channel (Admin)
  const verifyCreatorChannel = (channelId: string, isVerified: boolean, reason?: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === channelId) {
        return { 
          ...c, 
          isVerified, 
          verifiedReason: isVerified ? (reason || 'Verified Authentic Food Creator by Taste of India') : undefined 
        };
      }
      return c;
    }));

    const target = channels.find(c => c.id === channelId);
    if (target && isVerified) {
      addNotification({
        userId: target.userId,
        type: 'approval',
        title: 'Channel Verified!',
        message: 'Your food creator channel has been granted the official Taste of India Verified Golden Chef Badge.',
        read: false,
        link: `/channel/${target.username}`
      });
    }

    showToast(isVerified ? 'Creator channel verified with golden badge!' : 'Verification badge removed.');
  };

  // Suspend Channel (Admin)
  const suspendCreatorChannel = (channelId: string, isSuspended: boolean) => {
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, isSuspended } : c));
    showToast(isSuspended ? 'Channel has been suspended.' : 'Channel has been restored to active status.');
  };

  // Add Cooking Video
  const addCookingVideo = (videoData: Partial<CookingVideo>): CookingVideo => {
    if (!currentUser) {
      throw new Error('Sign in required');
    }

    const userChannel = channels.find(c => c.userId === currentUser.id) || channels[0];
    const isApproved = true;

    const newVideo: CookingVideo = {
      id: `vid-${Date.now()}`,
      channelId: userChannel.id,
      creatorId: currentUser.id,
      creatorName: userChannel.name,
      creatorUsername: userChannel.username,
      creatorAvatar: userChannel.avatar,
      isVerified: userChannel.isVerified,
      title: videoData.title || 'Authentic Regional Cooking Tutorial',
      description: videoData.description || 'Step by step cooking guide with traditional techniques.',
      videoUrl: videoData.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: videoData.thumbnail || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      duration: videoData.duration || '08:30',
      isShort: videoData.isShort || false,
      category: videoData.category || 'Curry & Gravy',
      state: videoData.state || userChannel.state,
      language: videoData.language || userChannel.preferredLanguage,
      likes: 0,
      views: 1,
      status: 'approved',
      rejectionReason: undefined,
      isPremium: videoData.isPremium || false,
      comments: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCookingVideos(prev => [newVideo, ...prev]);

    // Send notification
    addNotification({
      userId: currentUser.id,
      type: 'approval',
      title: 'Video Published Live!',
      message: `Your video "${newVideo.title}" is now published and viewable on your channel!`,
      read: false
    });

    showToast('Video published live on your channel!');
    return newVideo;
  };

  // Moderate Video (Admin)
  const moderateVideo = (videoId: string, status: 'approved' | 'rejected', reason?: string) => {
    setCookingVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        return { ...v, status, rejectionReason: status === 'rejected' ? reason : undefined };
      }
      return v;
    }));

    const targetVid = cookingVideos.find(v => v.id === videoId);
    if (targetVid) {
      addNotification({
        userId: targetVid.creatorId,
        type: status === 'approved' ? 'approval' : 'rejection',
        title: status === 'approved' ? 'Video Approved!' : 'Video Needs Attention',
        message: status === 'approved' 
          ? `Your cooking video "${targetVid.title}" was approved by moderation and is now public!`
          : `Your cooking video "${targetVid.title}" was rejected: ${reason || 'Does not meet culinary guidelines'}.`,
        read: false
      });
    }

    showToast(`Video status updated to ${status}.`);
  };

  // Like Cooking Video
  const likeVideo = (videoId: string) => {
    setCookingVideos(prev => prev.map(v => v.id === videoId ? { ...v, likes: v.likes + 1 } : v));
    if (selectedVideo && selectedVideo.id === videoId) {
      setSelectedVideo(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
    showToast('Video liked! Added to your appreciated videos.');
  };

  // Add Comment to Cooking Video
  const addVideoComment = (videoId: string, text: string) => {
    const newComment: Comment = {
      id: `cv_${Date.now()}`,
      userId: currentUser?.id || 'anon',
      userName: currentUser?.name || 'Food Explorer',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      text,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCookingVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        const updated = { ...v, comments: [newComment, ...v.comments] };
        if (selectedVideo?.id === videoId) setSelectedVideo(updated);
        return updated;
      }
      return v;
    }));
    showToast('Comment posted to video discussion!');
  };

  const deleteVideo = (videoId: string) => {
    setCookingVideos(prev => prev.filter(v => v.id !== videoId));
    if (selectedVideo?.id === videoId) setSelectedVideo(null);
    showToast('Video removed successfully.');
  };

  // Like recipe
  const likeRecipe = (recipeId: string) => {
    setRecipes(prev =>
      prev.map(r => (r.id === recipeId ? { ...r, likes: r.likes + 1 } : r))
    );
    if (selectedRecipe && selectedRecipe.id === recipeId) {
      setSelectedRecipe(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
    showToast('Recipe liked! Added to your appreciation list.');
  };

  // Save / Bookmark recipe
  const saveRecipe = (recipeId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const alreadySaved = currentUser.savedRecipeIds.includes(recipeId);
    const updatedIds = alreadySaved
      ? currentUser.savedRecipeIds.filter(id => id !== recipeId)
      : [...currentUser.savedRecipeIds, recipeId];

    setCurrentUser({ ...currentUser, savedRecipeIds: updatedIds });
    setRecipes(prev =>
      prev.map(r => (r.id === recipeId ? { ...r, saves: r.saves + (alreadySaved ? -1 : 1) } : r))
    );
    showToast(alreadySaved ? 'Removed from saved recipes' : 'Recipe saved to your cookbook!');
  };

  // Add Comment & Rating to Recipe
  const addComment = (recipeId: string, text: string, rating: number) => {
    const newComment = {
      id: `c_${Date.now()}`,
      userId: currentUser?.id || 'anon',
      userName: currentUser?.name || 'Indian Food Lover',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      text,
      rating,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setRecipes(prev =>
      prev.map(r => {
        if (r.id === recipeId) {
          const newTotal = r.rating * r.ratingCount + rating;
          const newCount = r.ratingCount + 1;
          const updatedRecipe = {
            ...r,
            rating: Number((newTotal / newCount).toFixed(1)),
            ratingCount: newCount,
            comments: [newComment, ...r.comments]
          };
          if (selectedRecipe?.id === recipeId) setSelectedRecipe(updatedRecipe);
          return updatedRecipe;
        }
        return r;
      })
    );
    showToast('Your review and comment have been posted!');
  };

  // Add New Recipe
  const addNewRecipe = (recipeData: Partial<Recipe>): Recipe => {
    if (currentUser?.isBanned) {
      showToast(`Action Blocked: Your account is restricted by Admin from creating recipes. Reason: ${currentUser.bannedReason || 'Account restricted.'}`);
      throw new Error('Account restricted: You are banned by Admin from creating recipes.');
    }

    const userChannel = channels.find(c => c.userId === currentUser?.id) || channels[0];

    const newRec: Recipe = {
      id: `recipe-custom-${Date.now()}`,
      title: recipeData.title || 'Family Recipe',
      slug: (recipeData.title || 'family-recipe').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: recipeData.description || 'Authentic traditional family recipe.',
      image: recipeData.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      videoUrl: recipeData.videoUrl,
      state: recipeData.state || 'Tamil Nadu',
      district: recipeData.district || '',
      category: recipeData.category || 'Lunch',
      dietary: recipeData.dietary || 'Vegetarian',
      prepTime: recipeData.prepTime || 20,
      cookTime: recipeData.cookTime || 30,
      totalTime: (recipeData.prepTime || 20) + (recipeData.cookTime || 30),
      servings: recipeData.servings || 4,
      difficulty: recipeData.difficulty || 'Medium',
      budgetTier: recipeData.budgetTier || 'under100',
      costPerServing: recipeData.costPerServing || 65,
      ingredients: recipeData.ingredients || [],
      instructions: recipeData.instructions || [],
      tips: recipeData.tips || [],
      nutrition: recipeData.nutrition || { calories: 340, protein: '12g', carbs: '45g', fat: '14g' },
      culturalStory: recipeData.culturalStory,
      allergens: recipeData.allergens,
      isPremiumOnly: recipeData.isPremiumOnly || false,
      additionalImages: recipeData.additionalImages || [],
      channelId: userChannel?.id,
      creator: {
        id: currentUser?.id || 'creator-new',
        name: userChannel?.name || currentUser?.name || 'Chef Community',
        username: userChannel?.username || currentUser?.username || 'home_chef',
        avatar: userChannel?.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        location: `${recipeData.district ? recipeData.district + ', ' : ''}${recipeData.state || 'India'}`,
        bio: userChannel?.description || currentUser?.bio || 'Passionate Indian cook',
        isVerified: userChannel?.isVerified || false,
        channelId: userChannel?.id
      },
      status: 'approved',
      isUserUploaded: true,
      likes: 1,
      saves: 0,
      rating: 5.0,
      ratingCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
      tags: Array.from(new Set([...(recipeData.tags || []), 'Community Upload', 'People Uploaded', recipeData.state || 'Indian', recipeData.category || 'Traditional'])),
      comments: [],
      businessType: recipeData.businessType || 'standard',
      cateringDetails: recipeData.cateringDetails,
      homemadeDetails: recipeData.homemadeDetails,
      spiceLevel: recipeData.spiceLevel,
      isGlutenFree: recipeData.isGlutenFree
    };

    setRecipes(prev => [newRec, ...prev]);

    // If catering recipe, connect with catering directory
    if (recipeData.businessType === 'catering' && recipeData.cateringDetails) {
      const catDet = recipeData.cateringDetails;
      setCaterers(prev => {
        const existing = prev.find(c => c.businessName.toLowerCase() === catDet.businessName.toLowerCase());
        if (existing) {
          return prev.map(c => c.id === existing.id ? { ...c, uploadedRecipeIds: [...c.uploadedRecipeIds, newRec.id] } : c);
        } else {
          const newCaterer: CateringProfile = {
            id: `caterer-${Date.now()}`,
            businessName: catDet.businessName,
            ownerName: currentUser?.name || 'Catering Specialist',
            phone: catDet.contactNumber,
            whatsappNumber: catDet.whatsappNumber || catDet.contactNumber,
            address: catDet.address,
            city: catDet.city,
            state: recipeData.state || 'India',
            speciality: `${recipeData.category || 'Regional'} & Event Catering`,
            experienceYears: 5,
            pricePerPlateRange: catDet.pricePerPlate ? `₹${catDet.pricePerPlate} / Plate` : '₹400 - ₹750 / Plate',
            capacityRange: catDet.minGuests ? `${catDet.minGuests}+ Guests` : '50 - 1,000 Guests',
            servicesOffered: ['Full Event Setup', 'Live Counter Stalls', 'Traditional Service'],
            verified: true,
            rating: 5.0,
            reviewsCount: 1,
            coverImage: newRec.image,
            avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
            menuPackages: [
              {
                id: `pkg-${Date.now()}`,
                packageName: catDet.menuTitle || `${newRec.title} Banquet Menu`,
                pricePerPlate: catDet.pricePerPlate || 450,
                minGuests: catDet.minGuests || 50,
                dietary: newRec.dietary,
                itemsIncluded: catDet.menuHighlights && catDet.menuHighlights.length > 0 ? catDet.menuHighlights : [newRec.title, 'Special Rice', 'Papad & Chutney', 'Traditional Sweet'],
                description: `Signature catering spread featuring ${newRec.title}.`
              }
            ],
            uploadedRecipeIds: [newRec.id],
            createdAt: new Date().toISOString().split('T')[0]
          };
          return [newCaterer, ...prev];
        }
      });
    }

    // If homemade food business recipe, connect with homemade directory
    if (recipeData.businessType === 'homemade' && recipeData.homemadeDetails) {
      const hmDet = recipeData.homemadeDetails;
      setHomemadeBusinesses(prev => {
        const existing = prev.find(h => h.businessName.toLowerCase() === hmDet.businessName.toLowerCase());
        if (existing) {
          return prev.map(h => h.id === existing.id ? { ...h, uploadedRecipeIds: [...h.uploadedRecipeIds, newRec.id] } : h);
        } else {
          const newHomeBiz: HomemadeFoodProfile = {
            id: `homemade-${Date.now()}`,
            businessName: hmDet.businessName,
            chefName: hmDet.chefName || currentUser?.name || 'Home Chef',
            phone: hmDet.contactNumber,
            whatsappNumber: hmDet.whatsappNumber || hmDet.contactNumber,
            address: hmDet.address,
            city: hmDet.city,
            state: recipeData.state || 'India',
            deliveryArea: hmDet.deliveryArea || 'Home delivery available in locality',
            speciality: `Homestyle ${newRec.title} & Daily Tiffins`,
            serviceType: 'Daily Tiffin Service',
            dietaryType: newRec.dietary === 'Vegetarian' ? '100% Pure Veg' : 'Veg & Non-Veg',
            operatingHours: '10:00 AM - 9:00 PM',
            verified: true,
            rating: 5.0,
            reviewsCount: 1,
            coverImage: newRec.image,
            avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
            menuItems: [
              {
                id: `item-${Date.now()}`,
                dishName: newRec.title,
                price: hmDet.tiffinPrice || 120,
                portionSize: 'Standard Meal Box',
                dietary: newRec.dietary,
                availability: hmDet.preOrderNotice || 'Daily Fresh Orders',
                description: `Freshly prepared home meal featuring ${newRec.title}.`
              }
            ],
            uploadedRecipeIds: [newRec.id],
            createdAt: new Date().toISOString().split('T')[0]
          };
          return [newHomeBiz, ...prev];
        }
      });
    }

    if (currentUser) {
      setCurrentUser(prev => prev ? ({
        ...prev,
        uploadedRecipeIds: [...prev.uploadedRecipeIds, newRec.id]
      }) : null);

      addNotification({
        userId: currentUser.id,
        type: 'approval',
        title: 'Recipe Published Live!',
        message: `Your recipe "${newRec.title}" has been published and is now live across the platform!`,
        read: false
      });
    }

    showToast('Recipe & business details published live successfully!');
    return newRec;
  };

  const addCateringProfile = (profileData: Partial<CateringProfile>): CateringProfile => {
    const newProfile: CateringProfile = {
      id: `caterer-${Date.now()}`,
      userId: profileData.userId || currentUser?.id || 'user-demo-member',
      businessName: profileData.businessName || 'Catering Services',
      ownerName: profileData.ownerName || currentUser?.name || 'Catering Specialist',
      phone: profileData.phone || '+91 98401 23456',
      whatsappNumber: profileData.whatsappNumber || profileData.phone || '+91 98401 23456',
      address: profileData.address || 'Central City Road',
      city: profileData.city || 'Chennai',
      state: profileData.state || 'Tamil Nadu',
      speciality: profileData.speciality || 'Traditional Indian Feasts & Event Catering',
      experienceYears: profileData.experienceYears || 5,
      pricePerPlateRange: profileData.pricePerPlateRange || '₹350 - ₹650 / Plate',
      capacityRange: profileData.capacityRange || '50 - 1,000 Guests',
      servicesOffered: profileData.servicesOffered || ['Traditional Sit-down Service', 'Buffet Setup'],
      verified: true,
      rating: 5.0,
      reviewsCount: 1,
      coverImage: profileData.coverImage || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&auto=format&fit=crop&q=80',
      avatar: profileData.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      dietaryType: profileData.dietaryType || 'Pure Veg',
      menuImages: profileData.menuImages || [],
      videoUrl: profileData.videoUrl,
      bookedDates: profileData.bookedDates || [],
      menuPackages: profileData.menuPackages || [],
      uploadedRecipeIds: profileData.uploadedRecipeIds || [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCaterers(prev => [newProfile, ...prev]);
    showToast(`Catering service "${newProfile.businessName}" listed successfully!`);
    return newProfile;
  };

  const updateCateringProfile = (catererId: string, updatedData: Partial<CateringProfile>) => {
    setCaterers(prev => prev.map(c => c.id === catererId ? { ...c, ...updatedData } : c));
    if (selectedCaterer?.id === catererId) {
      setSelectedCaterer(prev => prev ? { ...prev, ...updatedData } : null);
    }
    showToast('Catering profile & schedule updated successfully!');
  };

  const addHomemadeProfile = (profileData: Partial<HomemadeFoodProfile>): HomemadeFoodProfile => {
    const newProfile: HomemadeFoodProfile = {
      id: `homemade-${Date.now()}`,
      userId: profileData.userId || currentUser?.id || 'user-demo-member',
      businessName: profileData.businessName || 'Home Kitchen',
      chefName: profileData.chefName || currentUser?.name || 'Home Chef',
      phone: profileData.phone || '+91 98710 44556',
      whatsappNumber: profileData.whatsappNumber || profileData.phone || '+91 98710 44556',
      address: profileData.address || 'Home Kitchen Address',
      city: profileData.city || 'New Delhi',
      state: profileData.state || 'Delhi',
      deliveryArea: profileData.deliveryArea || 'Home delivery available in locality',
      speciality: profileData.speciality || 'Fresh Homestyle Tiffin & Comfort Food',
      serviceType: profileData.serviceType || 'Daily Tiffin Service',
      dietaryType: profileData.dietaryType || '100% Pure Veg',
      operatingHours: profileData.operatingHours || '11:00 AM - 9:00 PM',
      verified: true,
      rating: 5.0,
      reviewsCount: 1,
      coverImage: profileData.coverImage || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&auto=format&fit=crop&q=80',
      avatar: profileData.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      menuItems: profileData.menuItems || [],
      uploadedRecipeIds: profileData.uploadedRecipeIds || [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setHomemadeBusinesses(prev => [newProfile, ...prev]);
    showToast(`Home Food Business "${newProfile.businessName}" listed successfully!`);
    return newProfile;
  };

  const updateHomemadeProfile = (businessId: string, updatedData: Partial<HomemadeFoodProfile>) => {
    setHomemadeBusinesses(prev => prev.map(h => h.id === businessId ? { ...h, ...updatedData } : h));
    if (selectedHomemade?.id === businessId) {
      setSelectedHomemade(prev => prev ? { ...prev, ...updatedData } : null);
    }
    showToast('Homemade Kitchen profile updated successfully!');
  };

  const addHotelRestaurantProfile = (profileData: Partial<HotelRestaurantProfile>): HotelRestaurantProfile => {
    const newProfile: HotelRestaurantProfile = {
      id: `rest-${Date.now()}`,
      userId: profileData.userId || currentUser?.id || 'user-demo-member',
      businessName: profileData.businessName || 'Heritage Dining Restaurant',
      logo: profileData.logo,
      ownerOrChefName: profileData.ownerOrChefName || currentUser?.name || 'Executive Chef',
      restaurantType: profileData.restaurantType || 'Fine Dine Restaurant',
      dietaryType: profileData.dietaryType || 'Both Veg & Non-Veg',
      phone: profileData.phone || '+91 98401 22334',
      whatsappNumber: profileData.whatsappNumber || profileData.phone || '+91 98401 22334',
      address: profileData.address || 'Heritage Grand Road',
      city: profileData.city || 'Chennai',
      state: profileData.state || 'Tamil Nadu',
      timings: profileData.timings || '12:00 PM - 11:30 PM',
      seatingCapacity: profileData.seatingCapacity || '120 Seats',
      averageCostForTwo: profileData.averageCostForTwo || '₹1,200 for two',
      specialities: profileData.specialities || ['Signature Biryani', 'Tandoori Kebabs', 'Traditional Thali'],
      menuImages: profileData.menuImages || [],
      videoUrl: profileData.videoUrl,
      verified: true,
      rating: 5.0,
      reviewsCount: 1,
      coverImage: profileData.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
      avatar: profileData.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      uploadedRecipeIds: profileData.uploadedRecipeIds || [],
      tableBookingAvailable: profileData.tableBookingAvailable !== undefined ? profileData.tableBookingAvailable : true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setHotelsAndRestaurants(prev => [newProfile, ...prev]);
    showToast(`Hotel / Restaurant "${newProfile.businessName}" listed successfully!`);
    return newProfile;
  };

  const updateHotelRestaurantProfile = (restaurantId: string, updatedData: Partial<HotelRestaurantProfile>) => {
    setHotelsAndRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, ...updatedData } : r));
    if (selectedHotelRestaurant?.id === restaurantId) {
      setSelectedHotelRestaurant(prev => prev ? { ...prev, ...updatedData } : null);
    }
    showToast('Hotel & Restaurant profile updated successfully!');
  };

  // Update existing recipe (creator edits)
  const updateRecipe = (recipeId: string, updatedData: Partial<Recipe>): Recipe | null => {
    let updatedRecipeObj: Recipe | null = null;
    setRecipes(prev =>
      prev.map(r => {
        if (r.id === recipeId) {
          const prep = updatedData.prepTime !== undefined ? updatedData.prepTime : r.prepTime;
          const cook = updatedData.cookTime !== undefined ? updatedData.cookTime : r.cookTime;
          updatedRecipeObj = {
            ...r,
            ...updatedData,
            totalTime: prep + cook
          };
          return updatedRecipeObj;
        }
        return r;
      })
    );

    if (selectedRecipe && selectedRecipe.id === recipeId && updatedRecipeObj) {
      setSelectedRecipe(updatedRecipeObj);
    }
    showToast('Recipe updated successfully!');
    return updatedRecipeObj;
  };

  // Moderate Recipe (Admin)
  const moderateRecipe = (recipeId: string, status: 'approved' | 'rejected', reason?: string) => {
    setRecipes(prev =>
      prev.map(r => {
        if (r.id === recipeId) {
          return {
            ...r,
            status,
            rejectionReason: status === 'rejected' ? reason : undefined
          };
        }
        return r;
      })
    );

    const targetRec = recipes.find(r => r.id === recipeId);
    if (targetRec && targetRec.creator?.id) {
      addNotification({
        userId: targetRec.creator.id,
        type: status === 'approved' ? 'approval' : 'rejection',
        title: status === 'approved' ? 'Recipe Approved!' : 'Recipe Needs Modification',
        message: status === 'approved'
          ? `Congratulations! "${targetRec.title}" has been approved and is now featured publicly.`
          : `Your recipe "${targetRec.title}" was not approved: ${reason || 'Incomplete details'}. You can edit and resubmit.`,
        read: false
      });
    }

    showToast(`Recipe ${status === 'approved' ? 'approved & published' : 'rejected'}.`);
  };

  const deleteRecipe = (recipeId: string, reason?: string, notifyAuthor: boolean = false) => {
    if (currentUser?.isBanned && currentUser?.role !== 'admin') {
      showToast(`Action Blocked: Your account is restricted by Admin from deleting recipes.`);
      return;
    }

    const targetRecipe = recipes.find(r => r.id === recipeId);
    setRecipes(prev => prev.filter(r => r.id !== recipeId));
    if (selectedRecipe?.id === recipeId) setSelectedRecipe(null);

    if (notifyAuthor && targetRecipe && targetRecipe.creator?.id) {
      addNotification({
        userId: targetRecipe.creator.id,
        type: 'rejection',
        title: `Recipe Removed: "${targetRecipe.title}"`,
        message: `Your recipe "${targetRecipe.title}" was removed by the Editorial Administration. Reason: ${reason || 'Does not comply with community culinary guidelines.'}`,
        read: false,
        senderName: 'Editorial Administration Team',
        category: 'Content Moderation'
      });
    }

    showToast(`Recipe "${targetRecipe?.title || 'item'}" removed successfully.`);
  };

  // Auth Operations with Persistent Running Subscription Guarantees
  const login = (email: string, role: 'user' | 'admin' = 'user'): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const isSpecialAdmin = cleanEmail.includes('admin') || role === 'admin';
    const foundChannel = channels.find(c => 
      isSpecialAdmin 
        ? c.username === 'chettinad_heritage' 
        : cleanEmail.includes('meenakshi')
        ? c.username === 'chettinad_heritage'
        : c.username === 'priya_rasoi'
    );

    // 1. Look in persistent users registry first
    let userToLogin = usersRegistry.find(u => u.email.toLowerCase() === cleanEmail);

    if (!userToLogin) {
      // Look in pre-seeded accounts
      const seeded = INITIAL_USERS_REGISTRY.find(u => u.email.toLowerCase() === cleanEmail);
      if (seeded) {
        userToLogin = { ...seeded };
      } else {
        // Create new personalized profile for this email
        const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const cleanUser = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_');

        userToLogin = {
          id: `user-${Date.now()}`,
          name: formattedName || 'Food Explorer',
          username: cleanUser,
          email,
          avatar: isSpecialAdmin 
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
          bio: isSpecialAdmin ? 'Chief Culinary Curator at TASTE OF INDIA.' : 'Culinary explorer discovering authentic regional flavours on Taste of India.',
          location: isSpecialAdmin ? 'New Delhi & Chennai' : 'India',
          role: isSpecialAdmin ? 'admin' : 'user',
          isPremium: false,
          followers: isSpecialAdmin ? 12400 : 12,
          following: isSpecialAdmin ? 24 : 6,
          savedRecipeIds: ['recipe-1'],
          uploadedRecipeIds: [],
          downloadedRecipeIds: [],
          followingCreatorIds: ['channel-meenakshi'],
          channelId: foundChannel?.id,
          channelUsername: foundChannel?.username,
          hasChannel: !!foundChannel,
          createdAt: new Date().toISOString().split('T')[0]
        };
      }
    }

    // 2. CHECK ACTIVE SUBSCRIPTION FOR THIS USER (PERSISTENT & RUNNING)
    const activeSub = checkUserSubscription(cleanEmail) || checkUserSubscription(userToLogin.id);

    if (activeSub) {
      // Re-link and guarantee running subscription status
      userToLogin = {
        ...userToLogin,
        isPremium: true,
        plan: activeSub.planId,
        premiumExpiry: activeSub.expiryDate
      };
      showToast(`Welcome back, ${userToLogin.name}! Your ${activeSub.planName} is active & running (Valid until ${new Date(activeSub.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}).`);
    } else if (userToLogin.isPremium && userToLogin.premiumExpiry && new Date(userToLogin.premiumExpiry).getTime() > Date.now()) {
      // User account has unexpired plan, ensure active subscription record is registered in store
      const planInfo = SUBSCRIPTION_PLANS.find(p => p.id === userToLogin!.plan) || SUBSCRIPTION_PLANS[0];
      const newSub: ActiveSubscriptionRecord = {
        subscriptionId: `sub_${Date.now()}`,
        userEmail: cleanEmail,
        userId: userToLogin.id,
        userName: userToLogin.name,
        planId: userToLogin.plan || 'quarterly',
        planName: planInfo.name,
        durationMonths: planInfo.durationMonths,
        amount: planInfo.price,
        startDate: new Date().toISOString(),
        expiryDate: userToLogin.premiumExpiry,
        status: 'active',
        paymentRef: `restored_login_${Date.now().toString().slice(-6)}`,
        lastVerifiedAt: new Date().toISOString()
      };
      setActiveSubscriptions(prev => [newSub, ...prev.filter(s => s.userEmail.toLowerCase() !== cleanEmail)]);
      showToast(`Welcome back, ${userToLogin.name}! Your ${newSub.planName} is active & running.`);
    } else {
      showToast(`Welcome back, ${userToLogin.name}!`);
    }

    // 3. Save to registry & session
    setUsersRegistry(prev => {
      const idx = prev.findIndex(u => u.email.toLowerCase() === cleanEmail);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = userToLogin!;
        return copy;
      }
      return [userToLogin!, ...prev];
    });

    setCurrentUser(userToLogin);
    return true;
  };

  const register = (name: string, email: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanUser = name.toLowerCase().replace(/[^a-z0-9]/g, '_');

    // Check if an active subscription was already purchased for this email
    const activeSub = checkUserSubscription(cleanEmail);

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      username: cleanUser,
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      bio: 'New food creator at TASTE OF INDIA. Passionate about homemade Indian cooking.',
      location: 'India',
      role: 'user',
      isPremium: !!activeSub,
      plan: activeSub?.planId,
      premiumExpiry: activeSub?.expiryDate,
      followers: 0,
      following: 0,
      savedRecipeIds: [],
      uploadedRecipeIds: [],
      downloadedRecipeIds: [],
      followingCreatorIds: ['channel-meenakshi'],
      hasChannel: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsersRegistry(prev => [newUser, ...prev.filter(u => u.email.toLowerCase() !== cleanEmail)]);
    setCurrentUser(newUser);

    if (activeSub) {
      showToast(`Account created! Found your existing active ${activeSub.planName} (Running until ${new Date(activeSub.expiryDate).toLocaleDateString('en-IN')}).`);
    } else {
      showToast(`Registration complete! Welcome to TASTE OF INDIA, ${name}.`);
    }
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out successfully. Your active subscription remains safely saved & running.');
  };

  // Update User Profile (User ID, Username, Avatar / Logo, Name, Bio, Location)
  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const cleanUsername = data.username ? data.username.trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_]/g, '_') : currentUser.username;
    const cleanCustomId = data.customUserId !== undefined ? data.customUserId.trim() : currentUser.customUserId;
    
    const updatedUser: User = {
      ...currentUser,
      ...data,
      username: cleanUsername,
      customUserId: cleanCustomId
    };

    setCurrentUser(updatedUser);
    setUsersRegistry(prev => {
      const idx = prev.findIndex(u => u.id === updatedUser.id || u.email.toLowerCase() === updatedUser.email.toLowerCase());
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedUser;
        return copy;
      }
      return [updatedUser, ...prev];
    });

    // Also update matching channel avatar/name if creator has a channel
    if (updatedUser.channelId) {
      setChannels(prev => prev.map(c => {
        if (c.id === updatedUser.channelId || c.userId === updatedUser.id) {
          return {
            ...c,
            name: updatedUser.name ? `${updatedUser.name}’s Rasoi` : c.name,
            avatar: updatedUser.avatar || c.avatar
          };
        }
        return c;
      }));
    }

    showToast('Profile, User ID & Logo updated successfully!');
  };

  // Subscription Activation (Guarantees persistence across logout and login)
  const activateSubscription = (planId: SubscriptionPlanId, durationMonths: number, paymentId: string) => {
    if (!currentUser) return;
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId) || SUBSCRIPTION_PLANS[0];

    // If user already has an active subscription that hasn't expired, extend from existing expiry date
    const currentExpiryTime = currentUser.premiumExpiry ? new Date(currentUser.premiumExpiry).getTime() : 0;
    const baseTime = currentExpiryTime > Date.now() ? currentExpiryTime : Date.now();
    const expiryDate = new Date(baseTime + durationMonths * 30 * 24 * 60 * 60 * 1000).toISOString();

    const updatedUser: User = {
      ...currentUser,
      isPremium: true,
      plan: planId,
      premiumExpiry: expiryDate
    };

    // Update active subscription record in persistent registry
    const subRecord: ActiveSubscriptionRecord = {
      subscriptionId: `sub_toi_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userEmail: currentUser.email.toLowerCase(),
      userId: currentUser.id,
      userName: currentUser.name,
      planId: plan.id,
      planName: plan.name,
      durationMonths,
      amount: plan.price,
      startDate: new Date().toISOString(),
      expiryDate,
      status: 'active',
      paymentRef: paymentId,
      lastVerifiedAt: new Date().toISOString()
    };

    setActiveSubscriptions(prev => [
      subRecord,
      ...prev.filter(s => s.userEmail.toLowerCase() !== currentUser.email.toLowerCase())
    ]);

    setUsersRegistry(prev => {
      const idx = prev.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedUser;
        return copy;
      }
      return [updatedUser, ...prev];
    });

    setCurrentUser(updatedUser);
    setIsPremiumModalOpen(false);
    showToast(`Payment verified (${paymentId})! ${plan.name} Pass is now active & running across all logins.`);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedState,
        setSelectedState,
        selectedCategory,
        setSelectedCategory,
        selectedRecipe,
        setSelectedRecipe,
        staticPageId,
        setStaticPageId,
        recipes,
        setRecipes,
        likeRecipe,
        saveRecipe,
        addComment,
        addNewRecipe,
        updateRecipe,
        editingRecipe,
        setEditingRecipe,
        openEditRecipe,
        moderateRecipe,
        deleteRecipe,

        // Creator Channels
        channels,
        setChannels,
        selectedChannelUsername,
        setSelectedChannelUsername,
        openChannel,
        createChannel,
        updateChannel,
        followChannel,
        unfollowChannel,
        isFollowingChannel,
        verifyCreatorChannel,
        suspendCreatorChannel,

        // Cooking Videos
        cookingVideos,
        setCookingVideos,
        selectedVideo,
        setSelectedVideo,
        addCookingVideo,
        moderateVideo,
        likeVideo,
        addVideoComment,
        deleteVideo,

        // Notifications
        notifications,
        markNotificationRead,
        addNotification,

        // Catering, Homemade & Hotel/Restaurant Slots
        caterers,
        setCaterers,
        selectedCaterer,
        setSelectedCaterer,
        addCateringProfile,
        updateCateringProfile,
        homemadeBusinesses,
        setHomemadeBusinesses,
        selectedHomemade,
        setSelectedHomemade,
        addHomemadeProfile,
        updateHomemadeProfile,

        // Hotel & Restaurant Slot
        hotelsAndRestaurants,
        setHotelsAndRestaurants,
        selectedHotelRestaurant,
        setSelectedHotelRestaurant,
        addHotelRestaurantProfile,
        updateHotelRestaurantProfile,

        activeUploadBusinessType,
        setActiveUploadBusinessType,
        isCreateBusinessModalOpen,
        setIsCreateBusinessModalOpen,
        businessModalType,
        setBusinessModalType,
        openCreateBusinessAccount,
        editingBusinessProfile,
        setEditingBusinessProfile,
        openEditBusinessProfile,
        prefilledBusinessData,
        setPrefilledBusinessData,

        // Invoice PDF Modal
        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        invoiceData,
        setInvoiceData,
        openInvoiceModal,

        // Modals
        isCreateChannelModalOpen,
        setIsCreateChannelModalOpen,

        // Users Registry & Admin Communications
        usersRegistry,
        setUsersRegistry,
        banUser,
        unbanUser,
        adminSentMessages,
        setAdminSentMessages,
        sendAdminMessage,

        // Auth
        currentUser,
        setCurrentUser,
        login,
        register,
        logout,
        updateUserProfile,
        activateSubscription,
        activeSubscription,
        activeSubscriptions,
        checkUserSubscription,
        language,
        setLanguage,
        t,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isPremiumModalOpen,
        setIsPremiumModalOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        selectedPaymentPlan,
        setSelectedPaymentPlan,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
