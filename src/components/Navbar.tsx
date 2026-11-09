import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/translations';
import { GlobalFuzzySearchBar } from './GlobalFuzzySearchBar';
import { 
  Sparkles, 
  Search, 
  Globe, 
  PlusCircle, 
  User, 
  Menu, 
  X, 
  Crown,
  ChefHat,
  ShieldCheck,
  CalendarDays,
  IndianRupee,
  CookingPot,
  Users,
  Bell,
  Tv,
  UtensilsCrossed,
  Heart,
  Building2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    currentUser, 
    setIsAuthModalOpen, 
    setIsPremiumModalOpen,
    language, 
    setLanguage,
    t,
    searchQuery,
    setSearchQuery,
    setSelectedState,
    setSelectedCategory,
    setIsCreateChannelModalOpen,
    notifications
  } = useApp();

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleNav = (view: any) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E8DFC8]/60 transition-colors">
      {/* Top Bar 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark (Official Website Logo) */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center text-left focus:outline-none group shrink-0 py-1 cursor-pointer"
          aria-label="Taste of India Homepage"
        >
          <img
            src="/assets/aistudio/file_00000000fb9482119cbfd58d08ef92d6_70233663.png"
            alt="TASTE OF INDIA - Discover the Flavours of India"
            className="h-12 sm:h-14 md:h-15 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </button>

        {/* Zone 2: Primary Nav Links (Single line, concise, enhanced text readability) */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-[15px] xl:text-base font-bold text-[#2B1B17]">
          <button
            onClick={() => handleNav('home')}
            className={`whitespace-nowrap transition-colors hover:text-[#E8590C] cursor-pointer ${
              currentView === 'home' ? 'text-[#E8590C]' : ''
            }`}
          >
            {t.home}
          </button>
          
          <button
            onClick={() => { setSelectedState(null); setSelectedCategory(null); handleNav('explore'); }}
            className={`whitespace-nowrap transition-colors hover:text-[#E8590C] cursor-pointer ${
              currentView === 'explore' ? 'text-[#E8590C]' : ''
            }`}
          >
            {t.exploreRecipes}
          </button>

          <button
            onClick={() => handleNav('peoples-recipes')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-[#E8590C] cursor-pointer ${
              currentView === 'peoples-recipes' ? 'text-[#E8590C]' : ''
            }`}
          >
            <Users className="w-4 h-4 text-[#E8590C]" />
            <span>{t.peoplesRecipes || "People's Recipes"}</span>
            <span className="bg-amber-100 text-[#E8590C] text-xs font-bold px-2 py-0.5 rounded-full">Uploads</span>
          </button>

          {/* Catering Services & Menus Slot */}
          <button
            onClick={() => handleNav('catering')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-[#E8590C] cursor-pointer ${
              currentView === 'catering' ? 'text-[#E8590C]' : ''
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-[#E8590C]" />
            <span>Catering &amp; Menus</span>
            <span className="bg-amber-100 text-[#E8590C] text-xs font-bold px-2 py-0.5 rounded-full">Events</span>
          </button>

          {/* Homemade Food Business Slot */}
          <button
            onClick={() => handleNav('homemade')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-[#E8590C] cursor-pointer ${
              currentView === 'homemade' ? 'text-[#E8590C]' : ''
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Homemade &amp; Tiffins</span>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">Home Food</span>
          </button>

          {/* Hotel, Dhaba & Restaurant Slot */}
          <button
            onClick={() => handleNav('hotel-restaurant')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-[#E8590C] cursor-pointer ${
              currentView === 'hotel-restaurant' ? 'text-[#E8590C]' : ''
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-500" />
            <span>Hotels &amp; Restaurants</span>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">Venues</span>
          </button>

          <button
            onClick={() => handleNav('states')}
            className={`whitespace-nowrap transition-colors hover:text-[#E8590C] cursor-pointer ${
              currentView === 'states' ? 'text-[#E8590C]' : ''
            }`}
          >
            {t.indianStates}
          </button>

          <button
            onClick={() => handleNav('categories')}
            className={`whitespace-nowrap transition-colors hover:text-[#E8590C] cursor-pointer ${
              currentView === 'categories' ? 'text-[#E8590C]' : ''
            }`}
          >
            {t.foodCategories}
          </button>

          <button
            onClick={() => handleNav('creators')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-[#E8590C] cursor-pointer ${
              currentView === 'creators' ? 'text-[#E8590C]' : ''
            }`}
          >
            <ChefHat className="w-4 h-4 text-[#E8590C]" />
            <span>Food Creators</span>
          </button>

          <button
            onClick={() => handleNav('following-feed')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-[#E8590C] cursor-pointer ${
              currentView === 'following-feed' ? 'text-[#E8590C]' : ''
            }`}
          >
            <span>Following Feed</span>
          </button>

          <button
            onClick={() => handleNav('community')}
            className={`whitespace-nowrap transition-colors hover:text-[#E8590C] cursor-pointer ${
              currentView === 'community' ? 'text-[#E8590C]' : ''
            }`}
          >
            {t.community}
          </button>

          <button
            onClick={() => handleNav('premium')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-[#E8590C] cursor-pointer ${
              currentView === 'premium' ? 'text-[#E8590C]' : ''
            }`}
          >
            <Crown className="w-4 h-4 text-amber-500" />
            <span>{t.premium}</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Search, Language, User profile, Upload CTA) */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Global Fuzzy Search Bar with Web Speech API Voice Search */}
          <div className="relative">
            {showSearchInput ? (
              <div className="flex items-center gap-1">
                <GlobalFuzzySearchBar variant="navbar" autoFocus />
                <button 
                  onClick={() => setShowSearchInput(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full text-xs cursor-pointer transition-colors"
                  title="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <div className="hidden md:block">
                  <GlobalFuzzySearchBar variant="navbar" />
                </div>
                <button
                  onClick={() => setShowSearchInput(true)}
                  title="Search recipes with Voice & Fuzzy Search"
                  className="md:hidden p-2 text-stone-600 hover:text-[#E8590C] rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-white/70 border border-[#E8DFC8] rounded-lg hover:border-[#E8590C] transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#E8590C]" />
              <span className="uppercase">{language}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-50">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-amber-50 ${
                      language === l.code ? 'font-semibold text-[#E8590C]' : 'text-stone-700'
                    }`}
                  >
                    <span>{l.name}</span>
                    <span className="text-[10px] text-stone-400">{l.nativeName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Creator Studio / Channel CTA */}
          {currentUser?.hasChannel ? (
            <button
              onClick={() => handleNav('creator-studio')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-all shadow-xs cursor-pointer"
              title="Open Creator Studio"
            >
              <Tv className="w-3.5 h-3.5 text-[#E8590C]" />
              <span className="whitespace-nowrap">Studio</span>
            </button>
          ) : (
            <button
              onClick={() => setIsCreateChannelModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#E8590C] bg-white hover:bg-stone-50 border border-amber-300 rounded-lg transition-all shadow-xs cursor-pointer"
              title="Launch Your Food Channel"
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Create Channel</span>
            </button>
          )}

          {/* Admin Panel Access Button */}
          <button
            onClick={() => handleNav('admin')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer ${
              currentView === 'admin' 
                ? 'bg-[#2B1B17] text-amber-300 ring-2 ring-amber-400' 
                : 'text-stone-800 bg-stone-100 hover:bg-amber-100 border border-stone-300'
            }`}
            title="Taste of India Admin & Editorial Console"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#E8590C]" />
            <span className="whitespace-nowrap">Admin Panel</span>
          </button>

          {/* Notifications Bell */}
          {currentUser && (
            <button
              onClick={() => handleNav('creator-studio')}
              className="relative p-2 text-stone-600 hover:text-[#E8590C] rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              title="Creator Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#E8590C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifsCount}
                </span>
              )}
            </button>
          )}

          {/* Upload Recipe Button */}
          <button
            onClick={() => handleNav('share-recipe')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#E8590C] rounded-lg hover:bg-[#D9480F] active:scale-95 transition-all shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">{t.shareRecipe}</span>
          </button>

          {/* Active Plan Running Badge */}
          {currentUser?.isPremium && (
            <button
              onClick={() => handleNav('dashboard')}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-500/15 via-emerald-500/20 to-teal-500/15 border border-emerald-500/40 text-emerald-900 shadow-2xs hover:scale-102 transition-all cursor-pointer"
              title="Subscription Plan is Active & Running"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
              <span>Pass Active ✓</span>
            </button>
          )}

          {/* User Profile / Login */}
          {currentUser ? (
            <button
              onClick={() => handleNav('dashboard')}
              className="flex items-center gap-2 p-1 pl-2 text-xs font-medium text-stone-800 bg-white/80 border border-[#E8DFC8] rounded-full hover:border-[#E8590C] transition-all"
            >
              <span className="hidden md:inline max-w-[80px] truncate">{currentUser.name}</span>
              {currentUser.isPremium && (
                <Crown className="w-3 h-3 text-amber-500 shrink-0" />
              )}
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-200"
              />
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white border border-[#E8DFC8] rounded-lg hover:bg-stone-50 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.login}</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:text-[#E8590C] rounded-lg hover:bg-stone-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Dropdown with Increased Text Size & Enhanced Readability */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF6F0] border-b border-[#E8DFC8] px-4 pt-4 pb-6 space-y-2.5">
          {currentUser ? (
            <div className="bg-white/90 border border-[#E8DFC8] p-3 rounded-2xl flex items-center justify-between gap-3 mb-2 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-300 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-stone-900 text-sm truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-stone-500 truncate">{currentUser.email}</div>
                </div>
              </div>
              {currentUser.isPremium ? (
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full border border-emerald-300 flex items-center gap-1 shrink-0">
                  <span>✓ Plan Running</span>
                </span>
              ) : (
                <button
                  onClick={() => handleNav('premium')}
                  className="px-3 py-1 bg-[#E8590C] text-white text-xs font-bold rounded-full shrink-0"
                >
                  Get Pass
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white/90 border border-[#E8DFC8] p-3 rounded-2xl flex items-center justify-between gap-3 mb-2 shadow-2xs">
              <div>
                <div className="font-bold text-stone-900 text-sm">Welcome to Taste of India</div>
                <div className="text-[11px] text-stone-500">Sign in to sync your active plan</div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-[#E8590C] hover:bg-[#D9480F] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Sign In
              </button>
            </div>
          )}

          <button
            onClick={() => handleNav('home')}
            className="w-full text-left py-3 px-4 text-base font-bold text-stone-900 hover:bg-amber-100/70 rounded-xl transition-colors cursor-pointer"
          >
            {t.home}
          </button>
          <button
            onClick={() => handleNav('explore')}
            className="w-full text-left py-3 px-4 text-base font-bold text-stone-900 hover:bg-amber-100/70 rounded-xl transition-colors cursor-pointer"
          >
            {t.exploreRecipes}
          </button>
          <button
            onClick={() => handleNav('peoples-recipes')}
            className="w-full text-left py-3 px-4 text-base font-bold text-stone-900 hover:bg-amber-100/70 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-[#E8590C]" />
              <span>{t.peoplesRecipes || "People's Recipes"}</span>
            </div>
            <span className="bg-amber-100 text-[#E8590C] text-xs font-bold px-2 py-0.5 rounded-full">Uploads</span>
          </button>

          <button
            onClick={() => handleNav('catering')}
            className="w-full text-left py-3 px-4 text-base font-bold text-stone-900 hover:bg-amber-100/70 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <UtensilsCrossed className="w-5 h-5 text-[#E8590C]" />
              <span>Catering &amp; Menus</span>
            </div>
            <span className="bg-amber-100 text-[#E8590C] text-xs font-bold px-2 py-0.5 rounded-full">Events</span>
          </button>

          <button
            onClick={() => handleNav('homemade')}
            className="w-full text-left py-3 px-4 text-base font-bold text-stone-900 hover:bg-amber-100/70 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Homemade &amp; Tiffins</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">Ghar Ka Khana</span>
          </button>

          <button
            onClick={() => handleNav('hotel-restaurant')}
            className="w-full text-left py-3 px-4 text-base font-bold text-stone-900 hover:bg-amber-100/70 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-amber-500" />
              <span>Hotels &amp; Restaurants</span>
            </div>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">Venues &amp; Dhabas</span>
          </button>

          <button
            onClick={() => handleNav('states')}
            className="w-full text-left py-3 px-4 text-base font-bold text-stone-900 hover:bg-amber-100/70 rounded-xl transition-colors cursor-pointer"
          >
            {t.indianStates}
          </button>
          <button
            onClick={() => handleNav('categories')}
            className="w-full text-left py-3 px-4 text-base font-bold text-stone-900 hover:bg-amber-100/70 rounded-xl transition-colors cursor-pointer"
          >
            {t.foodCategories}
          </button>
          <button
            onClick={() => handleNav('kitchen-finder')}
            className="w-full text-left py-3 px-4 text-base font-bold text-stone-900 hover:bg-amber-100/70 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <ChefHat className="w-5 h-5 text-[#E8590C]" />
            <span>{t.whatsInMyKitchen}</span>
          </button>
          <button
            onClick={() => handleNav('budget')}
            className="w-full text-left py-3 px-4 text-base font-bold text-stone-900 hover:bg-amber-100/70 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <IndianRupee className="w-5 h-5 text-emerald-600" />
            <span>{t.budgetCooking}</span>
          </button>
          <button
            onClick={() => handleNav('meal-planner')}
            className="w-full text-left py-3 px-4 text-base font-bold text-stone-900 hover:bg-amber-100/70 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <CalendarDays className="w-5 h-5 text-sky-600" />
            <span>{t.mealPlanner}</span>
          </button>
          <button
            onClick={() => handleNav('creators')}
            className="w-full text-left py-3 px-4 text-base font-bold text-stone-900 hover:bg-amber-100/70 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <ChefHat className="w-5 h-5 text-[#E8590C]" />
            <span>Top Food Creators</span>
          </button>
          <button
            onClick={() => handleNav('following-feed')}
            className="w-full text-left py-3 px-4 text-base font-bold text-stone-900 hover:bg-amber-100/70 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Users className="w-5 h-5 text-emerald-600" />
            <span>Following Feed</span>
          </button>
          {currentUser && (
            <button
              onClick={() => handleNav('creator-studio')}
              className="w-full text-left py-3 px-4 text-base font-bold text-amber-950 bg-amber-100/80 hover:bg-amber-200/80 rounded-xl flex items-center justify-between transition-colors cursor-pointer border border-amber-300/60"
            >
              <div className="flex items-center gap-2.5">
                <Tv className="w-5 h-5 text-[#E8590C]" />
                <span>{currentUser.hasChannel ? 'My Creator Studio' : 'Create Food Channel'}</span>
              </div>
              {unreadNotifsCount > 0 && (
                <span className="bg-[#E8590C] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadNotifsCount} new
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => handleNav('admin')}
            className="w-full text-left py-3 px-4 text-base font-bold text-amber-950 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer border border-amber-300"
          >
            <ShieldCheck className="w-5 h-5 text-[#E8590C]" />
            <span>Master Admin Panel</span>
          </button>
          <button
            onClick={() => handleNav('community')}
            className="w-full text-left py-3 px-4 text-base font-bold text-stone-900 hover:bg-amber-100/70 rounded-xl transition-colors cursor-pointer"
          >
            {t.community}
          </button>
          <button
            onClick={() => handleNav('premium')}
            className="w-full text-left py-3 px-4 text-base font-bold text-amber-800 hover:bg-amber-100/70 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Crown className="w-5 h-5 text-amber-500" />
            <span>{t.premium}</span>
          </button>

          <div className="pt-3 border-t border-[#E8DFC8]">
            <button
              onClick={() => handleNav('share-recipe')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-base font-bold text-white bg-[#E8590C] hover:bg-[#D9480F] rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{t.shareRecipe}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
