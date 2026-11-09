import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INDIAN_STATES_AND_UTS } from '../data/states';
import { FOOD_CATEGORIES } from '../data/categories';
import { Ingredient, DietaryType, DifficultyLevel } from '../types';
import { DISH_IMAGE_PRESETS, getAccurateRecipeImage } from '../utils/recipeImageHelper';
import { FoodImagePickerModal } from './FoodImagePickerModal';
import { 
  Tv, 
  BarChart3, 
  BookOpen, 
  Video, 
  PlusCircle, 
  Upload, 
  Settings, 
  Users, 
  MessageSquare, 
  Heart, 
  Bookmark, 
  Bell, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  ChefHat, 
  Camera, 
  Play, 
  Crown, 
  ShieldCheck, 
  Globe, 
  Languages, 
  MapPin,
  LogOut,
  Lock,
  ArrowLeft,
  Building2,
  Store,
  UtensilsCrossed,
  Briefcase,
  Phone,
  Check,
  Film,
  Mail,
  Megaphone
} from 'lucide-react';
import { VideoGalleryModal } from './VideoGalleryModal';

export const CreatorStudio: React.FC = () => {
  const { 
    currentUser, 
    channels, 
    recipes, 
    cookingVideos, 
    notifications, 
    markNotificationRead,
    openChannel, 
    updateChannel, 
    addNewRecipe, 
    openEditRecipe,
    deleteRecipe, 
    addCookingVideo, 
    deleteVideo, 
    setCurrentView, 
    setSelectedRecipe, 
    setSelectedVideo, 
    setIsAuthModalOpen,
    setIsCreateChannelModalOpen,
    openCreateBusinessAccount,
    caterers,
    setCaterers,
    setSelectedCaterer,
    homemadeBusinesses,
    setHomemadeBusinesses,
    setSelectedHomemade,
    hotelsAndRestaurants,
    setHotelsAndRestaurants,
    setSelectedHotelRestaurant,
    openEditBusinessProfile,
    setActiveUploadBusinessType,
    showToast 
  } = useApp();

  const [isFoodImagePickerOpen, setIsFoodImagePickerOpen] = useState(false);
  const [isVideoGalleryOpen, setIsVideoGalleryOpen] = useState(false);
  const [videoCreatorType, setVideoCreatorType] = useState<'normal' | 'catering' | 'homemade' | 'hotel_restaurant'>('normal');
  const [videoBusinessId, setVideoBusinessId] = useState<string>('');

  const [activeTab, setActiveTab] = useState<
    'overview' | 'my-accounts' | 'my-recipes' | 'my-videos' | 'add-recipe' | 'upload-video' | 'edit-channel' | 'followers' | 'comments' | 'notifications'
  >('overview');

  const [accountsFilter, setAccountsFilter] = useState<'all' | 'catering' | 'homemade' | 'hotel_restaurant' | 'channel'>('all');

  // Business & Creator accounts created by the current user
  const userCaterers = caterers.filter(c => 
    c.userId === currentUser?.id || 
    c.ownerName === currentUser?.name ||
    (currentUser?.role === 'admin')
  );

  const userHomemade = homemadeBusinesses.filter(h => 
    h.userId === currentUser?.id || 
    h.chefName === currentUser?.name ||
    (currentUser?.role === 'admin')
  );

  const userHotels = hotelsAndRestaurants.filter(r => 
    r.userId === currentUser?.id || 
    r.ownerOrChefName === currentUser?.name ||
    (currentUser?.role === 'admin')
  );

  const userChannels = channels.filter(c => 
    c.userId === currentUser?.id ||
    c.username === currentUser?.channelUsername ||
    (currentUser?.role === 'admin')
  );

  const totalUserAccounts = userCaterers.length + userHomemade.length + userHotels.length + userChannels.length;

  const handleDeleteCaterer = (catererId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete catering profile "${name}"? This action cannot be undone.`)) {
      setCaterers(prev => prev.filter(c => c.id !== catererId));
      showToast(`Catering profile "${name}" removed successfully.`);
    }
  };

  const handleDeleteHomemade = (businessId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete homemade kitchen "${name}"? This action cannot be undone.`)) {
      setHomemadeBusinesses(prev => prev.filter(h => h.id !== businessId));
      showToast(`Homemade kitchen "${name}" removed successfully.`);
    }
  };

  const handleDeleteHotel = (hotelId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete hotel / restaurant "${name}"? This action cannot be undone.`)) {
      setHotelsAndRestaurants(prev => prev.filter(r => r.id !== hotelId));
      showToast(`Hotel/Restaurant "${name}" removed successfully.`);
    }
  };

  // Check if current user has an authorized creator account or created business accounts
  const isCreatorAccount = Boolean(
    currentUser && (
      currentUser.hasChannel || 
      currentUser.isCreator || 
      currentUser.role === 'admin' || 
      channels.some(c => c.userId === currentUser.id) ||
      totalUserAccounts > 0
    )
  );

  // Find user's channel (only for authorized creators)
  const userChannel = channels.find(c => c.userId === currentUser?.id || c.username === currentUser?.channelUsername) || 
    (currentUser?.role === 'admin' || currentUser?.hasChannel ? channels[0] : null);

  // Creator's content
  const myRecipes = recipes.filter(r => 
    r.creator.id === currentUser?.id || 
    r.creator.username === userChannel?.username || 
    r.channelId === userChannel?.id
  );

  const myVideos = cookingVideos.filter(v => 
    v.creatorId === currentUser?.id || 
    v.creatorUsername === userChannel?.username || 
    v.channelId === userChannel?.id
  );

  // Statistics calculation
  const totalFollowers = userChannel ? userChannel.followersCount : 0;
  const totalRecipeLikes = myRecipes.reduce((sum, r) => sum + r.likes, 0);
  const totalVideoLikes = myVideos.reduce((sum, v) => sum + v.likes, 0);
  const totalLikes = totalRecipeLikes + totalVideoLikes;
  const totalRecipeViews = userChannel ? userChannel.totalRecipeViews : 12400;
  const totalVideoViews = myVideos.reduce((sum, v) => sum + v.views, 0);
  const totalChannelViews = (userChannel ? userChannel.viewsCount : 0) + totalVideoViews;
  const mostPopularRecipe = [...myRecipes].sort((a, b) => b.likes - a.likes)[0] || myRecipes[0];

  // ================= ADD RECIPE FORM STATE =================
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeCategory, setRecipeCategory] = useState('Lunch');
  const [recipeState, setRecipeState] = useState(userChannel?.state || 'Tamil Nadu');
  const [recipeDistrict, setRecipeDistrict] = useState(userChannel?.district || 'Chennai');
  const [recipeDietary, setRecipeDietary] = useState<DietaryType>('Vegetarian');
  const [recipePrepTime, setRecipePrepTime] = useState(20);
  const [recipeCookTime, setRecipeCookTime] = useState(30);
  const [recipeServings, setRecipeServings] = useState(4);
  const [recipeDifficulty, setRecipeDifficulty] = useState<DifficultyLevel>('Medium');
  const [recipeDescription, setRecipeDescription] = useState('');
  const [recipeCulturalStory, setRecipeCulturalStory] = useState('');
  const [recipeImage, setRecipeImage] = useState('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80');
  const [recipeVideoUrl, setRecipeVideoUrl] = useState('');
  const [recipeAllergens, setRecipeAllergens] = useState('');
  const [recipeIsPremiumOnly, setRecipeIsPremiumOnly] = useState(false);
  const [recipeCalories, setRecipeCalories] = useState(340);
  const [recipeProtein, setRecipeProtein] = useState('12g');
  const [recipeCarbs, setRecipeCarbs] = useState('45g');
  const [recipeFat, setRecipeFat] = useState('14g');

  // Ingredients with exact measurements
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { item: 'Toor Dal (Pigeon Peas)', quantity: '1 cup (200g)', notes: 'Washed and soaked for 20 mins' },
    { item: 'Small Shallots / Sambar Onions', quantity: '12-15 whole', notes: 'Peeled' },
    { item: 'Tamarind Pulp', quantity: '1 lemon-sized ball soaked in warm water', notes: 'Extracted thick' },
    { item: 'Ghee or Sesame Oil', quantity: '2 tbsp', notes: 'Cold pressed' },
    { item: 'Mustard Seeds & Curry Leaves', quantity: '1 tsp & 2 sprigs', notes: 'For tempering' }
  ]);

  // Instructions
  const [instructions, setInstructions] = useState<string[]>([
    'Pressure cook the soaked lentils with turmeric and a pinch of asafoetida until soft and mashable (3-4 whistles).',
    'In a clay or heavy-bottom pot, heat ghee, crackle mustard seeds, dried red chillies, and fresh curry leaves.',
    'Add peeled shallots and sauté until lightly translucent and golden around the edges.',
    'Pour in the extracted tamarind water, freshly ground spice masala, and salt. Simmer gently for 8-10 minutes until raw aroma departs.',
    'Fold in the mashed lentils, adjust consistency with warm water, and bring to a slow rolling simmer. Garnish with chopped coriander.'
  ]);

  // Tips
  const [tips, setTips] = useState<string[]>([
    'Use stone-ground fresh sambar powder roasted on low heat for deepest fragrance.',
    'Adding half a teaspoon of organic jaggery balances the tartness of tamarind perfectly.'
  ]);

  const handleAddIngredient = () => {
    setIngredients(prev => [...prev, { item: '', quantity: '', notes: '' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddInstruction = () => {
    setInstructions(prev => [...prev, '']);
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(prev => prev.filter((_, i) => i !== index));
  };

  const handleRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.isBanned) {
      showToast('Action Blocked: Your account is restricted by Admin. You cannot create new recipes.');
      return;
    }
    if (!recipeTitle.trim()) {
      showToast('Please provide recipe title');
      return;
    }
    const cleanIngredients = ingredients.filter(ing => ing.item.trim() !== '');
    if (cleanIngredients.length === 0) {
      showToast('Please provide at least one ingredient with measurement');
      return;
    }
    const cleanInstructions = instructions.filter(ins => ins.trim() !== '');

    addNewRecipe({
      title: recipeTitle,
      description: recipeDescription || `Traditional ${recipeTitle} recipe curated with heirloom methods.`,
      image: recipeImage,
      category: recipeCategory,
      state: recipeState,
      district: recipeDistrict,
      dietary: recipeDietary,
      prepTime: Number(recipePrepTime),
      cookTime: Number(recipeCookTime),
      servings: Number(recipeServings),
      difficulty: recipeDifficulty,
      ingredients: cleanIngredients,
      instructions: cleanInstructions,
      tips: tips.filter(t => t.trim() !== ''),
      videoUrl: recipeVideoUrl || undefined,
      culturalStory: recipeCulturalStory || undefined,
      allergens: recipeAllergens ? recipeAllergens.split(',').map(a => a.trim()) : undefined,
      isPremiumOnly: recipeIsPremiumOnly,
      nutrition: {
        calories: Number(recipeCalories),
        protein: recipeProtein,
        carbs: recipeCarbs,
        fat: recipeFat
      }
    });

    // Reset and jump to my-recipes
    setRecipeTitle('');
    setRecipeDescription('');
    setActiveTab('my-recipes');
  };

  // ================= UPLOAD VIDEO FORM STATE =================
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [videoThumbnail, setVideoThumbnail] = useState('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80');
  const [videoDuration, setVideoDuration] = useState('08:45');
  const [videoCategory, setVideoCategory] = useState('Curry & Gravy');
  const [videoState, setVideoState] = useState(userChannel?.state || 'Tamil Nadu');
  const [videoLanguage, setVideoLanguage] = useState(userChannel?.preferredLanguage || 'Hindi & English');
  const [videoIsShort, setVideoIsShort] = useState(false);
  const [videoIsPremium, setVideoIsPremium] = useState(false);

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) {
      showToast('Please provide video title');
      return;
    }

    let creatorName = userChannel?.name || currentUser?.name || 'Chef';
    let creatorUsername = userChannel?.username || currentUser?.username || 'chef';
    let creatorAvatar = userChannel?.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80';
    let channelId = userChannel?.id || 'channel-default';
    let finalState = videoState;

    if (videoCreatorType === 'catering') {
      const caterer = userCaterers.find(c => c.id === videoBusinessId) || userCaterers[0] || caterers[0];
      if (caterer) {
        creatorName = caterer.businessName;
        creatorUsername = `catering_${caterer.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        creatorAvatar = caterer.avatar || caterer.coverImage || creatorAvatar;
        finalState = caterer.state || videoState;
        if (!caterer.videoUrl) {
          setCaterers(prev => prev.map(c => c.id === caterer.id ? { ...c, videoUrl } : c));
        }
      }
    } else if (videoCreatorType === 'homemade') {
      const home = userHomemade.find(h => h.id === videoBusinessId) || userHomemade[0] || homemadeBusinesses[0];
      if (home) {
        creatorName = home.businessName;
        creatorUsername = `homemade_${home.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        creatorAvatar = home.avatar || home.coverImage || creatorAvatar;
        finalState = home.state || videoState;
        if (!home.videoUrl) {
          setHomemadeBusinesses(prev => prev.map(h => h.id === home.id ? { ...h, videoUrl } : h));
        }
      }
    } else if (videoCreatorType === 'hotel_restaurant') {
      const hotel = userHotels.find(h => h.id === videoBusinessId) || userHotels[0] || hotelsAndRestaurants[0];
      if (hotel) {
        creatorName = hotel.businessName;
        creatorUsername = `restaurant_${hotel.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        creatorAvatar = hotel.avatar || hotel.coverImage || creatorAvatar;
        finalState = hotel.state || videoState;
        if (!hotel.videoUrl) {
          setHotelsAndRestaurants(prev => prev.map(h => h.id === hotel.id ? { ...h, videoUrl } : h));
        }
      }
    }

    addCookingVideo({
      channelId,
      creatorId: currentUser?.id,
      creatorName,
      creatorUsername,
      creatorAvatar,
      title: videoTitle,
      description: videoDescription,
      videoUrl,
      thumbnail: videoThumbnail,
      duration: videoDuration,
      category: videoCategory,
      state: finalState,
      language: videoLanguage,
      isShort: videoIsShort,
      isPremium: videoIsPremium
    });

    showToast(`Video published under "${creatorName}"!`);
    setVideoTitle('');
    setVideoDescription('');
    setActiveTab('my-videos');
  };

  // ================= EDIT CHANNEL FORM STATE =================
  const [editName, setEditName] = useState(userChannel?.name || '');
  const [editDescription, setEditDescription] = useState(userChannel?.description || '');
  const [editAvatar, setEditAvatar] = useState(userChannel?.avatar || '');
  const [editCover, setEditCover] = useState(userChannel?.coverImage || '');
  const [editSpeciality, setEditSpeciality] = useState(userChannel?.speciality || '');
  const [editLanguage, setEditLanguage] = useState(userChannel?.preferredLanguage || '');
  const [editState, setEditState] = useState(userChannel?.state || 'Tamil Nadu');
  const [editDistrict, setEditDistrict] = useState(userChannel?.district || 'Chennai');
  const [editYoutube, setEditYoutube] = useState(userChannel?.socialLinks?.youtube || '');
  const [editInstagram, setEditInstagram] = useState(userChannel?.socialLinks?.instagram || '');
  const [editFacebook, setEditFacebook] = useState(userChannel?.socialLinks?.facebook || '');
  const [editWebsite, setEditWebsite] = useState(userChannel?.socialLinks?.website || '');

  const handleUpdateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChannel) return;
    updateChannel(userChannel.id, {
      name: editName,
      description: editDescription,
      avatar: editAvatar,
      coverImage: editCover,
      speciality: editSpeciality,
      preferredLanguage: editLanguage,
      state: editState,
      district: editDistrict,
      socialLinks: {
        youtube: editYoutube.trim() || undefined,
        instagram: editInstagram.trim() || undefined,
        facebook: editFacebook.trim() || undefined,
        website: editWebsite.trim() || undefined
      }
    });
  };

  // Guard 1: User is not signed in
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center ring-8 ring-amber-50 shadow-md">
          <Lock className="w-10 h-10 text-[#E8590C]" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-[#E8590C] border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Creator Account Access Only</span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-black text-[#2B1B17]">
            Sign In with Your Food Creator Account
          </h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            Taste of India Creator Studio, channel management, video publishing, and catering/restaurant editing are restricted exclusively to verified Food Creators and Business Partners.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-[#E8590C] hover:bg-[#D9480F] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Tv className="w-4 h-4 text-amber-200" />
            <span>Sign In to Creator Account</span>
          </button>
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Studio &amp; Return Home</span>
          </button>
        </div>
      </div>
    );
  }

  // Guard 2: Logged in as regular user without a creator channel
  if (!isCreatorAccount) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center ring-8 ring-amber-50 shadow-md">
          <ChefHat className="w-10 h-10 text-[#E8590C]" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-[#E8590C] border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Creator Account Access Only</span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-black text-[#2B1B17]">
            Launch Your Culinary Creator Channel
          </h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            You are currently logged in as <strong>{currentUser.name}</strong> (Member Account). Creator Studio analytics and video publishing require a registered Food Creator Channel or Business Account.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <button
            onClick={() => setIsCreateChannelModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-[#E8590C] hover:bg-[#D9480F] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Launch Food Creator Channel</span>
          </button>
          <button
            onClick={() => openCreateBusinessAccount('catering')}
            className="w-full sm:w-auto px-5 py-3 bg-[#2B1B17] hover:bg-black text-amber-300 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Register Business (Catering/Restaurant)</span>
          </button>
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit to Home</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner & Quick Channel Preview Link */}
      <div className="bg-[#2B1B17] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md border border-[#3B2219]">
        <div className="flex items-center gap-4">
          <img
            src={userChannel?.avatar || currentUser?.avatar}
            alt={userChannel?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#E8590C]/40 shrink-0"
          />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800">
              <Tv className="w-3 h-3 text-[#E8590C]" />
              <span>Taste of India Creator Studio</span>
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-black">
              {userChannel?.name || 'Creator Studio'}
            </h1>
            <div className="text-xs text-stone-300 font-mono flex items-center gap-2">
              <span>@{userChannel?.username}</span>
              <span>·</span>
              <span className="text-amber-300">{userChannel?.speciality}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('my-accounts')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
              activeTab === 'my-accounts'
                ? 'bg-amber-400 text-stone-950 ring-2 ring-white'
                : 'bg-indigo-600/90 hover:bg-indigo-600 text-white border border-indigo-400/40'
            }`}
            title="View all catering, homemade, hotel & restaurant and channel accounts created by you"
          >
            <Building2 className="w-4 h-4 text-amber-300" />
            <span>My Created Accounts ({totalUserAccounts})</span>
          </button>

          {userChannel && (
            <button
              onClick={() => openChannel(userChannel.username)}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border border-stone-700"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>View Public Channel</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('add-recipe')}
            className="px-5 py-2.5 bg-[#E8590C] hover:bg-[#D9480F] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Recipe</span>
          </button>

          <button
            onClick={() => setActiveTab('upload-video')}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Video className="w-4 h-4" />
            <span>Upload Video</span>
          </button>

          {/* Explicit Exit Creator Studio Button */}
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              showToast('Exited Creator Studio. Returned to Explorer Mode.');
            }}
            className="px-4 py-2.5 bg-rose-950/70 hover:bg-rose-900 text-rose-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border border-rose-800/80"
            title="Exit Creator Studio & Return to Home"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Exit Studio</span>
          </button>
        </div>
      </div>

      {/* Banned User Restriction Warning */}
      {currentUser?.isBanned && (
        <div className="bg-rose-50 border-2 border-rose-400 p-4 rounded-2xl flex items-start gap-3.5 text-rose-950 shadow-xs animate-fadeIn">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-xs">
            🚫
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-sm text-rose-900">
              Account Restricted by Admin: Recipe Privileges Suspended
            </h4>
            <p className="text-rose-800 leading-relaxed">
              Your account has been restricted by Editorial Administration. You are <strong>blocked from creating new recipes</strong> and <strong>blocked from deleting recipes</strong>.
              {currentUser.bannedReason && (
                <span className="block mt-1 font-semibold text-rose-950">Reason: {currentUser.bannedReason}</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Studio Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto scrollbar-none pb-px">
        {[
          { id: 'overview', label: 'Channel Overview', icon: BarChart3 },
          { id: 'my-accounts', label: `My Created Accounts (${totalUserAccounts})`, icon: Building2 },
          { id: 'my-recipes', label: `My Recipes (${myRecipes.length})`, icon: BookOpen },
          { id: 'my-videos', label: `My Videos (${myVideos.length})`, icon: Video },
          { id: 'add-recipe', label: 'Add New Recipe', icon: PlusCircle },
          { id: 'upload-video', label: 'Upload Cooking Video', icon: Upload },
          { id: 'edit-channel', label: 'Edit Channel', icon: Settings },
          { id: 'followers', label: `Followers (${totalFollowers})`, icon: Users },
          { id: 'notifications', label: `Notifications (${notifications.filter(n => !n.read).length})`, icon: Bell },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'add-recipe' && currentUser?.isBanned) {
                  showToast('Action Blocked: You are restricted by Admin from creating new recipes.');
                  return;
                }
                setActiveTab(tab.id as any);
              }}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
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
        
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            showToast('Exited Creator Studio. Returned to Explorer Mode.');
          }}
          className="ml-auto py-2.5 px-3.5 text-xs font-bold text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border border-rose-200"
          title="Exit Creator Studio"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600" />
          <span>Exit Studio</span>
        </button>
      </div>

      {/* ================= TAB 1: CHANNEL OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Key Analytics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs text-center space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Followers</div>
              <div className="font-serif-title text-2xl font-black text-[#2B1B17]">
                {totalFollowers.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-600 font-bold">+12% this month</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs text-center space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Likes</div>
              <div className="font-serif-title text-2xl font-black text-red-600">
                {totalLikes.toLocaleString()}
              </div>
              <div className="text-[10px] text-stone-500">Across all dishes</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs text-center space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Channel Views</div>
              <div className="font-serif-title text-2xl font-black text-amber-600">
                {totalChannelViews.toLocaleString()}
              </div>
              <div className="text-[10px] text-stone-500">Profile & recipes</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs text-center space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Recipe Views</div>
              <div className="font-serif-title text-2xl font-black text-[#E8590C]">
                {totalRecipeViews.toLocaleString()}
              </div>
              <div className="text-[10px] text-stone-500">Archive reads</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs text-center space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Video Views</div>
              <div className="font-serif-title text-2xl font-black text-sky-600">
                {totalVideoViews.toLocaleString()}
              </div>
              <div className="text-[10px] text-stone-500">Tutorial plays</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs text-center space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Recipes Published</div>
              <div className="font-serif-title text-2xl font-black text-stone-800">
                {myRecipes.length}
              </div>
              <div className="text-[10px] text-stone-500">{myVideos.length} videos</div>
            </div>
          </div>

          {/* Spotlight: Most Popular Recipe & Verification Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Most Popular Recipe Card */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#E8590C]">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="font-serif-title text-base font-bold text-[#2B1B17]">
                    Most Popular Recipe on Your Channel
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Top Performer
                </span>
              </div>

              {mostPopularRecipe ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <img
                    src={mostPopularRecipe.image}
                    alt={mostPopularRecipe.title}
                    className="w-full sm:w-36 h-28 rounded-xl object-cover"
                  />
                  <div className="space-y-1.5 w-full">
                    <div className="text-xs font-bold text-[#E8590C] uppercase tracking-wider">
                      {mostPopularRecipe.state} · {mostPopularRecipe.category}
                    </div>
                    <h4 className="font-serif-title text-base font-bold text-[#2B1B17]">
                      {mostPopularRecipe.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-stone-600">
                      <span className="flex items-center gap-1 text-red-500 font-bold">
                        <Heart className="w-3.5 h-3.5 fill-red-500" />
                        {mostPopularRecipe.likes} likes
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-amber-600 font-bold">
                        ★ {mostPopularRecipe.rating} ({mostPopularRecipe.ratingCount})
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedRecipe(mostPopularRecipe)}
                      className="text-xs font-bold text-[#E8590C] hover:underline pt-1 block"
                    >
                      View Recipe Details & PDF →
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-500">Upload your first recipe to see analytics here!</p>
              )}
            </div>

            {/* Creator Verification Status Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-3xl border border-amber-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif-title text-base font-bold text-amber-950">
                  Creator Verification Badge
                </h3>
              </div>

              {userChannel?.isVerified ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs bg-emerald-100/80 p-2.5 rounded-xl border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Channel Verified by Taste of India</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {userChannel.verifiedReason || 'Your channel possesses verified status for genuine regional Indian recipes and accurate measurement instructions.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-stone-700 leading-relaxed">
                    Verification is granted by Taste of India admins to food creators who consistently publish authentic regional dishes with complete ingredient quantities and step-by-step guidance.
                  </div>
                  <div className="text-[11px] text-amber-800 font-medium">
                    Upload at least 5 recipes and 1 cooking video to become eligible for golden verification review.
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Content Moderation Pipeline Summary */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4 shadow-xs">
            <h3 className="font-serif-title text-base font-bold text-[#2B1B17] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#E8590C]" />
              <span>Content Approval Pipeline Status</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Live & Approved</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-serif-title text-2xl font-black text-emerald-900 mt-1">
                  {myRecipes.filter(r => r.status === 'approved').length + myVideos.filter(v => v.status === 'approved').length}
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">Publicly discoverable</div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pending Review</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="font-serif-title text-2xl font-black text-amber-900 mt-1">
                  {myRecipes.filter(r => r.status === 'pending').length + myVideos.filter(v => v.status === 'pending').length}
                </div>
                <div className="text-[11px] text-amber-700 mt-0.5">Reviewed within 24-48 hrs</div>
              </div>

              <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Needs Correction</span>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div className="font-serif-title text-2xl font-black text-red-900 mt-1">
                  {myRecipes.filter(r => r.status === 'rejected').length + myVideos.filter(v => v.status === 'rejected').length}
                </div>
                <div className="text-[11px] text-red-700 mt-0.5">Click to revise & resubmit</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB: MY CREATED ACCOUNTS (CATERING, HOMEMADE, HOTEL/RESTAURANT, CHANNELS) ================= */}
      {activeTab === 'my-accounts' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Banner & Creation CTAs */}
          <div className="bg-gradient-to-br from-[#2B1B17] via-[#3B2219] to-[#1F1410] text-white p-6 sm:p-8 rounded-3xl border border-amber-900/40 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Business &amp; Creator Management</span>
                  </div>
                  <h2 className="font-serif-title text-2xl sm:text-3xl font-black text-white">
                    My Created Accounts ({totalUserAccounts})
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                    Access and manage all business profiles and channels you have registered on Taste of India. Update pricing, edit menus, upload dishes, or jump directly to your live public pages.
                  </p>
                </div>

                {/* 4 Quick Launch Creation Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => openCreateBusinessAccount('catering')}
                    className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer border border-indigo-400/40"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>+ Catering Service</span>
                  </button>

                  <button
                    onClick={() => openCreateBusinessAccount('homemade')}
                    className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer border border-emerald-400/40"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>+ Homemade Kitchen</span>
                  </button>

                  <button
                    onClick={() => openCreateBusinessAccount('hotel_restaurant')}
                    className="px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer border border-rose-400/40"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>+ Hotel &amp; Restaurant</span>
                  </button>

                  <button
                    onClick={() => setIsCreateChannelModalOpen(true)}
                    className="px-3.5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer border border-amber-400/40"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>+ Food Channel</span>
                  </button>
                </div>
              </div>

              {/* Category Count Summary Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-amber-900/40">
                <div className="bg-black/30 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 font-bold uppercase">Catering Services</div>
                    <div className="font-bold text-base text-white">{userCaterers.length} Registered</div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 font-bold uppercase">Homemade Kitchens</div>
                    <div className="font-bold text-base text-white">{userHomemade.length} Registered</div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 font-bold uppercase">Hotels &amp; Dining</div>
                    <div className="font-bold text-base text-white">{userHotels.length} Registered</div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 font-bold uppercase">Creator Channels</div>
                    <div className="font-bold text-base text-white">{userChannels.length} Registered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              {[
                { id: 'all', label: `All Accounts (${totalUserAccounts})`, icon: Briefcase },
                { id: 'catering', label: `Catering Services (${userCaterers.length})`, icon: UtensilsCrossed },
                { id: 'homemade', label: `Homemade Food (${userHomemade.length})`, icon: Store },
                { id: 'hotel_restaurant', label: `Hotels & Restaurants (${userHotels.length})`, icon: Building2 },
                { id: 'channel', label: `Food Channels (${userChannels.length})`, icon: Tv },
              ].map(filter => {
                const Icon = filter.icon;
                const isSelected = accountsFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setAccountsFilter(filter.id as any)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#2B1B17] text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Empty State */}
          {totalUserAccounts === 0 && (
            <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center space-y-6 shadow-xs max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-[#E8590C] mx-auto flex items-center justify-center">
                <Store className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif-title text-xl font-black text-[#2B1B17]">
                  No Business or Creator Accounts Found Yet
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                  Create your first Catering Service, Homemade Kitchen, Restaurant, or Food Creator Channel to start receiving orders, publishing recipes, and connecting with food lovers across India.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => openCreateBusinessAccount('catering')}
                  className="p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-2xl text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>Register Catering Service</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">Get wedding, corporate, and party catering inquiries directly.</p>
                </button>

                <button
                  onClick={() => openCreateBusinessAccount('homemade')}
                  className="p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <Store className="w-4 h-4" />
                    <span>Register Homemade Kitchen</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">Sell daily lunch tiffins and homestyle meals in your area.</p>
                </button>

                <button
                  onClick={() => openCreateBusinessAccount('hotel_restaurant')}
                  className="p-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                    <Building2 className="w-4 h-4" />
                    <span>List Hotel &amp; Restaurant</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">Feature dining tables, signature dishes, and table bookings.</p>
                </button>

                <button
                  onClick={() => setIsCreateChannelModalOpen(true)}
                  className="p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                    <Tv className="w-4 h-4" />
                    <span>Launch Food Creator Channel</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">Publish cooking videos, recipes, and build your follower base.</p>
                </button>
              </div>
            </div>
          )}

          {/* Account Cards Grid */}
          {totalUserAccounts > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* 1. CATERING ACCOUNTS */}
              {(accountsFilter === 'all' || accountsFilter === 'catering') && userCaterers.map(caterer => (
                <div key={caterer.id} className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
                  <div>
                    {/* Cover & Badges */}
                    <div className="relative h-40 bg-stone-100 overflow-hidden">
                      <img
                        src={caterer.coverImage || 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80'}
                        alt={caterer.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 bg-indigo-600/90 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                          <UtensilsCrossed className="w-3 h-3" />
                          <span>Catering Service</span>
                        </span>
                        {caterer.verified && (
                          <span className="px-2 py-0.5 bg-emerald-600/90 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 backdrop-blur-xs">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3">
                        <img
                          src={caterer.avatar || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=120&auto=format&fit=crop&q=80'}
                          alt={caterer.ownerName}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shrink-0 bg-white"
                        />
                        <div className="min-w-0 text-white">
                          <h3 className="font-bold text-base truncate leading-snug">{caterer.businessName}</h3>
                          <p className="text-[11px] text-stone-200 truncate flex items-center gap-1">
                            <span>Chef / Owner: {caterer.ownerName}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Body Details */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-[#E8590C] shrink-0" />
                        <span className="truncate">{caterer.city}, {caterer.state}</span>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {caterer.speciality}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        <div>
                          <span className="text-stone-400 block">Plate Price</span>
                          <span className="font-bold text-stone-800">{caterer.pricePerPlateRange || '₹499 / plate'}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">Guest Capacity</span>
                          <span className="font-bold text-stone-800">{caterer.capacityRange || '25 - 1,500'}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">Dietary</span>
                          <span className="font-bold text-stone-800">{caterer.dietaryType || 'Veg & Non-Veg'}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">Contact Phone</span>
                          <span className="font-bold text-stone-800 truncate block">{caterer.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 pt-0 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openEditBusinessProfile('catering', caterer)}
                        className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Edit profile & packages"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-stone-600" />
                        <span>Edit Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCaterer(caterer);
                          setCurrentView('catering');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        title="View public live listing"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Live</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveUploadBusinessType('catering');
                          setActiveTab('add-recipe');
                          showToast(`Uploading recipe for Catering profile "${caterer.businessName}".`);
                        }}
                        className="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer border border-amber-200"
                      >
                        <PlusCircle className="w-3 h-3 text-[#E8590C]" />
                        <span>Add Dish</span>
                      </button>

                      <button
                        onClick={() => {
                          setVideoCreatorType('catering');
                          setVideoBusinessId(caterer.id);
                          setVideoTitle(`${caterer.businessName} Live Catering Kitchen Prep`);
                          setActiveTab('upload-video');
                          showToast(`Upload video for "${caterer.businessName}".`);
                        }}
                        className="flex-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer border border-indigo-200"
                        title="Upload Catering Video"
                      >
                        <Video className="w-3 h-3 text-indigo-600" />
                        <span>Upload Video</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCaterer(caterer.id, caterer.businessName)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* 2. HOMEMADE FOOD & TIFFIN ACCOUNTS */}
              {(accountsFilter === 'all' || accountsFilter === 'homemade') && userHomemade.map(home => (
                <div key={home.id} className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
                  <div>
                    {/* Cover & Badges */}
                    <div className="relative h-40 bg-stone-100 overflow-hidden">
                      <img
                        src={home.coverImage || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'}
                        alt={home.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 bg-emerald-600/90 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                          <Store className="w-3 h-3" />
                          <span>Homemade Tiffin</span>
                        </span>
                        {home.verified && (
                          <span className="px-2 py-0.5 bg-amber-500/90 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 backdrop-blur-xs">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified Home Chef</span>
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3">
                        <img
                          src={home.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'}
                          alt={home.chefName}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shrink-0 bg-white"
                        />
                        <div className="min-w-0 text-white">
                          <h3 className="font-bold text-base truncate leading-snug">{home.businessName}</h3>
                          <p className="text-[11px] text-stone-200 truncate">Home Chef: {home.chefName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Body Details */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{home.city}, {home.state}</span>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {home.speciality} · {home.deliveryArea}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        <div>
                          <span className="text-stone-400 block">Service</span>
                          <span className="font-bold text-stone-800 truncate block">{home.serviceType}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">Dietary</span>
                          <span className="font-bold text-stone-800 truncate block">{home.dietaryType}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">Hours</span>
                          <span className="font-bold text-stone-800 truncate block">{home.operatingHours}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">Phone</span>
                          <span className="font-bold text-stone-800 truncate block">{home.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 pt-0 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openEditBusinessProfile('homemade', home)}
                        className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Edit kitchen profile"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-stone-600" />
                        <span>Edit Kitchen</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedHomemade(home);
                          setCurrentView('homemade');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        title="View live tiffin kitchen"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Live</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveUploadBusinessType('homemade');
                          setActiveTab('add-recipe');
                          showToast(`Uploading recipe for Homemade Kitchen "${home.businessName}".`);
                        }}
                        className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer border border-emerald-200"
                      >
                        <PlusCircle className="w-3 h-3 text-emerald-600" />
                        <span>Add Dish</span>
                      </button>

                      <button
                        onClick={() => {
                          setVideoCreatorType('homemade');
                          setVideoBusinessId(home.id);
                          setVideoTitle(`${home.businessName} Fresh Homestyle Cooking Reel`);
                          setActiveTab('upload-video');
                          showToast(`Upload video for "${home.businessName}".`);
                        }}
                        className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer border border-emerald-200"
                        title="Upload Homemade Kitchen Video"
                      >
                        <Video className="w-3 h-3 text-emerald-600" />
                        <span>Upload Video</span>
                      </button>

                      <button
                        onClick={() => handleDeleteHomemade(home.id, home.businessName)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="Delete Kitchen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* 3. HOTEL & RESTAURANT ACCOUNTS */}
              {(accountsFilter === 'all' || accountsFilter === 'hotel_restaurant') && userHotels.map(hotel => (
                <div key={hotel.id} className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
                  <div>
                    {/* Cover & Badges */}
                    <div className="relative h-40 bg-stone-100 overflow-hidden">
                      <img
                        src={hotel.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'}
                        alt={hotel.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 bg-rose-600/90 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          <span>Hotel &amp; Restaurant</span>
                        </span>
                        {hotel.verified && (
                          <span className="px-2 py-0.5 bg-amber-500/90 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 backdrop-blur-xs">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3">
                        <img
                          src={hotel.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'}
                          alt={hotel.ownerOrChefName}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shrink-0 bg-white"
                        />
                        <div className="min-w-0 text-white">
                          <h3 className="font-bold text-base truncate leading-snug">{hotel.businessName}</h3>
                          <p className="text-[11px] text-stone-200 truncate">Chef: {hotel.ownerOrChefName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Body Details */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span className="truncate">{hotel.city}, {hotel.state}</span>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {hotel.restaurantType} · {hotel.specialities?.slice(0, 3).join(', ') || 'Multi-Cuisine Specialties'}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        <div>
                          <span className="text-stone-400 block">Cost for Two</span>
                          <span className="font-bold text-stone-800 truncate block">{hotel.averageCostForTwo || '₹1,200 for two'}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">Seating</span>
                          <span className="font-bold text-stone-800 truncate block">{hotel.seatingCapacity || '100+ Seats'}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">Timings</span>
                          <span className="font-bold text-stone-800 truncate block">{hotel.timings || '12 PM - 11 PM'}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">Phone</span>
                          <span className="font-bold text-stone-800 truncate block">{hotel.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 pt-0 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openEditBusinessProfile('hotel_restaurant', hotel)}
                        className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Edit restaurant profile"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-stone-600" />
                        <span>Edit Restaurant</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedHotelRestaurant(hotel);
                          setCurrentView('hotel-restaurant');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        title="View live dining listing"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Live</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveUploadBusinessType('hotel_restaurant');
                          setActiveTab('add-recipe');
                          showToast(`Uploading recipe for Restaurant "${hotel.businessName}".`);
                        }}
                        className="flex-1 py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer border border-rose-200"
                      >
                        <PlusCircle className="w-3 h-3 text-rose-600" />
                        <span>Add Dish</span>
                      </button>

                      <button
                        onClick={() => {
                          setVideoCreatorType('hotel_restaurant');
                          setVideoBusinessId(hotel.id);
                          setVideoTitle(`${hotel.businessName} Chef Signature Masterclass`);
                          setActiveTab('upload-video');
                          showToast(`Upload video for "${hotel.businessName}".`);
                        }}
                        className="flex-1 py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer border border-rose-200"
                        title="Upload Restaurant Video"
                      >
                        <Video className="w-3 h-3 text-rose-600" />
                        <span>Upload Video</span>
                      </button>

                      <button
                        onClick={() => handleDeleteHotel(hotel.id, hotel.businessName)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="Delete Restaurant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* 4. CREATOR CHANNELS */}
              {(accountsFilter === 'all' || accountsFilter === 'channel') && userChannels.map(channel => (
                <div key={channel.id} className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
                  <div>
                    {/* Cover & Badges */}
                    <div className="relative h-40 bg-stone-100 overflow-hidden">
                      <img
                        src={channel.coverImage || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80'}
                        alt={channel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 bg-purple-600/90 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                          <Tv className="w-3 h-3" />
                          <span>Food Creator Channel</span>
                        </span>
                        {channel.isVerified && (
                          <span className="px-2 py-0.5 bg-amber-500/90 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 backdrop-blur-xs">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified Creator</span>
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3">
                        <img
                          src={channel.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'}
                          alt={channel.name}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shrink-0 bg-white"
                        />
                        <div className="min-w-0 text-white">
                          <h3 className="font-bold text-base truncate leading-snug">{channel.name}</h3>
                          <p className="text-[11px] text-stone-200 truncate">@{channel.username}</p>
                        </div>
                      </div>
                    </div>

                    {/* Body Details */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="truncate">{channel.speciality} · {channel.state}</span>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {channel.description}
                      </p>

                      <div className="grid grid-cols-3 gap-2 text-[11px] bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-center">
                        <div>
                          <span className="text-stone-400 block">Followers</span>
                          <span className="font-bold text-purple-700">{channel.followersCount?.toLocaleString() || 0}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">Recipes</span>
                          <span className="font-bold text-stone-800">{recipes.filter(r => r.channelId === channel.id || r.creator.username === channel.username).length}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">Videos</span>
                          <span className="font-bold text-stone-800">{cookingVideos.filter(v => v.channelId === channel.id || v.creatorUsername === channel.username).length}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 pt-0 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setActiveTab('edit-channel')}
                        className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Edit channel branding"
                      >
                        <Settings className="w-3.5 h-3.5 text-stone-600" />
                        <span>Edit Channel</span>
                      </button>

                      <button
                        onClick={() => openChannel(channel.username)}
                        className="py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        title="View public channel"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Public View</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setActiveTab('add-recipe')}
                        className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer border border-amber-200"
                      >
                        <PlusCircle className="w-3 h-3 text-[#E8590C]" />
                        <span>Add Recipe</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('upload-video')}
                        className="py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer border border-sky-200"
                      >
                        <Video className="w-3 h-3 text-sky-600" />
                        <span>Upload Video</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: MY RECIPES ================= */}
      {activeTab === 'my-recipes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif-title text-xl sm:text-2xl font-black text-[#2B1B17]">
                Manage Channel Recipes ({myRecipes.length})
              </h2>
              <p className="text-xs text-stone-500">Track approval status, edit instructions, and view downloads</p>
            </div>
            <button
              onClick={() => setActiveTab('add-recipe')}
              className="px-4 py-2 bg-[#E8590C] hover:bg-[#D9480F] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Recipe</span>
            </button>
          </div>

          {myRecipes.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-stone-400 mx-auto" />
              <h3 className="font-serif-title text-lg font-bold text-stone-800">No recipes uploaded yet</h3>
              <p className="text-xs text-stone-500">Share your family's authentic Indian recipes with our growing community.</p>
              <button
                onClick={() => setActiveTab('add-recipe')}
                className="px-5 py-2.5 bg-[#E8590C] text-white text-xs font-bold rounded-xl mt-2 cursor-pointer"
              >
                Upload First Recipe
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="divide-y divide-stone-200">
                {myRecipes.map(recipe => (
                  <div key={recipe.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors">
                    <div className="flex items-center gap-4">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 ring-1 ring-stone-200"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 
                            onClick={() => setSelectedRecipe(recipe)}
                            className="font-serif-title text-base font-bold text-[#2B1B17] hover:text-[#E8590C] cursor-pointer transition-colors"
                          >
                            {recipe.title}
                          </h4>
                          {recipe.status === 'approved' && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                              Approved & Live
                            </span>
                          )}
                          {recipe.status === 'pending' && (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                              Pending Moderation
                            </span>
                          )}
                          {recipe.status === 'rejected' && (
                            <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-full border border-red-300">
                              Revision Requested
                            </span>
                          )}
                          {recipe.isPremiumOnly && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Crown className="w-3 h-3 text-amber-500" />
                              <span>Premium Exclusive</span>
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                          <span>{recipe.category}</span>
                          <span>·</span>
                          <span>{recipe.state}</span>
                          <span>·</span>
                          <span>{recipe.ingredients.length} measured ingredients</span>
                          <span>·</span>
                          <span className="text-red-500 font-semibold">{recipe.likes} likes</span>
                        </div>

                        {recipe.rejectionReason && (
                          <div className="text-xs text-red-700 bg-red-50 p-2 rounded-lg border border-red-200 mt-1">
                            Moderator Feedback: {recipe.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => openEditRecipe(recipe)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                        title="Edit Recipe"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#E8590C]" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setSelectedRecipe(recipe)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => {
                          if (currentUser?.isBanned) {
                            showToast('Action Blocked: Your account is restricted by Admin. You cannot delete recipes.');
                            return;
                          }
                          if (confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
                            deleteRecipe(recipe.id);
                          }
                        }}
                        className="p-2 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete recipe"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: MY VIDEOS ================= */}
      {activeTab === 'my-videos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif-title text-xl sm:text-2xl font-black text-[#2B1B17]">
                Manage Cooking Videos ({myVideos.length})
              </h2>
              <p className="text-xs text-stone-500">Cooking reels, full tutorials, and culinary tips</p>
            </div>
            <button
              onClick={() => setActiveTab('upload-video')}
              className="px-4 py-2 bg-[#E8590C] hover:bg-[#D9480F] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Video</span>
            </button>
          </div>

          {myVideos.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
              <Video className="w-12 h-12 text-stone-400 mx-auto" />
              <h3 className="font-serif-title text-lg font-bold text-stone-800">No cooking videos uploaded yet</h3>
              <p className="text-xs text-stone-500">Share your kitchen technique with video lessons.</p>
              <button
                onClick={() => setActiveTab('upload-video')}
                className="px-5 py-2.5 bg-[#E8590C] text-white text-xs font-bold rounded-xl mt-2 cursor-pointer"
              >
                Upload First Video
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myVideos.map(vid => (
                <div key={vid.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between">
                  <div>
                    <div 
                      onClick={() => setSelectedVideo(vid)}
                      className="relative aspect-video w-full bg-stone-900 cursor-pointer group"
                    >
                      <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:opacity-90" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center group-hover:bg-[#E8590C] transition-colors">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                        {vid.duration}
                      </div>
                      <div className="absolute top-2 left-2">
                        {vid.status === 'approved' && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full backdrop-blur-xs">
                            Live
                          </span>
                        )}
                        {vid.status === 'pending' && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full backdrop-blur-xs">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{vid.category}</span>
                      <h4 
                        onClick={() => setSelectedVideo(vid)}
                        className="font-serif-title text-sm font-bold text-[#2B1B17] hover:text-[#E8590C] cursor-pointer line-clamp-2"
                      >
                        {vid.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-stone-500 pt-1">
                        <span>{vid.views.toLocaleString()} views</span>
                        <span>·</span>
                        <span className="text-red-500 font-semibold">{vid.likes} likes</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedVideo(vid)}
                      className="text-xs font-bold text-[#E8590C] hover:underline cursor-pointer"
                    >
                      Play Video
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete video "${vid.title}"?`)) {
                          deleteVideo(vid.id);
                        }
                      }}
                      className="text-stone-400 hover:text-red-600 p-1 rounded hover:bg-stone-200 transition-colors cursor-pointer"
                      title="Delete video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: ADD NEW RECIPE ================= */}
      {activeTab === 'add-recipe' && (
        <form onSubmit={handleRecipeSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
          <div>
            <h2 className="font-serif-title text-xl sm:text-2xl font-black text-[#2B1B17]">
              Upload Authentic Indian Recipe
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Every recipe must include complete ingredient measurements and step-by-step instructions.
            </p>
          </div>

          {/* Core Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">Recipe Name *</label>
              <input
                type="text"
                required
                value={recipeTitle}
                onChange={e => setRecipeTitle(e.target.value)}
                placeholder="e.g. Karaikudi Chettinad Poondu Kuzhambu"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Food Category *</label>
              <select
                value={recipeCategory}
                onChange={e => setRecipeCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              >
                {FOOD_CATEGORIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Indian State *</label>
              <select
                value={recipeState}
                onChange={e => setRecipeState(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              >
                {INDIAN_STATES_AND_UTS.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">District / City *</label>
              <input
                type="text"
                value={recipeDistrict}
                onChange={e => setRecipeDistrict(e.target.value)}
                placeholder="e.g. Madurai, Amritsar"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Dietary Type *</label>
              <select
                value={recipeDietary}
                onChange={e => setRecipeDietary(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Difficulty Level *</label>
              <select
                value={recipeDifficulty}
                onChange={e => setRecipeDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Master">Master</option>
              </select>
            </div>
          </div>

          {/* Time & Servings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Preparation Time (Mins) *</label>
              <input
                type="number"
                min="1"
                value={recipePrepTime}
                onChange={e => setRecipePrepTime(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Cooking Time (Mins) *</label>
              <input
                type="number"
                min="1"
                value={recipeCookTime}
                onChange={e => setRecipeCookTime(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Servings *</label>
              <input
                type="number"
                min="1"
                value={recipeServings}
                onChange={e => setRecipeServings(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
            </div>
          </div>

          {/* Recipe Image & Video */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-stone-700">Recipe Main Image *</label>
                <button
                  type="button"
                  onClick={() => setIsFoodImagePickerOpen(true)}
                  className="text-xs font-bold text-[#E8590C] hover:text-[#D9480F] flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-amber-50 to-orange-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>Google Gemini Food AI / Gallery</span>
                </button>
              </div>
              <input
                type="url"
                required
                value={recipeImage}
                onChange={e => setRecipeImage(e.target.value)}
                placeholder="https://... or click AI Generate above"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {DISH_IMAGE_PRESETS.slice(0, 6).map((preset) => (
                  <img
                    key={preset.id}
                    src={preset.url}
                    alt={preset.name}
                    onClick={() => setRecipeImage(preset.url)}
                    className="w-12 h-10 rounded-lg object-cover cursor-pointer hover:opacity-80 shrink-0 border border-stone-200"
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Optional Cooking Video URL</label>
              <input
                type="url"
                value={recipeVideoUrl}
                onChange={e => setRecipeVideoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="premiumOnly"
                  checked={recipeIsPremiumOnly}
                  onChange={e => setRecipeIsPremiumOnly(e.target.checked)}
                  className="rounded text-[#E8590C] focus:ring-[#E8590C]"
                />
                <label htmlFor="premiumOnly" className="text-xs font-bold text-amber-900 flex items-center gap-1 cursor-pointer">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span>Exclusive Premium Download (Subscribers Only)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Cultural Story / Intro */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Cultural Story & Family Legacy Intro</label>
            <textarea
              rows={2}
              value={recipeCulturalStory}
              onChange={e => setRecipeCulturalStory(e.target.value)}
              placeholder="e.g. This recipe was passed down by my grandmother during Diwali harvest..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
            />
          </div>

          {/* Complete Ingredients with Exact Measurements */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-title text-base font-bold text-[#2B1B17]">
                  Ingredients with Exact Measurements *
                </h3>
                <p className="text-xs text-stone-500">Provide exact quantities (e.g. 1 cup, 200g, 2 tbsp) for each ingredient</p>
              </div>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                + Add Ingredient
              </button>
            </div>

            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={ing.item}
                      onChange={e => {
                        const copy = [...ingredients];
                        copy[idx].item = e.target.value;
                        setIngredients(copy);
                      }}
                      placeholder="Ingredient item (e.g. Mustard Seeds)"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C]"
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={ing.quantity}
                      onChange={e => {
                        const copy = [...ingredients];
                        copy[idx].quantity = e.target.value;
                        setIngredients(copy);
                      }}
                      placeholder="Exact Quantity (e.g. 1 tsp, 250g)"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C]"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={ing.notes || ''}
                      onChange={e => {
                        const copy = [...ingredients];
                        copy[idx].notes = e.target.value;
                        setIngredients(copy);
                      }}
                      placeholder="Notes (optional)"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C]"
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="text-stone-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Cooking Instructions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-title text-base font-bold text-[#2B1B17]">
                  Step-by-Step Cooking Instructions *
                </h3>
                <p className="text-xs text-stone-500">Provide clear numbered chronological cooking steps</p>
              </div>
              <button
                type="button"
                onClick={handleAddInstruction}
                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                + Add Step
              </button>
            </div>

            <div className="space-y-2">
              {instructions.map((ins, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="w-6 h-6 rounded-full bg-[#E8590C] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={ins}
                    onChange={e => {
                      const copy = [...instructions];
                      copy[idx] = e.target.value;
                      setInstructions(copy);
                    }}
                    placeholder={`Step ${idx + 1} instructions...`}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(idx)}
                    className="text-stone-400 hover:text-red-500 p-1 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition & Allergen info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">Calories (kcal)</label>
              <input
                type="number"
                value={recipeCalories}
                onChange={e => setRecipeCalories(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">Protein (g)</label>
              <input
                type="text"
                value={recipeProtein}
                onChange={e => setRecipeProtein(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">Carbohydrates (g)</label>
              <input
                type="text"
                value={recipeCarbs}
                onChange={e => setRecipeCarbs(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">Fat (g)</label>
              <input
                type="text"
                value={recipeFat}
                onChange={e => setRecipeFat(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setActiveTab('my-recipes')}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl bg-[#E8590C] hover:bg-[#D9480F] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Recipe for Approval</span>
            </button>
          </div>

        </form>
      )}

      {/* ================= TAB 5: UPLOAD COOKING VIDEO ================= */}
      {activeTab === 'upload-video' && (
        <form onSubmit={handleVideoSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 mb-1.5">
                <Film className="w-3 h-3 text-[#E8590C]" />
                <span>Multi-Creator Video Studio</span>
              </div>
              <h2 className="font-serif-title text-xl sm:text-2xl font-black text-[#2B1B17]">
                Upload Cooking Video &amp; Kitchen Tutorial
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Publish video tutorials for Normal Creators, Catering Services, Homemade Kitchens, or Hotels &amp; Restaurants.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsVideoGalleryOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-[#E8590C] hover:from-amber-700 hover:to-[#D9480F] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Film className="w-4 h-4 text-amber-200" />
              <span>Browse Video Upload Gallery</span>
            </button>
          </div>

          {/* Account / Creator Role Association Selector */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <label className="block text-xs font-bold text-stone-800">
              Select Publishing Creator / Account Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setVideoCreatorType('normal');
                  setVideoBusinessId('');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                  videoCreatorType === 'normal'
                    ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-2xs font-bold'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Tv className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="text-xs">Channel Creator</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setVideoCreatorType('catering');
                  if (userCaterers.length > 0) setVideoBusinessId(userCaterers[0].id);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                  videoCreatorType === 'catering'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-2xs font-bold'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-xs">Catering Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setVideoCreatorType('homemade');
                  if (userHomemade.length > 0) setVideoBusinessId(userHomemade[0].id);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                  videoCreatorType === 'homemade'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs font-bold'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Store className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs">Homemade Kitchen</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setVideoCreatorType('hotel_restaurant');
                  if (userHotels.length > 0) setVideoBusinessId(userHotels[0].id);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                  videoCreatorType === 'hotel_restaurant'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 shadow-2xs font-bold'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Building2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="text-xs">Hotel / Restaurant</span>
              </button>
            </div>

            {/* Linked Account Selector (if business role has accounts) */}
            {videoCreatorType === 'catering' && userCaterers.length > 0 && (
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Select Catering Profile:</label>
                <select
                  value={videoBusinessId}
                  onChange={e => setVideoBusinessId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-white"
                >
                  {userCaterers.map(c => (
                    <option key={c.id} value={c.id}>{c.businessName} ({c.city})</option>
                  ))}
                </select>
              </div>
            )}

            {videoCreatorType === 'homemade' && userHomemade.length > 0 && (
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Select Homemade Kitchen:</label>
                <select
                  value={videoBusinessId}
                  onChange={e => setVideoBusinessId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-white"
                >
                  {userHomemade.map(h => (
                    <option key={h.id} value={h.id}>{h.businessName} ({h.city})</option>
                  ))}
                </select>
              </div>
            )}

            {videoCreatorType === 'hotel_restaurant' && userHotels.length > 0 && (
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Select Hotel / Restaurant:</label>
                <select
                  value={videoBusinessId}
                  onChange={e => setVideoBusinessId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-white"
                >
                  {userHotels.map(r => (
                    <option key={r.id} value={r.id}>{r.businessName} ({r.city})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">Video Title *</label>
              <input
                type="text"
                required
                value={videoTitle}
                onChange={e => setVideoTitle(e.target.value)}
                placeholder="e.g. Master the 2:1 Golden Ratio for Crispy Udupi Dosa"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-stone-700">Video URL / Storage Link *</label>
                <button
                  type="button"
                  onClick={() => setIsVideoGalleryOpen(true)}
                  className="text-[11px] font-bold text-[#E8590C] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Film className="w-3 h-3" />
                  <span>Choose from Gallery</span>
                </button>
              </div>
              <input
                type="url"
                required
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://...mp4 or YouTube embed"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">MP4 format supported across all mobile &amp; desktop devices</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Video Thumbnail Image URL *</label>
              <input
                type="url"
                required
                value={videoThumbnail}
                onChange={e => setVideoThumbnail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Video Duration (mm:ss) *</label>
              <input
                type="text"
                required
                value={videoDuration}
                onChange={e => setVideoDuration(e.target.value)}
                placeholder="08:45"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Cooking Category *</label>
              <select
                value={videoCategory}
                onChange={e => setVideoCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              >
                {FOOD_CATEGORIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Video Description & Techniques *</label>
            <textarea
              rows={3}
              required
              value={videoDescription}
              onChange={e => setVideoDescription(e.target.value)}
              placeholder="Describe the key steps, pan heat control, and tips shown in this video..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800">
              <input
                type="checkbox"
                checked={videoIsShort}
                onChange={e => setVideoIsShort(e.target.checked)}
                className="rounded text-[#E8590C] focus:ring-[#E8590C]"
              />
              <span>Short Cooking Reel (under 90 seconds)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-900">
              <input
                type="checkbox"
                checked={videoIsPremium}
                onChange={e => setVideoIsPremium(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>Exclusive Premium Masterclass</span>
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setActiveTab('my-videos')}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl bg-[#E8590C] hover:bg-[#D9480F] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Cooking Video</span>
            </button>
          </div>
        </form>
      )}

      {/* ================= TAB 6: EDIT CHANNEL ================= */}
      {activeTab === 'edit-channel' && (
        <form onSubmit={handleUpdateChannel} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
          <div>
            <h2 className="font-serif-title text-xl sm:text-2xl font-black text-[#2B1B17]">
              Edit Channel Settings & Profile
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Update your channel branding, description, speciality, and social links.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Channel Name *</label>
              <input
                type="text"
                required
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Cooking Speciality *</label>
              <input
                type="text"
                required
                value={editSpeciality}
                onChange={e => setEditSpeciality(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">State *</label>
              <select
                value={editState}
                onChange={e => setEditState(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              >
                {INDIAN_STATES_AND_UTS.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">District / City *</label>
              <input
                type="text"
                required
                value={editDistrict}
                onChange={e => setEditDistrict(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Avatar Image URL *</label>
              <input
                type="url"
                required
                value={editAvatar}
                onChange={e => setEditAvatar(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Cover Banner URL *</label>
              <input
                type="url"
                required
                value={editCover}
                onChange={e => setEditCover(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Channel Bio / Description *</label>
            <textarea
              rows={3}
              required
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E8590C] bg-[#FAF6F0]/50"
            />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">YouTube Channel URL</label>
              <input
                type="url"
                value={editYoutube}
                onChange={e => setEditYoutube(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Instagram Profile URL</label>
              <input
                type="url"
                value={editInstagram}
                onChange={e => setEditInstagram(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl bg-[#E8590C] hover:bg-[#D9480F] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              Save Channel Changes
            </button>
          </div>
        </form>
      )}

      {/* ================= TAB 7: FOLLOWERS ================= */}
      {activeTab === 'followers' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-serif-title text-xl sm:text-2xl font-black text-[#2B1B17]">
              Channel Followers ({totalFollowers})
            </h2>
            <p className="text-xs text-stone-500">Food lovers and home cooks who receive updates from your channel</p>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'Karthik Raja', loc: 'Chennai, TN', date: 'Yesterday' },
                { name: 'Sumanth Rao', loc: 'Bengaluru, KA', date: '3 days ago' },
                { name: 'Aakash Verma', loc: 'Delhi NCR', date: '5 days ago' },
                { name: 'Dr. Shalini Gupta', loc: 'Lucknow, UP', date: '1 week ago' },
                { name: 'Naveen Kumar', loc: 'Hyderabad, TS', date: '2 weeks ago' },
                { name: 'Megha Sen', loc: 'Kolkata, WB', date: '2 weeks ago' }
              ].map((f, i) => (
                <div key={i} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8590C]/10 text-[#E8590C] font-bold flex items-center justify-center shrink-0">
                    {f.name.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-stone-900">{f.name}</div>
                    <div className="text-[11px] text-stone-500">{f.loc} · {f.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 8: NOTIFICATIONS ================= */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-serif-title text-xl sm:text-2xl font-black text-[#2B1B17]">
              Creator Activity & Approval Notifications
            </h2>
            <p className="text-xs text-stone-500">Approvals, rejections, new followers, and community likes</p>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 divide-y divide-stone-200 shadow-xs overflow-hidden">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">No notifications yet.</div>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.id} 
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                    n.read ? 'bg-white' : 'bg-amber-50/70'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${
                    n.type === 'approval' ? 'bg-emerald-100 text-emerald-700' :
                    n.type === 'rejection' ? 'bg-red-100 text-red-700' :
                    n.type === 'follow' ? 'bg-blue-100 text-blue-700' :
                    n.type === 'admin_message' ? 'bg-sky-100 text-sky-700' :
                    n.type === 'announcement' ? 'bg-purple-100 text-purple-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {n.type === 'approval' ? <CheckCircle2 className="w-5 h-5" /> :
                     n.type === 'rejection' ? <XCircle className="w-5 h-5" /> :
                     n.type === 'follow' ? <Users className="w-5 h-5" /> :
                     n.type === 'admin_message' ? <Mail className="w-5 h-5" /> :
                     n.type === 'announcement' ? <Megaphone className="w-5 h-5" /> :
                     <Heart className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#2B1B17]">{n.title}</h4>
                        {n.category && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                            {n.category}
                          </span>
                        )}
                        {n.senderName && (
                          <span className="text-[10px] text-stone-400 font-medium">
                            from {n.senderName}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">{n.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Food Image Picker Modal */}
      <FoodImagePickerModal
        isOpen={isFoodImagePickerOpen}
        onClose={() => setIsFoodImagePickerOpen(false)}
        onSelectImage={(url) => setRecipeImage(url)}
        currentImage={recipeImage}
        defaultPrompt={recipeTitle ? `${recipeTitle} authentic Indian dish appetizing food photography` : undefined}
      />

      {/* Video Gallery Modal for Curated & Custom Video Uploads */}
      <VideoGalleryModal
        isOpen={isVideoGalleryOpen}
        onClose={() => setIsVideoGalleryOpen(false)}
        defaultFilter={videoCreatorType}
        onSelectVideo={(selected) => {
          setVideoTitle(selected.title);
          setVideoDescription(selected.description);
          setVideoUrl(selected.videoUrl);
          setVideoThumbnail(selected.thumbnail);
          setVideoDuration(selected.duration);
          setVideoCategory(selected.category);
          setVideoState(selected.state);
          setVideoLanguage(selected.language);
          setVideoCreatorType(selected.creatorType);
          showToast(`Selected "${selected.title}" from Video Gallery!`);
        }}
      />

    </div>
  );
};
